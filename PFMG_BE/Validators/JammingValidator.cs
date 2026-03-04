using System.Text.RegularExpressions;
using PFMG.DTOs;
using PFMG.Validation;

namespace PFMG.Validators
{
    public class JammingValidator
    {
        public static ValidationResult Validate(JammingDto dto)
        {
            var vr = ValidationResult.Ok();

            // if (string.IsNullOrWhiteSpace(dto.TechniqueName)) vr.Add("TechniqueName", "Required");

            // Ranges in meters
            // if (dto.MinRange < Spec.MinRangeM) vr.Add("MinRange", $"Must be ≥ {Spec.MinRangeM} km");
            // if (dto.MaxRange > Spec.MaxRangeM) vr.Add("MaxRange", $"Must be ≤ {Spec.MaxRangeM} km");
            // if (dto.MaxRange < dto.MinRange) vr.Add("Range", "MaxRange must be ≥ MinRange");

            // // Velocities non-negative and monotonic
            // if (dto.MinVelocity < 0) vr.Add("MinVelocity", "Must be ≥ 0");
            // if (dto.MaxVelocity < 0) vr.Add("MaxVelocity", "Must be ≥ 0");
            // if (dto.MaxVelocity < dto.MinVelocity) vr.Add("Velocity", "MaxVelocity must be ≥ MinVelocity");

            return vr.Errors.Count == 0 ? vr : vr with { IsValid = false };
        }
    }
}
