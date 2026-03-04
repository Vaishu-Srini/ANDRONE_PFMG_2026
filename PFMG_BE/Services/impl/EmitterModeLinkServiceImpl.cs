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
using PFMG.Data;
using Microsoft.EntityFrameworkCore;

namespace PFMG.Services.impl
{
    public class EmitterModeLinkServiceImpl : IEmitterModeLinkService
    {
      
        private readonly DbContextOptions<AppDbContext> _contextOptions;

    

        private readonly AppDbContext _context;



        public EmitterModeLinkServiceImpl(DbContextOptions<AppDbContext> contextOptions,
         AppDbContext appDbContext)
        {
           
            _context = appDbContext;
            _contextOptions = contextOptions;



        }




        // public async Task<(bool Success, string Message, RequestEmitterModeLinkDto? Data)> SaveEmitterModeLinkAsync(RequestEmitterModeLinkDto dto)
        // {
        //     if (dto == null)
        //         return (false, "Invalid request.", null);

        //     await _repository.DeleteEmitterModeLinksByAreaInterestIdAsync(dto.AreaInterestId);

        //     try
        //     {
        //         // --- VALIDATION HELPERS ---
        //         async Task<bool> WeaponExists(int id, string name) => await _weaponRepository.ExistsAsync(id, name);
        //         async Task<bool> EmitterExists(int id, string name) => await _emitterRepository.ExistsAsync(id, name);
        //         async Task<bool> ModeExists(int id, string name) => await _modeRepository.ExistsAsync(id, name);
        //         async Task<bool> JammingExists(int id,  string name) => await _jammingRepository.ExistsAsync(id, name);
        //         async Task<bool> StandaloneEmitterExists(int id, string name) => await _emitterLibraryRepository.StandaloneExistsAsync(id, name);
        //         async Task<bool> StandaloneModeExists(int id, string name) => await _standaloneModeRepository.ExistsAsync(id, name);
        //         async Task<bool> StandaloneJammingExists(int id, string name) => await _standalonejammingRepository.ExistsAsync(id, name);

        //         // --- CASE 1: WEAPON FLOW ---
        //         if (dto.Weapons?.Count > 0)
        //         {
        //             foreach (var weapon in dto.Weapons)
        //             {
        //                 if (!await WeaponExists(weapon.WeaponId, weapon.WeaponName))
        //                     return (false, "Weapon not found", null);

        //                 foreach (var emitter in weapon.EmitterLinkDtos ?? Enumerable.Empty<EmitterLinkDto>())
        //                 {
        //                     if (!await EmitterExists(emitter.EmitterId, emitter.EmitterName))
        //                         return (false, "Emitter not found", null);

        //                     foreach (var mode in emitter.ModeLinkDtos ?? Enumerable.Empty<ModeLinkDto>())
        //                     {
        //                         if (!await ModeExists(mode.ModeId, mode.ModeName))
        //                             return (false, "Mode not found", null);

        //                         if (mode.jammingLinkDtos == null || mode.jammingLinkDtos.Count == 0)
        //                         {
        //                             await SaveLinkAsync(weapon, emitter, mode, null, dto.AreaInterestId, Enums.WeaponStandlone.WEAPON);
        //                         }
        //                         else
        //                         {
        //                             foreach (var jamming in mode.jammingLinkDtos)
        //                             {
        //                                 if (!await JammingExists(jamming.JammingId, jamming.JammingName))
        //                                     return (false, "Jamming not found", null);

        //                                 await SaveLinkAsync(weapon, emitter, mode, jamming, dto.AreaInterestId, Enums.WeaponStandlone.WEAPON);
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }

        //         // --- CASE 2: STANDALONE EMITTER FLOW ---
        //         if (dto.Emitters?.Count > 0)
        //         {
        //             foreach (var emitter in dto.Emitters)
        //             {
        //                 if (!await StandaloneEmitterExists(emitter.EmitterId, emitter.EmitterName))
        //                     return (false, "Emitter not found", null);

