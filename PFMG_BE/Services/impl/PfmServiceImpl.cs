using PFMG.DTOs;
using PFMG.Models;
using PFMG.Repositories;
using System.IO;
using System.Net.Sockets;
using System.Text;
using System.Linq;
using System.Globalization;
using PFMG.Enums;
using Microsoft.EntityFrameworkCore;
using PFMG.Data;
using PFMG.Models.StandaloneModels;
using System.IO.Compression;


namespace PFMG.Services.impl
{
    public class PfmServiceImpl : IPfmService
    {
        private readonly ILogger<PfmServiceImpl> _logger;
        private readonly IConfiguration _config;
        private readonly MissionRepository _repository;
        private readonly IMissionService _iMissionService;
        private readonly TcpCsvSender _tcpCsvSender;
        private readonly AppDbContext _context;

        private readonly WeaponRepository _weaponRepository;

        private readonly IWeaponService _iWeaponService;

        private readonly IEmitterLibraryRepository _iEmitterLibraryRepository;



        public PfmServiceImpl(
            ILogger<PfmServiceImpl> logger,
            IConfiguration config,
            MissionRepository repository,
            IMissionService missionService,
            TcpCsvSender tcpCsvSender,
            AppDbContext appDbContext,
            IWeaponService weaponService,
            WeaponRepository weaponRepository,
            IEmitterLibraryRepository emitterLibraryRepository)
        {
            _logger = logger;
            _config = config;
            _repository = repository;
            _iMissionService = missionService;
            _tcpCsvSender = tcpCsvSender;
            _context = appDbContext;
            _iWeaponService = weaponService;
            _weaponRepository = weaponRepository;
            _iEmitterLibraryRepository = emitterLibraryRepository;
        }

        // public async Task<Mission?> GetMissionTreeByIdAsync(int missionId)
        // {
        //     var mission = await _repository.Query()
        //         .Include(m => m.AreaInterests) // load AreaInterest
        //             .ThenInclude(ai => ai.AreaInterestCoordinates) // load coordinates
        //         .FirstOrDefaultAsync(m => m.MissionId == missionId);

        //     if (mission == null) return null;

        //     // Load Platforms
        //     await _context.Entry(mission)
        //         .Collection(m => m.Platforms)
        //         .LoadAsync();


        //     if (mission.AreaInterests != null)
        //     {
        //         // Load AreaInterestCoordinates (one-to-many)
        //         await _context.Entry(mission.AreaInterests)
        //             .Collection(ai => ai.AreaInterestCoordinates)
        //             .LoadAsync();

        //         await _context.Entry(mission.AreaInterests)
        //         .Collection(m => m.EmitterModeLinks)
        //         .LoadAsync();

        //     }


        //     return mission;
        // }

        public async Task<Mission?> GetMissionTreeByIdAsync(int missionId)
        {
            var mission = await _context.missions
                .AsNoTracking()
                .Where(m => m.MissionId == missionId)
                .Include(m => m.Platforms)
                .Include(m => m.AreaInterests)
                    .ThenInclude(ai => ai.AreaInterestCoordinates)
                .Include(m => m.AreaInterests)
                    .ThenInclude(ai => ai.EmitterModeLinks)
                .AsSplitQuery() // Prevents EF from creating a massive join query
                .FirstOrDefaultAsync();

            return mission;
        }


        // public async Task<(bool Success, string Message, byte[] FileContent)> GetPfmGeneration(int missionId)
        // {
        //     try
        //     {
        //         var mission = await GetMissionTreeByIdAsync(missionId);
        //         if (mission == null)
        //             return (false, "Mission not found", null);

        //         string filePath = Path.Combine(Path.GetTempPath(), $"mission_{missionId}_emitters.csv");

        //         await ExportEmittersToCsvAsync(mission, filePath);

        //         try { await _tcpCsvSender.SendCsvAsync(filePath); }
        //         catch (Exception ex) { Console.WriteLine($"TCP send failed: {ex.Message}"); }

        //         var bytes = await File.ReadAllBytesAsync(filePath);
        //         return (true, "CSV generated and sent successfully", bytes);
        //     }
        //     catch (Exception ex)
        //     {
        //         return (false, $"An error occurred: {ex.Message}", null);
        //     }
        // }

