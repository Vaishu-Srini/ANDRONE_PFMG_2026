using PFMG.DTOs;
using PFMG.Models;
using PFMG.Models.StandaloneModels;
using PFMG.Repositories;
using PFMG.Utilities;
using PFMG.Validators;
using PFMG.Validation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;

namespace PFMG.Services.impl
{
    public class TargetPhaseServiceImpl : ITargetPhaseService
    {
        private readonly IJammingRepository _jammingRepository;

        private readonly IStandaloneJammingRepository _standaloneJammingRepository;

        private readonly IIndependentModeJammingRepository _independentModeJammingRepository;


        private readonly IIndependentJammingRepository _independentJammingRepository;

        private readonly ITargetPhaseRepository _targetPhaseRepository;

        private readonly IStandaloneTargetPhaseRepository _standaloneTargetPhaseRepository;

        private readonly IIndependentModeTargetPhaseRepository _independentModeTargetPhaseRepository;

        private readonly IIndependentTargetPhaseRepository _independentTargetPhaseRepository;




        public TargetPhaseServiceImpl(
            IJammingRepository jammingRepository,
            IStandaloneJammingRepository StandaloneJammingRepository,
            IIndependentModeJammingRepository independentModeJammingRepository,
            IIndependentJammingRepository independentJammingRepository,

            ITargetPhaseRepository targetPhaseRepository,
            IStandaloneTargetPhaseRepository standaloneTargetPhaseRepository,
            IIndependentModeTargetPhaseRepository independentModeTargetPhaseRepository,
            IIndependentTargetPhaseRepository independentTargetPhaseRepository
            )
        {
            _jammingRepository = jammingRepository;
            _standaloneJammingRepository = StandaloneJammingRepository;
            _independentModeJammingRepository = independentModeJammingRepository;
            _independentJammingRepository = independentJammingRepository;

            _targetPhaseRepository = targetPhaseRepository;
            _standaloneTargetPhaseRepository = standaloneTargetPhaseRepository;
            _independentModeTargetPhaseRepository = independentModeTargetPhaseRepository;
            _independentTargetPhaseRepository = independentTargetPhaseRepository;
        }

