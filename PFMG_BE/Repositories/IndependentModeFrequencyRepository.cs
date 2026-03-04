using System.Linq;
using System.Threading.Tasks;
using PFMG.Data;
using PFMG.Models.StandaloneModels;
using Microsoft.EntityFrameworkCore;

    public interface IIndependentModeFrequencyRepository
    {
        IQueryable<IndependentModeFrequencyDetail> Query();
        Task<IndependentModeFrequencyDetail?> GetByIdAsync(int id);
        Task<IndependentModeFrequencyDetail> AddAsync(IndependentModeFrequencyDetail entity);
        Task<IndependentModeFrequencyDetail> UpdateAsync(IndependentModeFrequencyDetail entity);
        Task<IEnumerable<IndependentModeFrequencyDetail>> AddRangeAsync(IEnumerable<IndependentModeFrequencyDetail> modeFrequencyDetails);
        Task DeleteAsync(int id);
    }
    public class IndependentModeFrequencyRepository : IIndependentModeFrequencyRepository
    {
        private readonly AppDbContext _context;

        public IndependentModeFrequencyRepository(AppDbContext context) => _context = context;

        public IQueryable<IndependentModeFrequencyDetail> Query() => _context.independentModeFrequencyDetail.AsQueryable();

        public async Task<IndependentModeFrequencyDetail?> GetByIdAsync(int id) =>
            await _context.independentModeFrequencyDetail.FindAsync(id);

        public async Task<IndependentModeFrequencyDetail> AddAsync(IndependentModeFrequencyDetail entity)
        {
            _context.independentModeFrequencyDetail.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<IndependentModeFrequencyDetail> UpdateAsync(IndependentModeFrequencyDetail entity)
        {
            _context.independentModeFrequencyDetail.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.independentModeFrequencyDetail.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<IndependentModeFrequencyDetail>> AddRangeAsync(IEnumerable<IndependentModeFrequencyDetail> modeFrequencyDetails)
        {
            _context.independentModeFrequencyDetail.AddRange(modeFrequencyDetails);
            await _context.SaveChangesAsync();
            return modeFrequencyDetails;
        }
    }


