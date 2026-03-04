import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { IoMdAttach } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, RotateCcw, Trash2 } from "lucide-react";

// ----------------------------------------------------------------------
// HELPER: Safely retrieve nested errors (Fixes the "undefined" error bug)
// ----------------------------------------------------------------------
const getNestedError = (obj, path) => {
  if (!path || !obj) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// Form field configurations
const modeFormConfig = {
  emitterDetails: {
    modeName: { type: "input", label: "Mode Name", required: true },
    modeType: {
      type: "select",
      label: "Mode Type",
      required: true,
      options: [
        { value: "TRACK", label: "Track" },
        { value: "ACQUIRE", label: "Acquire" },
      ],
    },
    subModeType: {
      type: "select",
      label: "Sub Mode Type",
      required: true,
      options: [
        { value: "STT", label: "STT" },
        { value: "MTT", label: "MTT" },
        { value: "DT", label: "DT" },
      ],
    },
    platformType: {
      type: "select",
      label: "Platform Type",
      required: true,
      options: [
        { value: "UNKNOWN", label: "Unknown" },
        { value: "AIRCRAFT", label: "Aircraft" },
        { value: "SEA_PLATFORM", label: "Sea Platform" },
        { value: "ROTARYWING", label: "Rotary Wing" },
        { value: "WEAPON_GROUND", label: "Weapon Ground" },
        { value: "LAND_MOBILE", label: "Land Mobile" },
        { value: "SPACE_PLATFORM", label: "Space Platform" },
        { value: "SITE", label: "Site" },
        { value: "MISSILE", label: "Missile" },
      ],
    },
    modeTestType: {
      type: "select",
      label: "Mode Test Type",
      required: true,
      options: [
        { value: "POWER_VARAIATION", label: "Power Variation" },
        { value: "MAIN_LOBE", label: "Main Lobe" },
        { value: "FREQUENCY_ATTRITUDE", label: "Frequency Attribute" },
        { value: "PRI_ATTRIBUTE", label: "PRI Attribute" },
        { value: "MAX_POWER", label: "Max Power" },
        { value: "THRESHOLD", label: "Threshold" },
        { value: "PRI_STAGGER", label: "PRI Stagger" },
        { value: "LEVEL", label: "Level" },
        { value: "PRI_PW_RANGE", label: "PRI PW Range" },
        { value: "FREQUENCY_RANGE", label: "Frequency Range" },
        { value: "PRI_RANGE", label: "PRI Range" },
        { value: "DF", label: "DF" },
      ],
    },
    frequencyType: {
      type: "select",
      label: "Frequency Type",
      required: true,
      options: [
        { value: "FIXED", label: "Fixed" },
        { value: "STAGGER", label: "Stagger" },
        { value: "JITTER", label: "Jitter" },
      ],
    },
    frequencyClass: {
      type: "toggle",
      label: "Frequency Class",
      required: true,
      options: [
        { value: "RANGE", label: "RANGE" },
        { value: "DISCREATE", label: "DISCRETE" },
      ],
    },
    diskRangeEstimation: {
      type: "select",
      label: "Disp Range Estimation",
      required: true,
      options: [{ value: "EIRP", label: "EIRP" }],
    },
    priType: {
      type: "select",
      label: "Pri Type",
      required: true,
      options: [
        // { value: "STABLE", label: "Fixed" },
        { value: "FIXED", label: "Fixed" },
        { value: "STAGGER", label: "Stagger" },
        { value: "JITTER", label: "Jitter" },
      ],
    },
    priClass: {
      type: "toggle",
      label: "Pri Class",
      required: true,
      options: [
        { value: "RANGE", label: "RANGE" },
        { value: "DISCREATE", label: "DISCRETE" },
      ],
    },
    pwType: {
      type: "select",
      label: "pw Type",
      required: true,
      options: [
        { value: "FIXED", label: "Fixed" },
        { value: "STAGGER", label: "Stagger" },
        { value: "JITTER", label: "Jitter" },
      ],
    },
    pwClass: {
      type: "toggle",
      label: "Pw Class",
      required: true,
      options: [
        { value: "RANGE", label: "RANGE" },
        { value: "DISCREATE", label: "DISCRETE" },
      ],
    },
    eirpValue: {
      type: "number",
      label: "EIRP Value",
      required: true,
      placeholder: "Enter EIRP Value",
    },
    lethalRange: {
      type: "number",
      label: "Lethal Range (km)",
      required: false,
      placeholder: "Enter Lethal Range",
    },
    threatType: {
      type: "toggle",
      label: "Threat Type",
      required: true,
      options: [
        { value: "MOST_DANGEROUS", label: "Most Dangerous" },
        { value: "FRIENDLY", label: "Friendly" },
        { value: "FOE", label: "Foe" },
      ],
    },
    description: {
      type: "textarea",
      label: "Description",
      placeholder: "Enter mode description...",
    },
  },
  symbolDetails: {
    modeSymbol: { type: "input", label: "Mode Symbol", required: true },
    foregroundColor: {
      type: "color",
      label: "Select Foreground Color",
      required: true,
    },
    backgroundColor: {
      type: "color",
      label: "Select Background Color",
      required: true,
    },
  },
  scanDetails: {
    scanType: {
      type: "select",
      label: "Scan Type",
      required: true,
      options: [
        { value: "UNKNOWN", label: "Unknown" },
        { value: "CIRCULAR", label: "Circular" },
        { value: "CONSTANT", label: "Constant" },
        { value: "SECTOR", label: "Sector" },
        { value: "LPOI", label: "LPOI" },
        { value: "SCAN_NOT_CALCULATED", label: "Scan Not Calculated" },
      ],
    },
    minScanSector: { type: "number", label: "Min Scan Sector", required: true },
    maxScanSector: { type: "number", label: "Max Scan Sector", required: true },
    minScanRate: {
      type: "number",
      label: "Min Scan Rate (RPM)",
      required: true,
    },
    maxScanRate: {
      type: "number",
      label: "Max Scan Rate (RPM)",
      required: true,
    },
    normalScanRate: {
      type: "number",
      label: "Normal Scan Rate (RPM)",
      required: true,
    },
    sideLobeLevel: {
      type: "number",
      label: "Side Lobe Level (dB)",
      required: true,
    },
    sideLobeStd: { type: "number", label: "Side Lobe Std", required: true },
    minBeamWidth: {
      type: "number",
      label: "Min Beam Width (degree)",
      required: true,
    },
    maxBeamWidth: {
      type: "number",
      label: "Max Beam Width (degree)",
      required: true,
    },
    calculateTot: { type: "switch", label: "Calculate TOT", required: false },
    minTot: { type: "number", label: "Min TOT", required: true },
    maxTot: { type: "number", label: "Max Tot", required: true },
  },
  tables: {
    frequency: {
      rowFields: {
        minFrequency: {
          type: "string",
          label: "Min Frequency (GHz)",
          step: "any",
        },
        maxFrequency: {
          type: "string",
          label: "Max Frequency (GHz)",
          step: "any",
        },
        frequencyJitterMean: { type: "string", label: "Jitter Mean (GHz)" },
        frequencyJitterPercentage: { type: "string", label: "Jitter %" },
        frequencyStaggerLevel: { type: "string", label: "Stagger Level" },
      },
    },
    pri: {
      rowFields: {
        minPri: { type: "string", label: "Min PRI (µ sec)" },
        maxPri: { type: "string", label: "Max PRI (µ sec)" },
        priJitterMean: { type: "string", label: "Jitter Mean (µ sec)" },
        priJitterPercentage: { type: "string", label: "Jitter %" },
        priStaggerLevel: { type: "string", label: "Stagger Level" },
      },
    },
    pw: {
      rowFields: {
        minPw: { type: "string", label: "Min PW (µ sec)" },
        maxPw: { type: "string", label: "Max PW (µ sec)" },
        pwJitterMean: { type: "string", label: "Jitter Mean (µ sec)" },
        pwJitterPercentage: { type: "string", label: "Jitter %" },
        pwStaggerLevel: { type: "string", label: "Stagger Level" },
      },
    },
  },
};

const FormField = ({ field, namePrefix = "" }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const fieldName = Object.keys(field)[0];
  const fieldConfig = field[fieldName];
  const { type, label, options, placeholder, colSpan = 1 } = fieldConfig;
  const fullFieldName = namePrefix ? `${namePrefix}.${fieldName}` : fieldName;

  // FIX: Use helper for nested errors
  const errorObj = getNestedError(errors, fullFieldName);
  const errorMessage = errorObj?.message;

  const commonClasses = "bg-[#FFFFFF0D] border-black/10 text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <>
            <input type="hidden" {...register(fullFieldName)} />
            <Select
              value={watch(fullFieldName) ?? ""}
              onValueChange={(value) =>
                setValue(fullFieldName, value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            >
              <SelectTrigger className={`w-full ${commonClasses}`}>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        );
      case "textarea":
        return (
          <Textarea
            {...register(fullFieldName)}
            className={`w-full ${commonClasses} h-24 resize-none`}
            placeholder={placeholder}
          />
        );
      case "toggle":
        return (
          <div className="flex gap-3">
            <input type="hidden" {...register(fullFieldName)} />
            {options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setValue(fullFieldName, opt.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                className={`py-1 flex-1 rounded-md transition-colors ${watch(fullFieldName) === opt.value ? "bg-[#7b70d6] text-white" : "bg-[#828e9c] text-gray-300 hover:bg-[#FFFFFF1A]"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );
      case "switch":
        return (
          <div className="flex items-center gap-3">
            <input type="hidden" {...register(fullFieldName)} />
            <Switch
              checked={watch(fullFieldName) || false}
              onCheckedChange={(checked) =>
                setValue(fullFieldName, checked, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              className="data-[state=checked]:bg-[#C5BFFF] data-[state=unchecked]:bg-[#A7A7A7]"
            />
            <span className="text-sm text-gray-300">
              {watch(fullFieldName) ? "YES" : "NO"}
            </span>
          </div>
        );
      case "color":
        return (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1 ${commonClasses}`}
          >
            <input type="hidden" {...register(fullFieldName)} />
            <input
              type="color"
              className="w-[34px] h-[34px] rounded-lg cursor-pointer"
              value={watch(fullFieldName) || "#123456"}
              onChange={(e) =>
                setValue(fullFieldName, e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
            <input
              type="text"
              {...register(fullFieldName)}
              className="bg-transparent border-none outline-none text-white"
              placeholder="#123456"
              value={watch(fullFieldName) || "#123456"}
              onChange={(e) =>
                setValue(fullFieldName, e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          </div>
        );
      case "number":
        // FIX: step="any" handles the browser error for decimals
        return (
          <Input
            {...register(fullFieldName, { valueAsNumber: true })}
            className={commonClasses}
            type="number"
            step="any"
          />
        );
      default:
        return <Input {...register(fullFieldName)} className={commonClasses} />;
    }
  };

  return (
    <div className={colSpan > 1 ? `col-span-${colSpan}` : ""}>
      <Label className={labelClasses}>{label}</Label>
      {renderField()}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

const ToggleField = ({ name, label, namePrefix = "" }) => {
  const { register, watch, setValue } = useFormContext();
  const fullFieldName = namePrefix ? `${namePrefix}.${name}` : name;
  const checked = watch(fullFieldName) || false;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <input type="hidden" {...register(fullFieldName)} />
      <Switch
        checked={checked}
        onCheckedChange={(checked) => setValue(fullFieldName, checked)}
        className="data-[state=checked]:bg-[#C5BFFF] data-[state=unchecked]:bg-[#A7A7A7]"
      />
      <span className="text-sm text-gray-300">{checked ? "YES" : "NO"}</span>
    </div>
  );
};

const DynamicTable = ({ fieldName, namePrefix = "", externalAdd }) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const fullFieldName = namePrefix
    ? `${namePrefix}.${fieldName}Tables`
    : `${fieldName}Tables`;

  const { fields, append, remove } = useFieldArray({
    control,
    name: fullFieldName,
  });

  const frequencyType = watch(
    namePrefix ? `${namePrefix}.frequencyType` : "frequencyType",
  );
  const priType = watch(namePrefix ? `${namePrefix}.priType` : "priType");
  const pwType = watch(namePrefix ? `${namePrefix}.pwType` : "pwType");

  const rootError = getNestedError(errors, fullFieldName);

  let rowFields = {};
  switch (fieldName) {
    case "frequency":
      switch (frequencyType) {
        case "FIXED":
          rowFields = {
            minFrequency: { label: "Min Frequency (GHz)" },
            maxFrequency: { label: "Max Frequency (GHz)" },
          };
          break;
        case "STAGGER":
          rowFields = {
            minFrequency: { label: "Min Frequency (GHz)" },
            maxFrequency: { label: "Max Frequency (GHz)" },
            frequencyStaggerLevel: { label: "Stagger Level" },
          };
          break;
        case "JITTER":
          rowFields = {
            minFrequency: { label: "Min Frequency (GHz)" },
            maxFrequency: { label: "Max Frequency (GHz)" },
            frequencyJitterMean: { label: "Jitter Mean (GHz)" },
            frequencyJitterPercentage: { label: "Jitter %" },
          };
          break;
      }
      break;
    case "pri":
      switch (priType) {
        case "FIXED":
          rowFields = {
            minPri: { label: "Min PRI (µs)" },
            maxPri: { label: "Max PRI (µs)" },
          };
          break;
        case "STAGGER":
          rowFields = {
            minPri: { label: "Min PRI (µs)" },
            maxPri: { label: "Max PRI (µs)" },
            priStaggerLevel: { label: "Stagger Level" },
          };
          break;
        case "JITTER":
          rowFields = {
            minPri: { label: "Min PRI (µs)" },
            maxPri: { label: "Max PRI (µs)" },
            priJitterMean: { label: "Jitter Mean (µs)" },
            priJitterPercentage: { label: "Jitter %" },
          };
          break;
      }
      break;
    case "pw":
      switch (pwType) {
        case "FIXED":
          rowFields = {
            minPw: { label: "Min PW (µs)" },
            maxPw: { label: "Max PW (µs)" },
          };
          break;
        case "STAGGER":
          rowFields = {
            minPw: { label: "Min PW (µs)" },
            maxPw: { label: "Max PW (µs)" },
            pwStaggerLevel: { label: "Stagger Level" },
          };
          break;
        case "JITTER":
          rowFields = {
            minPw: { label: "Min PW (µs)" },
            maxPw: { label: "Max PW (µs)" },
            pwJitterMean: { label: "Jitter Mean (µs)" },
            pwJitterPercentage: { label: "Jitter %" },
          };
          break;
      }
      break;
    default:
      rowFields = {};
  }

  const unit =
    fieldName === "frequency" ? "MHZ" : fieldName === "pri" ? "GHZ" : "µs";

  const tableTypeMap = { frequency: frequencyType, pri: priType, pw: pwType };
  const selectedType = tableTypeMap[fieldName] || "";

  const handleAddRow = useCallback(() => {
    const keys = Object.keys(rowFields);
    const emptyRow = Object.fromEntries(keys.map((k) => [k, ""]));
    append({ id: Date.now(), ...emptyRow }, { shouldValidate: true });
  }, [append, rowFields]);

  useEffect(() => {
    if (externalAdd) externalAdd.current = handleAddRow;
  }, [externalAdd, handleAddRow]);

  if (fields.length === 0) return <div className="hidden" />;

  const columnCount = Object.keys(rowFields).length;

  return (
    <div className="mt-4 font-mono text-[#E0E0E0] w-[800px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm flex gap-2 items-center tracking-wider">
          <span className="capitalize">{selectedType.toLowerCase()}</span>
          <span>Table</span>
        </h3>
        <div className="flex items-center gap-4">
          <Trash2 className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-400" />
          <RotateCcw className="w-4 h-4 cursor-pointer text-gray-400 hover:text-white" />
        </div>
      </div>

      <div className="border border-white/5 rounded-sm overflow-hidden">
        <div
          className="grid gap-4 px-4 py-3 bg-[#2A2A2A] border-b border-white/10 items-center"
          style={{
            gridTemplateColumns: `40px 40px repeat(${columnCount}, 1fr) 40px`,
          }}
        >
          <input type="checkbox" className="accent-[#7b70d6]" />
          <span className="text-[10px] text-center text-white">#</span>
          {Object.values(rowFields).map((cfg, i) => (
            <span
              key={i}
              className="text-[10px] font-bold tracking-widest uppercase"
            >
              {cfg.label}
            </span>
          ))}
          <span></span>
        </div>

        <div className="divide-y divide-white/5 bg-transparent">
          {fields.map((item, index) => {
            const rowErrors = rootError?.[index] || {};
            return (
              <div
                key={item.id}
                className="grid gap-4 px-4 py-3 h-16 items-center hover:bg-white/[0.02]"
                style={{
                  gridTemplateColumns: `40px 40px repeat(${columnCount}, 1fr) 40px`,
                }}
              >
                <input type="checkbox" className="accent-[#7b70d6]" />
                <span className="text-xs text-center text-gray-500">
                  {index + 1}
                </span>

                {Object.keys(rowFields).map((key) => (
                  <div key={key} className="relative">
                    <div className="flex items-center border-b border-white/10 focus-within:border-[#7b70d6]">
                      <input
                        {...register(`${fullFieldName}.${index}.${key}`, {
                          valueAsNumber: true,
                          required: "Required",
                          min: { value: 0, message: "Must be > 0" },
                        })}
                        className="bg-transparent border-none outline-none text-xs w-full py-1 text-white uppercase placeholder:text-gray-700"
                        placeholder="0.00"
                      />
                      <span className="text-[10px] text-white/50 font-bold ml-1">
                        {unit}
                      </span>
                    </div>
                    {rowErrors[key] && (
                      <span className="text-red-500 text-[9px] absolute -bottom-4 left-0 truncate">
                        {rowErrors[key].message}
                      </span>
                    )}
                  </div>
                ))}

                <Trash2
                  className="w-4 h-4 text-white/40 cursor-pointer hover:text-red-400 ml-auto"
                  onClick={() => remove(index, { shouldValidate: true })}
                />
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddRow}
        className="flex items-center gap-2 mt-6 text-[#C5BFFF] hover:text-[#b0a8ff] text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add New Row
      </button>
    </div>
  );
};

DynamicTable.propTypes = {
  fieldName: PropTypes.string.isRequired,
  namePrefix: PropTypes.string,
  externalAdd: PropTypes.object,
};

const ModeForm = ({ namePrefix = "" }) => {
  const { watch } = useFormContext();
  const symbolFieldName = namePrefix
    ? `${namePrefix}.modeSymbol`
    : "modeSymbol";
  const fgFieldName = namePrefix
    ? `${namePrefix}.foregroundColor`
    : "foregroundColor";
  const bgFieldName = namePrefix
    ? `${namePrefix}.backgroundColor`
    : "backgroundColor";
  const modeSymbolValue = watch(symbolFieldName) || "";
  const foregroundColor = watch(fgFieldName) || "#7BED52";
  const backgroundColor = watch(bgFieldName) || "#262424";
  const diskRangeSelection = watch(
    namePrefix ? `${namePrefix}.diskRangeEstimation` : "diskRangeEstimation",
  );
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) console.log("Selected LSS file:", file.name);
  };
  const freqAddRef = useRef(null);
  const priAddRef = useRef(null);
  const pwAddRef = useRef(null);

  return (
    <div className="space-y-8">
      <div className="flex gap-6 pb-6 mb-6 border-b border-[#fff]/10">
        <div
          className="rounded p-3 min-w-[96px] w-[96px] h-[96px] flex justify-center items-center"
          style={{ backgroundColor: backgroundColor }}
        >
          <div
            className="font-mono text-lg"
            style={{
              color: foregroundColor,
              userSelect: "none",
              textAlign: "center",
              lineHeight: "1",
            }}
          >
            {modeSymbolValue}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
          <div className="col-span-1 md:col-span-3 lg:col-span-5">
            <Label className="block text-sm font-medium text-gray-300">
              Create Symbol
            </Label>
          </div>
          <FormField
            field={{ modeSymbol: modeFormConfig.symbolDetails.modeSymbol }}
            namePrefix={namePrefix}
          />
          <FormField
            field={{
              foregroundColor: modeFormConfig.symbolDetails.foregroundColor,
            }}
            namePrefix={namePrefix}
          />
          <FormField
            field={{
              backgroundColor: modeFormConfig.symbolDetails.backgroundColor,
            }}
            namePrefix={namePrefix}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="w-full">
          <FormField
            field={{ modeName: modeFormConfig.emitterDetails.modeName }}
            namePrefix={namePrefix}
          />
        </div>
        <FormField
          field={{ modeType: modeFormConfig.emitterDetails.modeType }}
          namePrefix={namePrefix}
        />
        <FormField
          field={{ subModeType: modeFormConfig.emitterDetails.subModeType }}
          namePrefix={namePrefix}
        />
        <FormField
          field={{ platformType: modeFormConfig.emitterDetails.platformType }}
          namePrefix={namePrefix}
        />
        <FormField
          field={{ threatType: modeFormConfig.emitterDetails.threatType }}
          namePrefix={namePrefix}
        />
        <div className="flex gap-8">
          <ToggleField
            name="groundOnly"
            label="GROUND ONLY"
            namePrefix={namePrefix}
          />
        </div>
        <FormField
          field={{ modeTestType: modeFormConfig.emitterDetails.modeTestType }}
          namePrefix={namePrefix}
        />
      </div>
      <div className="pt-0 border-b pb-6 border-[#fff]/10">
        <FormField
          field={{ description: modeFormConfig.emitterDetails.description }}
          namePrefix={namePrefix}
        />
      </div>

      <div className="space-y-8">
        <div className="flex justify-between gap-8">
          <div className="flex-1">
            <FormField
              field={{
                diskRangeEstimation:
                  modeFormConfig.emitterDetails.diskRangeEstimation,
              }}
              namePrefix={namePrefix}
            />
          </div>
          {diskRangeSelection === "EIRP" && (
            <>
              <div className="flex-1">
                <FormField
                  field={{ eirpValue: modeFormConfig.emitterDetails.eirpValue }}
                  namePrefix={namePrefix}
                />
              </div>
              <div className="flex-1">
                <FormField
                  field={{
                    lethalRange: modeFormConfig.emitterDetails.lethalRange,
                  }}
                  namePrefix={namePrefix}
                />
              </div>
            </>
          )}
          {diskRangeSelection === "LSS Table" && (
            <>
              <div className="flex-1">
                <FormField
                  field={{
                    lethalRange: modeFormConfig.emitterDetails.lethalRange,
                  }}
                  namePrefix={namePrefix}
                />
              </div>
              <div className="flex items-end">
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".lss,.txt,.csv"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    className="bg-[#7b70d6] text-white"
                    onClick={handleButtonClick}
                  >
                    <IoMdAttach className="mr-1" /> Attach LSS
                  </Button>
                </>
              </div>
            </>
          )}
        </div>

        <div className="">
          <h1 className="mb-5">Frequency Table</h1>
          <div className="gap-3 flex flex-row items-center flex-wrap">
            <div className="flex-1">
              <FormField
                field={{
                  frequencyType: modeFormConfig.emitterDetails.frequencyType,
                }}
                namePrefix={namePrefix}
              />
            </div>
            <div className="flex-1">
              <FormField
                field={{
                  frequencyClass: modeFormConfig.emitterDetails.frequencyClass,
                }}
                namePrefix={namePrefix}
              />
            </div>
            <div className="flex-1 mt-7">
              <Button
                type="button"
                variant="ghost"
                className="p-0 h-auto text-[#C5BFFF] hover:text-[#C5BFFF] cursor-pointer hover:bg-transparent bg-transparent shadow-none"
                onClick={() => freqAddRef.current && freqAddRef.current()}
              >
                + Add Frequency Table
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <DynamicTable
              title="Frequency Table"
              fieldName="frequency"
              namePrefix={namePrefix}
              externalAdd={freqAddRef}
            />
          </div>
        </div>

        <div className="">
          <h1 className="mb-5">PRI Details</h1>
          <div className="gap-3 flex flex-row items-center flex-wrap">
            <div className="flex-1">
              <FormField
                field={{ priType: modeFormConfig.emitterDetails.priType }}
                namePrefix={namePrefix}
              />
            </div>
            <div className="flex-1">
              <FormField
                field={{ priClass: modeFormConfig.emitterDetails.priClass }}
                namePrefix={namePrefix}
              />
            </div>
            <div className="flex-1 mt-7">
              <Button
                type="button"
                variant="ghost"
                className="p-0 h-auto text-[#C5BFFF] hover:text-[#C5BFFF] cursor-pointer hover:bg-transparent bg-transparent shadow-none"
                onClick={() => priAddRef.current && priAddRef.current()}
              >
                + Add PRI Table
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <DynamicTable
              title="PRI Table"
              fieldName="pri"
              namePrefix={namePrefix}
              externalAdd={priAddRef}
            />
          </div>
        </div>

        <div className="">
          <h1 className="mb-5">PW Details</h1>
          <div className="gap-3 flex flex-row items-center flex-wrap">
            <div className="flex-1">
              <FormField
                field={{ pwType: modeFormConfig.emitterDetails.pwType }}
                namePrefix={namePrefix}
              />
            </div>
            <div className="flex-1">
              <FormField
                field={{ pwClass: modeFormConfig.emitterDetails.pwClass }}
                namePrefix={namePrefix}
              />
            </div>
            <div className="flex-1 mt-7">
              <Button
                type="button"
                variant="ghost"
                className="p-0 h-auto text-[#C5BFFF] hover:text-[#C5BFFF] cursor-pointer hover:bg-transparent bg-transparent shadow-none"
                onClick={() => pwAddRef.current && pwAddRef.current()}
              >
                + Add PW Table
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <DynamicTable
              title="PW Table"
              fieldName="pw"
              namePrefix={namePrefix}
              externalAdd={pwAddRef}
            />
          </div>
        </div>

        <div className="pb-6 mb-6 border-b border-[#fff]/10">
          <div className="text-sm text-white/70">Scan Details</div>
          <div className="py-4">
            <div className="max-w-xs mb-4">
              <FormField
                field={{ scanType: modeFormConfig.scanDetails.scanType }}
                namePrefix={namePrefix}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {Object.entries(modeFormConfig.scanDetails)
                .filter(([key]) => key !== "scanType")
                .map(([key, field]) => (
                  <FormField
                    key={key}
                    field={{ [key]: field }}
                    namePrefix={namePrefix}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ModeForm.propTypes = { namePrefix: PropTypes.string };
export default ModeForm;
