
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models.StandaloneModels;
using Microsoft.EntityFrameworkCore;

// 🔹 ModeFrequencyDetailLibrary Repository
    public interface IModeFrequencyDetailLibraryRepository
    {
        IQueryable<StandaloneModeFrequencyDetail> Query();
        Task<StandaloneModeFrequencyDetail?> GetByIdAsync(int id);
        Task<StandaloneModeFrequencyDetail> AddAsync(StandaloneModeFrequencyDetail entity);
        Task<StandaloneModeFrequencyDetail> UpdateAsync(StandaloneModeFrequencyDetail entity);
        Task<IEnumerable<StandaloneModeFrequencyDetail>> AddRangeAsync(IEnumerable<StandaloneModeFrequencyDetail> modeFrequencyDetails);
        Task DeleteAsync(int id);
    }

public class ModeFrequencyDetailLibraryRepository : IModeFrequencyDetailLibraryRepository
{
    private readonly AppDbContext _context;

    public ModeFrequencyDetailLibraryRepository(AppDbContext context) => _context = context;

    public IQueryable<StandaloneModeFrequencyDetail> Query() => _context.standaloneModeFrequencies.AsQueryable();

    public async Task<StandaloneModeFrequencyDetail?> GetByIdAsync(int id) =>
        await _context.standaloneModeFrequencies.FindAsync(id);

    public async Task<StandaloneModeFrequencyDetail> AddAsync(StandaloneModeFrequencyDetail entity)
    {
        _context.standaloneModeFrequencies.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<StandaloneModeFrequencyDetail> UpdateAsync(StandaloneModeFrequencyDetail entity)
    {
        _context.standaloneModeFrequencies.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _context.standaloneModeFrequencies.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
        
    public async Task<IEnumerable<StandaloneModeFrequencyDetail>> AddRangeAsync(IEnumerable<StandaloneModeFrequencyDetail> modeFrequencyDetails)
    {
        _context.standaloneModeFrequencies.AddRange(modeFrequencyDetails);
        await _context.SaveChangesAsync();
        return modeFrequencyDetails;
    }
}