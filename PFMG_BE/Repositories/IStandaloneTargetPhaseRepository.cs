using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public interface IStandaloneTargetPhaseRepository
    {
        IQueryable<StandaloneTargetPhase> Query();
        Task<IEnumerable<StandaloneTargetPhase>> GetAllAsync();

        Task<StandaloneTargetPhase> AddAsync(StandaloneTargetPhase targetPhase);
        Task<StandaloneTargetPhase> UpdateAsync(StandaloneTargetPhase targetPhase);
        Task<StandaloneTargetPhase?> GetByIdAsync(int id);
        Task DeleteAsync(int id);

        Task<IEnumerable<StandaloneTargetPhase>>  SaveAllTargetPhasesAsync(IEnumerable<StandaloneTargetPhase> targetPhases);

    }

    public class StandaloneTargetPhaseRepository : IStandaloneTargetPhaseRepository
    {
        private readonly AppDbContext _context;

        public StandaloneTargetPhaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StandaloneTargetPhase>> GetAllAsync()
        {
            return await _context.StandaloneTargetPhases.ToListAsync();
        }
        public IQueryable<StandaloneTargetPhase> Query() => _context.StandaloneTargetPhases.AsQueryable();

        public async Task<StandaloneTargetPhase> AddAsync(StandaloneTargetPhase targetPhase)
        {
            _context.StandaloneTargetPhases.Add(targetPhase);
            await _context.SaveChangesAsync();
            return targetPhase;
        }

        public async Task<StandaloneTargetPhase> UpdateAsync(StandaloneTargetPhase targetPhase)
        {
            _context.StandaloneTargetPhases.Update(targetPhase);
            await _context.SaveChangesAsync();
            return targetPhase;
        }

        public async Task<StandaloneTargetPhase?> GetByIdAsync(int id)
        {
            return await _context.StandaloneTargetPhases
                .FirstOrDefaultAsync(j => j.PhaseId == id);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.StandaloneTargetPhases.FindAsync(id);
            if (entity != null)
            {
                _context.StandaloneTargetPhases.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<StandaloneTargetPhase>> SaveAllTargetPhasesAsync(IEnumerable<StandaloneTargetPhase> targetPhases)
        {
            _context.StandaloneTargetPhases.AddRange(targetPhases);
            await _context.SaveChangesAsync();
            return targetPhases;
        }

   
    }
}
