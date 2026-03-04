using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models.StandaloneModels
{
    public class PlatformLibrary
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PlatformId { get; set; }

        [Required]
        [MaxLength(200)]
        public string PlatformName { get; set; }

        [Required]
        public ThreatType ThreatType { get; set; }

        public int Priority { get; set; }

        public bool DisplayStatus { get; set; }

        [Required]
        public SymbolType SymbolCodeType { get; set; }

        public string AlternateSymbol { get; set; }

        public string ForeGroundColor { get; set; }

        public string BackGroundColor { get; set; }

        public string Description { get; set; }

        public byte[] ThumbnailImage { get; set; }

        public byte[] PreviewSymbol { get; set; }

        public DateTime CreatedAt { get; set; }

        // just storing user id, not linking to User
        public int UserId { get; set; }

        // 🔗 Foreign key to Platform
       
    }
}
