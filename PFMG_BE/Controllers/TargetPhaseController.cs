using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;
using PFMG.DTOs;
using PFMG.Services;
using PFMG.Utilities;

namespace PFMG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TargetPhaseController : ControllerBase
    {
        private readonly ITargetPhaseService _service;

        public TargetPhaseController(ITargetPhaseService service)
        {
            _service = service;
        }

        


        [HttpPost("save-phase")]
        public async Task<IActionResult> SaveTargetPhase(TargetPhaseDto dto)
        {
            var result = await _service.SaveTargetPhase(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<TargetPhaseDto>(
                result.Data.PhaseId > 0 && dto.PhaseId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }
        
        [HttpGet("get-all-phases")]
        public async Task<IActionResult> GetAllTargetPhases()
        {
            var result = await _service.GetAllTargetPhases();

            var successResponse = new ApiResponse<IEnumerable<TargetPhaseDto>>(
                HttpStatusCode.OK,
                "phases retrieved successfully",
                result
            );

            return Ok(successResponse);
        }

        [HttpDelete("delete-phase/{id}")]
        public async Task<IActionResult> DeleteTargetPhase(int id)
        {
            var result = await _service.DeleteTargetPhase(id);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return BadRequest(errorResponse);
            }

            var successResponse = new ApiResponse<string>(
                HttpStatusCode.OK,
                result.Message,
                null
            );

            return Ok(successResponse);
        }


        [HttpPost("save-standalone-phase")]
        public async Task<IActionResult> SaveStandaloneTargetPhase(TargetPhaseDto dto)
        {
            var result = await _service.SaveStandaloneTargetPhase(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<TargetPhaseDto>(
                result.Data.PhaseId > 0 && dto.PhaseId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }
        
        [HttpGet("get-all-standalone-phases")]
        public async Task<IActionResult> GetAllStandaloneTargetPhases()
        {
            var result = await _service.GetAllStandaloneTargetPhases();

            var successResponse = new ApiResponse<IEnumerable<TargetPhaseDto>>(
                HttpStatusCode.OK,
                "phases retrieved successfully",
                result
            );

            return Ok(successResponse);
        }

        [HttpDelete("delete-standalone-phase/{id}")]
        public async Task<IActionResult> DeleteStandaloneTargetPhase(int id)
        {
            var result = await _service.DeleteStandaloneTargetPhase(id);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return BadRequest(errorResponse);
            }

            var successResponse = new ApiResponse<string>(
                HttpStatusCode.OK,
                result.Message,
                null
            );

            return Ok(successResponse);
        }


        [HttpPost("save-independent-mode-phase")]
        public async Task<IActionResult> SaveIndependentModeTargetPhase(TargetPhaseDto dto)
        {
            var result = await _service.SaveIndependentModeTargetPhase(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<TargetPhaseDto>(
                result.Data.PhaseId > 0 && dto.PhaseId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }
        
        [HttpGet("get-all-independent-mode-phases")]
        public async Task<IActionResult> GetAllIndependentModeTargetPhases()
        {
            var result = await _service.GetAllIndependentModeTargetPhases();

            var successResponse = new ApiResponse<IEnumerable<TargetPhaseDto>>(
                HttpStatusCode.OK,
                "phases retrieved successfully",
                result
            );

            return Ok(successResponse);
        }

        [HttpDelete("delete-independent-mode-phase/{id}")]
        public async Task<IActionResult> DeleteIndependentModeTargetPhase(int id)
        {
            var result = await _service.DeleteIndependentModeTargetPhase(id);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return BadRequest(errorResponse);
            }

            var successResponse = new ApiResponse<string>(
                HttpStatusCode.OK,
                result.Message,
                null
            );

            return Ok(successResponse);
        }


        [HttpPost("save-independent-phase")]
        public async Task<IActionResult> SaveIndependentTargetPhase(TargetPhaseDto dto)
        {
            var result = await _service.SaveIndependentTargetPhase(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<TargetPhaseDto>(
                result.Data.PhaseId > 0 && dto.PhaseId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }
        
        [HttpGet("get-all-independent-phases")]
        public async Task<IActionResult> GetAllIndependentTargetPhases()
        {
            var result = await _service.GetAllIndependentTargetPhases();

            var successResponse = new ApiResponse<IEnumerable<TargetPhaseDto>>(
                HttpStatusCode.OK,
                "phases retrieved successfully",
                result
            );

            return Ok(successResponse);
        }

        [HttpDelete("delete-independent-phase/{id}")]
        public async Task<IActionResult> DeleteIndependentTargetPhase(int id)
        {
            var result = await _service.DeleteIndependentTargetPhase(id);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return BadRequest(errorResponse);
            }

            var successResponse = new ApiResponse<string>(
                HttpStatusCode.OK,
                result.Message,
                null
            );

            return Ok(successResponse);
        }


    }
}
