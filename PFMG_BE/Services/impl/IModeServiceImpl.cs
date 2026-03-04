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
    public class ModeServiceImpl : IModeService
    {
        private readonly IEmitterRepository _emitterRepository;
        private readonly IModeRepository _repository;
        //private readonly IModeDfRepository _modeDfRepository;
        private readonly IModeFrequencyDetailRepository _modeFrequencyDetailRepository;
        //private readonly IModeFrequencyRangeRepository _modeFrequencyRangeRepository;
        //private readonly IModeLssDetailRepository _modeLssDetailRepository;
        private readonly IModePriDetailRepository _modePriDetailRepository;
        //private readonly IModePriRangeRepository _modePriRangeRepository;
        //private readonly IModePriPwRangeRepository _modePriPwRangeRepository;
        //private readonly IModePriStaggerLevelRepository _modePriStaggerLevelRepository;
        private readonly IModePwDetailRepository _modePwDetailRepository;
        private readonly IModeScanDetailRepository _modeScanDetailRepository;

        //mode library
        private readonly IStandaloneModeRepository _StandaloneModeRepository;
        private readonly IModeFrequencyDetailLibraryRepository _modeFrequencyDetailLibraryRepository;

        private readonly IModePriDetailLibraryRepository _modePriDetailLibraryRepository;

        private readonly IModePwDetailLibraryRepository _modePwDetailLibraryRepository;
        private readonly IModeScanDetailLibraryRepository _modeScanDetailLibraryRepository;

        private readonly IIndependentModeRepository _IndependentModeRepository;
        private readonly IIndependentModeFrequencyRepository _modeFrequencyIndependentRepository;

        private readonly IIndependentModePriRepository _modePriIndependentRepository;

        private readonly IIndependentModePwRepository _modePwIndependentRepository;
        private readonly IIndependentModeScanRepository _modeScanIndependentRepository;




        // ✅ Inject everything in ONE constructor
        public ModeServiceImpl(
            IModeRepository repository,
            IModeFrequencyDetailRepository modeFrequencyDetailRepository,

            IModePriDetailRepository modePriDetailRepository,

            IModePwDetailRepository modePwDetailRepository,
            IModeScanDetailRepository modeScanDetailRepository,
            IEmitterRepository emitterRepository,
            IStandaloneModeRepository StandaloneModeRepository,

            IModeFrequencyDetailLibraryRepository modeFrequencyDetailLibraryRepository,
            IModePriDetailLibraryRepository modePriDetailLibraryRepository,
            IModePwDetailLibraryRepository modePwDetailLibraryRepository,
            IModeScanDetailLibraryRepository modeScanDetailLibraryRepository,


            IIndependentModeRepository independentModeRepository,


            IIndependentModeFrequencyRepository independentModeFrequencyRepository,

            IIndependentModePriRepository independentModePriRepository,

            IIndependentModePwRepository independentModePwRepository,

            IIndependentModeScanRepository independentModeScanRepository

        )
        {
            _repository = repository;
            _modeFrequencyDetailRepository = modeFrequencyDetailRepository;

            _modePriDetailRepository = modePriDetailRepository;

            _modePwDetailRepository = modePwDetailRepository;
            _modeScanDetailRepository = modeScanDetailRepository;
            _emitterRepository = emitterRepository;


            _StandaloneModeRepository = StandaloneModeRepository;
            _modeFrequencyDetailLibraryRepository = modeFrequencyDetailLibraryRepository;

            _modePriDetailLibraryRepository = modePriDetailLibraryRepository;

            _modePwDetailLibraryRepository = modePwDetailLibraryRepository;
            _modeScanDetailLibraryRepository = modeScanDetailLibraryRepository;

            _IndependentModeRepository = independentModeRepository;

            _modeFrequencyIndependentRepository = independentModeFrequencyRepository;

            _modePriIndependentRepository = independentModePriRepository;

            _modePwIndependentRepository = independentModePwRepository;

            _modeScanIndependentRepository = independentModeScanRepository;


        }


        // ✅ Create or Update Mode + Child tables
        public async Task<(bool Success, string Message, ModeDto? Data)> SaveModeAsync(ModeDto dto)
        {
            //var vr = ModeValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            if (dto.EmitterId == null || dto.EmitterId == 0)
            {
                return (false, "Please provide a valid emitter id.", null);
            }

            try
            {

                if (string.IsNullOrWhiteSpace(dto.ModeName))
                    return (false, "Mode name cannot be null or empty", null);
                var existing_emitter = await _emitterRepository.GetByIdAsync(dto.EmitterId);
                if (existing_emitter == null)
                    return (false, "Emitter not found", null);


                // Check unique ModeName
                var existingByName = await _repository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);

                var existingByStandaloneMode = await _StandaloneModeRepository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);

                var existingByIndependentMode = await _IndependentModeRepository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);


                if (dto.ModeId == 0) // Create
                {
                    if (existingByName != null || existingByStandaloneMode != null ||  existingByIndependentMode != null)
                        return (false, "Mode name already exists", null);

                    var mode = MapToEntity(dto);
                    mode.CreatedDate = DateTime.UtcNow;
                    mode.ModifiedDate = DateTime.UtcNow;

                    var savedMode = await _repository.AddAsync(mode);
                   

                    if (dto.ModeFrequencyDetails != null)
                    {
                        var modeFrequencyDetails = dto.ModeFrequencyDetails.Select(f =>
                        {
                            var entity = MapToEntity(f);
                            entity.ModeId = savedMode.ModeId;
                            return entity;
                        }).ToList();

                        await _modeFrequencyDetailRepository.AddRangeAsync(modeFrequencyDetails);

                    }



                    if (dto.ModeScanDetails != null)
                    {
                        var scanDetails = dto.ModeScanDetails.Select(s =>
                        {
                            var entity = MapToEntity(s);
                            entity.ModeId = savedMode.ModeId;
                            return entity;
                        }).ToList();

                        await _modeScanDetailRepository.AddRangeAsync(scanDetails);
                    }

                    if (dto.ModePriDetails != null)
                    {
                        var priDetails = dto.ModePriDetails.Select(p =>
                        {
                            var entity = MapToEntity(p);
                            entity.ModeId = savedMode.ModeId;
                            return entity;
                        }).ToList();

                        await _modePriDetailRepository.AddRangeAsync(priDetails);
                    }

                    if (dto.ModePwDetails != null)
                    {
                        var pwDetails = dto.ModePwDetails.Select(pw =>
                        {
                            var entity = MapToEntity(pw);
                            entity.ModeId = savedMode.ModeId;
                            return entity;
                        }).ToList();

                        await _modePwDetailRepository.AddRangeAsync(pwDetails);
                    }




                    return (true, "Mode created successfully", MapToDto(savedMode));
                }
                else // Update
                {
                    var existing = await _repository.GetByIdAsync(dto.ModeId);
                    if (existing == null)
                        return (false, "Mode not found", null);

                    if (existingByName != null && existingByName.ModeId != dto.ModeId || existingByStandaloneMode != null ||  existingByIndependentMode != null)
                        return (false, "Mode name already exists", null);

                    // Update properties
                    existing.ModeName = dto.ModeName;
                    existing.Description = dto.Description;
                    existing.ModeType = dto.ModeType;
                    existing.PlatformType = dto.PlatformType;
                    existing.SubMode = dto.SubMode;
                    existing.ThreatType = dto.ThreatType;
                    existing.TestType = dto.TestType;
                    
                    //existing.PriStaggerLevel = dto.PriStaggerLevel;
                    
                    existing.SymbolCodeType = dto.SymbolCodeType;
                    existing.ModeSymbol = dto.ModeSymbol;
                    existing.BgColor = dto.BgColor;
                    existing.FgColor = dto.FgColor;
                    existing.RangeEstimation = dto.RangeEstimation;
                    existing.EirpValue = dto.EirpValue;
                    existing.LethalRange = dto.LethalRange;
                    existing.GroundOnly = dto.GroundOnly;
                    
                    existing.EmitterId = dto.EmitterId;
                    existing.ModifiedDate = DateTime.UtcNow;

                    existing.FrequencyType = dto.FrequencyType;
                    existing.FrequencyClass = dto.FrequencyClass;
                    existing.PriType = dto.PriType;
                    existing.PriClass = dto.PriClass;
                    existing.PwType = dto.PwType;
                    existing.PwClass = dto.PwClass;
                        
                   

                    existing.ModeFrequencyDetails.Clear();
                    if (dto.ModeFrequencyDetails != null)
                        existing.ModeFrequencyDetails = dto.ModeFrequencyDetails.Select(f =>
                        {
                            var entity = MapToEntity(f);
                            entity.ModeId = existing.ModeId;
                            return entity;
                        }).ToList();

                    existing.ModePriDetails.Clear();
                    if (dto.ModePriDetails != null)
                        existing.ModePriDetails = dto.ModePriDetails.Select(p =>
                        {
                            var entity = MapToEntity(p);
                            entity.ModeId = existing.ModeId;
                            return entity;
                        }).ToList();

                    existing.ModeScanDetails.Clear();
                    if (dto.ModeScanDetails != null)
                        existing.ModeScanDetails = dto.ModeScanDetails.Select(s =>
                        {
                            var entity = MapToEntity(s);
                            entity.ModeId = existing.ModeId;
                            return entity;
                        }).ToList();

                    
                    existing.ModePwDetails.Clear();
                    if (dto.ModePwDetails != null)
                        existing.ModePwDetails = dto.ModePwDetails.Select(pw =>
                        {
                            var entity = MapToEntity(pw);
                            entity.ModeId = existing.ModeId;
                            return entity;
                        }).ToList();

                    await _repository.UpdateAsync(existing);

                    return (true, "Mode updated successfully", MapToDto(existing));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error: {ex.Message}", null);
            }
        }

        // ✅ Get all
        public async Task<IEnumerable<ModeDto>> GetAllModesAsync()
        {
            var modes = await _repository.Query().OrderByDescending(m => m.ModifiedDate)
                .Include(m => m.ModeFrequencyDetails)
                .Include(m => m.ModePriDetails)
                .Include(m => m.ModeScanDetails)
               
                .Include(m => m.ModePwDetails)
                .ToListAsync();

            return modes.Select(MapToDto).ToList();
        }

        // ✅ Delete by Id
        public async Task<(bool Success, string Message)> DeleteModeAsync(int id)
        {
            var mode = await _repository.GetByIdAsync(id);
            if (mode == null)
                return (false, "Mode not found");

            await _repository.DeleteAsync(mode);
            return (true, "Mode deleted successfully");
        }

        public async Task<(bool Success, string Message, ModeDto? Data)> SaveStandaloneModeAsync(ModeDto dto)
        {
            //var vr = ModeValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            if (dto.EmitterId == null || dto.EmitterId == 0)
            {
                return (false, "Please provide a valid emitter id.", null);
            }

            try
            {

                if (string.IsNullOrWhiteSpace(dto.ModeName))
                    return (false, "Mode name cannot be null or empty", null);
                // var existing_emitter = await _emitterRepository.GetByIdAsync(dto.EmitterId);
                // if (existing_emitter == null)
                //     return (false, "Emitter not found", null);


                // Check unique ModeName
                var existingByName = await _StandaloneModeRepository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);

                var existingByMode = await _repository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);

                var existingByIndependentMode = await _IndependentModeRepository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);

                if (dto.ModeId == 0) // Create
                {
                    if (existingByName != null || existingByMode != null  || existingByIndependentMode != null)
                        return (false, "Mode name already exists", null);

                    var mode = StandaloneModeMapToEntity(dto);
                    mode.CreatedDate = DateTime.UtcNow;
                    mode.ModifiedDate = DateTime.UtcNow;

                    var savedMode = await _StandaloneModeRepository.AddAsync(mode);
                    

                    if (dto.ModeFrequencyDetails != null)
                    {
                        var modeFrequencyDetails = dto.ModeFrequencyDetails.Select(f =>
                        {
                            var entity = ModeFrequencyDetailLibraryMapToEntity(f);
                            entity.StandaloneModeId = savedMode.StandaloneModeId;
                            return entity;
                        }).ToList();

                        await _modeFrequencyDetailLibraryRepository.AddRangeAsync(modeFrequencyDetails);

                    }


                   

                    if (dto.ModeScanDetails != null)
                    {
                        var scanDetails = dto.ModeScanDetails.Select(s =>
                        {
                            var entity = ModeScanDetailLibraryMapToEntity(s);
                            entity.StandaloneModeId = savedMode.StandaloneModeId;
                            return entity;
                        }).ToList();

                        await _modeScanDetailLibraryRepository.AddRangeAsync(scanDetails);
                    }

                    if (dto.ModePriDetails != null)
                    {
                        var priDetails = dto.ModePriDetails.Select(p =>
                        {
                            var entity = ModePriDetailLibraryMapToEntity(p);
                            entity.StandaloneModeId = savedMode.StandaloneModeId;
                            return entity;
                        }).ToList();

                        await _modePriDetailLibraryRepository.AddRangeAsync(priDetails);
                    }

                    if (dto.ModePwDetails != null)
                    {
                        var pwDetails = dto.ModePwDetails.Select(pw =>
                        {
                            var entity = ModePwDetailLibraryMapToEntity(pw);
                            entity.StandaloneModeId = savedMode.StandaloneModeId;
                            return entity;
                        }).ToList();

                        await _modePwDetailLibraryRepository.AddRangeAsync(pwDetails);
                    }

                    return (true, "Mode created successfully", StandaloneModeMapToDto(savedMode));
                }
                else // Update
                {
                    var existing = await _StandaloneModeRepository.GetByIdAsync(dto.ModeId);
                    if (existing == null)
                        return (false, "Mode not found", null);

                    if (existingByName != null && existingByName.StandaloneModeId != dto.ModeId || existingByMode != null  || existingByIndependentMode != null)
                        return (false, "Mode name already exists", null);

                    // Update properties
                    existing.ModeName = dto.ModeName;
                    existing.Description = dto.Description;
                    existing.ModeType = dto.ModeType;
                    existing.PlatformType = dto.PlatformType;
                    existing.SubMode = dto.SubMode;
                    existing.ThreatType = dto.ThreatType;
                    existing.TestType = dto.TestType;
                    //existing.PriStaggerLevel = dto.PriStaggerLevel;
                    existing.SymbolCodeType = dto.SymbolCodeType;
                    existing.ModeSymbol = dto.ModeSymbol;
                    existing.BgColor = dto.BgColor;
                    existing.FgColor = dto.FgColor;
                    existing.RangeEstimation = dto.RangeEstimation;
                    existing.EirpValue = dto.EirpValue;
                    existing.LethalRange = dto.LethalRange;
                    existing.GroundOnly = dto.GroundOnly;
                    existing.EmitterId = dto.EmitterId;
                    existing.ModifiedDate = DateTime.UtcNow;
                    existing.FrequencyType = dto.FrequencyType;
                    existing.FrequencyClass = dto.FrequencyClass;
                    existing.PriType = dto.PriType;
                    existing.PriClass = dto.PriClass;
                    existing.PwType = dto.PwType;
                    existing.PwClass = dto.PwClass;

                    existing.ModeFrequencyDetails.Clear();
                    if (dto.ModeFrequencyDetails != null)
                        existing.ModeFrequencyDetails = dto.ModeFrequencyDetails.Select(f =>
                        {
                            var entity = ModeFrequencyDetailLibraryMapToEntity(f);
                            entity.StandaloneModeId = existing.StandaloneModeId;
                            return entity;
                        }).ToList();

                    existing.ModePriDetails.Clear();
                    if (dto.ModePriDetails != null)
                        existing.ModePriDetails = dto.ModePriDetails.Select(p =>
                        {
                            var entity = ModePriDetailLibraryMapToEntity(p);
                            entity.StandaloneModeId = existing.StandaloneModeId;
                            return entity;
                        }).ToList();

                    existing.ModeScanDetails.Clear();
                    if (dto.ModeScanDetails != null)
                        existing.ModeScanDetails = dto.ModeScanDetails.Select(s =>
                        {
                            var entity = ModeScanDetailLibraryMapToEntity(s);
                            entity.StandaloneModeId = existing.StandaloneModeId;
                            return entity;
                        }).ToList();

                  

                    existing.ModePwDetails.Clear();
                    if (dto.ModePwDetails != null)
                        existing.ModePwDetails = dto.ModePwDetails.Select(pw =>
                        {
                            var entity = ModePwDetailLibraryMapToEntity(pw);
                            entity.StandaloneModeId = existing.StandaloneModeId;
                            return entity;
                        }).ToList();

                    await _StandaloneModeRepository.UpdateAsync(existing);

                    return (true, "Mode updated successfully", StandaloneModeMapToDto(existing));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error: {ex.Message}", null);
            }
        }

        public async Task<(bool Success, string Message)> DeleteStandaloneModeAsync(int id)
        {
            var mode = await _StandaloneModeRepository.GetByIdAsync(id);
            if (mode == null)
                return (false, "Standalone Mode not found");

            await _StandaloneModeRepository.DeleteAsync(mode);
            return (true, "Standalone Mode deleted successfully");
        }

        public async Task<(bool Success, string Message, IndependentModeDto? Data)> SaveIndependentModeAsync(IndependentModeDto dto)
        {
            //var vr = IndependentModeValidator.Validate(dto);
            //if (!vr.IsValid)
            //    return (false, vr.ToString(), null);

            try
            {

                if (string.IsNullOrWhiteSpace(dto.ModeName))
                    return (false, "Mode name cannot be null or empty", null);
                // var existing_emitter = await _emitterRepository.GetByIdAsync(dto.EmitterId);
                // if (existing_emitter == null)
                //     return (false, "Emitter not found", null);


                // Check unique ModeName

                var existingByStandaloneMode = await _StandaloneModeRepository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);

                var existingByMode = await _repository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);

                var existingByName = await _IndependentModeRepository.Query()
                    .FirstOrDefaultAsync(m => m.ModeName == dto.ModeName);

                if (dto.ModeId == 0) // Create
                {
                    if (existingByName != null || existingByMode != null || existingByStandaloneMode != null)
                        return (false, "Mode name already exists", null);

                    var mode = IndependentModeMapToEntity(dto);
                    mode.CreatedDate = DateTime.UtcNow;
                    mode.ModifiedDate = DateTime.UtcNow;

                    var savedMode = await _IndependentModeRepository.AddAsync(mode);


                    if (dto.ModeFrequencyDetails != null)
                    {
                        var modeFrequencyDetails = dto.ModeFrequencyDetails.Select(f =>
                        {
                            var entity = IndependentModeFrequencyDetailDtoToEntity(f);
                            entity.IndependentModeId = savedMode.IndependentModeId;
                            return entity;
                        }).ToList();

                        await _modeFrequencyIndependentRepository.AddRangeAsync(modeFrequencyDetails);

                    }



                    if (dto.ModeScanDetails != null)
                    {
                        var scanDetails = dto.ModeScanDetails.Select(s =>
                        {
                            var entity = IndependentModeScanDetailMapDtoToEntity(s);
                            entity.IndependentModeId = savedMode.IndependentModeId;
                            return entity;
                        }).ToList();

                        await _modeScanIndependentRepository.AddRangeAsync(scanDetails);
                    }

                    if (dto.ModePriDetails != null)
                    {
                        var priDetails = dto.ModePriDetails.Select(p =>
                        {
                            var entity = IndependentModePriDetailDtoToEntity(p);
                            entity.IndependentModeId = savedMode.IndependentModeId;
                            return entity;
                        }).ToList();

                        await _modePriIndependentRepository.AddRangeAsync(priDetails);
                    }

                    if (dto.ModePwDetails != null)
                    {
                        var pwDetails = dto.ModePwDetails.Select(pw =>
                        {
                            var entity = IndependentModePwDetailDtoToEntity(pw);
                            entity.IndependentModeId = savedMode.IndependentModeId;
                            return entity;
                        }).ToList();

                        await _modePwIndependentRepository.AddRangeAsync(pwDetails);
                    }

                    return (true, "Mode created successfully", IndependentModeMapToDto(savedMode));
                }
                else // Update
                {
                    var existing = await _IndependentModeRepository.GetByIdAsync(dto.ModeId);
                    if (existing == null)
                        return (false, "Mode not found", null);

                    if (existingByName != null && existingByName.IndependentModeId != dto.ModeId || existingByMode != null || existingByStandaloneMode != null)
                        return (false, "Mode name already exists", null);

                    // Update properties
                    existing.ModeName = dto.ModeName;
                    existing.Description = dto.Description;
                    existing.ModeType = dto.ModeType;
                    existing.PlatformType = dto.PlatformType;
                    existing.SubMode = dto.SubMode;
                    existing.ThreatType = dto.ThreatType;
                    existing.TestType = dto.TestType;
                    //existing.PriStaggerLevel = dto.PriStaggerLevel;
                    existing.SymbolCodeType = dto.SymbolCodeType;
                    existing.ModeSymbol = dto.ModeSymbol;
                    existing.BgColor = dto.BgColor;
                    existing.FgColor = dto.FgColor;
                    existing.RangeEstimation = dto.RangeEstimation;
                    existing.EirpValue = dto.EirpValue;
                    existing.LethalRange = dto.LethalRange;
                    existing.GroundOnly = dto.GroundOnly;
                    existing.ModifiedDate = DateTime.UtcNow;
                    existing.FrequencyType = dto.FrequencyType;
                    existing.FrequencyClass = dto.FrequencyClass;
                    existing.PriType = dto.PriType;
                    existing.PriClass = dto.PriClass;
                    existing.PwType = dto.PwType;
                    existing.PwClass = dto.PwClass;

                    existing.ModeFrequencyDetails.Clear();
                    if (dto.ModeFrequencyDetails != null)
                        existing.ModeFrequencyDetails = dto.ModeFrequencyDetails.Select(f =>
                        {
                            var entity = IndependentModeFrequencyDetailDtoToEntity(f);
                            entity.IndependentModeId = existing.IndependentModeId;
                            return entity;
                        }).ToList();

                    existing.ModePriDetails.Clear();
                    if (dto.ModePriDetails != null)
                        existing.ModePriDetails = dto.ModePriDetails.Select(p =>
                        {
                            var entity = IndependentModePriDetailDtoToEntity(p);
                            entity.IndependentModeId = existing.IndependentModeId;
                            return entity;
                        }).ToList();

                    existing.ModeScanDetails.Clear();
                    if (dto.ModeScanDetails != null)
                        existing.ModeScanDetails = dto.ModeScanDetails.Select(s =>
                        {
                            var entity = IndependentModeScanDetailMapDtoToEntity(s);
                            entity.IndependentModeId = existing.IndependentModeId;
                            return entity;
                        }).ToList();



                    existing.ModePwDetails.Clear();
                    if (dto.ModePwDetails != null)
                        existing.ModePwDetails = dto.ModePwDetails.Select(pw =>
                        {
                            var entity = IndependentModePwDetailDtoToEntity(pw);
                            entity.IndependentModeId = existing.IndependentModeId;
                            return entity;
                        }).ToList();

                    await _IndependentModeRepository.UpdateAsync(existing);

                    return (true, "Mode updated successfully", IndependentModeMapToDto(existing));
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error: {ex.Message}", null);
            }
        }

        public async Task<(bool Success, string Message)> DeleteIndependenModeAsync(int id)
        {
            var mode = await _IndependentModeRepository.GetByIdAsync(id);
            if (mode == null)
                return (false, "Mode not found");

            await _IndependentModeRepository.DeleteAsync(mode);
            return (true, "Mode deleted successfully");
        }
        
        public async Task<ModeTreeDto?> GetWeaponModeTreeByIdAsync(int modeId)

        {
            var mode = await _repository.Query()
                .Include(m => m.ModeFrequencyDetails)
                .Include(m => m.ModePriDetails)
                .Include(m => m.ModeScanDetails)
                .Include(m => m.ModePwDetails)
                .Include(m => m.Jammings)
                .ThenInclude(m => m.TargetPhases)
            .FirstOrDefaultAsync(w => w.ModeId == modeId);

            if (mode == null) return null;

            return WeaponServiceImpl.MapToTreeDto(mode);
        }



        // 🔹 Mapping Methods


        public static ModeDto MapToDto(Mode mode)
        {
            return new ModeDto
            {
                ModeId = mode.ModeId,
                ModeName = mode.ModeName,
                Description = mode.Description,
                ModeType = mode.ModeType,
                PlatformType = mode.PlatformType,
                SubMode = mode.SubMode,
                ThreatType = mode.ThreatType,
                TestType = mode.TestType,
                //PriStaggerLevel = mode.PriStaggerLevel,
                SymbolCodeType = mode.SymbolCodeType,
                ModeSymbol = mode.ModeSymbol,
                BgColor = mode.BgColor,
                FgColor = mode.FgColor,
                RangeEstimation = mode.RangeEstimation,
                EirpValue = mode.EirpValue,
                LethalRange = mode.LethalRange,
                GroundOnly = mode.GroundOnly,
                CreatedBy = mode.CreatedBy,
                CreatedDate = mode.CreatedDate,
                ModifiedBy = mode.ModifiedBy,
                ModifiedDate = mode.ModifiedDate,
                EmitterId = mode.EmitterId,
                FrequencyType = mode.FrequencyType,
                FrequencyClass = mode.FrequencyClass,
                PriType = mode.PriType,
                PriClass = mode.PriClass,
                PwType = mode.PwType,
                PwClass = mode.PwClass,

                ModeFrequencyDetails = mode.ModeFrequencyDetails.Select(ModeFrequencyDetailMapToDto).ToList(),
                ModePriDetails = mode.ModePriDetails.Select(ModePriDetailMapToDto).ToList(),
                ModeScanDetails = mode.ModeScanDetails.Select(ModeScanDetailMapToDto).ToList(),

                ModePwDetails = mode.ModePwDetails.Select(ModePwDetailMapToDto).ToList()
            };
        }

        public async Task<ModeTreeDto?> GetStandaloneModeTreeByIdAsync(int modeId)

        {
            var mode = await _StandaloneModeRepository.Query()
                .Include(m => m.ModeFrequencyDetails)
                .Include(m => m.ModePriDetails)
                .Include(m => m.ModeScanDetails)
                .Include(m => m.ModePwDetails)
                .Include(m => m.Jammings).ThenInclude(m=> m.StandaloneTargetPhases)
            .FirstOrDefaultAsync(w => w.StandaloneModeId == modeId);

            if (mode == null) return null;

            return EmitterServiceImpl.MapToTreeDto(mode);
        }

        public static ModeDto StandaloneModeMapToDto(StandaloneMode mode)
        {
            return new ModeDto
            {
                ModeId = mode.StandaloneModeId,
                ModeName = mode.ModeName,
                Description = mode.Description,
                ModeType = mode.ModeType,
                PlatformType = mode.PlatformType,
                SubMode = mode.SubMode,
                ThreatType = mode.ThreatType,
                TestType = mode.TestType,

                //PriStaggerLevel = mode.PriStaggerLevel,

                SymbolCodeType = mode.SymbolCodeType,
                ModeSymbol = mode.ModeSymbol,
                BgColor = mode.BgColor,
                FgColor = mode.FgColor,
                RangeEstimation = mode.RangeEstimation,

                EirpValue = mode.EirpValue,
                LethalRange = mode.LethalRange,
                GroundOnly = mode.GroundOnly,
                CreatedBy = "ADMIN",
                CreatedDate = mode.CreatedDate,
                ModifiedBy = "ADMIN",
                ModifiedDate = mode.ModifiedDate,
                FrequencyType = mode.FrequencyType,
                FrequencyClass = mode.FrequencyClass,
                PriType = mode.PriType,
                PriClass = mode.PriClass,
                PwType = mode.PwType,
                PwClass = mode.PwClass,
                EmitterId = mode.EmitterId,

                //ModeDfs = mode.ModeDfs.Select(ModeDfLibraryMapToDto).ToList(),
                ModeFrequencyDetails = mode.ModeFrequencyDetails.Select(ModeFrequencyDetailLibraryMapToDto).ToList(),
                ModePriDetails = mode.ModePriDetails.Select(ModePriDetailLibraryMapToDto).ToList(),
                ModeScanDetails = mode.ModeScanDetails.Select(ModeScanDetailLibraryMapToDto).ToList(),

                ModePwDetails = mode.ModePwDetails.Select(ModePwDetailLibraryMapToDto).ToList()
            };
        }

        private ModeTreeDto IndependentModeTreeMapToDto(IndependentMode mode)
        {
            return new ModeTreeDto
            {
                ModeId = mode.IndependentModeId,
                ModeName = mode.ModeName,
                Description = mode.Description,
                ModeType = mode.ModeType,
                PlatformType = mode.PlatformType,
                SubMode = mode.SubMode,
                ThreatType = mode.ThreatType,
                TestType = mode.TestType,
                //PriStaggerLevel = mode.PriStaggerLevel,
                SymbolCodeType = mode.SymbolCodeType,
                ModeSymbol = mode.ModeSymbol,
                BgColor = mode.BgColor,
                FgColor = mode.FgColor,
                RangeEstimation = mode.RangeEstimation,
                EirpValue = mode.EirpValue,
                LethalRange = mode.LethalRange,
                GroundOnly = mode.GroundOnly,
                CreatedBy = "ADMIN",
                CreatedDate = mode.CreatedDate,
                ModifiedBy = "ADMIN",
                ModifiedDate = mode.ModifiedDate,
                FrequencyType = mode.FrequencyType,
                FrequencyClass = mode.FrequencyClass,
                PriType = mode.PriType,
                PriClass = mode.PriClass,
                PwType = mode.PwType,
                PwClass = mode.PwClass,
                ModeFrequencyDetails = mode.ModeFrequencyDetails.Select(IndependentModeFrequencyDetailMapToDto).ToList(),
                ModePriDetails = mode.ModePriDetails.Select(IndependentModePriDetailMapToDto).ToList(),
                ModeScanDetails = mode.ModeScanDetails.Select(IndependentModeScanDetailMapToDto).ToList(),
                ModePwDetails = mode.ModePwDetails.Select(IndependentModePwDetailMapToDto).ToList(),
                Jammings = mode.Jammings?.Select(JammingDtoMapToDto).ToList() ?? new()
            };
        }
        
        public static JammingDto JammingDtoMapToDto(IndependentModeJamming entity)
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



        private IndependentModeDto IndependentModeMapToDto(IndependentMode mode)
        {
            return new IndependentModeDto
            {
                ModeId = mode.IndependentModeId,
                ModeName = mode.ModeName,
                Description = mode.Description,
                ModeType = mode.ModeType,
                PlatformType = mode.PlatformType,
                SubMode = mode.SubMode,
                ThreatType = mode.ThreatType,
                TestType = mode.TestType,
                //PriStaggerLevel = mode.PriStaggerLevel,
                SymbolCodeType = mode.SymbolCodeType,
                ModeSymbol = mode.ModeSymbol,
                BgColor = mode.BgColor,
                FgColor = mode.FgColor,
                RangeEstimation = mode.RangeEstimation,
                EirpValue = mode.EirpValue,
                LethalRange = mode.LethalRange,
                GroundOnly = mode.GroundOnly,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "ADMIN",   
                ModifiedDate = DateTime.UtcNow,
                FrequencyType = mode.FrequencyType,
                FrequencyClass = mode.FrequencyClass,
                PriType = mode.PriType,
                PriClass = mode.PriClass,
                PwType = mode.PwType,
                PwClass = mode.PwClass,
                ModeFrequencyDetails = mode.ModeFrequencyDetails.Select(IndependentModeFrequencyDetailMapToDto).ToList(),
                ModePriDetails = mode.ModePriDetails.Select(IndependentModePriDetailMapToDto).ToList(),
                ModeScanDetails = mode.ModeScanDetails.Select(IndependentModeScanDetailMapToDto).ToList(),
                ModePwDetails = mode.ModePwDetails.Select(IndependentModePwDetailMapToDto).ToList()
            };
        }

        

        public static Mode MapToEntity(ModeDto dto)
        {
            return new Mode
            {
                ModeId = dto.ModeId,
                ModeName = dto.ModeName,
                Description = dto.Description,
                ModeType = dto.ModeType,
                PlatformType = dto.PlatformType,
                SubMode = dto.SubMode,
                ThreatType = dto.ThreatType,
                TestType = dto.TestType,
                //PriStaggerLevel = dto.PriStaggerLevel,
                SymbolCodeType = dto.SymbolCodeType,
                ModeSymbol = dto.ModeSymbol,
                BgColor = dto.BgColor,
                FgColor = dto.FgColor,
                RangeEstimation = dto.RangeEstimation,
                EirpValue = dto.EirpValue,
                LethalRange = dto.LethalRange,
                GroundOnly = dto.GroundOnly,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "ADMIN",
                ModifiedDate = DateTime.UtcNow,
                EmitterId = dto.EmitterId,
                FrequencyType = dto.FrequencyType,
                FrequencyClass = dto.FrequencyClass,
                PriType = dto.PriType,
                PriClass = dto.PriClass,
                PwType = dto.PwType,
                PwClass = dto.PwClass,




            };
        }

        private StandaloneMode StandaloneModeMapToEntity(ModeDto dto)
        {
            return new StandaloneMode
            {
                StandaloneModeId = dto.ModeId,
                ModeName = dto.ModeName,
                Description = dto.Description,
                ModeType = dto.ModeType,
                PlatformType = dto.PlatformType,
                SubMode = dto.SubMode,
                ThreatType = dto.ThreatType,
                TestType = dto.TestType,
                //PriStaggerLevel = dto.PriStaggerLevel,
                SymbolCodeType = dto.SymbolCodeType,
                ModeSymbol = dto.ModeSymbol,
                BgColor = dto.BgColor,
                FgColor = dto.FgColor,
                RangeEstimation = dto.RangeEstimation,
                EirpValue = dto.EirpValue,
                LethalRange = dto.LethalRange,
                GroundOnly = dto.GroundOnly,
                EmitterId = dto.EmitterId,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "ADMIN",
                ModifiedDate = DateTime.UtcNow,
                FrequencyType = dto.FrequencyType,
                FrequencyClass = dto.FrequencyClass,
                PriType = dto.PriType,
                PriClass = dto.PriClass,
                PwType = dto.PwType,
                PwClass = dto.PwClass

            };
        }

        public async Task<ModeTreeDto?> GetModeTreeByIdAsync(int modeId)

        {
            var mode = await _IndependentModeRepository.Query()
                .Include(m => m.ModeFrequencyDetails)
                .Include(m => m.ModePriDetails)
                .Include(m => m.ModeScanDetails)
                .Include(m => m.ModePwDetails)
                .Include(m => m.Jammings)
                .ThenInclude(m => m.IndependentModeTargetPhases)
            .FirstOrDefaultAsync(w => w.IndependentModeId == modeId);

            if (mode == null) return null;

            return IndependentModeTreeMapToDto(mode);
        }

        private IndependentMode IndependentModeMapToEntity(IndependentModeDto dto)
        {
            return new IndependentMode
            {
                IndependentModeId = dto.ModeId,
                ModeName = dto.ModeName,
                Description = dto.Description,
                ModeType = dto.ModeType,
                PlatformType = dto.PlatformType,
                SubMode = dto.SubMode,
                ThreatType = dto.ThreatType,
                TestType = dto.TestType,
                //PriStaggerLevel = dto.PriStaggerLevel,
                SymbolCodeType = dto.SymbolCodeType,
                ModeSymbol = dto.ModeSymbol,
                BgColor = dto.BgColor,
                FgColor = dto.FgColor,
                RangeEstimation = dto.RangeEstimation,
                EirpValue = dto.EirpValue,
                LethalRange = dto.LethalRange,
                GroundOnly = dto.GroundOnly,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "ADMIN",
                ModifiedDate = DateTime.UtcNow,
                FrequencyType = dto.FrequencyType,
                FrequencyClass = dto.FrequencyClass,
                PriType = dto.PriType,
                PriClass = dto.PriClass,
                PwType = dto.PwType,
                PwClass = dto.PwClass

            };
        }

    



        private ModeFrequencyDetail MapToEntity(ModeFrequencyDetailDto dto) =>
            new ModeFrequencyDetail { Id = dto.Id, MinFrequency = dto.MinFrequency, MaxFrequency = dto.MaxFrequency, FrequencyStaggerLevel = dto.FrequencyStaggerLevel, FrequencyJitterMean = dto.FrequencyJitterMean, FrequencyJitterPercentage = dto.FrequencyJitterPercentage};
        public static ModeFrequencyDetailDto ModeFrequencyDetailMapToDto(ModeFrequencyDetail entity) =>
            new ModeFrequencyDetailDto { Id = entity.Id,  MinFrequency = entity.MinFrequency, MaxFrequency = entity.MaxFrequency, FrequencyStaggerLevel = entity.FrequencyStaggerLevel, FrequencyJitterMean = entity.FrequencyJitterMean, FrequencyJitterPercentage = entity.FrequencyJitterPercentage };

        private ModePriDetail MapToEntity(ModePriDetailDto dto) =>
            new ModePriDetail { Id = dto.Id,  MinPri = dto.MinPri, MaxPri = dto.MaxPri, PriStaggerLevel = dto.PriStaggerLevel, PriJitterMean = dto.PriJitterMean, PriJitterPercentage = dto.PriJitterPercentage };
        public static ModePriDetailDto ModePriDetailMapToDto(ModePriDetail entity) =>
            new ModePriDetailDto { Id = entity.Id,  MinPri = entity.MinPri, MaxPri = entity.MaxPri, PriStaggerLevel = entity.PriStaggerLevel, PriJitterMean = entity.PriJitterMean, PriJitterPercentage = entity.PriJitterPercentage };

        private ModeScanDetail MapToEntity(ModeScanDetailDto dto) =>
            new ModeScanDetail { Id = dto.Id, ScanType = dto.ScanType, MinScanSector = dto.MinScanSector, MaxScanSector = dto.MaxScanSector, MinScanRate = dto.MinScanRate, MaxScanRate = dto.MaxScanRate, NominalScanRate = dto.NominalScanRate, SideLobeLevel = dto.SideLobeLevel, SideLobeStd = dto.SideLobeStd, MinBeamWidth = dto.MinBeamWidth, MaxBeamWidth = dto.MaxBeamWidth, CalculatedTot = dto.CalculatedTot, MinTot = dto.MinTot, MaxTot = dto.MaxTot };
        public static ModeScanDetailDto ModeScanDetailMapToDto(ModeScanDetail entity) =>
            new ModeScanDetailDto { Id = entity.Id, ScanType = entity.ScanType, MinScanSector = entity.MinScanSector, MaxScanSector = entity.MaxScanSector, MinScanRate = entity.MinScanRate, MaxScanRate = entity.MaxScanRate, NominalScanRate = entity.NominalScanRate, SideLobeLevel = entity.SideLobeLevel, SideLobeStd = entity.SideLobeStd, MinBeamWidth = entity.MinBeamWidth, MaxBeamWidth = entity.MaxBeamWidth, CalculatedTot = entity.CalculatedTot, MinTot = entity.MinTot, MaxTot = entity.MaxTot };

       

        private ModePwDetail MapToEntity(ModePwDetailDto dto) =>
            new ModePwDetail { Id = dto.Id,  MinPw = dto.MinPw, MaxPw = dto.MaxPw, PwJitterMean = dto.PwJitterMean, PwJitterPercentage = dto.PwJitterPercentage, PwStaggerLevel = dto.PwStaggerLevel};
        public static ModePwDetailDto ModePwDetailMapToDto(ModePwDetail entity) =>
            new ModePwDetailDto { Id = entity.Id,  MinPw = entity.MinPw, MaxPw = entity.MaxPw, PwJitterMean = entity.PwJitterMean, PwJitterPercentage = entity.PwJitterPercentage, PwStaggerLevel = entity.PwStaggerLevel };

 

       

        private StandaloneModeFrequencyDetail ModeFrequencyDetailLibraryMapToEntity(ModeFrequencyDetailDto dto) =>
            new StandaloneModeFrequencyDetail {Id = dto.Id, MinFrequency = dto.MinFrequency, MaxFrequency = dto.MaxFrequency, FrequencyStaggerLevel = dto.FrequencyStaggerLevel, FrequencyJitterMean = dto.FrequencyJitterMean, FrequencyJitterPercentage = dto.FrequencyJitterPercentage };
        public static ModeFrequencyDetailDto ModeFrequencyDetailLibraryMapToDto(StandaloneModeFrequencyDetail entity) =>
            new ModeFrequencyDetailDto { Id = entity.Id,  MinFrequency = entity.MinFrequency, MaxFrequency = entity.MaxFrequency, FrequencyStaggerLevel = entity.FrequencyStaggerLevel, FrequencyJitterMean = entity.FrequencyJitterMean, FrequencyJitterPercentage = entity.FrequencyJitterPercentage };

	private StandaloneModePriDetail ModePriDetailLibraryMapToEntity(ModePriDetailDto dto) =>
            new StandaloneModePriDetail { Id = dto.Id,  MinPri = dto.MinPri, MaxPri = dto.MaxPri, PriStaggerLevel = dto.PriStaggerLevel, PriJitterMean = dto.PriJitterMean, PriJitterPercentage = dto.PriJitterPercentage };
        public static ModePriDetailDto ModePriDetailLibraryMapToDto(StandaloneModePriDetail entity) =>
            new ModePriDetailDto { Id = entity.Id, MinPri = entity.MinPri, MaxPri = entity.MaxPri, PriStaggerLevel = entity.PriStaggerLevel, PriJitterMean = entity.PriJitterMean, PriJitterPercentage = entity.PriJitterPercentage };

        private StandaloneModeScanDetail ModeScanDetailLibraryMapToEntity(ModeScanDetailDto dto) =>
            new StandaloneModeScanDetail { Id = dto.Id, ScanType = dto.ScanType, MinScanSector = dto.MinScanSector, MaxScanSector = dto.MaxScanSector, MinScanRate = dto.MinScanRate, MaxScanRate = dto.MaxScanRate, NominalScanRate = dto.NominalScanRate, SideLobeLevel = dto.SideLobeLevel, SideLobeStd = dto.SideLobeStd, MinBeamWidth = dto.MinBeamWidth, MaxBeamWidth = dto.MaxBeamWidth, CalculatedTot = dto.CalculatedTot, MinTot = dto.MinTot, MaxTot = dto.MaxTot };
        public static ModeScanDetailDto ModeScanDetailLibraryMapToDto(StandaloneModeScanDetail entity) =>
            new ModeScanDetailDto { Id = entity.Id, ScanType = entity.ScanType, MinScanSector = entity.MinScanSector, MaxScanSector = entity.MaxScanSector, MinScanRate = entity.MinScanRate, MaxScanRate = entity.MaxScanRate, NominalScanRate = entity.NominalScanRate, SideLobeLevel = entity.SideLobeLevel, SideLobeStd = entity.SideLobeStd, MinBeamWidth = entity.MinBeamWidth, MaxBeamWidth = entity.MaxBeamWidth, CalculatedTot = entity.CalculatedTot, MinTot = entity.MinTot, MaxTot = entity.MaxTot };


        private StandaloneModePwDetail ModePwDetailLibraryMapToEntity(ModePwDetailDto dto) =>
            new StandaloneModePwDetail { Id = dto.Id,  MinPw = dto.MinPw, MaxPw = dto.MaxPw, PwJitterMean = dto.PwJitterMean, PwJitterPercentage = dto.PwJitterPercentage, PwStaggerLevel = dto.PwStaggerLevel};
        public static ModePwDetailDto ModePwDetailLibraryMapToDto(StandaloneModePwDetail entity) =>
            new ModePwDetailDto { Id = entity.Id, MinPw = entity.MinPw, MaxPw = entity.MaxPw, PwJitterMean = entity.PwJitterMean, PwJitterPercentage = entity.PwJitterPercentage, PwStaggerLevel = entity.PwStaggerLevel };




        public static ModeFrequencyDetailDto IndependentModeFrequencyDetailMapToDto(IndependentModeFrequencyDetail entity) =>
            new ModeFrequencyDetailDto { Id = entity.Id,  MinFrequency = entity.MinFrequency, MaxFrequency = entity.MaxFrequency, FrequencyJitterMean = entity.FrequencyJitterMean, FrequencyJitterPercentage = entity.FrequencyJitterPercentage, FrequencyStaggerLevel =  entity.FrequencyStaggerLevel};

        public static ModePriDetailDto IndependentModePriDetailMapToDto(IndependentModePriDetail entity) =>
            new ModePriDetailDto { Id = entity.Id, MinPri = entity.MinPri, MaxPri = entity.MaxPri, PriStaggerLevel = entity.PriStaggerLevel, PriJitterMean = entity.PriJitterMean, PriJitterPercentage = entity.PriJitterPercentage };


        public static ModeScanDetailDto IndependentModeScanDetailMapToDto(IndependentModeScanDetail entity) =>
            new ModeScanDetailDto { Id = entity.Id, ScanType = entity.ScanType, MinScanSector = entity.MinScanSector, MaxScanSector = entity.MaxScanSector, MinScanRate = entity.MinScanRate, MaxScanRate = entity.MaxScanRate, NominalScanRate = entity.NominalScanRate, SideLobeLevel = entity.SideLobeLevel, SideLobeStd = entity.SideLobeStd, MinBeamWidth = entity.MinBeamWidth, MaxBeamWidth = entity.MaxBeamWidth, CalculatedTot = entity.CalculatedTot, MinTot = entity.MinTot, MaxTot = entity.MaxTot };


        public static ModePwDetailDto IndependentModePwDetailMapToDto(IndependentModePwDetail entity) =>
            new ModePwDetailDto { Id = entity.Id, MinPw = entity.MinPw, MaxPw = entity.MaxPw, PwJitterMean = entity.PwJitterMean, PwJitterPercentage = entity.PwJitterPercentage, PwStaggerLevel = entity.PwStaggerLevel};


        public static IndependentModeFrequencyDetail IndependentModeFrequencyDetailDtoToEntity(ModeFrequencyDetailDto entity) =>
            new IndependentModeFrequencyDetail { Id = entity.Id,  MinFrequency = entity.MinFrequency, MaxFrequency = entity.MaxFrequency, FrequencyJitterMean = entity.FrequencyJitterMean, FrequencyJitterPercentage = entity.FrequencyJitterPercentage, FrequencyStaggerLevel = entity.FrequencyStaggerLevel};

        public static IndependentModePriDetail IndependentModePriDetailDtoToEntity(ModePriDetailDto entity) =>
            new IndependentModePriDetail { Id = entity.Id, MinPri = entity.MinPri, MaxPri = entity.MaxPri, PriStaggerLevel = entity.PriStaggerLevel, PriJitterMean = entity.PriJitterMean, PriJitterPercentage = entity.PriJitterPercentage };

        public static IndependentModeScanDetail IndependentModeScanDetailMapDtoToEntity(ModeScanDetailDto entity) =>
            new IndependentModeScanDetail { Id = entity.Id, ScanType = entity.ScanType, MinScanSector = entity.MinScanSector, MaxScanSector = entity.MaxScanSector, MinScanRate = entity.MinScanRate, MaxScanRate = entity.MaxScanRate, NominalScanRate = entity.NominalScanRate, SideLobeLevel = entity.SideLobeLevel, SideLobeStd = entity.SideLobeStd, MinBeamWidth = entity.MinBeamWidth, MaxBeamWidth = entity.MaxBeamWidth, CalculatedTot = entity.CalculatedTot, MinTot = entity.MinTot, MaxTot = entity.MaxTot };

        public static IndependentModePwDetail IndependentModePwDetailDtoToEntity(ModePwDetailDto entity) =>
            new IndependentModePwDetail { Id = entity.Id, MinPw = entity.MinPw, MaxPw = entity.MaxPw, PwJitterMean = entity.PwJitterMean, PwJitterPercentage = entity.PwJitterPercentage, PwStaggerLevel = entity.PwStaggerLevel };

        public async Task<IEnumerable<ModeDto>> GetAllStandaloneModesAsync()
        {
            var modes = await _StandaloneModeRepository.Query().OrderByDescending(m => m.ModifiedDate)
                .Include(m => m.ModeFrequencyDetails)
                .Include(m => m.ModePriDetails)
                .Include(m => m.ModeScanDetails)
                .Include(m => m.ModePwDetails)
                .ToListAsync();

            return modes.Select(StandaloneModeMapToDto).ToList();
        }
        public async Task<IEnumerable<IndependentModeDto>> GetAllIndependentModesAsync()
        {
            var modes = await _IndependentModeRepository.Query().OrderByDescending(m => m.ModifiedDate)
                .Include(m => m.ModeFrequencyDetails)
                .Include(m => m.ModePriDetails)
                .Include(m => m.ModeScanDetails)
                .Include(m => m.ModePwDetails)
                .ToListAsync();

            return modes.Select(IndependentModeMapToDto).ToList();
        }

    }
}
