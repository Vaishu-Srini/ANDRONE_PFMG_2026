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
public class PlatformController : ControllerBase
{
    private readonly IPlatformService _service;

    public PlatformController(IPlatformService service)
    {
        _service = service;
    }

    [HttpPost("save")]
    public async Task<IActionResult> SavePlatform(PFMG.DTOs.PlatformDto dto)
    {
        Console.WriteLine("Platform saved successfully!");
        var result = await _service.SavePlatformAsync(dto);


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
        var successResponse = new ApiResponse<PFMG.DTOs.PlatformDto>(
            result.Data.PlatformId > 0 && dto.PlatformId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
            result.Message,
            result.Data
        );

        return StatusCode(successResponse.StatusCode, successResponse);
    }

    // ✅ Get All
    [HttpGet("all")]
    public async Task<IActionResult> GetAllPlatforms()
    {
        var result = await _service.GetAllPlatformsAsync();

        var response = new ApiResponse<IEnumerable<PlatformDto>>(
            HttpStatusCode.OK,
            "Platforms retrieved successfully",
            result
        );

        return Ok(response);
    }

    // ✅ Delete
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlatform(int id)
    {
        var result = await _service.DeletePlatformAsync(id);

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

    // [HttpGet("tree/{platformId}")]
    // public async Task<IActionResult> GetPlatformTree(int platformId)
    // {
    //     var result = await _service.GetPlatformTreeByIdAsync(platformId);

    //     if (result == null)
    //     {
    //         var errorResponse = new ApiResponse<string>(
    //             HttpStatusCode.NotFound,
    //             "Platform not found",
    //             null
    //         );
    //         return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
    //     }

    //     var successResponse = new ApiResponse<PlatformTreeDto>(
    //         HttpStatusCode.OK,
    //         "Platform tree fetched successfully",
    //         result
    //     );

    //     return StatusCode(successResponse.StatusCode, successResponse);
    // }

    [HttpPost("standalone/save")]
    public async Task<IActionResult> SaveStandalonePlatform(PlatformDto dto)
    {
        Console.WriteLine("Platform saved successfully!");
        var result = await _service.SaveStandalonePlatform(dto);


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
        var successResponse = new ApiResponse<PFMG.DTOs.PlatformDto>(
            result.Data.PlatformId > 0 && dto.PlatformId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
            result.Message,
            result.Data
        );

        return StatusCode(successResponse.StatusCode, successResponse);
    }

    [HttpGet("standalone/all")]
    public async Task<IActionResult> GetAllPlatformLibraries()
    {
        var result = await _service.GetAllPlatformsLibraryAsync();

        var response = new ApiResponse<IEnumerable<PlatformDto>>(
            HttpStatusCode.OK,
            "Standalone platforms retrieved successfully",
            result
        );

        return Ok(response);
    }

    


}
