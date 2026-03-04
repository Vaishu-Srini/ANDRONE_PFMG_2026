using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public class MissionRepository
    {
        private readonly AppDbContext _context;

        public MissionRepository(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Expose IQueryable
        public IQueryable<Mission> Query()
        {
            return _context.missions.AsQueryable();
        }

        public async Task<Mission> AddPlatformAsync(Mission platform)
        {
            _context.missions.Add(platform);
            await _context.SaveChangesAsync();
            return platform;
        }

        // public async Task<List<PfmDto>> GetPfmDataByMissionIdAsync(int missionId)
        // {
        //     // Fetch mission including platforms, emitters, and modes
        //     var mission = await _context.missions
        //         .Include(m => m.Platforms)
        //             .ThenInclude(p => p.Emitters)
        //                 .ThenInclude(e => e.Modes)
        //         .FirstOrDefaultAsync(m => m.MissionId == missionId);

        //     if (mission == null || mission.Platforms == null)
        //         return new List<PfmDto>();

        //     // Flatten platforms → emitters → build PfmDto
        //     var pfmList = mission.Platforms
        //         .SelectMany(platform => platform.Emitters, (platform, emitter) => new { platform, emitter })
        //         .Select(x => new PfmDto
        //         {
        //             EmitterId = x.emitter.EmitterName,
        //             modes = x.emitter.Modes.Select(mode => new PfmModeDto
        //             {
        //                 ModeId = mode.ModeName,
        //                 ModeType = mode.ModeType.ToString(),
        //                 ModeSymbol = mode.SymbolCodeType.ToString(),
        //                 ForegroundColor = mode.FgColor,
        //                 BackgroundColor = mode.BgColor,
        //                 ModeCount = mode.BgColor.ToString(),
        //                 ModeMinfrequency = string.Join(",", mode.ModeFrequencyDetails.Select(o => o.MinFrequency.ToString())),
        //                 ModeMaxfrequency = string.Join(",", mode.ModeFrequencyDetails.Select(o => o.MaxFrequency.ToString())),
        //                 MinPw =  string.Join(",", mode.ModePwDetails.Select(o => o.MinPw.ToString())),
        //                 MaxPw = string.Join(",", mode.ModePwDetails.Select(o => o.MaxPw.ToString())),
        //                 MinPri = string.Join(",", mode.ModePriDetails.Select(o => o.MinPri.ToString())),
        //                 MaxPri = string.Join(",", mode.ModePriDetails.Select(o => o.MaxPri.ToString())),
        //                 JitterPriMin = string.Join(",", mode.ModePriDetails.Select(o => o.PriJitterMean.ToString())),
        //                 JitterPriMax = string.Join(",", mode.ModePriDetails.Select(o => o.PriJitterPercentage.ToString())),
        //                 PwType = string.Join(",", mode.ModePwDetails.Select(o => o.PwType.ToString())),
        //                 PriType = string.Join(",", mode.ModePriDetails.Select(o => o.PriType.ToString())),
        //                 FrequencyAgility = string.Join(",", mode.ModeFrequencyDetails.Select(o => o.FrequencyType.ToString())),
        //                 PwAgility = string.Join(",", mode.ModePwDetails.Select(o => o.PwType.ToString())),
        //                 MinScanRate = mode.MinScanRate.ToString(),
        //                 MaxScanRate = mode.MaxScanRate.ToString(),
        //                 ScanModulation = mode.ScanModulation,
        //                 PlatformType = x.platform.PlatformType, // platform property
        //                 TreatClassification = x.emitter.TreatClassification,
        //                 WarningSensitivity = x.emitter.WarningSensitivity,
        //                 AgeIn = x.emitter.AgeIn.ToString(),
        //                 AgeOut = x.emitter.AgeOut.ToString(),
        //                 Eirp = x.emitter.Eirp.ToString(),
        //                 LethalRange = x.emitter.LethalRange.ToString(),
        //                 AmpCount = x.emitter.AmpCount.ToString(),
        //                 Range = x.emitter.Range.ToString(),
        //                 PullInOut = x.emitter.PullInOut.ToString().ToUpper()
        //             }).ToList()
        //         }).ToList();

        //     return pfmList;
        // }


        public async Task<Mission?> GetMissionByIdAsync(int id)
        {
            return await _context.missions.FindAsync(id);
        }

        public async Task<Mission?> GetMissionByNameAsync(string name)
        {
            return await _context.missions.FirstOrDefaultAsync(p => p.MissionName == name);
        }

        public async Task<IEnumerable<Mission>> GetAllMissionsAsync()
        {
            return await _context.missions.OrderByDescending(m => m.ModifiedDate).ToListAsync();
        }

        public async Task UpdateMissionAsync(Mission platform)
        {
            _context.missions.Update(platform);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMissionAsync(Mission platform)
        {
            _context.missions.Remove(platform);
            await _context.SaveChangesAsync();
        }
    }
}
