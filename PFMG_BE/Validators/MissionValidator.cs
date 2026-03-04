using System.Text.RegularExpressions;
using PFMG.DTOs;
using PFMG.Enums;
using PFMG.Validation;


namespace PFMG.Validators
{
    public class MissionValidator
    {
        public static ValidationResult Validate(MissionDto dto)
        {
            var vr = ValidationResult.Ok();
            if (string.IsNullOrWhiteSpace(dto.MissionName)) vr.Add("MissionName", "Required");
            if (!Enum.IsDefined(typeof(MissionType), dto.MissionType)) vr.Add("MissionType", "Required");
            return vr.Errors.Count == 0 ? vr : vr with { IsValid = false };
        }
    }
}