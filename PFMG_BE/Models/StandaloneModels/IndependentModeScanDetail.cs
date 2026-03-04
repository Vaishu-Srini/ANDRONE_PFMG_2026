using PFMG.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PFMG.Models.StandaloneModels
{
    public class IndependentModeScanDetail
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public ModeScanType ScanType { get; set; }

        public float MinScanSector { get; set; }
        public float MaxScanSector { get; set; }

        public float MinScanRate { get; set; }
        public float MaxScanRate { get; set; }

        public float NominalScanRate { get; set; }

        public float SideLobeLevel { get; set; }
        public float SideLobeStd { get; set; }

        public float MinBeamWidth { get; set; }
        public float MaxBeamWidth { get; set; }

        public float CalculatedTot { get; set; }
        public float MinTot { get; set; }
        public float MaxTot { get; set; }

        // 🔗 Many ModeScanDetails → One StandaloneMode
        [ForeignKey("IndependentMode")]
        public int IndependentModeId { get; set; }
        public IndependentMode IndependentMode { get; set; }
    }
}
