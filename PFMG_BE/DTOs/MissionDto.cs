using PFMG.Enums;
using System.Text.Json.Serialization;
namespace PFMG.DTOs
{
    public class MissionDto
    {
        public int MissionId { get; set; }
        public string MissionName { get; set; }

        public DateTime? MissionDate { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]    
        public MissionType MissionType { get; set; }


        public string Description { get; set; }
        public int UserId { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]   
        public MissionsStatus Status { get; set; }
        
    }
}
