using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models.StandaloneModels
{
    public class StandaloneModeFrequencyDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public float MinFrequency { get; set; }
        public float MaxFrequency { get; set; }
        public int FrequencyStaggerLevel { get; set; }
        public float FrequencyJitterMean { get; set; }
        public float FrequencyJitterPercentage { get; set; }

        //public float Deviation { get; set; }

        // 🔗 Many ModeFrequencyDetails → One StandaloneMode
        [ForeignKey("StandaloneMode")]
        public int StandaloneModeId { get; set; }
        public StandaloneMode StandaloneMode { get; set; }
    }
}
