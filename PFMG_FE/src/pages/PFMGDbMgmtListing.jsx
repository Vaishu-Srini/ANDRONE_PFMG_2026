// import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import copy from "@/assets/images/copy.svg";
// import detach from "@/assets/images/detach.svg";
// import noise from "@/assets/images/noise.svg";
// import { Eye, EyeOff, Volume2, Link, Plus, Copy } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { usePlatformIdStore, useSidebarStore } from "../store/missionStore";
// import { toast } from "react-toastify";
// import {
//   fetchEmitterStandloneTree,
//   fetchEmitterTree,
//   saveEmitter,
//   saveIndependentEmitter,
// } from "../services/AdroneServices";
// import dayjs from "dayjs";

// // Form field configurations
// const formConfig = {
//   symbolDetails: {
//     symbol: {
//       label: "Symbol",
//       required: true,
//       options: [
//         { value: "NEW", label: "NEW" },
//         { value: "OLD", label: "OLD" },
//       ],
//     },
//     foregroundColor: {
//       type: "color",
//       label: "Select Foreground Color",
//       required: true,
//     },
//     backgroundColor: {
//       type: "color",
//       label: "Select Background Color",
//       required: true,
//     },
//   },
//   emitterDetails: {
//     emitterName: { type: "input", label: "Emitter Name", required: true },
//     type: {
//       type: "select",
//       label: "Threat Type",
//       required: true,
//       options: [
//         { value: "GROUND", label: "Ground" },
//         // Add other types if backend supports them
//       ],
//     },
//     latitude: { type: "input", label: "Latitude", required: true },
//     longitude: { type: "input", label: "Longitude", required: true },
//     description: {
//       type: "textarea",
//       label: "Description",
//       required: true,
//       placeholder: "Enter emitter description...",
//     },
//   },
// };

// const FormField = ({
//   field,
//   register,
//   errors,
//   watch,
//   setValue,
//   setSidebarData,
//   onBlurEmitterName, //  accept this prop
// }) => {
//   const fieldName = Object.keys(field)[0];
//   const fieldConfig = field[fieldName];
//   const { type, label, options, placeholder } = fieldConfig;

//   const commonClasses = "bg-[#FFFFFF0D] border-black/10 text-white";
//   const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

//   const renderField = () => {
//     switch (type) {
//       case "select":
//         return (
//           <Select
//             value={watch[fieldName] || ""}
//             onValueChange={(value) =>
//               setValue(fieldName, value, {
//                 shouldDirty: true,
//                 shouldValidate: true,
//               })
//             }
//           >
//             <SelectTrigger className={`w-full ${commonClasses}`}>
//               <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
//             </SelectTrigger>
//             <SelectContent className="!bg-[#2C2D30] text-white">
//               {options?.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         );
//       case "textarea":
//         return (
//           <Textarea
//             {...register(fieldName)}
//             className={`w-full ${commonClasses} h-24 resize-none`}
//             placeholder={placeholder}
//           />
//         );
//       case "color":
//         return (
//           <div
//             className={`flex items-center gap-2 rounded-lg px-3 py-1 ${commonClasses}`}
//           >
//             <input
//               type="color"
//               {...register(fieldName)}
//               className="w-[34px] h-[34px] rounded-lg cursor-pointer"
//               value={watch?.[fieldName] || "#123456"}
//               onChange={(e) =>
//                 setValue(fieldName, e.target.value, {
//                   shouldDirty: true,
//                   shouldValidate: true,
//                 })
//               }
//             />

//             <input
//               type="text"
//               className="bg-transparent border-none outline-none text-white"
//               placeholder="#123456"
//               value={watch?.[fieldName] || "#123456"}
//               onChange={(e) =>
//                 setValue(fieldName, e.target.value, {
//                   shouldDirty: true,
//                   shouldValidate: true,
//                 })
//               }
//             />
//           </div>
//         );
//       default:
//         return (
//           <Input
//             {...register(fieldName)}
//             className={commonClasses}
//             onChange={(e) =>
//               setValue(fieldName, e.target.value, { shouldDirty: true })
//             }
//             onBlur={(e) => {
//               if (fieldName === "emitterName" && onBlurEmitterName) {
//                 const newName = e.target.value.trim() || "Emitter_Alpha";
//                 onBlurEmitterName(newName); // call parent handler
//               }
//             }}
//           />
//         );
//     }
//   };

//   return (
//     <div>
//       <Label className={labelClasses}>{label}</Label>
//       {renderField()}
//       {errors[fieldName] && (
//         <p className="text-red-400 text-xs mt-1">{errors[fieldName].message}</p>
//       )}
//     </div>
//   );
// };

// const ToggleField = ({ name, label, checked, onCheckedChange, setValue }) => (
//   <div className="flex items-center gap-3">
//     <span className="text-sm font-medium text-gray-300">{label}</span>
//     <Switch
//       checked={checked}
//       onCheckedChange={(checked) => {
//         onCheckedChange(checked);
//         setValue(name, checked);
//       }}
//       checkedText="YES"
//       uncheckedText="NO"
//       checkedBg="#C5BFFF"
//       uncheckedBg="#A7A7A7"
//       checkedThumb="bg-[#7B70D6]"
//       uncheckedThumb="bg-[#545454]"
//       checkedTextColor="text-[#313040]"
//       uncheckedTextColor="text-[#545454]"
//     />
//   </div>
// );

// const ModeCardComponent = ({
//   mode,
//   index,
//   modes,
//   toggleScanType,
//   toggleEmParameter,
//   detachMode,
//   expandedStates,
// }) => {
//   return (
//     <div className="mb-6">
//       <div className="rounded-lg bg-[#FFFFFF0D] p-4 px-6">
//         {/* Mode Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <div
//               className={`px-2 py-1 rounded text-xs font-bold text-white `}
//               style={{
//                 backgroundColor: mode.bgColor || "#666",
//                 color: mode.fgColor || "#fff",
//               }}
//             >
//               {mode.modeSymbol}
//             </div>
//             <h3 className="text-lg font-semibold text-white">
//               {mode.modeName}
//             </h3>
//           </div>

//           <div className="flex items-center gap-4 text-sm">
//             <Button
//               type="button"
//               variant="ghost"
//               onClick={() => toggleScanType(mode.modeId)}
//               className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
//             >
//               {expandedStates[`${mode.modeId}_scan`] ? (
//                 <EyeOff className="w-4 h-4" />
//               ) : (
//                 <Eye className="w-4 h-4" />
//               )}
//               {expandedStates[`${mode.modeId}_scan`]
//                 ? "HIDE SCAN TYPE"
//                 : "SHOW SCAN TYPE"}
//             </Button>

//             <Button
//               type="button"
//               variant="ghost"
//               onClick={() => toggleEmParameter(mode.modeId)}
//               className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
//             >
//               {expandedStates[`${mode.modeId}_param`] ? (
//                 <EyeOff className="w-4 h-4" />
//               ) : (
//                 <Eye className="w-4 h-4" />
//               )}
//               {expandedStates[`${mode.modeId}_param`]
//                 ? "HIDE EM PARAMETER"
//                 : "SHOW EM PARAMETER"}
//             </Button>

