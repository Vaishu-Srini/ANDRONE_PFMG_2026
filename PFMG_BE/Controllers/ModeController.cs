using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using PFMG.DTOs;
using PFMG.Services;
using PFMG.Utilities;
using System.Net;
using System.Collections.Generic;

namespace PFMG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModeController : ControllerBase
    {
        private readonly IModeService _service;

        public ModeController(IModeService service)
        {
            _service = service;
        }

        // ✅ Create or Update (one API)
        [HttpPost("save")]
        public async Task<IActionResult> SaveMode(ModeDto dto)
        {

            

            var result = await _service.SaveModeAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<ModeDto>(
                result.Data.ModeId > 0 && dto.ModeId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }

        // ✅ Get all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllModes()
        {
            var modes = await _service.GetAllModesAsync();
            var response = new ApiResponse<IEnumerable<ModeDto>>(
                HttpStatusCode.OK,
                "Modes retrieved successfully",
                modes
            );
            return Ok(response);
        }

        // ✅ Delete by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMode(int id)
        {
            var result = await _service.DeleteModeAsync(id);

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
        public async Task<IActionResult> SaveStandaloneMode(ModeDto dto)
        {
            var result = await _service.SaveStandaloneModeAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<ModeDto>(
                result.Data.ModeId > 0 && dto.ModeId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }


        // ✅ Delete by id
        [HttpDelete("delete-standalone/{id}")]
        public async Task<IActionResult> DeleteStandaloneMode(int id)
        {
            var result = await _service.DeleteStandaloneModeAsync(id);

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


        // ✅ Get all
        [HttpGet("standalone/all")]
        public async Task<IActionResult> GetAllStandaloneModesAsync()
        {
            var modes = await _service.GetAllStandaloneModesAsync();
            var response = new ApiResponse<IEnumerable<ModeDto>>(
                HttpStatusCode.OK,
                "Modes retrieved successfully",
                modes
            );
            return Ok(response);
        }

        [HttpPost("independent/save")]
        public async Task<IActionResult> SaveIndependentMode(IndependentModeDto dto)
        {
            var result = await _service.SaveIndependentModeAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<IndependentModeDto>(
                result.Data.ModeId > 0 && dto.ModeId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }


        // ✅ Get all
        [HttpGet("independent/all")]
        public async Task<IActionResult> GetAllIndependentModesAsync()
        {
            var modes = await _service.GetAllIndependentModesAsync();
            var response = new ApiResponse<IEnumerable<IndependentModeDto>>(
                HttpStatusCode.OK,
                "Modes retrieved successfully",
                modes
            );
            return Ok(response);
        }


        [HttpGet("standalone-tree/{modeId}")]
        public async Task<IActionResult> GetStandaloneModeTreeByIdAsync(int modeId)
        {
            var result = await _service.GetStandaloneModeTreeByIdAsync(modeId);

            if (result == null)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    "Mode not found",
                    null
                );
                return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
            }

            var successResponse = new ApiResponse<ModeTreeDto>(
                HttpStatusCode.OK,
                "Mode tree fetched successfully",
                result
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }


        [HttpGet("independent-tree/{modeId}")]
        public async Task<IActionResult> GetEmitterTree(int modeId)
        {
            var result = await _service.GetModeTreeByIdAsync(modeId);

            if (result == null)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    "Mode not found",
                    null
                );
                return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
            }

            var successResponse = new ApiResponse<ModeTreeDto>(
                HttpStatusCode.OK,
                "Mode tree fetched successfully",
                result
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }

        // ✅ Delete by id
        [HttpDelete("delete-independent/{id}")]
        public async Task<IActionResult> DeleteIndependenMode(int id)
        {
            var result = await _service.DeleteIndependenModeAsync(id);

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


        [HttpGet("mode-tree/{modeId}")]
        public async Task<IActionResult> GetWeaponModeTree(int modeId)
        {
            var result = await _service.GetWeaponModeTreeByIdAsync(modeId);

            if (result == null)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    "Mode not found",
                    null
                );
                return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
            }

            var successResponse = new ApiResponse<ModeTreeDto>(
                HttpStatusCode.OK,
                "Mode tree fetched successfully",
                result
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }
    }
}
