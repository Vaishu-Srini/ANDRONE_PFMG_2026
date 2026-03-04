using System.Text.RegularExpressions;
using PFMG.DTOs;
using PFMG.Validation;

namespace PFMG.Validators
{
    public class PlatformValidator
    {
        static bool Hex(string? s) => !string.IsNullOrWhiteSpace(s) && Regex.IsMatch(s, "^#([0-9A-Fa-f]{6})$");

        public static ValidationResult Validate(PlatformDto dto)
        {
            var vr = ValidationResult.Ok();
            if (string.IsNullOrWhiteSpace(dto.PlatformName)) vr.Add("PlatformName", "Required");
            //if (dto.Priority < Spec.PriorityMin || dto.Priority > Spec.PriorityMax)
            //    vr.Add("Priority", $"Must be between {Spec.PriorityMin}–{Spec.PriorityMax}");
            if (!string.IsNullOrWhiteSpace(dto.ForeGroundColor) && !Hex(dto.ForeGroundColor)) vr.Add("ForeGroundColor", "Must be #RRGGBB");
            if (!string.IsNullOrWhiteSpace(dto.BackGroundColor) && !Hex(dto.BackGroundColor)) vr.Add("BackGroundColor", "Must be #RRGGBB");
            return vr.Errors.Count == 0 ? vr : vr with { IsValid = false };
        }
    }
}