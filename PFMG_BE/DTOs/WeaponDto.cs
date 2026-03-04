using PFMG.Enums;
using System.Text.Json.Serialization;
namespace PFMG.DTOs
{
    public class WeaponDto
    {
        public int WeaponId { get; set; }

        public string WeaponName { get; set; }
        public DateTime WeaponDate { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string? ModifiedBy { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ThreatType ThreatType { get; set; }

        public string ForeGroundColor { get; set; }

        public string BackGroundColor { get; set; }

        public string Symbol { get; set; }

        public bool DisplayStatus { get; set; }

        public int Priority { get; set; }

       

        public DateTime? ModifiedDate { get; set; }


        public string Description { get; set; }
        
    }
}