//             <p className="text-sm text-gray-300 font-medium mr-3">
//               LAST EDITED{" "}
//               <span className=" font-medium text-white text-base">
//                 {dayjs(mode.modifiedDate).format("DD MMM'YY HH:mm")}
//               </span>
//             </p>

//             {expandedStates[`${mode.modeId}_scan`] ||
//             expandedStates[`${mode.modeId}_param`] ? (
//               <div className="flex gap-5 p-0">
//                 <button type="button" className="text-white">
//                   <img src={noise} alt="Noise" className="h-5 w-5" />
//                 </button>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8"
//                 >
//                   <img src={detach} alt="Detach" className="h-4 w-4" />
//                   Detach
//                 </Button>
//               </div>
//             ) : (
//               <div className="flex gap-5 p-0">
//                 <button type="button" className="text-white p-0">
//                   <img src={detach} alt="Detach" className="h-4 w-4" />
//                 </button>
//                 <button type="button" className="text-white">
//                   <img src={copy} alt="Copy" className="h-4 w-4" />
//                 </button>
//                 <button type="button" className="text-white">
//                   <img src={noise} alt="Noise" className="h-5 w-5" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mode Description */}
//         <p className="text-gray-300 mb-4 font-medium">{mode.description}</p>

//         {/* Mode Parameters Table */}
//         <div className=" my-3">
//           <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">TYPE</Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.modeType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 SUB-MODE TYPE
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.subMode}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 PLATFORM TYPE
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.platformType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 THREAT TYPE
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.threatType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 FREQ TYPE
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.frequencyType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 PRI TYPE
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.priType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 STAGGER LEVEL
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.priStaggerLevel || "-"}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 PW TYPE
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.pwType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 DISP RANGE EST
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.rangeEstimation}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 LETHAL RANGE
//               </Label>
//               <div className="py-2 rounded text-sm font-medium text-white">
//                 {mode.lethalRange}
//               </div>
//             </div>
//           </div>
//         </div>

//         {expandedStates[`${mode.modeId}_scan`] && (
//           <hr className=" border-gray-500" />
//         )}

//         {/* Scan Type Section */}
//         {expandedStates[`${mode.modeId}_scan`] && mode.modeScanDetails && (
//           <div className="my-4">
//             <div className="mb-4">
//               <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 gap-y-4">
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Scan Type
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.scanType || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Min Scan Sector
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.minScanSector || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Max Scan Sector
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.maxScanSector || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Min Scan Rate
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.minScanRate || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Max Scan Rate
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.maxScanRate || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Normal Scan Rate
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.normalScanRate || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Side Lobe Level
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.sideLobeLevel || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Side Lobe STD
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.sideLobeStd || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Min TOT
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.minTot || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Max TOT
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.maxTot || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Min Beam Width
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.minBeamWidth || "0"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                     Max Beam Width
//                   </Label>
//                   <div className="text-sm font-medium text-white">
//                     {mode.modeScanDetails[0]?.maxBeamWidth || "0"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {expandedStates[`${mode.modeId}_param`] && (
//           <hr className=" border-gray-500" />
//         )}

//         {/* EW Parameters Section */}
//         {expandedStates[`${mode.modeId}_param`] &&
//           mode.modeFrequencyDetails && (
//             <div className="my-4">
//               <p className="font-medium text-base uppercase mb-4">
//                 EW Parameters
//               </p>
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* FREQ Table */}
//                 <div className="bg-black/5 rounded overflow-hidden h-full">
//                   <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                     <div className="px-3 py-2">FREQ MIN</div>
//                     <div className="px-3 py-2">FREQ MAX</div>
//                     <div className="px-3 py-2">DEVIATION</div>
//                   </div>
//                   {mode.modeFrequencyDetails?.length > 0 ? (
//                     mode.modeFrequencyDetails.map((freq, idx) => (
//                       <div
//                         key={freq.id}
//                         className="grid grid-cols-3 text-gray-100 text-sm"
//                       >
//                         <div className="px-3 py-2">{freq.minFrequency}</div>
//                         <div className="px-3 py-2">{freq.maxFrequency}</div>
//                         <div className="px-3 py-2">{freq.deviation || "-"}</div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="rounded-sm p-4 flex items-center justify-center">
//                       <p className="text-gray-400 text-sm">
//                         No FREQ data available
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* PRI Table */}
//                 <div className="bg-black/5 rounded overflow-hidden h-full">
//                   <div className="grid grid-cols-4 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                     <div className="px-3 py-2">PRI MIN</div>
//                     <div className="px-3 py-2">PRI MAX</div>
//                     <div className="px-3 py-2">DEVIATION</div>
//                     <div className="px-3 py-2">STAGGER LEVEL</div>
//                   </div>
//                   {mode?.modePriDetails?.length > 0 ? (
//                     mode.modePriDetails.map((pri, idx) => (
//                       <div
//                         key={pri.id}
//                         className="grid grid-cols-4 text-gray-100 text-sm"
//                       >
//                         <div className="px-3 py-2">{pri.minPri}</div>
//                         <div className="px-3 py-2">{pri.minPri}</div>
//                         <div className="px-3 py-2">{pri.deviation || "-"}</div>
//                         <div className="px-3 py-2">
//                           {pri.staggerLevel || "200"}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="rounded-sm p-4 flex items-center justify-center">
//                       <p className="text-gray-400 text-sm">
//                         No PRI data available
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* PW Table */}
//                 <div className="bg-black/5 rounded overflow-hidden h-full">
//                   <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                     <div className="px-3 py-2">PW MIN</div>
//                     <div className="px-3 py-2">PW MAX</div>
//                     <div className="px-3 py-2">DEVIATION</div>
//                   </div>
//                   {mode.modePwDetails?.length > 0 ? (
//                     mode.modePwDetails.map((pw, idx) => (
//                       <div
//                         key={pw.id}
//                         className="grid grid-cols-3 text-gray-100 text-sm"
//                       >
//                         <div className="px-3 py-2">{pw.minPw}</div>
//                         <div className="px-3 py-2">{pw.maxPw}</div>
//                         <div className="px-3 py-2">{pw.deviation || "-"}</div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="  rounded-sm p-4 flex items-center justify-center">
//                       <p className="text-gray-400 text-sm">
//                         No PW data available
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//       </div>
//       {/* {!isLast && <Separator className="my-6 bg-gray-600" />} */}
//       {/* {index < modes.length - 1 && <Separator className="my-6 bg-gray-600" />} */}
//     </div>
//   );
// };

// const ModeCard = memo(ModeCardComponent);

