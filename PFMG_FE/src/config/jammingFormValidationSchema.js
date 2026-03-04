// import * as yup from "yup";

// // Handle empty strings "" as null for numbers
// const numberTransform = yup
//   .number()
//   .transform((value, originalValue) => {
//     return originalValue === "" || Number.isNaN(value) ? null : value;
//   })
//   .nullable();

// // Constants for Validation (Easy to tweak later)
// const LIMITS = {
//   RANGE: { MIN: 0 }, // Meters
//   VELOCITY: { MIN: -5000, MAX: 5000 }, // m/s
//   TIME: { MIN: 0 }, // Seconds
// };

// // Returns TRUE if the selected technique requires Range validation
// const needsRange = (technique) => ["RGPO_I", "CRVPO_I"].includes(technique);

// // Returns TRUE if the selected technique requires Velocity validation
// const needsVelocity = (technique) => ["VGPO_I", "CRVPO_I"].includes(technique);

// // --- Schema Definition ---

// export const jammingSchema = yup.object().shape({
//   technique: yup.string().required("Technique is required"),

//   // --- Timing (Always Required) ---
//   holdTime: numberTransform
//     .required("Hold Time is required")
//     .min(LIMITS.TIME.MIN, "Cannot be negative"),

//   stopTime: numberTransform
//     .required("Stop Time is required")
//     .min(LIMITS.TIME.MIN, "Cannot be negative"),

//   walkTime: numberTransform
//     .required("Walk Time is required")
//     .min(LIMITS.TIME.MIN, "Cannot be negative"),

//   // --- Range Parameters (Conditional) ---
//   minRange: numberTransform.when("technique", {
//     is: (val) => needsRange(val),
//     then: (schema) =>
//       schema
//         .required("Min Range is required")
//         .min(LIMITS.RANGE.MIN, `Min Range must be >= ${LIMITS.RANGE.MIN}`),
//     otherwise: (schema) => schema.notRequired().nullable(),
//   }),

//   maxRange: numberTransform.when("technique", {
//     is: (val) => needsRange(val),
//     then: (schema) =>
//       schema
//         .required("Max Range is required")
//         .min(LIMITS.RANGE.MIN, "Max Range must be positive")
//         .test("range-logic", "Max Range must be >= Min Range", function (val) {
//           const min = this.parent.minRange;
//           return val == null || min == null || val >= min;
//         }),
//     otherwise: (schema) => schema.notRequired().nullable(),
//   }),

//   rateOfChangeRange: numberTransform.when("technique", {
//     is: (val) => needsRange(val),
//     then: (schema) => schema.required("Rate is required"), // Can be negative (approaching) or positive (receding)
//     otherwise: (schema) => schema.notRequired().nullable(),
//   }),

//   // --- Velocity Parameters (Conditional) ---
//   minVelocity: numberTransform.when("technique", {
//     is: (val) => needsVelocity(val),
//     then: (schema) =>
//       schema
//         .required("Min Velocity is required")
//         .min(LIMITS.VELOCITY.MIN)
//         .max(LIMITS.VELOCITY.MAX),
//     otherwise: (schema) => schema.notRequired().nullable(),
//   }),

//   maxVelocity: numberTransform.when("technique", {
//     is: (val) => needsVelocity(val),
//     then: (schema) =>
//       schema
//         .required("Max Velocity is required")
//         .test(
//           "velocity-logic",
//           "Max Velocity must be >= Min Velocity",
//           function (val) {
//             const min = this.parent.minVelocity;
//             return val == null || min == null || val >= min;
//           }
//         ),
//     otherwise: (schema) => schema.notRequired().nullable(),
//   }),

//   rateOfChangeVelocity: numberTransform.when("technique", {
//     is: (val) => needsVelocity(val),
//     then: (schema) => schema.required("Rate is required"),
//     otherwise: (schema) => schema.notRequired().nullable(),
//   }),
// });

import * as yup from "yup";

const parseEmptyNumber = (value, originalValue) =>
  String(originalValue).trim() === "" ? null : value;

