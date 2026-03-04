using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using PFMG.Enums;

namespace PFMG.Models
{
    public class AreaInterest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AreaInterestId { get; set; }

        public string AreaName { get; set; }

        public string Area { get; set; }

        public string Perimeter { get; set; }

        public string Description { get; set; }

        public int MissionId { get; set; }

        [ForeignKey(nameof(MissionId))]
        public Mission Mission { get; set; }


        [JsonIgnore]
        // 🔗 One Mission → Many Platform
        public ICollection<AreaInterestCoordinate> AreaInterestCoordinates { get; set; } = new List<AreaInterestCoordinate>();
        
         [JsonIgnore]
        //[SwaggerIgnore]  // ❓ SwaggerIgnore doesn’t exist in default ASP.NET Core – remove or add correct package

        // 🔗 One Platform → Many EmitterModeLink
        public ICollection<EmitterModeLink> EmitterModeLinks { get; set; } = new List<EmitterModeLink>();
    }
}