// // Yup validation schemamodes
// const validationSchema = yup.object({
//   symbol: yup
//     .string()
//     // .oneOf(["NEW", "OLD"], "Symbol must be NEW or OLD")
//     .required("Symbol is required"),

//   foregroundColor: yup
//     .string()
//     .required("Foreground Color is required")
//     .matches(/^#[0-9A-F]{6}$/i, "Must be valid hex"),

//   backgroundColor: yup
//     .string()
//     .required("Background Color is required")
//     .matches(/^#[0-9A-F]{6}$/i, "Must be valid hex"),

//   emitterName: yup
//     .string()
//     .trim()
//     .min(3, "Name must be 3+ chars")
//     .max(50, "Name max 50 chars")
//     .required("Emitter Name is required"),

//   type: yup.string().required("Threat Type is required"),

//   latitude: yup
//     .string()
//     .required("Latitude is required")
//     .matches(/^-?\d{1,2}(?:\.\d+)?\s*[NSns]?$/, "Invalid Latitude"),

//   longitude: yup
//     .string()
//     .required("Longitude is required")
//     .matches(/^-?\d{1,3}(?:\.\d+)?\s*[EWew]?$/, "Invalid Longitude"),

//   description: yup.string().required("Description is required"),

//   isGroundOnly: yup.boolean().default(false),
//   isUnknown: yup.boolean().default(false),
// });

// export default function PFMGDbMgmtListing() {
//   const [isGroundOnly, setIsGroundOnly] = useState(false);
//   const [isUnknown, setIsUnknown] = useState(true);
//   const [expandedStates, setExpandedStates] = useState({});
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   // const platformId = searchParams.get("platformId");
//   const missionId = searchParams.get("missionId");
//   const emitterId = searchParams.get("emitterId");
//   const weaponId = searchParams.get("weaponId");

//   const sidebarData = useSidebarStore((s) => s.sidebarData);
//   const platformId = usePlatformIdStore((s) => s.platformId);
//   const [modes, setModes] = useState([]);
//   // const { weaponId } = useWeaponIdStore(); //  get from store
//   // Find emitter payload from sidebarData using emitterId
//   const emitterNode = useMemo(() => {
//     if (!emitterId || !Array.isArray(sidebarData)) return null;
//     const idStr = String(emitterId);
//     return (
//       sidebarData.find(
//         (item) => String(item.data?.emitterId ?? item.id) === idStr
//       ) || null
//     );
//   }, [sidebarData, emitterId]);
//   const emitterPayload = emitterNode?.data;
//   const setRefetchSidebarData = useSidebarStore((s) => s.setRefetchSidebarData);
//   const refetchSidebarData = useSidebarStore((s) => s.refetchSidebarData);
//   const setCreating = useSidebarStore((s) => s.setCreating);

//   // Sync modes from sidebar emitter payload when it changes
//   useEffect(() => {
//     if (emitterPayload && Array.isArray(emitterPayload.modes)) {
//       setModes(emitterPayload.modes);
//     } else {
//       setModes([]);
//     }
//   }, [emitterPayload]);

//   const getFormDefaultValues = () => ({
//     symbol: "",
//     foregroundColor: "#FFFFFF",
//     backgroundColor: "#1E90FF",
//     emitterName: "",
//     type: "",
//     latitude: "",
//     longitude: "",
//     description: "",
//     isGroundOnly: false,
//     isUnknown: false,
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty },
//     setValue,
//     watch,
//     reset,
//     getValues,
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//     defaultValues: getFormDefaultValues(),
//   });

//   // Handle form reset based on whether we're editing or creating new
//   useEffect(() => {
//     if (emitterId && emitterPayload) {
//       console.log("emitterPayload", emitterPayload.type);

//       reset(emitterPayload);
//       setIsGroundOnly(Boolean(emitterPayload.isGroundOnly));
//       setIsUnknown(Boolean(emitterPayload.isUnknown));
//     } else {
//       // Creating new emitter - reset to default values
//       const defaultValues = getFormDefaultValues();
//       reset(defaultValues);
//       setIsGroundOnly(false);
//       setIsUnknown(false);
//     }
//   }, [emitterId, emitterPayload, reset]);

//   // Watch form values for dynamic updates
//   const watchedValues = watch();

//   const emitterName = watch("emitterName");
//   useEffect(() => {
//     console.log("sidebarData", sidebarData);
//   }, [sidebarData]);

//   const onSubmit = async (formData) => {
//     console.log("Emitter formData:", formData);
//     const weaponId = searchParams.get("weaponId");
//     console.log(weaponId, "inside weapon id ");
//     const checkweaponId = searchParams.get("weapon");
//     try {
//       // Include weaponId in the payload
//       const payload = {
//         ...formData,
//         emitterId: emitterId || 0,
//         weaponId: weaponId || checkweaponId || 0, // use weaponId from store
//         dateCreated: new Date().toISOString(),
//         lastModified: new Date().toISOString(),
//       };

//       // Call backend API
//       const result = await saveEmitter(payload);

//       toast.success(result?.message || "Emitter saved successfully!", {
//         position: "top-center",
//       });

//       // Refresh sidebar and stop creating mode
//       setCreating(false, null);
//       setRefetchSidebarData(!refetchSidebarData);

//       // Navigate to the newly created emitter page
//       if (result?.payload?.emitterId) {
//         navigate(
//           `/mission-creation?weaponId=${weaponId}&emitterId=${result.payload.emitterId}&component=emitter`
//         );
//       }
//     } catch (err) {
//       console.error("Emitter save failed:", err);
//       toast.error("Failed to save emitter.", { position: "top-center" });
//       setCreating(false, null);
//     }
//   };

//   // Replace the existing toggleScanType function
//   const toggleScanType = useCallback((modeId) => {
//     setExpandedStates((prev) => ({
//       ...prev,
//       [`${modeId}_scan`]: !prev[`${modeId}_scan`],
//     }));
//   }, []);

//   // Replace the existing toggleEmParameter function
//   const toggleEmParameter = useCallback((modeId) => {
//     setExpandedStates((prev) => ({
//       ...prev,
//       [`${modeId}_param`]: !prev[`${modeId}_param`],
//     }));
//   }, []);

//   const detachMode = useCallback((modeId) => {
//     setModes((prevModes) => prevModes.filter((m) => m.modeId !== modeId));
//   }, []);

//   const handleAddMode = () => {
//     const queryParams = new URLSearchParams(location.search);
//     const component = queryParams.get("component");

//     if (weaponId) {
//       // Weapon → Emitter → Mode flow
//       setCreating(true, emitterId);
//       const searchParams = `?weaponId=${weaponId}&emitterId=${emitterId}&component=mode`;
//       navigate(`/mission-creation${searchParams}`);
//     } else if (!weaponId && emitterId) {
//       // Standalone Emitter → Mode flow
//       setCreating(true, emitterId);
//       const searchParams = `?emitterId=${emitterId}&component=mode`;
//       navigate(`/mission-creation${searchParams}`, {
//         state: { fromEntitySelection: true },
//       });
//     } else {
//       console.warn("Missing context: cannot add mode");
//     }
//   };

