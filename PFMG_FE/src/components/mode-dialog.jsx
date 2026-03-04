import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import copy from '@/assets/images/copy.svg';
import detach from '@/assets/images/detach.svg';
import noise from '@/assets/images/noise.svg';

export function ModeDialog({ isOpen, onClose, mode }) {
  const [expandedStates, setExpandedStates] = useState({});

  if (!mode) return null;

  const toggleScanType = () => {
    setExpandedStates(prev => ({
      ...prev,
      scanType: !prev.scanType
    }));
  };

  const toggleEmParameter = () => {
    setExpandedStates(prev => ({
      ...prev,
      emParameter: !prev.emParameter
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80%] min-h-[500px] flex flex-col justify-start overflow-y-auto bg-[#2C2D30] text-white border-none">
        <DialogHeader className="h-fit">
          <DialogTitle className="text-2xl font-semibold">
            Mode Details
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-lg bg-[#FFFFFF0D] p-4 px-6 ">
          {/* Mode Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="px-2 py-1 rounded text-xs font-bold text-white"
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
                onClick={toggleScanType}
                className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
              >
                {expandedStates.scanType ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {expandedStates.scanType ? "HIDE SCAN TYPE" : "SHOW SCAN TYPE"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={toggleEmParameter}
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
                  {dayjs(mode.modifiedDate).format("DD MMM'YY HH:mm")}
                </span>
              </p>

              {expandedStates.scanType || expandedStates.emParameter ? (
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

          {/* Mode Parameters */}
          <div className="my-3">
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

          {expandedStates.scanType && <hr className="border-gray-500" />}

          {/* Scan Type Section */}
          {expandedStates.scanType && mode.modeScanDetails?.length > 0 && (
            <div className="my-4">
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
          )}

          {expandedStates.emParameter && <hr className="border-gray-500" />}

          {/* EW Parameters Section */}
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
                  {mode.modeFrequencyDetails?.length > 0 ? (
                    mode.modeFrequencyDetails.map((freq, idx) => (
                      <div
                        key={freq.id || idx}
                        className="grid grid-cols-3 text-gray-100 text-sm"
                      >
                        <div className="px-3 py-2">{freq.minFrequency}</div>
                        <div className="px-3 py-2">{freq.maxFrequency}</div>
                        <div className="px-3 py-2">{freq.deviation || "-"}</div>
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
                  {mode.modePriDetails?.length > 0 ? (
                    mode.modePriDetails.map((pri, idx) => (
                      <div
                        key={pri.id || idx}
                        className="grid grid-cols-4 text-gray-100 text-sm"
                      >
                        <div className="px-3 py-2">{pri.minPri}</div>
                        <div className="px-3 py-2">{pri.maxPri}</div>
                        <div className="px-3 py-2">{pri.deviation || "-"}</div>
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
                  {mode.modePwDetails?.length > 0 ? (
                    mode.modePwDetails.map((pw, idx) => (
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
      </DialogContent>
    </Dialog>
  );
}