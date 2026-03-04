using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models;
using Microsoft.EntityFrameworkCore;

namespace PFMG.Repositories
{
    public interface IStandaloneModeRepository
    {
        IQueryable<StandaloneMode> Query();
        Task<StandaloneMode?> GetByIdAsync(int id);
        Task<StandaloneMode?> GetByNameAsync(string name);
        Task<StandaloneMode> AddAsync(StandaloneMode mode);
        Task<StandaloneMode> UpdateAsync(StandaloneMode mode);

        // Task<ModeDf> AddModeDfAsync(ModeDf modeDf);
        // Task<ModeDf> UpdateModeDfAsync(ModeDf modeDf);
        Task DeleteAsync(StandaloneMode mode);

        Task<bool> ExistsAsync(int modeId, string name);
    }

    public class StandaloneModeRepository : IStandaloneModeRepository
    {
        private readonly AppDbContext _context;

        public StandaloneModeRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<StandaloneMode> Query() => _context.standaloneModes.AsQueryable();

        public async Task<StandaloneMode?> GetByIdAsync(int id) =>
            await _context.standaloneModes
                //.Include(m => m.ModeDfs)
                .Include(m => m.ModeFrequencyDetails)
                .Include(m => m.ModePriDetails)
                .Include(m => m.ModeScanDetails)
                //.Include(m => m.ModeLssDetails)
                //.Include(m => m.ModePriStaggerLevels)
                //.Include(m => m.ModePriPwRanges)
                //.Include(m => m.ModeFrequencyRanges)
                //.Include(m => m.ModePriRanges)
                .Include(m => m.ModePwDetails)
                .FirstOrDefaultAsync(m => m.StandaloneModeId == id);

        public async Task<StandaloneMode?> GetByNameAsync(string name) =>
            await _context.standaloneModes.FirstOrDefaultAsync(m => m.ModeName == name);

        public async Task<StandaloneMode> AddAsync(StandaloneMode mode)
        {
            _context.standaloneModes.Add(mode);
            await _context.SaveChangesAsync();
            return mode;
        }

        public async Task<StandaloneMode> UpdateAsync(StandaloneMode mode)
        {
            _context.standaloneModes.Update(mode);
            await _context.SaveChangesAsync();
            return mode;
        }

        public async Task DeleteAsync(StandaloneMode mode)
        {
            _context.standaloneModes.Remove(mode);
            await _context.SaveChangesAsync();
        }

        //  public async Task<ModeDf> AddModeDfAsync(ModeDf modeDf)
        // {
        //     _context.modeDfs.Add(modeDf);
        //     await _context.SaveChangesAsync();
        //     return modeDf;
        // }

        // public async Task<ModeDf> UpdateModeDfAsync(ModeDf modeDf)
        // {
        //     _context.modeDfs.Update(modeDf);
        //     await _context.SaveChangesAsync();
        //     return modeDf;
        // }

        public async Task<bool> ExistsAsync(int modeId, string name)
        {
            return await _context.standaloneModes.AnyAsync(m => m.StandaloneModeId == modeId && m.ModeName == name);
        }
    }
}
