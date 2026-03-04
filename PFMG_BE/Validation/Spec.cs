namespace PFMG.Validation
{
    public static class Spec
    {
        // Frequencies
        public const double FreqMinGHz = 2.0;
        public const double FreqMaxGHz = 18.0;

        // Bandwidth
        public const double BwMinMHz = 0.0;
        public const double BwMaxMHz = 400.0;

        // Pulse Width
        public const double PwMinUs = 0.1;
        public const double PwMaxUs = 500.0;

        // PRI
        public const double PriMinUs = 1.0;
        public const double PriMaxUs = 80000.0; // 80 ms

        // Ranges
        public const double MinRangeM = 0.5; //500m
        public const double MaxRangeM = 500.0; // 500 km

        // Input sensitivity
        public const double minSensitivity_dBm = -90.0;
        public const double maxSensitivity_dBm = -30.0;


        //public const int PriorityMin = 1;
        //public const int PriorityMax = 5;
    }
}