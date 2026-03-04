import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Eye, EyeOff, Volume2, Link, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { usePlatformIdStore, useSidebarStore } from "../store/missionStore";
import { toast } from "react-toastify";
// Aliased import to keep backend compatibility
import { saveEmitter as saveWeapon } from "../services/AdroneServices";

// ------------------------------------------------------------
// FORM CONFIG (renamed for Weapon System)
// ------------------------------------------------------------
const formConfig = {
  symbolDetails: {
    alternateSymbol: { type: "input", label: "Add Symbol", required: true },
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
  weaponDetails: {
    weaponName: { type: "input", label: "Weapon System Name", required: true },
    type: {
      type: "select",
      label: "Threat Type",
      required: true,
      options: [
        { value: "S", label: "S" },
        { value: "T", label: "T" },
        { value: "U", label: "U" },
      ],
    },
    priority: { type: "input", label: "priority", required: true },

    description: {
      type: "textarea",
      label: "Description",
      required: true,
      placeholder: "Enter weapon system description...",
    },
  },
};

// ------------------------------------------------------------
// GENERIC FORM FIELD
// ------------------------------------------------------------
const FormField = ({
  field,
  register,
  errors,
  watch,
  setValue,
  onBlurWeaponName,
}) => {
  const fieldName = Object.keys(field)[0];
  const config = field[fieldName];
  const { type, label, options, placeholder } = config;

  const commonClasses = "bg-[#FFFFFF0D] border-black/10 text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <Select
            value={watch[fieldName] || ""}
            onValueChange={(value) =>
              setValue(fieldName, value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className={`w-full ${commonClasses}`}>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="!bg-[#2C2D30] text-white">
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            {...register(fieldName)}
            className={`w-full ${commonClasses} h-24 resize-none`}
            placeholder={placeholder}
          />
        );
      case "color":
        return (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1 ${commonClasses}`}
          >
            <input
              type="color"
              className="w-[34px] h-[34px] rounded-lg cursor-pointer"
              value={watch[fieldName] || "#123456"}
              onChange={(e) =>
                setValue(fieldName, e.target.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <input
              type="text"
              className="bg-transparent border-none outline-none text-white"
              placeholder="#123456"
              value={watch[fieldName] || "#123456"}
              onChange={(e) =>
                setValue(fieldName, e.target.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>
        );
      default:
        return (
          <Input
            {...register(fieldName)}
            className={commonClasses}
            onChange={(e) =>
              setValue(fieldName, e.target.value, { shouldDirty: true })
            }
            onBlur={(e) => {
              if (fieldName === "weaponName" && onBlurWeaponName) {
                const newName = e.target.value.trim() || "WeaponSystem_Alpha";
                onBlurWeaponName(newName);
              }
            }}
          />
        );
    }
  };

  return (
    <div>
      <Label className={labelClasses}>{label}</Label>
      {renderField()}
      {errors[fieldName] && (
        <p className="text-red-400 text-xs mt-1">{errors[fieldName].message}</p>
      )}
    </div>
  );
};

const ToggleField = ({ name, label, checked, onCheckedChange, setValue }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <Switch
      checked={checked}
      onCheckedChange={(c) => {
        onCheckedChange(c);
        setValue(name, c);
      }}
      className="data-[state=checked]:bg-[#C5BFFF] data-[state=unchecked]:bg-[#A7A7A7]"
    />
    <span className="text-sm text-gray-300">{checked ? "YES" : "NO"}</span>
  </div>
);

// ------------------------------------------------------------
// MODE CARD (unchanged, generic labeling)
// ------------------------------------------------------------

// const ModeCardComponent = ({
//   mode,
//   index,
//   modes,
//   toggleScanType,
//   toggleEmParameter,
//   detachMode,
// }) => (
const ModeCardComponent = ({
  mode,
  index,
  isLast,
  toggleScanType,
  toggleEmParameter,
  detachMode,
}) => (
  <div className="mb-6">
    <div className="rounded-lg bg-[#FFFFFF0D] p-4 px-6">
      {/* Mode Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`px-2 py-1 rounded text-xs font-bold text-white ${mode.code.bgColor === "#4CAF50" ? "bg-green-600" : "bg-yellow-600"}`}
          >
            {mode.id}
          </div>
          <h3 className="text-lg font-semibold text-white">
            {mode.details.type}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleScanType(mode.id)}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 h-auto p-0"
          >
            {mode.showScanType ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {mode.showScanType ? "HIDE SCAN TYPE" : "SHOW SCAN TYPE"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleEmParameter(mode.id)}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 h-auto p-0"
          >
            {mode.showEmParameter ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {mode.showEmParameter ? "HIDE EM PARAMETER" : "SHOW EM PARAMETER"}
          </Button>

          <span className="text-gray-400">LAST EDITED {mode.lastEdited}</span>

          <Button
            type="button"
            variant="ghost"
            className="text-gray-400 hover:text-white h-auto p-0"
          >
            <Volume2 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => detachMode(mode.id)}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 h-auto p-0"
          >
            <Link className="w-4 h-4" />
            Detach
          </Button>
        </div>
      </div>

      {/* Mode Description */}
      <p className="text-gray-300 mb-4">{mode.details.description}</p>

      {/* Mode Parameters Table */}
      <div className="overflow-x-auto mb-4">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-gray-600">
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                TYPE
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                SUB-MODE TYPE
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                PLATFORM TYPE
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                THREAT TYPE
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                FREQ TYPE
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                PRI TYPE
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                STAGGER LEVEL
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                PW TYPE
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                DISP RANGE EST
              </TableHead>
              <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                LETHAL RANGE
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="py-2 px-2 text-white">
                {mode.details.type}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.details.subModeType || "Scan"}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.details.platformType || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.details.threatType || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.ewParameters?.frequency?.freqType || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.ewParameters?.pri?.priType || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.ewParameters?.pri?.priTable?.[0]?.staggerLevel || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.ewParameters?.pulseWidth?.pwType || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.dispRangeEstimation || "N/A"}
              </TableCell>
              <TableCell className="py-2 px-2 text-white">
                {mode.details.lethalRange || "N/A"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Scan Type Section */}
      {mode.showScanType && mode.scanDetails && (
        <div className="mb-4">
          <div className="overflow-x-auto">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="border-b border-gray-600">
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    SCAN TYPE
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    MIN SCAN SECTOR
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    MAX SCAN SECTOR
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    MIN SCAN RATE
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    NORMAL SCAN RATE
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    SIDE LOBE LEVEL
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    SIDE LOBE STD
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    MIN TOT
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 text-gray-300 font-medium">
                    MAX TOT
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.scanType}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.minScanSector}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.maxScanSector}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.minScanRate}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.normalScanRate}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.sideLobeLevel}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.sideLobeStd}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.minTot}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-white">
                    {mode.scanDetails.maxTot}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* EW Parameters Section */}
      {mode.showEmParameter && mode.ewParameters && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FREQ Table */}
            <div className="bg-black/5 rounded overflow-hidden h-full">
              <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
                <div className="px-3 py-2">FREQ MIN</div>
                <div className="px-3 py-2">FREQ MAX</div>
                <div className="px-3 py-2">DEVIATION</div>
              </div>
              {mode.ewParameters.frequency.frequencyTable.map((freq, idx) => (
                <div
                  key={`freq-${freq.min}-${freq.max}-${idx}`}
                  className="grid grid-cols-3 text-gray-100 text-sm"
                >
                  <div className="px-3 py-2">{freq.min}</div>
                  <div className="px-3 py-2">{freq.max}</div>
                  <div className="px-3 py-2">{freq.deviation}</div>
                </div>
              ))}
            </div>
            {/* PRI Table */}
            <div className="bg-black/5 rounded overflow-hidden h-full">
              <div className="grid grid-cols-4 bg-[#393A3E] text-gray-100 text-sm font-medium">
                <div className="px-3 py-2">PRI MIN</div>
                <div className="px-3 py-2">PRI MAX</div>
                <div className="px-3 py-2">DEVIATION</div>
                <div className="px-3 py-2">STAGGER LEVEL</div>
              </div>
              {mode.ewParameters.pri.priTable.map((pri, idx) => (
                <div
                  key={`pri-${pri.min}-${pri.max}-${idx}`}
                  className="grid grid-cols-4 text-gray-100 text-sm"
                >
                  <div className="px-3 py-2">{pri.min}</div>
                  <div className="px-3 py-2">{pri.max}</div>
                  <div className="px-3 py-2">{pri.deviation}</div>
                  <div className="px-3 py-2">{pri.staggerLevel}</div>
                </div>
              ))}
            </div>
            {/* PW Table */}
            <div className="bg-black/5 rounded overflow-hidden h-full">
              <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
                <div className="px-3 py-2">PW MIN</div>
                <div className="px-3 py-2">PW MAX</div>
                <div className="px-3 py-2">DEVIATION</div>
              </div>
              {mode.ewParameters.pulseWidth.pulseWidthTable.map((pw, idx) => (
                <div
                  key={`pw-${pw.min}-${pw.max}-${idx}`}
                  className="grid grid-cols-3 text-gray-100 text-sm"
                >
                  <div className="px-3 py-2">{pw.min}</div>
                  <div className="px-3 py-2">{pw.max}</div>
                  <div className="px-3 py-2">{pw.deviation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    {!isLast && <Separator className="my-6 bg-gray-600" />}
    {/* {index < modes.length - 1 && <Separator className="my-6 bg-gray-600" />} */}
  </div>
);

const ModeCard = memo(ModeCardComponent);

// ------------------------------------------------------------
// VALIDATION SCHEMA
// ------------------------------------------------------------
const validationSchema = yup.object({
  alternateSymbol: yup
    .string()
    .trim()
    .min(2, "Add Symbol must be at least 2 characters")
    .max(20, "Add Symbol cannot exceed 20 characters")
    .required("Add Symbol is required"),
  foregroundColor: yup
    .string()
    .required("Foreground Color is required")
    .matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color (#RRGGBB)"),
  backgroundColor: yup
    .string()
    .required("Background Color is required")
    .matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color (#RRGGBB)"),
  weaponName: yup
    .string()
    .trim()
    .min(3, "Weapon name must be at least 3 characters")
    .max(50, "Weapon name cannot exceed 50 characters")
    .required("Weapon Name is required"),
  type: yup
    .string()
    .oneOf(["S", "T", "U"], "Invalid threat type")
    .required("Threat Type is required"),
  priority: yup.string().required("priority is required"),

  description: yup
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description cannot exceed 200 characters")
    .required("Description is required"),
  displayStatus: yup.boolean().default(false),
  //   isUnknown: yup.boolean().default(false),
});

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
export default function PFMGDbMgmtListingWeapons() {
  const [isDisplayStatus, setIsDisplayStatus] = useState(false);
  const [isUnknown, setIsUnknown] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");
  const weaponId = searchParams.get("weaponId");
  const sidebarData = useSidebarStore((s) => s.sidebarData);
  const platformId = usePlatformIdStore((s) => s.platformId);
  // const [modes, setModes] = useState([]);
  const [modes, setModes] = useState([
    {
      id: 1,
      code: { bgColor: "#4CAF50" },
      details: {
        type: "SEARCH",
        description: "Mock Mode for preview",
        subModeType: "Scan",
        platformType: "Ground Radar",
        threatType: "S",
        lethalRange: "8 km",
      },
      ewParameters: {
        frequency: {
          freqType: "CW",
          frequencyTable: [{ min: 500, max: 1000, deviation: 25 }],
        },
        pri: {
          priType: "Jittered",
          priTable: [{ min: 100, max: 150, deviation: 5, staggerLevel: 2 }],
        },
        pulseWidth: {
          pwType: "Wide",
          pulseWidthTable: [{ min: 20, max: 30, deviation: 2 }],
        },
      },
      scanDetails: {
        scanType: "Circular",
        minScanSector: 5,
        maxScanSector: 50,
        minScanRate: 1,
        normalScanRate: 3,
        sideLobeLevel: -25,
        sideLobeStd: 1.5,
        minTot: 0.2,
        maxTot: 1.0,
      },
      showScanType: true,
      showEmParameter: true,
      lastEdited: "Today",
    },
  ]);

  const weaponNode = useMemo(() => {
    if (!weaponId || !Array.isArray(sidebarData)) return null;
    const idStr = String(weaponId);
    return (
      sidebarData.find(
        (item) => String(item.data?.weaponId ?? item.id) === idStr
      ) || null
    );
  }, [sidebarData, weaponId]);

  const weaponPayload = weaponNode?.data;
  const setRefetchSidebarData = useSidebarStore((s) => s.setRefetchSidebarData);
  const refetchSidebarData = useSidebarStore((s) => s.refetchSidebarData);
  const setCreating = useSidebarStore((s) => s.setCreating);

  useEffect(() => {
    if (weaponPayload && Array.isArray(weaponPayload.modes)) {
      setModes(weaponPayload.modes);
    }
  }, [weaponPayload]);

  const getFormDefaultValues = () => ({
    alternateSymbol: "",
    foregroundColor: "#FFFFFF",
    backgroundColor: "#1E90FF",
    weaponName: "",
    type: "",
    priority: "",

    description: "",
    isDisplayStatus: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: getFormDefaultValues(),
  });

  useEffect(() => {
    if (weaponId && weaponPayload) {
      reset(weaponPayload);
      setIsDisplayStatus(Boolean(weaponPayload.isDisplayStatus));
      setIsUnknown(Boolean(weaponPayload.isUnknown));
    } else {
      reset(getFormDefaultValues());
      setIsDisplayStatus(false);
      setIsUnknown(false);
    }
  }, [weaponId, weaponPayload, reset]);

  const watchedValues = watch();
  const weaponName = watch("weaponName");

  const onSubmit = async (formData) => {
    console.log(formData, "Weapons System Console log details ");
  };

  const toggleScanType = useCallback(
    (modeId) =>
      setModes((prev) =>
        prev.map((m) =>
          m.id === modeId ? { ...m, showScanType: !m.showScanType } : m
        )
      ),
    []
  );

  const toggleEmParameter = useCallback(
    (modeId) =>
      setModes((prev) =>
        prev.map((m) =>
          m.id === modeId ? { ...m, showEmParameter: !m.showEmParameter } : m
        )
      ),
    []
  );

  const detachMode = useCallback(
    (modeId) => setModes((prev) => prev.filter((m) => m.id !== modeId)),
    []
  );
  const handleAddMode = () => {
    setCreating(true, weaponId);
    const params = missionId
      ? `?missionId=${missionId}&weaponId=${weaponId}&component=mode`
      : "";
    navigate(`/mission-creation${params}`);
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-[#414141] text-white p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {weaponPayload?.weaponName ||
              weaponPayload?.entityName ||
              weaponName ||
              "Weapon System"}
          </h1>
          <p className="text-gray-300">Add Weapon System details and modes</p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-transparent border-[#C5BFFF] text-[#C5BFFF] hover:text-[#C5BFFF] hover:bg-transparent cursor-pointer rounded-[4px]"
          >
            Attach Emitter
          </Button>
          <Button
            type="button"
            onClick={handleAddMode}
            className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
            disabled={!weaponId}
          >
            <Plus className="w-4 h-4" />
            Add Emitter
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white cursor-pointer rounded-[4px]"
          >
            Save Weapon System
          </Button>
        </div>
      </div>

      {/* Weapon Details Section */}
      <div className="rounded-lg mb-8 pr-[200px]">
        {/* Symbol Section */}
        <div className="flex gap-6 pb-6 mb-6 border-b border-[#fff]/10">
          <div className="border border-dashed border-gray-600 rounded-lg p-2 flex justify-center items-center">
            <div
              className="rounded p-3 min-w-[96px] w-[96px] h-[96px] flex justify-center items-center"
              style={{ backgroundColor: watch("backgroundColor") || "#262424" }}
            >
              <div
                className="font-mono text-lg"
                style={{ color: watch("foregroundColor") || "#00FF00" }}
              >
                {watch("alternateSymbol") || "SYM"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            <div className="col-span-1 md:col-span-3 lg:col-span-5">
              <Label className="block text-sm font-medium text-gray-300">
                Create Symbol
              </Label>
            </div>
            <FormField
              field={{
                alternateSymbol: formConfig.symbolDetails.alternateSymbol,
              }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
            <FormField
              field={{
                foregroundColor: formConfig.symbolDetails.foregroundColor,
              }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />

            <FormField
              field={{
                backgroundColor: formConfig.symbolDetails.backgroundColor,
              }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
          </div>
        </div>

        {/* Core Weapon System Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            field={{ weaponName: formConfig.weaponDetails.weaponName }}
            register={register}
            errors={errors}
            watch={watchedValues}
            setValue={setValue}
          />
          <div className="flex gap-8">
            <ToggleField
              name="Display Status"
              label="Display Status"
              checked={isDisplayStatus}
              onCheckedChange={(checked) => {
                setIsDisplayStatus(checked);
                setValue("isDisplayStatus", checked, { shouldDirty: true });
              }}
              setValue={setValue}
            />
          </div>
        </div>

        {/* Threat Type & Coordinates */}
        <div className="flex items-center justify-between gap-6 mt-5">
          <div className="flex flex-col flex-1">
            <Label className="block text-sm font-medium text-gray-300 mb-2">
              Threat Type
            </Label>
            <div className="flex gap-3">
              {["S", "T", "U"].map((option) => (
                <Button
                  key={option}
                  type="button"
                  onClick={() =>
                    setValue("type", option.toUpperCase(), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={`px-4 flex-1 py-2 rounded-md text-sm font-medium ${
                    (watch("type") || "S") === option //  default to "S"
                      ? "bg-[#7B70D6] text-white"
                      : "bg-[#FFFFFF0D] text-gray-300"
                  }`}
                >
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>

          <div className="flex-1">
            <FormField
              field={{ priority: formConfig.weaponDetails.priority }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
          </div>

          <div className="flex-1"></div>
        </div>

        <div className="pt-6 border-b pb-6 border-[#fff]/10">
          <FormField
            field={{ description: formConfig.weaponDetails.description }}
            register={register}
            errors={errors}
            watch={watchedValues}
            setValue={setValue}
          />
        </div>
      </div>

      {/* Modes Section */}
      <div className="rounded-lg">
        <h2 className="text-xl font-semibold mb-6 text-white">
          MODES ({modes.length})
        </h2>

        {modes.map((mode, index) => (
          <ModeCard
            key={mode.id}
            mode={mode}
            index={index}
            isLast={index === modes.length - 1}
            toggleScanType={toggleScanType}
            toggleEmParameter={toggleEmParameter}
            detachMode={detachMode}
          />
        ))}

        {modes.length === 0 && (
          <div className="text-gray-400 text-sm italic">
            No modes attached yet. Click “Add Mode” to create one.
          </div>
        )}
      </div>
    </form>
  );
}
