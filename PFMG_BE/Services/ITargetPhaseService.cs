using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.DTOs;

namespace PFMG.Services
{
    public interface ITargetPhaseService
    {


        Task<(bool Success, string Message, TargetPhaseDto? Data)> SaveTargetPhase(TargetPhaseDto dto); 
        Task<IEnumerable<TargetPhaseDto>> GetAllTargetPhases();
        Task<(bool Success, string Message)> DeleteTargetPhase(int id);


        Task<(bool Success, string Message, TargetPhaseDto? Data)> SaveStandaloneTargetPhase(TargetPhaseDto dto); 
        Task<IEnumerable<TargetPhaseDto>> GetAllStandaloneTargetPhases();
        Task<(bool Success, string Message)> DeleteStandaloneTargetPhase(int id);

        Task<(bool Success, string Message, TargetPhaseDto? Data)> SaveIndependentModeTargetPhase(TargetPhaseDto dto); 
        Task<IEnumerable<TargetPhaseDto>> GetAllIndependentModeTargetPhases();
        Task<(bool Success, string Message)> DeleteIndependentModeTargetPhase(int id);


        Task<(bool Success, string Message, TargetPhaseDto? Data)> SaveIndependentTargetPhase(TargetPhaseDto dto); 
        Task<IEnumerable<TargetPhaseDto>> GetAllIndependentTargetPhases();
        Task<(bool Success, string Message)> DeleteIndependentTargetPhase(int id);

    }
}
