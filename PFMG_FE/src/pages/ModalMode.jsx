// // import React from 'react';
// // import { Label } from '../components/ui/label';
// // import modeDetails from '../json/mode_details.json';

// // const ModalModel = () => {
// //   return (
// //     <div className="min-h-screen bg-[#414141] text-gray-200">
// //       <div className='px-10 pt-10 pb-6'>
// //       {/* Header Section */}
// //       <div className="flex justify-between items-start mb-4">
// //         <div className="flex items-center gap-3">
// //           <div
// //             className="px-3 py-1 rounded text-sm font-medium"
// //             style={{
// //               backgroundColor: modeDetails.code.bgColor,
// //               color: modeDetails.code.fgColor
// //             }}
// //           >
// //             {modeDetails.code.symbol}
// //           </div>
// //           <h1 className="text-2xl font-semibold">{modeDetails.id}</h1>
// //         </div>
// //         <div className="flex items-center gap-2 text-gray-300 text-sm">
// //           <span>LAST EDITED {modeDetails.lastEdited}</span>
// //           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.793a1 1 0 011.617.793z" clipRule="evenodd" />
// //           </svg>
// //         </div>
// //       </div>

// //       {/* Description Section */}
// //       <div className="bg-[#414141] mb-8">
// //         <p className="text-gray-200 leading-relaxed">
// //           {modeDetails.description}
// //         </p>
// //       </div>

// //       {/* General Parameters Section */}
// //       <div className="bg-[#414141] ">
// //         <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">TYPE</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.type}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">SUB-MODE TYPE</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.subModeType}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">PLATFORM TYPE</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.platformType}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">THREAT TYPE</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.threatType}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">FREQ TYPE</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.freqType}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">PRI TYPE</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.priType}</div>
// //           </div>
// //         </div>
// //         <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mt-8">
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">STAGGER LEVEL</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.staggerLevel}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">PW TYPE</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.pwType}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">DISP RANGE EST</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.dispRangeEst}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-gray-300 mb-1">LETHAL RANGE</Label>
// //             <div className="bg-[#414141] py-2 rounded text-gray-100">{modeDetails.details.lethalRange}</div>
// //           </div>
// //         </div>
// //       </div>
// //       </div>

// //       {/* EW Parameters Section */}
// //       <div className="border border-white/10 px-10 py-5">
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* FREQ Table */}
// //           <div>
// //             <div className="bg-black/5 rounded overflow-hidden h-full">
// //               <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
// //                 <div className="px-3 py-2">FREQ MIN</div>
// //                 <div className="px-3 py-2">FREQ MAX</div>
// //                 <div className="px-3 py-2">DEVIATION</div>
// //               </div>
// //               {modeDetails.ewParameters.frequency.map((freq, index) => (
// //                 <div key={index} className="grid grid-cols-3 text-gray-100 text-sm">
// //                   <div className="px-3 py-2">{freq.min}</div>
// //                   <div className="px-3 py-2">{freq.max}</div>
// //                   <div className="px-3 py-2">{freq.deviation}</div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* PRI Table */}
// //           <div>
// //             <div className="bg-black/5 rounded overflow-hidden h-full">
// //               <div className="grid grid-cols-4 bg-[#393A3E] text-gray-100 text-sm font-medium">
// //                 <div className="px-3 py-2">PRI MIN</div>
// //                 <div className="px-3 py-2">PRI MAX</div>
// //                 <div className="px-3 py-2">DEVIATION</div>
// //                 <div className="px-3 py-2">STAGGER LEVEL</div>
// //               </div>
// //               {modeDetails.ewParameters.pri.map((pri, index) => (
// //                 <div key={index} className="grid grid-cols-4 text-gray-100 text-sm">
// //                   <div className="px-3 py-2">{pri.min}</div>
// //                   <div className="px-3 py-2">{pri.max}</div>
// //                   <div className="px-3 py-2">{pri.deviation}</div>
// //                   <div className="px-3 py-2">{pri.staggerLevel}</div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* PW Table */}
// //           <div>
// //             <div className="bg-black/5 rounded overflow-hidden h-full">
// //               <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
// //                 <div className="px-3 py-2">PW MIN</div>
// //                 <div className="px-3 py-2">PW MAX</div>
// //                 <div className="px-3 py-2">DEVIATION</div>
// //               </div>
// //               {modeDetails.ewParameters.pulseWidth.map((pw, index) => (
// //                 <div key={index} className="grid grid-cols-3 text-gray-100 text-sm">
// //                   <div className="px-3 py-2">{pw.min}</div>
// //                   <div className="px-3 py-2">{pw.max}</div>
// //                   <div className="px-3 py-2">{pw.deviation}</div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Scan Type Section */}
// //       <div className="px-10 py-6">
// //         <h2 className="text-lg font-semibold mb-6 text-gray-200">Scan Type</h2>
// //         <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">SCAN TYPE</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.scanType}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">MIN SCAN SECTOR</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.minScanSector}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">MAX SCAN SECTOR</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.maxScanSector}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">MIN SCAN RATE</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.minScanRate}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">MAX SCAN RATE</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.maxScanRate}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">SIDE LOBE LEVEL</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.sideLobeLevel}</div>
// //           </div>
// //         </div>
// //         <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mt-8">
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">SIDE LOBE STD</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.sideLobeStd}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">MIN TOT</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.minTot}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">MAX TOT</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.maxTot}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">MIN BEAM WIDTH</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.minBeamWidth}</div>
// //           </div>
// //           <div>
// //             <Label className="block text-sm text-white/70 font-mono mb-1">MAX BEAM WIDTH</Label>
// //             <div className="py-2 rounded text-gray-200">{modeDetails.scanType.maxBeamWidth}</div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ModalModel;

