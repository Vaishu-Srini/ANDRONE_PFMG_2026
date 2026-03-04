
using Microsoft.AspNetCore.Mvc;
using PFMG.Services;

using System.Net;

using PFMG.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Text;
[ApiController]
[Route("api/[controller]")]
public class PfmController : ControllerBase
{
    private readonly IPfmService _pfmService;

    private readonly PfmGenerationService _pfmGenerationService;
    private readonly ILogger<PfmController> _logger;


    public PfmController(IPfmService pfmService, ILogger<PfmController> logger, PfmGenerationService pfmGenerationService)
    {
        _pfmService = pfmService;
        _logger = logger;
        _pfmGenerationService = pfmGenerationService;
    }

    // [HttpPost("generate")]
    // public async Task<IActionResult> Generate([FromBody] GeneratePfmRequest req)
    // {
    //     if (req == null || req.MissionId <= 0) return BadRequest("missionId required");

    //     try
    //     {
    //         var result = await _pfmService.GenerateAndSendAsync(req.MissionId, ct);
    //         if (!result.Success)
    //             return StatusCode(StatusCodes.Status500InternalServerError, new { result.Message });

    //         return Ok(new { result.Message });
    //     }
    //     catch (OperationCanceledException)
    //     {
    //         _logger.LogWarning("PFM generation canceled for mission {MissionId}", req.MissionId);
    //         return StatusCode(StatusCodes.Status499ClientClosedRequest, "Request canceled");
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, "Error generating/sending PFM for mission {MissionId}", req.MissionId);
    //         return StatusCode(StatusCodes.Status500InternalServerError, "Internal error");
    //     }
    // }


    // [HttpGet("pfm-generation/{missionId}")]
    // public async Task<IActionResult> GetPfmGeneration(int missionId)
    // {
    //     // Call the service
    //     var result = await _pfmService.GetPfmGeneration(missionId);

    //     if (!result.Success || result.FileContent == null || result.FileContent.Length == 0)
    //     {
    //         var errorResponse = new ApiResponse<string>(
    //             HttpStatusCode.NotFound,
    //             result.Message ?? "CSV generation failed",
    //             null
    //         );
    //         return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
    //     }

    //     // Return CSV file as download
    //     return File(result.FileContent, "text/csv", $"mission_{missionId}_emitters.csv");
    // }

    [HttpGet("pfm-generation/{missionId}")]
    public async Task<IActionResult> GetPfmGeneration(int missionId)
    {
        // var result = await _pfmService.GetPfmGeneration(missionId);
        var result = await _pfmGenerationService.GetPfmGeneration(missionId);

        if (!result.Success || result.FileContent == null || result.FileContent.Length == 0)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.NotFound,
                result.Message ?? "File generation failed",
                null
            );
            return StatusCode((int)HttpStatusCode.NotFound, errorResponse);
        }

        return File(
            result.FileContent,
            "application/zip",   // ✅ Correct MIME Type for ZIP
            result.FileName      // ✅ Use file name returned from service
        );
    }



    
}
