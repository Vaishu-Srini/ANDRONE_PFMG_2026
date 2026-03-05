// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useSidebarStore } from "@/store/missionStore";
// import { ModeDialog } from "@/components/mode-dialog";
// import { toast } from "react-toastify";
// import {
//   fetchModeTree,
//   fetchModeIndependentTree,
//   fetchStandaloneModeTree,
//   saveJammingToApi,
//   saveTargetPhaseApi,
//   deleteTargetPhaseApi,
// } from "../services/AdroneServices";
// import dayjs from "dayjs";
// import copy from "@/assets/images/copy.svg";
// import detach from "@/assets/images/detach.svg";
// import noise from "@/assets/images/noise.svg";
// import { Switch } from "../components/ui/switch";
// import JammingPlot from "../components/JammingPlot";
// import { yupResolver } from "@hookform/resolvers/yup";
// import closedEye from "@/assets/images/eyeClosed.png";
// import uploadFileIcon from "@/assets/images/uploadIcon.png";
// import saveButton from "@/assets/images/SaveButton.png";
// import zoomOutIcon from "@/assets/images/ico_zoomout.png";
// import { createJammingSchema } from "../config/jammingFormValidationSchema";
// import { calculatePhaseTimeInSeconds } from "@/utils/kinematics";
// import LoadScenarioModal from "@/components/LoadScenarioModal";

// const TECHNIQUES = [
//   { label: "RGPO/I", value: "RGPO_I" },
//   { label: "VGPO/I", value: "VGPO_I" },
//   { label: "CRVPO/I", value: "CRVPO_I" },
// ];

// // FormField Component
// const FormField = ({ field, register, errors, watch, setValue }) => {
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
//                 shouldValidate: true, // This ensures validation triggers on selection
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
//               className="w-[34px] h-[34px] rounded-lg cursor-pointer"
//               {...register(fieldName)} // Use register for native color input
//             />
//             <input
//               type="text"
//               className="bg-transparent border-none outline-none text-white"
//               placeholder="#123456"
//               {...register(fieldName)} // Use register so typing hex works too
//             />
//           </div>
//         );
//       default:
//         // STANDARD INPUT FIX: Removed manual onChange
//         return (
//           <Input
//             {...register(fieldName)}
//             className={commonClasses}
//             placeholder={placeholder || ""}
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

// const JammingRecForMode = () => {
//   const [searchParams] = useSearchParams();
//   const [expandedStates, setExpandedStates] = useState({});
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selected, setSelected] = useState("pullIn");
//   const [modeData, setModeData] = useState(null);
//   const [jammingEnabled, setJammingEnabled] = useState(true);
//   const [isLoadingMode, setIsLoadingMode] = useState(true);
//   const setRefetchSidebarData = useSidebarStore((s) => s.setRefetchSidebarData);

//   const modeId = searchParams.get("modeId");
//   const weaponId = searchParams.get("weaponId");
//   const jammingId = searchParams.get("jammingId");
//   const emitterId = searchParams.get("emitterId");
//   const navigate = useNavigate();
//   // React Hook Form setup
//   const {
//     register,
//     handleSubmit: handleFormSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//     reset,
//   } = useForm({
//     // jamming schema here
//     resolver: yupResolver(jammingSchema),
//     mode: "onChange",
//     defaultValues: {
//       technique: TECHNIQUES[0].value,
//       minRange: "",
//       maxRange: "",
//       rateOfChangeRange: "",
//       holdTime: "0",
//       stopTime: "0",
//       walkTime: "0",
//       minVelocity: "",
//       maxVelocity: "",
//       rateOfChangeVelocity: "",
//     },
//   });

//   const watchedValues = watch();
//   const technique = watch("technique");

//   // Toggle functions
//   const toggleScanType = () => {
//     setExpandedStates((prev) => ({ ...prev, scanType: !prev.scanType }));
//   };

//   const toggleEmParameter = () => {
//     setExpandedStates((prev) => ({ ...prev, emParameter: !prev.emParameter }));
//   };

//   // API call helper for saving jamming
//   async function saveJammingToApi(payload) {
//     let JAMMING_API_URL;

//     if (weaponId) {
//       JAMMING_API_URL = `${BASE_URL}Jamming/save`;
//     } else if (!weaponId && modeId && emitterId) {
//       JAMMING_API_URL = `${BASE_URL}Jamming/standalone/save`;
//     } else {
//       JAMMING_API_URL = `${BASE_URL}Jamming/independent/save`;
//     }

//     const res = await fetch(JAMMING_API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const text = await res.text().catch(() => "");
//     let json = null;
//     try {
//       json = text ? JSON.parse(text) : null;
//     } catch {
//       json = text;
//     }

//     if (!res.ok) {
//       throw new Error(`API error ${res.status}: ${JSON.stringify(json)}`);
//     }
//     return json;
//   }

//   const onSubmit = async (formData) => {
//     const requestPayload = {
//       jammingId: jammingId ? Number(jammingId) : 0,
//       techniqueName: `${String(formData.technique)}_${Date.now()}`,
//       techniqueType: String(formData.technique),
//       pullInOut: selected === "pullIn",
//       minRange: Number(formData.minRange),
//       maxRange: Number(formData.maxRange),
//       rateOfChangeOfRange: Number(formData.rateOfChangeRange),
//       minVelocity: Number(formData.minVelocity),
//       maxVelocity: Number(formData.maxVelocity),
//       rateOfChangeOfVelocity: Number(formData.rateOfChangeVelocity),
//       walkTime: String(formData.walkTime),
//       holdTime: String(formData.holdTime),
//       stopTime: String(formData.stopTime),
//       modeId: Number(modeData?.modeId),
//     };

//     try {
//       if (!modeData?.modeId) {
//         toast.error(
//           "No valid Mode found. Please save Mode before creating Jamming.",
//         );
//         return;
//       }

//       const apiResponse = await saveJammingToApi(requestPayload);

//       const backendMsg =
//         apiResponse?.message || "Jamming configuration saved successfully!";
//       const isSuccess = apiResponse?.success ?? true;

//       if (isSuccess) {
//         toast.success(backendMsg, { position: "top-center" });
//         setRefetchSidebarData(true);
//         loadModeData();
//         if (weaponId && emitterId && modeId) {
//           navigate(
//             `/mission-creation?weaponId=${weaponId}&emitterId=${emitterId}&modeId=${modeId}&jammingId=${apiResponse.payload.jammingId}&component=jamming`,
//           );
//         } else if (!weaponId && emitterId && modeId) {
//           navigate(
//             `/mission-creation?emitterId=${emitterId}&modeId=${modeId}&jammingId=${apiResponse.payload.jammingId}&component=jamming`,
//           );
//         } else if (!weaponId && !emitterId && modeId) {
//           navigate(
//             `/mission-creation?modeId=${modeId}&jammingId=${apiResponse.payload.jammingId}&component=jamming  `,
//           );
//         }
//       } else {
//         toast.error(backendMsg, { position: "top-center" });
//       }
//     } catch (err) {
//       console.error("Failed to save jamming config:", err);
//       const backendError =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to save jamming configuration.";
//       toast.error(backendError, { position: "top-center" });
//     }
//   };

//   // Load Mode Data from API
//   const loadModeData = async () => {
//     if (!modeId) {
//       setIsLoadingMode(false);
//       return;
//     }

//     setIsLoadingMode(true);

//     try {
//       let response;
//       if (weaponId && weaponId !== "null" && weaponId !== "undefined") {
//         response = await fetchModeTree(modeId);
//       } else if (
//         !weaponId &&
//         emitterId &&
//         emitterId !== "null" &&
//         emitterId !== "undefined"
//       ) {
//         response = await fetchStandaloneModeTree(modeId, emitterId);
//       } else {
//         response = await fetchModeIndependentTree(modeId);
//       }

//       const apiModeData = response?.payload || response;

//       if (!apiModeData) {
//         setIsLoadingMode(false);
//         return;
//       }

//       const mappedModeData = {
//         modeId: apiModeData.modeId || modeId,
//         modeSymbol: apiModeData.modeSymbol || "M",
//         modeName: apiModeData.modeName || `Mode-${modeId}`,
//         modeType: apiModeData.modeType || "SEARCH",
//         description: apiModeData.description || "Mode description",
//         platformType: apiModeData.platformType || "AIRCRAFT",
//         subMode: apiModeData.subMode || apiModeData.subModeType || "STT",
//         threatType: apiModeData.threatType || "FOE",
//         testType: apiModeData.testType || "Functional",
//         rangeEstimation: apiModeData.rangeEstimation || "EIRP",
//         eirpValue: apiModeData.eirpValue || 0,
//         lethalRange: apiModeData.lethalRange || 0,
//         frequencyType: apiModeData.frequencyType || "FIXED",
//         priType: apiModeData.priType || "FIXED",
//         priStaggerLevel: apiModeData.priStaggerLevel || "",
//         pwType: apiModeData.pwType || "FIXED",
//         fgColor: apiModeData.fgColor || "#FFFFFF",
//         bgColor: apiModeData.bgColor || "#000000",
//         modifiedDate: apiModeData.lastModified || new Date().toISOString(),
//         jammings: apiModeData.jammings || [],
//         modeScanDetails: apiModeData.modeScanDetails || [],
//         modeFrequencyDetails: apiModeData.modeFrequencyDetails || [],
//         modePriDetails: apiModeData.modePriDetails || [],
//         modePwDetails: apiModeData.modePwDetails || [],
//       };

