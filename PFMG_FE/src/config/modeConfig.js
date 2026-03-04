// import * as yup from "yup";

// export const modeValidationFields = {
//   modeName: "string",
//   modeType: "string",
//   subModeType: "string",
//   platformType: "string",
//   threatType: "string",

//   description: "string",

//   modeSymbol: "string",
//   foregroundColor: "string",
//   backgroundColor: "string",

//   groundOnly: "boolean",
//   isUnknown: "boolean",

//   modeTestType: "string",
//   diskRangeEstimation: "string",
//   eirpValue: "number",
//   lethalRange: "number",
//   minBeamWidth: "number",
//   maxBeamWidth: "number",

//   // headers
//   frequencyType: "string",
//   frequencyClass: "string",
//   priType: "string",
//   priClass: "string",
//   pwType: "string",
//   pwClass: "string",

//   // scan mode
//   scanType: "string",
//   minScanSector: "number",
//   maxScanSector: "number",
//   minScanRate: "number",
//   normalScanRate: "number",
//   sideLobeLevel: "number",
//   sideLobeStd: "number",
//   maxScanRate: "number",
//   minTot: "number",
//   maxTot: "number",

//   // tables
//   frequencyTables: "array",
//   priTables: "array",
//   pwTables: "array",
// };

// export const defaultModeValues = {
//   modeName: "UNKNOWN",
//   modeType: "TRACK",
//   subModeType: "STT",
//   platformType: "UNKNOWN",
//   threatType: "FRIENDLY",

//   description: "N/A",

//   modeSymbol: "SYM001",
//   foregroundColor: "#FFFFFF",
//   backgroundColor: "#000000",

//   groundOnly: false,
//   isUnknown: false,
//   minBeamWidth: 0,
//   maxBeamWidth: 0,
//   modeTestType: "POWER_VARAIATION",
//   diskRangeEstimation: "EIRP",
//   eirpValue: 0,
//   lethalRange: 0,

//   // headers (top level)
//   frequencyType: "",
//   frequencyClass: "RANGE",
//   priType: "STABLE",
//   priClass: "RANGE",
//   pwType: "FIXED",
//   pwClass: "RANGE",

//   // scan
//   scanType: "UNKNOWN",
//   minScanSector: 0,
//   maxScanSector: 0,
//   minScanRate: 0,
//   normalScanRate: 0,
//   sideLobeLevel: 0,
//   sideLobeStd: 0,
//   maxScanRate: 0,
//   minTot: 0,
//   maxTot: 0,

//   // match DynamicTable + backend field names
//   frequencyTables: [
//     {
//       minFrequency: 0,
//       maxFrequency: 0,
//       frequencyStaggerLevel: 0,
//       frequencyJitterMean: 0,
//       frequencyJitterPercentage: 0,
//     },
//   ],
//   priTables: [
//     {
//       minPri: 0,
//       maxPri: 0,
//       priStaggerLevel: 0,
//       priJitterMean: 0,
//       priJitterPercentage: 0,
//     },
//   ],
//   pwTables: [
//     {
//       minPw: 0,
//       maxPw: 0,
//       pwStaggerLevel: 0,
//       pwJitterMean: 0,
//       pwJitterPercentage: 0,
//     },
//   ],

//   lastEdited: new Date().toISOString(),
// };

// export const createModeValidationSchema = () => {
//   const modeSchema = {};

//   Object.keys(modeValidationFields).forEach((field) => {
//     const fieldType = modeValidationFields[field];

//     if (fieldType === "string") {
//       // skip here, we handle eirp & lethal separately below
//       if (field === "eirpValue" || field === "lethalRange") return;
//       modeSchema[field] = yup.string().required(`${field} is required`);
//     } else if (fieldType === "number") {
//       modeSchema[field] = yup
//         .number()
//         .transform((v, o) => (o === "" ? 0 : v))
//         .typeError(`${field} must be a number`)
//         .required(`${field} is required`);
//     } else if (fieldType === "boolean") {
//       modeSchema[field] = yup.boolean();
//     } else if (fieldType === "array") {
//       modeSchema[field] = yup.array();
//     }
//   });