        // public async Task<string> ExportEmittersToCsvAsync(Mission mission, string filePath)
        // {
        //     var sb = new StringBuilder();

        //     // CSV Header
        //     sb.AppendLine(
        //         "Emitter ID,Symbol,FG colour,BG colour,Mode Count,Mode ID,Mode Desc,ModeSymbol," +
        //         "FG colour,BG colour,Freq Min,Freq Max,PW Min,PW Max,PRI Min,PRI Max," +
        //         "Jitter Mean,Jitter Percentage,Agility Fixed,Stagger,Jitter," +
        //         "Freq Agility,PW Agility,PRI Agility,Min Scan Rate,Max Scan Rate,Scan Modulation," +
        //         "Beam Illumination Time,Platform Type,Threat Classification," +
        //         "EIRP,Lethal Range,Technique Name,PullIn/Out,Min Range,Max Range,RateOfChangeOfRange," +
        //         "Min Velocity,Max Velocity,RateOfChangeOfVelocity,Walk Time,Hold Time,Stop Time"
        //     );

        //      // ✅ Loop through all AreaInterests
        //     foreach (var area in mission.AreaInterests)
        //     {
        //         if (area.EmitterModeLinks == null) continue;

        //         // ✅ Loop through all emitter mode links
        //         foreach (var link in area.EmitterModeLinks)
        //         {
        //             if (link.weaponStandlone == WeaponStandlone.WEAPON)
        //                 await ProcessWeaponLink(link, sb, _weaponRepository);
        //             else
        //                 await ProcessStandaloneLink(link, sb, _iEmitterLibraryRepository);
        //         }
        //     }

        //     await File.WriteAllTextAsync(filePath, sb.ToString(), Encoding.UTF8);
        //     return filePath;
        // }




        public async Task<(bool Success, string Message, byte[] FileContent, string FileName)>
         GetPfmGeneration(int missionId)
        {
            try
            {
                var mission = await GetMissionTreeByIdAsync(missionId);


                if (mission == null)
                    return (false, "Mission not found", null, null);

                // Check if ANY emitterModeLinks exist under areaInterests
                bool hasEmitters = mission.AreaInterests
                .Any(ai => ai.EmitterModeLinks != null && ai.EmitterModeLinks.Any());

                if (!hasEmitters)
                {
                    return (false, "Please add an emitter or weapon for this mission before generating PFM", null, null);
                }



                string exportDirectory = Path.GetTempPath();

                // ✅ Generate Master + AOI CSV files (areaInterestId already included)
                var (masterCsvPath, aoiCsvFiles) = await ExportEmittersToCsvAsync(mission, exportDirectory);

                // ✅ Save Master CSV into DB → AOI = null
                await SaveCsvToDatabaseAsync(masterCsvPath, missionId, null, PfmgType.MASTER);

                // ✅ Save each AOI CSV into DB
                foreach (var (filePath, areaInterestId) in aoiCsvFiles)
                {
                    await SaveCsvToDatabaseAsync(filePath, missionId, areaInterestId, PfmgType.INDIVIDUAL);
                }

                // ✅ Send via TCP
                try
                {
                    await _tcpCsvSender.SendCsvAsync(masterCsvPath);

                    foreach (var (filePath, _) in aoiCsvFiles)
                        await _tcpCsvSender.SendCsvAsync(filePath);
                }
                catch (Exception tcpEx)
                {
                    Console.WriteLine($"TCP send failed: {tcpEx.Message}");
                }

                // ✅ Create ZIP file for UI
                string zipFileName = $"mission_{missionId}_emitters.zip";
                string zipFilePath = Path.Combine(exportDirectory, zipFileName);

                if (File.Exists(zipFilePath))
                    File.Delete(zipFilePath);

                using (var zip = ZipFile.Open(zipFilePath, ZipArchiveMode.Create))
                {
                    zip.CreateEntryFromFile(masterCsvPath, Path.GetFileName(masterCsvPath));

                    foreach (var (filePath, _) in aoiCsvFiles)
                        zip.CreateEntryFromFile(filePath, Path.GetFileName(filePath));
                }

                var zipBytes = await File.ReadAllBytesAsync(zipFilePath);

                return (true, "CSV files generated, stored, and sent successfully", zipBytes, zipFileName);
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}", null, null);
            }
        }



