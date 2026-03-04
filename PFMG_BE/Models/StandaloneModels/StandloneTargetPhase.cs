using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PFMG.DTOs;
using PFMG.Enums;
using PFMG.Models.StandaloneModels;

namespace PFMG.Models
{
    public class StandaloneTargetPhase
    {
        // PK: phase_id
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PhaseId { get; set; }

        [MaxLength(200)]
        public string PhaseName { get; set; } = string.Empty;

        // UI: Inbound/Outbound (default Inbound)
        // Convention: true = Inbound, false = Outbound
        public bool TargetDirection { get; set; } = true;

        // default 0
        public double Acceleration { get; set; } = 0;

        // UI: m/s or km/hr (default uses 100 m/s)
        public string VelocityUnit { get; set; } = "m/s";
        public double MinVelocity { get; set; } = 0;
        public double MaxVelocity { get; set; } = 100; // 100 m/s

        // UI: m or km (default 5 km to 10 km)
        public string RangeUnit { get; set; } = "km";
        public double MinRange { get; set; } = 5;   // 5 km
        public double MaxRange { get; set; } = 10;  // 10 km

        // UI: default FALSE
        public bool FixedDoppler { get; set; } = false;

        public string DopplerShiftUnit { get; set; } = "Hz";
        public double DopplerShift { get; set; } = 0;

        // UI: default FALSE
        public bool FixedPower { get; set; } = false;

        public string PowerUnit { get; set; } = "dBm";
        public double Power { get; set; } = 0;

        // UI: output default 0
        public double SelectedPhaseDuration { get; set; } = 0;

        // UI default: Swerling 0 / Swerling V
        // Set the enum value that matches your naming in PFMG.Enums.RcsModel
        public RcsModels RcsModel { get; set; } = RcsModels.Swerling0_V;

        public double AverageRcs { get; set; } = 1; // m^2

        // UI: Auto/Manual (default Auto)
        //Auto is true , Manual is True
        public bool RcsUpdateType { get; set; } = false;

        // UI: Sec
        public string RcsUpdateUnit { get; set; } = "Sec";

        // NOTE: You wrote "100m". If that means 100 ms, store 0.1 seconds.
        // If it means 100 seconds, store 100.
        public double RcsUpdateTime { get; set; } = 100;

        public int NoOfPulsesPerScan { get; set; } = 10;

        // 🔗 Many Jammings → One Mode
        [ForeignKey("StandaloneJamming")]
        public int StandaloneJammingId { get; set; }
        public StandaloneJamming StandaloneJamming { get; set; }


        public static StandaloneTargetPhase ToEntity(TargetPhaseDto dto) =>
            new StandaloneTargetPhase
            {
                PhaseName = dto.PhaseName,
                TargetDirection = dto.TargetDirection,
                Acceleration = dto.Acceleration,
                VelocityUnit = dto.VelocityUnit,
                MinVelocity = dto.MinVelocity,
                MaxVelocity = dto.MaxVelocity,
                RangeUnit = dto.RangeUnit,
                MinRange = dto.MinRange,
                MaxRange = dto.MaxRange,
                FixedDoppler = dto.FixedDoppler,
                DopplerShiftUnit = dto.DopplerShiftUnit,
                DopplerShift = dto.DopplerShift,
                FixedPower = dto.FixedPower,
                PowerUnit = dto.PowerUnit,
                Power = dto.Power,
                SelectedPhaseDuration = dto.SelectedPhaseDuration,
                RcsModel = dto.RcsModel,
                AverageRcs = dto.AverageRcs,
                RcsUpdateType = dto.RcsUpdateType,
                RcsUpdateUnit = dto.RcsUpdateUnit,
                RcsUpdateTime = dto.RcsUpdateTime,
                NoOfPulsesPerScan = dto.NoOfPulsesPerScan
            };
    }
}