//       setModeData(mappedModeData);

//       // Auto-fill jamming form if jammingId is in URL
//       if (jammingId && apiModeData.jammings?.length) {
//         const selectedJamming = apiModeData.jammings.find(
//           (j) => String(j.jammingId) === String(jammingId),
//         );

//         if (selectedJamming) {
//           reset({
//             technique: selectedJamming.techniqueType || TECHNIQUES[0].value,
//             minRange: String(selectedJamming.minRange ?? "1"),
//             maxRange: String(selectedJamming.maxRange ?? "1"),
//             rateOfChangeRange: String(
//               selectedJamming.rateOfChangeOfRange ?? "0",
//             ),
//             holdTime: String(selectedJamming.holdTime ?? "0"),
//             stopTime: String(selectedJamming.stopTime ?? "0"),
//             walkTime: String(selectedJamming.walkTime ?? "0"),
//             minVelocity: String(selectedJamming.minVelocity ?? "0"),
//             maxVelocity: String(selectedJamming.maxVelocity ?? "0"),
//             rateOfChangeVelocity: String(
//               selectedJamming.rateOfChangeOfVelocity ?? "0",
//             ),
//           });
//           setSelected(selectedJamming.pullInOut ? "pullIn" : "pullOff");
//         }
//       } else {
//         // Reset form for new jamming
//         reset({
//           technique: TECHNIQUES[0].value,
//           minRange: "",
//           maxRange: "",
//           rateOfChangeRange: "",
//           holdTime: "",
//           stopTime: "",
//           walkTime: "",
//           minVelocity: "",
//           maxVelocity: "",
//           rateOfChangeVelocity: "",
//         });
//         setSelected("pullIn");
//       }
//     } catch (err) {
//       console.error("Error loading Mode Tree:", err);
//       toast.error("Failed to load mode data");
//     } finally {
//       setIsLoadingMode(false);
//     }
//   };

//   useEffect(() => {
//     loadModeData();
//   }, [modeId, jammingId]);

//   if (isLoadingMode) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-[#414141]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-white">Loading Jamming data…</p>
//         </div>
//       </div>
//     );
//   }

//   if (!modeData) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-[#414141]">
//         <p className="text-white text-lg">No mode data available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#414141] text-gray-100 min-h-screen">
//       {/* Header Section */}
//       <div className="flex justify-between items-start p-10 pb-6">
//         <div>
//           <h1 className="text-3xl font-semibold text-gray-200 mb-2">
//             Jamming Response Recommendation
//           </h1>
//           <p className="text-gray-300">
//             Add jamming techniques and parameters to the mode
//           </p>
//         </div>
//         <div className=" flex items-center gap-2">
//           <span className="uppercase">Jamming</span>
//           <Switch
//             checked={jammingEnabled}
//             onCheckedChange={(checked) => {
//               setJammingEnabled(checked);
//             }}
//             checkedText="YES"
//             uncheckedText="NO"
//             checkedBg="#C5BFFF"
//             uncheckedBg="#A7A7A7"
//             checkedThumb="bg-[#7B70D6]"
//             uncheckedThumb="bg-[#545454]"
//             checkedTextColor="text-[#313040]"
//             uncheckedTextColor="text-[#545454]"
//           />
//         </div>
//       </div>

//       {/* Mode Section */}
//       {modeId && modeData && (
//         <div className="mx-10 mb-6">
//           <div
//             onClick={() => setIsDialogOpen(true)}
//             className="rounded-lg bg-[#FFFFFF0D] p-4 px-6 cursor-pointer hover:bg-[#FFFFFF15] transition-colors"
//           >
//             {/* Mode Header */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div
//                   className="px-2 py-1 rounded text-xs font-bold text-white"
//                   style={{
//                     backgroundColor: modeData.bgColor || "#666",
//                     color: modeData.fgColor || "#fff",
//                   }}
//                 >
//                   {modeData.modeSymbol}
//                 </div>
//                 <h3 className="text-lg font-semibold text-white">
//                   {modeData.modeName}
//                 </h3>
//               </div>

//               <div className="flex items-center gap-4 text-sm">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleScanType();
//                   }}
//                   className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
//                 >
//                   {expandedStates.scanType ? (
//                     <EyeOff className="w-4 h-4" />
//                   ) : (
//                     <Eye className="w-4 h-4" />
//                   )}
//                   {expandedStates.scanType
//                     ? "HIDE SCAN TYPE"
//                     : "SHOW SCAN TYPE"}
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="ghost"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleEmParameter();
//                   }}
//                   className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
//                 >
//                   {expandedStates.emParameter ? (
//                     <EyeOff className="w-4 h-4" />
//                   ) : (
//                     <Eye className="w-4 h-4" />
//                   )}
//                   {expandedStates.emParameter
//                     ? "HIDE EM PARAMETER"
//                     : "SHOW EM PARAMETER"}
//                 </Button>

//                 <p className="text-sm text-gray-300 font-medium mr-3">
//                   LAST EDITED{" "}
//                   <span className="font-medium text-white text-base">
//                     {dayjs(modeData.modifiedDate).format("DD MMM'YY HH:mm")}
//                   </span>
//                 </p>

//                 {expandedStates.scanType || expandedStates.emParameter ? (
//                   <div className="flex gap-5 p-0">
//                     <button
//                       type="button"
//                       className="text-white"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <img src={noise} alt="Noise" className="h-5 w-5" />
//                     </button>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       onClick={(e) => e.stopPropagation()}
//                       className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8"
//                     >
//                       <img src={detach} alt="Detach" className="h-4 w-4" />
//                       Detach
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="flex gap-5 p-0">
//                     <button
//                       type="button"
//                       className="text-white p-0"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <img src={detach} alt="Detach" className="h-4 w-4" />
//                     </button>
//                     <button
//                       type="button"
//                       className="text-white"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <img src={copy} alt="Copy" className="h-4 w-4" />
//                     </button>
//                     <button
//                       type="button"
//                       className="text-white"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <img src={noise} alt="Noise" className="h-5 w-5" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Mode Description */}
//             <p className="text-gray-300 mb-4 font-medium">
//               {modeData.description}
//             </p>

//             {/* Mode Parameters */}
//             <div className="my-3">
//               <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     TYPE
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.modeType}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     SUB-MODE TYPE
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.subMode}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     PLATFORM TYPE
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.platformType}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     THREAT TYPE
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.threatType}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     FREQ TYPE
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.frequencyType}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     PRI TYPE
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.priType}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     STAGGER LEVEL
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.priStaggerLevel || "-"}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     PW TYPE
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.pwType}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     DISP RANGE EST
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.rangeEstimation}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="block text-sm text-gray-300 mb-1">
//                     LETHAL RANGE
//                   </Label>
//                   <div className="py-2 rounded text-sm font-medium text-white">
//                     {modeData.lethalRange}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {expandedStates.scanType && <hr className="border-gray-500" />}

//             {/* Scan Type Section */}
//             {expandedStates.scanType &&
//               modeData.modeScanDetails?.length > 0 && (
//                 <div className="my-4">
//                   <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 gap-y-4">
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Scan Type
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.scanType || "N/A"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Min Scan Sector
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.minScanSector || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Max Scan Sector
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.maxScanSector || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Min Scan Rate
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.minScanRate || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Max Scan Rate
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.maxScanRate || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Normal Scan Rate
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.normalScanRate || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Side Lobe Level
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.sideLobeLevel || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Side Lobe STD
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.sideLobeStd || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Min TOT
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.minTot || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Max TOT
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.maxTot || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Min Beam Width
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.minBeamWidth || "0"}
//                       </div>
//                     </div>
//                     <div>
//                       <Label className="block text-sm text-gray-300 mb-1 uppercase">
//                         Max Beam Width
//                       </Label>
//                       <div className="text-sm font-medium text-white">
//                         {modeData.modeScanDetails[0]?.maxBeamWidth || "0"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//             {expandedStates.emParameter && <hr className="border-gray-500" />}

