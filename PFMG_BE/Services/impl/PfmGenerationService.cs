using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PFMG.Data;
using PFMG.Enums;
using PFMG.Models;
using PFMG.Models.StandaloneModels;
using PFMG.Repositories;

public class PfmGenerationService
{
    private readonly AppDbContext _context;
    private readonly TcpCsvSender _tcpCsvSender;
    private readonly WeaponRepository _weaponRepository;
    private readonly IEmitterLibraryRepository _iEmitterLibraryRepository;

    // 32-byte AES key from config
    private readonly byte[] _pfmKey32;

    public PfmGenerationService(
        AppDbContext context,
        TcpCsvSender tcpCsvSender,
        WeaponRepository weaponRepository,
        IEmitterLibraryRepository iEmitterLibraryRepository,
        IConfiguration config)
    {
        _context = context;
        _tcpCsvSender = tcpCsvSender;
        _weaponRepository = weaponRepository;
        _iEmitterLibraryRepository = iEmitterLibraryRepository;

        // Read AES key from config

        var b64 = config["PfmEncryptionKeyBase64"];
        // var b64 = "cGF2YW4=";
        if (string.IsNullOrWhiteSpace(b64))
            throw new InvalidOperationException("Missing PfmEncryptionKeyBase64 in appsettings.json.");

        b64 = b64.Trim();

        byte[] decoded;
        try
        {
            decoded = Convert.FromBase64String(b64);
        }
        catch (FormatException)
        {
            throw new InvalidOperationException(
                "PfmEncryptionKeyBase64 is not valid Base64. Paste only the raw Base64 text (no spaces, no 'key=' prefix).");
        }

        if (decoded.Length != 32)
            throw new InvalidOperationException($"PfmEncryptionKeyBase64 must decode to 32 bytes, but got {decoded.Length} bytes.");

        _pfmKey32 = decoded;
    }
    
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

    // AAD builder (MUST be same for decrypt)
    private static byte[] BuildAad(int missionId, int areaInterestId, string kind)
        => Encoding.UTF8.GetBytes($"PFMCSVv1|{kind}|mission:{missionId}|aoi:{areaInterestId}");

    public async Task<(bool Success, string Message, byte[] FileContent, string FileName)> GetPfmGeneration(int missionId)
    {
        try
        {
            var mission = await GetMissionTreeByIdAsync(missionId);

            if (mission == null)
                return (false, "Mission not found", null, null);

            bool hasEmitters = mission.AreaInterests
                .Any(ai => ai.EmitterModeLinks != null && ai.EmitterModeLinks.Any());

            if (!hasEmitters)
                return (false, "Please add an emitter or weapon for this mission before generating PFM", null, null);

            string exportDirectory = Path.GetTempPath();

            var (masterCsvPath, aoiCsvFiles) = await ExportEmittersToCsvAsync(mission, exportDirectory, missionId);

            await SaveCsvToDatabaseAsync(masterCsvPath, missionId, null, PfmgType.MASTER);

            foreach (var (filePath, areaInterestId) in aoiCsvFiles)
                await SaveCsvToDatabaseAsync(filePath, missionId, areaInterestId, PfmgType.INDIVIDUAL);

            try
            {
                await _tcpCsvSender.SendCsvWithoutEncryptionAsync(masterCsvPath);

                foreach (var (filePath, _) in aoiCsvFiles)
                    await _tcpCsvSender.SendCsvWithoutEncryptionAsync(filePath);
            }
            catch (Exception tcpEx)
            {
                Console.WriteLine($"TCP send failed: {tcpEx.Message}");
            }

            string zipFileName = $"mission_{missionId}_emitters_encrypted_csv.zip";
            Console.WriteLine(zipFileName);
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

            return (true, "Encrypted CSV files generated, stored, and sent successfully", zipBytes, zipFileName);
        }
        catch (Exception ex)
        {
            return (false, $"An error occurred: {ex.Message}", null, null);
        }
    }

    public async Task<(string MasterCsvPath, List<(string FilePath, int AreaInterestId)>)>
        ExportEmittersToCsvAsync(Mission mission, string baseFolderPath, int missionId)
    {
        var masterCsv = new StringBuilder();

        var header =
            "Emitter ID,Symbol,Mode Count,Mode ID,Mode Desc,ModeSymbol," +
            "Freq Min,Freq Max,PW Min,PW Max,PRI Min,PRI Max," +
            "Pri Stagger Level, Pw Stagger Level, Frequency Stagger Level," +
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

            byte[] aoiAad = BuildAad(missionId, area.AreaInterestId, "AOI");
            string encryptedAoiCsv = Aes256CsvEncryptor.EncryptCsvKeepHeader(aoiCsv.ToString(), _pfmKey32, aoiAad);

            string aoiFileName = $"AOI_{area.AreaName}_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            string aoiFilePath = Path.Combine(baseFolderPath, aoiFileName);

            await File.WriteAllTextAsync(aoiFilePath, encryptedAoiCsv, Encoding.UTF8);

            aoiCsvFiles.Add((aoiFilePath, area.AreaInterestId));
        }

