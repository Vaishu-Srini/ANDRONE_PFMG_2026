using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models;

namespace PFMG.Repositories
{
    public interface IModePriDetailRepository
    {
        IQueryable<ModePriDetail> Query();
        Task<ModePriDetail?> GetByIdAsync(int id);
        Task<IEnumerable<ModePriDetail>> GetAllAsync();
        Task<ModePriDetail> AddAsync(ModePriDetail entity);
        Task<IEnumerable<ModePriDetail>> AddRangeAsync(IEnumerable<ModePriDetail> entities);
        Task<ModePriDetail> UpdateAsync(ModePriDetail entity);
        Task DeleteAsync(int id);
    }

    public class ModePriDetailRepository : IModePriDetailRepository
    {
        private readonly AppDbContext _context;

        public ModePriDetailRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<ModePriDetail> Query() => _context.modePriDetails.AsQueryable();

        public async Task<ModePriDetail?> GetByIdAsync(int id)
        {
            return await _context.modePriDetails.FindAsync(id);
        }

        public async Task<IEnumerable<ModePriDetail>> GetAllAsync()
        {
            return await _context.modePriDetails.ToListAsync();
        }

        public async Task<ModePriDetail> AddAsync(ModePriDetail entity)
        {
            _context.modePriDetails.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<ModePriDetail>> AddRangeAsync(IEnumerable<ModePriDetail> entities)
        {
            _context.modePriDetails.AddRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public async Task<ModePriDetail> UpdateAsync(ModePriDetail entity)
        {
            _context.modePriDetails.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.modePriDetails.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
