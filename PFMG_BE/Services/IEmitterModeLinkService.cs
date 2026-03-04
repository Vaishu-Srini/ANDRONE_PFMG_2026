using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.DTOs;

namespace PFMG.Services
{
    public interface IEmitterModeLinkService
    {
        // ✅ Create or Update
        Task<(bool Success, string Message, RequestEmitterModeLinkDto? Data)> SaveEmitterModeLinkAsync(RequestEmitterModeLinkDto dto);

     
    }
}