        byte[] masterAad = BuildAad(missionId, 0, "MASTER");
        string encryptedMasterCsv = Aes256CsvEncryptor.EncryptCsvKeepHeader(masterCsv.ToString(), _pfmKey32, masterAad);

        string masterFileName = $"Mission_{mission.MissionName}_Master_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
        string masterFilePath = Path.Combine(baseFolderPath, masterFileName);

        await File.WriteAllTextAsync(masterFilePath, encryptedMasterCsv, Encoding.UTF8);

        return (masterFilePath, aoiCsvFiles);
    }

    private async Task SaveCsvToDatabaseAsync(string filePath, int missionId, int? areaInterestId, PfmgType pfmgType)
    {
        // This now reads ENCRYPTED CSV bytes
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

    private static string Technique(string tech) =>
        string.IsNullOrWhiteSpace(tech) ? "" :
        tech.ToUpperInvariant() switch
        {
            "RGPO_I" => "0",
            "VGPO_I" => "1",
            "CRVPO_I" => "2",
            _ => ""
        };

    private static string GetPriType(PFMG.Enums.PriType tech) => tech switch
    {
        PFMG.Enums.PriType.STABLE => "0",
        PFMG.Enums.PriType.STAGGER => "1",
        PFMG.Enums.PriType.JITTER => "2",
        _ => ""
    };

    private static string GetPwType(PFMG.Enums.PwType tech) => tech switch
    {
        PFMG.Enums.PwType.FIXED => "0",
        PFMG.Enums.PwType.STAGGER => "1",
        PFMG.Enums.PwType.JITTER => "2",
        _ => ""
    };

    private static string GetFrequencyType(PFMG.Enums.FrequencyType tech) => tech switch
    {
        PFMG.Enums.FrequencyType.FIXED => "0",
        PFMG.Enums.FrequencyType.STAGGER => "1",
        PFMG.Enums.FrequencyType.JITTER => "2",
        _ => ""
    };

    private static float FrequencyUpdate(float value) => value * 1000;
    private static string N(double? d) => d.HasValue ? d.Value.ToString(CultureInfo.InvariantCulture) : "";
    private static bool PriAgile(dynamic mode) => mode.PriType != PriType.STABLE;

    // ==========================
    // Process Weapon / Standalone (your code, unchanged)
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

    private async Task ProcessStandaloneLink(EmitterModeLink link, StringBuilder sb, IEmitterLibraryRepository repo)
    {
        var emitter = await repo.GetStandaloneEmitterWithDetailsByIdAsync(link.EmitterId);
        if (emitter == null) return;

        var mode = emitter.StandaloneModes.FirstOrDefault(m => m.StandaloneModeId == link.ModeId);
        if (mode == null) return;

        var jammings = mode.Jammings?.Where(j => j.JammingId == link.JammingId).ToList() ?? new List<StandaloneJamming>();
        AppendCsvRows(sb, emitter, mode, jammings);
    }

    private void AppendCsvRows(StringBuilder sb, Emitter emitter, Mode mode, List<Jamming> jammings)
    {
        var priList = mode.ModePriDetails ?? new List<ModePriDetail>();
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
            sb.AppendLine(BuildCsvLine(emitter, mode, null, firstPri, hasFixed, isStagger, isJitter));
        }
        else
        {
            foreach (var jam in jammings)
                sb.AppendLine(BuildCsvLine(emitter, mode, jam, firstPri, hasFixed, isStagger, isJitter));
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
                sb.AppendLine(BuildCsv21Line(emitter, mode, jam, firstPri, hasFixed, isStagger, isJitter));
        }
    }

    private string BuildCsvLine(Emitter emitter, Mode mode, Jamming jam, ModePriDetail firstPri, bool hasFixed, bool isStagger, bool isJitter)
    {
        return string.Join(",",
            emitter.EmitterName,
            emitter.Symbol,
            "0",
            mode.ModeName,
            mode.Description,
            mode.ModeSymbol,
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
            "0",
            mode.ModeName,
            mode.Description,
            mode.ModeSymbol,
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

    // ==========================
    // YOU ALREADY HAVE THIS
    // // ==========================
    // private Task<Mission> GetMissionTreeByIdAsync(int missionId)
    // {
    //     throw new NotImplementedException();
    // }
}
