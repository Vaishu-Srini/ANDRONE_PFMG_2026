using PFMG.Data;
using PFMG.Models;
using PFMG.Models.StandaloneModels;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace PFMG.Repositories
{
    public interface IIndependentModeRepository
    {
        IQueryable<IndependentMode> Query();
        Task<IndependentMode?> GetByIdAsync(int id);
        Task<IndependentMode?> GetByNameAsync(string name);
        Task<IndependentMode> AddAsync(IndependentMode mode);
        Task<IndependentMode> UpdateAsync(IndependentMode mode);

        // Task<ModeDf> AddModeDfAsync(ModeDf modeDf);
        // Task<ModeDf> UpdateModeDfAsync(ModeDf modeDf);
        Task DeleteAsync(IndependentMode mode);
    }
    public class IndependentModeRepository: IIndependentModeRepository
    {
        private readonly AppDbContext _context;

        public IndependentModeRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<IndependentMode> Query() => _context.independentMode.AsQueryable();

        public async Task<IndependentMode?> GetByIdAsync(int id) =>
            await _context.independentMode
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
                .FirstOrDefaultAsync(m => m.IndependentModeId == id);

        public async Task<IndependentMode?> GetByNameAsync(string name) =>
            await _context.independentMode.FirstOrDefaultAsync(m => m.ModeName == name);

        public async Task<IndependentMode> AddAsync(IndependentMode mode)
        {
            _context.independentMode.Add(mode);
            await _context.SaveChangesAsync();
            return mode;
        }

        public async Task<IndependentMode> UpdateAsync(IndependentMode mode)
        {
            _context.independentMode.Update(mode);
            await _context.SaveChangesAsync();
            return mode;
        }

        public async Task DeleteAsync(IndependentMode mode)
        {
            _context.independentMode.Remove(mode);
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
    }
}

    






