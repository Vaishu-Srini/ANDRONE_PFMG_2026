using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace PFMG.Services.impl
{
    public class CsvWebSocketService
    {
        private readonly WebSocketHandler _wsHandler;
        private readonly ILogger<CsvWebSocketService> _logger;

        public CsvWebSocketService(WebSocketHandler wsHandler, ILogger<CsvWebSocketService> logger)
        {
            _wsHandler = wsHandler;
            _logger = logger;
        }

        public async Task StreamCsvDataAsync(string filePath)
        {
            try
            {
                using var reader = new StreamReader(filePath);
                var header = (await reader.ReadLineAsync())?.Split(',') ?? [];
                if (header.Length == 0)
                {
                    _logger.LogWarning("CSV header not found.");
                    return;
                }

                var indices = new Dictionary<string, int>
                {
                    ["AOA"] = Array.IndexOf(header, "AOA"),
                    ["Emitter"] = Array.IndexOf(header, "Emitter"),
                    ["EmitterRange"] = Array.IndexOf(header, "EmitterRange"),
                    ["Lat"] = Array.IndexOf(header, "Lat"),
                    ["Long"] = Array.IndexOf(header, "Long"),
                    ["TrueHeading_pi_rad"] = Array.IndexOf(header, "TrueHeading_pi_rad")
                };

                string? line;
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    var values = line.Split(',');

                    var jsonData = new
                    {
                        AOA = values[indices["AOA"]],
                        Emitter = values[indices["Emitter"]],
                        EmitterRange = values[indices["EmitterRange"]],
                        Lat = values[indices["Lat"]],
                        Long = values[indices["Long"]],
                        TrueHeadingPiRad = values[indices["TrueHeading_pi_rad"]]
                    };

                    string json = JsonSerializer.Serialize(jsonData);
                    await _wsHandler.SendMessageToAllAsync(json);
                    _logger.LogInformation($"Sent: {json}");

                    await Task.Delay(150); 
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error streaming CSV.");
            }
        }
    }
}