
using Microsoft.Identity.Client;

public class PfmDto
{
    public string EmitterId { get; set; }

    public List<PfmModeDto> modes { get; set; }





}

public class PfmModeDto
{
   
    public string ModeId { get; set; }

    public string ModeType { get; set; }   // TRACK ACQUIRE

    public string ModeSymbol { get; set; }

    public string ForegroundColor { get; set; }

    public string BackgroundColor { get; set; }

    public string ModeCount { get; set; }

    public string ModeMinfrequency { get; set; }
    public string ModeMaxfrequency { get; set; }

    public string MinPw { get; set; }
    public string MaxPw { get; set; }
    public string MinPri { get; set; }
    public string MaxPri { get; set; }
    public string JitterPriMin { get; set; }

    public string JitterPriMax { get; set; }

    public string PriType { get; set; }

    public string PwType { get; set; }

    public string FrequencyAgility { get; set; }

    public string PwAgility { get; set; }

    public string MinScanRate { get; set; }

    public string MaxScanRate { get; set; }

    public string ScanModulation { get; set; }

    public string PlatformType { get; set; }

    public string TreatClassification { get; set; }

    public string WarningSensitivity { get; set; }

    public string AgeIn { get; set; }

    public string AgeOut { get; set; }

    public string Eirp { get; set; }

    public string LethalRange { get; set; }

    public string AmpCount { get; set; }

    public string Range { get; set; }

    public string PullInOut { get; set; }





}