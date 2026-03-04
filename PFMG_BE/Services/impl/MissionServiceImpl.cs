using PFMG.Data;
using PFMG.DTOs;
using PFMG.Enums;
using PFMG.Models;
using PFMG.Models.StandaloneModels;
using PFMG.Repositories;
using PFMG.Validators;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;



namespace PFMG.Services.impl
{
    public class MissionServiceImpl : IMissionService
    {
        private readonly MissionRepository _repository;

        private readonly AppDbContext _context;

        public MissionServiceImpl(MissionRepository repository, AppDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<(bool Success, string Message, MissionDto? Data)> SaveMissionAsync(MissionDto dto)
        {
            //var vr = MissionValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            try
            {

                if (string.IsNullOrWhiteSpace(dto.MissionName))
                    return (false, "Mission name cannot be null or empty", null);

                var existingByName = await _repository.GetMissionByNameAsync(dto.MissionName);

                if (dto.MissionId == 0) // Create
                {
                    if (existingByName != null)
                        return (false, "Mission name already exists", null);

                    var mission = new Mission
                    {
                        MissionName = dto.MissionName,
                        MissionDate = dto.MissionDate ?? DateTime.UtcNow,
                        Description = dto.Description,
                        MissionType = dto.MissionType,
                        ModifiedBy = "ADMIN",
                        ModifiedDate = DateTime.UtcNow,
                        Status = dto.Status,
                        UserId = dto.UserId
                    };

                    Console.WriteLine("Mission saved successfully!");


                    var saved = await _repository.AddPlatformAsync(mission);


                    return (true, "Mission created successfully", MapToDto(saved));
                }
                else // Update
                {
                    var existing = await _repository.GetMissionByIdAsync(dto.MissionId);
                    if (existing == null)
                        return (false, "Mission not found", null);

                    if (existingByName != null && existingByName.MissionId != dto.MissionId)
                        return (false, "Mission name already exists", null);

                    existing.MissionName = dto.MissionName;
                    existing.MissionDate = dto.MissionDate ?? DateTime.UtcNow;
                    existing.Description = dto.Description;
                    existing.MissionType = dto.MissionType;
                    existing.ModifiedDate = DateTime.UtcNow;
                    existing.Status = dto.Status;



                    await _repository.UpdateMissionAsync(existing);

                    return (true, "Mission updated successfully", MapToDto(existing));
                }
            }

            catch (Exception ex)
            {
                // 🔹 Replace with ILogger for real logging
                Console.WriteLine($"[SaveMissionAsync] Error: {ex.Message}");
                return (false, "An unexpected error occurred while saving the mission", null);
            }
        }

        public async Task<IEnumerable<MissionDto>> GetAllMissionsAsync()
        {
            try
            {
                var platforms = await _repository.GetAllMissionsAsync();
                return platforms.Select(MapToDto).ToList();
            }
            catch (Exception ex)
            {

                Console.WriteLine($"[GetAllMissionAsync] Error: {ex.Message}");

                // You can also log the exception here (e.g., _logger.LogError(ex, "Error while fetching missions");)
                return new List<MissionDto>();
            }
        }

        public async Task<(bool Success, string Message)> DeleteMissionAsync(int id)
        {
            try
            {
                var platform = await _repository.GetMissionByIdAsync(id);
                if (platform == null)
                    return (false, "Mission not found");

                await _repository.DeleteMissionAsync(platform);
                return (true, "Mission deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }

        private MissionDto MapToDto(Mission mission)
        {
            return new MissionDto
            {
                MissionId = mission.MissionId,
                MissionName = mission.MissionName,
                MissionDate = mission.MissionDate,
                Description = mission.Description,
                MissionType = mission.MissionType,
                Status = mission.Status,
                UserId = mission.UserId

            };
        }

        // public async Task<MissionTreeDto?> GetMissionTreeByIdAsync(int missionId)
        // {
        //     var mission = await _repository.Query()
        //         .Include(m => m.AreaInterests) // load AreaInterest
        //             .ThenInclude(ai => ai.AreaInterestCoordinates) // load coordinates
        //         .FirstOrDefaultAsync(m => m.MissionId == missionId);

        //     if (mission == null) return null;

        //     // Load Platforms
        //     await _context.Entry(mission)
        //         .Collection(m => m.Platforms)
        //         .LoadAsync();


        //     if (mission.AreaInterests != null)
        //     {
        //         // Load AreaInterestCoordinates (one-to-many)
        //         await _context.Entry(mission.AreaInterests)
        //             .Collection(ai => ai.AreaInterestCoordinates)
        //             .LoadAsync();

        //         await _context.Entry(mission.AreaInterests)
        //         .Collection(m => m.EmitterModeLinks)
        //         .LoadAsync();

        //     }

            
        //     return MapToMissionTreeDto(mission);
        // }

        public async Task<MissionTreeDto?> GetMissionTreeByIdAsync(int missionId)
        {
            var mission = await _repository.Query()
                .Include(m => m.Platforms)
                .Include(m => m.AreaInterests)
                    .ThenInclude(ai => ai.AreaInterestCoordinates)
                .Include(m => m.AreaInterests)
                    .ThenInclude(ai => ai.EmitterModeLinks)
                .FirstOrDefaultAsync(m => m.MissionId == missionId);

            if (mission == null)
                return null;

            // ✅ Mapping using your method
            var missionTreeDto = MapToMissionTreeDto(mission);

            return missionTreeDto;
        }


            
    
        
        private MissionTreeDto MapToMissionTreeDto(Mission mission)
        {
            return new MissionTreeDto
            {
                MissionId = mission.MissionId,
                MissionName = mission.MissionName,
                Description = mission.Description,
                MissionType = mission.MissionType,
                Status = mission.Status,
                UserId = mission.UserId,

                // ✅ Loop through the list properly
                AreaInterests = mission.AreaInterests != null 
                    ? mission.AreaInterests.Select(AreaMapToDto).ToList()
                    : new List<ResponseAreaInterestDto>(),

                Platforms = mission.Platforms.Select(MapToTreeDto).ToList()
            };
        }






        private ResponseAreaInterestDto AreaMapToDto(AreaInterest area)
        {
            return new ResponseAreaInterestDto
            {
                AreaInterestId = area.AreaInterestId,
                AreaName = area.AreaName,
                Area = area.Area,
                Perimeter = area.Perimeter,
                MissionId = area.MissionId,
                Description = area.Description,
                areaInterestCoordinateDtos = area.AreaInterestCoordinates
                    .Select(AreaInterestCoordinateMapToDto)
                    .ToList(),
                emitterModeLinkDtos = new List<RequestEmitterModeLinkDto>
                {
                    MapToTreeDto(area.EmitterModeLinks?.ToList() ?? new List<EmitterModeLink>())
                }
            };
        }

    
        public static AreaInterestCoordinateDto AreaInterestCoordinateMapToDto(AreaInterestCoordinate entity) =>


            new AreaInterestCoordinateDto { Id = entity.Id, Latitude = entity.Latitude, Longitude = entity.Longitude, Altitude = entity.Altitude };


        private PlatformTreeDto MapToTreeDto(Platform p)
        {
            return new PlatformTreeDto
            {
                PlatformId = p.PlatformId,
                PlatformName = p.PlatformName,
                ThreatType = p.ThreatType,
                Priority = p.Priority,
                DisplayStatus = p.DisplayStatus,
                SymbolCodeType = p.SymbolCodeType,
                AlternateSymbol = p.AlternateSymbol,
                ForeGroundColor = p.ForeGroundColor,
                BackGroundColor = p.BackGroundColor,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                UserId = p.UserId
                
            };
        }

        private RequestEmitterModeLinkDto MapToTreeDto(List<EmitterModeLink> emitterModeLinks)
        {
            if (emitterModeLinks == null || !emitterModeLinks.Any())
                return new RequestEmitterModeLinkDto();

            var areaInterestId = emitterModeLinks.First().AreaInterestId;

            var result = new RequestEmitterModeLinkDto
            {
                AreaInterestId = areaInterestId,
                Weapons = new List<WeaponLinkDto>(),
                Emitters = new List<EmitterLinkDto>()
            };

            // Group by Weapon or Standalone type
            foreach (var group in emitterModeLinks.GroupBy(e => e.weaponStandlone))
            {
                if (group.Key == WeaponStandlone.WEAPON)
                {
                    // Group by Weapon → Emitter → Mode → Jamming
                    foreach (var weaponGroup in group.GroupBy(e => new { e.WeaponId, e.WeaponName }))
                    {
                        var weaponDto = new WeaponLinkDto
                        {
                            WeaponId = weaponGroup.Key.WeaponId,
                            WeaponName = weaponGroup.Key.WeaponName,
                            EmitterLinkDtos = new List<EmitterLinkDto>()
                        };

                        foreach (var emitterGroup in weaponGroup.GroupBy(e => new { e.EmitterId, e.EmitterName }))
                        {
                            var emitterDto = new EmitterLinkDto
                            {
                                EmitterId = emitterGroup.Key.EmitterId,
                                EmitterName = emitterGroup.Key.EmitterName,
                                ModeLinkDtos = new List<ModeLinkDto>()
                            };

                            foreach (var modeGroup in emitterGroup.GroupBy(e => new { e.ModeId, e.ModeName }))
                            {
                                var modeDto = new ModeLinkDto
                                {
                                    ModeId = modeGroup.Key.ModeId,
                                    ModeName = modeGroup.Key.ModeName,
                                    jammingLinkDtos = modeGroup
                                        .Where(x => x.JammingId != 0)
                                        .Select(x => new JammingLinkDto
                                        {
                                            JammingId = x.JammingId,
                                            JammingName = x.JammingName
                                        })
                                        .ToList()
                                };

                                emitterDto.ModeLinkDtos.Add(modeDto);
                            }

                            weaponDto.EmitterLinkDtos.Add(emitterDto);
                        }

                        result.Weapons.Add(weaponDto);
                    }
                }
                else if (group.Key == WeaponStandlone.STANDLONE)
                {
                    // Standalone entries go directly into Emitters (no weapon)
                    foreach (var emitterGroup in group.GroupBy(e => new { e.EmitterId, e.EmitterName }))
                    {
                        var emitterDto = new EmitterLinkDto
                        {
                            EmitterId = emitterGroup.Key.EmitterId,
                            EmitterName = emitterGroup.Key.EmitterName,
                            ModeLinkDtos = new List<ModeLinkDto>()
                        };

                        foreach (var modeGroup in emitterGroup.GroupBy(e => new { e.ModeId, e.ModeName }))
                        {
                            var modeDto = new ModeLinkDto
                            {
                                ModeId = modeGroup.Key.ModeId,
                                ModeName = modeGroup.Key.ModeName,
                                jammingLinkDtos = modeGroup
                                    .Where(x => x.JammingId != 0)
                                    .Select(x => new JammingLinkDto
                                    {
                                        JammingId = x.JammingId,
                                        JammingName = x.JammingName
                                    })
                                    .ToList()
                            };

                            emitterDto.ModeLinkDtos.Add(modeDto);
                        }

                        result.Emitters.Add(emitterDto);
                    }
                }
            }

            return result;
        }


      
    }
}
