using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PFMG.Models;
using PFMG.Data;
using PFMG.DTOs;

namespace PFMG.Repositories
{
    public interface IEmitterRepository
    {
        IQueryable<Emitter> Query();
        Task<Emitter?> GetByIdAsync(int id);
        Task<Emitter?> GetByNameAsync(string emitterName);
        Task<Emitter> AddAsync(Emitter emitter);
        Task<Emitter> UpdateAsync(Emitter emitter);
        Task<(int Id, string? Lat, string? Lon)?> GetNameAsync(string name, CancellationToken ct = default);
        Task DeleteAsync(int id);

        Task<List<EmitterCoordinateDto>> GetAllEmitterCoordinatesAsync();

        Task<bool> ExistsAsync(int emitterId, string name);

    }

    public class EmitterRepository : IEmitterRepository
    {
        private readonly AppDbContext _context;

        public EmitterRepository(AppDbContext context) => _context = context;

        public IQueryable<Emitter> Query() => _context.emitters.AsQueryable();

        public async Task<Emitter?> GetByIdAsync(int id) =>
            await _context.emitters.FindAsync(id);

        public async Task<Emitter?> GetByNameAsync(string emitterName) =>
            await _context.emitters.FirstOrDefaultAsync(e => e.EmitterName == emitterName);

        public async Task<Emitter> AddAsync(Emitter emitter)
        {
            _context.emitters.Add(emitter);
            await _context.SaveChangesAsync();
            return emitter;
        }

        public async Task<Emitter> UpdateAsync(Emitter emitter)
        {
            _context.emitters.Update(emitter);
            await _context.SaveChangesAsync();
            return emitter;
        }
        public async Task<(int Id, string? Lat, string? Lon)?> GetNameAsync(string name, CancellationToken ct = default)
        {
            var e = await _context.emitters
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.EmitterName == name, ct);
            if (e == null || string.Equals(e.EmitterName, "Unknown", StringComparison.OrdinalIgnoreCase))
                return null;
            return (e.EmitterId, e.Latitude, e.Longitude);
        }

        public async Task DeleteAsync(int id)
        {
            var emitter = await GetByIdAsync(id);
            if (emitter != null)
            {
                _context.emitters.Remove(emitter);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<EmitterCoordinateDto>> GetAllEmitterCoordinatesAsync()
        {
            return await _context.emitters
                .Select(e => new EmitterCoordinateDto
                {
                    EmitterId = e.EmitterId,
                    EmitterName = e.EmitterName,
                    Latitude = e.Latitude,
                    Longitude = e.Longitude
                })
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(int emitterId, string name)
        {
            return await _context.emitters.AnyAsync(e => e.EmitterId == emitterId && e.EmitterName == name);
        }
    }
}
