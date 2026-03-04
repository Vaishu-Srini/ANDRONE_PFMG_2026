using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using PFMG.Enums;

namespace PFMG.Models
{
    public class EmitterModeLink
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int WeaponId { get; set; }

        public string WeaponName { get; set; }
        public int EmitterId { get; set; }

        public string EmitterName{ get; set; }


        public int ModeId { get; set; }

        public string ModeName { get; set; }

        public int JammingId { get; set; }

        public string JammingName { get; set; }



        public WeaponStandlone weaponStandlone { get; set; }


        // 🔗 Foreign key to Platform
        [ForeignKey("AreaInterest")]
        public int AreaInterestId { get; set; }
        public AreaInterest AreaInterest { get; set; }
    }
}