        //                 foreach (var mode in emitter.ModeLinkDtos ?? Enumerable.Empty<ModeLinkDto>())
        //                 {
        //                     if (!await StandaloneModeExists(mode.ModeId, mode.ModeName))
        //                         return (false, "Mode not found", null);

        //                     if (mode.jammingLinkDtos == null || mode.jammingLinkDtos.Count == 0)
        //                     {
        //                         await SaveLinkAsync(null, emitter, mode, null, dto.AreaInterestId, Enums.WeaponStandlone.STANDLONE);
        //                     }
        //                     else
        //                     {
        //                         foreach (var jamming in mode.jammingLinkDtos)
        //                         {
        //                             if (!await StandaloneJammingExists(jamming.JammingId, jamming.JammingName))
        //                                 return (false, "Jamming not found", null);

        //                             await SaveLinkAsync(null, emitter, mode, jamming, dto.AreaInterestId, Enums.WeaponStandlone.STANDLONE);
        //                         }
        //                     }
        //                 }
        //             }
        //         }

        //         return (true, "Emitter Mode Links saved successfully.", dto);
        //     }
        //     catch (Exception ex)
        //     {
        //         return (false, $"Error occurred while saving data: {ex.Message}", null);
        //     }
        // }




        public async Task<(bool Success, string Message, RequestEmitterModeLinkDto? Data)> SaveEmitterModeLinkAsync(RequestEmitterModeLinkDto dto)
        {
            if (dto == null)
                return (false, "Invalid request.", null);

            var strategy = _context.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(
                async () =>
                {
                    await using var newContext = new AppDbContext(_contextOptions);
                    await using var transaction = await newContext.Database.BeginTransactionAsync();

                    try
                    {
                        // ✅ Create repositories with retry-safe context
                        var repo = new EmitterModeLinkRepository(newContext);
                        var weaponRepo = new WeaponRepository(newContext);
                        var emitterRepo = new EmitterRepository(newContext);
                        var modeRepo = new ModeRepository(newContext);
                        var jammingRepo = new JammingRepository(newContext);
                        var standaloneEmitterRepo = new EmitterLibraryRepository(newContext);
                        var standaloneModeRepo = new StandaloneModeRepository(newContext);
                        var standaloneJammingRepo = new StandaloneJammingRepository(newContext);

                        // ✅ Validate
                        var validation = await ValidateEmitterModeLinksAsync(dto,
                            weaponRepo, emitterRepo, modeRepo, jammingRepo,
                            standaloneEmitterRepo, standaloneModeRepo, standaloneJammingRepo);

                        if (!validation.Success)
                        {
                            await transaction.RollbackAsync();
                            return validation;
                        }

                        // ✅ Delete old data
                        await repo.DeleteEmitterModeLinksByAreaInterestIdAsync(dto.AreaInterestId);

                        // ✅ Insert fresh data
                        await InsertEmitterModeLinksAsync(dto, repo);

                        await transaction.CommitAsync();
                        return (true, "Emitter Mode Links saved successfully.", dto);
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        return (false, $"Error: {ex.Message}", null);
                    }
                }
            );
        }

