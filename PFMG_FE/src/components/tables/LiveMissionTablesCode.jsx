// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   themeQuartz,
// } from "ag-grid-community";
// import { Switch } from "@/components/ui/switch";
// import { AgGridReact } from "ag-grid-react";

// const myTheme = themeQuartz.withParams({
//   headerBackgroundColor: "#383A3E",
//   headerHeight: "40px",
//   textColor: "white",
//   backgroundColor: "#414141",
//   borderColor: "#545454",
// });

// const LiveMissionTablesCode = ({ telemetryData }) => {
//   console.log(telemetryData, "telllll");

//   const [selectedMode, setSelectedMode] = useState("auto");
//   const [dronesData, setDronesData] = useState([
//     {
//       id: 1,
//       name: "Drone_Alpha",
//       status: "Active",
//       statusColor: "#89CF9E",
//       statusTextColor: "#055B1F",
//       emitters: [
//         {
//           emitterId: "SB4 - 1.4 GHz",
//           frequency: 2450,
//           error: -24,
//           priority: "Low",
//           status: "Idle",
//           action: false,
//         },
//         {
//           emitterId: "SB4 - 1.4 GHz",
//           frequency: 2450,
//           error: -24,
//           priority: "High",
//           status: "Jamming",
//           action: true,
//         },
//         {
//           emitterId: "EMIT-001",
//           frequency: 2450,
//           error: -24,
//           priority: "Low",
//           status: "Idle",
//           action: false,
//         },
//         {
//           emitterId: "EMIT-001",
//           frequency: 2450,
//           error: -24,
//           priority: "Low",
//           status: "Idle",
//           action: false,
//         },
//       ],
//     },
//   ]);

//   const handleSwitchToggle = useCallback((droneId, emitterIndex, checked) => {
//     setDronesData((prev) =>
//       prev.map((drone) =>
//         drone.id === droneId
//           ? {
//               ...drone,
//               emitters: drone.emitters.map((emitter, i) =>
//                 i === emitterIndex ? { ...emitter, action: checked } : emitter
//               ),
//             }
//           : drone
//       )
//     );
//   }, []);

//   const getColumnDefs = useCallback(
//     (droneId) => [
//       { headerName: "Emitter Id", field: "emitterId" },
//       { headerName: "Frequency", field: "frequency" },
//       { headerName: "Both Sight Error", field: "error" },
//       {
//         headerName: "Priority",
//         field: "priority",
//         cellStyle: (params) =>
//           params.value === "High" ? { color: "#E32C44" } : { color: "#FFFFFF" },
//       },
//       { headerName: "Status", field: "status" },
//       {
//         headerName: "Action",
//         field: "action",
//         cellRenderer: (params) => {
//           const index = params.rowIndex;
//           return (
//             <Switch
//               checked={params.value}
//               onCheckedChange={(checked) =>
//                 handleSwitchToggle(droneId, index, checked)
//               }
//               checkedText="YES"
//               uncheckedText="NO"
//               checkedBg="#C5BFFF"
//               uncheckedBg="#A7A7A7"
//               checkedThumb="bg-[#7B70D6]"
//               uncheckedThumb="bg-[#545454]"
//               checkedTextColor="text-[#313040]"
//               uncheckedTextColor="text-[#545454]"
//             />
//           );
//         },
//       },
//     ],
//     [handleSwitchToggle]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       flex: 1,
//       resizable: true,
//       sortable: false,
//     }),
//     []
//   );

//   const theme = useMemo(() => {
//     return myTheme;
//   }, []);

//   const modes = [
//     { label: "Auto", value: "auto" },
//     { label: "Manual", value: "manual" },
//     { label: "All", value: "all" },
//   ];

//   return (
//     <div className="flex-1 border-[#545454] border-[2px] pl-[40px] pr-[20px] box-border overflow-y-auto">
//       <div className="pt-[20px] flex justify-between items-center">
//         <div className="flex gap-[10px] items-center">
//           <span className="text-white font-mono text-[16px]">
//             Jamming Authorization
//           </span>

