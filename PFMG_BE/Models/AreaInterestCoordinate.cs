using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using PFMG.Enums;

namespace PFMG.Models
{
    public class AreaInterestCoordinate
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        public string Altitude { get; set; }


        // 🔗 Foreign key to Platform
        [ForeignKey("AreaInterest")]
        public int AreaInterestId { get; set; }
        public AreaInterest AreaInterest { get; set; }
        

        
    }
}
