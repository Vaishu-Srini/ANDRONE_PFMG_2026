using PFMG.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PFMG.Models.StandaloneModels
{
    public class IndependentModePriDetail
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


		// 🔗 Many ModePriDetails → One StandaloneMode
		[ForeignKey("IndependentMode")]
        public int IndependentModeId { get; set; }
        public IndependentMode IndependentMode { get; set; }
    }
}
