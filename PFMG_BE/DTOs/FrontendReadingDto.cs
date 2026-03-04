namespace PFMG.DTOs
{
    public class FrontendReadingDto
    {
        public string EmitterId { get; set; } = "";
        public float BoresightError { get; set; }
        public bool Jammed { get; set; } = true;
        public string? Latitude { get; set; } 
        public string? Longitude { get; set; } 
        public float? Frequency { get; set; }
        public string DetectionTime { get; set; } = "";

    }
}
