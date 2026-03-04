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
    public class JammingServiceImpl : IJammingService
    {
        private readonly IJammingRepository _jammingRepository;
        private readonly IModeRepository _modeRepository;

        private readonly IStandaloneJammingRepository _standaloneJammingRepository;

        private readonly IIndependentModeRepository _independentModeRepository;
        private readonly IIndependentModeJammingRepository _independentModeJammingRepository;

        private readonly IStandaloneModeRepository _standaloneModeRepository;

        private readonly IIndependentJammingRepository _independentJammingRepository;

        private readonly ITargetPhaseRepository _targetPhaseRepository;

        private readonly IStandaloneTargetPhaseRepository _standaloneTargetPhaseRepository;

        private readonly IIndependentModeTargetPhaseRepository _independentModeTargetPhaseRepository;

        private readonly IIndependentTargetPhaseRepository _independentTargetPhaseRepository;



        public JammingServiceImpl(
            IJammingRepository jammingRepository,
            IModeRepository modeRepository,
            IStandaloneJammingRepository StandaloneJammingRepository,
            IIndependentModeJammingRepository independentModeJammingRepository,

            IIndependentModeRepository independentModeRepository,

            IStandaloneModeRepository standaloneModeRepository,
            IIndependentJammingRepository independentJammingRepository,
            ITargetPhaseRepository targetPhaseRepository,
            IStandaloneTargetPhaseRepository standaloneTargetPhaseRepository,
            IIndependentModeTargetPhaseRepository independentModeTargetPhaseRepository,
            IIndependentTargetPhaseRepository independentTargetPhaseRepository
            )
        {
            _jammingRepository = jammingRepository;
            _modeRepository = modeRepository;
            _standaloneJammingRepository = StandaloneJammingRepository;
            _independentModeJammingRepository = independentModeJammingRepository;
            _independentModeRepository = independentModeRepository;
            _standaloneModeRepository = standaloneModeRepository;
            _independentJammingRepository = independentJammingRepository;
            _targetPhaseRepository = targetPhaseRepository;
            _standaloneTargetPhaseRepository = standaloneTargetPhaseRepository;
            _independentModeTargetPhaseRepository = independentModeTargetPhaseRepository;
            _independentTargetPhaseRepository = independentTargetPhaseRepository;
        }

        public async Task<(bool Success, string Message, JammingDto? Data)> SaveJammingAsync(JammingDto dto)
        {
            //var vr = JammingValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            try
            {
                var mode = await _modeRepository.GetByIdAsync(dto.ModeId);
                if (mode == null)
                    return (false, "Mode not found", null);

                var existingByJammingName = await _jammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

                var existingByStandaloneJammingName = await _standaloneJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

                var existingByIndependentModeJammingName = await _independentModeJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

                var existingByIndependentJammingName = await _independentJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);


                var existingByScenarioName = await _jammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

                var existingByStandaloneScenarioName = await _standaloneJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

                var existingByIndependentModeScenarioName = await _independentModeJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

                var existingByIndependentScenarioName = await _independentJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);



                if (dto.JammingId == 0) // Create
                {

                    if (existingByJammingName != null || existingByStandaloneJammingName != null || existingByIndependentModeJammingName != null || existingByIndependentJammingName != null)
                        return (false, "Jamming name already exists", null);

                    if (existingByScenarioName != null || existingByStandaloneScenarioName != null || existingByIndependentModeScenarioName != null || existingByIndependentScenarioName != null)
                        return (false, "Scenario name already exists", null);
                        
                    var jamming = MapToEntity(dto);
                    var saved = await _jammingRepository.AddAsync(jamming);


                    // if (dto.TargetPhases != null)
                    // {
                    //     var targetPhases = dto.TargetPhases.Select(f =>
                    //     {
                    //         var entity = TargetPhaseMapToEntity(f);
                    //         entity.JammingId = saved.JammingId;
                    //         return entity;
                    //     }).ToList();

                    //     await _targetPhaseRepository.SaveAllTargetPhasesAsync(targetPhases);

                    // }


                    return (true, "Jamming created successfully", JammingTargetPhaseMapToDto(saved));
                }
                else // Update
                {
                    var existing = await _jammingRepository.GetByIdAsync(dto.JammingId);
                    if (existing == null)
                        return (false, "Jamming not found", null);

                    existing.JammingName = dto.JammingName;
                    existing.ScenarioName = dto.ScenarioName;
                    existing.ScernarioTime = dto.ScenarioTime;
                    existing.ModifiedDate = DateTime.UtcNow;
                    existing.ModeId = dto.ModeId;

                    // existing.TargetPhases.Clear();
                    // if (dto.TargetPhases != null)
                    //     existing.TargetPhases = dto.TargetPhases.Select(f =>
                    //     {
                    //         var entity = TargetPhaseMapToEntity(f);
                    //         entity.JammingId = existing.JammingId;
                    //         return entity;
                    //     }).ToList();

                    var updated = await _jammingRepository.UpdateAsync(existing);

                    return (true, "Jamming updated successfully", JammingTargetPhaseMapToDto(updated));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error saving Jamming: {ex.Message}", null);
            }
        }

        public async Task<IEnumerable<JammingDto>> GetAllJammingsAsync()
        {
            var jammings = await _jammingRepository.GetAllAsync();
            return jammings.Select(JammingTargetPhaseMapToDto).ToList();
        }





        public async Task<JammingDto?> GetByIdAsync(int id)
        {
            var entity = await _jammingRepository.GetByIdAsync(id);
            return entity == null ? null : JammingTargetPhaseMapToDto(entity);
        }

        public async Task<(bool Success, string Message)> DeleteJammingAsync(int id)
        {
            try
            {
                var jamming = await _jammingRepository.GetByIdAsync(id);
                if (jamming == null)
                    return (false, "Jamming not found!");

                await _jammingRepository.DeleteAsync(id);
                return (true, "Jamming deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error deleting Jamming: {ex.Message}");
            }
        }


        public async Task<(bool Success, string Message, JammingDto? Data)> SaveStandaloneJammingAsync(JammingDto dto)
        {
            //var vr = JammingValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            try
            {
                var mode = await _standaloneModeRepository.GetByIdAsync(dto.ModeId);
                if (mode == null)
                    return (false, "Mode not found", null);

                var existingByName = await _jammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

                var existingByStandaloneName = await _standaloneJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

                var existingByIndependentName = await _independentModeJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

                var existingByIndependentJammingName = await _independentJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);


                var existingByScenarioName = await _jammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

                var existingByStandaloneScenarioName = await _standaloneJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

                var existingByIndependentModeScenarioName = await _independentModeJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

                var existingByIndependentScenarioName = await _independentJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

                if (dto.JammingId == 0) // Create
                {
                    if (existingByName != null || existingByStandaloneName != null || existingByIndependentName != null || existingByIndependentJammingName != null)
                        return (false, "Jamming name already exists", null);

                    if (existingByScenarioName != null || existingByStandaloneScenarioName != null || existingByIndependentModeScenarioName != null || existingByIndependentScenarioName != null)
                        return (false, "Scenario name already exists", null);

                    var jamming = JammingLibraryMapToEntity(dto);
                    var saved = await _standaloneJammingRepository.AddAsync(jamming);

                    // if (dto.TargetPhases != null)
                    // {
                    //     var targetPhases = dto.TargetPhases.Select(f =>
                    //     {
                    //         var entity = StandaloneTargetPhaseMapToEntity(f);
                    //         entity.StandaloneJammingId = saved.JammingId;
                    //         return entity;
                    //     }).ToList();

                    //     await _standaloneTargetPhaseRepository.SaveAllTargetPhasesAsync(targetPhases);

                    // }

                    return (true, "Jamming created successfully", JammingLibraryDtoMapToDto(saved));
                }
                else // Update
                {
                    var existing = await _standaloneJammingRepository.GetByIdAsync(dto.JammingId);
                    if (existing == null)
                        return (false, "Jamming not found", null);

                    existing.JammingName = dto.JammingName;
                    existing.ScenarioName = dto.ScenarioName;
                    existing.ScernarioTime = dto.ScenarioTime;
                    existing.ModifiedDate = DateTime.UtcNow;

                    // existing.StandaloneTargetPhases.Clear();
                    // if (dto.TargetPhases != null)
                    //     existing.StandaloneTargetPhases = dto.TargetPhases.Select(f =>
                    //     {
                    //         var entity = StandaloneTargetPhaseMapToEntity(f);
                    //         entity.StandaloneJammingId = existing.JammingId;
                    //         return entity;
                    //     }).ToList();


                    var updated = await _standaloneJammingRepository.UpdateAsync(existing);

                    return (true, "Jamming updated successfully", JammingLibraryDtoMapToDto(updated));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error saving Jamming: {ex.Message}", null);
            }
        }


        public async Task<(bool Success, string Message)> DeleteStandaloneJammingAsync(int id)
        {
            try
            {

                var jamming  = await _standaloneJammingRepository.GetByIdAsync(id);

                if (jamming == null)
                    return (false, "jamming not found");

                await _standaloneJammingRepository.DeleteAsync(id);
                return (true, "Jamming deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error deleting Jamming: {ex.Message}");
            }
        }



        public async Task<(bool Success, string Message)> DeleteIndependentModeJammingAsync(int id)
        {
            try
            {
                var jamming  = await _independentModeJammingRepository.GetByIdAsync(id);

                if (jamming == null)
                    return (false, "jamming not found");
                    
                await _independentModeJammingRepository.DeleteAsync(id);
                return (true, "Jamming deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error deleting Jamming: {ex.Message}");
            }
        }

        public async Task<(bool Success, string Message)> DeleteIndependentJammingAsync(int id)
        {
            try
            {
                var jamming  = await _independentJammingRepository.GetByIdAsync(id);

                if (jamming == null)
                    return (false, "jamming not found"); 
                    
                await _independentJammingRepository.DeleteAsync(id);
                return (true, "Jamming deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error deleting Jamming: {ex.Message}");
            }
        }


        public async Task<IEnumerable<JammingDto>> GetAllStandaloneJammingsAsync()
        {
            var jammings = await _standaloneJammingRepository.GetAllAsync();

            return jammings.Select(JammingLibraryDtoMapToDto).ToList();
        }

        // 🔹 Mapping helpers
        private Jamming MapToEntity(JammingDto dto) =>
            new Jamming
            {
                JammingName = dto.JammingName,
                ScenarioName = dto.ScenarioName,
                ScernarioTime = dto.ScenarioTime,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "ADMIN",
                ModifiedDate = DateTime.UtcNow,
                ModeId = dto.ModeId
            };


        public StandaloneTargetPhase StandaloneTargetPhaseMapToEntity(TargetPhaseDto dto) =>
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

        public IndependentModeTargetPhase IndependentModeTargetPhaseMapToEntity(TargetPhaseDto dto) =>
            new IndependentModeTargetPhase
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

        public IndependentTargetPhase IndependentTargetPhaseMapToEntity(TargetPhaseDto dto) =>
            new IndependentTargetPhase
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





        public TargetPhase TargetPhaseMapToEntity(TargetPhaseDto dto) =>
            new TargetPhase
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
        public async Task<(bool Success, string Message, JammingDto? Data)> SaveIndependentModeJammingAsync(JammingDto dto)
        {
           
            var mode = await _independentModeRepository.GetByIdAsync(dto.ModeId);
            if (mode == null)
                return (false, "Mode not found", null);

            var existingByName = await _jammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

            var existingByStandaloneName = await _standaloneJammingRepository.Query()
                .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

            var existingByIndependentName = await _independentModeJammingRepository.Query()
                .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);


            var existingByIndependentJammingName = await _independentJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);


            var existingByScenarioName = await _jammingRepository.Query()
                .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

            var existingByStandaloneScenarioName = await _standaloneJammingRepository.Query()
                .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

            var existingByIndependentModeScenarioName = await _independentModeJammingRepository.Query()
                .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

            var existingByIndependentScenarioName = await _independentJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);



            if (dto.JammingId == 0) // Create
            {
                if (existingByName != null || existingByStandaloneName != null || existingByIndependentName != null || existingByIndependentJammingName != null)
                    return (false, "Jamming name already exists", null);
                
                if (existingByScenarioName != null || existingByStandaloneScenarioName != null || existingByIndependentModeScenarioName != null || existingByIndependentScenarioName != null)
                    return (false, "Scenario name already exists", null);
                
                var jamming = IndependentModeJammingMapToEntity(dto);
                var saved = await _independentModeJammingRepository.AddAsync(jamming);

                // if (dto.TargetPhases != null)
                //     {
                //         var targetPhases = dto.TargetPhases.Select(f =>
                //         {
                //             var entity = IndependentModeTargetPhaseMapToEntity(f);
                //             entity.IndependentModeJammingId = saved.JammingId;
                //             return entity;
                //         }).ToList();

                //         await _independentModeTargetPhaseRepository.SaveAllTargetPhasesAsync(targetPhases);

                //     }

                return (true, "Jamming created successfully", IndependentModeJammingDtoMapToDto(saved));
            }
            else // Update
            {
                var existing = await _independentModeJammingRepository.GetByIdAsync(dto.JammingId);
                if (existing == null)
                    return (false, "Jamming not found", null);

                existing.JammingName = dto.JammingName;
                existing.ScenarioName = dto.ScenarioName;
                existing.ScenarioTime = dto.ScenarioTime;
                existing.ModifiedDate = DateTime.UtcNow;

                // existing.IndependentModeTargetPhases.Clear();
                // if (dto.TargetPhases != null)
                //     existing.IndependentModeTargetPhases = dto.TargetPhases.Select(f =>
                //     {
                //         var entity = IndependentModeTargetPhaseMapToEntity(f);
                //         entity.IndependentModeJammingId = existing.JammingId;
                //         return entity;
                //     }).ToList();

                var updated = await _independentModeJammingRepository.UpdateAsync(existing);

                return (true, "Jamming updated successfully", IndependentModeJammingDtoMapToDto(updated));
            }
            // }
            // catch (Exception ex)
            // {
            //     return (false, $"Error saving Jamming: {ex.Message}", null);
            // }
        }


        public async Task<IEnumerable<JammingDto>> GetAllIndependentModeJammingsAsync()
        {
            var jammings = await _independentModeJammingRepository.GetAllAsync();

            return jammings.Select(IndependentModeJammingDtoMapToDto).ToList();
        }

         public async Task<IEnumerable<JammingDto>> GetAllIndependentJammingsAsync()
        {
            var jammings = await _independentJammingRepository.GetAllAsync();

            return jammings.Select(IndependentJammingDtoMapToDto).ToList();
        }


        
        public async Task<(bool Success, string Message, JammingDto? Data)> SaveIndependentJammingAsync(JammingDto dto)
        {
           
            // var mode = await _independentModeRepository.GetByIdAsync(dto.ModeId);
            // if (mode == null)
            //     return (false, "Mode not found", null);

            var existingByName = await _jammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

            var existingByStandaloneName = await _standaloneJammingRepository.Query()
                .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);

            var existingByIndependentName = await _independentModeJammingRepository.Query()
                .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);


            var existingByIndependentJammingName = await _independentJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.JammingName == dto.JammingName);


            var existingByScenarioName = await _jammingRepository.Query()
                .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

            var existingByStandaloneScenarioName = await _standaloneJammingRepository.Query()
                .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

            var existingByIndependentModeScenarioName = await _independentModeJammingRepository.Query()
                .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);

            var existingByIndependentScenarioName = await _independentJammingRepository.Query()
                    .FirstOrDefaultAsync(m => m.ScenarioName == dto.ScenarioName);



            if (dto.JammingId == 0) // Create
            {
                if (existingByName != null || existingByStandaloneName != null || existingByIndependentName != null || existingByIndependentJammingName != null)
                    return (false, "Jamming name already exists", null);
                
                if (existingByScenarioName != null || existingByStandaloneScenarioName != null || existingByIndependentModeScenarioName != null || existingByIndependentScenarioName != null)
                    return (false, "Scenario name already exists", null);
                
                var jamming = IndependentJammingMapToEntity(dto);
                var saved = await _independentJammingRepository.AddAsync(jamming);

                // if (dto.TargetPhases != null)
                //     {
                //         var targetPhases = dto.TargetPhases.Select(f =>
                //         {
                //             var entity = IndependentTargetPhaseMapToEntity(f);
                //             entity.IndependentJammingId = saved.JammingId;
                //             return entity;
                //         }).ToList();

                //         await _independentTargetPhaseRepository.SaveAllTargetPhasesAsync(targetPhases);

                //     }

                return (true, "Jamming created successfully", IndependentJammingDtoMapToDto(saved));
            }
            else // Update
            {
                var existing = await _independentJammingRepository.GetByIdAsync(dto.JammingId);
                if (existing == null)
                    return (false, "Jamming not found", null);

                existing.JammingName = dto.JammingName;
                existing.ScenarioName = dto.ScenarioName;
                existing.ScenarioTime = dto.ScenarioTime;
                existing.ModifiedDate = DateTime.UtcNow;

                // existing.IndependentTargetPhases.Clear();
                // if (dto.TargetPhases != null)
                //     existing.IndependentTargetPhases = dto.TargetPhases.Select(f =>
                //     {
                //         var entity = IndependentTargetPhaseMapToEntity(f);
                //         entity.IndependentJammingId = existing.JammingId;
                //         return entity;
                //     }).ToList();

                var updated = await _independentJammingRepository.UpdateAsync(existing);

                return (true, "Jamming updated successfully", IndependentJammingDtoMapToDto(updated));
            }
            // } 
            // catch (Exception ex)
            // {
            //     return (false, $"Error saving Jamming: {ex.Message}", null);
            // }
        }

        public async Task<JammingDto?>  GetIndependentJammingsAsync(int id)
        {
            var jamming = await _independentJammingRepository.GetByIdAsync(id);

            if (jamming == null) return null;

            return  IndependentJammingDtoMapToDto(jamming);
        }



       




        private StandaloneJamming JammingLibraryMapToEntity(JammingDto dto) =>
            new StandaloneJamming
            {
                JammingName = dto.JammingName,
                ScenarioName = dto.ScenarioName,
                ScernarioTime = dto.ScenarioTime,
                StandaloneModeId = dto.ModeId,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "ADMIN",
                ModifiedDate = DateTime.UtcNow
            };

        private IndependentModeJamming IndependentModeJammingMapToEntity(JammingDto dto) =>
            new IndependentModeJamming
            {
                JammingName = dto.JammingName,
                ScenarioName = dto.ScenarioName,
                ScenarioTime = dto.ScenarioTime,
                IndependentModeId = dto.ModeId,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "ADMIN",
                ModifiedDate = DateTime.UtcNow
            };

        private IndependentJamming IndependentJammingMapToEntity(JammingDto dto) =>
            new IndependentJamming
            {
                JammingName = dto.JammingName,
                ScenarioName = dto.ScenarioName,
                ScenarioTime = dto.ScenarioTime,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "ADMIN",
                ModifiedDate = DateTime.UtcNow
            };




        public static JammingDto JammingTargetPhaseMapToDto(Jamming entity)
        {
            return new JammingDto
            {   
                JammingId = entity.JammingId,
                JammingName = entity.JammingName,
                ScenarioName = entity.ScenarioName,
                ScenarioTime = entity.ScernarioTime,
                CreatedBy = "ADMIN",
                CreatedDate = entity.CreatedDate,
                ModifiedBy = "ADMIN",
                ModifiedDate = entity.ModifiedDate,
                ModeId = entity.ModeId,
                TargetPhases = entity.TargetPhases.Select(TargetPhaseDetailMapToDto).ToList()

            };
        }


        public static TargetPhaseDto TargetPhaseDetailMapToDto(StandaloneTargetPhase entity) =>
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

        public static TargetPhaseDto TargetPhaseDetailMapToDto(TargetPhase entity) =>
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


        public static TargetPhaseDto TargetPhaseDetailMapToDto(IndependentModeTargetPhase entity) =>
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




        public static JammingDto JammingLibraryDtoMapToDto(StandaloneJamming entity)
        {
            return new JammingDto
            {
                JammingId = entity.JammingId,
                JammingName = entity.JammingName,
                ScenarioName = entity.ScenarioName,
                ScenarioTime = entity.ScernarioTime,
                CreatedBy = "ADMIN",
                CreatedDate = entity.CreatedDate,
                ModifiedBy = "ADMIN",
                ModifiedDate = entity.ModifiedDate,
                ModeId = entity.StandaloneModeId,
                TargetPhases = entity.StandaloneTargetPhases.Select(TargetPhaseDetailMapToDto).ToList()

            };
        }

      
        public static JammingDto IndependentModeJammingDtoMapToDto(IndependentModeJamming entity)
        {
            return new JammingDto
            {
                JammingId = entity.JammingId,
                JammingName = entity.JammingName,
                ScenarioName = entity.ScenarioName,
                ScenarioTime = entity.ScenarioTime,
                CreatedBy = "ADMIN",
                CreatedDate = entity.CreatedDate,
                ModifiedBy = "ADMIN",
                ModifiedDate = entity.ModifiedDate,
                ModeId = entity.IndependentModeId,
                TargetPhases = entity.IndependentModeTargetPhases.Select(TargetPhaseDetailMapToDto).ToList()

            };
        }


        public static JammingDto IndependentJammingDtoMapToDto(IndependentJamming entity)
        {
            return new JammingDto
            {
                JammingId = entity.JammingId,
                JammingName = entity.JammingName,
                ScenarioName = entity.ScenarioName,
                ScenarioTime = entity.ScenarioTime,
                CreatedBy = "ADMIN",
                CreatedDate = entity.CreatedDate,
                ModifiedBy = "ADMIN",
                ModifiedDate = entity.ModifiedDate,
                ModeId = 0,
                TargetPhases = entity.IndependentTargetPhases.Select(TargetPhaseDetailMapToDto).ToList()

            };
        }

        public static TargetPhaseDto TargetPhaseDetailMapToDto(IndependentTargetPhase entity) =>
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