        public async Task<(string MasterCsvPath, List<(string FilePath, int AreaInterestId)>)>
        ExportEmittersToCsvAsync(Mission mission, string baseFolderPath)
        {
            var masterCsv = new StringBuilder();
            var header =
                "Emitter ID,Symbol,Mode Count,Mode ID,Mode Desc,ModeSymbol," +
                "Freq Min,Freq Max,PW Min,PW Max,PRI Min,PRI Max," +
                "Pri Stagger Level, Pw Stagger Level, Frequency Stagger Level,"+
				"Pri Jitter Mean,Pri Jitter Percentage,Pw Jitter Mean,Pw Jitter Percentage,Frequency Jitter Mean,Frequency Jitter Percentage," +
                "Frequency Type,PW Type,PRI Type,Min Scan Rate,Max Scan Rate,Scan Modulation," +
                "Beam Illumination Time,Platform Type," +
                "EIRP,Lethal Range,Technique Name,PullIn/Out,Min Range,Max Range,RateOfChangeOfRange," +
                "Min Velocity,Max Velocity,RateOfChangeOfVelocity,Walk Time,Hold Time,Stop Time";

            masterCsv.AppendLine(header);

            List<(string FilePath, int AreaInterestId)> aoiCsvFiles = new();

            foreach (var area in mission.AreaInterests)
            {
                if (area.EmitterModeLinks == null || !area.EmitterModeLinks.Any())
                    continue;

                var aoiCsv = new StringBuilder();
                aoiCsv.AppendLine(header);

                foreach (var link in area.EmitterModeLinks)
                {
                    if (link.weaponStandlone == WeaponStandlone.WEAPON)
                    {
                        await ProcessWeaponLink(link, masterCsv, _weaponRepository);
                        await ProcessWeaponLink(link, aoiCsv, _weaponRepository);
                    }
                    else
                    {
                        await ProcessStandaloneLink(link, masterCsv, _iEmitterLibraryRepository);
                        await ProcessStandaloneLink(link, aoiCsv, _iEmitterLibraryRepository);
                    }
                }

                // ✅ Use AreaName for filename
                string aoiFileName = $"AOI_{area.AreaName}_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
                string aoiFilePath = Path.Combine(baseFolderPath, aoiFileName);

                await File.WriteAllTextAsync(aoiFilePath, aoiCsv.ToString(), Encoding.UTF8);

                // ✅ Return AreaInterestId for DB storage
                aoiCsvFiles.Add((aoiFilePath, area.AreaInterestId));
            }

            string masterFileName = $"Mission_{mission.MissionName}_Master_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            string masterFilePath = Path.Combine(baseFolderPath, masterFileName);
            await File.WriteAllTextAsync(masterFilePath, masterCsv.ToString(), Encoding.UTF8);

            return (masterFilePath, aoiCsvFiles);
        }



        // ==========================
        // Helper Methods
        // ==========================
        private static string Technique(string tech) =>
            string.IsNullOrWhiteSpace(tech) ? "" :
            tech.ToUpperInvariant() switch
            {
                "RGPO_I" => "0",
                "VGPO_I" => "1",
                "CRVPO_I" => "2",
                _ => ""
            };
        private static string GetPriType(PFMG.Enums.PriType tech)
        {
            return tech switch
            {
                PFMG.Enums.PriType.STABLE => "0",
                PFMG.Enums.PriType.STAGGER => "1",
                PFMG.Enums.PriType.JITTER => "2",
                _ => ""
            };
        }

        private static string GetPwType(PFMG.Enums.PwType tech)
        {
            return tech switch
            {
                PFMG.Enums.PwType.FIXED => "0",
				PFMG.Enums.PwType.STAGGER => "1",
				PFMG.Enums.PwType.JITTER => "2",
				_ => ""
            };
        }

