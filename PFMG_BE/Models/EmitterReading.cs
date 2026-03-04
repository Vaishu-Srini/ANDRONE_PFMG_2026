namespace PFMG.Models
{
    public class EmitterReading
    {
        public int Id { get; set; }
        public string EmitterName { get; set; } = "";
        public DateTime TimeUtc { get; set; }
        public short BoresightError { get; set; }
    }
}
