using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using PFMG.Enums;

namespace PFMG.Models
{
    public class Mission
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MissionId { get; set; }

        public string MissionName { get; set; }
        public DateTime MissionDate { get; set; }

        public MissionType MissionType { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }

        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public MissionsStatus Status { get; set; }

        [JsonIgnore]

        // 🔗 One Mission → One AreaInterest
        public ICollection<AreaInterest> AreaInterests { get; set; } = new List<AreaInterest>();
        

        [JsonIgnore]
        // 🔗 One Mission → Many Platform
        public ICollection<Platform> Platforms { get; set; } = new List<Platform>();
    }
}