        private static string GetFrequencyType(PFMG.Enums.FrequencyType tech)
        {
            return tech switch
            {
                PFMG.Enums.FrequencyType.FIXED => "0",
				PFMG.Enums.FrequencyType.STAGGER => "1",
				PFMG.Enums.FrequencyType.JITTER => "2",
				_ => ""
            };
        }




        private static float FrequencyUpdate(float value) => value * 1000;
        private static string V(bool b) => b ? "1" : "-1";
        private static string Agility(bool b) => b ? "1" : "0";
        private static string N(double? d) => d.HasValue ? d.Value.ToString(CultureInfo.InvariantCulture) : "";
        private static bool FreqAgile(dynamic mode) => mode.FrequencyType != FrequencyType.FIXED;
        private static bool PwAgile(dynamic mode) => mode.PwType != PwType.FIXED;
        private static bool PriAgile(dynamic mode) => mode.PriType != PriType.STABLE;

        // ==========================
        // Process Weapon
        // ==========================
        private async Task ProcessWeaponLink(EmitterModeLink link, StringBuilder sb, WeaponRepository repo)
        {
            var weapon = await repo.GetWeaponWithDetailsByIdAsync(link.WeaponId);
            if (weapon == null) return;

            var emitter = weapon.Emitters.FirstOrDefault(e => e.EmitterId == link.EmitterId);
            if (emitter == null) return;

            var mode = emitter.Modes.FirstOrDefault(m => m.ModeId == link.ModeId);
            if (mode == null) return;

            var jammings = mode.Jammings?.Where(j => j.JammingId == link.JammingId).ToList() ?? new List<Jamming>();
            AppendCsvRows(sb, emitter, mode, jammings);
        }

        // ==========================
        // Process Standalone
        // ==========================
        private async Task ProcessStandaloneLink(EmitterModeLink link, StringBuilder sb, IEmitterLibraryRepository repo)
        {
            var emitter = await repo.GetStandaloneEmitterWithDetailsByIdAsync(link.EmitterId);
            if (emitter == null) return;

            var mode = emitter.StandaloneModes.FirstOrDefault(m => m.StandaloneModeId == link.ModeId);
            if (mode == null) return;

            var jammings = mode.Jammings?.Where(j => j.JammingId == link.JammingId).ToList() ?? new List<StandaloneJamming>();
            AppendCsvRows(sb, emitter, mode, jammings);
        }

        // ==========================
        // Append CSV Rows (works for both)
        // ==========================
        private void AppendCsvRows(StringBuilder sb, Emitter emitter, Mode mode, List<Jamming> jammings)
        {
            var priList = mode.ModePriDetails ?? new List<ModePriDetail>();
            var firstPri = priList.FirstOrDefault();

            bool hasFixed = PriAgile(mode) == false;
            //bool isStagger = !string.IsNullOrWhiteSpace(mode.PriStaggerLevel);
            bool isStagger = (firstPri?.PriStaggerLevel) > 0;
            bool isJitter = ((firstPri?.PriJitterMean ?? 0) > 0) || ((firstPri?.PriJitterPercentage ?? 0) > 0);

            if (hasFixed)
            {
                isStagger = false;
                isJitter = false;
            }
            else
            {
                var picks = new List<(string key, bool val)>
                {
                    ("Stagger", isStagger),
                    ("Jitter", isJitter)
                };
                var first = picks.FindIndex(p => p.val);
                for (int i = 0; i < picks.Count; i++)
                    if (i != first) picks[i] = (picks[i].key, false);

                isStagger = picks[0].val;
                isJitter = picks[1].val;
            }

            if (jammings == null || !jammings.Any())
            {
                sb.AppendLine(BuildCsvLine(emitter, mode, null, firstPri, hasFixed, isStagger, isJitter));
            }
            else
            {
                foreach (var jam in jammings)
                {
                    sb.AppendLine(BuildCsvLine(emitter, mode, jam, firstPri, hasFixed, isStagger, isJitter));
                }
            }
        }

