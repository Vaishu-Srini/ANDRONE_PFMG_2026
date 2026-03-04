using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models.StandaloneModels;

namespace PFMG.Repositories
{
    public interface IModePriDetailLibraryRepository
    {
        IQueryable<StandaloneModePriDetail> Query();
        Task<StandaloneModePriDetail?> GetByIdAsync(int id);
        Task<IEnumerable<StandaloneModePriDetail>> GetAllAsync();
        Task<StandaloneModePriDetail> AddAsync(StandaloneModePriDetail entity);
        Task<IEnumerable<StandaloneModePriDetail>> AddRangeAsync(IEnumerable<StandaloneModePriDetail> entities);
        Task<StandaloneModePriDetail> UpdateAsync(StandaloneModePriDetail entity);
        Task DeleteAsync(int id);
    }

    public class ModePriDetailLibraryRepository : IModePriDetailLibraryRepository
    {
        private readonly AppDbContext _context;

        public ModePriDetailLibraryRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<StandaloneModePriDetail> Query() => _context.standaloneModePris.AsQueryable();

        public async Task<StandaloneModePriDetail?> GetByIdAsync(int id)
        {
            return await _context.standaloneModePris.FindAsync(id);
        }

        public async Task<IEnumerable<StandaloneModePriDetail>> GetAllAsync()
        {
            return await _context.standaloneModePris.ToListAsync();
        }

        public async Task<StandaloneModePriDetail> AddAsync(StandaloneModePriDetail entity)
        {
            _context.standaloneModePris.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<StandaloneModePriDetail>> AddRangeAsync(IEnumerable<StandaloneModePriDetail> entities)
        {
            _context.standaloneModePris.AddRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public async Task<StandaloneModePriDetail> UpdateAsync(StandaloneModePriDetail entity)
        {
            _context.standaloneModePris.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.standaloneModePris.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