        private async Task<(bool Success, string Message, RequestEmitterModeLinkDto? Data)> ValidateEmitterModeLinksAsync(
            RequestEmitterModeLinkDto dto,
            WeaponRepository weaponRepo,
            EmitterRepository emitterRepo,
            ModeRepository modeRepo,
            JammingRepository jammingRepo,
            EmitterLibraryRepository standaloneEmitterRepo,
            StandaloneModeRepository standaloneModeRepo,
            StandaloneJammingRepository standaloneJammingRepo)
        {
            // ✅ Weapon validation
            if (dto.Weapons?.Count > 0)
            {
                foreach (var weapon in dto.Weapons)
                {
                    if (!await weaponRepo.ExistsAsync(weapon.WeaponId, weapon.WeaponName))
                        return (false, "Weapon not found.", null);

                    foreach (var emitter in weapon.EmitterLinkDtos ?? [])
                    {
                        if (!await emitterRepo.ExistsAsync(emitter.EmitterId, emitter.EmitterName))
                            return (false, "Emitter not found.", null);

                        foreach (var mode in emitter.ModeLinkDtos ?? [])
                        {
                            if (!await modeRepo.ExistsAsync(mode.ModeId, mode.ModeName))
                                return (false, "Mode not found.", null);

                            foreach (var jam in mode.jammingLinkDtos ?? [])
                            {
                                if (!await jammingRepo.ExistsAsync(jam.JammingId, jam.JammingName))
                                    return (false, "Jamming not found.", null);
                            }
                        }
                    }
                }
            }

            // ✅ Standalone validation
            if (dto.Emitters?.Count > 0)
            {
                foreach (var emitter in dto.Emitters)
                {
                    if (!await standaloneEmitterRepo.StandaloneExistsAsync(emitter.EmitterId, emitter.EmitterName))
                        return (false, "Standalone Emitter not found.", null);

                    foreach (var mode in emitter.ModeLinkDtos ?? [])
                    {
                        if (!await standaloneModeRepo.ExistsAsync(mode.ModeId, mode.ModeName))
                            return (false, "Standalone Mode not found.", null);

                        foreach (var jam in mode.jammingLinkDtos ?? [])
                        {
                            if (!await standaloneJammingRepo.ExistsAsync(jam.JammingId, jam.JammingName))
                                return (false, "Standalone Jamming not found.", null);
                        }
                    }
                }
            }

            return (true, "Valid", dto);
        }

        private async Task InsertEmitterModeLinksAsync(
            RequestEmitterModeLinkDto dto,
            EmitterModeLinkRepository repo)
        {
            // ✅ Weapon Flow
            if (dto.Weapons?.Count > 0)
            {
                foreach (var weapon in dto.Weapons)
                {
                    foreach (var emitter in weapon.EmitterLinkDtos ?? [])
                    {
                        foreach (var mode in emitter.ModeLinkDtos ?? [])
                        {
                            if (mode.jammingLinkDtos?.Count > 0)
                            {
                                foreach (var jam in mode.jammingLinkDtos)
                                    await SaveLinkAsync(repo, weapon, emitter, mode, jam, dto.AreaInterestId, Enums.WeaponStandlone.WEAPON);
                            }
                            else
                            {
                                await SaveLinkAsync(repo, weapon, emitter, mode, null, dto.AreaInterestId, Enums.WeaponStandlone.WEAPON);
                            }
                        }
                    }
                }
            }

            // ✅ Standalone Flow
            if (dto.Emitters?.Count > 0)
            {
                foreach (var emitter in dto.Emitters)
                {
                    foreach (var mode in emitter.ModeLinkDtos ?? [])
                    {
                        if (mode.jammingLinkDtos?.Count > 0)
                        {
                            foreach (var jam in mode.jammingLinkDtos)
                                await SaveLinkAsync(repo, null, emitter, mode, jam, dto.AreaInterestId, Enums.WeaponStandlone.STANDLONE);
                        }
                        else
                        {
                            await SaveLinkAsync(repo, null, emitter, mode, null, dto.AreaInterestId, Enums.WeaponStandlone.STANDLONE);
                        }
                    }
                }
            }
        }

        private async Task SaveLinkAsync(
            EmitterModeLinkRepository repo,
            WeaponLinkDto? weapon,
            EmitterLinkDto emitter,
            ModeLinkDto mode,
            JammingLinkDto? jamming,
            int areaInterestId,
            Enums.WeaponStandlone type)
        {
            var link = new EmitterModeLink
            {
                WeaponId = weapon?.WeaponId ?? 0,
                WeaponName = weapon?.WeaponName ?? "",
                EmitterId = emitter.EmitterId,
                EmitterName = emitter.EmitterName,
                ModeId = mode.ModeId,
                ModeName = mode.ModeName,
                JammingId = jamming?.JammingId ?? 0,
                JammingName = jamming?.JammingName ?? "",
                weaponStandlone = type,
                AreaInterestId = areaInterestId
            };

            await repo.AddEmitterModeLinkAsync(link);
        }





    }
}