// Unit conversion helpers mapping back to the baseline limits in the spreadsheet
const getVelLimit = (unit, baseMax) =>
  unit === "kmph" ? baseMax * 3.6 : baseMax;
const getRangeLimit = (unit, baseMaxKm) =>
  unit === "m" ? baseMaxKm * 1000 : baseMaxKm;
const getFreqLimit = (unit, baseMaxKHz) => {
  if (unit === "Hz") return baseMaxKHz * 1000;
  if (unit === "MHz") return baseMaxKHz * 0.001;
  return baseMaxKHz;
};
const getTimeLimit = (unit, baseMinMs, baseMaxMs) => {
  if (unit === "us") return { min: baseMinMs * 1000, max: baseMaxMs * 1000 };
  if (unit === "s" || unit === "Sec")
    return { min: baseMinMs * 0.001, max: baseMaxMs * 0.001 };
  return { min: baseMinMs, max: baseMaxMs };
};

export const createJammingSchema = ({
  velUnit,
  rangeUnit,
  freqUnit,
  timeUnit,
}) => {
  // Spreadsheet Baselines
  const velMax = getVelLimit(velUnit, 5000);
  const rangeMax = getRangeLimit(rangeUnit, 750);
  const freqMax = getFreqLimit(freqUnit, 5000);
  const timeLimits = getTimeLimit(timeUnit, 0.1, 10000);

  return yup.object().shape({
    scenarioName: yup.string().required("Required"),
    scenarioTime: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .required("Required")
      .positive(),

    targetDirection: yup.string().oneOf(["inbound", "outbound"]),

    // Accel: -500 to 500
    acceleration: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .required("Required")
      .min(-500, "Min -500")
      .max(500, "Max 500"),

    // Velocity: 0 to 5000 m/s (scaled)
    minVelocity: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .required("Required")
      .min(0, "Min 0")
      .max(velMax, `Max ${velMax}`),
    maxVelocity: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .min(0, "Min 0")
      .max(velMax, `Max ${velMax}`),

    // Range: 0 to 750 km (scaled)
    minRange: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .required("Required")
      .min(0, "Min 0")
      .max(rangeMax, `Max ${rangeMax}`),
    maxRange: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .min(0, "Min 0")
      .max(rangeMax, `Max ${rangeMax}`),

    fixedDoppler: yup.string().oneOf(["YES", "NO"]),
    dopplerShift: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .when("fixedDoppler", {
        is: "YES",
        then: (schema) =>
          schema
            .required("Required")
            .min(-freqMax, `Min ${-freqMax}`)
            .max(freqMax, `Max ${freqMax}`),
        otherwise: (schema) => schema.notRequired(),
      }),

    fixedPower: yup.string().oneOf(["YES", "NO"]),
    power: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .when("fixedPower", {
        is: "YES",
        then: (schema) =>
          schema.required("Required").min(-70, "Min -70").max(10, "Max 10"),
        otherwise: (schema) => schema.notRequired(),
      }),

    selectedPhaseDuration: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .required("Required")
      .positive(),

    rcsModel: yup.string().required("Required"),
    rcsUpdateType: yup.string().oneOf(["auto", "manual"]),

    averageRcs: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .required("Required")
      .min(0, "Min 0")
      .max(100000, "Max 100,000"),

    rcsUpdateTime: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .when("rcsUpdateType", {
        is: "manual",
        then: (schema) =>
          schema
            .required("Required")
            .min(timeLimits.min, `Min ${timeLimits.min}`)
            .max(timeLimits.max, `Max ${timeLimits.max}`),
        otherwise: (schema) => schema.notRequired(),
      }),

    numberOfPulses: yup
      .number()
      .transform(parseEmptyNumber)
      .nullable()
      .when("rcsModel", {
        is: (val) => ["Swerling II", "Swerling IV"].includes(val),
        then: (schema) =>
          schema
            .required("Required")
            .min(1, "Min 1")
            .max(1000000, "Max 1,000,000")
            .integer(),
        otherwise: (schema) => schema.notRequired(),
      }),
  });
};
