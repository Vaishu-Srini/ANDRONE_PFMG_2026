using PFMG.Enums;
using System.Text.Json.Serialization;
namespace PFMG.DTOs
{
    public class EmitterModeLinkDto
    {
        public int Id { get; set; }

        public int WeaponId { get; set; }

        public string WeaponName { get; set; }
        public int EmitterId { get; set; }

        public string EmitterName { get; set; }


        public int ModeId { get; set; }

        public string ModeName { get; set; }

        public int JammingId { get; set; }

        public string JammingName { get; set; }

        public int AreaInterestId { get; set; }

        public WeaponStandlone weaponStandlone { get; set; }

    }


    public class RequestEmitterModeLinkDto
    {

        public List<WeaponLinkDto> Weapons { get; set; }

        public List<EmitterLinkDto>? Emitters { get; set; }
        public int AreaInterestId { get; set; }


    }

    public class ResponseEmitterModeLinkDto
    {

        public List<WeaponLinkDto> Weapons { get; set; }

        public List<EmitterLinkDto> Emitters { get; set; }

        public int AreaInterestId { get; set; }



    }


    public class WeaponLinkDto
    {


        public int WeaponId { get; set; }

        public string WeaponName { get; set; }

        public List<EmitterLinkDto> EmitterLinkDtos { get; set; }



    }


    public class EmitterLinkDto
    {

        public int EmitterId { get; set; }

        public string EmitterName { get; set; }

        public string? Latitude { get; set; }
        public string? Longitude { get; set; }

        public List<ModeLinkDto> ModeLinkDtos { get; set; }


    }

    public class ModeLinkDto
    {

        public int ModeId { get; set; }

        public string ModeName { get; set; }

        public List<JammingLinkDto> jammingLinkDtos { get; set; }



    }


    public class JammingLinkDto
    {

        public int JammingId { get; set; }

        public string JammingName { get; set; }



    }
}
    

   

