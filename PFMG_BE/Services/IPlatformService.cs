using System.Threading.Tasks;
using PFMG.DTOs;

namespace PFMG.Services
{
    public interface IPlatformService
    {
        Task<(bool Success, string Message, PlatformDto? Data)> SavePlatformAsync(PlatformDto dto);
        Task<IEnumerable<PlatformDto>> GetAllPlatformsAsync();
        Task<(bool Success, string Message)> DeletePlatformAsync(int id);
        // Task<PlatformTreeDto?> GetPlatformTreeByIdAsync(int platformId);

        Task<(bool Success, string Message, PlatformDto? Data)> SaveStandalonePlatform(PlatformDto dto);


        Task<IEnumerable<PlatformDto>> GetAllPlatformsLibraryAsync();
    }
}
