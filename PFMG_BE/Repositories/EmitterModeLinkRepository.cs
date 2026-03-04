using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public class EmitterModeLinkRepository
    {
        private readonly AppDbContext _context;

        public EmitterModeLinkRepository(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Expose IQueryable
        public IQueryable<EmitterModeLink> Query()
        {
            return _context.emitterModeLinks.AsQueryable();
        }

        public async Task<EmitterModeLink> AddEmitterModeLinkAsync(EmitterModeLink emitterModeLink)
        {
            _context.emitterModeLinks.Add(emitterModeLink);
            await _context.SaveChangesAsync();
            return emitterModeLink;
        }

        public async Task<EmitterModeLink?> GetEmitterModeLinkByIdAsync(int id)
        {
            return await _context.emitterModeLinks.FindAsync(id);
        }

 
        public async Task<IEnumerable<EmitterModeLink>> GetAllEmitterModeLinksAsync()
        {
            return await _context.emitterModeLinks.ToListAsync();
        }

        public async Task UpdateEmitterModeLinkAsync(EmitterModeLink emitterModeLink)
        {
            _context.emitterModeLinks.Update(emitterModeLink);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEmitterModeLinkAsync(EmitterModeLink emitterModeLink)
        {
            _context.emitterModeLinks.Remove(emitterModeLink);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEmitterModeLinksByAreaInterestIdAsync(int areaInterestId)
        {
            await _context.emitterModeLinks
                .Where(e => e.AreaInterestId == areaInterestId)
                .ExecuteDeleteAsync();
        }

    }
}