        private void AppendCsvRows(StringBuilder sb, StandaloneEmitter emitter, StandaloneMode mode, List<StandaloneJamming> jammings)
        {
            var priList = mode.ModePriDetails ?? new List<StandaloneModePriDetail>();
            var firstPri = priList.FirstOrDefault();

            bool hasFixed = PriAgile(mode) == false;
			bool isStagger = (firstPri?.PriStaggerLevel) > 0;
			bool isJitter = ((firstPri?.PriJitterMean ?? 0) > 0) || ((firstPri?.PriJitterPercentage ?? 0) > 0);

            if (hasFixed)
            {
                isStagger = false;
                isJitter = false;
            }
            else
            {
                var picks = new List<(string key, bool val)>
                {
                    ("Stagger", isStagger),
                    ("Jitter", isJitter)
                };
                var first = picks.FindIndex(p => p.val);
                for (int i = 0; i < picks.Count; i++)
                    if (i != first) picks[i] = (picks[i].key, false);

                isStagger = picks[0].val;
                isJitter = picks[1].val;
            }

            if (jammings == null || !jammings.Any())
            {
                sb.AppendLine(BuildCsv21Line(emitter, mode, null, firstPri, hasFixed, isStagger, isJitter));
            }
            else
            {
                foreach (var jam in jammings)
                {
                    sb.AppendLine(BuildCsv21Line(emitter, mode, jam, firstPri, hasFixed, isStagger, isJitter));
                }
            }
        }



        // ==========================
        // Build CSV Line
        // ==========================
        private string BuildCsvLine(Emitter emitter, Mode mode, Jamming jam, ModePriDetail firstPri, bool hasFixed, bool isStagger, bool isJitter)
        {
            return string.Join(",",
                emitter.EmitterName,
                emitter.Symbol,
                //emitter.ForegroundColor,
                //emitter.BackgroundColor,
                "0",
                mode.ModeName,
                mode.Description,
                mode.ModeSymbol,
                //mode.FgColor,
                //mode.BgColor,
                FrequencyUpdate(mode.ModeFrequencyDetails?.FirstOrDefault()?.MinFrequency ?? 0),
                FrequencyUpdate(mode.ModeFrequencyDetails?.FirstOrDefault()?.MaxFrequency ?? 0),
                mode.ModePwDetails?.FirstOrDefault()?.MinPw ?? 0,
                mode.ModePwDetails?.FirstOrDefault()?.MaxPw ?? 0,
                mode.ModePriDetails?.FirstOrDefault()?.MinPri ?? 0,
                mode.ModePriDetails?.FirstOrDefault()?.MaxPri ?? 0,
                mode.ModePriDetails?.FirstOrDefault()?.PriStaggerLevel ?? 0,
				mode.ModePwDetails?.FirstOrDefault()?.PwStaggerLevel ?? 0,
				mode.ModeFrequencyDetails?.FirstOrDefault()?.FrequencyStaggerLevel ?? 0,
				N(firstPri?.PriJitterMean),
                N(firstPri?.PriJitterPercentage),
                mode.ModePwDetails?.FirstOrDefault()?.PwJitterMean ?? 0,
                mode.ModePwDetails?.FirstOrDefault()?.PwJitterPercentage ?? 0,
                mode.ModeFrequencyDetails?.FirstOrDefault()?.FrequencyJitterMean ?? 0,
                mode.ModeFrequencyDetails?.FirstOrDefault()?.FrequencyJitterPercentage ?? 0,
                GetFrequencyType(mode.FrequencyType),
                GetPwType(mode.PwType),
                GetPriType(mode.PriType),
                mode.ModeScanDetails?.FirstOrDefault()?.MinScanRate ?? 0,
                mode.ModeScanDetails?.FirstOrDefault()?.MaxScanRate ?? 0,
                mode.ModeScanDetails?.FirstOrDefault()?.ScanType,
                mode.ModeScanDetails?.FirstOrDefault()?.NominalScanRate ?? 0,
                mode.PlatformType,
                //mode.ThreatType,
                mode.EirpValue,
                mode.LethalRange
                // jam != null ? Technique(jam.TechniqueType.ToString()) : "",
                // jam == null ? "-1" : (jam.PullInOut ? "1" : "0"),
                // jam?.MinRange ?? 0,
                // jam?.MaxRange ?? 0,
                // jam?.RateOfChangeOfRange ?? 0,
                // jam?.MinVelocity ?? 0,
                // jam?.MaxVelocity ?? 0,
                // jam?.RateOfChangeOfVelocity ?? 0,
                // jam?.WalkTime ?? "",
                // jam?.HoldTime ?? "",
                // jam?.StopTime ?? ""
            );
        }



