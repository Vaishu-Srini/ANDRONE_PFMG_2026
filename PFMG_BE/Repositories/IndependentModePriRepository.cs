using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models.StandaloneModels;

namespace PFMG.Repositories
{

    public interface IIndependentModePriRepository
    {
        IQueryable<IndependentModePriDetail> Query();
        Task<IndependentModePriDetail?> GetByIdAsync(int id);
        Task<IEnumerable<IndependentModePriDetail>> GetAllAsync();
        Task<IndependentModePriDetail> AddAsync(IndependentModePriDetail entity);
        Task<IEnumerable<IndependentModePriDetail>> AddRangeAsync(IEnumerable<IndependentModePriDetail> entities);
        Task<IndependentModePriDetail> UpdateAsync(IndependentModePriDetail entity);
        Task DeleteAsync(int id);
    }
    public class IndependentModePriRepository : IIndependentModePriRepository
    {
        private readonly AppDbContext _context;

        public IndependentModePriRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<IndependentModePriDetail> Query() => _context.independentModePriDetail.AsQueryable();

        public async Task<IndependentModePriDetail?> GetByIdAsync(int id)
        {
            return await _context.independentModePriDetail.FindAsync(id);
        }

        public async Task<IEnumerable<IndependentModePriDetail>> GetAllAsync()
        {
            return await _context.independentModePriDetail.ToListAsync();
        }

        public async Task<IndependentModePriDetail> AddAsync(IndependentModePriDetail entity)
        {
            _context.independentModePriDetail.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<IndependentModePriDetail>> AddRangeAsync(IEnumerable<IndependentModePriDetail> entities)
        {
            _context.independentModePriDetail.AddRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public async Task<IndependentModePriDetail> UpdateAsync(IndependentModePriDetail entity)
        {
            _context.independentModePriDetail.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.independentModePriDetail.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}


