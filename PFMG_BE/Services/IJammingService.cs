using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.DTOs;
using PFMG.Models;
using PFMG.Models.StandaloneModels;


namespace PFMG.Services
{
    public interface IJammingService
    {
        Task<(bool Success, string Message, JammingDto? Data)> SaveJammingAsync(JammingDto dto);
        Task<IEnumerable<JammingDto>> GetAllJammingsAsync();
        Task<(bool Success, string Message)> DeleteJammingAsync(int id);
        Task<JammingDto?> GetByIdAsync(int id);

        Task<(bool Success, string Message, JammingDto? Data)> SaveStandaloneJammingAsync(JammingDto dto);
        Task<(bool Success, string Message, JammingDto? Data)> SaveIndependentModeJammingAsync(JammingDto dto);
        Task<(bool Success, string Message, JammingDto? Data)> SaveIndependentJammingAsync(JammingDto dto); 


        Task<IEnumerable<JammingDto>> GetAllStandaloneJammingsAsync();
        Task<IEnumerable<JammingDto>> GetAllIndependentJammingsAsync();
        Task<IEnumerable<JammingDto>> GetAllIndependentModeJammingsAsync(); 

        Task<(bool Success, string Message)> DeleteIndependentModeJammingAsync(int id);
        Task<(bool Success, string Message)> DeleteIndependentJammingAsync(int id);
        Task<(bool Success, string Message)> DeleteStandaloneJammingAsync(int id);

        Task<JammingDto?>  GetIndependentJammingsAsync(int id);


    }
}
