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
    public class EmitterController : ControllerBase
    {
        private readonly IEmitterService _service;

        public EmitterController(IEmitterService service)
        {
            _service = service;
        }

        // ✅ Create or Update (one API)
        [HttpPost("save")]
        public async Task<IActionResult> SaveEmitter(EmitterDto dto)
        {
            var result = await _service.SaveEmitterAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null);
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);

            }

            // ✅ Use DB saved result instead of input dto
            var successResponse = new ApiResponse<EmitterDto>(
                result.Data.EmitterId > 0 && dto.EmitterId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);


        }

        // ✅ Get all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllEmitters()
        {
            var emitters = await _service.GetAllEmittersAsync();
            var response = new ApiResponse<IEnumerable<EmitterDto>>(
            HttpStatusCode.OK,
            "Emitters retrieved successfully",
            emitters
        );
            return Ok(response);
        }

        // ✅ Delete by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmitter(int id)
        {

           
            var result = await _service.DeleteEmitterAsync(id);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
            }

            var successResponse = new ApiResponse<string>(
                HttpStatusCode.OK,
                result.Message,
                null
            );

            return Ok(successResponse);

        }

        // ✅ Create or Update (one API)
        [HttpPost("standalone/save")]
        public async Task<IActionResult> SaveStandaloneEmitter(StandaloneEmitterDto dto)
        {
            var result = await _service.SaveStandaloneEmitterAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null);
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);

            }

            // ✅ Use DB saved result instead of input dto
            var successResponse = new ApiResponse<StandaloneEmitterDto>(
                result.Data.EmitterId > 0 && dto.EmitterId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);


        }

        // ✅ Delete by id
        [HttpDelete("delete-standalone/{id}")]
        public async Task<IActionResult> DeleteStandaloneEmitter(int id)
        {

           
            var result = await _service.DeleteStandaloneEmitterAsync(id);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
            }

            var successResponse = new ApiResponse<string>(
                HttpStatusCode.OK,
                result.Message,
                null
            );

            return Ok(successResponse);

        }


        [HttpGet("standalone/all")]
        public async Task<IActionResult> GetAllStandaloneEmittersAsync()
        {
            var emitters = await _service.GetAllStandaloneEmittersAsync();
            var response = new ApiResponse<IEnumerable<StandaloneEmitterDto>>(
            HttpStatusCode.OK,
            "Emitters retrieved successfully",
            emitters
        );
            return Ok(response);
        }


        [HttpGet("coordinates")]
        public async Task<IActionResult> GetAllEmittersCoordinatesAsync()
        {
            var emitterCoordinateDtos = await _service.GetAllEmittersCoordinatesAsync();

            var response = new ApiResponse<IEnumerable<EmitterCoordinateDto>>(
                HttpStatusCode.OK,
                "Emitter coordinates retrieved successfully",
                emitterCoordinateDtos
            );

            return Ok(response);
        }

        [HttpGet("standalone-tree/{emitterId}")]
        public async Task<IActionResult> GetEmitterTree(int emitterId)
        {
            var result = await _service.GetEmitterTreeByIdAsync(emitterId);

            if (result == null)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    "Emitter not found",
                    null
                );
                return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
            }

            var successResponse = new ApiResponse<EmitterTreeDto>(
                HttpStatusCode.OK,
                "Emitter tree fetched successfully",
                result
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }
        

        [HttpGet("tree/{emitterId}")]
        public async Task<IActionResult> GetPlatformTree(int emitterId)
        {
            var result = await _service.GetWeaponEmitterTreeByIdAsync(emitterId);

            if (result == null)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    "Emittter not found",
                    null
                );
                return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
            }

            var successResponse = new ApiResponse<EmitterTreeDto>(
                HttpStatusCode.OK,
                "Emitter tree fetched successfully",
                result
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }


    }

}