//             {/* EW Parameters Section */}
//             {expandedStates.emParameter && (
//               <div className="my-4">
//                 <p className="font-medium text-base uppercase mb-4">
//                   EW Parameters
//                 </p>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   {/* FREQ Table */}
//                   <div className="bg-black/5 rounded overflow-hidden h-full">
//                     <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                       <div className="px-3 py-2">FREQ MIN</div>
//                       <div className="px-3 py-2">FREQ MAX</div>
//                       <div className="px-3 py-2">DEVIATION</div>
//                     </div>
//                     {modeData.modeFrequencyDetails?.length > 0 ? (
//                       modeData.modeFrequencyDetails.map((freq, idx) => (
//                         <div
//                           key={freq.id || idx}
//                           className="grid grid-cols-3 text-gray-100 text-sm"
//                         >
//                           <div className="px-3 py-2">{freq.minFrequency}</div>
//                           <div className="px-3 py-2">{freq.maxFrequency}</div>
//                           <div className="px-3 py-2">
//                             {freq.deviation || "-"}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-4 flex items-center justify-center">
//                         <p className="text-gray-400 text-sm">
//                           No FREQ data available
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* PRI Table */}
//                   <div className="bg-black/5 rounded overflow-hidden h-full">
//                     <div className="grid grid-cols-4 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                       <div className="px-3 py-2">PRI MIN</div>
//                       <div className="px-3 py-2">PRI MAX</div>
//                       <div className="px-3 py-2">DEVIATION</div>
//                       <div className="px-3 py-2">STAGGER</div>
//                     </div>
//                     {modeData.modePriDetails?.length > 0 ? (
//                       modeData.modePriDetails.map((pri, idx) => (
//                         <div
//                           key={pri.id || idx}
//                           className="grid grid-cols-4 text-gray-100 text-sm"
//                         >
//                           <div className="px-3 py-2">{pri.minPri}</div>
//                           <div className="px-3 py-2">{pri.maxPri}</div>
//                           <div className="px-3 py-2">
//                             {pri.deviation || "-"}
//                           </div>
//                           <div className="px-3 py-2">
//                             {pri.staggerLevel || "-"}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-4 flex items-center justify-center">
//                         <p className="text-gray-400 text-sm">
//                           No PRI data available
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* PW Table */}
//                   <div className="bg-black/5 rounded overflow-hidden h-full">
//                     <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                       <div className="px-3 py-2">PW MIN</div>
//                       <div className="px-3 py-2">PW MAX</div>
//                       <div className="px-3 py-2">DEVIATION</div>
//                     </div>
//                     {modeData.modePwDetails?.length > 0 ? (
//                       modeData.modePwDetails.map((pw, idx) => (
//                         <div
//                           key={pw.id || idx}
//                           className="grid grid-cols-3 text-gray-100 text-sm"
//                         >
//                           <div className="px-3 py-2">{pw.minPw}</div>
//                           <div className="px-3 py-2">{pw.maxPw}</div>
//                           <div className="px-3 py-2">{pw.deviation || "-"}</div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-4 flex items-center justify-center">
//                         <p className="text-gray-400 text-sm">
//                           No PW data available
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <hr className="bg-[#545454] h-px border-0 my-6 mx-10" />

//       {/* Deception Jamming Form */}
//       <form
//         onSubmit={handleFormSubmit(onSubmit)}
//         className="bg-[#414141] text-gray-100 p-8 rounded-lg mb-6"
//       >
//         {/* Two Column Layout: Form + Graph */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
//           {/* LEFT: Form Inputs */}
//           <div className="space-y-8">
//             <h2 className="text-xl font-semibold mb-8">Deception Jamming</h2>

//             <div className="flex flex-wrap items-end gap-6 mb-10">
//               {/* Technique Button Group */}
//               <div className="flex gap-5 items-end">
//                 <div className=" min-w-[200px]">
//                   <FormField
//                     field={{
//                       technique: {
//                         type: "select",
//                         label: "Technique",
//                         options: TECHNIQUES,
//                       },
//                     }}
//                     register={register}
//                     errors={errors}
//                     watch={watchedValues}
//                     setValue={setValue}
//                   />
//                 </div>
//                 <Button
//                   type="button"
//                   onClick={() => setSelected("pullIn")}
//                   className={`px-8 py-2 rounded-md ${
//                     selected === "pullIn" ? "bg-[#7B70D6]" : "bg-[#FFFFFF0D]"
//                   }`}
//                 >
//                   Pull In
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={() => setSelected("pullOff")}
//                   className={`px-8 py-2 rounded-md ${
//                     selected === "pullOff" ? "bg-[#7B70D6]" : "bg-[#FFFFFF0D]"
//                   }`}
//                 >
//                   Pull Off
//                 </Button>
//               </div>
//             </div>
//             {/* Range Fields - RGPO_I */}
//             {technique === "RGPO_I" && (
//               <div className="space-y-6">
//                 <h3 className="text-sm font-semibold text-gray-300 uppercase">
//                   Range Parameters
//                 </h3>
//                 <div className="grid grid-cols-3 gap-6">
//                   <FormField
//                     field={{
//                       minRange: { type: "input", label: "Min Range (m)" },
//                     }}
//                     register={register}
//                     errors={errors}
//                     watch={watchedValues}
//                     setValue={setValue}
//                   />
//                   <FormField
//                     field={{
//                       maxRange: { type: "input", label: "Max Range (m)" },
//                     }}
//                     register={register}
//                     errors={errors}
//                     watch={watchedValues}
//                     setValue={setValue}
//                   />
//                   <FormField
//                     field={{
//                       rateOfChangeRange: {
//                         type: "input",
//                         label: "Rate of Change of Range (m/sec)",
//                       },
//                     }}
//                     register={register}
//                     errors={errors}
//                     watch={watchedValues}
//                     setValue={setValue}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Velocity Fields - VGPO_I */}
//             {technique === "VGPO_I" && (
//               <div className="space-y-6">
//                 <h3 className="text-sm font-semibold text-gray-300 uppercase">
//                   Velocity Parameters
//                 </h3>
//                 <div className="grid grid-cols-3 gap-6">
//                   <FormField
//                     field={{
//                       minVelocity: {
//                         type: "input",
//                         label: "Min Velocity (m/s)",
//                       },
//                     }}
//                     register={register}
//                     errors={errors}
//                     watch={watchedValues}
//                     setValue={setValue}
//                   />
//                   <FormField
//                     field={{
//                       maxVelocity: {
//                         type: "input",
//                         label: "Max Velocity (m/s)",
//                       },
//                     }}
//                     register={register}
//                     errors={errors}
//                     watch={watchedValues}
//                     setValue={setValue}
//                   />
//                   <FormField
//                     field={{
//                       rateOfChangeVelocity: {
//                         type: "input",
//                         label: "Rate of Change of Velocity (m/s²)",
//                       },
//                     }}
//                     register={register}
//                     errors={errors}
//                     watch={watchedValues}
//                     setValue={setValue}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Combined Fields - CRVPO_I */}
//             {technique === "CRVPO_I" && (
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">
//                     Velocity Parameters
//                   </h3>
//                   <div className="grid grid-cols-3 gap-6">
//                     <FormField
//                       field={{
//                         minVelocity: {
//                           type: "input",
//                           label: "Min Velocity (m/s)",
//                         },
//                       }}
//                       register={register}
//                       errors={errors}
//                       watch={watchedValues}
//                       setValue={setValue}
//                     />
//                     <FormField
//                       field={{
//                         maxVelocity: {
//                           type: "input",
//                           label: "Max Velocity (m/s)",
//                         },
//                       }}
//                       register={register}
//                       errors={errors}
//                       watch={watchedValues}
//                       setValue={setValue}
//                     />
//                     <FormField
//                       field={{
//                         rateOfChangeVelocity: {
//                           type: "input",
//                           label: "Rate of Change of Velocity (m/s²)",
//                         },
//                       }}
//                       register={register}
//                       errors={errors}
//                       watch={watchedValues}
//                       setValue={setValue}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">
//                     Range Parameters
//                   </h3>
//                   <div className="grid grid-cols-3 gap-6">
//                     <FormField
//                       field={{
//                         minRange: { type: "input", label: "Min Range (m)" },
//                       }}
//                       register={register}
//                       errors={errors}
//                       watch={watchedValues}
//                       setValue={setValue}
//                     />
//                     <FormField
//                       field={{
//                         maxRange: { type: "input", label: "Max Range (m)" },
//                       }}
//                       register={register}
//                       errors={errors}
//                       watch={watchedValues}
//                       setValue={setValue}
//                     />
//                     <FormField
//                       field={{
//                         rateOfChangeRange: {
//                           type: "input",
//                           label: "Rate of Change of Range (m/sec)",
//                         },
//                       }}
//                       register={register}
//                       errors={errors}
//                       watch={watchedValues}
//                       setValue={setValue}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Timing Section */}
//             <div className="space-y-6">
//               <h3 className="text-sm font-semibold text-gray-300 uppercase">
//                 Timing Parameters
//               </h3>
//               <div className="grid grid-cols-3 gap-6">
//                 <FormField
//                   field={{
//                     holdTime: { type: "input", label: "Hold Time (s)" },
//                   }}
//                   register={register}
//                   errors={errors}
//                   watch={watchedValues}
//                   setValue={setValue}
//                 />
//                 <FormField
//                   field={{
//                     stopTime: { type: "input", label: "Stop Time (s)" },
//                   }}
//                   register={register}
//                   errors={errors}
//                   watch={watchedValues}
//                   setValue={setValue}
//                 />
//                 <FormField
//                   field={{
//                     walkTime: { type: "input", label: "Walk Time (s)" },
//                   }}
//                   register={register}
//                   errors={errors}
//                   watch={watchedValues}
//                   setValue={setValue}
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 pt-4">
//               <Button
//                 type="submit"
//                 className="bg-[#7165e0] hover:bg-[#7B70D6] px-6"
//               >
//                 {jammingId ? "Update Jamming Config" : "Save Jamming Config"}
//               </Button>

//               {jammingId && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="border-red-600 text-gray-300 hover:text-gray-200 bg-red-700 hover:bg-red-600"
//                   onClick={() => {
//                     const params = new URLSearchParams(searchParams);
//                     params.delete("jammingId");
//                     window.history.pushState({}, "", `?${params.toString()}`);
//                     loadModeData();
//                   }}
//                 >
//                   Cancel Edit
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* RIGHT: Graph Placeholder */}
//           <div className="bg-[#FFFFFF0D] rounded-lg p-6 mt-0">
//             <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase">
//               {technique === "RGPO_I"
//                 ? "RGPO/I"
//                 : technique === "VGPO_I"
//                   ? "VGPO/I"
//                   : "CRVPO/I"}{" "}
//               Visualization
//             </h3>
//             <div className="bg-[#2C2D30] border border-white/10 rounded-lg h-[400px] flex items-center justify-center p-2">
//               <JammingPlot
//                 technique={technique}
//                 pullInOut={selected}
//                 values={{
//                   minRange: watch("minRange"),
//                   maxRange: watch("maxRange"),
//                   rateOfChangeRange: watch("rateOfChangeRange"),
//                   minVelocity: watch("minVelocity"),
//                   maxVelocity: watch("maxVelocity"),
//                   rateOfChangeVelocity: watch("rateOfChangeVelocity"),
//                   walkTime: watch("walkTime"),
//                   holdTime: watch("holdTime"),
//                   stopTime: watch("stopTime"),
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </form>

