using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using PFMG.Enums;
using PFMG.Models;

namespace PFMG.DTOs
{
   public class TargetPhaseDto
    {
        public int PhaseId { get; set; }

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

  
        public int JammingId { get; set; }

    

    
    

    public static TargetPhaseDto MapToDto(TargetPhase entity) =>
            new TargetPhaseDto { 
                PhaseId = entity.PhaseId,  
                PhaseName = entity.PhaseName,
                TargetDirection = entity.TargetDirection,
                Acceleration = entity.Acceleration,
                VelocityUnit = entity.VelocityUnit,
                MinVelocity = entity.MinVelocity,
                MaxVelocity = entity.MaxVelocity,
                RangeUnit = entity.RangeUnit,
                MinRange = entity.MinRange,
                MaxRange = entity.MaxRange,
                FixedDoppler = entity.FixedDoppler,
                DopplerShiftUnit = entity.DopplerShiftUnit,
                DopplerShift = entity.DopplerShift,
                FixedPower = entity.FixedPower,
                PowerUnit = entity.PowerUnit,
                Power = entity.Power,
                SelectedPhaseDuration = entity.SelectedPhaseDuration,
                RcsModel = entity.RcsModel,
                AverageRcs = entity.AverageRcs,
                RcsUpdateType = entity.RcsUpdateType,
                RcsUpdateUnit = entity.RcsUpdateUnit,
                RcsUpdateTime = entity.RcsUpdateTime,
                NoOfPulsesPerScan = entity.NoOfPulsesPerScan,
                JammingId = entity.JammingId
                
            };

    public static TargetPhaseDto MapToDto(StandaloneTargetPhase entity) =>
        new TargetPhaseDto { 
            PhaseId = entity.PhaseId,  
            PhaseName = entity.PhaseName,
            TargetDirection = entity.TargetDirection,
            Acceleration = entity.Acceleration,
            VelocityUnit = entity.VelocityUnit,
            MinVelocity = entity.MinVelocity,
            MaxVelocity = entity.MaxVelocity,
            RangeUnit = entity.RangeUnit,
            MinRange = entity.MinRange,
            MaxRange = entity.MaxRange,
            FixedDoppler = entity.FixedDoppler,
            DopplerShiftUnit = entity.DopplerShiftUnit,
            DopplerShift = entity.DopplerShift,
            FixedPower = entity.FixedPower,
            PowerUnit = entity.PowerUnit,
            Power = entity.Power,
            SelectedPhaseDuration = entity.SelectedPhaseDuration,
            RcsModel = entity.RcsModel,
            AverageRcs = entity.AverageRcs,
            RcsUpdateType = entity.RcsUpdateType,
            RcsUpdateUnit = entity.RcsUpdateUnit,
            RcsUpdateTime = entity.RcsUpdateTime,
            NoOfPulsesPerScan = entity.NoOfPulsesPerScan,
            JammingId = entity.StandaloneJammingId
            
        };

        public static TargetPhaseDto MapToDto(IndependentModeTargetPhase entity) =>
        new TargetPhaseDto { 
            PhaseId = entity.PhaseId,  
            PhaseName = entity.PhaseName,
            TargetDirection = entity.TargetDirection,
            Acceleration = entity.Acceleration,
            VelocityUnit = entity.VelocityUnit,
            MinVelocity = entity.MinVelocity,
            MaxVelocity = entity.MaxVelocity,
            RangeUnit = entity.RangeUnit,
            MinRange = entity.MinRange,
            MaxRange = entity.MaxRange,
            FixedDoppler = entity.FixedDoppler,
            DopplerShiftUnit = entity.DopplerShiftUnit,
            DopplerShift = entity.DopplerShift,
            FixedPower = entity.FixedPower,
            PowerUnit = entity.PowerUnit,
            Power = entity.Power,
            SelectedPhaseDuration = entity.SelectedPhaseDuration,
            RcsModel = entity.RcsModel,
            AverageRcs = entity.AverageRcs,
            RcsUpdateType = entity.RcsUpdateType,
            RcsUpdateUnit = entity.RcsUpdateUnit,
            RcsUpdateTime = entity.RcsUpdateTime,
            NoOfPulsesPerScan = entity.NoOfPulsesPerScan,
            JammingId = entity.IndependentModeJammingId
            
        };

        public static TargetPhaseDto MapToDto(IndependentTargetPhase entity) =>
            new TargetPhaseDto { 
                PhaseId = entity.PhaseId,  
                PhaseName = entity.PhaseName,
                TargetDirection = entity.TargetDirection,
                Acceleration = entity.Acceleration,
                VelocityUnit = entity.VelocityUnit,
                MinVelocity = entity.MinVelocity,
                MaxVelocity = entity.MaxVelocity,
                RangeUnit = entity.RangeUnit,
                MinRange = entity.MinRange,
                MaxRange = entity.MaxRange,
                FixedDoppler = entity.FixedDoppler,
                DopplerShiftUnit = entity.DopplerShiftUnit,
                DopplerShift = entity.DopplerShift,
                FixedPower = entity.FixedPower,
                PowerUnit = entity.PowerUnit,
                Power = entity.Power,
                SelectedPhaseDuration = entity.SelectedPhaseDuration,
                RcsModel = entity.RcsModel,
                AverageRcs = entity.AverageRcs,
                RcsUpdateType = entity.RcsUpdateType,
                RcsUpdateUnit = entity.RcsUpdateUnit,
                RcsUpdateTime = entity.RcsUpdateTime,
                NoOfPulsesPerScan = entity.NoOfPulsesPerScan,
                JammingId = entity.IndependentJammingId
                
            };
    }
}





