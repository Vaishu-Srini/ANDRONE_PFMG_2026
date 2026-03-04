using PFMG.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PFMG.Models.StandaloneModels
{
    public class IndependentMode
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        
        public int IndependentModeId { get; set; }

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

        public ICollection<IndependentModeFrequencyDetail> ModeFrequencyDetails { get; set; } = new List<IndependentModeFrequencyDetail>();

        public ICollection<IndependentModePriDetail> ModePriDetails { get; set; } = new List<IndependentModePriDetail>();

        public ICollection<IndependentModeScanDetail> ModeScanDetails { get; set; } = new List<IndependentModeScanDetail>();

        public ICollection<IndependentModeJamming> Jammings { get; set; } = new List<IndependentModeJamming>();

        public ICollection<IndependentModePwDetail> ModePwDetails { get; set; } = new List<IndependentModePwDetail>();




    }
}