using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models;
using Microsoft.EntityFrameworkCore;

namespace PFMG.Repositories
{
    public interface IAreaInterestCoordinateRepository
    {
        IQueryable<AreaInterestCoordinate> Query();
        // Task<AreaInterestCoordinate?> GetByIdAsync(int id);
        Task<AreaInterestCoordinate> AddAsync(AreaInterestCoordinate areaInterestCoordinate);
        Task<AreaInterestCoordinate> UpdateAsync(AreaInterestCoordinate areaInterestCoordinate);
        Task DeleteAsync(AreaInterestCoordinate areaInterestCoordinate);

        Task<IEnumerable<AreaInterestCoordinate>> AddRangeAsync(IEnumerable<AreaInterestCoordinate> modeFrequencyDetails);
        Task<List<AreaInterestCoordinate>> GetByAreaInterestIdAsync(int areaInterestId);

        Task DeleteRangeAsync(List<AreaInterestCoordinate> coords);

    }

    public class AreaInterestCoordinateRepository : IAreaInterestCoordinateRepository
    {
        private readonly AppDbContext _context;

        public AreaInterestCoordinateRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<AreaInterestCoordinate> Query() => _context.areacoordinates.AsQueryable();

        // public async Task<AreaInterestCoordinate?> GetByIdAsync(int id) =>
        //     await _context.coordinates
        //         .Include(m => m.AreaInterestCoordinates)
        //         .FirstOrDefaultAsync(m => m.AreaInterestId == id);



        public async Task<AreaInterestCoordinate> AddAsync(AreaInterestCoordinate areaInterestCoordinate)
        {
            _context.areacoordinates.Add(areaInterestCoordinate);
            await _context.SaveChangesAsync();
            return areaInterestCoordinate;
        }

        public async Task<AreaInterestCoordinate> UpdateAsync(AreaInterestCoordinate areaInterestCoordinate)
        {
            _context.areacoordinates.Update(areaInterestCoordinate);
            await _context.SaveChangesAsync();
            return areaInterestCoordinate;
        }

        public async Task DeleteAsync(AreaInterestCoordinate areaInterestCoordinate)
        {
            _context.areacoordinates.Remove(areaInterestCoordinate);
            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<AreaInterestCoordinate>> AddRangeAsync(IEnumerable<AreaInterestCoordinate> areaInterestCoordinates)
        {
            _context.areacoordinates.AddRange(areaInterestCoordinates);
            await _context.SaveChangesAsync();
            return areaInterestCoordinates;
        }
        
        public async Task<List<AreaInterestCoordinate>> GetByAreaInterestIdAsync(int areaInterestId)
        {
            return await _context.areacoordinates
                .Where(c => c.AreaInterestId == areaInterestId)
                .ToListAsync();
        }

        public async Task DeleteRangeAsync(List<AreaInterestCoordinate> coords)
        {
            _context.areacoordinates.RemoveRange(coords);
            await _context.SaveChangesAsync();
        }
    }
}