using PFMG.Models;

namespace PFMG.Repositories
{
    public interface IEmitterReadingRepository
    {
        Task SaveAsync(EmitterReading reading, CancellationToken ct);
    }
}
