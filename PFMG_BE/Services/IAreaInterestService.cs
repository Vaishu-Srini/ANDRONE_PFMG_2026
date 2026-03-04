using System.Threading.Tasks;
using PFMG.DTOs;
using PFMG.Models;

namespace PFMG.Services
{
    public interface IAreaInterestService
    {
        Task<(bool Success, string Message, AreaInterestDto? Data)> SaveAreaInterestAsync(AreaInterestDto dto);
        Task<IEnumerable<AreaInterestDto>> GetAllAreaInterestAsync();

        Task<AreaInterestDto?> GetByAreaIdAsync(int id);
        Task<(bool Success, string Message)> DeleteAreaInterestAsync(int id);

        // Task<List<ResponseEmitterModeLinkDto>> GetEmittersInAreaAsync(int MissionId);
        Task<List<ResponseEmitterModeLinkDto>> GetEmitterInAreaAsync(int missionId);


    }
}
