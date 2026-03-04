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
    public class PlatformServiceImpl : IPlatformService
    {
        private readonly PlatformRepository _repository;

        private readonly PlatformLibraryRepository _platformLibraryRepo;

        private readonly MissionRepository _missionRepository;

        public PlatformServiceImpl(PlatformRepository repository, MissionRepository missionRepository, PlatformLibraryRepository platformLibraryRepository)
        {
            _repository = repository;
            _missionRepository = missionRepository;
            _platformLibraryRepo = platformLibraryRepository;
        }

        public async Task<(bool Success, string Message, PlatformDto? Data)> SavePlatformAsync(PlatformDto dto)
        {
            //var vr = PlatformValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            try
            {
                if (string.IsNullOrWhiteSpace(dto.PlatformName))
                    return (false, "Platform name cannot be null or empty", null);

                var existing_mission = await _missionRepository.GetMissionByIdAsync(dto.MissionId);
                if (existing_mission == null)
                    return (false, "Mission not found", null);
                var existingByName = await _repository.GetPlatformByNameAsync(dto.PlatformName);

                if (dto.PlatformId == 0) // Create
                {
                    if (existingByName != null)
                        return (false, "Platform name already exists", null);

                    var platform = new Platform
                    {
                        PlatformName = dto.PlatformName,
                        ThreatType = dto.ThreatType,
                        Priority = dto.Priority,
                        DisplayStatus = dto.DisplayStatus,
                        SymbolCodeType = dto.SymbolCodeType,
                        AlternateSymbol = dto.AlternateSymbol,
                        ForeGroundColor = dto.ForeGroundColor,
                        BackGroundColor = dto.BackGroundColor,
                        Description = dto.Description,
                        ThumbnailImage = dto.ThumbnailImage,
                        PreviewSymbol = dto.PreviewSymbol,
                        CreatedAt = dto.CreatedAt ?? DateTime.UtcNow,
                        UserId = dto.UserId,
                        MissionId = dto.MissionId
                    };

                    Console.WriteLine("Platform saved successfully!");
                    var saved = await _repository.AddPlatformAsync(platform);
                    return (true, "Platform created successfully", MapToDto(saved));
                }
                else // Update
                {
                    var existing = await _repository.GetPlatformByIdAsync(dto.PlatformId);
                    if (existing == null)
                        return (false, "Platform not found", null);

                    if (existingByName != null && existingByName.PlatformId != dto.PlatformId)
                        return (false, "Platform name already exists", null);

                    existing.PlatformName = dto.PlatformName;
                    existing.ThreatType = dto.ThreatType;
                    existing.Priority = dto.Priority;
                    existing.DisplayStatus = dto.DisplayStatus;
                    existing.SymbolCodeType = dto.SymbolCodeType;
                    existing.AlternateSymbol = dto.AlternateSymbol;
                    existing.ForeGroundColor = dto.ForeGroundColor;
                    existing.BackGroundColor = dto.BackGroundColor;
                    existing.Description = dto.Description;
                    existing.ThumbnailImage = Array.Empty<byte>();
                    existing.PreviewSymbol = Array.Empty<byte>();
                    existing.UserId = dto.UserId;


                    await _repository.UpdatePlatformAsync(existing);
                    return (true, "Platform updated successfully", MapToDto(existing));
                }
            }
            catch (Exception ex)
            {
                // 🔹 You can replace Console.WriteLine with ILogger for real logging
                Console.WriteLine($"[SavePlatformAsync] Error: {ex.Message}");
                return (false, "An unexpected error occurred while saving the platform.", null);
            }
        }

        public async Task<IEnumerable<PlatformDto>> GetAllPlatformsAsync()
        {
            try
            {
                var platforms = await _repository.GetAllPlatformsAsync();
                return platforms.Select(MapToDto).ToList();
            }
            catch (Exception ex)
            {
                // 🔹 Replace with ILogger in production
                Console.WriteLine($"[GetAllPlatformsAsync] Error: {ex.Message}");

                // Return an empty list to avoid breaking the consumer
                return new List<PlatformDto>();
            }
        }

        public async Task<(bool Success, string Message)> DeletePlatformAsync(int id)
        {
            try
            {
                var platform = await _repository.GetPlatformByIdAsync(id);
                if (platform == null)
                    return (false, "Platform not found");

                await _repository.DeletePlatformAsync(platform);
                return (true, "Platform deleted successfully");
            }
            catch (Exception ex)
            {
                // 🔹 Replace with ILogger in production
                Console.WriteLine($"[DeletePlatformAsync] Error: {ex.Message}");

                return (false, "An unexpected error occurred while deleting the platform");
            }
        }

        private PlatformDto MapToDto(Platform platform)
        {
            return new PlatformDto
            {
                PlatformId = platform.PlatformId,
                PlatformName = platform.PlatformName,
                ThreatType = platform.ThreatType,
                Priority = platform.Priority,
                DisplayStatus = platform.DisplayStatus,
                SymbolCodeType = platform.SymbolCodeType,
                AlternateSymbol = platform.AlternateSymbol,
                ForeGroundColor = platform.ForeGroundColor,
                BackGroundColor = platform.BackGroundColor,
                Description = platform.Description,
                CreatedAt = platform.CreatedAt,
                UserId = platform.UserId,
                MissionId = platform.MissionId
            };
        }


        // public async Task<PlatformTreeDto?> GetPlatformTreeByIdAsync(int platformId)
        // {
        //     var platform = await _repository.Query()
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 //.ThenInclude(m => m.ModeDfs)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 .ThenInclude(m => m.ModeFrequencyDetails)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 //.ThenInclude(m => m.ModeFrequencyRanges)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 //.ThenInclude(m => m.ModeLssDetails)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 .ThenInclude(m => m.ModePriDetails)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 //.ThenInclude(m => m.ModePriRanges)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 //.ThenInclude(m => m.ModePriPwRanges)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 //.ThenInclude(m => m.ModePriStaggerLevels)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 .ThenInclude(m => m.ModePwDetails)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 .ThenInclude(m => m.ModeScanDetails)
        //         .Include(p => p.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 .ThenInclude(m => m.Jammings)
        //         .FirstOrDefaultAsync(p => p.PlatformId == platformId);

        //     if (platform == null) return null;

        //     return MapToTreeDto(platform);
        // }


        // private PlatformTreeDto MapToTreeDto(Platform p)
        // {
        //     return new PlatformTreeDto
        //     {
        //         PlatformId = p.PlatformId,
        //         PlatformName = p.PlatformName,
        //         ThreatType = p.ThreatType,
        //         Priority = p.Priority,
        //         DisplayStatus = p.DisplayStatus,
        //         SymbolCodeType = p.SymbolCodeType,
        //         AlternateSymbol = p.AlternateSymbol,
        //         ForeGroundColor = p.ForeGroundColor,
        //         BackGroundColor = p.BackGroundColor,
        //         Description = p.Description,
        //         CreatedAt = p.CreatedAt,
        //         UserId = p.UserId,
        //         Emitters = p.Emitters?.Select(MapToTreeDto).ToList() ?? new()
        //     };
        // }

        private EmitterTreeDto MapToTreeDto(Emitter e)
        {
            return new EmitterTreeDto
            {
                EmitterId = e.EmitterId,
                EmitterName = e.EmitterName,
                Modes = e.Modes?.Select(MapToTreeDto).ToList() ?? new()
            };
        }

        public ModeTreeDto MapToTreeDto(Mode m)
        {
            return new ModeTreeDto
            {
                ModeId = m.ModeId,
                ModeName = m.ModeName,

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


        public async Task<(bool Success, string Message, PlatformDto? Data)> SaveStandalonePlatform(PlatformDto dto)
        {
            //var vr = PlatformValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            if (string.IsNullOrWhiteSpace(dto.PlatformName))
                return (false, "Platform name cannot be null or empty", null);

            var existingByName = await _platformLibraryRepo.GetPlatformLibraryByNameAsync(dto.PlatformName);

            if (dto.PlatformId == 0) // Create
            {
                if (existingByName != null)
                    return (false, "Platform name already exists", null);

                var platform = new PlatformLibrary
                {
                    PlatformName = dto.PlatformName,
                    ThreatType = dto.ThreatType,
                    Priority = dto.Priority,
                    DisplayStatus = dto.DisplayStatus,
                    SymbolCodeType = dto.SymbolCodeType,
                    AlternateSymbol = dto.AlternateSymbol,
                    ForeGroundColor = dto.ForeGroundColor,
                    BackGroundColor = dto.BackGroundColor,
                    Description = dto.Description,
                    ThumbnailImage = dto.ThumbnailImage,
                    PreviewSymbol = dto.PreviewSymbol,
                    CreatedAt = dto.CreatedAt ?? DateTime.UtcNow,
                    UserId = dto.UserId,
                };

                Console.WriteLine("Platform saved successfully!");


                var saved = await _platformLibraryRepo.AddPlatformLibraryAsync(platform);


                return (true, "Platform created successfully", PlatformLibraryMapToDto(saved));
            }
            else // Update
            {
                var existing = await _platformLibraryRepo.GetPlatformLibraryByIdAsync(dto.PlatformId);
                if (existing == null)
                    return (false, "Platform not found", null);

                if (existingByName != null && existingByName.PlatformId != dto.PlatformId)
                    return (false, "Platform name already exists", null);

                existing.PlatformName = dto.PlatformName;
                existing.ThreatType = dto.ThreatType;
                existing.Priority = dto.Priority;
                existing.DisplayStatus = dto.DisplayStatus;
                existing.SymbolCodeType = dto.SymbolCodeType;
                existing.AlternateSymbol = dto.AlternateSymbol;
                existing.ForeGroundColor = dto.ForeGroundColor;
                existing.BackGroundColor = dto.BackGroundColor;
                existing.Description = dto.Description;
                existing.ThumbnailImage = Array.Empty<byte>();
                existing.PreviewSymbol = Array.Empty<byte>();
                existing.UserId = dto.UserId;


                await _platformLibraryRepo.UpdatePlatformLibraryAsync(existing);

                return (true, "Platform updated successfully", PlatformLibraryMapToDto(existing));
            }
        }


        public async Task<IEnumerable<PlatformDto>> GetAllPlatformsLibraryAsync()
        {
            var platforms = await _platformLibraryRepo.GetAllPlatformsLibraryAsync();
            return platforms.Select(PlatformLibraryMapToDto).ToList();
        }
        
        private PlatformDto PlatformLibraryMapToDto(PlatformLibrary platform)
        {
            return new PlatformDto
            {
                PlatformId = platform.PlatformId,
                PlatformName = platform.PlatformName,
                ThreatType = platform.ThreatType,
                Priority = platform.Priority,
                DisplayStatus = platform.DisplayStatus,
                SymbolCodeType = platform.SymbolCodeType,
                AlternateSymbol = platform.AlternateSymbol,
                ForeGroundColor = platform.ForeGroundColor,
                BackGroundColor = platform.BackGroundColor,
                Description = platform.Description,
                CreatedAt = platform.CreatedAt,
                UserId = platform.UserId,
            };
        }

    }
}
