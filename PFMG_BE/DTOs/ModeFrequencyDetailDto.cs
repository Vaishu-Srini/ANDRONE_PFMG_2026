using PFMG.Enums;
using System.Text.Json.Serialization;

public class ModeFrequencyDetailDto
{
    public int Id { get; set; }
    
    public float MinFrequency { get; set; }
    public float MaxFrequency { get; set; }
    //public float Deviation { get; set; }
    public int FrequencyStaggerLevel { get; set; }
    public float FrequencyJitterMean { get; set; }
    public float FrequencyJitterPercentage { get; set; }
}
