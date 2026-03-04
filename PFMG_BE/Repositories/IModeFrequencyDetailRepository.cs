
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models;
using Microsoft.EntityFrameworkCore;

// 🔹 ModeFrequencyDetail Repository
    public interface IModeFrequencyDetailRepository
    {
        IQueryable<ModeFrequencyDetail> Query();
        Task<ModeFrequencyDetail?> GetByIdAsync(int id);
        Task<ModeFrequencyDetail> AddAsync(ModeFrequencyDetail entity);
        Task<ModeFrequencyDetail> UpdateAsync(ModeFrequencyDetail entity);
        Task<IEnumerable<ModeFrequencyDetail>> AddRangeAsync(IEnumerable<ModeFrequencyDetail> modeFrequencyDetails);
        Task DeleteAsync(int id);
    }

public class ModeFrequencyDetailRepository : IModeFrequencyDetailRepository
{
    private readonly AppDbContext _context;

    public ModeFrequencyDetailRepository(AppDbContext context) => _context = context;

    public IQueryable<ModeFrequencyDetail> Query() => _context.modeFrequencyDetails.AsQueryable();

    public async Task<ModeFrequencyDetail?> GetByIdAsync(int id) =>
        await _context.modeFrequencyDetails.FindAsync(id);

    public async Task<ModeFrequencyDetail> AddAsync(ModeFrequencyDetail entity)
    {
        _context.modeFrequencyDetails.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<ModeFrequencyDetail> UpdateAsync(ModeFrequencyDetail entity)
    {
        _context.modeFrequencyDetails.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _context.modeFrequencyDetails.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
        
    public async Task<IEnumerable<ModeFrequencyDetail>> AddRangeAsync(IEnumerable<ModeFrequencyDetail> modeFrequencyDetails)
    {
        _context.modeFrequencyDetails.AddRange(modeFrequencyDetails);
        await _context.SaveChangesAsync();
        return modeFrequencyDetails;
    }
}