//   const onSaveIndependentEmitter = async () => {
//     const formData = getValues(); // get all form fields

//     try {
//       const emittersPayload = emitterId ? { ...formData, emitterId } : formData;

//       const result = await saveIndependentEmitter(emittersPayload);

//       toast.success(
//         result?.message || "Independent emitter saved successfully!",
//         { position: "top-center" }
//       );

//       // Optional: Refresh sidebar and exit creation mode
//       setCreating(false, null);
//       setRefetchSidebarData(!refetchSidebarData);

//       // Navigate to the emitter page if emitterId returned
//       if (result?.payload?.emitterId) {
//         // navigate(
//         //   `/mission-creation?emitterId=${result.payload.emitterId}&component=emitter`
//         // );

//         navigate(
//           `/mission-creation?component=emitter&emitterId=${result.payload.emitterId}`,
//           { state: { fromEntitySelection: true } }
//         );
//       }
//     } catch (err) {
//       console.error("Independent emitter save failed:", err);
//       toast.error("Failed to save independent emitter.", {
//         position: "top-center",
//       });
//       setCreating(false, null);
//     }
//   };

//   const checkweaponId = searchParams.get("weaponId");
//   useEffect(() => {
//     const loadEmitterData = async () => {
//       if (!emitterId) {
//         console.warn(
//           "[fetchEmitterTree] No emitterId provided, skipping API call."
//         );
//         return;
//       }

//       console.log(
//         "[fetchEmitterTree] Fetching emitter data for ID:",
//         emitterId
//       );
//       try {
//         let response;
//         if (checkweaponId) {
//           response = await fetchEmitterTree(emitterId);
//         } else {
//           response = await fetchEmitterStandloneTree(emitterId);
//         }
//         console.log("[fetchEmitterTree] Response received:", response);

//         if (response?.statusCode === 200 && response?.payload) {
//           const emitterData = response.payload;

//           console.log("[fetchEmitterTree] Parsed emitter data:", emitterData);

//           // --- Map backend keys to form field names ---
//           const mappedValues = {
//             symbol: emitterData.symbol || "",
//             foregroundColor:
//               emitterData.foregroundColor ||
//               emitterData.foreGroundColor ||
//               "#FFFFFF",
//             backgroundColor:
//               emitterData.backgroundColor ||
//               emitterData.backGroundColor ||
//               "#1E90FF",
//             emitterName:
//               emitterData.emitterName || emitterData.entityName || "",
//             type: emitterData.type || emitterData.threatType || "GROUND",
//             latitude: emitterData.latitude || "",
//             longitude: emitterData.longitude || "",
//             description: emitterData.description || "",
//             isGroundOnly: Boolean(emitterData.isGroundOnly),
//             isUnknown: Boolean(emitterData.isUnknown),
//           };

//           console.log("[fetchEmitterTree] Resetting form with:", mappedValues);

//           // --- Apply to form ---
//           reset(mappedValues);
//           setIsGroundOnly(mappedValues.isGroundOnly);
//           setIsUnknown(mappedValues.isUnknown);

//           // --- Sync modes ---
//           if (Array.isArray(emitterData.modes)) {
//             setModes(emitterData.modes);
//           }

//           console.log("[fetchEmitterTree] Final form after reset:", watch());
//         } else {
//           console.warn(
//             "[fetchEmitterTree] Unexpected response or no payload:",
//             response
//           );
//         }
//       } catch (err) {
//         console.error("[fetchEmitterTree] Error:", err);
//         toast.error("Failed to load emitter data.");
//       }
//     };

//     loadEmitterData();
//   }, [emitterId, reset]);

//   // top (already have this)

//   const location = useLocation();

//   // correct way in HashRouter:
//   const isMissionCreation = location.pathname === "/mission-creation";
//   const component = searchParams.get("component");

//   // hide when on mission-creation AND component=emitter
//   const hideButton = isMissionCreation && component === "emitter";

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="min-h-screen bg-[#414141] text-white p-6"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-start mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-white mb-2">
//             {emitterPayload?.emitterName ||
//               emitterPayload?.entityName ||
//               emitterName ||
//               "Untitled Emitter"}
//           </h1>
//           <p className="text-gray-300">
//             Add emitter details and modes to the emitter
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Button
//             type="button"
//             variant="outline"
//             className="bg-transparent border-[#C5BFFF] text-[#C5BFFF] hover:text-[#C5BFFF] hover:bg-transparent cursor-pointer rounded-[4px]"
//           >
//             Attach Mode
//           </Button>

//           <Button
//             type="button"
//             onClick={handleAddMode}
//             className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
//             disabled={!emitterId}
//           >
//             <Plus className="w-4 h-4" />
//             Add Mode
//           </Button>

//           {weaponId ? (
//             <Button
//               type="submit"
//               className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
//             >
//               Save
//             </Button>
//           ) : (
//             <Button
//               type="button"
//               onClick={onSaveIndependentEmitter}
//               className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
//             >
//               Save
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Emitter Details */}
//       <div className="rounded-lg mb-8 pr-[200px]">
//         {/* Create Symbol Section */}
//         <div className="flex gap-6 pb-6 mb-6 border-b border-[#fff]/10">
//           <div className="border border-dashed border-gray-600 rounded-lg p-2 flex justify-center items-center">
//             <div
//               className="rounded p-3 min-w-[96px] w-[96px] h-[96px] flex justify-center items-center"
//               style={{ backgroundColor: watch("backgroundColor") || "#262424" }}
//             >
//               <div
//                 className="font-mono text-lg"
//                 style={{ color: watch("foregroundColor") || "#00FF00" }}
//               >
//                 {watch("symbol") || "SYM"}
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
//             <div className="col-span-1 md:col-span-3 lg:col-span-5">
//               <Label className="block text-sm font-medium text-gray-300">
//                 Create Symbol
//               </Label>
//             </div>

//             <FormField
//               field={{
//                 symbol: formConfig.symbolDetails.symbol,
//               }}
//               register={register}
//               errors={errors}
//               watch={watchedValues}
//               setValue={setValue}
//             />
//             <FormField
//               field={{
//                 foregroundColor: formConfig.symbolDetails.foregroundColor,
//               }}
//               register={register}
//               errors={errors}
//               watch={watchedValues}
//               setValue={setValue}
//             />

