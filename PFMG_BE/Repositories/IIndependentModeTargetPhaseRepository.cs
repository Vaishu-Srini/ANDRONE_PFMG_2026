using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public interface IIndependentModeTargetPhaseRepository
    {
        IQueryable<IndependentModeTargetPhase> Query();
        Task<IEnumerable<IndependentModeTargetPhase>> GetAllAsync();

        Task<IndependentModeTargetPhase> AddAsync(IndependentModeTargetPhase targetPhase);
        Task<IndependentModeTargetPhase> UpdateAsync(IndependentModeTargetPhase targetPhase);
        Task<IndependentModeTargetPhase?> GetByIdAsync(int id);
        Task DeleteAsync(int id);

        Task<IEnumerable<IndependentModeTargetPhase>>  SaveAllTargetPhasesAsync(IEnumerable<IndependentModeTargetPhase> targetPhases);

    }

    public class IndependentModeTargetPhaseRepository : IIndependentModeTargetPhaseRepository
    {
        private readonly AppDbContext _context;

        public IndependentModeTargetPhaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IndependentModeTargetPhase>> GetAllAsync()
        {
            return await _context.independentModeTargetPhases.ToListAsync();
        }
        public IQueryable<IndependentModeTargetPhase> Query() => _context.independentModeTargetPhases.AsQueryable();

        public async Task<IndependentModeTargetPhase> AddAsync(IndependentModeTargetPhase targetPhase)
        {
            _context.independentModeTargetPhases.Add(targetPhase);
            await _context.SaveChangesAsync();
            return targetPhase;
        }

        public async Task<IndependentModeTargetPhase> UpdateAsync(IndependentModeTargetPhase targetPhase)
        {
            _context.independentModeTargetPhases.Update(targetPhase);
            await _context.SaveChangesAsync();
            return targetPhase;
        }

        public async Task<IndependentModeTargetPhase?> GetByIdAsync(int id)
        {
            return await _context.independentModeTargetPhases
                .FirstOrDefaultAsync(j => j.PhaseId == id);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.independentModeTargetPhases.FindAsync(id);
            if (entity != null)
            {
                _context.independentModeTargetPhases.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<IndependentModeTargetPhase>> SaveAllTargetPhasesAsync(IEnumerable<IndependentModeTargetPhase> targetPhases)
        {
            _context.independentModeTargetPhases.AddRange(targetPhases);
            await _context.SaveChangesAsync();
            return targetPhases;
        }

   
    }
}
