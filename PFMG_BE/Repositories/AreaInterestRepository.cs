using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models;
using Microsoft.EntityFrameworkCore;

namespace PFMG.Repositories
{
    public interface IAreaInterestRepository
    {
        IQueryable<AreaInterest> Query();
        Task<AreaInterest?> GetByIdAsync(int id);
        Task<AreaInterest?> GetByNameAsync(string name);
        Task<AreaInterest> AddAsync(AreaInterest areaInterest);
        Task<AreaInterest> UpdateAsync(AreaInterest areaInterest);
        Task DeleteAsync(AreaInterest areaInterest);
        Task<AreaInterest?> GeAreaInterestByMissionIdAsync(int MissionId);

        Task<List<AreaInterest>> GetAreaInterestsByMissionIdAsync(int missionId);
    }

    public class AreaInterestRepository : IAreaInterestRepository
    {
        private readonly AppDbContext _context;

        public AreaInterestRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<AreaInterest> Query() => _context.areaInterests.AsQueryable();

        public async Task<AreaInterest?> GetByIdAsync(int id) =>
            await _context.areaInterests
                .Include(m => m.AreaInterestCoordinates)
                .FirstOrDefaultAsync(m => m.AreaInterestId == id);

        public async Task<AreaInterest?> GetByNameAsync(string name) =>
            await _context.areaInterests.FirstOrDefaultAsync(m => m.AreaName == name);

        public async Task<AreaInterest> AddAsync(AreaInterest areaInterest)
        {
            _context.areaInterests.Add(areaInterest);
            await _context.SaveChangesAsync();
            return areaInterest;
        }

        public async Task<AreaInterest> UpdateAsync(AreaInterest areaInterest)
        {
            _context.areaInterests.Update(areaInterest);
            await _context.SaveChangesAsync();
            return areaInterest;
        }

        public async Task DeleteAsync(AreaInterest areaInterest)
        {
            _context.areaInterests.Remove(areaInterest);
            await _context.SaveChangesAsync();
        }

        public async Task<AreaInterest?> GeAreaInterestByMissionIdAsync(int MissionId) =>
            await _context.areaInterests.Include(m => m.AreaInterestCoordinates).FirstOrDefaultAsync(a => a.MissionId == MissionId);

        public async Task<List<AreaInterest>> GetAreaInterestsByMissionIdAsync(int missionId) =>
            await _context.areaInterests
                .Include(ai => ai.AreaInterestCoordinates)
                .Where(ai => ai.MissionId == missionId)
                .ToListAsync();

            }
}