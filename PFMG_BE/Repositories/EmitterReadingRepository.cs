using PFMG.Data;
using PFMG.Models;

namespace PFMG.Repositories
{
    public class EmitterReadingRepository: IEmitterReadingRepository
    {
        private readonly AppDbContext _db;
        public EmitterReadingRepository(AppDbContext db) => _db = db;

        public async Task SaveAsync(EmitterReading reading, CancellationToken ct)
        {
            _db.Add(reading);                     
            await _db.SaveChangesAsync(ct);       
        }
    }
}
