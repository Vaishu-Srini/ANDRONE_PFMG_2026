using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models.StandaloneModels;
namespace PFMG.Repositories
{
    public interface IModeScanDetailLibraryRepository
    {
        IQueryable<StandaloneModeScanDetail> Query();
        Task<StandaloneModeScanDetail?> GetByIdAsync(int id);
        Task<IEnumerable<StandaloneModeScanDetail>> GetAllAsync();
        Task<StandaloneModeScanDetail> AddAsync(StandaloneModeScanDetail entity);
        Task<IEnumerable<StandaloneModeScanDetail>> AddRangeAsync(IEnumerable<StandaloneModeScanDetail> entities);
        Task<StandaloneModeScanDetail> UpdateAsync(StandaloneModeScanDetail entity);
        Task DeleteAsync(int id);
    }

    public class ModeScanDetailLibraryRepository : IModeScanDetailLibraryRepository
    {
        private readonly AppDbContext _context;

        public ModeScanDetailLibraryRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<StandaloneModeScanDetail> Query() => _context.standaloneModeScans.AsQueryable();

        public async Task<StandaloneModeScanDetail?> GetByIdAsync(int id)
        {
            return await _context.standaloneModeScans.FindAsync(id);
        }

        public async Task<IEnumerable<StandaloneModeScanDetail>> GetAllAsync()
        {
            return await _context.standaloneModeScans.ToListAsync();
        }

        public async Task<StandaloneModeScanDetail> AddAsync(StandaloneModeScanDetail entity)
        {
            _context.standaloneModeScans.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<StandaloneModeScanDetail>> AddRangeAsync(IEnumerable<StandaloneModeScanDetail> entities)
        {
            _context.standaloneModeScans.AddRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public async Task<StandaloneModeScanDetail> UpdateAsync(StandaloneModeScanDetail entity)
        {
            _context.standaloneModeScans.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.standaloneModeScans.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
