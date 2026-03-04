using PFMG.DTOs;
using PFMG.Models;
using PFMG.Models.StandaloneModels;
using PFMG.Repositories;
using PFMG.Validators;
using PFMG.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace PFMG.Services.impl
{
    public class EmitterServiceImpl : IEmitterService
    {
        private readonly IEmitterRepository _repository;
        private readonly IEmitterLibraryRepository _emitterLibraryRepository;

        private readonly WeaponRepository _weaponRepository;



        public EmitterServiceImpl(IEmitterRepository repository, IEmitterLibraryRepository emitterLibraryRepository, WeaponRepository weaponRepository)
        {
            _repository = repository;
            _emitterLibraryRepository = emitterLibraryRepository;
            _weaponRepository = weaponRepository;
        }

        public async Task<(bool Success, string Message, EmitterDto? Data)> SaveEmitterAsync(EmitterDto dto)
        {
            //var vr = EmitterValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            if (string.IsNullOrWhiteSpace(dto.EmitterName))
                return (false, "Emitter name cannot be null or empty", null);

            if (dto.WeaponId == 0)
                return (false, "Please provide a valid weapon id.", null);

            var weapon = await _weaponRepository.GetWeaponByIdAsync(dto.WeaponId);
            if (weapon == null)
                return (false, "Weapon not found", null);

            var existingByName = _repository.Query()
                .FirstOrDefault(e => e.EmitterName == dto.EmitterName && e.EmitterId != dto.EmitterId);

            var existingByNameStandalone = _emitterLibraryRepository.Query().FirstOrDefault(se => se.EmitterName == dto.EmitterName);

            if (dto.EmitterId == 0) // Create
            {
                if (existingByName != null || existingByNameStandalone != null)
                    return (false, "Emitter name already exists", null);

                var emitter = new Emitter
                {
                    EmitterName = dto.EmitterName,
                    Description = dto.Description,
                    EmitterType = dto.EmitterType,
                    Symbol = dto.Symbol,
                    ForegroundColor = dto.ForegroundColor,
                    BackgroundColor = dto.BackgroundColor,
                    IsUnknown = dto.IsUnknown,
                    IsGroundOnly = dto.IsGroundOnly,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    WeaponId = dto.WeaponId,
                    CreatedBy = "ADMIN",
                    CreatedDate = DateTime.UtcNow,
                    ModifiedBy = "ADMIN",
                    ModifiedDate = DateTime.UtcNow,


                };

                var saved = await _repository.AddAsync(emitter);
                return (true, "Emitter created successfully", MapToDto(saved));
            }
            else // Update
            {
                var existing = await _repository.GetByIdAsync(dto.EmitterId);
                if (existing == null)
                    return (false, "Emitter not found", null);

                if (existingByName != null && existingByName.EmitterId != dto.EmitterId || existingByNameStandalone != null)
                    return (false, "Emitter name already exists", null);

                existing.EmitterName = dto.EmitterName;
                existing.Description = dto.Description;
                existing.EmitterType = dto.EmitterType;
                existing.Symbol = dto.Symbol;
                existing.ForegroundColor = dto.ForegroundColor;
                existing.BackgroundColor = dto.BackgroundColor;
                existing.IsUnknown = dto.IsUnknown;
                existing.IsGroundOnly = dto.IsGroundOnly;
                existing.Latitude = dto.Latitude;
                existing.Longitude = dto.Longitude;
                existing.WeaponId = dto.WeaponId;
                existing.ModifiedBy = "ADMIN";
                existing.ModifiedDate = DateTime.UtcNow;
             
                var updated = await _repository.UpdateAsync(existing);
                return (true, "Emitter updated successfully", MapToDto(updated));
            }
        }

        public async Task<IEnumerable<EmitterDto>> GetAllEmittersAsync()
        {
            try
            {
                var emitters = _repository.Query().OrderByDescending(e => e.ModifiedDate).ToList();
                return emitters.Select(MapToDto).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllEmittersAsync: {ex.Message}");
                return new List<EmitterDto>(); // return empty list on error
            }
        }

        public async Task<(bool Success, string Message)> DeleteEmitterAsync(int id)
        {
            try
            {
                if (id == 0)
                    return (false, "Please provide a valid weapon id.");

                var emitter = await _repository.GetByIdAsync(id);
                if (emitter == null)
                    return (false, "Emitter not found");

                await _repository.DeleteAsync(id);
                return (true, "Emitter deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteEmitterAsync: {ex.Message}");
                return (false, "An error occurred while deleting the emitter");
            }
        }


        public async Task<(bool Success, string Message)> DeleteStandaloneEmitterAsync(int id)
        {
            try
            {
                if (id == 0)
                    return (false, "Please provide a valid StandaloneEmitter id.");

                var emitter = await _emitterLibraryRepository.GetByIdAsync(id);
                if (emitter == null)
                    return (false, "StandaloneEmitter not found");

                await _emitterLibraryRepository.DeleteAsync(id);
                return (true, "StandaloneEmitter deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteEmitterAsync: {ex.Message}");
                return (false, "An error occurred while deleting the StandaloneEmitter");
            }
        }


        private EmitterDto MapToDto(Emitter emitter)
        {
            return new EmitterDto
            {
                EmitterId = emitter.EmitterId,
                EmitterName = emitter.EmitterName,
                Description = emitter.Description,
                EmitterType = emitter.EmitterType,
                Symbol = emitter.Symbol,
                ForegroundColor = emitter.ForegroundColor,
                BackgroundColor = emitter.BackgroundColor,
                IsUnknown = emitter.IsUnknown,
                IsGroundOnly = emitter.IsGroundOnly,
                Latitude = emitter.Latitude,
                Longitude = emitter.Longitude,
                WeaponId = emitter.WeaponId,
                ModifiedBy = emitter.ModifiedBy,
                CreatedBy = emitter.CreatedBy,
                CreatedDate = emitter.CreatedDate,
                ModifiedDate = emitter.ModifiedDate,

            };
        }


        private StandaloneEmitterDto MapToDto(StandaloneEmitter emitter)
        {
            return new StandaloneEmitterDto
            {
                EmitterId = emitter.EmitterId,
                EmitterName = emitter.EmitterName,
                Description = emitter.Description,
                EmitterType = emitter.EmitterType,
                Symbol = emitter.Symbol,
                ForegroundColor = emitter.ForegroundColor,
                BackgroundColor = emitter.BackgroundColor,
                IsUnknown = emitter.IsUnknown,
                IsGroundOnly = emitter.IsGroundOnly,
                Latitude = emitter.Latitude,
                Longitude = emitter.Longitude,
                CreatedBy = emitter.CreatedBy,
                CreatedDate = emitter.CreatedDate,
                ModifiedBy = emitter.ModifiedBy,
                ModifiedDate = emitter.ModifiedDate

            };
        }


        public async Task<(bool Success, string Message, StandaloneEmitterDto? Data)> SaveStandaloneEmitterAsync(StandaloneEmitterDto dto)
        {
            //var vr = StandaloneEmitterValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            if (string.IsNullOrWhiteSpace(dto.EmitterName))
                return (false, "Emitter name cannot be null or empty", null);

            var existingByStanadloneEmitter = _repository.Query()
                .FirstOrDefault(e => e.EmitterName == dto.EmitterName);

            var existingByName = _emitterLibraryRepository.Query()
                .FirstOrDefault(e => e.EmitterName == dto.EmitterName && e.EmitterId != dto.EmitterId);

            if (dto.EmitterId == 0) // Create
            {
                if (existingByName != null || existingByStanadloneEmitter != null)
                    return (false, "Emitter name already exists", null);

                var emitter = new StandaloneEmitter
                {
                    EmitterName = dto.EmitterName,
                    Description = dto.Description,
                    EmitterType = dto.EmitterType,
                    Symbol = dto.Symbol,
                    ForegroundColor = dto.ForegroundColor,
                    BackgroundColor = dto.BackgroundColor,
                    IsUnknown = dto.IsUnknown,
                    IsGroundOnly = dto.IsGroundOnly,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    CreatedBy = "ADMIN",
                    CreatedDate = DateTime.UtcNow,
                    ModifiedBy = "ADMIN",
                    ModifiedDate = DateTime.UtcNow

                };

                var saved = await _emitterLibraryRepository.AddAsync(emitter);
                return (true, "Emitter created successfully", MapToDto(saved));
            }
            else // Update
            {
                var existing = await _emitterLibraryRepository.GetByIdAsync(dto.EmitterId);
                if (existing == null)
                    return (false, "Emitter not found", null);

                if (existingByName != null && existingByName.EmitterId != dto.EmitterId  || existingByStanadloneEmitter != null)
                    return (false, "Emitter name already exists", null);

                existing.EmitterName = dto.EmitterName;
                existing.Description = dto.Description;
                existing.EmitterType = dto.EmitterType;
                existing.Symbol = dto.Symbol;
                existing.ForegroundColor = dto.ForegroundColor;
                existing.BackgroundColor = dto.BackgroundColor;
                existing.IsUnknown = dto.IsUnknown;
                existing.IsGroundOnly = dto.IsGroundOnly;
                existing.Latitude = dto.Latitude;
                existing.Longitude = dto.Longitude;
                existing.ModifiedDate = DateTime.UtcNow;


                var updated = await _emitterLibraryRepository.UpdateAsync(existing);
                return (true, "Emitter updated successfully", MapToDto(updated));
            }
        }

        public async Task<IEnumerable<StandaloneEmitterDto>> GetAllStandaloneEmittersAsync()
        {
            try
            {
                var emitters = _emitterLibraryRepository.Query().OrderByDescending(e => e.ModifiedDate).ToList();
                return emitters.Select(MapToDto).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllStandaloneEmittersAsync: {ex.Message}");
                return new List<StandaloneEmitterDto>();
            }
        }


        public async Task<IEnumerable<EmitterCoordinateDto>> GetAllEmittersCoordinatesAsync()
        {
            try
            {
                // ✅ Await the repository call correctly
                var emitterCoordinateDtos = await _repository.GetAllEmitterCoordinatesAsync();
                return emitterCoordinateDtos;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllEmittersCoordinatesAsync: {ex.Message}");
                return new List<EmitterCoordinateDto>();
            }
        }




        private EmitterDto MapToDto<T>(T emitter) where T : class
        {
            dynamic e = emitter;
            return new EmitterDto
            {
                EmitterId = e.EmitterId,
                EmitterName = e.EmitterName,
                Description = e.Description,
                EmitterType = e.EmitterType,
                Symbol = e.Symbol,
                ForegroundColor = e.ForegroundColor,
                BackgroundColor = e.BackgroundColor,
                IsUnknown = e.IsUnknown,
                IsGroundOnly = e.IsGroundOnly,
                Latitude = e.Latitude,
                Longitude = e.Longitude,
                WeaponId = e.WeaponId,
                CreatedBy = e.CreatedBy,
                CreatedDate = e.CreatedDate,
                ModifiedBy = e.ModifiedBy,
                ModifiedDate = e.ModifiedDate,
            };
        }


        public async Task<EmitterTreeDto?> GetWeaponEmitterTreeByIdAsync(int emitterId)

        {
            var emitter = await _repository.Query()
                    .Include(e => e.Modes)
                        .ThenInclude(m => m.ModeFrequencyDetails)
                .Include(w => w.Modes)
                        .ThenInclude(m => m.ModePriDetails)
                .Include(w => w.Modes)
                        .ThenInclude(m => m.ModePwDetails)
                .Include(w => w.Modes)
                        .ThenInclude(m => m.ModeScanDetails)
                .Include(w => w.Modes)
                        .ThenInclude(m => m.Jammings)
                .FirstOrDefaultAsync(w => w.EmitterId == emitterId);

            if (emitter == null) return null;

            return WeaponServiceImpl.MapEmitterToTreeDto(emitter);
        }


        public async Task<EmitterTreeDto?> GetEmitterTreeByIdAsync(int emitterId)

        {
            var emitter = await _emitterLibraryRepository.Query()
                    .Include(e => e.StandaloneModes)
                        .ThenInclude(m => m.ModeFrequencyDetails)
                .Include(w => w.StandaloneModes)
                        .ThenInclude(m => m.ModePriDetails)
                .Include(w => w.StandaloneModes)
                        .ThenInclude(m => m.ModePwDetails)
                .Include(w => w.StandaloneModes)
                        .ThenInclude(m => m.ModeScanDetails)
                .Include(w => w.StandaloneModes)
                        .ThenInclude(m => m.Jammings)
                .Include(w => w.StandaloneModes)
                        .ThenInclude(m => m.Jammings)
                            .ThenInclude(j => j.StandaloneTargetPhases)
                .FirstOrDefaultAsync(w => w.EmitterId == emitterId);

            if (emitter == null) return null;

            return MapToTreeDto(emitter);
        }



        private EmitterTreeDto MapToTreeDto(StandaloneEmitter e)
        {
            return new EmitterTreeDto
            {
                EmitterId = e.EmitterId,
                EmitterName = e.EmitterName,
                EmitterType = e.EmitterType,
                Description = e.Description,
                Symbol = e.Symbol,
                ForegroundColor = e.ForegroundColor,
                BackgroundColor = e.BackgroundColor,
                IsUnknown = e.IsUnknown,
                IsGroundOnly = e.IsGroundOnly,
                CreatedBy = e.CreatedBy,
                DateCreated = e.CreatedDate,
                ModifiedBy = e.ModifiedBy,
                ModifiedDate = e.ModifiedDate,
                Latitude = e.Latitude,
                Longitude = e.Longitude,
                Modes = e.StandaloneModes?.Select(MapToTreeDto).ToList() ?? new()
            };
        }



        public static ModeTreeDto MapToTreeDto(StandaloneMode m)
        {
            return new ModeTreeDto
            {
                ModeId = m.StandaloneModeId,
                ModeName = m.ModeName,
                Description = m.Description,
                ModeType = m.ModeType,
                PlatformType = m.PlatformType,
                SubMode = m.SubMode,
                ThreatType = m.ThreatType,
                TestType = m.TestType,
                //PriStaggerLevel = m.PriStaggerLevel,
                SymbolCodeType = m.SymbolCodeType,
                ModeSymbol = m.ModeSymbol,
                BgColor = m.BgColor,
                FgColor = m.FgColor,
                RangeEstimation = m.RangeEstimation,
                EirpValue = m.EirpValue,
                LethalRange = m.LethalRange,
                GroundOnly = m.GroundOnly,
                CreatedBy = m.CreatedBy,
                CreatedDate = m.CreatedDate,
                ModifiedBy = m.ModifiedBy,
                ModifiedDate = m.ModifiedDate,
                EmitterId = m.EmitterId,
                FrequencyType = m.FrequencyType,
                FrequencyClass = m.FrequencyClass,
                PriType = m.PriType,
                PriClass = m.PriClass,
                PwType = m.PwType,
                PwClass = m.PwClass,

                // map children
                ModeFrequencyDetails = m.ModeFrequencyDetails?.Select(ModeFrequencyDetailMapToDto).ToList() ?? new(),

                ModePriDetails = m.ModePriDetails?.Select(ModePriDetailMapToDto).ToList() ?? new(),
                ModePwDetails = m.ModePwDetails?.Select(ModePwDetailMapToDto).ToList() ?? new(),

                ModeScanDetails = m.ModeScanDetails?.Select(ModeScanDetailMapToDto).ToList() ?? new(),

                // jammings
                Jammings = m.Jammings?.Select(JammingDtoMapToDto).ToList() ?? new()
            };
        }

        public static ModeFrequencyDetailDto ModeFrequencyDetailMapToDto(StandaloneModeFrequencyDetail entity) =>
            new ModeFrequencyDetailDto { Id = entity.Id, MinFrequency = entity.MinFrequency, MaxFrequency = entity.MaxFrequency, FrequencyStaggerLevel = entity.FrequencyStaggerLevel, FrequencyJitterMean
             = entity.FrequencyJitterMean, FrequencyJitterPercentage = entity.FrequencyJitterPercentage};

        public static ModePriDetailDto ModePriDetailMapToDto(StandaloneModePriDetail entity) =>
            new ModePriDetailDto { Id = entity.Id,  MinPri = entity.MinPri, MaxPri = entity.MaxPri, PriStaggerLevel = entity.PriStaggerLevel ,PriJitterMean = entity.PriJitterMean, PriJitterPercentage = entity.PriJitterPercentage };

        public static ModeScanDetailDto ModeScanDetailMapToDto(StandaloneModeScanDetail entity) =>
            new ModeScanDetailDto { Id = entity.Id, ScanType = entity.ScanType, MinScanSector = entity.MinScanSector, MaxScanSector = entity.MaxScanSector, MinScanRate = entity.MinScanRate, MaxScanRate = entity.MaxScanRate, NominalScanRate = entity.NominalScanRate, SideLobeLevel = entity.SideLobeLevel, SideLobeStd = entity.SideLobeStd, MinBeamWidth = entity.MinBeamWidth, MaxBeamWidth = entity.MaxBeamWidth, CalculatedTot = entity.CalculatedTot, MinTot = entity.MinTot, MaxTot = entity.MaxTot };

        public static ModePwDetailDto ModePwDetailMapToDto(StandaloneModePwDetail entity) =>
            new ModePwDetailDto { Id = entity.Id, MinPw = entity.MinPw, MaxPw = entity.MaxPw, PwStaggerLevel = entity.PwStaggerLevel, PwJitterMean = entity.PwJitterMean, PwJitterPercentage = entity.PwJitterPercentage };
        public static JammingDto JammingDtoMapToDto(StandaloneJamming entity)
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

    }
}