//           <Select onValueChange={setSelectedMode}>
//             <SelectTrigger className="w-[221px] bg-[#4B4B4B] border-none text-white">
//               <SelectValue placeholder="Select mode" />
//             </SelectTrigger>
//             <SelectContent className="text-white bg-[#4B4B4B] border-none">
//               <SelectGroup>
//                 {modes.map((mode) => (
//                   <SelectItem key={mode.value} value={mode.value}>
//                     {mode.label}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>

//         <span className="text-white font-mono">{dronesData.length} Drones</span>
//       </div>

//       {/* Drone Tables */}
//       <div className="pt-[24px] flex flex-col gap-[24px] pb-[24px]">
//         {dronesData.map((drone) => (
//           <div
//             key={drone.id}
//             className="border-[#545454] border-[2px] rounded-[16px] h-[290px] p-[15px] flex flex-col"
//           >
//             {/* Header Row */}
//             <div className="flex items-center gap-[10px] mb-[10px]">
//               <span className="text-white text-[20px]">{drone.name}</span>
//               <div
//                 className="font-[14px] font-bold px-[12px] py-[6px] rounded-full"
//                 style={{
//                   backgroundColor: drone.statusColor,
//                   color: drone.statusTextColor,
//                 }}
//               >
//                 {drone.status}
//               </div>
//             </div>

//             {/* Grid Container */}
//             <div className="flex-1 min-h-0">
//               <AgGridReact
//                 rowData={drone.emitters}
//                 columnDefs={getColumnDefs(drone.id)}
//                 defaultColDef={defaultColDef}
//                 suppressCellFocus
//                 theme={theme}
//                 domLayout="autoHeight"
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LiveMissionTablesCode;
// -----------------------------------------------------------------------
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   themeQuartz,
// } from "ag-grid-community";
// import { Switch } from "@/components/ui/switch";
// import { AgGridReact } from "ag-grid-react";

// const myTheme = themeQuartz.withParams({
//   headerBackgroundColor: "#383A3E",
//   headerHeight: "40px",
//   textColor: "white",
//   backgroundColor: "#414141",
//   borderColor: "#545454",
// });

// const LiveMissionTablesCode = ({ telemetryData }) => {
//   console.log(telemetryData, "telemetry raw data");

//   const [selectedMode, setSelectedMode] = useState("auto");
//   const [dronesData, setDronesData] = useState([
//     {
//       id: 1,
//       name: "Drone_Alpha",
//       status: "Active",
//       statusColor: "#89CF9E",
//       statusTextColor: "#055B1F",
//       emitters: [],
//     },
//   ]);

//   // ✅ Transform telemetry data to emitters format
//   useEffect(() => {
//     if (telemetryData) {
//       console.log("Processing telemetry data:", telemetryData);

//       // Convert single object to array if needed
//       const dataArray = Array.isArray(telemetryData)
//         ? telemetryData
//         : [telemetryData];

//       // Transform backend data to emitters format
//       const transformedEmitters = dataArray.map((item, index) => ({
//         emitterId: item.EmitterId || `EMIT-${index}`,
//         frequency: item.Frequency || 0,
//         error: item.BoresightError || 0,
//         priority: "Low", // Default priority (can be calculated based on your logic)
//         status: item.Jammed ? "Jamming" : "Idle", // ✅ Jammed true = "Jamming", false = "Idle"
//         action: item.Jammed || false, // ✅ Set action based on Jammed status
//         detectionTime: item.DetectionTime,
//         latitude: item.Latitude,
//         longitude: item.Longitude,
//       }));

//       console.log("Transformed emitters:", transformedEmitters);

//       // Update Drone_Alpha with new emitters
//       setDronesData([
//         {
//           id: 1,
//           name: "Drone_Alpha",
//           status: "Active",
//           statusColor: "#89CF9E",
//           statusTextColor: "#055B1F",
//           emitters: transformedEmitters, // ✅ Dynamic emitters from WebSocket
//         },
//       ]);
//     }
//   }, [telemetryData]);

