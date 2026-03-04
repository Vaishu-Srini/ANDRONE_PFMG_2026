using PFMG.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PFMG.Models.StandaloneModels
{
    public class IndependentJamming
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JammingId { get; set; }

        [MaxLength(200)]
        public string JammingName {get; set;}

        [MaxLength(200)]
        public string ScenarioName { get; set; }

        public string ScenarioTime { get; set; }

        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        

        public ICollection<IndependentTargetPhase> IndependentTargetPhases { get; set; } = new List<IndependentTargetPhase>();



    }
}
