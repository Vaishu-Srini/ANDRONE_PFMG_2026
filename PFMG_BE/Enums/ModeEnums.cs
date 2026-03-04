namespace PFMG.Enums
{
    public enum ModeType
    {
        TRACK,
        ACQUIRE
    }

    public enum SubModeType
    {
        STT,
        MTT,
        DT
    }

    public enum ModeThreatType
    {
        MOST_DANGEROUS, 
        FRIENDLY,
        FOE
    }

    public enum ModePlatformType
    {
        UNKNOWN,
        AIRCRAFT,
        ROTARYWING,
        WEAPON_GROUND,
        LAND_MOBILE,
        SEA_PLATFORM,
        SPACE_PLATFORM,
        SITE,
        MISSILE
    }

    public enum ModeTestType
    {
        POWER_VARAIATION,
        MAIN_LOBE,
        FREQUENCY_ATTRITUDE,
        PRI_ATTRIBUTE,
        MAX_POWER,
        THRESHOLD,
        PRI_STAGGER,
        LEVEL,
        PRI_PW_RANGE,
        FREQUENCY_RANGE,
        PRI_RANGE,
        DF
    }
}
