using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;
using PFMG.Models.StandaloneModels;

namespace PFMG.Models
{
    public class StandaloneMode
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StandaloneModeId { get; set; }

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

        public string RangeEstimation { get; set; }

        public int EirpValue { get; set; }
        public int LethalRange { get; set; }

        public bool GroundOnly { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }


        public PriType PriType { get; set; }

        public RangeDiscreate PriClass { get; set; }

		public PwType PwType { get; set; }

		public RangeDiscreate PwClass { get; set; }

        public FrequencyType FrequencyType { get; set; }

        public RangeDiscreate FrequencyClass { get; set; }


        [ForeignKey("StandaloneEmitter")]
        public int EmitterId { get; set; }
        public StandaloneEmitter StandaloneEmitter { get; set; }

        public ICollection<StandaloneModeFrequencyDetail> ModeFrequencyDetails { get; set; } = new List<StandaloneModeFrequencyDetail>();

        public ICollection<StandaloneModePriDetail> ModePriDetails { get; set; } = new List<StandaloneModePriDetail>();

        public ICollection<StandaloneModeScanDetail> ModeScanDetails { get; set; } = new List<StandaloneModeScanDetail>();

        public ICollection<StandaloneJamming> Jammings { get; set; } = new List<StandaloneJamming>();

        public ICollection<StandaloneModePwDetail> ModePwDetails { get; set; } = new List<StandaloneModePwDetail>();





    }
}
