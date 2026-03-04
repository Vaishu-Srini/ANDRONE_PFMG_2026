using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models.StandaloneModels;
using PFMG.Data;

namespace PFMG.Repositories
{

    public interface    IIndependentJammingRepository
    {
        IQueryable<IndependentJamming> Query();

        Task<IEnumerable<IndependentJamming>> GetAllAsync();

        Task<IndependentJamming> AddAsync(IndependentJamming jamming);
        Task<IndependentJamming> UpdateAsync(IndependentJamming jamming);
        Task<IndependentJamming?> GetByIdAsync(int id);
        Task DeleteAsync(int id);
    }

    public class IndependentJammingRepository: IIndependentJammingRepository
    {
        private readonly AppDbContext _context;

        public IndependentJammingRepository(AppDbContext context)
        {
            _context = context;
        }
        public IQueryable<IndependentJamming> Query() => _context.independentJamming.AsQueryable();

        public async Task<IEnumerable<IndependentJamming>> GetAllAsync()
        {
            return await _context.independentJamming.Include(j => j.IndependentTargetPhases).ToListAsync();
        }

        public async Task<IndependentJamming> AddAsync(IndependentJamming jamming)
        {
            _context.independentJamming.Add(jamming);
            await _context.SaveChangesAsync();
            return jamming;
        }

        public async Task<IndependentJamming> UpdateAsync(IndependentJamming jamming)
        {
            _context.independentJamming.Update(jamming);
            await _context.SaveChangesAsync();
            return jamming;
        }

        public async Task<IndependentJamming?> GetByIdAsync(int id)
        {
            return await _context.independentJamming.Include(j => j.IndependentTargetPhases)
                .FirstOrDefaultAsync(j => j.JammingId == id);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.independentJamming.FindAsync(id);
            if (entity != null)
            {
                _context.independentJamming.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
