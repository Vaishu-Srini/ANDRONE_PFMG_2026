// #include <math.h>

// typedef enum {
//     TARGET_DIR_INBOUND  = 0,  // range decreases: start=maxRange, stop=minRange
//     TARGET_DIR_OUTBOUND = 1   // range increases: start=minRange, stop=maxRange
// } TargetDirection;

// /*
// Assumptions (based on your inputs):
// - INBOUND  : startRange = maxRange, stopRange = minRange
// - OUTBOUND : startRange = minRange, stopRange = maxRange
// - If acceleration >= 0: target accelerates from minVelocity up to maxVelocity (then cruises at maxVelocity)
// - If acceleration <  0: treat as deceleration: target decelerates from maxVelocity down to minVelocity (then cruises at minVelocity)
// - Returns time in seconds; returns -1.0f if inputs are not physically feasible.
// */
// float Target_TimeSeconds(float acceleration_mps2,
//                          float minVelocity_mps,
//                          float maxVelocity_mps,
//                          float minRange_m,
//                          float maxRange_m,
//                          TargetDirection dir)
// {
//     // 1) Determine start/stop range from direction
//     float startRange_m = (dir == TARGET_DIR_INBOUND) ? maxRange_m : minRange_m;
//     float stopRange_m  = (dir == TARGET_DIR_INBOUND) ? minRange_m : maxRange_m;

//     // Distance to travel
//     float distance_m = fabsf(stopRange_m - startRange_m);
//     if (distance_m <= 0.0f) return 0.0f;

//     // Sanitize velocities
//     double vmin = (minVelocity_mps > 0.0f) ? (double)minVelocity_mps : 0.0;
//     double vmax = (maxVelocity_mps > 0.0f) ? (double)maxVelocity_mps : 0.0;
//     double d    = (double)distance_m;

//     if (vmin <= 0.0 && vmax <= 0.0) return -1.0f;

//     // Treat tiny acceleration as 0 (constant velocity). Use average of bounds.
//     if (fabs((double)acceleration_mps2) < 1e-9) {
//         double vconst = 0.5 * (vmin + vmax);
//         if (vconst <= 0.0) vconst = (vmax > 0.0) ? vmax : vmin;
//         if (vconst <= 0.0) return -1.0f;
//         return (float)(d / vconst);
//     }

//     // 2) Time computation with accel/decel + speed cap
//     if (acceleration_mps2 > 0.0f) {
//         // Accelerate: v0=min, cap=max
//         double a = (double)acceleration_mps2;
//         double v0 = vmin, vcap = vmax;

//         // Ensure ordering
//         if (v0 > vcap) { double t = v0; v0 = vcap; vcap = t; }
//         if (vcap <= 0.0) return -1.0f;

//         // Distance needed to reach vcap
//         double d_to_cap = (vcap > v0) ? ((vcap*vcap - v0*v0) / (2.0*a)) : 0.0;

//         if (d <= d_to_cap || d_to_cap <= 0.0) {
//             // Never reaches vcap: d = v0*t + 0.5*a*t^2
//             double disc = v0*v0 + 2.0*a*d;
//             if (disc < 0.0) return -1.0f;
//             double t = (-v0 + sqrt(disc)) / a;
//             return (t >= 0.0) ? (float)t : -1.0f;
//         } else {
//             // Reach vcap, then cruise
//             double t_to_cap = (vcap - v0) / a;
//             double t_cruise = (d - d_to_cap) / vcap;
//             return (float)(t_to_cap + t_cruise);
//         }

//     } else {
//         // Decelerate: start at max, cap at min (speed decreases)
//         double a = fabs((double)acceleration_mps2); // decel magnitude
//         double v0 = vmax, vcap = vmin;

//         // Ensure ordering
//         if (v0 < vcap) { double t = v0; v0 = vcap; vcap = t; }
//         if (v0 <= 0.0) return -1.0f;

//         // Distance needed to slow down to vcap
//         double d_to_cap = (v0 > vcap) ? ((v0*v0 - vcap*vcap) / (2.0*a)) : 0.0;

//         if (d <= d_to_cap || d_to_cap <= 0.0) {
//             // Never reaches vcap: d = v0*t - 0.5*a*t^2
//             // => 0.5*a*t^2 - v0*t + d = 0
//             double disc = v0*v0 - 2.0*a*d;
//             if (disc < 0.0) return -1.0f; // can't cover d before stopping
//             double t = (v0 - sqrt(disc)) / a; // smaller positive root
//             return (t >= 0.0) ? (float)t : -1.0f;
//         } else {
//             // Slow to vcap, then cruise at vcap
//             if (vcap <= 0.0) return -1.0f; // can't cruise if cap is zero
//             double t_to_cap = (v0 - vcap) / a;
//             double t_cruise = (d - d_to_cap) / vcap;
//             return (float)(t_to_cap + t_cruise);
//         }
//     }
// }

/**
 * Translated from DSP C-code to calculate exact phase time
 */

export function calculatePhaseTimeInSeconds(
  accel,
  minVel,
  maxVel,
  minRange,
  maxRange,
  dir,
) {
  const startRange = dir === "inbound" ? maxRange : minRange;
  const stopRange = dir === "inbound" ? minRange : maxRange;

  const distance = Math.abs(stopRange - startRange);
  if (distance <= 0) return 0;

  let vmin = minVel > 0 ? minVel : 0;
  let vmax = maxVel > 0 ? maxVel : 0;

  if (vmin <= 0 && vmax <= 0) return -1; // Invalid physics

  // Treat tiny acceleration as 0 (constant velocity)
  if (Math.abs(accel) < 1e-9) {
    let vconst = 0.5 * (vmin + vmax);
    if (vconst <= 0) vconst = vmax > 0 ? vmax : vmin;
    if (vconst <= 0) return -1;
    return distance / vconst;
  }

  // Accelerating
  if (accel > 0) {
    let a = accel;
    let v0 = vmin;
    let vcap = vmax;

    if (v0 > vcap) {
      let t = v0;
      v0 = vcap;
      vcap = t;
    }
    if (vcap <= 0) return -1;

    let d_to_cap = vcap > v0 ? (vcap * vcap - v0 * v0) / (2.0 * a) : 0;

    if (distance <= d_to_cap || d_to_cap <= 0) {
      let disc = v0 * v0 + 2.0 * a * distance;
      if (disc < 0) return -1;
      let t = (-v0 + Math.sqrt(disc)) / a;
      return t >= 0 ? t : -1;
    } else {
      let t_to_cap = (vcap - v0) / a;
      let t_cruise = (distance - d_to_cap) / vcap;
      return t_to_cap + t_cruise;
    }
  }
  // Decelerating
  else {
    let a = Math.abs(accel);
    let v0 = vmax;
    let vcap = vmin;

    if (v0 < vcap) {
      let t = v0;
      v0 = vcap;
      vcap = t;
    }
    if (v0 <= 0) return -1;

    let d_to_cap = v0 > vcap ? (v0 * v0 - vcap * vcap) / (2.0 * a) : 0;

    if (distance <= d_to_cap || d_to_cap <= 0) {
      let disc = v0 * v0 - 2.0 * a * distance;
      if (disc < 0) return -1; // Can't cover distance before stopping
      let t = (v0 - Math.sqrt(disc)) / a;
      return t >= 0 ? t : -1;
    } else {
      if (vcap <= 0) return -1;
      let t_to_cap = (v0 - vcap) / a;
      let t_cruise = (distance - d_to_cap) / vcap;
      return t_to_cap + t_cruise;
    }
  }
}
