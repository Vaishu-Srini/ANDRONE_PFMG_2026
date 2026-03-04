using System.Threading.Tasks;
using PFMG.DTOs;

namespace PFMG.Services
{
    public interface IPfmService
    {
        //    Task<(bool Success, string Message, byte[] FileContent)> GetPfmGeneration(int missionId);
        Task<(bool Success, string Message, byte[] FileContent, string FileName)> GetPfmGeneration(int missionId);

    }
}