//             <FormField
//               field={{
//                 backgroundColor: formConfig.symbolDetails.backgroundColor,
//               }}
//               register={register}
//               errors={errors}
//               watch={watchedValues}
//               setValue={setValue}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <FormField
//             field={{ emitterName: formConfig.emitterDetails.emitterName }}
//             register={register}
//             errors={errors}
//             watch={watchedValues}
//             setValue={setValue}
//           />
//           <div className="flex gap-8">
//             <ToggleField
//               name="isGroundOnly"
//               label="GROUND ONLY"
//               checked={isGroundOnly}
//               onCheckedChange={(checked) => {
//                 setIsGroundOnly(checked);
//                 setValue("isGroundOnly", checked, { shouldDirty: true });
//               }}
//               setValue={setValue}
//             />
//             <ToggleField
//               name="isUnknown"
//               label="IS UNKNOWN"
//               checked={isUnknown}
//               onCheckedChange={(checked) => {
//                 setIsUnknown(checked);
//                 setValue("isUnknown", checked, { shouldDirty: true });
//               }}
//               setValue={setValue}
//             />
//           </div>
//         </div>
//         <div className="flex items-center justify-between gap-6 mt-5">
//           {/* Threat Type (independent button group) */}
//           <div className="flex flex-col flex-1">
//             <Label className="block text-sm font-medium text-gray-300 mb-2">
//               Threat Type
//             </Label>
//             <div className="flex gap-3">
//               {["GROUND"].map((option) => (
//                 <Button
//                   key={option}
//                   type="button"
//                   onClick={() =>
//                     setValue("type", option.toUpperCase(), {
//                       shouldDirty: true,
//                       shouldValidate: true,
//                     })
//                   }
//                   className={`px-4 flex-1 py-2 rounded text-sm font-medium ${
//                     watch("type") === option
//                       ? "bg-[#7B70D6] text-white"
//                       : "bg-[#FFFFFF0D] text-gray-300"
//                   }`}
//                 >
//                   {option.charAt(0) + option.slice(1).toLowerCase()}
//                 </Button>
//               ))}
//             </div>
//             {errors.type && (
//               <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>
//             )}
//           </div>

//           {/* Location */}
//           <div className="flex-1">
//             <FormField
//               field={{ latitude: formConfig.emitterDetails.latitude }}
//               register={register}
//               errors={errors}
//               watch={watchedValues}
//               setValue={setValue}
//             />
//           </div>
//           <div className="flex-1">
//             <FormField
//               field={{ longitude: formConfig.emitterDetails.longitude }}
//               register={register}
//               errors={errors}
//               watch={watchedValues}
//               setValue={setValue}
//             />
//           </div>
//         </div>

//         <div className="pt-6 border-b pb-6 border-[#fff]/10">
//           <FormField
//             field={{ description: formConfig.emitterDetails.description }}
//             register={register}
//             errors={errors}
//             watch={watchedValues}
//             setValue={setValue}
//           />
//         </div>
//       </div>

//       {/* Modes Section */}
//       {emitterId && (
//         <div className="rounded-lg">
//           <div className=" w-full flex justify-between">
//             <h2 className="text-xl font-semibold mb-5 text-white">
//               MODES ({modes.length})
//             </h2>
//             <Button
//               type="button"
//               variant="ghost"
//               className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 cursor-pointer"
//             >
//               <img src={detach} alt="Detach" className="h-4 w-4" />
//               Detach All
//             </Button>
//           </div>

