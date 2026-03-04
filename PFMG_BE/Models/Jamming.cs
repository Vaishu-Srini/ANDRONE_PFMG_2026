using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models
{
    public class Jamming
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JammingId { get; set; }
        [MaxLength(200)]
        public string JammingName {get; set;}

        [MaxLength(200)]
        public string ScenarioName { get; set; }

        public string ScernarioTime { get; set; }

        
     
        // 🔗 Many Jammings → One Mode
        [ForeignKey("Mode")]
        public int ModeId { get; set; }
        public Mode Mode { get; set; }

        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public ICollection<TargetPhase> TargetPhases { get; set; } = new List<TargetPhase>();


    }
}
