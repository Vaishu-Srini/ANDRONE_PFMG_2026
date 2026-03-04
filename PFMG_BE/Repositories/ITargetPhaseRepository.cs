using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public interface ITargetPhaseRepository
    {
        IQueryable<TargetPhase> Query();
        Task<IEnumerable<TargetPhase>> GetAllAsync();

        Task<TargetPhase> AddAsync(TargetPhase targetPhase);
        Task<TargetPhase> UpdateAsync(TargetPhase targetPhase);
        Task<TargetPhase?> GetByIdAsync(int id);
        Task DeleteAsync(int id);

        Task<IEnumerable<TargetPhase>>  SaveAllTargetPhasesAsync(IEnumerable<TargetPhase> targetPhases);

    }

    public class TargetPhaseRepository : ITargetPhaseRepository
    {
        private readonly AppDbContext _context;

        public TargetPhaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TargetPhase>> GetAllAsync()
        {
            return await _context.targetPhases.ToListAsync();
        }
        public IQueryable<TargetPhase> Query() => _context.targetPhases.AsQueryable();

        public async Task<TargetPhase> AddAsync(TargetPhase targetPhase)
        {
            _context.targetPhases.Add(targetPhase);
            await _context.SaveChangesAsync();
            return targetPhase;
        }

        public async Task<TargetPhase> UpdateAsync(TargetPhase targetPhase)
        {
            _context.targetPhases.Update(targetPhase);
            await _context.SaveChangesAsync();
            return targetPhase;
        }

        public async Task<TargetPhase?> GetByIdAsync(int id)
        {
            return await _context.targetPhases
                .FirstOrDefaultAsync(j => j.PhaseId == id);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.targetPhases.FindAsync(id);
            if (entity != null)
            {
                _context.targetPhases.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<TargetPhase>> SaveAllTargetPhasesAsync(IEnumerable<TargetPhase> targetPhases)
        {
            _context.targetPhases.AddRange(targetPhases);
            await _context.SaveChangesAsync();
            return targetPhases;
        }

   
    }
}
