using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public interface IIndependentTargetPhaseRepository
    {
        IQueryable<IndependentTargetPhase> Query();
        Task<IEnumerable<IndependentTargetPhase>> GetAllAsync();

        Task<IndependentTargetPhase> AddAsync(IndependentTargetPhase targetPhase);
        Task<IndependentTargetPhase> UpdateAsync(IndependentTargetPhase targetPhase);
        Task<IndependentTargetPhase?> GetByIdAsync(int id);
        Task DeleteAsync(int id);

        Task<IEnumerable<IndependentTargetPhase>>  SaveAllTargetPhasesAsync(IEnumerable<IndependentTargetPhase> targetPhases);

    }

    public class IndependentTargetPhaseRepository : IIndependentTargetPhaseRepository
    {
        private readonly AppDbContext _context;

        public IndependentTargetPhaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IndependentTargetPhase>> GetAllAsync()
        {
            return await _context.independentTargetPhases.ToListAsync();
        }
        public IQueryable<IndependentTargetPhase> Query() => _context.independentTargetPhases.AsQueryable();

        public async Task<IndependentTargetPhase> AddAsync(IndependentTargetPhase targetPhase)
        {
            _context.independentTargetPhases.Add(targetPhase);
            await _context.SaveChangesAsync();
            return targetPhase;
        }

        public async Task<IndependentTargetPhase> UpdateAsync(IndependentTargetPhase targetPhase)
        {
            _context.independentTargetPhases.Update(targetPhase);
            await _context.SaveChangesAsync();
            return targetPhase;
        }

        public async Task<IndependentTargetPhase?> GetByIdAsync(int id)
        {
            return await _context.independentTargetPhases
                .FirstOrDefaultAsync(j => j.PhaseId == id);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.independentTargetPhases.FindAsync(id);
            if (entity != null)
            {
                _context.independentTargetPhases.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<IndependentTargetPhase>> SaveAllTargetPhasesAsync(IEnumerable<IndependentTargetPhase> targetPhases)
        {
            _context.independentTargetPhases.AddRange(targetPhases);
            await _context.SaveChangesAsync();
            return targetPhases;
        }

   
    }
}
