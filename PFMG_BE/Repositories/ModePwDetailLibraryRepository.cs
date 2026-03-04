using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models.StandaloneModels;

namespace PFMG.Repositories
{
    public interface IModePwDetailLibraryRepository
    {
        IQueryable<StandaloneModePwDetail> Query();
        Task<StandaloneModePwDetail?> GetByIdAsync(int id);
        Task<IEnumerable<StandaloneModePwDetail>> GetAllAsync();
        Task<StandaloneModePwDetail> AddAsync(StandaloneModePwDetail entity);
        Task<IEnumerable<StandaloneModePwDetail>> AddRangeAsync(IEnumerable<StandaloneModePwDetail> entities);
        Task<StandaloneModePwDetail> UpdateAsync(StandaloneModePwDetail entity);
        Task DeleteAsync(int id);
    }

    public class ModePwDetailLibraryRepository : IModePwDetailLibraryRepository
    {
        private readonly AppDbContext _context;

        public ModePwDetailLibraryRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<StandaloneModePwDetail> Query() => _context.standaloneModePws.AsQueryable();

        public async Task<StandaloneModePwDetail?> GetByIdAsync(int id)
        {
            return await _context.standaloneModePws.FindAsync(id);
        }

        public async Task<IEnumerable<StandaloneModePwDetail>> GetAllAsync()
        {
            return await _context.standaloneModePws.ToListAsync();
        }

        public async Task<StandaloneModePwDetail> AddAsync(StandaloneModePwDetail entity)
        {
            _context.standaloneModePws.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<StandaloneModePwDetail>> AddRangeAsync(IEnumerable<StandaloneModePwDetail> entities)
        {
            _context.standaloneModePws.AddRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public async Task<StandaloneModePwDetail> UpdateAsync(StandaloneModePwDetail entity)
        {
            _context.standaloneModePws.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.standaloneModePws.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
