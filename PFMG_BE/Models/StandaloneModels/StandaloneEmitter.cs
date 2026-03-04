using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.Enums;

namespace PFMG.Models.StandaloneModels
{
    public class StandaloneEmitter
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

    
        public ICollection<StandaloneMode> StandaloneModes { get; set; }
    

    }
}
