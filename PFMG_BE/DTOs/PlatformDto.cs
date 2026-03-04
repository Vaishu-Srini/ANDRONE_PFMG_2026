using System;
using System.Text.Json.Serialization;
using PFMG.Enums;

namespace PFMG.DTOs
{
    public class PlatformDto
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

        public DateTime? CreatedAt { get; set; }
        public int UserId { get; set; }

        public int MissionId { get; set; }   // 🔗 Link to Mission
    }
}