//           {Array.isArray(modes) &&
//             modes.map((mode, index) => (
//               <ModeCard
//                 key={mode.modeId || mode.id || index}
//                 mode={mode}
//                 index={index}
//                 totalModes={modes.length}
//                 toggleScanType={toggleScanType}
//                 toggleEmParameter={toggleEmParameter}
//                 detachMode={detachMode}
//                 expandedStates={expandedStates}
//               />
//             ))}
//         </div>
//       )}
//     </form>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { Switch } from "@/components/ui/switch";
import copy from "@/assets/images/copy.svg";
import detach from "@/assets/images/detach.svg";
import noise from "@/assets/images/noise.svg";
import { Eye, EyeOff, Volume2, Link, Plus, Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { usePlatformIdStore, useSidebarStore } from "../store/missionStore";
import { toast } from "react-toastify";
import {
  fetchEmitterStandloneTree,
  fetchEmitterTree,
  saveEmitter,
  saveIndependentEmitter,
} from "../services/AdroneServices";
import dayjs from "dayjs";

// Form field configurations
const formConfig = {
  symbolDetails: {
    symbol: {
      label: "Symbol",
      required: true,
      options: [
        { value: "NEW", label: "NEW" },
        { value: "OLD", label: "OLD" },
      ],
    },
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
  emitterDetails: {
    emitterName: { type: "input", label: "Emitter Name", required: true },
    type: {
      type: "select",
      label: "Threat Type",
      required: true,
      options: [
        { value: "GROUND", label: "Ground" },
        // Add other types if backend supports them
      ],
    },
    latitude: { type: "input", label: "Latitude", required: true },
    longitude: { type: "input", label: "Longitude", required: true },
    description: {
      type: "textarea",
      label: "Description",
      required: true,
      placeholder: "Enter emitter description...",
    },
  },
};

const FormField = ({
  field,
  register,
  errors,
  watch,
  setValue,
  control,
  onBlurEmitterName,
}) => {
  const fieldName = Object.keys(field)[0];
  const fieldConfig = field[fieldName];
  const { type, label, options, placeholder } = fieldConfig;

  const commonClasses = "bg-[#FFFFFF0D] border-black/10 text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const renderField = () => {
    switch (type) {
      case "select":
        // FIX: Use Controller to ensure Select validation works
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value || ""}>
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
            )}
          />
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
              {...register(fieldName)}
              className="w-[34px] h-[34px] rounded-lg cursor-pointer"
            />

            <input
              type="text"
              {...register(fieldName)}
              className="bg-transparent border-none outline-none text-white"
              placeholder="#123456"
              value={watch?.[fieldName] || "#123456"}
            />
          </div>
        );

      default:
        const { onChange, onBlur, name, ref } = register(fieldName);
        return (
          <Input
            name={name}
            ref={ref}
            className={commonClasses}
            onChange={onChange}
            onBlur={(e) => {
              onBlur(e);
              if (fieldName === "emitterName" && onBlurEmitterName) {
                const newName = e.target.value.trim() || "Emitter_Alpha";
                onBlurEmitterName(newName);
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
      onCheckedChange={(checked) => {
        onCheckedChange(checked);
        setValue(name, checked, { shouldDirty: true, shouldValidate: true });
      }}
      checkedText="YES"
      uncheckedText="NO"
      checkedBg="#C5BFFF"
      uncheckedBg="#A7A7A7"
      checkedThumb="bg-[#7B70D6]"
      uncheckedThumb="bg-[#545454]"
      checkedTextColor="text-[#313040]"
      uncheckedTextColor="text-[#545454]"
    />
  </div>
);

const ModeCardComponent = ({
  mode,
  index,
  modes,
  toggleScanType,
  toggleEmParameter,
  detachMode,
  expandedStates,
}) => {
  return (
    <div className="mb-6">
      <div className="rounded-lg bg-[#FFFFFF0D] p-4 px-6">
        {/* Mode Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`px-2 py-1 rounded text-xs font-bold text-white `}
              style={{
                backgroundColor: mode.bgColor || "#666",
                color: mode.fgColor || "#fff",
              }}
            >
              {mode.modeSymbol}
            </div>
            <h3 className="text-lg font-semibold text-white">
              {mode.modeName}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleScanType(mode.modeId)}
              className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
            >
              {expandedStates[`${mode.modeId}_scan`] ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {expandedStates[`${mode.modeId}_scan`]
                ? "HIDE SCAN TYPE"
                : "SHOW SCAN TYPE"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleEmParameter(mode.modeId)}
              className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
            >
              {expandedStates[`${mode.modeId}_param`] ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {expandedStates[`${mode.modeId}_param`]
                ? "HIDE EM PARAMETER"
                : "SHOW EM PARAMETER"}
            </Button>

            <p className="text-sm text-gray-300 font-medium mr-3">
              LAST EDITED{" "}
              <span className=" font-medium text-white text-base">
                {dayjs(mode.modifiedDate).format("DD MMM'YY HH:mm")}
              </span>
            </p>

            {expandedStates[`${mode.modeId}_scan`] ||
            expandedStates[`${mode.modeId}_param`] ? (
              <div className="flex gap-5 p-0">
                <button type="button" className="text-white">
                  <img src={noise} alt="Noise" className="h-5 w-5" />
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8"
                >
                  <img src={detach} alt="Detach" className="h-4 w-4" />
                  Detach
                </Button>
              </div>
            ) : (
              <div className="flex gap-5 p-0">
                <button type="button" className="text-white p-0">
                  <img src={detach} alt="Detach" className="h-4 w-4" />
                </button>
                <button type="button" className="text-white">
                  <img src={copy} alt="Copy" className="h-4 w-4" />
                </button>
                <button type="button" className="text-white">
                  <img src={noise} alt="Noise" className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mode Description */}
        <p className="text-gray-300 mb-4 font-medium">{mode.description}</p>

        {/* Mode Parameters Table */}
        <div className=" my-3">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
            <div>
              <Label className="block text-sm text-gray-300 mb-1">TYPE</Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.modeType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                SUB-MODE TYPE
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.subMode}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                PLATFORM TYPE
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.platformType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                THREAT TYPE
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.threatType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                FREQ TYPE
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.frequencyType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                PRI TYPE
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.priType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                STAGGER LEVEL
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.priStaggerLevel || "-"}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                PW TYPE
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.pwType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                DISP RANGE EST
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.rangeEstimation}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                LETHAL RANGE
              </Label>
              <div className="py-2 rounded text-sm font-medium text-white">
                {mode.lethalRange}
              </div>
            </div>
          </div>
        </div>

        {expandedStates[`${mode.modeId}_scan`] && (
          <hr className=" border-gray-500" />
        )}

        {/* Scan Type Section */}
        {expandedStates[`${mode.modeId}_scan`] && mode.modeScanDetails && (
          <div className="my-4">
            <div className="mb-4">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 gap-y-4">
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Scan Type
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.scanType || "N/A"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Min Scan Sector
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.minScanSector || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Max Scan Sector
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.maxScanSector || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Min Scan Rate
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.minScanRate || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Max Scan Rate
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.maxScanRate || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Normal Scan Rate
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.normalScanRate || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Side Lobe Level
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.sideLobeLevel || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Side Lobe STD
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.sideLobeStd || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Min TOT
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.minTot || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Max TOT
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.maxTot || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Min Beam Width
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.minBeamWidth || "0"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1 uppercase">
                    Max Beam Width
                  </Label>
                  <div className="text-sm font-medium text-white">
                    {mode.modeScanDetails[0]?.maxBeamWidth || "0"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {expandedStates[`${mode.modeId}_param`] && (
          <hr className=" border-gray-500" />
        )}

        {/* EW Parameters Section */}
        {expandedStates[`${mode.modeId}_param`] &&
          mode.modeFrequencyDetails && (
            <div className="my-4">
              <p className="font-medium text-base uppercase mb-4">
                EW Parameters
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* FREQ Table */}
                <div className="bg-black/5 rounded overflow-hidden h-full">
                  <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
                    <div className="px-3 py-2">FREQ MIN</div>
                    <div className="px-3 py-2">FREQ MAX</div>
                    <div className="px-3 py-2">DEVIATION</div>
                  </div>
                  {mode.modeFrequencyDetails?.length > 0 ? (
                    mode.modeFrequencyDetails.map((freq, idx) => (
                      <div
                        key={freq.id}
                        className="grid grid-cols-3 text-gray-100 text-sm"
                      >
                        <div className="px-3 py-2">{freq.minFrequency}</div>
                        <div className="px-3 py-2">{freq.maxFrequency}</div>
                        <div className="px-3 py-2">{freq.deviation || "-"}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-sm p-4 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">
                        No FREQ data available
                      </p>
                    </div>
                  )}
                </div>

                {/* PRI Table */}
                <div className="bg-black/5 rounded overflow-hidden h-full">
                  <div className="grid grid-cols-4 bg-[#393A3E] text-gray-100 text-sm font-medium">
                    <div className="px-3 py-2">PRI MIN</div>
                    <div className="px-3 py-2">PRI MAX</div>
                    <div className="px-3 py-2">DEVIATION</div>
                    <div className="px-3 py-2">STAGGER LEVEL</div>
                  </div>
                  {mode?.modePriDetails?.length > 0 ? (
                    mode.modePriDetails.map((pri, idx) => (
                      <div
                        key={pri.id}
                        className="grid grid-cols-4 text-gray-100 text-sm"
                      >
                        <div className="px-3 py-2">{pri.minPri}</div>
                        <div className="px-3 py-2">{pri.minPri}</div>
                        <div className="px-3 py-2">{pri.deviation || "-"}</div>
                        <div className="px-3 py-2">
                          {pri.staggerLevel || "-"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-sm p-4 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">
                        No PRI data available
                      </p>
                    </div>
                  )}
                </div>

                {/* PW Table */}
                <div className="bg-black/5 rounded overflow-hidden h-full">
                  <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
                    <div className="px-3 py-2">PW MIN</div>
                    <div className="px-3 py-2">PW MAX</div>
                    <div className="px-3 py-2">DEVIATION</div>
                  </div>
                  {mode.modePwDetails?.length > 0 ? (
                    mode.modePwDetails.map((pw, idx) => (
                      <div
                        key={pw.id}
                        className="grid grid-cols-3 text-gray-100 text-sm"
                      >
                        <div className="px-3 py-2">{pw.minPw}</div>
                        <div className="px-3 py-2">{pw.maxPw}</div>
                        <div className="px-3 py-2">{pw.deviation || "-"}</div>
                      </div>
                    ))
                  ) : (
                    <div className="  rounded-sm p-4 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">
                        No PW data available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
      {/* {!isLast && <Separator className="my-6 bg-gray-600" />} */}
      {/* {index < modes.length - 1 && <Separator className="my-6 bg-gray-600" />} */}
    </div>
  );
};

const ModeCard = memo(ModeCardComponent);

// Yup validation schemamodes
const validationSchema = yup.object({
  symbol: yup
    .string()
    // .oneOf(["NEW", "OLD"], "Symbol must be NEW or OLD")
    .required("Symbol is required"),

  foregroundColor: yup
    .string()
    .required("Foreground Color is required")
    .matches(/^#[0-9A-F]{6}$/i, "Must be valid hex"),

  backgroundColor: yup
    .string()
    .required("Background Color is required")
    .matches(/^#[0-9A-F]{6}$/i, "Must be valid hex"),

  emitterName: yup
    .string()
    .trim()
    .min(3, "Name must be 3+ chars")
    .max(50, "Name max 50 chars")
    .required("Emitter Name is required"),

  type: yup.string().required("Threat Type is required"),

  latitude: yup
    .string()
    .required("Latitude is required")
    .matches(/^-?\d{1,2}(?:\.\d+)?\s*[NSns]?$/, "Invalid Latitude"),

  longitude: yup
    .string()
    .required("Longitude is required")
    .matches(/^-?\d{1,3}(?:\.\d+)?\s*[EWew]?$/, "Invalid Longitude"),

  description: yup.string().required("Description is required"),

  isGroundOnly: yup.boolean().default(false),
  isUnknown: yup.boolean().default(false),
});

export default function PFMGDbMgmtListing() {
  const [isGroundOnly, setIsGroundOnly] = useState(false);
  const [isUnknown, setIsUnknown] = useState(true);
  const [expandedStates, setExpandedStates] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const platformId = searchParams.get("platformId");
  const missionId = searchParams.get("missionId");
  const emitterId = searchParams.get("emitterId");
  const weaponId = searchParams.get("weaponId");

  const sidebarData = useSidebarStore((s) => s.sidebarData);
  const platformId = usePlatformIdStore((s) => s.platformId);
  const [modes, setModes] = useState([]);
  // const { weaponId } = useWeaponIdStore(); //  get from store
  // emitter payload from sidebarData using emitterId
  const emitterNode = useMemo(() => {
    if (!emitterId || !Array.isArray(sidebarData)) return null;
    const idStr = String(emitterId);
    return (
      sidebarData.find(
        (item) => String(item.data?.emitterId ?? item.id) === idStr,
      ) || null
    );
  }, [sidebarData, emitterId]);
  const emitterPayload = emitterNode?.data;
  const setRefetchSidebarData = useSidebarStore((s) => s.setRefetchSidebarData);
  const refetchSidebarData = useSidebarStore((s) => s.refetchSidebarData);
  const setCreating = useSidebarStore((s) => s.setCreating);

  // Sync modes from sidebar emitter payload when it changes
  useEffect(() => {
    if (emitterPayload && Array.isArray(emitterPayload.modes)) {
      setModes(emitterPayload.modes);
    } else {
      setModes([]);
    }
  }, [emitterPayload]);

  const getFormDefaultValues = () => ({
    symbol: "",
    foregroundColor: "#FFFFFF",
    backgroundColor: "#1E90FF",
    emitterName: "",
    type: "GROUND", // Default to "GROUND" so validation passes immediately on load
    latitude: "",
    longitude: "",
    description: "",
    isGroundOnly: false,
    isUnknown: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
    getValues,
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: getFormDefaultValues(),
  });

  useEffect(() => {
    if (emitterId && emitterPayload) {
      console.log("emitterPayload", emitterPayload.type);

      reset(emitterPayload);
      setIsGroundOnly(Boolean(emitterPayload.isGroundOnly));
      setIsUnknown(Boolean(emitterPayload.isUnknown));
    } else {
      const defaultValues = getFormDefaultValues();
      reset(defaultValues);
      setIsGroundOnly(false);
      setIsUnknown(false);
    }
  }, [emitterId, emitterPayload, reset]);

  // Watch form values for dynamic updates
  const watchedValues = watch();

  const emitterName = watch("emitterName");
  useEffect(() => {
    console.log("sidebarData", sidebarData);
  }, [sidebarData]);

  const onSubmit = async (formData) => {
    console.log("Emitter formData:", formData);
    const weaponId = searchParams.get("weaponId");
    console.log(weaponId, "inside weapon id ");
    const checkweaponId = searchParams.get("weapon");
    try {
      // Include weaponId in the payload
      const payload = {
        ...formData,
        emitterId: emitterId || 0,
        weaponId: weaponId || checkweaponId || 0,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      // Call backend API
      const result = await saveEmitter(payload);

      toast.success(result?.message || "Emitter saved successfully!", {
        position: "top-center",
      });

      // Refresh sidebar and stop creating mode
      setCreating(false, null);
      setRefetchSidebarData(!refetchSidebarData);

      // Navigate to the newly created emitter page
      if (result?.payload?.emitterId) {
        navigate(
          `/mission-creation?weaponId=${weaponId}&emitterId=${result.payload.emitterId}&component=emitter`,
        );
      }
    } catch (err) {
      console.error("Emitter save failed:", err);
      toast.error("Failed to save emitter.", { position: "top-center" });
      setCreating(false, null);
    }
  };

  // Replace the existing toggleScanType function
  const toggleScanType = useCallback((modeId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [`${modeId}_scan`]: !prev[`${modeId}_scan`],
    }));
  }, []);

  // Replace the existing toggleEmParameter function
  const toggleEmParameter = useCallback((modeId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [`${modeId}_param`]: !prev[`${modeId}_param`],
    }));
  }, []);

  const detachMode = useCallback((modeId) => {
    setModes((prevModes) => prevModes.filter((m) => m.modeId !== modeId));
  }, []);

  const handleAddMode = () => {
    const queryParams = new URLSearchParams(location.search);
    const component = queryParams.get("component");

    if (weaponId) {
      // Weapon → Emitter → Mode flow
      setCreating(true, emitterId);
      const searchParams = `?weaponId=${weaponId}&emitterId=${emitterId}&component=mode`;
      navigate(`/mission-creation${searchParams}`);
    } else if (!weaponId && emitterId) {
      // Standalone Emitter → Mode flow
      setCreating(true, emitterId);
      const searchParams = `?emitterId=${emitterId}&component=mode`;
      navigate(`/mission-creation${searchParams}`, {
        state: { fromEntitySelection: true },
      });
    } else {
      console.warn("Missing context: cannot add mode");
    }
  };

  const onSaveIndependentEmitter = handleSubmit(async (formData) => {
    try {
      const emittersPayload = emitterId ? { ...formData, emitterId } : formData;

      const result = await saveIndependentEmitter(emittersPayload);

      toast.success(
        result?.message || "Independent emitter saved successfully!",
        { position: "top-center" },
      );

      // Optional: Refresh sidebar and exit creation mode
      setCreating(false, null);
      setRefetchSidebarData(!refetchSidebarData);

      // Navigate to the emitter page if emitterId returned
      if (result?.payload?.emitterId) {
        navigate(
          `/mission-creation?component=emitter&emitterId=${result.payload.emitterId}`,
          { state: { fromEntitySelection: true } },
        );
      }
    } catch (err) {
      console.error("Independent emitter save failed:", err);
      toast.error("Failed to save independent emitter.", {
        position: "top-center",
      });
      setCreating(false, null);
    }
  });

  const checkweaponId = searchParams.get("weaponId");
  useEffect(() => {
    const loadEmitterData = async () => {
      if (!emitterId) {
        console.warn(
          "[fetchEmitterTree] No emitterId provided, skipping API call.",
        );
        return;
      }

      console.log(
        "[fetchEmitterTree] Fetching emitter data for ID:",
        emitterId,
      );
      try {
        let response;
        if (checkweaponId) {
          response = await fetchEmitterTree(emitterId);
        } else {
          response = await fetchEmitterStandloneTree(emitterId);
        }
        console.log("[fetchEmitterTree] Response received:", response);

        if (response?.statusCode === 200 && response?.payload) {
          const emitterData = response.payload;

          console.log("[fetchEmitterTree] Parsed emitter data:", emitterData);

          // --- Map backend keys to form field names ---
          const mappedValues = {
            symbol: emitterData.symbol || "",
            foregroundColor:
              emitterData.foregroundColor ||
              emitterData.foreGroundColor ||
              "#FFFFFF",
            backgroundColor:
              emitterData.backgroundColor ||
              emitterData.backGroundColor ||
              "#1E90FF",
            emitterName:
              emitterData.emitterName || emitterData.entityName || "",
            type: emitterData.type || emitterData.threatType || "GROUND",
            latitude: emitterData.latitude || "",
            longitude: emitterData.longitude || "",
            description: emitterData.description || "",
            isGroundOnly: Boolean(emitterData.isGroundOnly),
            isUnknown: Boolean(emitterData.isUnknown),
          };

          console.log("[fetchEmitterTree] Resetting form with:", mappedValues);

          // --- Apply to form ---
          reset(mappedValues);
          setIsGroundOnly(mappedValues.isGroundOnly);
          setIsUnknown(mappedValues.isUnknown);

          // --- Sync modes ---
          if (Array.isArray(emitterData.modes)) {
            setModes(emitterData.modes);
          }

          console.log("[fetchEmitterTree] Final form after reset:", watch());
        } else {
          console.warn(
            "[fetchEmitterTree] Unexpected response or no payload:",
            response,
          );
        }
      } catch (err) {
        console.error("[fetchEmitterTree] Error:", err);
        toast.error("Failed to load emitter data.");
      }
    };

    loadEmitterData();
  }, [emitterId, reset]);

  // top (already have this)

  const location = useLocation();

  // correct way in HashRouter:
  const isMissionCreation = location.pathname === "/mission-creation";
  const component = searchParams.get("component");

  // hide when on mission-creation AND component=emitter
  const hideButton = isMissionCreation && component === "emitter";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-[#414141] text-white p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {emitterPayload?.emitterName ||
              emitterPayload?.entityName ||
              emitterName ||
              "Untitled Emitter"}
          </h1>
          <p className="text-gray-300">
            Add emitter details and modes to the emitter
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-transparent border-[#C5BFFF] text-[#C5BFFF] hover:text-[#C5BFFF] hover:bg-transparent cursor-pointer rounded-[4px]"
          >
            Attach Mode
          </Button>

          <Button
            type="button"
            onClick={handleAddMode}
            className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
            disabled={!emitterId}
          >
            <Plus className="w-4 h-4" />
            Add Mode
          </Button>

          {weaponId ? (
            <Button
              type="submit"
              className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
            >
              Save
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onSaveIndependentEmitter}
              className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
            >
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Emitter Details */}
      <div className="rounded-lg mb-8 pr-[200px]">
        {/* Create Symbol Section */}
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
                {watch("symbol") || "SYM"}
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
                symbol: formConfig.symbolDetails.symbol,
              }}
              register={register}
              control={control}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
            <FormField
              field={{
                foregroundColor: formConfig.symbolDetails.foregroundColor,
              }}
              register={register}
              control={control}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />

            <FormField
              field={{
                backgroundColor: formConfig.symbolDetails.backgroundColor,
              }}
              register={register}
              control={control}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            field={{ emitterName: formConfig.emitterDetails.emitterName }}
            register={register}
            control={control}
            errors={errors}
            watch={watchedValues}
            setValue={setValue}
          />
          <div className="flex gap-8">
            <ToggleField
              name="isGroundOnly"
              label="GROUND ONLY"
              checked={isGroundOnly}
              onCheckedChange={(checked) => {
                setIsGroundOnly(checked);
                setValue("isGroundOnly", checked, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              setValue={setValue}
            />
            <ToggleField
              name="isUnknown"
              label="IS UNKNOWN"
              checked={isUnknown}
              onCheckedChange={(checked) => {
                setIsUnknown(checked);
                setValue("isUnknown", checked, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              setValue={setValue}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-6 mt-5">
          <div className="flex flex-col flex-1">
            <Label className="block text-sm font-medium text-gray-300 mb-2">
              Threat Type
            </Label>
            <div className="flex gap-3">
              {["GROUND"].map((option) => (
                <Button
                  key={option}
                  type="button"
                  onClick={() =>
                    setValue("type", option.toUpperCase(), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={`px-4 flex-1 py-2 rounded text-sm font-medium ${
                    watch("type") === option
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

          {/* Location */}
          <div className="flex-1">
            <FormField
              field={{ latitude: formConfig.emitterDetails.latitude }}
              register={register}
              control={control}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
          </div>
          <div className="flex-1">
            <FormField
              field={{ longitude: formConfig.emitterDetails.longitude }}
              register={register}
              control={control}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
          </div>
        </div>

        <div className="pt-6 border-b pb-6 border-[#fff]/10">
          <FormField
            field={{ description: formConfig.emitterDetails.description }}
            register={register}
            control={control}
            errors={errors}
            watch={watchedValues}
            setValue={setValue}
          />
        </div>
      </div>

      {/* Modes Section */}
      {emitterId && (
        <div className="rounded-lg">
          <div className=" w-full flex justify-between">
            <h2 className="text-xl font-semibold mb-5 text-white">
              MODES ({modes.length})
            </h2>
            <Button
              type="button"
              variant="ghost"
              className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 cursor-pointer"
            >
              <img src={detach} alt="Detach" className="h-4 w-4" />
              Detach All
            </Button>
          </div>

          {Array.isArray(modes) &&
            modes.map((mode, index) => (
              <ModeCard
                key={mode.modeId || mode.id || index}
                mode={mode}
                index={index}
                totalModes={modes.length}
                toggleScanType={toggleScanType}
                toggleEmParameter={toggleEmParameter}
                detachMode={detachMode}
                expandedStates={expandedStates}
              />
            ))}
        </div>
      )}
    </form>
  );
}
