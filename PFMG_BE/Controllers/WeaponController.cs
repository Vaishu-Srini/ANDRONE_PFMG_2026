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
public class WeaponController : ControllerBase
{
    private readonly IWeaponService _service;

    public WeaponController(IWeaponService service)
    {
        _service = service;
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveWeapon(WeaponDto dto)
    {
        Console.WriteLine("Weapon saved successfully!");
        var result = await _service.SaveWeaponAsync(dto);


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
        var successResponse = new ApiResponse<WeaponDto>(
            result.Data.WeaponId > 0 && dto.WeaponId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
            result.Message,
            result.Data
        );

        return StatusCode(successResponse.StatusCode, successResponse);
    }

    // ✅ Get All
    [HttpGet("all")]
    public async Task<IActionResult> GetAllWeapons()
    {
        var result = await _service.GetAllWeaponsAsync();

        var response = new ApiResponse<IEnumerable<WeaponDto>>(
            HttpStatusCode.OK,
            "Weapons retrieved successfully",
            result
        );

        return Ok(response);
    }

    // ✅ Delete
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlatform(int id)
    {
        var result = await _service.DeleteWeaponAsync(id);

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

    [HttpGet("tree/{weaponId}")]
    public async Task<IActionResult> GetPlatformTree(int weaponId)
    {
        var result = await _service.GetWeaponTreeByIdAsync(weaponId);

        if (result == null)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.NotFound,
                "Weapon not found",
                null
            );
            return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
        }

        var successResponse = new ApiResponse<WeaponTreeDto>(
            HttpStatusCode.OK,
            "Weapon tree fetched successfully",
            result
        );

        return StatusCode(successResponse.StatusCode, successResponse);
    }

    // [HttpPost("standalone/save")]
    // public async Task<IActionResult> SaveStandalonePlatform(WeaponDto dto)
    // {
    //     Console.WriteLine("Weapon saved successfully!");
    //     var result = await _service.SaveStandaloneWeapon(dto);


    //     if (!result.Success)
    //     {
    //         var errorResponse = new ApiResponse<string>(
    //             HttpStatusCode.BadRequest,
    //             result.Message,
    //             null
    //         );
    //         return StatusCode((int)HttpStatusCode.BadRequest, errorResponse);
    //     }

    //     // ✅ Use DB saved result instead of input dto
    //     var successResponse = new ApiResponse<PFMG.DTOs.PlatformDto>(
    //         result.Data.PlatformId > 0 && dto.PlatformId == 0 ? HttpStatusCode.Created : HttpStatusCode.OK,
    //         result.Message,
    //         result.Data
    //     );

    //     return StatusCode(successResponse.StatusCode, successResponse);
    // }

    // [HttpGet("standalone/all")]
    // public async Task<IActionResult> GetAllPlatformLibraries()
    // {
    //     var result = await _service.GetAllPlatformsLibraryAsync();

    //     var response = new ApiResponse<IEnumerable<PlatformDto>>(
    //         HttpStatusCode.OK,
    //         "Standalone platforms retrieved successfully",
    //         result
    //     );

    //     return Ok(response);
    // }

    


}
