using PFMG.Enums;
using System.Text.Json.Serialization;

namespace PFMG.DTOs
{
    public class StandaloneEmitterDto
    {
        public int EmitterId { get; set; }


        public string EmitterName { get; set; }

        public string Description { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EmitterType EmitterType { get; set; }

        public string Symbol { get; set; }

        public string ForegroundColor { get; set; }
        public string BackgroundColor { get; set; }

        public bool IsUnknown { get; set; }
        public bool IsGroundOnly { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }


    }


}
