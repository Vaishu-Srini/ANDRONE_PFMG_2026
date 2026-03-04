using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models
{
    public class ModeFrequencyDetail
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

        // 🔗 Many ModeFrequencyDetails → One Mode
        [ForeignKey("Mode")]
        public int ModeId { get; set; }
        public Mode Mode { get; set; }
    }
}
