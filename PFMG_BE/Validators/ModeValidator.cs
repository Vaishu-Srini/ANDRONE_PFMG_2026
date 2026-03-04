using PFMG.DTOs;
using PFMG.Enums;
using PFMG.Validation;
using System.Text.RegularExpressions;

namespace PFMG.Validators
{
    public class ModeValidator
    {
        public static ValidationResult Validate(ModeDto dto)
        {
            var vr = ValidationResult.Ok();

            if (string.IsNullOrWhiteSpace(dto.ModeName)) vr.Add("ModeName", "Required");

            // Frequencies in GHz
            foreach (var f in dto.ModeFrequencyDetails ?? new())
            {
                if (f.MinFrequency < Spec.FreqMinGHz || f.MinFrequency > Spec.FreqMaxGHz)
                    vr.Add("MinFrequency", $"Must be {Spec.FreqMinGHz}–{Spec.FreqMaxGHz} GHz");
                if (f.MaxFrequency < Spec.FreqMinGHz || f.MaxFrequency > Spec.FreqMaxGHz)
                    vr.Add("MaxFrequency", $"Must be {Spec.FreqMinGHz}–{Spec.FreqMaxGHz} GHz");
                if (f.MaxFrequency < f.MinFrequency)
                    vr.Add("ModeFrequencyDetails", "MaxFrequency must be ≥ MinFrequency");
            }

            // PW in microseconds
            foreach (var pw in dto.ModePwDetails ?? new())
            {
                if (pw.MinPw < Spec.PwMinUs || pw.MinPw > Spec.PwMaxUs)
                    vr.Add("MinPw", $"Must be {Spec.PwMinUs}–{Spec.PwMaxUs} µs");
                if (pw.MaxPw < Spec.PwMinUs || pw.MaxPw > Spec.PwMaxUs)
                    vr.Add("MaxPw", $"Must be {Spec.PwMinUs}–{Spec.PwMaxUs} µs");
                if (pw.MaxPw < pw.MinPw)
                    vr.Add("ModePwDetails", "MaxPw must be ≥ MinPw");
            }

            // PRI in microseconds
            foreach (var pri in dto.ModePriDetails ?? new())
            {
                if (pri.MinPri < Spec.PriMinUs || pri.MinPri > Spec.PriMaxUs)
                    vr.Add("MinPri", $"Must be {Spec.PriMinUs}–{Spec.PriMaxUs} µs");
                if (pri.MaxPri < Spec.PriMinUs || pri.MaxPri > Spec.PriMaxUs)
                    vr.Add("MaxPri", $"Must be {Spec.PriMinUs}–{Spec.PriMaxUs} µs");
                if (pri.MaxPri < pri.MinPri)
                    vr.Add("ModePriDetails", "MaxPri must be ≥ MinPri");
            }

            //foreach (var lss in dto.ModeLssDetails ?? new())
            //{
                
            //    if (lss.MinPowerDbm > Spec.minSensitivity_dBm)
            //        vr.Add("MinPowerDbm", $"Must be ≥ {Spec.minSensitivity_dBm} dBm");

            //    if (lss.MaxPowerDbm > Spec.maxSensitivity_dBm)
            //        vr.Add("MaxPowerDbm", $"Must be ≤ {Spec.maxSensitivity_dBm} dBm");

            //    if (lss.MaxPowerDbm < lss.MinPowerDbm)
            //        vr.Add("ModeLssDetails", "MaxPowerDbm must be ≥ MinPowerDbm");
            //}

            //var priDetails = dto.ModePriDetails ?? new List<ModePriDetailDto>();
            //bool isFixed = priDetails.Any(p => p.PriType == PriType.STABLE || p.PriType == PriType.STABLE);

            //// Agility signals
            //bool hasStagger = !string.IsNullOrWhiteSpace(dto.PriStaggerLevel);
            //bool hasJitter = priDetails.Any(p => p.PriJitterMean > 0 || p.PriJitterPercentage > 0);
            ////bool hasSlidingUp = priDetails.Any(p => p.PriType == PriType.SLIDING_UP);
            ////bool hasSlidingDown = priDetails.Any(p => p.PriType == PriType.SLIDING_DOWN);
            ////bool hasICW = priDetails.Any(p => p.PriType == PriType.ICW);
            ////bool hasCW = priDetails.Any(p => p.PriType == PriType.CW);
            //bool hasDwell = dto.PriSwitchEpgFlag == true;

            //if (isFixed)
            //{
            //    // No agility allowed when fixed/stable
            //    if (hasStagger) vr.Add("PriStaggerLevel", "Must be empty when PRI is FIXED/STABLE");
            //    if (hasJitter) vr.Add("PRI.Jitter", "Jitter metrics must be zero when PRI is FIXED/STABLE");
            //    //if (hasSlidingUp) vr.Add("PRI.SlidingUp", "Not allowed when PRI is FIXED/STABLE");
            //    //if (hasSlidingDown) vr.Add("PRI.SlidingDown", "Not allowed when PRI is FIXED/STABLE");
            //    //if (hasICW) vr.Add("PRI.ICW", "Not allowed when PRI is FIXED/STABLE");
            //    //if (hasCW) vr.Add("PRI.CW", "Not allowed when PRI is FIXED/STABLE");
            //    if (hasDwell) vr.Add("PriSwitchEpgFlag", "Not allowed when PRI is FIXED/STABLE");
            //}
            //else
            //{
            //    //(earlier removed for demo)int agileCount = new[] { hasStagger, hasJitter, hasSlidingUp, hasSlidingDown, hasDwell, hasICW, hasCW }.Count(b => b);
            //    int agileCount = new[] { hasStagger, hasJitter, hasDwell }.Count(b => b);
            //    if (agileCount == 0)
            //        vr.Add("PRI.Agility", "Exactly one agility is required when PRI is not FIXED/STABLE");
            //    else if (agileCount > 1)
            //        vr.Add("PRI.Agility", "Only one agility may be set when PRI is not FIXED/STABLE");
            //}

            //// Stagger ratio format (if provided)
            //if (hasStagger)
            //{
            //    var parts = dto.PriStaggerLevel.Split(new[] { ':', ',', 'x', 'X' }, StringSplitOptions.RemoveEmptyEntries);
            //    if (parts.Length < 2 || !parts.All(s => int.TryParse(s, out var n) && n > 0))
            //        vr.Add("PriStaggerLevel", "Must be a ratio like a:b[:c] with positive integers");
            //}

            return vr.Errors.Count == 0 ? vr : vr with { IsValid = false };
        }
    }
}