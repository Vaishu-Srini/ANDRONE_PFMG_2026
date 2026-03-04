using PFMG.Data;
using PFMG.DTOs;
using PFMG.Enums;
using PFMG.Models;
using PFMG.Models.StandaloneModels;
using PFMG.Repositories;
using PFMG.Utilities;
using Microsoft.EntityFrameworkCore;



namespace PFMG.Services.impl
{
    public class AreaInterestServiceImpl : IAreaInterestService
    {
        private readonly IAreaInterestRepository _repository;

        private readonly WeaponRepository _weaponRepository;

        private readonly IAreaInterestCoordinateRepository _areaInterestCoordinateRepository;

        private readonly IEmitterLibraryRepository _emitterLibraryRepository;

        private readonly MissionRepository _missionRepository;
        public AreaInterestServiceImpl(IAreaInterestRepository repository, MissionRepository missionRepository, IEmitterLibraryRepository emitterLibraryRepository,  IAreaInterestCoordinateRepository areaInterestCoordinateRepository, WeaponRepository weaponRepository)
        {
            _repository = repository;
            _areaInterestCoordinateRepository = areaInterestCoordinateRepository;
            _weaponRepository = weaponRepository;
            _missionRepository = missionRepository;
            _emitterLibraryRepository = emitterLibraryRepository;
        }

        public async Task<(bool Success, string Message, AreaInterestDto? Data)> SaveAreaInterestAsync(AreaInterestDto dto)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(dto.AreaName))
                    return (false, "Area name cannot be null or empty", null);

                var existing_mission = await _missionRepository.GetMissionByIdAsync(dto.MissionId);
                if (existing_mission == null)
                    return (false, "Mission not found", null);


                if (dto?.areaInterestCoordinateDtos == null || dto.areaInterestCoordinateDtos.Count < 3)
                    return (false, "Invalid area polygon.", null);



                var existingByName = await _repository.GetByNameAsync(dto.AreaName);

