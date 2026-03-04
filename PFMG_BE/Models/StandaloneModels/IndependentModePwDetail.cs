using PFMG.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PFMG.Models.StandaloneModels
{
    public class IndependentModePwDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public float MinPw { get; set; }
        public float MaxPw { get; set; }
        public int PwStaggerLevel { get; set; }
        public float PwJitterMean { get; set; }
        public float PwJitterPercentage { get; set; }

        //public float Deviation { get; set; }

        // 🔗 Many ModePwDetails → One Mode
        [ForeignKey("IndependentMode")]

        public int IndependentModeId { get; set; }
        public IndependentMode IndependentMode { get; set; }
    }
}
