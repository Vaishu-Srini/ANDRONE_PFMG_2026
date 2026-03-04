using System.Threading.Tasks;
using PFMG.DTOs;

namespace PFMG.Services
{
    public interface IMissionService
    {
        Task<(bool Success, string Message, MissionDto? Data)> SaveMissionAsync(MissionDto dto);
        Task<IEnumerable<MissionDto>> GetAllMissionsAsync();
        Task<(bool Success, string Message)> DeleteMissionAsync(int id);
        Task<MissionTreeDto?> GetMissionTreeByIdAsync(int missionId);


    }
}
