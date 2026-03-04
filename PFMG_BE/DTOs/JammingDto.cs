using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using PFMG.Enums;

namespace PFMG.DTOs
{
   public class JammingDto
    {
        public int JammingId { get; set; }

        public string JammingName { get; set; }

        public string ScenarioName { get; set; }

        public string ScenarioTime { get; set; }

        public int ModeId { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

    
        public List<TargetPhaseDto> TargetPhases { get; set; } = new();



    }

}
