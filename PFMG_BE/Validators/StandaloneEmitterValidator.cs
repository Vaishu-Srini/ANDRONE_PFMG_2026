using System.Text.RegularExpressions;
using PFMG.DTOs;
using PFMG.Validation;

namespace PFMG.Validators
{
    public class StandaloneEmitterValidator
    {
        static bool Hex(string? s) => !string.IsNullOrWhiteSpace(s) && Regex.IsMatch(s, "^#([0-9A-Fa-f]{6})$");
        static bool Lat(string? s) => double.TryParse(s, out var v) && v >= -90 && v <= 90;
        static bool Lon(string? s) => double.TryParse(s, out var v) && v >= -180 && v <= 180;

        public static ValidationResult Validate(StandaloneEmitterDto dto)
        {
            var vr = ValidationResult.Ok();
            if (string.IsNullOrWhiteSpace(dto.EmitterName)) vr.Add("EmitterName", "Required");
            if (!string.IsNullOrWhiteSpace(dto.ForegroundColor) && !Hex(dto.ForegroundColor)) vr.Add("ForegroundColor", "Must be #RRGGBB");
            if (!string.IsNullOrWhiteSpace(dto.BackgroundColor) && !Hex(dto.BackgroundColor)) vr.Add("BackgroundColor", "Must be #RRGGBB");
            if (!string.IsNullOrWhiteSpace(dto.Latitude) && !Lat(dto.Latitude)) vr.Add("Latitude", "Must be between -90 and 90");
            if (!string.IsNullOrWhiteSpace(dto.Longitude) && !Lon(dto.Longitude)) vr.Add("Longitude", "Must be between -180 and 180");
            return vr.Errors.Count == 0 ? vr : vr with { IsValid = false };
        }
    }
}