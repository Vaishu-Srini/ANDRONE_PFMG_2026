using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models
{
	public class ModePwDetail
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
        [ForeignKey("Mode")]
		public int ModeId { get; set; }
		public Mode Mode { get; set; }
	}
}