//   // Conditional fields for EIRP + Lethal Range
//   modeSchema.eirpValue = yup.string().when("diskRangeEstimation", {
//     is: "EIRP",
//     then: (schema) => schema.required("EIRP Value is required"),
//     otherwise: (schema) => schema.notRequired(),
//   });

//   modeSchema.lethalRange = yup.string().when("diskRangeEstimation", {
//     is: (val) => val === "EIRP" || val === "LSS Table",
//     then: (schema) => schema.required("Lethal Range is required"),
//     otherwise: (schema) => schema.notRequired(),
//   });

//   // ================================
//   // FREQUENCY TABLE VALIDATION
//   // ================================
//   modeSchema.frequencyTables = yup
//     .array()
//     .of(
//       yup.object().shape({
//         minFrequency: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),
//         maxFrequency: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         // backend fields
//         frequencyStaggerLevel: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         frequencyJitterMean: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         frequencyJitterPercentage: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),
//       })
//     )
//     .notRequired();

//   // ================================
//   // PRI TABLE VALIDATION
//   // ================================
//   modeSchema.priTables = yup
//     .array()
//     .of(
//       yup.object().shape({
//         minPri: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),
//         maxPri: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         priStaggerLevel: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         priJitterMean: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         priJitterPercentage: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),
//       })
//     )
//     .notRequired();

//   // ================================
//   // PW TABLE VALIDATION
//   // ================================
//   modeSchema.pwTables = yup
//     .array()
//     .of(
//       yup.object().shape({
//         minPw: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),
//         maxPw: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         pwStaggerLevel: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         pwJitterMean: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),

//         pwJitterPercentage: yup
//           .number()
//           .transform((v, o) => (o === "" ? 0 : v))
//           .nullable(),
//       })
//     )
//     .notRequired();

//   return yup.object(modeSchema);
// };

// export const createAttachedMode = (customValues = {}) => {
//   return {
//     ...defaultModeValues,
//     ...customValues,
//   };
// };

// export const tableTypeOptions = {
//   frequency: [
//     { value: "FIXED", label: "FIXED" },
//     { value: "AGILE", label: "AGILE" },
//   ],
//   pri: [
//     { value: "STABLE", label: "STABLE" },
//     { value: "STAGGER", label: "STAGGER" },
//     { value: "JITTER", label: "JITTER" },
//     { value: "SWITCHER", label: "SWITCHER" },
//     { value: "SINGLE PULSE", label: "SINGLE PULSE" },
//     { value: "SLIDING UP", label: "SLIDING UP" },
//     { value: "SLIDING DOWN", label: "SLIDING DOWN" },
//     { value: "CW", label: "CW" },
//     { value: "ICW", label: "ICW" },
//   ],
//   pw: [
//     { value: "FIXED", label: "FIXED" },
//     { value: "AGILE", label: "AGILE" },
//   ],

//   // sample table row templates (if you ever use them)
//   frequencyTables: [
//     {
//       minFrequency: "",
//       maxFrequency: "",
//       frequencyStaggerLevel: "",
//       frequencyJitterMean: "",
//       frequencyJitterPercentage: "",
//     },
//   ],
//   priTables: [
//     {
//       minPri: "",
//       maxPri: "",
//       priStaggerLevel: "",
//       priJitterMean: "",
//       priJitterPercentage: "",
//     },
//   ],
//   pwTables: [
//     {
//       minPw: "",
//       maxPw: "",
//       pwStaggerLevel: "",
//       pwJitterMean: "",
//       pwJitterPercentage: "",
//     },
//   ],

//   lastEdited: new Date().toISOString(),
// };
