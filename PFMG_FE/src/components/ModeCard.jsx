import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Volume2, Link } from "lucide-react";

// ModeCard component for displaying attached modes
const ModeCard = ({
  mode,
  index,
  modes,
  toggleScanType,
  toggleEmParameter,
  detachMode,
}) => {
  return (
    <div className="mb-6">
      <div className="rounded-lg bg-[#FFFFFF0D] p-4 px-6">
        {/* Mode Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`px-2 py-1 rounded text-xs font-bold text-white ${mode.backgroundColor === "#4CAF50" ? "bg-green-600" : "bg-yellow-600"}`}
            >
              {mode.modeId || `Mode_${index + 1}`}
            </div>
            <h3 className="text-lg font-semibold text-white">
              {mode.details?.type || mode.type || "Unknown Type"}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleScanType(index)}
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
              onClick={() => toggleEmParameter(index)}
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
              onClick={() => detachMode(index)}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 h-auto p-0"
            >
              <Link className="w-4 h-4" />
              Detach
            </Button>
          </div>
        </div>

        {/* Mode Description */}
        <p className="text-gray-300 mb-4">
          {mode.details?.description ||
            mode.description ||
            "No description available"}
        </p>

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
                  {mode.details?.type || mode.type || "N/A"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.details?.subModeType || "Scan"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.details?.platformType || "N/A"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.details?.threatType || "N/A"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.ewParameters?.frequency?.freqType ||
                    mode.frequencyType ||
                    "N/A"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.ewParameters?.pri?.priType || mode.priType || "N/A"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.ewParameters?.pri?.priTable?.[0]?.staggerLevel || "N/A"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.ewParameters?.pulseWidth?.pwType ||
                    mode.pwType ||
                    "N/A"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.dispRangeEstimation || "N/A"}
                </TableCell>
                <TableCell className="py-2 px-2 text-white">
                  {mode.details?.lethalRange || "N/A"}
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
                      {mode.scanDetails.scanType || mode.scanType || "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-white">
                      {mode.scanDetails.minScanSector ||
                        mode.minScanSector ||
                        "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-white">
                      {mode.scanDetails.maxScanSector ||
                        mode.maxScanSector ||
                        "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-white">
                      {mode.scanDetails.minScanRate ||
                        mode.minScanRate ||
                        "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-white">
                      {mode.scanDetails.normalScanRate ||
                        mode.normalScanRate ||
                        "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-white">
                      {mode.scanDetails.sideLobeLevel ||
                        mode.sideLobeLevel ||
                        "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-white">
                      {mode.scanDetails.sideLobeStd ||
                        mode.sideLobeStd ||
                        "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-white">
                      {mode.scanDetails.minTot || mode.minTot || "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-white">
                      {mode.scanDetails.maxTot || mode.maxTot || "N/A"}
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
                {mode.ewParameters.frequency?.frequencyTable?.map(
                  (freq, idx) => (
                    <div
                      key={`freq-${freq.min}-${freq.max}-${idx}`}
                      className="grid grid-cols-3 text-gray-100 text-sm"
                    >
                      <div className="px-3 py-2">{freq.min}</div>
                      <div className="px-3 py-2">{freq.max}</div>
                      <div className="px-3 py-2">{freq.deviation}</div>
                    </div>
                  )
                ) || (
                  <div className="grid grid-cols-3 text-gray-100 text-sm">
                    <div className="px-3 py-2">N/A</div>
                    <div className="px-3 py-2">N/A</div>
                    <div className="px-3 py-2">N/A</div>
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
                {mode.ewParameters.pri?.priTable?.map((pri, idx) => (
                  <div
                    key={`pri-${pri.min}-${pri.max}-${idx}`}
                    className="grid grid-cols-4 text-gray-100 text-sm"
                  >
                    <div className="px-3 py-2">{pri.min}</div>
                    <div className="px-3 py-2">{pri.max}</div>
                    <div className="px-3 py-2">{pri.deviation}</div>
                    <div className="px-3 py-2">{pri.staggerLevel}</div>
                  </div>
                )) || (
                  <div className="grid grid-cols-4 text-gray-100 text-sm">
                    <div className="px-3 py-2">N/A</div>
                    <div className="px-3 py-2">N/A</div>
                    <div className="px-3 py-2">N/A</div>
                    <div className="px-3 py-2">N/A</div>
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
                {mode.ewParameters.pulseWidth?.pulseWidthTable?.map(
                  (pw, idx) => (
                    <div
                      key={`pw-${pw.min}-${pw.max}-${idx}`}
                      className="grid grid-cols-3 text-gray-100 text-sm"
                    >
                      <div className="px-3 py-2">{pw.min}</div>
                      <div className="px-3 py-2">{pw.max}</div>
                      <div className="px-3 py-2">{pw.deviation}</div>
                    </div>
                  )
                ) || (
                  <div className="grid grid-cols-3 text-gray-100 text-sm">
                    <div className="px-3 py-2">N/A</div>
                    <div className="px-3 py-2">N/A</div>
                    <div className="px-3 py-2">N/A</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {index < modes.length - 1 && <Separator className="my-6 bg-gray-600" />}
    </div>
  );
};

export default ModeCard;
