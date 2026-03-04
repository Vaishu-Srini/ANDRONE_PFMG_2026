using PFMG.Enums;
using System.Text.Json.Serialization;
namespace PFMG.DTOs
{
    public class EmitterCoordinateDto
    {
        public int EmitterId { get; set; }

        public string EmitterName { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }        

        
    }
}