//   const handleSwitchToggle = useCallback((droneId, emitterIndex, checked) => {
//     setDronesData((prev) =>
//       prev.map((drone) =>
//         drone.id === droneId
//           ? {
//               ...drone,
//               emitters: drone.emitters.map((emitter, i) =>
//                 i === emitterIndex
//                   ? {
//                       ...emitter,
//                       action: checked,
//                       status: checked ? "Jamming" : "Idle", // Update status when toggling
//                     }
//                   : emitter
//               ),
//             }
//           : drone
//       )
//     );
//   }, []);

//   const getColumnDefs = useCallback(
//     (droneId) => [
//       {
//         headerName: "Emitter Id",
//         field: "emitterId",
//         flex: 1.2,
//       },
//       {
//         headerName: "Frequency",
//         field: "frequency",
//         flex: 0.8,
//         valueFormatter: (params) => {
//           return params.value ? `${params.value} MHz` : "0";
//         },
//       },
//       {
//         headerName: "Both Sight Error",
//         field: "error",
//         flex: 1,
//         valueFormatter: (params) => {
//           return params.value !== null && params.value !== undefined
//             ? `${params.value}`
//             : "N/A";
//         },
//       },
//       {
//         headerName: "Priority",
//         field: "priority",
//         flex: 0.7,
//         cellStyle: (params) =>
//           params.value === "High" ? { color: "#E32C44" } : { color: "#FFFFFF" },
//       },
//       {
//         headerName: "Status",
//         field: "status",
//         flex: 0.8,
//         cellStyle: (params) =>
//           params.value === "Jamming"
//             ? { color: "#E32C44", fontWeight: "bold" }
//             : { color: "#FFFFFF" },
//       },
//       {
//         headerName: "Action",
//         field: "action",
//         flex: 1,
//         cellRenderer: (params) => {
//           const index = params.rowIndex;
//           return (
//             <Switch
//               checked={params.value}
//               onCheckedChange={(checked) =>
//                 handleSwitchToggle(droneId, index, checked)
//               }
//               checkedText="YES"
//               uncheckedText="NO"
//               checkedBg="#C5BFFF"
//               uncheckedBg="#A7A7A7"
//               checkedThumb="bg-[#7B70D6]"
//               uncheckedThumb="bg-[#545454]"
//               checkedTextColor="text-[#313040]"
//               uncheckedTextColor="text-[#545454]"
//             />
//           );
//         },
//       },
//     ],
//     [handleSwitchToggle]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       flex: 1,
//       resizable: true,
//       sortable: false,
//     }),
//     []
//   );

//   const theme = useMemo(() => {
//     return myTheme;
//   }, []);

//   const modes = [
//     { label: "Auto", value: "auto" },
//     { label: "Manual", value: "manual" },
//     { label: "All", value: "all" },
//   ];

//   return (
//     <div className="flex-1 border-[#545454] border-[2px] pl-[40px] pr-[20px] box-border overflow-y-auto">
//       <div className="pt-[20px] flex justify-between items-center">
//         <div className="flex gap-[10px] items-center">
//           <span className="text-white font-mono text-[16px]">
//             Jamming Authorization
//           </span>

//           <Select onValueChange={setSelectedMode} value={selectedMode}>
//             <SelectTrigger className="w-[221px] bg-[#4B4B4B] border-none text-white">
//               <SelectValue placeholder="Select mode" />
//             </SelectTrigger>
//             <SelectContent className="text-white bg-[#4B4B4B] border-none">
//               <SelectGroup>
//                 {modes.map((mode) => (
//                   <SelectItem key={mode.value} value={mode.value}>
//                     {mode.label}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>

//         <span className="text-white font-mono">
//           {dronesData[0]?.emitters?.length || 0} Emitters
//         </span>
//       </div>

