namespace PFMG.Enums
{
    public enum FrequencyType
    {
        FIXED,
        STAGGER,
        JITTER,
    }

    public enum RangeDiscreate
    {
        RANGE,
        DISCREATE
    }

    public enum PriType
    {
        STABLE,
        STAGGER,
        JITTER,
        //SWITCHER,
        //SINGLE_PULSE,
        //SLIDING_UP,
        //SLIDING_DOWN,
        //CW,
        //ICW
    }

    public enum PwType
    {
        FIXED,
        STAGGER,
        JITTER,
    }

    public enum ModeScanType
    {
        UNKNOWN,
        CIRCULAR,
        CONSTANT,
        SECTOR,
        LPOI,
        SCAN_NOT_CALCULATED
    }


    public enum TechniqueType
    {
        RGPO_I,
        VGPO_I,
        CRVPO_I
    }

}