// import React from "react";
// import { Label } from "../components/ui/label";
// import modeDetails from "../json/mode_details.json";

// const ModalModel = () => {
//   return (
//     <div className="min-h-screen bg-[#414141] text-gray-200">
//       <div className="px-10 pt-10 pb-6">
//         {/* Header Section */}
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center gap-3">
//             <div
//               className="px-3 py-1 rounded text-sm font-medium"
//               style={{
//                 backgroundColor: modeDetails.code.bgColor,
//                 color: modeDetails.code.fgColor,
//               }}
//             >
//               {modeDetails.code.symbol}
//             </div>
//             <h1 className="text-2xl font-semibold">{modeDetails.id}</h1>
//           </div>
//           <div className="flex items-center gap-2 text-gray-300 text-sm">
//             <span>LAST EDITED {modeDetails.lastEdited}</span>
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.793a1 1 0 011.617.793z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Description Section */}
//         <div className="bg-[#414141] mb-8">
//           <p className="text-gray-200 leading-relaxed">
//             {modeDetails.description}
//           </p>
//         </div>

//         {/* General Parameters Section */}
//         <div className="bg-[#414141] ">
//           <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">TYPE</Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.type}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 SUB-MODE TYPE
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.subModeType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 PLATFORM TYPE
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.platformType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 THREAT TYPE
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.threatType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 FREQ TYPE
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.freqType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 PRI TYPE
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.priType}
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mt-8">
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 STAGGER LEVEL
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.staggerLevel}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 PW TYPE
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.pwType}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 DISP RANGE EST
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.dispRangeEst}
//               </div>
//             </div>
//             <div>
//               <Label className="block text-sm text-gray-300 mb-1">
//                 LETHAL RANGE
//               </Label>
//               <div className="bg-[#414141] py-2 rounded text-gray-100">
//                 {modeDetails.details.lethalRange}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* EW Parameters Section */}
//       <div className="border border-white/10 px-10 py-5">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* FREQ Table */}
//           <div>
//             <div className="bg-black/5 rounded overflow-hidden h-full">
//               <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                 <div className="px-3 py-2">FREQ MIN</div>
//                 <div className="px-3 py-2">FREQ MAX</div>
//                 <div className="px-3 py-2">DEVIATION</div>
//               </div>
//               {modeDetails.ewParameters.frequency.map((freq, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-3 text-gray-100 text-sm"
//                 >
//                   <div className="px-3 py-2">{freq.min}</div>
//                   <div className="px-3 py-2">{freq.max}</div>
//                   <div className="px-3 py-2">{freq.deviation}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* PRI Table */}
//           <div>
//             <div className="bg-black/5 rounded overflow-hidden h-full">
//               <div className="grid grid-cols-4 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                 <div className="px-3 py-2">PRI MIN</div>
//                 <div className="px-3 py-2">PRI MAX</div>
//                 <div className="px-3 py-2">DEVIATION</div>
//                 <div className="px-3 py-2">STAGGER LEVEL</div>
//               </div>
//               {modeDetails.ewParameters.pri.map((pri, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-4 text-gray-100 text-sm"
//                 >
//                   <div className="px-3 py-2">{pri.min}</div>
//                   <div className="px-3 py-2">{pri.max}</div>
//                   <div className="px-3 py-2">{pri.deviation}</div>
//                   <div className="px-3 py-2">{pri.staggerLevel}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* PW Table */}
//           <div>
//             <div className="bg-black/5 rounded overflow-hidden h-full">
//               <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
//                 <div className="px-3 py-2">PW MIN</div>
//                 <div className="px-3 py-2">PW MAX</div>
//                 <div className="px-3 py-2">DEVIATION</div>
//               </div>
//               {modeDetails.ewParameters.pulseWidth.map((pw, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-3 text-gray-100 text-sm"
//                 >
//                   <div className="px-3 py-2">{pw.min}</div>
//                   <div className="px-3 py-2">{pw.max}</div>
//                   <div className="px-3 py-2">{pw.deviation}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scan Type Section */}
//       <div className="px-10 py-6">
//         <h2 className="text-lg font-semibold mb-6 text-gray-200">Scan Type</h2>
//         <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               SCAN TYPE
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.scanType}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               MIN SCAN SECTOR
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.minScanSector}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               MAX SCAN SECTOR
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.maxScanSector}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               MIN SCAN RATE
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.minScanRate}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               MAX SCAN RATE
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.maxScanRate}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               SIDE LOBE LEVEL
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.sideLobeLevel}
//             </div>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mt-8">
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               SIDE LOBE STD
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.sideLobeStd}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               MIN TOT
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.minTot}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               MAX TOT
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.maxTot}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               MIN BEAM WIDTH
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.minBeamWidth}
//             </div>
//           </div>
//           <div>
//             <Label className="block text-sm text-white/70 font-mono mb-1">
//               MAX BEAM WIDTH
//             </Label>
//             <div className="py-2 rounded text-gray-200">
//               {modeDetails.scanType.maxBeamWidth}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModalModel;

