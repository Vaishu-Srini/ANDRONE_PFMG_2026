using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public class PlatformRepository
    {
        private readonly AppDbContext _context;

        public PlatformRepository(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Expose IQueryable
        public IQueryable<Platform> Query()
        {
            return _context.platforms.AsQueryable();
        }

        public async Task<Platform> AddPlatformAsync(Platform platform)
        {
            _context.platforms.Add(platform);
            await _context.SaveChangesAsync();
            return platform;
        }

        public async Task<Platform?> GetPlatformByIdAsync(int id)
        {
            return await _context.platforms.FindAsync(id);
        }

        public async Task<Platform?> GetPlatformByNameAsync(string name)
        {
            return await _context.platforms.FirstOrDefaultAsync(p => p.PlatformName == name);
        }

        public async Task<IEnumerable<Platform>> GetAllPlatformsAsync()
        {
            return await _context.platforms.ToListAsync();
        }

        public async Task UpdatePlatformAsync(Platform platform)
        {
            _context.platforms.Update(platform);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePlatformAsync(Platform platform)
        {
            _context.platforms.Remove(platform);
            await _context.SaveChangesAsync();
        }
    }
}
