using PFMG.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PFMG.Models.StandaloneModels
{
    public class IndependentModeFrequencyDetail
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int FrequencyStaggerLevel { get; set; }
        public float FrequencyJitterMean { get; set; }
        public float FrequencyJitterPercentage { get; set; }
        public float MinFrequency { get; set; }
        public float MaxFrequency { get; set; }

        //public float Deviation { get; set; }

        // 🔗 Many ModeFrequencyDetails → One StandaloneMode
        [ForeignKey("IndependentMode")]
        public int IndependentModeId { get; set; }
        public IndependentMode IndependentMode { get; set; }
    }
}