import React, { useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import { useSearchParams } from "react-router-dom";
import { fetchModeIndependentTree, fetchModeTree } from "../services/AdroneServices";
import dayjs from "dayjs";
import { Volume2 } from "lucide-react";

const ModalModel = () => {

  const [modeTreeData, setModeTreeData] = useState(null);

  const [searchParams] = useSearchParams();
  const nodeId = searchParams.get("nodeId");

  const splitNodeId = nodeId.split("_");        // ["AOI", "2", "Weapon", "1", "0"]

  // check user come from weapon section or emitter section
  const isFromWeaponSection = splitNodeId[2] === 'Weapon'; // true or false

  const modeId = splitNodeId[splitNodeId.length - 2];  // "1"

  // fetch mode tree data
  const loadModes = async () => {
    try {
      let data;
      if (isFromWeaponSection){
        data = await fetchModeTree(modeId);
      } else {
        data = await fetchModeIndependentTree(modeId)
      }
      if (data.statusCode === 200) {
        setModeTreeData(data.payload);
      } else {
        console.warn("Invalid Mode API response:", data);
      }
    } catch (error) {
      console.error("Error loading Mode data:", error);
    }
  };

  // Fetch emitters data once
  useEffect(() => {
    loadModes();
  }, [nodeId]);

  return (
    modeTreeData ? (
      <div className="min-h-screen bg-[#414141] text-gray-200">
      <div className="px-10 pt-10 pb-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1 rounded text-sm font-medium"
              style={{
                backgroundColor: modeTreeData.bgColor,
                color: modeTreeData.fgColor,
              }}
            >
              {modeTreeData.modeSymbol}
            </div>
            <h1 className="text-2xl font-semibold">{modeTreeData.modeName}</h1>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <p className="text-sm">
              LAST EDITED <span className=" font-medium text-white text-base">{dayjs(modeTreeData.modifiedDate).format("DD MMM'YY HH:mm")}</span>
            </p>
            <Volume2 className="w-5 h-5" />
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-[#414141] mb-8">
          <p className="text-gray-200 leading-relaxed">
            {modeTreeData.description}
          </p>
        </div>

        {/* General Parameters Section */}
        <div className="bg-[#414141] ">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
            <div>
              <Label className="block text-sm text-gray-300 mb-1">TYPE</Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.modeType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                SUB-MODE TYPE
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.subMode}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                PLATFORM TYPE
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.platformType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                THREAT TYPE
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.threatType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                FREQ TYPE
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.frequencyType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                PRI TYPE
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.priType}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mt-8">
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                STAGGER LEVEL
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.priStaggerLevel || '-'}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                PW TYPE
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.pwType}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                DISP RANGE EST
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.rangeEstimation}
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-300 mb-1">
                LETHAL RANGE
              </Label>
              <div className="bg-[#414141] py-2 rounded text-gray-100">
                {modeTreeData.lethalRange}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EW Parameters Section */}
      <div className="border border-white/10 px-10 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FREQ Table */}
          <div>
            <div className="bg-black/5 rounded overflow-hidden h-full">
              <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
                <div className="px-3 py-2">FREQ MIN</div>
                <div className="px-3 py-2">FREQ MAX</div>
                <div className="px-3 py-2">DEVIATION</div>
              </div>
              {modeTreeData.modeFrequencyDetails.length > 0 ? (
                modeTreeData.modeFrequencyDetails.map((freq, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 text-gray-100 text-sm"
                >
                  <div className="px-3 py-2">{freq.minFrequency}</div>
                  <div className="px-3 py-2">{freq.maxFrequency}</div>
                  <div className="px-3 py-2">{freq.deviation || '-'}</div>
                </div>
              ))
              ) : (
                <div className="bg-[#3E3E3E] rounded-sm p-4 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No FREQ data available</p>
                </div>
              )
            }
            </div>
          </div>

          {/* PRI Table */}
          <div>
            <div className="bg-black/5 rounded overflow-hidden h-full">
              <div className="grid grid-cols-4 bg-[#393A3E] text-gray-100 text-sm font-medium">
                <div className="px-3 py-2">PRI MIN</div>
                <div className="px-3 py-2">PRI MAX</div>
                <div className="px-3 py-2">DEVIATION</div>
                <div className="px-3 py-2"></div>
              </div>
              {modeTreeData.modePriDetails.length > 0 ? (
                modeTreeData.modePriDetails.map((pri, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 text-gray-100 text-sm"
                >
                  <div className="px-3 py-2">{pri.minPri}</div>
                  <div className="px-3 py-2">{pri.maxPri}</div>
                  <div className="px-3 py-2">{pri.deviation || '-'}</div>
                  <div className="px-3 py-2">{pri.jitterMean || '-'}</div>
                </div>
              ))
              ) : (
                <div className="bg-[#3E3E3E] rounded-sm p-4 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No PRI data available</p>
                </div>
              )
            }
            </div>
          </div>

          {/* PW Table */}
          <div>
            <div className="bg-black/5 rounded overflow-hidden h-full">
              <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
                <div className="px-3 py-2">PW MIN</div>
                <div className="px-3 py-2">PW MAX</div>
                <div className="px-3 py-2">DEVIATION</div>
              </div>
              {modeTreeData.modePwDetails.length > 0 ? (
                modeTreeData.modePwDetails.map((pw, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 text-gray-100 text-sm"
                  >
                    <div className="px-3 py-2">{pw.minPw}</div>
                    <div className="px-3 py-2">{pw.maxPw}</div>
                    <div className="px-3 py-2">{pw.deviation || '-'}</div>
                  </div>
                ))
              ) : (
                <div className="bg-[#3E3E3E] rounded-sm p-4 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No PW data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>

      {/* Scan Type Section */}
      <div className="px-10 py-6">
        <h2 className="text-lg font-semibold mb-6 text-gray-200">Scan Type</h2>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              SCAN TYPE
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].scanType}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              MIN SCAN SECTOR
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].minScanSector}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              MAX SCAN SECTOR
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].maxScanSector}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              MIN SCAN RATE
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].minScanRate}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              MAX SCAN RATE
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].maxScanRate}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              SIDE LOBE LEVEL
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].sideLobeLevel}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mt-8">
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              SIDE LOBE STD
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].sideLobeStd}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              MIN TOT
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].minTot}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              MAX TOT
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].maxTot}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              MIN BEAM WIDTH
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].minBeamWidth}
            </div>
          </div>
          <div>
            <Label className="block text-sm text-white/70 font-mono mb-1">
              MAX BEAM WIDTH
            </Label>
            <div className="py-2 rounded text-gray-200">
              {modeTreeData.modeScanDetails[0].maxBeamWidth}
            </div>
          </div>
        </div>
      </div>
    </div>
    ) : (
      <div className="min-h-screen bg-[#414141] text-white p-6">
        <p>Loading mode data...</p>
      </div>
    )
  );
};

export default ModalModel;