//       {/* Drone Tables */}
//       <div className="pt-[24px] flex flex-col gap-[24px] pb-[24px]">
//         {dronesData.map((drone) => (
//           <div
//             key={drone.id}
//             className="border-[#545454] border-[2px] rounded-[16px] p-[15px] flex flex-col"
//             style={{
//               // ✅ Dynamic height based on number of rows
//               minHeight: "290px",
//               maxHeight: "600px",
//             }}
//           >
//             {/* Header Row */}
//             <div className="flex items-center gap-[10px] mb-[10px]">
//               <span className="text-white text-[20px]">{drone.name}</span>
//               <div
//                 className="font-[14px] font-bold px-[12px] py-[6px] rounded-full"
//                 style={{
//                   backgroundColor: drone.statusColor,
//                   color: drone.statusTextColor,
//                 }}
//               >
//                 {drone.status}
//               </div>
//               <span className="text-[#BCBCBC] text-[14px] ml-[10px]">
//                 {drone.emitters.length} emitter
//                 {drone.emitters.length !== 1 ? "s" : ""}
//               </span>
//             </div>

//             {/* Grid Container */}
//             <div className="flex-1 min-h-0">
//               {drone.emitters.length > 0 ? (
//                 <AgGridReact
//                   rowData={drone.emitters}
//                   columnDefs={getColumnDefs(drone.id)}
//                   defaultColDef={defaultColDef}
//                   suppressCellFocus
//                   theme={theme}
//                   domLayout="autoHeight" // ✅ Auto-adjust height based on rows
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-[200px] text-[#BCBCBC]">
//                   Waiting for telemetry data...
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LiveMissionTablesCode;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { Switch } from "@/components/ui/switch";
import { AgGridReact } from "ag-grid-react";

const myTheme = themeQuartz.withParams({
  headerBackgroundColor: "#383A3E",
  headerHeight: "40px",
  textColor: "white",
  backgroundColor: "#414141",
  borderColor: "#545454",
});

const LiveMissionTablesCode = ({ telemetryData }) => {
  console.log(telemetryData, "telemetry raw data");

  const [selectedMode, setSelectedMode] = useState("auto");
  const [dronesData, setDronesData] = useState([
    {
      id: 1,
      name: "Drone_Alpha",
      status: "Active",
      statusColor: "#89CF9E",
      statusTextColor: "#055B1F",
      emitters: [],
    },
  ]);

  // ✅ Transform telemetry data to emitters format
  useEffect(() => {
    if (telemetryData) {
      console.log("Processing telemetry data:", telemetryData);

      // Convert single object to array if needed
      const dataArray = Array.isArray(telemetryData)
        ? telemetryData
        : [telemetryData];

      // Transform backend data to emitters format
      const transformedEmitters = dataArray.map((item, index) => ({
        emitterId: item.EmitterId || `EMIT-${index}`,
        frequency: item.Frequency || 0,
        error: item.BoresightError || 0,
        priority: "Low", // Default priority (can be calculated based on your logic)
        status: item.Jammed ? "Jamming" : "Idle", // ✅ Jammed true = "Jamming", false = "Idle"
        action: item.Jammed || false, // ✅ Set action based on Jammed status
        detectionTime: item.DetectionTime,
        latitude: item.Latitude,
        longitude: item.Longitude,
      }));

      console.log("Transformed emitters:", transformedEmitters);

      // Update Drone_Alpha with new emitters
      setDronesData([
        {
          id: 1,
          name: "Drone_Alpha",
          status: "Active",
          statusColor: "#89CF9E",
          statusTextColor: "#055B1F",
          emitters: transformedEmitters, // ✅ Dynamic emitters from WebSocket
        },
      ]);
    }
  }, [telemetryData]);

  const handleSwitchToggle = useCallback((droneId, emitterIndex, checked) => {
    setDronesData((prev) =>
      prev.map((drone) =>
        drone.id === droneId
          ? {
              ...drone,
              emitters: drone.emitters.map((emitter, i) =>
                i === emitterIndex
                  ? {
                      ...emitter,
                      action: checked,
                      status: checked ? "Jamming" : "Idle", // Update status when toggling
                    }
                  : emitter
              ),
            }
          : drone
      )
    );
  }, []);

  const getColumnDefs = useCallback(
    (droneId) => [
      {
        headerName: "Emitter Id",
        field: "emitterId",
        flex: 1.2,
      },
      {
        headerName: "Frequency",
        field: "frequency",
        flex: 0.8,
        valueFormatter: (params) => {
          return params.value ? `${params.value} MHz` : "0";
        },
      },
      {
        headerName: "Both Sight Error",
        field: "error",
        flex: 1,
        valueFormatter: (params) => {
          return params.value !== null && params.value !== undefined
            ? `${params.value}`
            : "N/A";
        },
      },
      {
        headerName: "Priority",
        field: "priority",
        flex: 0.7,
        cellStyle: (params) =>
          params.value === "High" ? { color: "#E32C44" } : { color: "#FFFFFF" },
      },
      {
        headerName: "Status",
        field: "status",
        flex: 0.8,
        cellStyle: (params) =>
          params.value === "Jamming"
            ? { color: "#E32C44", fontWeight: "bold" }
            : { color: "#FFFFFF" },
      },
      {
        headerName: "Action",
        field: "action",
        flex: 1,
        cellRenderer: (params) => {
          const index = params.rowIndex;
          return (
            <Switch
              checked={params.value}
              onCheckedChange={(checked) =>
                handleSwitchToggle(droneId, index, checked)
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
          );
        },
      },
    ],
    [handleSwitchToggle]
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      resizable: true,
      sortable: false,
    }),
    []
  );

  const theme = useMemo(() => {
    return myTheme;
  }, []);

  const modes = [
    { label: "Auto", value: "auto" },
    { label: "Manual", value: "manual" },
    { label: "All", value: "all" },
  ];

  return (
    <div className="flex-1 border-[#545454] border-[2px] pl-[40px] pr-[20px] box-border overflow-y-auto">
      <div className="pt-[20px] flex justify-between items-center">
        <div className="flex gap-[10px] items-center">
          <span className="text-white font-mono text-[16px]">
            Jamming Authorization
          </span>

          <Select onValueChange={setSelectedMode} value={selectedMode}>
            <SelectTrigger className="w-[221px] bg-[#4B4B4B] border-none text-white">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent className="text-white bg-[#4B4B4B] border-none">
              <SelectGroup>
                {modes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <span className="text-white font-mono">
          {dronesData[0]?.emitters?.length || 0} Emitters
        </span>
      </div>

      {/* Drone Tables */}
      <div className="pt-[24px] flex flex-col gap-[24px] pb-[24px]">
        {dronesData.map((drone) => (
          <div
            key={drone.id}
            className="border-[#545454] border-[2px] rounded-[16px] p-[15px] flex flex-col"
            style={{
              // ✅ Dynamic height based on number of rows
              minHeight: "290px",
              maxHeight: "600px",
            }}
          >
            {/* Header Row */}
            <div className="flex items-center gap-[10px] mb-[10px]">
              <span className="text-white text-[20px]">{drone.name}</span>
              <div
                className="font-[14px] font-bold px-[12px] py-[6px] rounded-full"
                style={{
                  backgroundColor: drone.statusColor,
                  color: drone.statusTextColor,
                }}
              >
                {drone.status}
              </div>
              <span className="text-[#BCBCBC] text-[14px] ml-[10px]">
                {drone.emitters.length} emitter
                {drone.emitters.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Grid Container */}
            <div className="flex-1 min-h-0">
              {drone.emitters.length > 0 ? (
                <AgGridReact
                  rowData={drone.emitters}
                  columnDefs={getColumnDefs(drone.id)}
                  defaultColDef={defaultColDef}
                  suppressCellFocus
                  theme={theme}
                  domLayout="autoHeight" // ✅ Auto-adjust height based on rows
                />
              ) : (
                <div className="flex items-center justify-center h-[200px] text-[#BCBCBC]">
                  Waiting for telemetry data...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMissionTablesCode;
