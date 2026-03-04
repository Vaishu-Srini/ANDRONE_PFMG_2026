using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using PFMG.DTOs;
using PFMG.Services;
using PFMG.Utilities;
using System.Net;

namespace PFMG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmitterModeLinkController : ControllerBase
    {
        private readonly IEmitterModeLinkService _service;

        public EmitterModeLinkController(IEmitterModeLinkService service)
        {
            _service = service;
        }

        // ✅ Create or Update (one API)
        [HttpPost("save")]
        public async Task<IActionResult> SaveEmitter(RequestEmitterModeLinkDto dto)
        {
            var result = await _service.SaveEmitterModeLinkAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null);
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);

            }

            // ✅ Use DB saved result instead of input dto
            var successResponse = new ApiResponse<RequestEmitterModeLinkDto>(
                 HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);


        }

        // ✅ Get all
        


       

    }

}