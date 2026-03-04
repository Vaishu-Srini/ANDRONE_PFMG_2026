using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models.StandaloneModels;
using Microsoft.EntityFrameworkCore;

namespace PFMG.Repositories
{
    public interface IIndependentModePwRepository
    {
        IQueryable<IndependentModePwDetail> Query();
        Task<IndependentModePwDetail?> GetByIdAsync(int id);
        Task<IEnumerable<IndependentModePwDetail>> GetAllAsync();
        Task<IndependentModePwDetail> AddAsync(IndependentModePwDetail entity);
        Task<IEnumerable<IndependentModePwDetail>> AddRangeAsync(IEnumerable<IndependentModePwDetail> entities);
        Task<IndependentModePwDetail> UpdateAsync(IndependentModePwDetail entity);
        Task DeleteAsync(int id);
    }
    public class IndependentModePwRepository : IIndependentModePwRepository
    {

        private readonly AppDbContext _context;

        public IndependentModePwRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<IndependentModePwDetail> Query() => _context.independentModePwDetail.AsQueryable();

        public async Task<IndependentModePwDetail?> GetByIdAsync(int id)
        {
            return await _context.independentModePwDetail.FindAsync(id);
        }

        public async Task<IEnumerable<IndependentModePwDetail>> GetAllAsync()
        {
            return await _context.independentModePwDetail.ToListAsync();
        }

        public async Task<IndependentModePwDetail> AddAsync(IndependentModePwDetail entity)
        {
            _context.independentModePwDetail.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<IndependentModePwDetail>> AddRangeAsync(IEnumerable<IndependentModePwDetail> entities)
        {
            _context.independentModePwDetail.AddRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public async Task<IndependentModePwDetail> UpdateAsync(IndependentModePwDetail entity)
        {
            _context.independentModePwDetail.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.independentModePwDetail.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }

}

