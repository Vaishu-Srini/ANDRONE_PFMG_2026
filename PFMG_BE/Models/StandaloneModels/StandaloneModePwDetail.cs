using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models.StandaloneModels
{
	public class StandaloneModePwDetail
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
        [ForeignKey("StandaloneMode")]
		
		public int StandaloneModeId { get; set; }
		public StandaloneMode StandaloneMode { get; set; }
	}
}
