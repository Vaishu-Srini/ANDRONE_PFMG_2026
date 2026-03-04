using PFMG.Enums;
using System.Text.Json.Serialization;

public class ModePriDetailDto
{
    public int Id { get; set; }
    
    public float MinPri { get; set; }
    public float MaxPri { get; set; }
	//public float Deviation { get; set; }
	public int PriStaggerLevel { get; set; }
	public float PriJitterMean { get; set; }
	public float PriJitterPercentage { get; set; }

}