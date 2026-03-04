using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models.StandaloneModels;
using PFMG.Data;

namespace PFMG.Repositories
{
    public interface IEmitterLibraryRepository
    {
        IQueryable<StandaloneEmitter> Query();
        Task<StandaloneEmitter?> GetByIdAsync(int id);
        Task<StandaloneEmitter?> GetByNameAsync(string emitterName);
        Task<StandaloneEmitter> AddAsync(StandaloneEmitter emitter);
        Task<StandaloneEmitter> UpdateAsync(StandaloneEmitter emitter);
        Task DeleteAsync(int id);
        Task<StandaloneEmitter?> GetStandaloneEmitterWithDetailsByIdAsync(int emitterId);
        Task<bool> StandaloneExistsAsync(int emitterId, string name);
        Task<List<StandaloneEmitter>> GetStandaloneEmittersWithDetailsByIdsAsync(List<int> emitterIds);
    }

    public class EmitterLibraryRepository : IEmitterLibraryRepository
    {
        private readonly AppDbContext _context;

        public EmitterLibraryRepository(AppDbContext context) => _context = context;

        public IQueryable<StandaloneEmitter> Query() => _context.standaloneEmitters.AsQueryable();

        public async Task<StandaloneEmitter?> GetByIdAsync(int id) =>
            await _context.standaloneEmitters.FindAsync(id);

        public async Task<StandaloneEmitter?> GetByNameAsync(string emitterName) =>
            await _context.standaloneEmitters.FirstOrDefaultAsync(e => e.EmitterName == emitterName);

        public async Task<StandaloneEmitter> AddAsync(StandaloneEmitter emitter)
        {
            _context.standaloneEmitters.Add(emitter);
            await _context.SaveChangesAsync();
            return emitter;
        }

        public async Task<StandaloneEmitter> UpdateAsync(StandaloneEmitter emitter)
        {
            _context.standaloneEmitters.Update(emitter);
            await _context.SaveChangesAsync();
            return emitter;
        }

        public async Task DeleteAsync(int id)
        {
            var emitter = await GetByIdAsync(id);
            if (emitter != null)
            {
                _context.standaloneEmitters.Remove(emitter);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<StandaloneEmitter?> GetStandaloneEmitterWithDetailsByIdAsync(int emitterId)
        {
            return await _context.standaloneEmitters
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.Jammings)
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.ModeFrequencyDetails)
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.ModePwDetails)
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.ModePriDetails)
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.ModeScanDetails)
                .FirstOrDefaultAsync(e => e.EmitterId == emitterId);
        }

        public async Task<List<StandaloneEmitter>> GetStandaloneEmittersWithDetailsByIdsAsync(List<int> emitterIds)
        {
            return await _context.standaloneEmitters
                .AsNoTracking()
                .Where(e => emitterIds.Contains(e.EmitterId))
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.Jammings)
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.ModeFrequencyDetails)
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.ModePwDetails)
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.ModePriDetails)
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.ModeScanDetails)
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<bool> StandaloneExistsAsync(int emitterId, string name)
        {
            return await _context.standaloneEmitters.AnyAsync(e => e.EmitterId == emitterId && e.EmitterName == name);
        }
    }
}
