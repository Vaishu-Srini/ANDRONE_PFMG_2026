using PFMG.Enums;
using System.Text.Json.Serialization;
namespace PFMG.DTOs
{
    public class ResponseWeaponDto
    {
        public int WeaponId { get; set; }

        public string WeaponName { get; set; }
        public DateTime WeaponDate { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string? ModifiedBy { get; set; }

       

        public DateTime? ModifiedDate { get; set; }

        public string Description { get; set; }
        
    }
}
