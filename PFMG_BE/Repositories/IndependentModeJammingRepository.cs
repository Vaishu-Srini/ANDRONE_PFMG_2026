using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models.StandaloneModels;
using PFMG.Data;

namespace PFMG.Repositories
{

    public interface IIndependentModeJammingRepository
    {
        IQueryable<IndependentModeJamming> Query();

        Task<IEnumerable<IndependentModeJamming>> GetAllAsync();

        Task<IndependentModeJamming> AddAsync(IndependentModeJamming jamming);
        Task<IndependentModeJamming> UpdateAsync(IndependentModeJamming jamming);
        Task<IndependentModeJamming?> GetByIdAsync(int id);
        Task DeleteAsync(int id);
    }

    public class IndependentModeJammingRepository: IIndependentModeJammingRepository
    {
        private readonly AppDbContext _context;

        public IndependentModeJammingRepository(AppDbContext context)
        {
            _context = context;
        }
        public IQueryable<IndependentModeJamming> Query() => _context.independentModeJamming.AsQueryable();

        public async Task<IEnumerable<IndependentModeJamming>> GetAllAsync()
        {
            return await _context.independentModeJamming.Include(j => j.IndependentModeTargetPhases).ToListAsync();
        }

        public async Task<IndependentModeJamming> AddAsync(IndependentModeJamming jamming)
        {
            _context.independentModeJamming.Add(jamming);
            await _context.SaveChangesAsync();
            return jamming;
        }

        public async Task<IndependentModeJamming> UpdateAsync(IndependentModeJamming jamming)
        {
            _context.independentModeJamming.Update(jamming);
            await _context.SaveChangesAsync();
            return jamming;
        }

        public async Task<IndependentModeJamming?> GetByIdAsync(int id)
        {
            return await _context.independentModeJamming
                .FirstOrDefaultAsync(j => j.JammingId == id);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.independentModeJamming.FindAsync(id);
            if (entity != null)
            {
                _context.independentModeJamming.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
