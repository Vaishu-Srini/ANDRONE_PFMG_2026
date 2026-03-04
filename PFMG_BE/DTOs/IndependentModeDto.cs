using PFMG.Enums;
using System.Text.Json.Serialization;

namespace PFMG.DTOs
{
    public class IndependentModeDto
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
        public string BgColor { get; set; }
        public string FgColor { get; set; }
        public int EirpValue { get; set; }

        public string RangeEstimation { get; set; }
        public int LethalRange { get; set; }
        public bool GroundOnly { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
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



        // Nested child collections
        public List<ModeFrequencyDetailDto> ModeFrequencyDetails { get; set; } = new();
        public List<ModePriDetailDto> ModePriDetails { get; set; } = new();
        public List<ModePwDetailDto> ModePwDetails { get; set; } = new();
        public List<ModeScanDetailDto> ModeScanDetails { get; set; } = new();

    }
}