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
public class MissionController : ControllerBase
{
    private readonly IMissionService _service;

    public MissionController(IMissionService service)
    {
        _service = service;
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveMission(MissionDto dto)
    {
        Console.WriteLine("Mission saved successfully!");
        var result = await _service.SaveMissionAsync(dto);


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
        var successResponse = new ApiResponse<PFMG.DTOs.MissionDto>(
            result.Data.MissionId > 0 && dto.MissionId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
            result.Message,
            result.Data
        );

        return StatusCode(successResponse.StatusCode, successResponse);
    }

    // ✅ Get All
    [HttpGet("all")]
    public async Task<IActionResult> GetAllMissionsAsync()
    {
        var result = await _service.GetAllMissionsAsync();

        var response = new ApiResponse<IEnumerable<MissionDto>>(
            HttpStatusCode.OK,
            "Missions retrieved successfully",
            result
        );

        return Ok(response);
    }

    // ✅ Delete
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMission(int id)
    {
        var result = await _service.DeleteMissionAsync(id);

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

    [HttpGet("tree/{missionId}")]
    public async Task<IActionResult> GetMissionTree(int missionId)
    {
        var result = await _service.GetMissionTreeByIdAsync(missionId);

        if (result == null)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.NotFound,
                "Mission not found",
                null
            );
            return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
        }

        var successResponse = new ApiResponse<MissionTreeDto>(
            HttpStatusCode.OK,
            "Mission tree fetched successfully",
            result
        );

        return StatusCode(successResponse.StatusCode, successResponse);
    }

    // [HttpPost("getEmittersInArea")]
    // public IActionResult GetEmittersInArea([FromBody] AreaInterestDto area)
    // {
    //     var emittersInArea = _emitters
    //         .Where(e => GeoHelper.IsPointInPolygon(e.Latitude, e.Longitude, area.Coordinates))
    //         .ToList();

    //     return Ok(emittersInArea);
    // }




}
