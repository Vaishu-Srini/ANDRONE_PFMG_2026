using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models
{
    public class ModePriDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public float MinPri { get; set; }
        public float MaxPri { get; set; }

        //public float Deviation { get; set; }
        public int PriStaggerLevel { get; set; }
        public float PriJitterMean { get; set; }
        public float PriJitterPercentage { get; set; }

        // 🔗 Many ModePriDetails → One Mode
        [ForeignKey("Mode")]
        public int ModeId { get; set; }
        public Mode Mode { get; set; }
    }
}