                if (dto.AreaInterestId == 0) // Create
                {
                    if (existingByName != null)
                        return (false, "Area name already exists", null);

                    var areaInterest = new AreaInterest
                    {
                        AreaName = dto.AreaName,
                        Area = dto.Area,
                        Perimeter = dto.Perimeter,
                        Description = dto.Description,
                        MissionId = dto.MissionId

                    };
                    // Console.WriteLine("Mission saved successfully!");

                    var saved = await _repository.AddAsync(areaInterest);

                    if (dto.areaInterestCoordinateDtos != null)
                    {
                        var areaInterestCoordinateDetails = dto.areaInterestCoordinateDtos.Select(f =>
                        {
                            var areaInterestCoordinate = new AreaInterestCoordinate
                            {
                                Latitude = f.Latitude,
                                Longitude = f.Longitude,
                                Altitude = f.Altitude,
                                AreaInterestId = areaInterest.AreaInterestId

                            };
                            areaInterestCoordinate.AreaInterestId = areaInterest.AreaInterestId;
                            return areaInterestCoordinate;
                        }).ToList();

                        await _areaInterestCoordinateRepository.AddRangeAsync(areaInterestCoordinateDetails);

                    }


                    return (true, "AreaInterest created successfully", AreaMapToDto(saved));
                }
                else // Update
                    {
                        var existing = await _repository.GetByIdAsync(dto.AreaInterestId);
                        if (existing == null)
                            return (false, "Area not found", null);

                        if (existingByName != null && existingByName.AreaInterestId != dto.AreaInterestId)
                            return (false, "Area name already exists", null);

                        // ✅ Update AreaInterest main details
                        existing.AreaName = dto.AreaName;
                        existing.Area = dto.Area;
                        existing.Perimeter = dto.Perimeter;
                        existing.Description = dto.Description;

                        await _repository.UpdateAsync(existing);

                        // ✅ Update coordinates
                        if (dto.areaInterestCoordinateDtos != null && dto.areaInterestCoordinateDtos.Count >= 3)
                        {
                            // 1. Delete old coordinates
                            var existingCoords = await _areaInterestCoordinateRepository.GetByAreaInterestIdAsync(existing.AreaInterestId);
                            if (existingCoords != null && existingCoords.Any())
                                await _areaInterestCoordinateRepository.DeleteRangeAsync(existingCoords);

                            // 2. Add new coordinates
                            var newCoords = dto.areaInterestCoordinateDtos.Select(coord => new AreaInterestCoordinate
                            {
                                Latitude = coord.Latitude,
                                Longitude = coord.Longitude,
                                Altitude = coord.Altitude,
                                AreaInterestId = existing.AreaInterestId
                            }).ToList();

                            await _areaInterestCoordinateRepository.AddRangeAsync(newCoords);
                        }

                        return (true, "Area updated successfully", AreaMapToDto(existing));
                    }

            }

            catch (Exception ex)
            {
                // 🔹 Replace with ILogger for real logging
                Console.WriteLine($"[SaveAreaInterestAsync] Error: {ex.Message}");
                return (false, "An unexpected error occurred while saving the Area", null);
            }
        }

        public async Task<IEnumerable<AreaInterestDto>> GetAllAreaInterestAsync()
        {
            try
            {
                var areaInterests = _repository.Query().Include(a => a.AreaInterestCoordinates).ToList();
                return areaInterests.Select(AreaMapToDto).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllAreaAsync: {ex.Message}");
                return new List<AreaInterestDto>(); // return empty list on error
            }
        }

        public async Task<AreaInterestDto?> GetByAreaIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : AreaMapToDto(entity);
        }



        public AreaInterestDto AreaMapToDto(AreaInterest area)
        {
            return new AreaInterestDto
            {
                AreaInterestId = area.AreaInterestId,
                AreaName = area.AreaName,
                Area = area.Area,
                Perimeter = area.Perimeter,
                Description = area.Description,
                MissionId = area.MissionId,
                areaInterestCoordinateDtos = area.AreaInterestCoordinates.Select(AreaInterestCoordinateMapToDto).ToList()


            };
        }




        public static AreaInterestCoordinateDto AreaInterestCoordinateMapToDto(AreaInterestCoordinate entity) =>


            new AreaInterestCoordinateDto { Id = entity.Id, Latitude = entity.Latitude, Longitude = entity.Longitude, Altitude = entity.Altitude };

        public async Task<(bool Success, string Message)> DeleteAreaInterestAsync(int id)
        {
            var mode = await _repository.GetByIdAsync(id);
            if (mode == null)
                return (false, "Area not found");

            await _repository.DeleteAsync(mode);
            return (true, "Area deleted successfully");
        }



        // public async Task<List<ResponseEmitterModeLinkDto>> GetEmitterInAreaAsync(int missionId)
        // {
        //     var area = await _repository.GeAreaInterestByMissionIdAsync(missionId);
        //     if (area?.AreaInterestCoordinates == null || area.AreaInterestCoordinates.Count < 3)
        //         throw new ArgumentException("Invalid area polygon.");

        //     // 🟢 Weapons with emitters, modes, and jammings
        //     var allWeapons = await _weaponRepository.Query()
        //         .Include(w => w.Emitters)
        //             .ThenInclude(e => e.Modes)
        //                 .ThenInclude(m => m.Jammings)
        //         .ToListAsync();

        //     // 🟢 Standalone emitters (no weapon)
        //     var standaloneEmitters = await _emitterLibraryRepository.Query().Include(e => e.StandaloneModes).ThenInclude(m => m.Jammings).ToListAsync();

        //     var response = new ResponseEmitterModeLinkDto
        //     {
        //         Weapons = new List<WeaponLinkDto>(),
        //         Emitters = new List<EmitterLinkDto>(),

        //     };

        //     // =====================================================
        //     // 🔹 WEAPON FLOW
        //     // =====================================================
        //     foreach (var weapon in allWeapons)
        //     {
        //         var emittersInArea = weapon.Emitters?
        //             .Where(e =>
        //             {
        //                 if (!double.TryParse(e.Latitude, out var elat)) return false;
        //                 if (!double.TryParse(e.Longitude, out var elng)) return false;
        //                 return GeoHelper.IsPointInPolygon(elat, elng, area.AreaInterestCoordinates);
        //             })
        //             .ToList();
        //         if (emittersInArea == null || emittersInArea.Count == 0)

        //             continue;
        //         var weaponDto = new WeaponLinkDto
        //         {
        //             WeaponId = weapon.WeaponId,
        //             WeaponName = weapon.WeaponName,
        //             EmitterLinkDtos = new List<EmitterLinkDto>()
        //         };

        //         foreach (var emitter in emittersInArea)
        //         {
        //             var emitterDto = new EmitterLinkDto
        //             {
        //                 EmitterId = emitter.EmitterId,
        //                 EmitterName = emitter.EmitterName,
        //                 Latitude = emitter.Latitude,
        //                 Longitude = emitter.Longitude,
        //                 ModeLinkDtos = new List<ModeLinkDto>()
        //             };

        //             foreach (var mode in emitter.Modes ?? Enumerable.Empty<Mode>())
        //             {
        //                 var modeDto = new ModeLinkDto
        //                 {
        //                     ModeId = mode.ModeId,
        //                     ModeName = mode.ModeName,
        //                     jammingLinkDtos = mode.Jammings?
        //                         .Select(j => new JammingLinkDto
        //                         {
        //                             JammingId = j.JammingId,
        //                             JammingName = j.TechniqueName
        //                         })
        //                         .ToList() ?? new List<JammingLinkDto>()
        //                 };

        //                 emitterDto.ModeLinkDtos.Add(modeDto);
        //             }

        //             weaponDto.EmitterLinkDtos.Add(emitterDto);
        //         }

        //         response.Weapons.Add(weaponDto);
        //     }

        //     // =====================================================
        //     // 🔹 STANDALONE EMITTER FLOW
        //     // =====================================================
        //     var emittersInAreaStandalone = standaloneEmitters
        //         .Where(e =>
        //         {
        //             if (!double.TryParse(e.Latitude, out var elat)) return false;
        //             if (!double.TryParse(e.Longitude, out var elng)) return false;
        //             return GeoHelper.IsPointInPolygon(elat, elng, area.AreaInterestCoordinates);
        //         })
        //         .ToList();

        //     foreach (var emitter in emittersInAreaStandalone)
        //     {
        //         var emitterDto = new EmitterLinkDto
        //         {
        //             EmitterId = emitter.EmitterId,
        //             EmitterName = emitter.EmitterName,
        //             Latitude = emitter.Latitude,
        //             Longitude = emitter.Longitude,
        //             ModeLinkDtos = new List<ModeLinkDto>()
        //         };

        //         foreach (var mode in emitter.StandaloneModes ?? Enumerable.Empty<StandaloneMode>())
        //         {
        //             var modeDto = new ModeLinkDto
        //             {
        //                 ModeId = mode.StandaloneModeId,
        //                 ModeName = mode.ModeName,
        //                 jammingLinkDtos = mode.Jammings?
        //                     .Select(j => new JammingLinkDto
        //                     {
        //                         JammingId = j.JammingId,
        //                         JammingName = j.TechniqueName
        //                     })
        //                     .ToList() ?? new List<JammingLinkDto>()
        //             };

        //             emitterDto.ModeLinkDtos.Add(modeDto);
        //         }

        //         response.Emitters.Add(emitterDto);
        //     }

        //     // 🟢 Return single list containing one object
        //     return new List<ResponseEmitterModeLinkDto> { response };
        // }

        // mulitple AOI on mission 

        public async Task<List<ResponseEmitterModeLinkDto>> GetEmitterInAreaAsync(int missionId)
        {
            // ✅ Get ALL area interests for this mission
            var areas = await _repository.GetAreaInterestsByMissionIdAsync(missionId);

            if (areas == null || areas.Count == 0)
                return new List<ResponseEmitterModeLinkDto>();

            // ✅ Load Weapons and Standalone Emitters once (not per area)
            var allWeapons = await _weaponRepository.Query()
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.Jammings)
                .ToListAsync();

            var standaloneEmitters = await _emitterLibraryRepository.Query()
                .Include(e => e.StandaloneModes)
                    .ThenInclude(m => m.Jammings)
                .ToListAsync();

            var responses = new List<ResponseEmitterModeLinkDto>();

            // ✅ Loop through ALL Area Interests
            foreach (var area in areas)
            {
                if (area.AreaInterestCoordinates == null || area.AreaInterestCoordinates.Count < 3)
                    continue; // invalid polygon

                var response = new ResponseEmitterModeLinkDto
                {
                    AreaInterestId = area.AreaInterestId,
                    Weapons = new List<WeaponLinkDto>(),
                    Emitters = new List<EmitterLinkDto>()
                };

                // ==================================================
                // 🔹 WEAPON FLOW
                // ==================================================
                foreach (var weapon in allWeapons)
                {
                    var emittersInside = weapon.Emitters?
                        .Where(e =>
                            double.TryParse(e.Latitude, out var lat) &&
                            double.TryParse(e.Longitude, out var lng) &&
                            GeoHelper.IsPointInPolygon(lat, lng, area.AreaInterestCoordinates))
                        .ToList();

                    if (emittersInside == null || emittersInside.Count == 0)
                        continue;

                    var weaponDto = new WeaponLinkDto
                    {
                        WeaponId = weapon.WeaponId,
                        WeaponName = weapon.WeaponName,
                        EmitterLinkDtos = new List<EmitterLinkDto>()
                    };

                    foreach (var emitter in emittersInside)
                    {
                        var emitterDto = new EmitterLinkDto
                        {
                            EmitterId = emitter.EmitterId,
                            EmitterName = emitter.EmitterName,
                            Latitude = emitter.Latitude,
                            Longitude = emitter.Longitude,
                            ModeLinkDtos = emitter.Modes?
                                .Select(m => new ModeLinkDto
                                {
                                    ModeId = m.ModeId,
                                    ModeName = m.ModeName,
                                    jammingLinkDtos = m.Jammings?
                                        .Select(j => new JammingLinkDto
                                        {
                                            JammingId = j.JammingId,
                                            JammingName = j.JammingName
                                        }).ToList() ?? new List<JammingLinkDto>()
                                }).ToList() ?? new List<ModeLinkDto>()
                        };

                        weaponDto.EmitterLinkDtos.Add(emitterDto);
                    }

                    response.Weapons.Add(weaponDto);
                }

                // ==================================================
                // 🔹 STANDALONE EMITTER FLOW
                // ==================================================
                var standaloneInside = standaloneEmitters
                    .Where(e =>
                        double.TryParse(e.Latitude, out var lat) &&
                        double.TryParse(e.Longitude, out var lng) &&
                        GeoHelper.IsPointInPolygon(lat, lng, area.AreaInterestCoordinates))
                    .ToList();

                foreach (var emitter in standaloneInside)
                {
                    var emitterDto = new EmitterLinkDto
                    {
                        EmitterId = emitter.EmitterId,
                        EmitterName = emitter.EmitterName,
                        Latitude = emitter.Latitude,
                        Longitude = emitter.Longitude,
                        ModeLinkDtos = emitter.StandaloneModes?
                            .Select(m => new ModeLinkDto
                            {
                                ModeId = m.StandaloneModeId,
                                ModeName = m.ModeName,
                                jammingLinkDtos = m.Jammings?
                                    .Select(j => new JammingLinkDto
                                    {
                                        JammingId = j.JammingId,
                                        JammingName = j.JammingName
                                    }).ToList() ?? new List<JammingLinkDto>()
                            }).ToList() ?? new List<ModeLinkDto>()
                    };

                    response.Emitters.Add(emitterDto);
                }

                responses.Add(response);
            }

            return responses;
        }


    }

}