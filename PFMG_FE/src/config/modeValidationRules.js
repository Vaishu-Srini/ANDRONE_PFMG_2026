import * as yup from "yup";

const PHYSICS = {
  FREQ: { MIN: 0, MAX: 100 }, // GHz
  PRI: { MIN: 0.1, MAX: 100000 }, // Microseconds
  PW: { MIN: 0.01, MAX: 10000 }, // Microseconds
  SCAN: { MIN_RPM: 0, MAX_RPM: 300 },
  BEAM: { MIN_DEG: 0.1, MAX_DEG: 360 },
  SCANSECTOR: { MIN: 0, MAX: 360 },
};

// HELPER: Handles empty strings and NaN from React Hook Form
const numberTransform = yup
  .number()
  .transform((value, originalValue) => {
    if (originalValue === "" || Number.isNaN(value)) {
      return null;
    }
    return value;
  })
  .nullable();

/**
 * REUSABLE TABLE SCHEMA
 */
const createTableSchema = (
  typeFieldName,
  minField,
  maxField,
  staggerField,
  jitterMeanField,
  jitterPercentField,
  minLimit,
  maxLimit,
  unitLabel
) => {
  return yup.array().of(
    yup.object().shape({
      [minField]: numberTransform
        .required(`Min ${unitLabel} is required`)
        .min(minLimit, `Min cannot be below ${minLimit}`)
        .max(maxLimit, `Min cannot exceed ${maxLimit}`),

      [maxField]: numberTransform
        .required(`Max ${unitLabel} is required`)
        .min(minLimit, `Max cannot be below ${minLimit}`)
        .max(maxLimit, `Max cannot exceed ${maxLimit}`)
        .test("is-greater", "Max must be >= Min", function (value) {
          const min = this.parent[minField];
          return value == null || min == null || value >= min;
        }),

      [staggerField]: numberTransform.when(`$${typeFieldName}`, {
        is: "STAGGER",
        then: (schema) =>
          schema.required("Stagger Level is required").min(1).integer(),
        otherwise: (schema) => schema.notRequired(),
      }),

      [jitterMeanField]: numberTransform.when(`$${typeFieldName}`, {
        is: "JITTER",
        then: (schema) => schema.required("Jitter Mean is required").min(0),
        otherwise: (schema) => schema.notRequired(),
      }),

      [jitterPercentField]: numberTransform.when(`$${typeFieldName}`, {
        is: "JITTER",
        then: (schema) =>
          schema.required("Jitter % is required").min(0).max(100),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
  );
};

export const getModeValidationSchema = () => {
  return yup.object().shape({
    // --- General ---
    modeName: yup
      .string()
      .required("Mode Name is required")
      .matches(/^[a-zA-Z0-9_ -]+$/, "Alphanumeric only")
      .min(2)
      .max(20),
    modeSymbol: yup.string().required("Symbol is required").max(10),
    foregroundColor: yup.string().required("Required"),
    backgroundColor: yup.string().required("Required"),
    modeType: yup.string().required("Required"),
    subModeType: yup.string().required("Required"),
    platformType: yup.string().required("Required"),
    threatType: yup.string().required("Required"),
    modeTestType: yup.string().required("Required"),
    description: yup.string().required("Description is required").min(5),
    groundOnly: yup.boolean(),

    // --- Estimation ---
    diskRangeEstimation: yup.string().required("Required"),
    eirpValue: numberTransform.when("diskRangeEstimation", {
      is: "EIRP",
      then: (schema) => schema.required("EIRP Value is required").min(0),
      otherwise: (schema) => schema.notRequired(),
    }),
    lethalRange: numberTransform.when("diskRangeEstimation", {
      is: (val) => ["EIRP", "LSS Table"].includes(val),
      then: (schema) => schema.required("Lethal Range is required").min(0.1),
      otherwise: (schema) => schema.notRequired(),
    }),

    // --- Scan ---
    scanType: yup.string().required("Required"),
    minScanSector: numberTransform
      .required("Required")
      .min(PHYSICS.SCANSECTOR.MIN)
      .max(PHYSICS.SCANSECTOR.MAX),
    maxScanSector: numberTransform
      .required("Required")
      .min(PHYSICS.SCANSECTOR.MIN)
      .max(PHYSICS.SCANSECTOR.MAX)
      .test("sector-logic", "Max >= Min", function (val) {
        return val >= this.parent.minScanSector;
      }),
    minScanRate: numberTransform.required("Required").min(PHYSICS.SCAN.MIN_RPM),
    maxScanRate: numberTransform
      .required("Required")
      .max(PHYSICS.SCAN.MAX_RPM)
      .test("rpm-logic", "Max >= Min", function (val) {
        return val >= this.parent.minScanRate;
      }),
    normalScanRate: numberTransform
      .required("Required")
      .test("normal-logic", "Must be between Min/Max", function (val) {
        return val >= this.parent.minScanRate && val <= this.parent.maxScanRate;
      }),
    minBeamWidth: numberTransform
      .required("Required")
      .min(PHYSICS.BEAM.MIN_DEG),
    maxBeamWidth: numberTransform
      .required("Required")
      .max(PHYSICS.BEAM.MAX_DEG)
      .test("beam-logic", "Max >= Min", function (val) {
        return val >= this.parent.minBeamWidth;
      }),
    sideLobeLevel: numberTransform.required("Required").min(0),
    sideLobeStd: numberTransform.required("Required").min(0),
    minTot: numberTransform.notRequired().min(0),
    maxTot: numberTransform.notRequired().min(0),

    // --- EW Headers ---
    frequencyType: yup.string().required("Required"),
    frequencyClass: yup.string().required("Required"),
    priType: yup.string().required("Required"),
    priClass: yup.string().required("Required"),
    pwType: yup.string().required("Required"),
    pwClass: yup.string().required("Required"),

    // --- Tables ---
    frequencyTables: createTableSchema(
      "frequencyType",
      "minFrequency",
      "maxFrequency",
      "frequencyStaggerLevel",
      "frequencyJitterMean",
      "frequencyJitterPercentage",
      PHYSICS.FREQ.MIN,
      PHYSICS.FREQ.MAX,
      "Frequency"
    ),
    priTables: createTableSchema(
      "priType",
      "minPri",
      "maxPri",
      "priStaggerLevel",
      "priJitterMean",
      "priJitterPercentage",
      PHYSICS.PRI.MIN,
      PHYSICS.PRI.MAX,
      "PRI"
    ),
    pwTables: createTableSchema(
      "pwType",
      "minPw",
      "maxPw",
      "pwStaggerLevel",
      "pwJitterMean",
      "pwJitterPercentage",
      PHYSICS.PW.MIN,
      PHYSICS.PW.MAX,
      "PW"
    ),
  });
};
