using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using PFMG.Enums;

namespace PFMG.DTOs
{
    public class JammingSegmentDto
    {
        public int JammingSegmentId { get; set; }
        public string Name { get; set; }
        public int NoiseBw { get; set; }
        public int CycleCount { get; set; }
        public int StartDwell { get; set; }
        public int EndDwell { get; set; }
        public int EndRange { get; set; }
        public float Acceleration { get; set; }
        public float Velocity { get; set; }

        public int JammingId { get; set; }
    }

}