        private string BuildCsv21Line(StandaloneEmitter emitter, StandaloneMode mode, StandaloneJamming jam, dynamic firstPri, bool hasFixed, bool isStagger, bool isJitter)
        {
            return string.Join(",",
                emitter.EmitterName,
                emitter.Symbol,
                //emitter.ForegroundColor,
                //emitter.BackgroundColor,
                "0",
                mode.ModeName,
                mode.Description,
                mode.ModeSymbol,
				//mode.FgColor,
				//mode.BgColor,
				FrequencyUpdate(mode.ModeFrequencyDetails?.FirstOrDefault()?.MinFrequency ?? 0),
				FrequencyUpdate(mode.ModeFrequencyDetails?.FirstOrDefault()?.MaxFrequency ?? 0),
				mode.ModePwDetails?.FirstOrDefault()?.MinPw ?? 0,
				mode.ModePwDetails?.FirstOrDefault()?.MaxPw ?? 0,
				mode.ModePriDetails?.FirstOrDefault()?.MinPri ?? 0,
				mode.ModePriDetails?.FirstOrDefault()?.MaxPri ?? 0,
				mode.ModePriDetails?.FirstOrDefault()?.PriStaggerLevel ?? 0,
				mode.ModePwDetails?.FirstOrDefault()?.PwStaggerLevel ?? 0,
				mode.ModeFrequencyDetails?.FirstOrDefault()?.FrequencyStaggerLevel ?? 0,
				N(firstPri?.PriJitterMean),
				N(firstPri?.PriJitterPercentage),
				mode.ModePwDetails?.FirstOrDefault()?.PwJitterMean ?? 0,
				mode.ModePwDetails?.FirstOrDefault()?.PwJitterPercentage ?? 0,
				mode.ModeFrequencyDetails?.FirstOrDefault()?.FrequencyJitterMean ?? 0,
				mode.ModeFrequencyDetails?.FirstOrDefault()?.FrequencyJitterPercentage ?? 0,
				GetFrequencyType(mode.FrequencyType),
				GetPwType(mode.PwType),
				GetPriType(mode.PriType),
				mode.ModeScanDetails?.FirstOrDefault()?.MinScanRate ?? 0,
                mode.ModeScanDetails?.FirstOrDefault()?.MaxScanRate ?? 0,
                mode.ModeScanDetails?.FirstOrDefault()?.ScanType,
                mode.ModeScanDetails?.FirstOrDefault()?.NominalScanRate ?? 0,
                mode.PlatformType,
                //mode.ThreatType,
                mode.EirpValue,
                mode.LethalRange
                // jam != null ? Technique(jam.TechniqueType.ToString()) : "",
                // jam == null ? "-1" : (jam.PullInOut ? "1" : "0"),
                // jam?.MinRange ?? 0,
                // jam?.MaxRange ?? 0,
                // jam?.RateOfChangeOfRange ?? 0,
                // jam?.MinVelocity ?? 0,
                // jam?.MaxVelocity ?? 0,
                // jam?.RateOfChangeOfVelocity ?? 0,
                // jam?.WalkTime ?? "",
                // jam?.HoldTime ?? "",
                // jam?.StopTime ?? ""
            );
        }

        private async Task SaveCsvToDatabaseAsync(string filePath, int missionId, int? areaInterestId, PfmgType pfmgType)
        {
            var fileBytes = await File.ReadAllBytesAsync(filePath);

            var entity = new PfmgFileStorage
            {
                FileName = Path.GetFileName(filePath),
                FileType = "text/csv",
                FileData = fileBytes,
                missionId = missionId,
                areaInterestId = areaInterestId ?? 0,
                pfmgType = pfmgType,
                UploadedOn = DateTime.UtcNow
            };

            _context.pfmgFileStorages.Add(entity);
            await _context.SaveChangesAsync();
        }





        // +++++++++++++++++



    }

}

