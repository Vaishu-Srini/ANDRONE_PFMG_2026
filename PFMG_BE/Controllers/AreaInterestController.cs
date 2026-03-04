using Microsoft.AspNetCore.Mvc;
using PFMG.DTOs;
using PFMG.Services;
using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;
using PFMG.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AreaInterestController : ControllerBase
{
    private readonly IAreaInterestService _service;

    public AreaInterestController(IAreaInterestService service)
    {
        _service = service;
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveAreaInterest(AreaInterestDto dto)
    {
        Console.WriteLine("Area interest saved successfully!");
        var result = await _service.SaveAreaInterestAsync(dto);


        if (!result.Success)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.BadRequest,
                result.Message,
                null
            );
            return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
        }

        // ✅ Use DB saved result instead of input dto
        var successResponse = new ApiResponse<PFMG.DTOs.AreaInterestDto>(
            result.Data.AreaInterestId > 0 && dto.AreaInterestId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
            result.Message,
            result.Data
        );

        return StatusCode(successResponse.StatusCode, successResponse);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllAreaInterestAsync()
    {
        var result = await _service.GetAllAreaInterestAsync();

        if (result == null || !result.Any())
        {
            var notFoundResponse = new ApiResponse<IEnumerable<AreaInterestDto>>(
                HttpStatusCode.NotFound,
                "Area not found",
                new List<AreaInterestDto>() // empty list
            );

            return NotFound(notFoundResponse);
        }

        var response = new ApiResponse<IEnumerable<AreaInterestDto>>(
            HttpStatusCode.OK,
            "AreaInterest retrieved successfully",
            result
        );

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByAreaId(int id)
    {
        var areaInterest = await _service.GetByAreaIdAsync(id);

        if (areaInterest == null)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.NotFound,
                "Area not found",
                null
            );
            return NotFound(errorResponse);
        }

        var successResponse = new ApiResponse<AreaInterestDto>(
            HttpStatusCode.OK,
            "Area retrieved successfully",
            areaInterest
        );

        return Ok(successResponse);
    }




    // ✅ Delete
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAreaInterest(int id)
    {
        var result = await _service.DeleteAreaInterestAsync(id);

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
    

    [HttpGet("getEmittersInArea/{MissionId}")]
    public async Task<IActionResult> GetEmittersInArea(int MissionId)
    {
        try
        {
            var result = await _service.GetEmitterInAreaAsync(MissionId);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.BadRequest,
                ex.Message,
                null
            );
            return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.InternalServerError,
                $"Internal server error: {ex.Message}",
                null
            );
            return StatusCode((int)HttpStatusCode.InternalServerError, errorResponse);
        }
    }



}