        public async Task<(bool Success, string Message, TargetPhaseDto? Data)> SaveTargetPhase(TargetPhaseDto dto)
        {
            try
            {
                var jamming = await _jammingRepository.GetByIdAsync(dto.JammingId);
                if (jamming == null)
                    return (false, "Jamming not found", null);



                if (dto.PhaseId == 0) // Create
                {

                    var phase = TargetPhase.ToEntity(dto);
                    phase.JammingId = dto.JammingId;
                    var saved = await _targetPhaseRepository.AddAsync(phase);
                    
                    return (true, "phase created successfully", TargetPhaseDto.MapToDto(saved));
                }
                else // Update
                {
                    var existing = await _targetPhaseRepository.GetByIdAsync(dto.PhaseId);
                    if (existing == null)
                        return (false, "phase not found", null);


                    existing.PhaseName = dto.PhaseName;
                    existing.TargetDirection = dto.TargetDirection;
                    existing.Acceleration = dto.Acceleration;
                    existing.VelocityUnit = dto.VelocityUnit;
                    existing.MinVelocity = dto.MinVelocity;
                    existing.MaxVelocity = dto.MaxVelocity;
                    existing.RangeUnit = dto.RangeUnit;
                    existing.MinRange = dto.MinRange;
                    existing.MaxRange = dto.MaxRange;
                    existing.FixedDoppler = dto.FixedDoppler;
                    existing.DopplerShiftUnit = dto.DopplerShiftUnit;
                    existing.DopplerShift = dto.DopplerShift;
                    existing.FixedPower = dto.FixedPower;
                    existing.PowerUnit = dto.PowerUnit;
                    existing.Power = dto.Power;
                    existing.SelectedPhaseDuration = dto.SelectedPhaseDuration;
                    existing.RcsModel = dto.RcsModel;
                    existing.AverageRcs = dto.AverageRcs;
                    existing.RcsUpdateType = dto.RcsUpdateType;
                    existing.RcsUpdateUnit = dto.RcsUpdateUnit;
                    existing.RcsUpdateTime = dto.RcsUpdateTime;
                    existing.NoOfPulsesPerScan = dto.NoOfPulsesPerScan;
                    

                    var updated = await _targetPhaseRepository.UpdateAsync(existing);

                    return (true, "Phase updated successfully", TargetPhaseDto.MapToDto(updated));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error saving Phase: {ex.Message}", null);
            }
        }

        public async Task<IEnumerable<TargetPhaseDto>> GetAllTargetPhases()
        {
            var targetPhases = await _targetPhaseRepository.GetAllAsync();
            return targetPhases.Select(TargetPhaseDto.MapToDto).ToList();
        }

        public async Task<(bool Success, string Message)> DeleteTargetPhase(int id)
        {
            try
            {
                var jamming = await _targetPhaseRepository.GetByIdAsync(id);
                if (jamming == null)
                    return (false, "Phase not found!");

                await _targetPhaseRepository.DeleteAsync(id);
                return (true, "Phase deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error deleting Phase: {ex.Message}");
            }
        }

        public async Task<(bool Success, string Message, TargetPhaseDto? Data)> SaveStandaloneTargetPhase(TargetPhaseDto dto)
        {
            try
            {
                var jamming = await _standaloneJammingRepository.GetByIdAsync(dto.JammingId);
                if (jamming == null)
                    return (false, "Jamming not found", null);



                if (dto.PhaseId == 0) // Create
                {

                    var phase = StandaloneTargetPhase.ToEntity(dto);
                    phase.StandaloneJammingId = dto.JammingId;
                    var saved = await _standaloneTargetPhaseRepository.AddAsync(phase);
                    
                    return (true, "phase created successfully", TargetPhaseDto.MapToDto(saved));
                }
                else // Update
                {
                    var existing = await _standaloneTargetPhaseRepository.GetByIdAsync(dto.PhaseId);
                    if (existing == null)
                        return (false, "phase not found", null);


                    existing.PhaseName = dto.PhaseName;
                    existing.TargetDirection = dto.TargetDirection;
                    existing.Acceleration = dto.Acceleration;
                    existing.VelocityUnit = dto.VelocityUnit;
                    existing.MinVelocity = dto.MinVelocity;
                    existing.MaxVelocity = dto.MaxVelocity;
                    existing.RangeUnit = dto.RangeUnit;
                    existing.MinRange = dto.MinRange;
                    existing.MaxRange = dto.MaxRange;
                    existing.FixedDoppler = dto.FixedDoppler;
                    existing.DopplerShiftUnit = dto.DopplerShiftUnit;
                    existing.DopplerShift = dto.DopplerShift;
                    existing.FixedPower = dto.FixedPower;
                    existing.PowerUnit = dto.PowerUnit;
                    existing.Power = dto.Power;
                    existing.SelectedPhaseDuration = dto.SelectedPhaseDuration;
                    existing.RcsModel = dto.RcsModel;
                    existing.AverageRcs = dto.AverageRcs;
                    existing.RcsUpdateType = dto.RcsUpdateType;
                    existing.RcsUpdateUnit = dto.RcsUpdateUnit;
                    existing.RcsUpdateTime = dto.RcsUpdateTime;
                    existing.NoOfPulsesPerScan = dto.NoOfPulsesPerScan;
                    

                    var updated = await _standaloneTargetPhaseRepository.UpdateAsync(existing);

                    return (true, "Phase updated successfully", TargetPhaseDto.MapToDto(updated));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error saving Phase: {ex.Message}", null);
            }
        }

        public async Task<IEnumerable<TargetPhaseDto>> GetAllStandaloneTargetPhases()
        {
            var targetPhases = await _standaloneTargetPhaseRepository.GetAllAsync();
            return [.. targetPhases.Select(TargetPhaseDto.MapToDto)];
        }

        public async Task<(bool Success, string Message)> DeleteStandaloneTargetPhase(int id)
        {
            try
            {
                var jamming = await _standaloneTargetPhaseRepository.GetByIdAsync(id);
                if (jamming == null)
                    return (false, "Phase not found!");

                await _standaloneTargetPhaseRepository.DeleteAsync(id);
                return (true, "Phase deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error deleting Phase: {ex.Message}");
            }
        }


        public async Task<(bool Success, string Message, TargetPhaseDto? Data)> SaveIndependentModeTargetPhase(TargetPhaseDto dto)
        {
            try
            {
                var jamming = await _independentModeJammingRepository.GetByIdAsync(dto.JammingId);
                if (jamming == null)
                    return (false, "Jamming not found", null);



                if (dto.PhaseId == 0) // Create
                {

                    var phase = IndependentModeTargetPhase.ToEntity(dto);
                    phase.IndependentModeJammingId = dto.JammingId;
                    var saved = await _independentModeTargetPhaseRepository.AddAsync(phase);
                    
                    return (true, "phase created successfully", TargetPhaseDto.MapToDto(saved));
                }
                else // Update
                {
                    var existing = await _independentModeTargetPhaseRepository.GetByIdAsync(dto.PhaseId);
                    if (existing == null)
                        return (false, "phase not found", null);


                    existing.PhaseName = dto.PhaseName;
                    existing.TargetDirection = dto.TargetDirection;
                    existing.Acceleration = dto.Acceleration;
                    existing.VelocityUnit = dto.VelocityUnit;
                    existing.MinVelocity = dto.MinVelocity;
                    existing.MaxVelocity = dto.MaxVelocity;
                    existing.RangeUnit = dto.RangeUnit;
                    existing.MinRange = dto.MinRange;
                    existing.MaxRange = dto.MaxRange;
                    existing.FixedDoppler = dto.FixedDoppler;
                    existing.DopplerShiftUnit = dto.DopplerShiftUnit;
                    existing.DopplerShift = dto.DopplerShift;
                    existing.FixedPower = dto.FixedPower;
                    existing.PowerUnit = dto.PowerUnit;
                    existing.Power = dto.Power;
                    existing.SelectedPhaseDuration = dto.SelectedPhaseDuration;
                    existing.RcsModel = dto.RcsModel;
                    existing.AverageRcs = dto.AverageRcs;
                    existing.RcsUpdateType = dto.RcsUpdateType;
                    existing.RcsUpdateUnit = dto.RcsUpdateUnit;
                    existing.RcsUpdateTime = dto.RcsUpdateTime;
                    existing.NoOfPulsesPerScan = dto.NoOfPulsesPerScan;
                    

                    var updated = await _independentModeTargetPhaseRepository.UpdateAsync(existing);

                    return (true, "Phase updated successfully", TargetPhaseDto.MapToDto(updated));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error saving Phase: {ex.Message}", null);
            }
        }

        public async Task<IEnumerable<TargetPhaseDto>> GetAllIndependentModeTargetPhases()
        {
            var targetPhases = await _independentModeTargetPhaseRepository.GetAllAsync();
            return [.. targetPhases.Select(TargetPhaseDto.MapToDto)];
        }

        public async Task<(bool Success, string Message)> DeleteIndependentModeTargetPhase(int id)
        {
            try
            {
                var jamming = await _independentModeTargetPhaseRepository.GetByIdAsync(id);
                if (jamming == null)
                    return (false, "Phase not found!");

                await _independentModeTargetPhaseRepository.DeleteAsync(id);
                return (true, "Phase deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error deleting Phase: {ex.Message}");
            }
        }


        public async Task<(bool Success, string Message, TargetPhaseDto? Data)> SaveIndependentTargetPhase(TargetPhaseDto dto)
        {
            try
            {
                var jamming = await _independentJammingRepository.GetByIdAsync(dto.JammingId);
                if (jamming == null)
                    return (false, "Jamming not found", null);



                if (dto.PhaseId == 0) // Create
                {

                    var phase = IndependentTargetPhase.ToEntity(dto);
                    phase.IndependentJammingId = dto.JammingId;
                    var saved = await _independentTargetPhaseRepository.AddAsync(phase);
                    
                    return (true, "phase created successfully", TargetPhaseDto.MapToDto(saved));
                }
                else // Update
                {
                    var existing = await _independentTargetPhaseRepository.GetByIdAsync(dto.PhaseId);
                    if (existing == null)
                        return (false, "phase not found", null);


                    existing.PhaseName = dto.PhaseName;
                    existing.TargetDirection = dto.TargetDirection;
                    existing.Acceleration = dto.Acceleration;
                    existing.VelocityUnit = dto.VelocityUnit;
                    existing.MinVelocity = dto.MinVelocity;
                    existing.MaxVelocity = dto.MaxVelocity;
                    existing.RangeUnit = dto.RangeUnit;
                    existing.MinRange = dto.MinRange;
                    existing.MaxRange = dto.MaxRange;
                    existing.FixedDoppler = dto.FixedDoppler;
                    existing.DopplerShiftUnit = dto.DopplerShiftUnit;
                    existing.DopplerShift = dto.DopplerShift;
                    existing.FixedPower = dto.FixedPower;
                    existing.PowerUnit = dto.PowerUnit;
                    existing.Power = dto.Power;
                    existing.SelectedPhaseDuration = dto.SelectedPhaseDuration;
                    existing.RcsModel = dto.RcsModel;
                    existing.AverageRcs = dto.AverageRcs;
                    existing.RcsUpdateType = dto.RcsUpdateType;
                    existing.RcsUpdateUnit = dto.RcsUpdateUnit;
                    existing.RcsUpdateTime = dto.RcsUpdateTime;
                    existing.NoOfPulsesPerScan = dto.NoOfPulsesPerScan;
                    

                    var updated = await _independentTargetPhaseRepository.UpdateAsync(existing);

                    return (true, "Phase updated successfully", TargetPhaseDto.MapToDto(updated));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error saving Phase: {ex.Message}", null);
            }
        }

        public async Task<IEnumerable<TargetPhaseDto>> GetAllIndependentTargetPhases()
        {
            var targetPhases = await _independentTargetPhaseRepository.GetAllAsync();
            return [.. targetPhases.Select(TargetPhaseDto.MapToDto)];
        }

        public async Task<(bool Success, string Message)> DeleteIndependentTargetPhase(int id)
        {
            try
            {
                var jamming = await _independentTargetPhaseRepository.GetByIdAsync(id);
                if (jamming == null)
                    return (false, "Phase not found!");

                await _independentTargetPhaseRepository.DeleteAsync(id);
                return (true, "Phase deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error deleting Phase: {ex.Message}");
            }
        }



    }
        
       
}
