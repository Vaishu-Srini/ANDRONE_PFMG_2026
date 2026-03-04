using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models.StandaloneModels;
using PFMG.Data;

namespace PFMG.Repositories
{
    public interface IStandaloneJammingRepository
    {
        IQueryable<StandaloneJamming> Query();

        Task<IEnumerable<StandaloneJamming>> GetAllAsync();

        Task<StandaloneJamming> AddAsync(StandaloneJamming jamming);
        Task<StandaloneJamming> UpdateAsync(StandaloneJamming jamming);
        Task<StandaloneJamming?> GetByIdAsync(int id);
        Task DeleteAsync(int id);

        Task<bool> ExistsAsync(int jammingId, string name);
    }

    public class StandaloneJammingRepository : IStandaloneJammingRepository
    {
        private readonly AppDbContext _context;

        public StandaloneJammingRepository(AppDbContext context)
        {
            _context = context;
        }
        public IQueryable<StandaloneJamming> Query() => _context.standaloneJammings.AsQueryable();

        public async Task<IEnumerable<StandaloneJamming>> GetAllAsync()
        {
            return await _context.standaloneJammings.Include(j => j.StandaloneTargetPhases).ToListAsync();
        }

        public async Task<StandaloneJamming> AddAsync(StandaloneJamming jamming)
        {
            _context.standaloneJammings.Add(jamming);
            await _context.SaveChangesAsync();
            return jamming;
        }

        public async Task<StandaloneJamming> UpdateAsync(StandaloneJamming jamming)
        {
            _context.standaloneJammings.Update(jamming);
            await _context.SaveChangesAsync();
            return jamming;
        }

        public async Task<StandaloneJamming?> GetByIdAsync(int id)
        {
            return await _context.standaloneJammings
                .FirstOrDefaultAsync(j => j.JammingId == id);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.standaloneJammings.FindAsync(id);
            if (entity != null)
            {
                _context.standaloneJammings.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<bool> ExistsAsync(int jammingId, string name)
        {
            return await _context.standaloneJammings.AnyAsync(j => j.JammingId == jammingId && j.JammingName == name);
        }
    }
}