//       {/* Mode Dialog */}
//       <ModeDialog
//         isOpen={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         mode={modeData}
//       />
//     </div>
//   );
// };

// export default JammingRecForMode;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeIcon, EyeOff, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSidebarStore } from "@/store/missionStore";
import { ModeDialog } from "@/components/mode-dialog";
import { toast } from "react-toastify";
import {
  fetchModeTree,
  fetchModeIndependentTree,
  fetchStandaloneModeTree,
  saveJammingToApi,
  saveTargetPhaseApi,
  deleteTargetPhaseApi,
  fetchStandaloneJamming,
} from "../services/AdroneServices";
import dayjs from "dayjs";
import copy from "@/assets/images/copy.svg";
import detach from "@/assets/images/detach.svg";
import noise from "@/assets/images/noise.svg";
import { Switch } from "../components/ui/switch";
import JammingPlot from "../components/JammingPlot";
import { yupResolver } from "@hookform/resolvers/yup";
import closedEye from "@/assets/images/AddIcon.svg";
import Eyes from "@/assets/images/Eye.svg";
import uploadFileIcon from "@/assets/images/uploadIcon.png";
import saveButton from "@/assets/images/SaveButton.png";
import zoomOutIcon from "@/assets/images/ico_zoomout.png";
import { createJammingSchema } from "../config/jammingFormValidationSchema";
import { calculatePhaseTimeInSeconds } from "@/utils/kinematics";
import LoadScenarioModal from "@/components/LoadScenarioModal";

// Updated defaults matching the spreadsheet provided
const DEFAULT_PHASE_VALUES = {
  targetDirection: "inbound",
  acceleration: "10",
  minVelocity: "100",
  maxVelocity: "500",
  minRange: "10",
  maxRange: "22",
  fixedDoppler: "NO",
  dopplerShift: "0",
  fixedPower: "NO",
  power: "0",
  selectedPhaseDuration: "10",
  rcsModel: "Swerling 0/V",
  rcsUpdateType: "auto",
  averageRcs: "1",
  rcsUpdateTime: "1",
  numberOfPulses: "10",
};

