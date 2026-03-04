using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models;
using Microsoft.EntityFrameworkCore;

namespace PFMG.Repositories
{
    public interface IModeRepository
    {
        IQueryable<Mode> Query();
        Task<Mode?> GetByIdAsync(int id);
        Task<Mode?> GetByNameAsync(string name);
        Task<Mode> AddAsync(Mode mode);
        Task<Mode> UpdateAsync(Mode mode);
        Task<float?> GetLatestFrequencyByEmitterIdAsync(int emitterId, CancellationToken ct = default);

        // Task<ModeDf> AddModeDfAsync(ModeDf modeDf);
        // Task<ModeDf> UpdateModeDfAsync(ModeDf modeDf);
        Task DeleteAsync(Mode mode);

        Task<bool> ExistsAsync(int modeId, string name);
    }

    public class ModeRepository : IModeRepository
    {
        private readonly AppDbContext _context;

        public ModeRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Mode> Query() => _context.modes.AsQueryable();

        public async Task<Mode?> GetByIdAsync(int id) =>
            await _context.modes
                .Include(m => m.ModeFrequencyDetails)
                .Include(m => m.ModePriDetails)
                .Include(m => m.ModeScanDetails)
                //.Include(m => m.ModeLssDetails)
                //.Include(m => m.ModePriStaggerLevels)
                //.Include(m => m.ModePriPwRanges)
                //.Include(m => m.ModeFrequencyRanges)
                //.Include(m => m.ModePriRanges)
                .Include(m => m.ModePwDetails)
                .FirstOrDefaultAsync(m => m.ModeId == id);

        public async Task<Mode?> GetByNameAsync(string name) =>
            await _context.modes.FirstOrDefaultAsync(m => m.ModeName == name);

        public async Task<Mode> AddAsync(Mode mode)
        {
            _context.modes.Add(mode);
            await _context.SaveChangesAsync();
            return mode;
        }

        public async Task<Mode> UpdateAsync(Mode mode)
        {
            _context.modes.Update(mode);
            await _context.SaveChangesAsync();
            return mode;
        }

        public async Task DeleteAsync(Mode mode)
        {
            _context.modes.Remove(mode);
            await _context.SaveChangesAsync();
        }

        public async Task<float?> GetLatestFrequencyByEmitterIdAsync(int emitterId, CancellationToken ct = default)
        {
            var latestModeWithId = await _context.modes
                .AsNoTracking()
                .Where(m => m.EmitterId == emitterId)
                .OrderByDescending(m => m.ModifiedDate)
                .Select(m => m.ModeId)
                .FirstOrDefaultAsync(ct);

            if (latestModeWithId == 0) return null;


            return await _context.modeFrequencyDetails
                .AsNoTracking()
                .Where(fd => fd.ModeId == latestModeWithId)
                .Select(fd => (float?)fd.MaxFrequency)
                .FirstOrDefaultAsync(ct);
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
            return await _context.modes.AnyAsync(m => m.ModeId == modeId && m.ModeName == name);
        }

    }
}
