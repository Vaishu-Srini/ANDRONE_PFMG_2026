using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.Models.StandaloneModels;
using PFMG.Data;

namespace PFMG.Repositories
{
    public class PlatformLibraryRepository
    {
        private readonly AppDbContext _context;

        public PlatformLibraryRepository(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Expose IQueryable
        public IQueryable<PlatformLibrary> Query()
        {
            return _context.platformLibraries.AsQueryable();
        }

        public async Task<PlatformLibrary> AddPlatformLibraryAsync(PlatformLibrary platform)
        {
            _context.platformLibraries.Add(platform);
            await _context.SaveChangesAsync();
            return platform;
        }

        public async Task<PlatformLibrary?> GetPlatformLibraryByIdAsync(int id)
        {
            return await _context.platformLibraries.FindAsync(id);
        }

        public async Task<PlatformLibrary?> GetPlatformLibraryByNameAsync(string name)
        {
            return await _context.platformLibraries.FirstOrDefaultAsync(p => p.PlatformName == name);
        }

        public async Task<IEnumerable<PlatformLibrary>> GetAllPlatformsLibraryAsync()
        {
            return await _context.platformLibraries.ToListAsync();
        }

        public async Task UpdatePlatformLibraryAsync(PlatformLibrary platform)
        {
            _context.platformLibraries.Update(platform);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePlatformLibraryAsync(PlatformLibrary platform)
        {
            _context.platformLibraries.Remove(platform);
            await _context.SaveChangesAsync();
        }
    }
}