const FormField = ({
  field,
  register,
  errors,
  watch,
  setValue,
  onBlurOverride,
}) => {
  const fieldName = Object.keys(field)[0];
  const fieldConfig = field[fieldName];
  const { type, label, options, placeholder, unit, disabled, onUnitClick } =
    fieldConfig;

  const commonClasses =
    "bg-[#FFFFFF0D] border-black/10 text-white focus-visible:ring-[#7B70D6]";

  const { onChange, onBlur, name, ref } = register(fieldName);

  const handleBlur = (e) => {
    onBlur(e);
    if (onBlurOverride) onBlurOverride(e);
  };

  const renderField = () => {
    if (type === "select") {
      return (
        <Select
          value={watch[fieldName] || ""}
          onValueChange={(value) =>
            setValue(fieldName, value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          disabled={disabled}
        >
          <SelectTrigger
            className={`w-full ${commonClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="!bg-[#2C2D30] text-white border-[#545454]">
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return (
      <div className="relative">
        <Input
          name={name}
          ref={ref}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`${commonClasses} ${unit ? "pr-12" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          placeholder={placeholder || ""}
        />
        {unit && (
          <span
            onClick={onUnitClick}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider ${
              onUnitClick
                ? "cursor-pointer text-[#7B70D6] hover:text-white bg-[#7B70D6]/10 px-2 py-1 rounded transition-colors"
                : "text-gray-400"
            }`}
          >
            {unit}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </Label>
      {renderField()}
      {errors[fieldName] && (
        <p className="text-red-400 text-xs mt-1">{errors[fieldName].message}</p>
      )}
    </div>
  );
};

const JammingRecForMode = () => {
  const [searchParams] = useSearchParams();
  const [expandedStates, setExpandedStates] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modeData, setModeData] = useState(null);
  const [jammingEnabled, setJammingEnabled] = useState(true);
  const [isLoadingMode, setIsLoadingMode] = useState(true);
  const setRefetchSidebarData = useSidebarStore((s) => s.setRefetchSidebarData);

  // Graph state (Tabs & Modal)
  const [activeTab, setActiveTab] = useState("range");
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const [scenarioTimeUnit, setScenarioTimeUnit] = useState("Sec");
  // Global Units
  const [velUnit, setVelUnit] = useState("m/s");
  const [rangeUnit, setRangeUnit] = useState("km");
  const [freqUnit, setFreqUnit] = useState("kHz");
  const [timeUnit, setTimeUnit] = useState("ms");

  const currentSchema = React.useMemo(
    () => createJammingSchema({ velUnit, rangeUnit, freqUnit, timeUnit }),
    [velUnit, rangeUnit, freqUnit, timeUnit],
  );

  const [phases, setPhases] = useState([
    { id: Date.now().toString(), name: "Phase 1", data: DEFAULT_PHASE_VALUES },
  ]);
  const [activePhaseId, setActivePhaseId] = useState(phases[0].id);

  const modeId = searchParams.get("modeId");
  const weaponId = searchParams.get("weaponId");
  const jammingId = searchParams.get("jammingId");
  const emitterId = searchParams.get("emitterId");
  const navigate = useNavigate();
  const [showModeDetails, setShowModeDetails] = useState(true);

  // Safely check if IDs are real and not just the string "null"
  const hasMode = modeId && modeId !== "null" && modeId !== "undefined";
  const hasJamming =
    jammingId && jammingId !== "null" && jammingId !== "undefined";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(currentSchema),
    mode: "onChange",
    defaultValues: {
      scenarioName: "",
      scenarioTime: "",
      ...DEFAULT_PHASE_VALUES,
    },
  });

  const watchedValues = watch();
  const acc = Number(watch("acceleration")) || 0;
  const vel = Number(watch("minVelocity")) || 0;

  const showMaxVel = acc !== 0;
  const velLabel = acc === 0 ? "Velocity" : "Min Velocity";

  const showMaxRange = !(acc === 0 && vel === 0);
  const rangeLabel = acc === 0 && vel === 0 ? "Range" : "Min Range";

  const targetDir = watch("targetDirection");
  const fixedDop = watch("fixedDoppler");
  const fixedPow = watch("fixedPower");
  const rcsUpdate = watch("rcsUpdateType");
  const rcsModel = watch("rcsModel");

  // Fixed mapping for Pulses rendering (Roman Numerals)
  const showPulses = rcsModel === "Swerling II" || rcsModel === "Swerling IV";
  const showUpdateTime = rcsUpdate === "manual";

  const enforceMinMax = (minKey, maxKey) => {
    const minVal = Number(getValues(minKey));
    const maxVal = Number(getValues(maxKey));
    if (maxVal < minVal) {
      setValue(maxKey, minVal, { shouldValidate: true });
    }
  };

  const toggleScanType = () =>
    setExpandedStates((prev) => ({ ...prev, scanType: !prev.scanType }));
  const toggleEmParameter = () =>
    setExpandedStates((prev) => ({ ...prev, emParameter: !prev.emParameter }));

  const handlePhaseSwitch = (newPhaseId) => {
    if (newPhaseId === activePhaseId) return;

    const currentData = getValues();
    setPhases((prevPhases) =>
      prevPhases.map((p) =>
        p.id === activePhaseId ? { ...p, data: currentData } : p,
      ),
    );

    const nextPhase = phases.find((p) => p.id === newPhaseId);
    if (nextPhase) {
      reset({
        ...nextPhase.data,
        scenarioName: currentData.scenarioName,
        scenarioTime: currentData.scenarioTime,
      });
      setActivePhaseId(newPhaseId);
    }
  };

  const addPhase = () => {
    if (phases.length >= 8) {
      toast.warning("Maximum of 8 phases allowed.", { position: "top-center" });
      return;
    }

    const currentData = getValues();
    const newId = Date.now().toString();

    setPhases((prev) => {
      const updatedPrev = prev.map((p) =>
        p.id === activePhaseId ? { ...p, data: currentData } : p,
      );
      return [
        ...updatedPrev,
        {
          id: newId,
          name: `Phase ${updatedPrev.length + 1}`,
          data: DEFAULT_PHASE_VALUES,
        },
      ];
    });

    reset({
      ...DEFAULT_PHASE_VALUES,
      scenarioName: currentData.scenarioName,
      scenarioTime: currentData.scenarioTime,
    });
    setActivePhaseId(newId);
  };

  const deletePhase = async (idToDelete, e) => {
    e.stopPropagation();
    if (phases.length <= 1) {
      toast.warning("You must have at least one phase.", {
        position: "top-center",
      });
      return;
    }

    // Front-end generated IDs are Date.now() (13+ characters long).
    // DB IDs are usually small numbers (e.g. 1, 4, 12).
    const isSavedInDb = String(idToDelete).length < 10;

    if (isSavedInDb) {
      try {
        await deleteTargetPhaseApi({
          phaseId: idToDelete,
          weaponId,
          emitterId,
          modeId,
        });

        toast.success("Phase deleted from database.", {
          position: "top-center",
        });
        setRefetchSidebarData(true);
      } catch (err) {
        toast.error("Failed to delete phase from database.", {
          position: "top-center",
        });
        return; // Stop the local deletion if the API fails
      }
    }
    // Proceed to remove it from the local UI state
    setPhases((prev) => {
      const filtered = prev.filter((p) => String(p.id) !== String(idToDelete));

      // Rename remaining phases sequentially (Phase 1, Phase 2, etc.)
      const reindexed = filtered.map((p, index) => ({
        ...p,
        name: `Phase ${index + 1}`,
      }));

      // If the user deleted the phase they were currently looking at
      if (String(idToDelete) === String(activePhaseId)) {
        const currentData = getValues();

        // Auto-fill the form with the data of the first remaining phase
        reset({
          ...reindexed[0].data,
          scenarioName: currentData.scenarioName,
          scenarioTime: currentData.scenarioTime,
          scenarioTimeDisplay: currentData.scenarioTimeDisplay,
        });
        setActivePhaseId(reindexed[0].id);
      }
      return reindexed;
    });
  };

  // UNIFIED MASTER SAVE FUNCTION
  const handleMasterSave = async (dataOrEvent) => {
    // Prevent default form behavior if triggered via click event
    if (dataOrEvent && dataOrEvent.preventDefault) {
      dataOrEvent.preventDefault();
    }

    const formData = getValues();

    // If we have a modeId in the URL, enforce modeData. Otherwise, allow Flow 4 independent jamming flow.
    if (hasMode && !modeData?.modeId) {
      toast.error("No valid Mode found.", { position: "top-center" });
      return;
    }

    // Sync the active phase data with the correct form data
    const finalPhases = phases.map((p) =>
      p.id === activePhaseId ? { ...p, data: formData } : p,
    );

    try {
      // =========================================================
      // STEP 1: SAVE JAMMING SCENARIO FIRST (To get ID & Save Time)
      // =========================================================
      const jammingPayload = {
        jammingId: jammingId ? Number(jammingId) : 0,
        modeId: modeData?.modeId ? Number(modeData.modeId) : 0,
        independentModeId: modeData?.modeId ? Number(modeData.modeId) : 0,
        scenarioName: formData.scenarioName,
        scenarioTime: String(formData.scenarioTime),
        jammingName: formData.scenarioName,
      };

      const jammingResponse = await saveJammingToApi({
        payload: jammingPayload,
        weaponId,
        modeId,
        emitterId,
      });

      // Extract the ID generated (or updated) by the database
      const activeJammingId =
        jammingResponse?.payload?.jammingId || jammingResponse?.jammingId;

      if (!activeJammingId) {
        throw new Error("Failed to retrieve Jamming ID from backend.");
      }

      // =========================================================
      // STEP 2: USE THE NEW ID TO SAVE ALL PHASES (SEQUENTIALLY)
      // =========================================================

      // Create a copy of the phases to update their IDs after saving
      let updatedPhases = [...finalPhases];
      let newActivePhaseId = activePhaseId;

      for (let i = 0; i < updatedPhases.length; i++) {
        let p = updatedPhases[i];

        // DICTIONARY: Safely map UI Dropdown Options to backend Enums
        const rcsToApiMap = {
          "Swerling 0/V": "Swerling0_V",
          "Swerling I": "SwerlingI",
          "Swerling II": "SwerlingII",
          "Swerling III": "SwerlingIII",
          "Swerling IV": "SwerlingIV",
        };

        let formattedRcs = rcsToApiMap[p.data.rcsModel] || "Swerling0_V";

        const phasePayload = {
          phaseId: String(p.id).length > 10 ? 0 : Number(p.id),
          phaseName: p.name,
          targetDirection: p.data.targetDirection === "inbound",
          acceleration: Number(p.data.acceleration) || 0,
          velocityUnit: velUnit,
          minVelocity: Number(p.data.minVelocity) || 0,
          maxVelocity: Number(p.data.maxVelocity) || 0,
          rangeUnit: rangeUnit,
          minRange: Number(p.data.minRange) || 0,
          maxRange: Number(p.data.maxRange) || 0,
          fixedDoppler: p.data.fixedDoppler === "YES",
          dopplerShiftUnit: freqUnit,
          dopplerShift: Number(p.data.dopplerShift) || 0,
          fixedPower: p.data.fixedPower === "YES",
          powerUnit: "dBm",
          power: Number(p.data.power) || 0,
          selectedPhaseDuration: Number(p.data.selectedPhaseDuration) || 0,
          rcsModel: formattedRcs,
          averageRcs: Number(p.data.averageRcs) || 0,
          rcsUpdateType: p.data.rcsUpdateType === "auto",
          rcsUpdateUnit: timeUnit,
          rcsUpdateTime: Number(p.data.rcsUpdateTime) || 0,
          noOfPulsesPerScan: Number(p.data.numberOfPulses) || 0,
          jammingId: Number(activeJammingId),
        };

        // Await each save
        const phaseResponse = await saveTargetPhaseApi({
          payload: phasePayload,
          weaponId,
          emitterId,
          modeId,
        });

        const dbPhaseId =
          phaseResponse?.payload?.phaseId || phaseResponse?.phaseId;

        if (dbPhaseId && String(p.id).length > 10) {
          updatedPhases[i].id = String(dbPhaseId);

          // If the phase we just saved was the one actively being viewed, update activePhaseId too
          if (activePhaseId === p.id) {
            newActivePhaseId = String(dbPhaseId);
          }
        }
      }

      // Sync the fixed IDs back to React state!
      setPhases(updatedPhases);
      setActivePhaseId(newActivePhaseId);
      // return saveTargetPhaseApi({ payload: phasePayload });

      toast.success("Scenario Details and Phases saved successfully!", {
        position: "top-center",
      });

      setRefetchSidebarData(true);

      // =========================================================
      // STEP 3: UPDATE URL WITH NEW JAMMING ID (Triggers Auto-fill)
      // =========================================================
      const baseQuery = `modeId=${modeId}&jammingId=${activeJammingId}&component=jamming`;

      if (weaponId && emitterId) {
        navigate(
          `/mission-creation?weaponId=${weaponId}&emitterId=${emitterId}&${baseQuery}`,
        );
      } else if (emitterId) {
        navigate(`/mission-creation?emitterId=${emitterId}&${baseQuery}`);
      } else {
        navigate(`/mission-creation?${baseQuery}`);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to save data.", {
        position: "top-center",
      });
    }
  };

  const loadModeData = async () => {
    if (!hasMode && !hasJamming) {
      setIsLoadingMode(false);
      return;
    }
    setIsLoadingMode(true);
    try {
      let response;
      let apiModeData = null;

      if (hasMode) {
        if (weaponId && weaponId !== "null" && weaponId !== "undefined")
          response = await fetchModeTree(modeId);
        else if (emitterId && emitterId !== "null" && emitterId !== "undefined")
          response = await fetchStandaloneModeTree(modeId, emitterId);
        else response = await fetchModeIndependentTree(modeId);

        apiModeData = response?.payload || response;
      }

      if (apiModeData) {
        setModeData({
          modeId: apiModeData.modeId || modeId,
          modeSymbol: apiModeData.modeSymbol || "M",
          modeName: apiModeData.modeName || `Mode-${modeId}`,
          modeType: apiModeData.modeType || "SEARCH",
          description: apiModeData.description || "Mode description",
          platformType: apiModeData.platformType || "AIRCRAFT",
          subMode: apiModeData.subMode || apiModeData.subModeType || "STT",
          threatType: apiModeData.threatType || "FOE",
          testType: apiModeData.testType || "Functional",
          rangeEstimation: apiModeData.rangeEstimation || "EIRP",
          eirpValue: apiModeData.eirpValue || 0,
          lethalRange: apiModeData.lethalRange || 0,
          frequencyType: apiModeData.frequencyType || "FIXED",
          priType: apiModeData.priType || "FIXED",
          priStaggerLevel: apiModeData.priStaggerLevel || "",
          pwType: apiModeData.pwType || "FIXED",
          fgColor: apiModeData.fgColor || "#FFFFFF",
          bgColor: apiModeData.bgColor || "#000000",
          modifiedDate: apiModeData.lastModified || new Date().toISOString(),
          jammings: apiModeData.jammings || [],
          modeScanDetails: apiModeData.modeScanDetails || [],
          modeFrequencyDetails: apiModeData.modeFrequencyDetails || [],
          modePriDetails: apiModeData.modePriDetails || [],
          modePwDetails: apiModeData.modePwDetails || [],
        });
      }

      let selectedJamming = null;

      if (hasJamming) {
        if (apiModeData && apiModeData.jammings?.length) {
          selectedJamming = apiModeData.jammings.find(
            (j) => String(j.jammingId) === String(jammingId),
          );
        } else if (!hasMode) {
          // FLOW 4: Fetch Independent Jamming directly!
          const jamResponse = await fetchStandaloneJamming(jammingId);
          selectedJamming = jamResponse?.payload || jamResponse;
        }
      }

      // Populate the form if we found jamming data
      if (selectedJamming) {
        const apiPhases = selectedJamming.targetPhases || [];

        if (apiPhases.length > 0) {
          if (apiPhases[0].velocityUnit) setVelUnit(apiPhases[0].velocityUnit);
          if (apiPhases[0].rangeUnit) setRangeUnit(apiPhases[0].rangeUnit);
          if (apiPhases[0].dopplerShiftUnit)
            setFreqUnit(apiPhases[0].dopplerShiftUnit);
          if (apiPhases[0].rcsUpdateUnit)
            setTimeUnit(apiPhases[0].rcsUpdateUnit);
        }

        const parsedPhases =
          apiPhases.length > 0
            ? apiPhases.map((phase, index) => {
                const rcsToUiMap = {
                  Swerling0_V: "Swerling 0/V",
                  SwerlingI: "Swerling I",
                  SwerlingII: "Swerling II",
                  SwerlingIII: "Swerling III",
                  SwerlingIV: "Swerling IV",
                };

                let rcsUiFormat = rcsToUiMap[phase.rcsModel] || "Swerling 0/V";

                return {
                  id: String(phase.phaseId || Date.now() + index),
                  name: phase.phaseName || `Phase ${index + 1}`,
                  data: {
                    targetDirection: phase.targetDirection
                      ? "inbound"
                      : "outbound",
                    acceleration: String(phase.acceleration ?? "0"),
                    minVelocity: String(phase.minVelocity ?? "0"),
                    maxVelocity: String(phase.maxVelocity ?? "0"),
                    minRange: String(phase.minRange ?? "0"),
                    maxRange: String(phase.maxRange ?? "0"),
                    fixedDoppler: phase.fixedDoppler ? "YES" : "NO",
                    dopplerShift: String(phase.dopplerShift ?? "0"),
                    fixedPower: phase.fixedPower ? "YES" : "NO",
                    power: String(phase.power ?? "0"),
                    selectedPhaseDuration: String(
                      phase.selectedPhaseDuration ?? "0",
                    ),
                    rcsModel: rcsUiFormat,
                    rcsUpdateType: phase.rcsUpdateType ? "auto" : "manual",
                    averageRcs: String(phase.averageRcs ?? "0"),
                    rcsUpdateTime: String(phase.rcsUpdateTime ?? "0"),
                    numberOfPulses: String(phase.noOfPulsesPerScan ?? "0"),
                  },
                };
              })
            : [
                {
                  id: Date.now().toString(),
                  name: "Phase 1",
                  data: DEFAULT_PHASE_VALUES,
                },
              ];

        setPhases(parsedPhases);
        setActivePhaseId(parsedPhases[0].id);
        setJammingEnabled(selectedJamming.jammingEnabled ?? true);

        const fetchedScenarioTime = Number(selectedJamming.scenarioTime) || 0;
        const displayTime =
          scenarioTimeUnit === "Min"
            ? fetchedScenarioTime / 60
            : fetchedScenarioTime;

        reset({
          scenarioName: selectedJamming.scenarioName || "",
          scenarioTime: String(fetchedScenarioTime),
          scenarioTimeDisplay: String(Number(displayTime.toFixed(3))),
          ...parsedPhases[0].data,
        });
      } else {
        // Setup default empty phase
        const initialId = Date.now().toString();
        setPhases([
          { id: initialId, name: "Phase 1", data: DEFAULT_PHASE_VALUES },
        ]);
        setActivePhaseId(initialId);
        reset({
          scenarioName: "",
          scenarioTime: "",
          scenarioTimeDisplay: "",
          ...DEFAULT_PHASE_VALUES,
        });
      }
    } catch (err) {
      toast.error("Failed to load mode data");
    } finally {
      setIsLoadingMode(false);
    }
  };

  // 1. AUTO-CALCULATE: Update the "Selected Phase Duration" for the active phase based on DSP math
  useEffect(() => {
    const acc = Number(watchedValues.acceleration) || 0;
    let minV = Number(watchedValues.minVelocity) || 0;
    let maxV = Number(watchedValues.maxVelocity) || 0;
    let minR = Number(watchedValues.minRange) || 0;
    let maxR = Number(watchedValues.maxRange) || 0;
    const dir = watchedValues.targetDirection;

    let mathMinV = velUnit === "kmph" ? minV / 3.6 : minV;
    let mathMaxV = velUnit === "kmph" ? maxV / 3.6 : maxV;
    let mathMinR = rangeUnit === "km" ? minR * 1000 : minR;
    let mathMaxR = rangeUnit === "km" ? maxR * 1000 : maxR;

    const calculatedPhaseTime = calculatePhaseTimeInSeconds(
      acc,
      mathMinV,
      mathMaxV,
      mathMinR,
      mathMaxR,
      dir,
    );

    if (calculatedPhaseTime > 0) {
      const cleanCalculatedTime = Number(calculatedPhaseTime.toFixed(3));

      if (Number(getValues("selectedPhaseDuration")) !== cleanCalculatedTime) {
        setValue("selectedPhaseDuration", String(cleanCalculatedTime), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [
    watchedValues.acceleration,
    watchedValues.minVelocity,
    watchedValues.maxVelocity,
    watchedValues.minRange,
    watchedValues.maxRange,
    watchedValues.targetDirection,
    velUnit,
    rangeUnit,
    setValue,
    getValues,
  ]);

  // 2. SUMMATION: Calculate "Scenario Time" by adding all Phase Durations & Update UI
  useEffect(() => {
    let totalTime = 0;

    const currentPhasesData = phases.map((p) =>
      p.id === activePhaseId ? watchedValues : p.data,
    );

    currentPhasesData.forEach((phase) => {
      totalTime += Number(phase.selectedPhaseDuration) || 0;
    });

    const cleanTotalTime = Number(totalTime.toFixed(3));

    let displayValue =
      scenarioTimeUnit === "Min" ? cleanTotalTime / 60 : cleanTotalTime;
    const cleanDisplayTime = Number(displayValue.toFixed(3));

    if (Number(getValues("scenarioTime")) !== cleanTotalTime) {
      setValue("scenarioTime", String(cleanTotalTime), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (Number(getValues("scenarioTimeDisplay")) !== cleanDisplayTime) {
      setValue("scenarioTimeDisplay", String(cleanDisplayTime), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [
    watchedValues.selectedPhaseDuration,
    phases,
    activePhaseId,
    scenarioTimeUnit,
    setValue,
    getValues,
  ]);

  useEffect(() => {
    loadModeData();
  }, [modeId, jammingId]);

  if (isLoadingMode) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#414141]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading Jamming data…</p>
        </div>
      </div>
    );
  }

  if (!modeData && hasMode) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#414141]">
        <p className="text-white text-lg">No mode data available</p>
      </div>
    );
  }
  // changes done by vaishnavi on 05-03-2026 {4:00pm}
  return (
    <div className="surface-active text-primary min-h-screen">
      <div className=" flex-between p-10 py-6">
        <div className="flex-col-gap-6">
          <h1 className="page-heading text-primary">
            Jamming_
            {modeData?.modeName || watchedValues.scenarioName || "Standalone"}
          </h1>
          <p className="text-secondary page-subheading">Add jamming parameters to the mode</p>
        </div>
        <div className="flex items-center gap-10">
          <div>
            <button
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowModeDetails(!showModeDetails)}
            >
              <img
                src={showModeDetails ? closedEye : Eyes}
                alt="Toggle View"
                className="w-6 h-6"
              />
              <p className="text-accent btn-text-sm">
                {showModeDetails ? "Hide Mode Details" : "Show Mode Details"}
              </p>
            </button>
          </div>
          <div className=" flex items-center gap-2">
            <span className="text-secondary mono-xs">Jamming</span>
            {/* vaishnavi added the className on 05-03-2026 {6:00pm}  */}
            <Switch
              checked={jammingEnabled}
              onCheckedChange={setJammingEnabled}
              checkedText="YES"
              uncheckedText="NO"
              checkedBg="#C5BFFF"
              uncheckedBg="#A7A7A7"
              checkedThumb="bg-[#7B70D6]"
              uncheckedThumb="bg-[#545454]"
              checkedTextColor="text-[#313040]"
              uncheckedTextColor="text-[#545454]"
               className="border-none h-6 w-16 btn-info-text text-black"
            />
          </div>
        </div>
      </div>

      {showModeDetails && modeId && modeData && (
        <div className="mx-10 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            onClick={() => setIsDialogOpen(true)}
            className="rounded-lg bg-[#FFFFFF0D] p-4 px-6 cursor-pointer hover:bg-[#FFFFFF15] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="px-2 py-1 rounded text-xs font-bold text-white"
                  style={{
                    backgroundColor: modeData.bgColor || "#666",
                    color: modeData.fgColor || "#fff",
                  }}
                >
                  {modeData.modeSymbol}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {modeData.modeName}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleScanType();
                  }}
                  className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
                >
                  {expandedStates.scanType ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {expandedStates.scanType
                    ? "HIDE SCAN TYPE"
                    : "SHOW SCAN TYPE"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEmParameter();
                  }}
                  className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
                >
                  {expandedStates.emParameter ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {expandedStates.emParameter
                    ? "HIDE EM PARAMETER"
                    : "SHOW EM PARAMETER"}
                </Button>
                <p className="text-sm text-gray-300 font-medium mr-3">
                  LAST EDITED{" "}
                  <span className="font-medium text-white text-base">
                    {dayjs(modeData.modifiedDate).format("DD MMM'YY HH:mm")}
                  </span>
                </p>

                {expandedStates.scanType || expandedStates.emParameter ? (
                  <div className="flex gap-5 p-0">
                    <button
                      type="button"
                      className="text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={noise} alt="Noise" className="h-5 w-5" />
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#c7c1f7] hover:text-white 
                      hover:bg-[#7B70D6] flex items-center gap-1 h-8"
                    >
                      <img src={detach} alt="Detach" className="h-4 w-4" />{" "}
                      Detach
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-5 p-0">
                    <button
                      type="button"
                      className="text-white p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={detach} alt="Detach" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={copy} alt="Copy" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={noise} alt="Noise" className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-300 mb-4 font-medium">
              {modeData.description}
            </p>
            <div className="my-3">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    TYPE
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.modeType}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    SUB-MODE TYPE
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.subMode}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    PLATFORM TYPE
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.platformType}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    THREAT TYPE
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.threatType}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    FREQ TYPE
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.frequencyType}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    PRI TYPE
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.priType}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    STAGGER LEVEL
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.priStaggerLevel || "-"}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    PW TYPE
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.pwType}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    DISP RANGE EST
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.rangeEstimation}
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-300 mb-1">
                    LETHAL RANGE
                  </Label>
                  <div className="py-2 rounded text-sm font-medium text-white">
                    {modeData.lethalRange}
                  </div>
                </div>
              </div>
            </div>

            {expandedStates.scanType && <hr className="border-gray-500" />}
            {expandedStates.scanType &&
              modeData.modeScanDetails?.length > 0 && (
                <div className="my-4">
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 gap-y-4">
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Scan Type
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.scanType || "N/A"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Min Scan Sector
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.minScanSector || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Max Scan Sector
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.maxScanSector || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Min Scan Rate
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.minScanRate || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Max Scan Rate
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.maxScanRate || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Normal Scan Rate
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.normalScanRate || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Side Lobe Level
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.sideLobeLevel || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Side Lobe STD
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.sideLobeStd || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Min TOT
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.minTot || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Max TOT
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.maxTot || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Min Beam Width
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.minBeamWidth || "0"}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-300 mb-1 uppercase">
                        Max Beam Width
                      </Label>
                      <div className="text-sm font-medium text-white">
                        {modeData.modeScanDetails[0]?.maxBeamWidth || "0"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {expandedStates.emParameter && <hr className="border-gray-500" />}
            {expandedStates.emParameter && (
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
                    {modeData.modeFrequencyDetails?.length > 0 ? (
                      modeData.modeFrequencyDetails.map((freq, idx) => (
                        <div
                          key={freq.id || idx}
                          className="grid grid-cols-3 text-gray-100 text-sm"
                        >
                          <div className="px-3 py-2">{freq.minFrequency}</div>
                          <div className="px-3 py-2">{freq.maxFrequency}</div>
                          <div className="px-3 py-2">
                            {freq.deviation || "-"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 flex items-center justify-center">
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
                      <div className="px-3 py-2">STAGGER</div>
                    </div>
                    {modeData.modePriDetails?.length > 0 ? (
                      modeData.modePriDetails.map((pri, idx) => (
                        <div
                          key={pri.id || idx}
                          className="grid grid-cols-4 text-gray-100 text-sm"
                        >
                          <div className="px-3 py-2">{pri.minPri}</div>
                          <div className="px-3 py-2">{pri.maxPri}</div>
                          <div className="px-3 py-2">
                            {pri.deviation || "-"}
                          </div>
                          <div className="px-3 py-2">
                            {pri.staggerLevel || "-"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 flex items-center justify-center">
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
                    {modeData.modePwDetails?.length > 0 ? (
                      modeData.modePwDetails.map((pw, idx) => (
                        <div
                          key={pw.id || idx}
                          className="grid grid-cols-3 text-gray-100 text-sm"
                        >
                          <div className="px-3 py-2">{pw.minPw}</div>
                          <div className="px-3 py-2">{pw.maxPw}</div>
                          <div className="px-3 py-2">{pw.deviation || "-"}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 flex items-center justify-center">
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
        </div>
      )}
{/* removed by vaishnavi in hr tag is h-px border-0 my-6 mx-10 on 05-003-2026 */}
      {/* <hr className="bg-[#545454] h-px border-0 my-6 mx-10" /> */}

      <form onSubmit={handleSubmit(handleMasterSave)} className="pb-10">
        <div className="flex items-center justify-between gap-6 mb-10 px-10">
          <div className="flex gap-5 items-center w-full max-w-2xl">
            <FormField
              field={{
                scenarioName: { type: "input", label: "Scenario Name" },
              }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />

            {/* Hidden real input so the API and validation stay untouched in Seconds */}
            <input type="hidden" {...register("scenarioTime")} />

            {/* The Visual Fake Input */}
            <FormField
              field={{
                scenarioTimeDisplay: {
                  type: "input",
                  label: "Scenario Time",
                  unit: scenarioTimeUnit,
                  disabled: true,
                  onUnitClick: () =>
                    setScenarioTimeUnit((prev) =>
                      prev === "Sec" ? "Min" : "Sec",
                    ),
                },
              }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
          </div>
          <div className="flex gap-5 items-center p-5">
            <LoadScenarioModal>
              <button type="button">
                <img src={uploadFileIcon} className="h-11" alt="Load" />
              </button>
            </LoadScenarioModal>
            <button
              type="submit"
              className="hover:opacity-80 transition-opacity"
            >
              <img src={saveButton} alt="Save" />
            </button>
          </div>
        </div>

        {/* Main Target Profile Graph */}
        <div className="bg-[#FFFFFF0D] p-6 mb-8 border border-[#545454]/50">
          <div className="flex items-center justify-between mb-4 relative h-10">
            {/* Left Title */}
            <h3 className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-semibold tracking-wider text-gray-200 uppercase font-mono">
              Target Profile
            </h3>

            {/* Centered Tabs */}
            <div className="flex justify-center w-full">
              <div className="flex bg-[#2C2D30] p-1 rounded-lg border border-[#545454]">
                <button
                  type="button"
                  onClick={() => setActiveTab("range")}
                  className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "range"
                      ? "bg-[#7B70D6] text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-[#FFFFFF0D]"
                  }`}
                >
                  Range
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("velocity")}
                  className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "velocity"
                      ? "bg-[#7B70D6] text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-[#FFFFFF0D]"
                  }`}
                >
                  Velocity
                </button>
              </div>
            </div>

            {/* Right Zoom Button */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => setIsGraphExpanded(true)}
                className="hover:opacity-80 transition-opacity"
              >
                <img src={zoomOutIcon} alt="expand button" />
              </button>
            </div>
          </div>

          <div className="bg-[#2C2D30] border border-white/10 rounded-lg h-[400px] w-full p-2">
            <JammingPlot
              activeTab={activeTab}
              velUnit={velUnit}
              rangeUnit={rangeUnit}
              phasesData={phases.map((p) =>
                p.id === activePhaseId ? watchedValues : p.data,
              )}
            />
          </div>
        </div>

        {/* Global Units Bar */}
        <div className="flex justify-center bg-[#37383b] items-center gap-4 mb-2 px-5 py-5 text-sm font-medium text-gray-300">
          <div className=" flex flex-row items-center justify-center gap-4">
            <span>Set The Units For The Phases</span>
            <div className="w-auto">
              <Select value={velUnit} onValueChange={setVelUnit}>
                <SelectTrigger className="bg-[#FFFFFF1A] border-none text-white h-8 focus:ring-[#7B70D6]">
                  <SelectValue placeholder="Velocity" />
                </SelectTrigger>
                <SelectContent className="bg-[#2C2D30] text-white border-[#545454]">
                  <SelectItem value="kmph">kmph</SelectItem>
                  <SelectItem value="m/s">m/s</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-24">
              <Select value={rangeUnit} onValueChange={setRangeUnit}>
                <SelectTrigger className="bg-[#FFFFFF1A] border-none text-white h-8 focus:ring-[#7B70D6]">
                  <SelectValue placeholder="Range" />
                </SelectTrigger>
                <SelectContent className="bg-[#2C2D30] text-white border-[#545454]">
                  <SelectItem value="km">km</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-24">
              <Select value={freqUnit} onValueChange={setFreqUnit}>
                <SelectTrigger className="bg-[#FFFFFF1A] border-none text-white h-8 focus:ring-[#7B70D6]">
                  <SelectValue placeholder="Freq" />
                </SelectTrigger>
                <SelectContent className="bg-[#2C2D30] text-white border-[#545454]">
                  <SelectItem value="Hz">Hz</SelectItem>
                  <SelectItem value="kHz">kHz</SelectItem>
                  <SelectItem value="MHz">MHz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-24">
              <Select value={timeUnit} onValueChange={setTimeUnit}>
                <SelectTrigger className="bg-[#FFFFFF1A] border-none text-white h-8 focus:ring-[#7B70D6]">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent className="bg-[#2C2D30] text-white border-[#545454]">
                  <SelectItem value="Sec">Sec</SelectItem>
                  <SelectItem value="ms">ms</SelectItem>
                  <SelectItem value="us">us</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="ml-auto">
            <button
              type="button"
              onClick={handleMasterSave}
              className="hover:opacity-80 transition-opacity"
            >
              <img src={saveButton} alt="Save" />
            </button>
          </div>
        </div>

        <div className="flex bg-[#37383b] shadow-xl overflow-hidden min-h-[500px]  -mt-2 border border-[#545454]">
          <div className="w-56 bg-[#37383b] border-r border-[#545454] flex flex-col ">
            <div className="flex items-center justify-between p-5 border-b border-[#545454]">
              <span className="text-sm font-semibold text-gray-300 tracking-wider">
                Jamming
              </span>
              <button
                type="button"
                onClick={addPhase}
                className="p-1 hover:bg-[#FFFFFF1A] rounded-md transition-colors"
              >
                <Plus className="w-5 h-5 text-[#7B70D6]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {phases.map((phase) => (
                <div
                  key={phase.id}
                  onClick={() => handlePhaseSwitch(phase.id)}
                  className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-all 
                    ${
                      activePhaseId === phase.id
                        ? "bg-[#4B4A5D] text-white border-l-2 border-[#7B70D6]"
                        : "text-gray-400 hover:bg-[#FFFFFF0D] border-l-2 border-transparent"
                    }`}
                >
                  <span className="text-sm font-medium">{phase.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {phases.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => deletePhase(phase.id, e)}
                        className="p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-8 space-y-10 bg-[#414141]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <FormField
                field={{
                  acceleration: {
                    type: "input",
                    label: "Acceleration",
                    unit: "m/s²",
                  },
                }}
                register={register}
                errors={errors}
                watch={watchedValues}
                setValue={setValue}
              />
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Direction
                </Label>
                <div className="flex gap-2 h-10 w-full max-w-sm">
                  <Button
                    type="button"
                    onClick={() =>
                      setValue("targetDirection", "inbound", {
                        shouldValidate: true,
                      })
                    }
                    className={`flex-1 h-full rounded-md transition-colors 
                      ${targetDir === "inbound" ? "bg-[#7B70D6] text-white" : "bg-[#FFFFFF1A] text-gray-300 hover:bg-[#FFFFFF2A]"}`}
                  >
                    Inbound
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      setValue("targetDirection", "outbound", {
                        shouldValidate: true,
                      })
                    }
                    className={`flex-1 h-full rounded-md transition-colors 
                      ${targetDir === "outbound" ? "bg-[#7B70D6] text-white" : "bg-[#FFFFFF1A] text-gray-300 hover:bg-[#FFFFFF2A]"}`}
                  >
                    Outbound
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-300 uppercase">
                Range Parameters
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <FormField
                  field={{
                    minVelocity: {
                      type: "input",
                      label: velLabel,
                      unit: velUnit,
                    },
                  }}
                  register={register}
                  errors={errors}
                  watch={watchedValues}
                  setValue={setValue}
                  onBlurOverride={() =>
                    showMaxVel && enforceMinMax("minVelocity", "maxVelocity")
                  }
                />
                {showMaxVel && (
                  <FormField
                    field={{
                      maxVelocity: {
                        type: "input",
                        label: "Max Velocity",
                        unit: velUnit,
                      },
                    }}
                    register={register}
                    errors={errors}
                    watch={watchedValues}
                    setValue={setValue}
                    onBlurOverride={() =>
                      enforceMinMax("minVelocity", "maxVelocity")
                    }
                  />
                )}
                <FormField
                  field={{
                    minRange: {
                      type: "input",
                      label: rangeLabel,
                      unit: rangeUnit,
                    },
                  }}
                  register={register}
                  errors={errors}
                  watch={watchedValues}
                  setValue={setValue}
                  onBlurOverride={() =>
                    showMaxRange && enforceMinMax("minRange", "maxRange")
                  }
                />
                {showMaxRange && (
                  <FormField
                    field={{
                      maxRange: {
                        type: "input",
                        label: "Max Range",
                        unit: rangeUnit,
                      },
                    }}
                    register={register}
                    errors={errors}
                    watch={watchedValues}
                    setValue={setValue}
                    onBlurOverride={() => enforceMinMax("minRange", "maxRange")}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-start gap-16">
              <div className="flex flex-row gap-4 items-center">
                <div className="flex items-center gap-4 p-2">
                  <span className="uppercase text-sm font-medium text-gray-300 tracking-wider">
                    FIXED DOPPLER
                  </span>
                  <Switch
                    checked={fixedDop === "YES"}
                    onCheckedChange={(checked) =>
                      setValue("fixedDoppler", checked ? "YES" : "NO", {
                        shouldValidate: true,
                      })
                    }
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
                {fixedDop === "YES" && (
                  <div className="w-48 animate-in fade-in duration-200 -mt-8">
                    <FormField
                      field={{
                        dopplerShift: {
                          type: "input",
                          label: "Doppler Shift",
                          unit: freqUnit,
                        },
                      }}
                      register={register}
                      errors={errors}
                      watch={watchedValues}
                      setValue={setValue}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div className="flex items-center gap-4 p-2">
                  <span className="uppercase text-sm font-medium text-gray-300 tracking-wider">
                    FIXED POWER
                  </span>
                  <Switch
                    checked={fixedPow === "YES"}
                    onCheckedChange={(checked) =>
                      setValue("fixedPower", checked ? "YES" : "NO", {
                        shouldValidate: true,
                      })
                    }
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
                {fixedPow === "YES" && (
                  <div className="w-48 animate-in fade-in duration-200 -mt-7">
                    <FormField
                      field={{
                        power: { type: "input", label: "Power", unit: "dBm" },
                      }}
                      register={register}
                      errors={errors}
                      watch={watchedValues}
                      setValue={setValue}
                    />
                  </div>
                )}
              </div>
            </div>

            <hr className="border-[#545454]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <FormField
                field={{
                  selectedPhaseDuration: {
                    type: "input",
                    label: "Selected Phase Duration",
                    unit: "Sec",
                    disabled: true,
                  },
                }}
                register={register}
                errors={errors}
                watch={watchedValues}
                setValue={setValue}
              />
              <FormField
                field={{
                  rcsModel: {
                    type: "select",
                    label: "RCS Model",
                    options: [
                      { label: "Swerling 0/V", value: "Swerling 0/V" },
                      { label: "Swerling I", value: "Swerling I" },
                      { label: "Swerling II", value: "Swerling II" },
                      { label: "Swerling III", value: "Swerling III" },
                      { label: "Swerling IV", value: "Swerling IV" },
                    ],
                  },
                }}
                register={register}
                errors={errors}
                watch={watchedValues}
                setValue={setValue}
              />
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  RCS Update Type
                </Label>
                <div className="flex gap-2 h-10 w-full">
                  <Button
                    type="button"
                    onClick={() =>
                      setValue("rcsUpdateType", "auto", {
                        shouldValidate: true,
                      })
                    }
                    className={`flex-1 h-full rounded-md transition-colors 
                      ${
                        rcsUpdate === "auto"
                          ? "bg-[#7B70D6] text-white"
                          : "bg-[#FFFFFF1A] text-gray-300 hover:bg-[#FFFFFF2A]"
                      }`}
                  >
                    Auto
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      setValue("rcsUpdateType", "manual", {
                        shouldValidate: true,
                      })
                    }
                    className={`flex-1 h-full rounded-md transition-colors 
                      ${
                        rcsUpdate === "manual"
                          ? "bg-[#7B70D6] text-white"
                          : "bg-[#FFFFFF1A] text-gray-300 hover:bg-[#FFFFFF2A]"
                      }`}
                  >
                    Manual
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                field={{
                  averageRcs: {
                    type: "input",
                    label: "Average RCS",
                    unit: "m²",
                  },
                }}
                register={register}
                errors={errors}
                watch={watchedValues}
                setValue={setValue}
              />
              {showUpdateTime && (
                <FormField
                  field={{
                    rcsUpdateTime: {
                      type: "input",
                      label: "RCS Update Time",
                      unit: timeUnit,
                    },
                  }}
                  register={register}
                  errors={errors}
                  watch={watchedValues}
                  setValue={setValue}
                />
              )}
              {showPulses && (
                <FormField
                  field={{
                    numberOfPulses: {
                      type: "input",
                      label: "Number of Pulses Per Scan",
                    },
                  }}
                  register={register}
                  errors={errors}
                  watch={watchedValues}
                  setValue={setValue}
                />
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Expanded Graph Modal */}
      {isGraphExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center 
        bg-black/80 backdrop-blur-sm p-8 animate-in fade-in duration-200"
        >
          <div
            className="bg-[#2C2D30] border border-[#545454] rounded-xl 
          shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-6 relative h-10">
              <h2
                className="absolute left-0 top-1/2 -translate-y-1/2 text-xl 
              font-semibold text-gray-200 uppercase tracking-wider font-mono"
              >
                Expanded Target Profile
              </h2>

              <div className="flex justify-center w-full">
                <div className="flex bg-[#1E1F22] p-1 rounded-lg border border-[#545454]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("range")}
                    className={`px-10 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === "range"
                        ? "bg-[#7B70D6] text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-[#FFFFFF0D]"
                    }`}
                  >
                    Range
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("velocity")}
                    className={`px-10 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === "velocity"
                        ? "bg-[#7B70D6] text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-[#FFFFFF0D]"
                    }`}
                  >
                    Velocity
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGraphExpanded(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 
                text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 bg-[#1E1F22] border border-white/10 rounded-lg p-4 min-h-0">
              <JammingPlot
                activeTab={activeTab}
                velUnit={velUnit}
                rangeUnit={rangeUnit}
                phasesData={phases.map((p) =>
                  p.id === activePhaseId ? watchedValues : p.data,
                )}
              />
            </div>
          </div>
        </div>
      )}

      <ModeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        mode={modeData}
      />
    </div>
  );
};

export default JammingRecForMode;
