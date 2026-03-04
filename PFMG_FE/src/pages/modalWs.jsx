import React, { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Volume2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { fetchWeaponTree } from "../services/AdroneServices";
import dayjs from "dayjs";

const ModalWs = () => {

  const [weaponTreeData, setWeaponTreeData] = useState(null);
  const [expandedEmitters, setExpandedEmitters] = useState({}); // Track which emitter is expanded
  const [emitterModes, setEmitterModes] = useState({}); // Store modes for each emitter

  const [searchParams] = useSearchParams();
  const nodeId = searchParams.get("nodeId");

  const splitNodeId = nodeId.split("_");        // ["AOI", "2", "Weapon", "1", "0"]
  const weaponId = splitNodeId[splitNodeId.length - 2];  // "1"

  // fetch weapon tree data
  const loadWeapons = async () => {
    try {
      const data = await fetchWeaponTree(weaponId);
      if (data.statusCode === 200) {

        setWeaponTreeData(data.payload);
        
        // Initialize modes for each emitter
        const modesData = {};
        data.payload.emitters.forEach((emitter) => {
          modesData[emitter.emitterId] = emitter.modes?.map((mode) => ({
            ...mode,
            expanded: false,
            checked: false,
          })) || [];
        });
        setEmitterModes(modesData);
      } else {
        console.warn("Invalid weapon API response:", data);
      }
    } catch (error) {
      console.error("Error loading weapon coordinates:", error);
    }
  };

  // Toggle emitter expansion
  const toggleEmitterExpanded = (emitterId) => {
    setExpandedEmitters(prev => ({
      ...prev,
      [emitterId]: !prev[emitterId]
    }));
  };

  // Toggle mode checked state for a specific emitter
  const toggleChecked = (emitterId, modeId) => {
    setEmitterModes(prev => ({
      ...prev,
      [emitterId]: prev[emitterId].map(mode =>
        mode.modeId === modeId ? { ...mode, checked: !mode.checked } : mode
      )
    }));
  };

  // Toggle mode expanded state for a specific emitter
  const toggleModeExpanded = (emitterId, modeId) => {
    setEmitterModes(prev => ({
      ...prev,
      [emitterId]: prev[emitterId].map(mode =>
        mode.modeId === modeId ? { ...mode, expanded: !mode.expanded } : mode
      )
    }));
  };

  // Calculate dynamic height for modes table
  const calculateTableHeight = (modes) => {
    const baseRowHeight = 52; // Height for each mode row
    const expandedContentHeight = 150; // Additional height for expanded content
    const headerHeight = 52; // Header row height
    const minHeight = 100; // Minimum height
    const maxHeight = 600; // Maximum height
    
    let totalHeight = headerHeight;
    
    modes.forEach(mode => {
      totalHeight += baseRowHeight;
      if (mode.expanded) {
        totalHeight += expandedContentHeight;
      }
    });
    
    // Ensure height is within min and max bounds
    return Math.min(Math.max(totalHeight, minHeight), maxHeight);
  };

  // Fetch weapons data once
  useEffect(() => {
    loadWeapons();
  }, [nodeId]);

  return (
    weaponTreeData ? (
      <div className="min-h-screen bg-[#414141] text-white p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-[2px] rounded-[4px] font-semibold text-[18px] font-mono"
              style={{
                backgroundColor: weaponTreeData.backGroundColor,
                color: weaponTreeData.foreGroundColor,
              }}
            >
              {weaponTreeData.symbol}
            </div>
            <h1 className="text-2xl font-bold">{weaponTreeData.weaponName}</h1>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <p className="text-sm">
              LAST EDITED <span className=" font-medium text-white text-base">{dayjs(weaponTreeData.modifiedDate).format("DD MMM'YY HH:mm")}</span>
            </p>
            <Volume2 className="w-5 h-5" />
          </div>
        </div>

        {/* Weapon Information Section */}
        <div className="mb-8">
          <p className="text-white/95 mb-6 leading-relaxed">
            {weaponTreeData.description}
          </p>
          <div className="grid grid-cols-5 gap-4 p-4 rounded-lg">
            <div>
              <span className="text-white/95 text-sm">THREAT TYPE:</span>
              <div className="text-white/95 font-medium">
                {weaponTreeData.threatType}
              </div>
            </div>
            <div>
              <span className="text-white/95 text-sm">PRIORITY:</span>
              <div className="text-white/95 font-medium">
                {weaponTreeData.priority}
              </div>
            </div>
            <div>
              <span className="text-white/95 text-sm"># OF EMITTERS:</span>
              <div className="text-white/95 font-medium">
                {weaponTreeData.emitters.length}
              </div>
            </div>
            <div>
              <span className="text-white/95 text-sm">LAST EDITED:</span>
              <div className="text-white/95 font-medium">
                {dayjs(weaponTreeData.modifiedDate).format("DD MMM'YY HH:mm")}
              </div>
            </div>
          </div>
        </div>

        {/* Attached Emitters Section */}
        <div className="rounded-xl p-5 mb-8">
          <h2 className="text-xl font-semibold mb-4">Attached Emitters</h2>
          {
            weaponTreeData.emitters.map((emitter, index) => {
              const currentEmitterModes = emitterModes[emitter.emitterId] || [];
              console.log('currentEmitterModes: ', currentEmitterModes);
              const isExpanded = expandedEmitters[emitter.emitterId];
              const tableHeight = calculateTableHeight(currentEmitterModes);
              
              return (
                <>
                  <div key={emitter.emitterId} className="bg-[#474747] mb-6 p-5 border border-white/10 rounded-lg">
                  <div className=" ">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                      {/* Left side — emitter code and info */}
                      <div className="flex-1 flex flex-col gap-5">
                        {/* Code badge and title */}
                        <div className="flex items-center gap-3">
                          <div
                            className="px-3 py-[2px] rounded-[4px] font-semibold text-[16px] font-mono"
                            style={{
                              backgroundColor: emitter.backgroundColor || "#8B0000",
                              color: emitter.foregroundColor || "white",
                            }}
                          >
                            {emitter.symbol}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {emitter.emitterName}
                            </h3>
                          </div>
                        </div>  
                      </div>

                      {/* Right side — last edited + icons */}
                      <div className="flex items-center gap-5 md:gap-10 text-gray-300 mt-4 sm:mt-0">
                        <p className="text-sm">LAST EDITED <span className=" font-medium text-white text-base">{dayjs(emitter.modifiedDate).format("DD MMM'YY HH:mm")}</span></p>
                        <Volume2 className="w-5 h-5 text-gray-300" />
                        <button
                          onClick={() => toggleEmitterExpanded(emitter.emitterId)}
                          className="p-0 hover:bg-white/10 rounded-full border transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-300" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed mt-4">
                      {emitter.description}
                    </p>
                  </div>

                  {/* Info grid below */}
                  <div className="mt-5 grid grid-cols-5 gap-4 text-sm text-gray-200">
                    <div>
                      <div className="text-white/60 text-xs mb-1">TYPE</div>
                      <div className="font-medium">{emitter.emitterType}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs mb-1"># OF MODES</div>
                      <div className="font-medium">{emitter.modes?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs mb-1">LATITUDE</div>
                      <div className="font-medium">{emitter.latitude}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs mb-1">LONGITUDE</div>
                      <div className="font-medium">{emitter.longitude}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs mb-1">LAST EDITED</div>
                      <div className="font-medium">{dayjs(emitter.modifiedDate).format("DD MMM'YY HH:mm")}</div>
                    </div>
                  </div>
                  </div>

                  {/* Attached Modes Table for this specific emitter */}
                  {isExpanded && currentEmitterModes.length > 0 && (
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
                              <div className="w-24 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-300">
                                Symbol
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
                              height: tableHeight,
                              transition: 'height 0.2s ease-in-out' 
                            }} 
                            className="bg-[#414141] min-w-[1200px]"
                          >
                            <Virtuoso
                              data={currentEmitterModes}
                              itemContent={(index, mode) => {
                                console.log('mode: ', mode);
                                return (
                                  <React.Fragment key={mode.modeId}>
                                    <div className="flex w-full border-b border-white/10 hover:bg-[#37383B]">
                                      <div className="w-12 px-2 py-3 text-center">
                                        <Checkbox
                                          checked={mode.checked || false}
                                          onCheckedChange={() => toggleChecked(emitter.emitterId, mode.modeId)}
                                          className="scale-90 sm:scale-100"
                                        />
                                      </div>
                                      <div className="w-24 px-2 py-3">
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
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleModeExpanded(emitter.emitterId, mode.modeId)}
                                            className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-[#C5BFFE]"
                                          >
                                            {mode.expanded ? (
                                              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                            ) : (
                                              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                            )}
                                          </Button>
                                        </div>
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
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                            {/* FREQ Data Table */}
                                            <div className="bg-[#3E3E3E] rounded-sm overflow-hidden">
                                              <div className="grid grid-cols-3 bg-[#37383B] text-gray-100 text-[10px] sm:text-xs font-medium">
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
                                            <div className="bg-[#3E3E3E] rounded-sm overflow-hidden">
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
                                            <div className="bg-[#3E3E3E] rounded-sm overflow-hidden">
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
                  )}
                </>
              );
            })
          }
        </div>
      </div>
    ) : (
      <div className="min-h-screen bg-[#414141] text-white p-6">
        <p>Loading weapon data...</p>
      </div>
    )
  );
};

export default ModalWs;