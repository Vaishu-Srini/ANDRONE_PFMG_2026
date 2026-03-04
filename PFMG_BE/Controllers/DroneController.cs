using Microsoft.AspNetCore.Mvc;
using PFMG.DTOs;
using PFMG.Services;
using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;
using PFMG.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Text;
using PFMG.Data;
using PFMG.Models;


[ApiController]
[Route("api/[controller]")]
public class DroneController : ControllerBase
{
    private readonly AppDbContext _context;

    private readonly TcpCsvSender _tcpCsvSender;

    public DroneController(AppDbContext context, TcpCsvSender tcpCsvSender)
    {
        _context = context;
        _tcpCsvSender = tcpCsvSender;
    }

    [HttpPost("save/{status}")]
    public async Task<IActionResult> SaveDroneStatus(bool status)
    {
        try
    {
        
        // Determine data string
        string statusData = status ? "GROUND" : "FLIGHT";

            // --- Send TCP message ---
        
        try { await _tcpCsvSender.SendDroneStatusAsync(status); }
        catch (Exception ex) { Console.WriteLine($"TCP send failed: {ex.Message}"); }
        // Check if a record already exists
            var existingDroneStatus = _context.drones.FirstOrDefault();

        if (existingDroneStatus != null)
        {
            // Update the existing record
            existingDroneStatus.Status = status;
            _context.drones.Update(existingDroneStatus);
            await _context.SaveChangesAsync();

            var updateResponse = new ApiResponse<DroneStatus>(
                HttpStatusCode.OK,
                "Drone status updated successfully.",
                existingDroneStatus
            );

            return Ok(updateResponse);
        }

        // If no record exists, create a new one
        var newDroneStatus = new DroneStatus
        {
            Status = status
        };

        _context.drones.Add(newDroneStatus);
        await _context.SaveChangesAsync();

        var createResponse = new ApiResponse<DroneStatus>(
            HttpStatusCode.Created,
            "Drone status saved successfully.",
            newDroneStatus
        );

        return StatusCode((int)HttpStatusCode.Created, createResponse);
    }
    catch (Exception ex)
    {
        var errorResponse = new ApiResponse<string>(
            HttpStatusCode.InternalServerError,
            $"Error saving drone status: {ex.Message}",
            null
        );

        return StatusCode((int)HttpStatusCode.InternalServerError, errorResponse);
    }
}

     // ✅ GET API — Get Latest Drone Status
    [HttpGet("drone-status")]
    public IActionResult GetLatestDroneStatus()
    {
        try
        {

            var latestStatus = _context.drones
                .OrderByDescending(d => d.DroneId)
                .FirstOrDefault();

            if (latestStatus == null)
            {
                var notFoundResponse = new ApiResponse<string>(
                    HttpStatusCode.NotFound,
                    "No drone status found.",
                    null
                );
                return StatusCode((int)HttpStatusCode.NotFound, notFoundResponse);
            }

            var successResponse = new ApiResponse<DroneStatus>(
                HttpStatusCode.OK,
                "Latest drone status fetched successfully.",
                latestStatus
            );

            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.InternalServerError,
                $"Error fetching drone status: {ex.Message}",
                null
            );

            return StatusCode((int)HttpStatusCode.InternalServerError, errorResponse);
        }
    }

}
    

    




