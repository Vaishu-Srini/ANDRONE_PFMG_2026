using PFMG.Repositories;
using Microsoft.Extensions.Caching.Memory;

namespace PFMG.Services
{
    public sealed class TelemetryHelper
    {
        private readonly IEmitterRepository _emitters;
        private readonly IModeRepository _modes;
        private readonly IMemoryCache _cache;

        public TelemetryHelper(IEmitterRepository emitters, IModeRepository modes, IMemoryCache cache)
        {
            _emitters = emitters; _modes = modes; _cache = cache;
        }

        public async Task<(int? EmitterId, string? Lat, string? Lon, float? Freq)> EnrichAsync(
            string emitterName, CancellationToken ct = default)
        {
            var em = await _cache.GetOrCreateAsync($"emitter:{emitterName}", async e =>
            {
                e.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
                return await _emitters.GetNameAsync(emitterName, ct);
            });
            if (em is null) return (null, null, null, null);

            var freq = await _cache.GetOrCreateAsync($"freq:{em.Value.Id}", async e =>
            {
                e.SlidingExpiration = TimeSpan.FromSeconds(30);
                return await _modes.GetLatestFrequencyByEmitterIdAsync(em.Value.Id, ct);
            });

            return (em.Value.Id, em.Value.Lat, em.Value.Lon, freq);
        }
    }
}
