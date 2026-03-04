using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models;

namespace PFMG.Repositories
{
    public interface IModeScanDetailRepository
    {
        IQueryable<ModeScanDetail> Query();
        Task<ModeScanDetail?> GetByIdAsync(int id);
        Task<IEnumerable<ModeScanDetail>> GetAllAsync();
        Task<ModeScanDetail> AddAsync(ModeScanDetail entity);
        Task<IEnumerable<ModeScanDetail>> AddRangeAsync(IEnumerable<ModeScanDetail> entities);
        Task<ModeScanDetail> UpdateAsync(ModeScanDetail entity);
        Task DeleteAsync(int id);
    }

    public class ModeScanDetailRepository : IModeScanDetailRepository
    {
        private readonly AppDbContext _context;

        public ModeScanDetailRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<ModeScanDetail> Query() => _context.modeScanDetails.AsQueryable();

        public async Task<ModeScanDetail?> GetByIdAsync(int id)
        {
            return await _context.modeScanDetails.FindAsync(id);
        }

        public async Task<IEnumerable<ModeScanDetail>> GetAllAsync()
        {
            return await _context.modeScanDetails.ToListAsync();
        }

        public async Task<ModeScanDetail> AddAsync(ModeScanDetail entity)
        {
            _context.modeScanDetails.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<ModeScanDetail>> AddRangeAsync(IEnumerable<ModeScanDetail> entities)
        {
            _context.modeScanDetails.AddRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public async Task<ModeScanDetail> UpdateAsync(ModeScanDetail entity)
        {
            _context.modeScanDetails.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.modeScanDetails.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
