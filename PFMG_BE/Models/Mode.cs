using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models
{
    public class Mode
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ModeId { get; set; }

        [Required]
        [MaxLength(200)]
        public string ModeName { get; set; }
        public string Description { get; set; }

        [Required]
        public ModeType ModeType { get; set; }

        public ModePlatformType PlatformType { get; set; }

        public SubModeType SubMode { get; set; }

        public ModeThreatType ThreatType { get; set; }

        public ModeTestType TestType { get; set; }

        public short SymbolCodeType { get; set; }

        public string ModeSymbol { get; set; }
        public string BgColor { get; set; }
        public string FgColor { get; set; }

        public int EirpValue { get; set; }
        public int LethalRange { get; set; }

        public bool GroundOnly { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public string RangeEstimation { get; set; }
        public PriType PriType { get; set; }

        public RangeDiscreate PriClass { get; set; }

		public PwType PwType { get; set; }

		public RangeDiscreate PwClass { get; set; }

        public FrequencyType FrequencyType { get; set; }

        public RangeDiscreate FrequencyClass { get; set; }


        // 🔗 Many Modes → One Emitter
        [ForeignKey("Emitter")]
        public int EmitterId { get; set; }
        public Emitter Emitter { get; set; }

        public ICollection<ModeFrequencyDetail> ModeFrequencyDetails { get; set; } = new List<ModeFrequencyDetail>();

        public ICollection<ModePriDetail> ModePriDetails { get; set; } = new List<ModePriDetail>();

        public ICollection<ModeScanDetail> ModeScanDetails { get; set; } = new List<ModeScanDetail>();

        public ICollection<Jamming> Jammings { get; set; } = new List<Jamming>();

        public ICollection<ModePwDetail> ModePwDetails { get; set; } = new List<ModePwDetail>();





    }
}
