
using PFMG.Enums;
using System.Text.Json.Serialization;

public class ModeScanDetailDto
{
    public int Id { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]    

    public ModeScanType ScanType { get; set; }
    public float MinScanSector { get; set; }
    public float MaxScanSector { get; set; }
    public float MinScanRate { get; set; }
    public float MaxScanRate { get; set; }
    public float NominalScanRate { get; set; }
    public float SideLobeLevel { get; set; }
    public float SideLobeStd { get; set; }
    public float MinBeamWidth { get; set; }
    public float MaxBeamWidth { get; set; }
    public float CalculatedTot { get; set; }
    public float MinTot { get; set; }
    public float MaxTot { get; set; }
}