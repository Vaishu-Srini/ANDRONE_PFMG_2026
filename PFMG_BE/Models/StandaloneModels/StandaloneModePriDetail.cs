using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models.StandaloneModels
{
    public class StandaloneModePriDetail
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
		[ForeignKey("StandaloneMode")]
        public int StandaloneModeId { get; set; }
        public StandaloneMode StandaloneMode { get; set; }
    }
}
