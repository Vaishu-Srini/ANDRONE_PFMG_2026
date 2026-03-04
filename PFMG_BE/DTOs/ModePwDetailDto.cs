using PFMG.Enums;
using System.Text.Json.Serialization;


public class ModePwDetailDto
{
    public int Id { get; set; }
    
    public float MinPw { get; set; }
    public float MaxPw { get; set; }
    //public float Deviation { get; set; }
    public int PwStaggerLevel { get; set; }
    public float PwJitterMean { get; set; }
    public float PwJitterPercentage { get; set; }
}
