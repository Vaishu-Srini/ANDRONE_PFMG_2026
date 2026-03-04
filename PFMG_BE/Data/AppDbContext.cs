














using PFMG.Models;
using PFMG.Models.StandaloneModels;
using PFMG.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace PFMG.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<Mission> missions { get; set; }
        public DbSet<Platform> platforms { get; set; }
        public DbSet<EmitterModeLink> emitterModeLinks { get; set; }

        public DbSet<Weapon> weapons { get; set; }
        public DbSet<Emitter> emitters { get; set; }
        public DbSet<Mode> modes { get; set; }  
        public DbSet<Jamming> jammings { get; set; }
        public DbSet<TargetPhase> targetPhases { get; set; }
        public DbSet<ModeFrequencyDetail> modeFrequencyDetails { get; set; }
        public DbSet<ModePriDetail> modePriDetails { get; set; }
        public DbSet<ModePwDetail> modePwDetails { get; set; }
        public DbSet<ModeScanDetail> modeScanDetails { get; set; }


        public DbSet<StandaloneEmitter> standaloneEmitters { get; set; }
        public DbSet<StandaloneMode> standaloneModes { get; set; }
        public DbSet<StandaloneModeFrequencyDetail> standaloneModeFrequencies { get; set; }
        public DbSet<StandaloneModePriDetail> standaloneModePris { get; set; }
        public DbSet<StandaloneModePwDetail> standaloneModePws { get; set; }
        public DbSet<StandaloneModeScanDetail> standaloneModeScans { get; set; }
        public DbSet<StandaloneJamming> standaloneJammings { get; set; } 
        public DbSet<StandaloneTargetPhase> StandaloneTargetPhases { get; set; }


        public DbSet<IndependentMode> independentMode { get; set; }
        public DbSet<IndependentModeFrequencyDetail> independentModeFrequencyDetail { get; set; }
        public DbSet<IndependentModePriDetail> independentModePriDetail { get; set; }
        public DbSet<IndependentModePwDetail> independentModePwDetail { get; set; }
        public DbSet<IndependentModeScanDetail> independentModeScanDetail { get; set; }
        public DbSet<IndependentModeJamming> independentModeJamming { get; set; }
        public DbSet<IndependentModeTargetPhase> independentModeTargetPhases { get; set; }

        public DbSet<IndependentJamming> independentJamming { get; set; }
        public DbSet<IndependentTargetPhase> independentTargetPhases { get; set; }


        public DbSet<PlatformLibrary> platformLibraries { get; set; }

        public DbSet<UserToken> userTokens { get; set; }
        public DbSet<EmitterReading> emitterReadings { get; set; }

        public DbSet<DroneStatus> drones { get; set; }

        public DbSet<AreaInterest> areaInterests { get; set; }


        public DbSet<AreaInterestCoordinate> areacoordinates { get; set; }


        public DbSet<PfmgFileStorage> pfmgFileStorages { get; set; }




       
        

    }
}
