using PFMG.DTOs;
using PFMG.Models;
using PFMG.Models.StandaloneModels;
using PFMG.Repositories;
using PFMG.Validators;
using PFMG.Validation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace PFMG.Services.impl
{
    public class WeaponServiceImpl : IWeaponService
    {
        private readonly WeaponRepository _repository;

        private readonly PlatformLibraryRepository _platformLibraryRepo;

        private readonly MissionRepository _missionRepository;

        public WeaponServiceImpl(WeaponRepository repository, MissionRepository missionRepository, PlatformLibraryRepository platformLibraryRepository)
        {
            _repository = repository;
            _missionRepository = missionRepository;
            _platformLibraryRepo = platformLibraryRepository;
        }

        public async Task<(bool Success, string Message, WeaponDto? Data)> SaveWeaponAsync(WeaponDto dto)
        {
            // var vr = PlatformValidator.Validate(dto);
            // if (!vr.IsValid)
            //     return (false, vr.ToString(), null);

            try
            {
                if (string.IsNullOrWhiteSpace(dto.WeaponName))
                    return (false, "Weapon name cannot be null or empty", null);

                
                var existingByName = await _repository.GetWeaponByNameAsync(dto.WeaponName);

                if (dto.WeaponId == 0) // Create
                {
                    if (existingByName != null)
                        return (false, "Weapon name already exists", null);

                    var weapon = new Weapon
                    {
                        WeaponName = dto.WeaponName,
                        WeaponDate = dto.WeaponDate,
                        Description = dto.Description,
                        ThreatType = dto.ThreatType,
                        ForeGroundColor = dto.ForeGroundColor,
                        BackGroundColor = dto.BackGroundColor,
                        Symbol = dto.Symbol,
                        DisplayStatus = dto.DisplayStatus,
                        Priority = dto.Priority,
                        CreatedBy = "ADMIN",
                        CreatedDate = DateTime.UtcNow,
                        ModifiedBy = "ADMIN",
                        ModifiedDate = DateTime.UtcNow,

                    };

                    Console.WriteLine("Weapon saved successfully!");
                    var saved = await _repository.AddWeaponAsync(weapon);
                    return (true, "Weapon created successfully", MapToDto(saved));
                }
                else // Update
                {
                    var existing = await _repository.GetWeaponByIdAsync(dto.WeaponId);
                    if (existing == null)
                        return (false, "Weapon not found", null);

                    if (existingByName != null && existingByName.WeaponId != dto.WeaponId)
                        return (false, "Weapon name already exists", null);

                    existing.WeaponName = dto.WeaponName;
                    existing.WeaponDate = dto.WeaponDate;
                    existing.Description = dto.Description;
                    existing.ThreatType = dto.ThreatType;
                    existing.ForeGroundColor = dto.ForeGroundColor;
                    existing.BackGroundColor = dto.BackGroundColor;
                    existing.DisplayStatus = dto.DisplayStatus;
                    existing.Symbol = dto.Symbol;
                    existing.Priority = dto.Priority;
                    existing.ModifiedBy = "ADMIN";
                    existing.ModifiedDate = DateTime.UtcNow;
                   

                    await _repository.UpdateWeaponAsync(existing);
                    return (true, "Weapon updated successfully", MapToDto(existing));
                }
            }
            catch (Exception ex)
            {
                // 🔹 You can replace Console.WriteLine with ILogger for real logging
                Console.WriteLine($"[SaveWeaponAsync] Error: {ex.Message}");
                return (false, "An unexpected error occurred while saving the weapon.", null);
            }
        }

        public async Task<IEnumerable<WeaponDto>> GetAllWeaponsAsync()
        {
            try
            {
                var weapons = await _repository.GetAllWeaponsAsync();
                return weapons.Select(MapToDto).ToList();
            }
            catch (Exception ex)
            {
                // 🔹 Replace with ILogger in production
                Console.WriteLine($"[GetAllWeaponsAsync] Error: {ex.Message}");

                // Return an empty list to avoid breaking the consumer
                return new List<WeaponDto>();
            }
        }

        public async Task<(bool Success, string Message)> DeleteWeaponAsync(int id)
        {
            try
            {
                var weapon = await _repository.GetWeaponByIdAsync(id);
                if (weapon == null)
                    return (false, "Weapon not found");

                await _repository.DeleteWeaponAsync(weapon);
                return (true, "Weapon deleted successfully");
            }
            catch (Exception ex)
            {
                // 🔹 Replace with ILogger in production
                Console.WriteLine($"[DeleteWeaponAsync] Error: {ex.Message}");

                return (false, "An unexpected error occurred while deleting the weapon");
            }
        }

        private WeaponDto MapToDto(Weapon weapon)
        {
            return new WeaponDto
            {
                WeaponId = weapon.WeaponId,
                WeaponName = weapon.WeaponName,
                WeaponDate = weapon.WeaponDate,
                Description = weapon.Description,
                ThreatType = weapon.ThreatType,
                ForeGroundColor = weapon.ForeGroundColor,
                BackGroundColor = weapon.BackGroundColor,
                Symbol = weapon.Symbol,
                DisplayStatus = weapon.DisplayStatus,
                Priority = weapon.Priority,
                CreatedBy = weapon.CreatedBy,
                CreatedDate = weapon.CreatedDate,
                ModifiedBy = weapon.ModifiedBy,
                ModifiedDate = weapon.ModifiedDate



            };
        }


        public async Task<WeaponTreeDto?> GetWeaponTreeByIdAsync(int WeaponId)
        {
            var weapon = await _repository.Query()
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModeFrequencyDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModePriDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModePwDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModeScanDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.Jammings)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.Jammings)
                            .ThenInclude(t => t.TargetPhases)
                .FirstOrDefaultAsync(w => w.WeaponId == WeaponId);

            if (weapon == null) return null;

            return MapToTreeDto(weapon);
        }


        public static WeaponTreeDto MapToTreeDto(Weapon weapon)
        {
            return new WeaponTreeDto
            {
                WeaponId = weapon.WeaponId,
                WeaponName = weapon.WeaponName,
                WeaponDate = weapon.WeaponDate,
                Description = weapon.Description,
                ThreatType = weapon.ThreatType,
                ForeGroundColor = weapon.ForeGroundColor,
                BackGroundColor = weapon.BackGroundColor,
                Symbol = weapon.Symbol,
                DisplayStatus = weapon.DisplayStatus,
                Priority = weapon.Priority,
                CreatedBy = weapon.CreatedBy,
                CreatedDate = weapon.CreatedDate,
                ModifiedBy = weapon.ModifiedBy,
                ModifiedDate = weapon.ModifiedDate,
                Emitters = weapon.Emitters?.Select(MapEmitterToTreeDto).ToList() ?? new()
            };
        }

        public static EmitterTreeDto MapEmitterToTreeDto(Emitter e)
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
                Modes = e.Modes?.Select(MapToTreeDto).ToList() ?? new()
            };
        }

        public static ModeTreeDto MapToTreeDto(Mode m)
        {
            return new ModeTreeDto
            {
                ModeId = m.ModeId,
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
                //ModeDfs = m.ModeDfs?.Select(ModeServiceImpl.ModeDfMapToDto).ToList() ?? new(),
                ModeFrequencyDetails = m.ModeFrequencyDetails?.Select(ModeServiceImpl.ModeFrequencyDetailMapToDto).ToList() ?? new(),
                //ModeFrequencyRanges = m.ModeFrequencyRanges?.Select(ModeServiceImpl.ModeFrequencyRangeMapToDto).ToList() ?? new(),
                //ModeLssDetails = m.ModeLssDetails?.Select(ModeServiceImpl.ModeLssDetailMapToDto).ToList() ?? new(),
                ModePriDetails = m.ModePriDetails?.Select(ModeServiceImpl.ModePriDetailMapToDto).ToList() ?? new(),
                //ModePriRanges = m.ModePriRanges?.Select(ModeServiceImpl.ModePriRangeMapToDto).ToList() ?? new(),
                //ModePriPwRanges = m.ModePriPwRanges?.Select(ModeServiceImpl.ModePriPwRangeMapToDto).ToList() ?? new(),
                //ModePriStaggerLevels = m.ModePriStaggerLevels?.Select(ModeServiceImpl.ModePriStaggerLevelMapToDto).ToList() ?? new(),
                ModePwDetails = m.ModePwDetails?.Select(ModeServiceImpl.ModePwDetailMapToDto).ToList() ?? new(),
                ModeScanDetails = m.ModeScanDetails?.Select(ModeServiceImpl.ModeScanDetailMapToDto).ToList() ?? new(),

                // jammings
                Jammings = m.Jammings?.Select(JammingServiceImpl.JammingTargetPhaseMapToDto).ToList() ?? new()
            };
        }


       
    }
}
