using Microsoft.AspNetCore.Mvc;
using PFMG.Services.impl;
using System.Runtime.CompilerServices;

namespace PFMG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightPathController : ControllerBase
    {
        private readonly CsvWebSocketService _csvService;
        public FlightPathController(CsvWebSocketService csvService)
        {
            _csvService = csvService;
        }

        [HttpPost("stream-data")]
        public async Task<IActionResult> StreamCsvData([FromBody] CsvFileRequest request)
        {
            if (string.IsNullOrEmpty(request.CsvFilePath) || !System.IO.File.Exists(request.CsvFilePath))
            
                return BadRequest("Invalid or missing file path");

                await _csvService.StreamCsvDataAsync(request.CsvFilePath);
                return Ok("Csv data sent successfully");

            
        }
        public class CsvFileRequest
        {
            public string CsvFilePath { get; set; }
        }
    }
}
