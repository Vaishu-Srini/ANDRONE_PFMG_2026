using PFMG.Enums;
using System.Text.Json.Serialization;
namespace PFMG.DTOs
{
    public class AreaInterestDto
    {
        public int AreaInterestId { get; set; }

        public string AreaName { get; set; }

        public string Area { get; set; }

        public string Perimeter { get; set; }
        public string Description { get; set; }
        public int MissionId { get; set; }

        public List<AreaInterestCoordinateDto> areaInterestCoordinateDtos { get; set; } = new();

        // public List<EmitterModeLinkDto> emitterModeLinkDtos { get; set; } = new();



    }
    
    public class ResponseAreaInterestDto
    {
       public int AreaInterestId { get; set; }

        public string AreaName { get; set; }

        public string Area { get; set; }

        public string Perimeter { get; set; }
        public string Description { get; set; }
        public int MissionId { get; set; }

        public List<AreaInterestCoordinateDto> areaInterestCoordinateDtos { get; set; } = new();
        
        public List<RequestEmitterModeLinkDto> emitterModeLinkDtos { get; set; } = new();


        
    }
}
