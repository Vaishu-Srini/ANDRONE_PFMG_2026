using PFMG.Enums;
using System.Text.Json.Serialization;
namespace PFMG.DTOs
{
    public class AreaInterestCoordinateDto
    {
        public int Id { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        public string Altitude { get; set; }
        

        
    }
}
