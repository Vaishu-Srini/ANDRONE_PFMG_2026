using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models.StandaloneModels
{
    public class StandaloneJamming
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JammingId { get; set; }

        [MaxLength(200)]
        public string JammingName {get; set;}

        [MaxLength(200)]
        public string ScenarioName { get; set; }

        public string ScernarioTime { get; set; }

        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }


        [ForeignKey("StandaloneMode")]
        public int StandaloneModeId { get; set; }
        public StandaloneMode StandaloneMode { get; set; }

        public ICollection<StandaloneTargetPhase> StandaloneTargetPhases { get; set; } = new List<StandaloneTargetPhase>();



    }
}
