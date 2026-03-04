using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public interface IJammingRepository
    {
        IQueryable<Jamming> Query();
        Task<IEnumerable<Jamming>> GetAllAsync();

        Task<Jamming> AddAsync(Jamming jamming);
        Task<Jamming> UpdateAsync(Jamming jamming);
        Task<Jamming?> GetByIdAsync(int id);
        Task DeleteAsync(int id);

        Task<bool> ExistsAsync(int jammingId, string name);
    }

    public class JammingRepository : IJammingRepository
    {
        private readonly AppDbContext _context;

        public JammingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Jamming>> GetAllAsync()
        {
            return await _context.jammings.Include(j => j.TargetPhases).ToListAsync();
        }
        public IQueryable<Jamming> Query() => _context.jammings.AsQueryable();

        public async Task<Jamming> AddAsync(Jamming jamming)
        {
            _context.jammings.Add(jamming);
            await _context.SaveChangesAsync();
            return jamming;
        }

        public async Task<Jamming> UpdateAsync(Jamming jamming)
        {
            _context.jammings.Update(jamming);
            await _context.SaveChangesAsync();
            return jamming;
        }

        public async Task<Jamming?> GetByIdAsync(int id)
        {
            return await _context.jammings
                .FirstOrDefaultAsync(j => j.JammingId == id);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.jammings.FindAsync(id);
            if (entity != null)
            {
                _context.jammings.Remove(entity); 
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int jammingId, string name)
        {
            return await _context.jammings.AnyAsync(j => j.JammingId == jammingId && j.JammingName == name);
        }

    }
}
