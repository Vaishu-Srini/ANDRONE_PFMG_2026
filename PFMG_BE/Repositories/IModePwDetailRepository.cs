using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models;

namespace PFMG.Repositories
{
    public interface IModePwDetailRepository
    {
        IQueryable<ModePwDetail> Query();
        Task<ModePwDetail?> GetByIdAsync(int id);
        Task<IEnumerable<ModePwDetail>> GetAllAsync();
        Task<ModePwDetail> AddAsync(ModePwDetail entity);
        Task<IEnumerable<ModePwDetail>> AddRangeAsync(IEnumerable<ModePwDetail> entities);
        Task<ModePwDetail> UpdateAsync(ModePwDetail entity);
        Task DeleteAsync(int id);
    }

    public class ModePwDetailRepository : IModePwDetailRepository
    {
        private readonly AppDbContext _context;

        public ModePwDetailRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<ModePwDetail> Query() => _context.modePwDetails.AsQueryable();

        public async Task<ModePwDetail?> GetByIdAsync(int id)
        {
            return await _context.modePwDetails.FindAsync(id);
        }

        public async Task<IEnumerable<ModePwDetail>> GetAllAsync()
        {
            return await _context.modePwDetails.ToListAsync();
        }

        public async Task<ModePwDetail> AddAsync(ModePwDetail entity)
        {
            _context.modePwDetails.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<ModePwDetail>> AddRangeAsync(IEnumerable<ModePwDetail> entities)
        {
            _context.modePwDetails.AddRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public async Task<ModePwDetail> UpdateAsync(ModePwDetail entity)
        {
            _context.modePwDetails.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.modePwDetails.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
