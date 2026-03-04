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
    public class JammingController : ControllerBase
    {
        private readonly IJammingService _service;

        public JammingController(IJammingService service)
        {
            _service = service;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveJamming(JammingDto dto)
        {
            var result = await _service.SaveJammingAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<JammingDto>(
                result.Data.JammingId > 0 && dto.JammingId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var jamming = await _service.GetByIdAsync(id);

            if (jamming == null)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    "Jamming not found",
                    null
                );
                return NotFound(errorResponse);
            }

            var successResponse = new ApiResponse<JammingDto>(
                HttpStatusCode.OK,
                "Jamming retrieved successfully",
                jamming
            );

            return Ok(successResponse);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var jammings = await _service.GetAllJammingsAsync();

            var successResponse = new ApiResponse<IEnumerable<JammingDto>>(
                HttpStatusCode.OK,
                "Jammings retrieved successfully",
                jammings
            );

            return Ok(successResponse);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteJammingAsync(id);

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


        

        [HttpPost("standalone/save")]
        public async Task<IActionResult> SaveStandaloneJamming(JammingDto dto)
        {
            var result = await _service.SaveStandaloneJammingAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<JammingDto>(
                result.Data.JammingId > 0 && dto.JammingId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }

        [HttpGet("standalone/all")]
        public async Task<IActionResult> GetAllStandaloneJammings()
        {
            var jammings = await _service.GetAllStandaloneJammingsAsync();

            var successResponse = new ApiResponse<IEnumerable<JammingDto>>(
                HttpStatusCode.OK,
                "Jammings retrieved successfully",
                jammings
            );

            return Ok(successResponse);
        }


        [HttpDelete("delete-standalone/{id}")]
        public async Task<IActionResult> DeleteStandaloneJamming(int id)
        {
            var result = await _service.DeleteStandaloneJammingAsync(id);

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


       
        
        [HttpPost("independent-mode-jamming/save")]
        public async Task<IActionResult> SaveModeIndependentJamming(JammingDto dto)
        {
            var result = await _service.SaveIndependentModeJammingAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<JammingDto>(
                result.Data.JammingId > 0 && dto.JammingId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }
        
        [HttpGet("independent-mode-jamming/all")]
        public async Task<IActionResult> GetAllModeIndependentJammings()
        {
            var jammings = await _service.GetAllIndependentModeJammingsAsync();

            var successResponse = new ApiResponse<IEnumerable<JammingDto>>(
                HttpStatusCode.OK,
                "Jammings retrieved successfully",
                jammings
            );

            return Ok(successResponse);
        }

        

        [HttpDelete("delete-independent-mode-jamming/{id}")]
        public async Task<IActionResult> DeleteIndependentModeJamming(int id)
        {
            var result = await _service.DeleteIndependentModeJammingAsync(id);

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
        


        [HttpPost("independent/save")]
        public async Task<IActionResult> SaveIndependentJamming(JammingDto dto)
        {
            var result = await _service.SaveIndependentJammingAsync(dto);

            if (!result.Success)
            {
                var errorResponse = new ApiResponse<string>(
                    HttpStatusCode.BadRequest,
                    result.Message,
                    null
                );
                return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
            }

            var successResponse = new ApiResponse<JammingDto>(
                result.Data.JammingId > 0 && dto.JammingId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
                result.Message,
                result.Data
            );

            return StatusCode(successResponse.StatusCode, successResponse);
        }
        
        [HttpGet("independent/all")]
        public async Task<IActionResult> GetAllIndependentJammings()
        {
            var jammings = await _service.GetAllIndependentJammingsAsync();

            var successResponse = new ApiResponse<IEnumerable<JammingDto>>(
                HttpStatusCode.OK,
                "Jammings retrieved successfully",
                jammings
            );

            return Ok(successResponse);
        }


        [HttpGet("independent/{id}")]
        public async Task<IActionResult> GetAllModeIndependentJammings(int id)
        {
            var jamming = await _service.GetIndependentJammingsAsync(id);

            var successResponse = new ApiResponse<JammingDto>(
                HttpStatusCode.OK,
                "Jamming retrieved successfully",
                jamming
            );

            return Ok(jamming);
        }

        [HttpDelete("delete-independent/{id}")]
        public async Task<IActionResult> DeleteIndependentJamming(int id)
        {
            var result = await _service.DeleteIndependentJammingAsync(id);

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
