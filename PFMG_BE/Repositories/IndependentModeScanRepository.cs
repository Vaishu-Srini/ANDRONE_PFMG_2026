using PFMG.Data;
using PFMG.Models.StandaloneModels;
using PFMG.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace PFMG.Repositories
{
    public interface IIndependentModeScanRepository
{
    IQueryable<IndependentModeScanDetail> Query();
    Task<IndependentModeScanDetail?> GetByIdAsync(int id);
    Task<IEnumerable<IndependentModeScanDetail>> GetAllAsync();
    Task<IndependentModeScanDetail> AddAsync(IndependentModeScanDetail entity);
    Task<IEnumerable<IndependentModeScanDetail>> AddRangeAsync(IEnumerable<IndependentModeScanDetail> entities);
    Task<IndependentModeScanDetail> UpdateAsync(IndependentModeScanDetail entity);
    Task DeleteAsync(int id);
}


}
public class IndependentModeScanRepository: IIndependentModeScanRepository
{
    private readonly AppDbContext _context;

    public IndependentModeScanRepository(AppDbContext context)
    {
        _context = context;
    }

    public IQueryable<IndependentModeScanDetail> Query() => _context.independentModeScanDetail.AsQueryable();

    public async Task<IndependentModeScanDetail?> GetByIdAsync(int id)
    {
        return await _context.independentModeScanDetail.FindAsync(id);
    }

    public async Task<IEnumerable<IndependentModeScanDetail>> GetAllAsync()
    {
        return await _context.independentModeScanDetail.ToListAsync();
    }

    public async Task<IndependentModeScanDetail> AddAsync(IndependentModeScanDetail entity)
    {
        _context.independentModeScanDetail.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<IndependentModeScanDetail>> AddRangeAsync(IEnumerable<IndependentModeScanDetail> entities)
    {
        _context.independentModeScanDetail.AddRange(entities);
        await _context.SaveChangesAsync();
        return entities;
    }

    public async Task<IndependentModeScanDetail> UpdateAsync(IndependentModeScanDetail entity)
    {
        _context.independentModeScanDetail.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _context.independentModeScanDetail.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
