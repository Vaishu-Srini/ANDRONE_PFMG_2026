import React, { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Volume2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { fetchEmitterStandloneTree, fetchEmitterTree } from "../services/AdroneServices";
import dayjs from "dayjs";

const ModalEm = () => {

  const [emitterTreeData, setEmitterTreeData] = useState(null);
  const [modes, setModes] = useState([]); // Store modes with expanded state

  const [searchParams] = useSearchParams();
  const nodeId = searchParams.get("nodeId");

  const splitNodeId = nodeId.split("_");        // ["AOI", "2", "Weapon", "1", "0"]

  // check user come from weapon section or emitter section
  const isFromWeaponSection = splitNodeId[2] === 'Weapon'; // true or false
  
  const emitterId = splitNodeId[splitNodeId.length - 2];  // "1"

  // fetch emitter tree data
  const loadEmitters = async () => {
    try {
      let data;
      if (isFromWeaponSection){
        data = await fetchEmitterTree(emitterId);
      } else {
        data = await fetchEmitterStandloneTree(emitterId)
      }
      if (data.statusCode === 200) {
        setEmitterTreeData(data.payload);
        
        // Initialize modes with expanded and checked state
        if (data.payload.modes) {
          const initializedModes = data.payload.modes.map((mode) => ({
            ...mode,
            expanded: false,
            checked: false,
          }));
          setModes(initializedModes);
        }
      } else {
        console.warn("Invalid emitter API response:", data);
      }
    } catch (error) {
      console.error("Error loading emitter data:", error);
    }
  };

  const toggleChecked = (modeId) => {
    setModes((prev) =>
      prev.map((mode) =>
        mode.modeId === modeId ? { ...mode, checked: !mode.checked } : mode
      )
    );
  };

  const toggleExpanded = (modeId) => {
    setModes((prev) =>
      prev.map((mode) =>
        mode.modeId === modeId ? { ...mode, expanded: !mode.expanded } : mode
      )
    );
  };

  // Fetch emitters data once
  useEffect(() => {
    loadEmitters();
  }, [nodeId]);

  return (
    emitterTreeData ? (
      <div className="min-h-screen bg-[#414141] text-white p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-[2px] rounded-[4px] font-semibold text-[18px] font-mono"
              style={{
                backgroundColor: emitterTreeData.backgroundColor,
                color: emitterTreeData.foregroundColor,
              }}
            >
              {emitterTreeData.symbol}
            </div>
            <h1 className="text-2xl font-bold">{emitterTreeData.emitterName}</h1>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <p className="text-sm">
              LAST EDITED <span className="font-medium text-white text-base">{dayjs(emitterTreeData.modifiedDate).format("DD MMM'YY HH:mm")}</span>
            </p>
            <Volume2 className="w-5 h-5" />
          </div>
        </div>

        {/* Emitter Information Section */}
        <div className="mb-8">
          <p className="text-white/95 mb-6 leading-relaxed">
            {emitterTreeData.description}
          </p>
          <div className="grid grid-cols-5 gap-4 p-4 rounded-lg">
            <div>
              <span className="text-white/95 text-sm">TYPE:</span>
              <div className="text-white/95 font-medium">
                {emitterTreeData.emitterType}
              </div>
            </div>
            <div>
              <span className="text-white/95 text-sm"># OF MODES:</span>
              <div className="text-white/95 font-medium">
                {emitterTreeData.modes?.length || 0}
              </div>
            </div>
            <div>
              <span className="text-white/95 text-sm">LATITUDE:</span>
              <div className="text-white/95 font-medium">
                {emitterTreeData.latitude}
              </div>
            </div>
            <div>
              <span className="text-white/95 text-sm">LONGITUDE:</span>
              <div className="text-white/95 font-medium">
                {emitterTreeData.longitude}
              </div>
            </div>
            <div>
              <span className="text-white/95 text-sm">ALTITUDE:</span>
              <div className="text-white/95 font-medium">
                700M {/* Static Value - Data not come from payload  */}
              </div>
            </div>
          </div>
        </div>

        {/* Attached Modes Section */}
        <div className="mt-6 mb-4 rounded-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold">Attached Modes</h3>
              </div>
            </div>

            <div className="bg-[#414141] rounded-lg overflow-hidden">
              {/* Horizontally scrollable container */}
              <div className="overflow-x-auto">
                {/* Fixed Header */}
                <div className="bg-[#37383B] border-b border-white/10 min-w-[1200px]">
                  <div className="flex w-full">
                    <div className="w-12 px-2 py-3 text-center text-xs sm:text-sm font-medium text-gray-300"></div>
                    <div className="w-20 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Symbol
                    </div>
                    <div className="w-12 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                    </div>
                    <div className="w-32 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Mode Name
                    </div>
                    <div className="w-32 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Mode-Submode
                    </div>
                    <div className="w-32 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Platform Type
                    </div>
                    <div className="w-44 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Threat
                    </div>
                    <div className="w-28 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Freq Type
                    </div>
                    <div className="w-28 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      PRI Type
                    </div>
                    <div className="w-28 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Stagger Level
                    </div>
                    <div className="w-24 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      PW Type
                    </div>
                    <div className="w-32 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Scan Type
                    </div>
                    <div className="w-32 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Min Scan Sector
                    </div>
                    <div className="w-32 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                      Max Scan Sector
                    </div>
                  </div>
                </div>

                {/* Virtualized Body with dynamic height */}
                <div 
                  style={{ 
                    height: 400,
                    transition: 'height 0.2s ease-in-out' 
                  }} 
                  className="bg-[#414141] min-w-[1200px]"
                >
                  <Virtuoso
                    data={modes}
                    itemContent={(index, mode) => {
                      return (
                        <React.Fragment key={mode.modeId}>
                          <div className="flex w-full border-b border-white/10 hover:bg-[#37383B]">
                            <div className="w-12 px-2 py-3 text-center">
                              <Checkbox
                                checked={mode.checked || false}
                                onCheckedChange={() => toggleChecked(mode.modeId)}
                                className="scale-90 sm:scale-100"
                              />
                            </div>
                            <div className="w-20 px-2 py-3">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <div
                                  className="px-1 sm:px-2 py-[2px] rounded-[4px] font-semibold text-[10px] sm:text-[14px] font-mono"
                                  style={{
                                    backgroundColor: mode.bgColor || "#666",
                                    color: mode.fgColor || "#fff",
                                  }}
                                >
                                  {mode.modeSymbol}
                                </div>
                              </div>
                            </div>
                            <div className="w-12 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(mode.modeId)}
                                className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-[#C5BFFE]"
                              >
                                {mode.expanded ? (
                                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </Button>
                            </div>
                            <div className="w-32 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              <span className="inline-block border-b border-transparent [background-image:linear-gradient(to_right,white_11px,transparent_10px)] bg-[length:18px_1px] bg-repeat-x bg-bottom">
                                {mode.modeName}
                              </span>
                            </div>
                            <div className="w-32 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.subMode}
                            </div>
                            <div className="w-32 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.platformType}
                            </div>
                            <div className="w-44 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.threatType}
                            </div>
                            <div className="w-28 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.frequencyType}
                            </div>
                            <div className="w-28 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.priType}
                            </div>
                            <div className="w-28 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.priStaggerLevel || '-'}
                            </div>
                            <div className="w-24 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.pwType}
                            </div>
                            <div className="w-32 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.modeScanDetails[0]?.scanType}
                            </div>
                            <div className="w-32 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.modeScanDetails[0]?.minScanSector}
                            </div>
                            <div className="w-32 px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm truncate">
                              {mode.modeScanDetails[0]?.maxScanSector}
                            </div>
                          </div>

                          {/* Got empty array data for modeFrequencyDetails, modePriDetails, modePwDetails */}
                          {mode.expanded && (
                            <div className="bg-[#414141] border-b border-white/10">
                              <div className="p-2 sm:p-4">
                                {/* Responsive grid - stack on mobile, 2 cols on tablet, 3 cols on desktop */}
                                <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 justify-end">
                                  {/* FREQ Data Table */}
                                  <div className="bg-[#3E3E3E] rounded-sm overflow-hidden 2xl:min-w-md max-w-md">
                                    <div className="grid grid-cols-3 bg-[#37383B] text-gray-100 text-[10px] sm:text-xs font-medium ">
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">FREQ MIN</div>
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">FREQ MAX</div>
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">DEVIATION</div>
                                    </div>
                                    {mode.modeFrequencyDetails?.length > 0 ? (
                                      <div className="p-1 sm:p-2">
                                        {mode.modeFrequencyDetails.map((freq, index) => (
                                          <div
                                            key={index}
                                            className="grid grid-cols-3 text-gray-100 text-[10px] sm:text-xs"
                                          >
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {freq.minFrequency || freq.min}
                                            </div>
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {freq.maxFrequency || freq.max}
                                            </div>
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {freq.deviation || '-'}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="p-4 sm:p-6 flex items-center justify-center bg-[#414141]">
                                        <p className="text-gray-400 text-xs sm:text-sm">No FREQ data available</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* PRI Data Table */}
                                  <div className="bg-[#3E3E3E] rounded-sm overflow-hidden max-w-md">
                                    <div className="grid grid-cols-4 bg-[#37383B] text-gray-100 text-[10px] sm:text-xs font-medium">
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">PRI MIN</div>
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">PRI MAX</div>
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">DEVIATION</div>
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2"></div>
                                    </div>
                                    {mode.modePriDetails?.length > 0 ? (
                                      <div className="p-1 sm:p-2">
                                        {mode.modePriDetails.map((pri, index) => (
                                          <div
                                            key={index}
                                            className="grid grid-cols-4 text-gray-100 text-[10px] sm:text-xs"
                                          >
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {pri.minPri || pri.min}
                                            </div>
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {pri.maxPri || pri.max}
                                            </div>
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {pri.deviation || '-'}
                                            </div>
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {pri.jitterMean || '-'}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="p-4 sm:p-6 flex items-center justify-center bg-[#414141]">
                                        <p className="text-gray-400 text-xs sm:text-sm">No PRI data available</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* PW Data Table */}
                                  <div className="bg-[#3E3E3E] rounded-sm overflow-hidden max-w-md">
                                    <div className="grid grid-cols-3 bg-[#37383B] text-gray-100 text-[10px] sm:text-xs font-medium">
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">PW MIN</div>
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">PW MAX</div>
                                      <div className="text-center px-1 sm:px-3 py-1.5 sm:py-2">DEVIATION</div>
                                    </div>
                                    {mode.modePwDetails?.length > 0 ? (
                                      <div className="p-1 sm:p-2">
                                        {mode.modePwDetails.map((pw, index) => (
                                          <div
                                            key={index}
                                            className="grid grid-cols-3 text-gray-100 text-[10px] sm:text-xs"
                                          >
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {pw.minPw || pw.min}
                                            </div>
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {pw.maxPw || pw.max}
                                            </div>
                                            <div className="text-center px-1 sm:px-3 py-1 sm:py-1.5 font-mono">
                                              {pw.deviation || '-'}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="p-4 sm:p-6 flex items-center justify-center bg-[#414141]">
                                        <p className="text-gray-400 text-xs sm:text-sm">No PW data available</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
    ) : (
      <div className="min-h-screen bg-[#414141] text-white p-6">
        <p>Loading emitter data...</p>
      </div>
    )
  );
};

export default ModalEm;
