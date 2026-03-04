using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.DTOs;

namespace PFMG.Services
{
    public interface IEmitterService
    {
        // ✅ Create or Update
        Task<(bool Success, string Message, EmitterDto? Data)> SaveEmitterAsync(EmitterDto dto);

        // ✅ Get all
        Task<IEnumerable<EmitterDto>> GetAllEmittersAsync();

        // ✅ Delete by Id
        Task<(bool Success, string Message)> DeleteEmitterAsync(int id);

        Task<(bool Success, string Message, StandaloneEmitterDto? Data)> SaveStandaloneEmitterAsync(StandaloneEmitterDto dto);
        Task<IEnumerable<StandaloneEmitterDto>> GetAllStandaloneEmittersAsync();

        Task<(bool Success, string Message)> DeleteStandaloneEmitterAsync(int id);

        Task<IEnumerable<EmitterCoordinateDto>> GetAllEmittersCoordinatesAsync();

        Task<EmitterTreeDto?> GetEmitterTreeByIdAsync(int emitterId);

        Task<EmitterTreeDto?> GetWeaponEmitterTreeByIdAsync(int emitterId);
    }
}
