using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using PFMG.Enums;

namespace PFMG.Models
{
    public class Weapon
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WeaponId { get; set; }

        public string WeaponName { get; set; }

        public DateTime WeaponDate { get; set; }

        public ThreatType ThreatType { get; set; }

        public string ForeGroundColor { get; set; }

        public string BackGroundColor { get; set; }

        public string Symbol { get; set; }

        public bool DisplayStatus { get; set; }

        public int Priority { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string ModifiedBy { get; set; }

       

        public DateTime ModifiedDate { get; set; }

        public string Description { get; set; }

        [JsonIgnore]
        // 🔗 One Mission → Many Emitter
        public ICollection<Emitter> Emitters { get; set; } = new List<Emitter>();
    }
}
