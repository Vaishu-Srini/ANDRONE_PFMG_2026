import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import layers from "../assets/images/layers.svg";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
// import PlatformMaps from "./platformMaps";
import { useSearchParams } from "react-router-dom";
import PlatformMaps from "./platformMapsWithHooks";

const EWConfig = () => {
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId") || searchParams.get("id"); // backward compat if needed
  const missionName = searchParams.get("missionName") || "Unnamed_Mission";

  useEffect(() => {
    console.log(
      "EWConfig params → missionId:",
      missionId,
      "missionName:",
      missionName
    );
  }, [missionId, missionName]);

  // useEffect(() => {
  //   fetchAoiForMission(missionId);
  // }, [missionId]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] text-white">
      <PlatformMaps missionId={missionId} />
    </div>
  );
};

export default EWConfig;
