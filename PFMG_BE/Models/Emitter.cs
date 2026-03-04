using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models
{
    public class Emitter
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmitterId { get; set; }


        [Required]
        [MaxLength(200)]
        public string EmitterName { get; set; }

        public string Description { get; set; }

        [Required]
        public EmitterType EmitterType { get; set; }
        public string Symbol { get; set; }

        public string ForegroundColor { get; set; }
        public string BackgroundColor { get; set; }

        public bool IsUnknown { get; set; }
        public bool IsGroundOnly { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public string Latitude { get; set; }
        public string Longitude { get; set; }
        
      

    

        // 🔗 Foreign key to Weapon
        [ForeignKey("Weapon")]
        public int WeaponId { get; set; }
        public Weapon Weapon { get; set; }

        public ICollection<Mode> Modes { get; set; }

    }
}
