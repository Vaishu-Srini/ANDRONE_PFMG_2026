
using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.DTOs;

namespace PFMG.Services
{
    public interface IModeService
    {
        // ✅ Create or Update
        Task<(bool Success, string Message, ModeDto? Data)> SaveModeAsync(ModeDto dto);

        // ✅ Get all
        Task<IEnumerable<ModeDto>> GetAllModesAsync();

        // ✅ Delete by Id
        Task<(bool Success, string Message)> DeleteModeAsync(int id);


        Task<(bool Success, string Message, ModeDto? Data)> SaveStandaloneModeAsync(ModeDto dto);
        Task<(bool Success, string Message, IndependentModeDto? Data)> SaveIndependentModeAsync(IndependentModeDto dto);

        // ✅ Get all
        Task<IEnumerable<ModeDto>> GetAllStandaloneModesAsync();
        Task<IEnumerable<IndependentModeDto>> GetAllIndependentModesAsync();

        Task<ModeTreeDto?> GetModeTreeByIdAsync(int modeId);

        Task<ModeTreeDto?> GetWeaponModeTreeByIdAsync(int modeId);

        Task<ModeTreeDto?> GetStandaloneModeTreeByIdAsync(int modeId);

        Task<(bool Success, string Message)> DeleteStandaloneModeAsync(int id);  

        Task<(bool Success, string Message)> DeleteIndependenModeAsync(int id); 
    }
}
