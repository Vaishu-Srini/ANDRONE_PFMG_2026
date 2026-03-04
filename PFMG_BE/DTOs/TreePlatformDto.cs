

using PFMG.DTOs;
using PFMG.Enums;
using System.Text.Json.Serialization;


public class MissionTreeDto
{
    public int MissionId { get; set; }
    public string MissionName { get; set; }
    
    public string Description { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public MissionType MissionType { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public MissionsStatus Status { get; set; }
    public int UserId { get; set; }

    public List<ResponseAreaInterestDto> AreaInterests { get; set; }  = new List<ResponseAreaInterestDto>();


    public List<PlatformTreeDto> Platforms { get; set; } = new();
}

public class PlatformTreeDto
{
    public int PlatformId { get; set; }
    public string PlatformName { get; set; }
    public ThreatType ThreatType { get; set; }
    public int Priority { get; set; }
    public bool DisplayStatus { get; set; }
    public SymbolType SymbolCodeType { get; set; }
    public string AlternateSymbol { get; set; }
    public string ForeGroundColor { get; set; }
    public string BackGroundColor { get; set; }
    public string Description { get; set; }

    // Binary data usually represented as Base64 in JSON
    public byte[]? ThumbnailImage { get; set; }
    public byte[]? PreviewSymbol { get; set; }

    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
   
}



public class WeaponTreeDto
{
    public int WeaponId { get; set; }

    public string WeaponName { get; set; }
    public DateTime WeaponDate { get; set; }

    public string CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public string ModifiedBy { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ThreatType ThreatType { get; set; }

    public string ForeGroundColor { get; set; }

    public string BackGroundColor { get; set; }

    public string Symbol { get; set; }

    public bool DisplayStatus { get; set; }

    public int Priority { get; set; }

       

    public DateTime ModifiedDate { get; set; }

    public string Description { get; set; }
    public List<EmitterTreeDto> Emitters { get; set; } = new();
}

public class EmitterTreeDto
{
    public int EmitterId { get; set; }


    public string EmitterName { get; set; }

    public string Description { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public EmitterType EmitterType { get; set; }

    public string Symbol { get; set; }


    public string ForegroundColor { get; set; }
    public string BackgroundColor { get; set; }

    public bool IsUnknown { get; set; }
    public bool IsGroundOnly { get; set; }


    public string CreatedBy { get; set; }
    public DateTime DateCreated { get; set; }

    public string ModifiedBy { get; set; }
    public DateTime ModifiedDate { get; set; }


    public string Latitude { get; set; }
    public string Longitude { get; set; }


    public List<ModeTreeDto> Modes { get; set; } = new();
}

public class ModeTreeDto
{
    public int ModeId { get; set; }
    public string ModeName { get; set; }
    public string Description { get; set; }
  
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ModeType ModeType { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ModePlatformType PlatformType { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]    
    public SubModeType SubMode { get; set; }
    public ModeThreatType ThreatType { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ModeTestType TestType { get; set; }
    public short SymbolCodeType { get; set; }
    public string ModeSymbol { get; set; }
    public string RangeEstimation { get; set; }
    public string BgColor { get; set; }
    public string FgColor { get; set; }
    public int EirpValue { get; set; }
    public int LethalRange { get; set; }
    public bool GroundOnly { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
    public string? ModifiedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public int EmitterId { get; set; }   // 🔗 Link to Emitter
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public PriType PriType { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public RangeDiscreate PriClass { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public PwType PwType { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public RangeDiscreate PwClass { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public FrequencyType FrequencyType { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public RangeDiscreate FrequencyClass { get; set; }

// mode children
    //public List<ModeDfDto> ModeDfs { get; set; } = new();
    public List<ModeFrequencyDetailDto> ModeFrequencyDetails { get; set; } = new();
    //public List<ModeFrequencyRangeDto> ModeFrequencyRanges { get; set; } = new();
    //public List<ModeLssDetailDto> ModeLssDetails { get; set; } = new();
    public List<ModePriDetailDto> ModePriDetails { get; set; } = new();
    //public List<ModePriRangeDto> ModePriRanges { get; set; } = new();
    //public List<ModePriPwRangeDto> ModePriPwRanges { get; set; } = new();
    //public List<ModePriStaggerLevelDto> ModePriStaggerLevels { get; set; } = new();
    public List<ModePwDetailDto> ModePwDetails { get; set; } = new();
    public List<ModeScanDetailDto> ModeScanDetails { get; set; } = new();

    // jammings
    public List<JammingDto> Jammings { get; set; } = new();
}
