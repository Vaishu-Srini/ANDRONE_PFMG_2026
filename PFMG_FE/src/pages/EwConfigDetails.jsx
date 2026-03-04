import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import MapComponent from "../components/pfmgMaps/pfmgmap";

const emitterData = [
  {
    id: 1,
    emitterId: "EMIT-001",
    frequencyMHz: 2450,
    latLong: "35.6895, 139.6917",
    detectionTime: "12:00",
    status: "Jamming",
  },
  {
    id: 2,
    emitterId: "EMIT-001",
    frequencyMHz: 2450,
    latLong: "35.6895, 139.6917",
    detectionTime: "12:00",
    status: "Idle",
  },
  {
    id: 3,
    emitterId: "EMIT-001",
    frequencyMHz: 2450,
    latLong: "35.6895, 139.6917",
    detectionTime: "12:00",
    status: "Jamming",
  },
  {
    id: 4,
    emitterId: "EMIT-001",
    frequencyMHz: 2450,
    latLong: "35.6895, 139.6917",
    detectionTime: "12:00",
    status: "Jamming",
  },
  {
    id: 5,
    emitterId: "EMIT-001",
    frequencyMHz: 2450,
    latLong: "35.6895, 139.6917",
    detectionTime: "12:00",
    status: "Jamming",
  },
  {
    id: 6,
    emitterId: "EMIT-001",
    frequencyMHz: 2450,
    latLong: "35.6895, 139.6917",
    detectionTime: "12:00",
    status: "Jamming",
  },
  {
    id: 7,
    emitterId: "EMIT-001",
    frequencyMHz: 2450,
    latLong: "35.6895, 139.6917",
    detectionTime: "12:00",
    status: "Jamming",
  },
];

const EWConfigDetails = () => {
  const [enabledById, setEnabledById] = useState({
    1: true,
    2: false,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
  });

  const jammedCount = useMemo(() => {
    return emitterData.filter(
      (row) => row.status === "Jamming" && enabledById[row.id]
    ).length;
  }, [enabledById]);

  const [authorization, setAuthorization] = useState("Auto");

  return (
    <>
      <div className="flex">
        <div className="min-w-[905px]">
          <div className="px-10 py-[18px]">
            <h1 className="text-3xl font-bold text-white mb-1 font-mono">
              Emitters
            </h1>
            <p className="text-white/65 text-[12px]">
              The Emitters Which Are Detected In The Mission
            </p>
          </div>
          <div className="flex justify-between items-center px-10 py-[18px]">
            <div className="flex items-center gap-4">
              <span className="text-white font-mono text-[16px]">
                Jamming Authorization
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-[#fff]/5 border-[#000]/10 text-white rounded-md h-9 px-0 overflow-hidden"
                  >
                    <span className="px-4 min-w-32 text-left">
                      {authorization}
                    </span>
                    <span className="h-9 w-9 border-l border-[#4b4b4b] flex items-center justify-center">
                      <ChevronDown className="w-4 h-4 text-white/80" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-[#37383B] border-[#555] text-white"
                >
                  {["Auto", "Manual", "Off"].map((opt) => (
                    <DropdownMenuItem
                      key={opt}
                      className="text-white hover:bg-[#404040]"
                      onClick={() => setAuthorization(opt)}
                    >
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-white whitespace-nowrap pr-2">
              {jammedCount} Emitters Are Jammed
            </div>
          </div>
          <div className="bg-[#414141] text-white">
            <div className="px-10 flex justify-between flex-col items-start w-full min-h-[calc(100vh_-_230px)]">
              <Table>
                <TableHeader className="bg-[#37383B]">
                  <TableRow className="border-none hover:bg-[#37383B]">
                    <TableHead className="text-white font-medium font-mono">
                      Emitter Id
                    </TableHead>
                    <TableHead className="text-white font-medium font-mono">
                      Frequency
                    </TableHead>
                    <TableHead className="text-white font-medium font-mono">
                      Lat/Long
                    </TableHead>
                    <TableHead className="text-white font-medium font-mono">
                      Detection Time
                    </TableHead>
                    <TableHead className="text-white font-medium font-mono">
                      Current Status
                    </TableHead>
                    <TableHead className="text-white font-medium font-mono">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-transparent">
                  {emitterData.map((row) => {
                    const isOn = Boolean(enabledById[row.id]);
                    return (
                      <TableRow
                        key={row.id}
                        className="border-[#555] hover:bg-[#404040]"
                      >
                        <TableCell className="text-white font-medium">
                          {row.emitterId}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {row.frequencyMHz}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {row.latLong}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {row.detectionTime}
                        </TableCell>
                        <TableCell className="text-gray-200">
                          {row.status}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={isOn}
                              onCheckedChange={(checked) =>
                                setEnabledById((prev) => ({
                                  ...prev,
                                  [row.id]: checked,
                                }))
                              }
                              className="w-10 h-5 data-[state=checked]:bg-[#C5BFFF] data-[state=unchecked]:bg-[#9CA3AF]"
                              thumbClassName="data-[state=checked]:bg-[#7B70D6] data-[state=unchecked]:bg-[#444]"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="flex items-center gap-1 pb-5">
                <div className="bg-[#F55600] border-[2px] border-[#000] h-[18px] w-[18px] rounded-full"></div>
                <div className="font-mono">Recording in progress</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#000] text-white w-full h-screen p-5">
          <MapComponent />
        </div>
      </div>
    </>
  );
};

export default EWConfigDetails;
