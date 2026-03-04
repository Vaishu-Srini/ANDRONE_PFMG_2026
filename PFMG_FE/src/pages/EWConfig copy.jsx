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
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { useRef, useEffect, useState } from "react";
const EWConfig = () => {
  const containerRef = useRef(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new Map({ basemap: "satellite" });
    const mapView = new MapView({
      container: containerRef.current,
      map,
      center: [78, 22],
      zoom: 5,
      ui: {
        components: [], // <-- THIS REMOVES all default buttons/widgets
      },
    });

    setView(mapView);

    return () => mapView.destroy();
  }, []);
  return (
    <div className="relative w-full h-[calc(100vh-64px)] text-white">
      {/* Map container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* EW Configuration Header */}
      <div className="absolute top-20 right-20 flex flex-col gap-2 z-20">
        {/* First Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <div
              className="bg-[#414141] border border-[#fff]/10 rounded-[4px] 
            w-12 h-12 cursor-pointer flex justify-center items-center"
            >
              <img src={layers} alt="Layers" className="w-5 h-5" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto bg-[#37383BF2] border-[#37383BF2] rounded-[8px] text-white p-0">
            <div className="space-y-2 sticky top-0 bg-[#37383B] border-white/10 py-3 px-4 border-b z-10">
              <h4 className="leading-none font-medium font-mono">
                Formation Parameters
              </h4>
            </div>
            <div className="grid gap-4 p-4">
              {/* Apply to all formations toggle */}
              <div className="flex items-center justify-end gap-3">
                <span className="text-sm text-[#fff]/70 text-[12px] font-mono">
                  Apply to all formations
                </span>
                <Switch defaultChecked />
              </div>

              {/* Formation Type */}
              <div className="space-y-2 border-b border-dashed border-[#FFFFFF1A] pb-5">
                <div className="text-xs font-medium mb-2 text-white/70">
                  Formation Type
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                    >
                      Grid
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Grid</DropdownMenuItem>
                    <DropdownMenuItem>Line</DropdownMenuItem>
                    <DropdownMenuItem>Circle</DropdownMenuItem>
                    <DropdownMenuItem>Wedge</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Spacing */}
              <div className="space-y-2 border-b border-dashed border-[#FFFFFF1A] pb-5">
                <div className="text-xs font-medium mb-2 text-white/70">
                  Spacing
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                    >
                      Custom (enter value)
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Close</DropdownMenuItem>
                    <DropdownMenuItem>Medium</DropdownMenuItem>
                    <DropdownMenuItem>Wide</DropdownMenuItem>
                    <DropdownMenuItem>Custom (enter value)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Custom spacing inputs */}
                <div className="text-xs font-medium mb-2 text-white/70">
                  Spacing
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 relative">
                    <Label className="text-xs text-muted-foreground absolute top-0 right-0 border-l border-[#fff]/10 w-9 h-9 flex justify-center items-center">
                      X
                    </Label>
                    <Input
                      defaultValue="12"
                      className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white rounded-[4px]"
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <Label className="text-xs text-muted-foreground absolute top-0 right-0 border-l border-[#fff]/10 w-9 h-9 flex justify-center items-center">
                      Y
                    </Label>
                    <Input
                      defaultValue="12"
                      className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white rounded-[4px]"
                    />
                  </div>
                </div>
                <div className="text-xs font-medium mb-2 text-white/65">
                  Based On Leader
                </div>
              </div>

              {/* Altitude Mode */}
              <div className="space-y-2 border-b border-dashed border-[#FFFFFF1A] pb-5">
                <Label className="text-xs font-medium mb-2 text-white/70">
                  Altitude Mode
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                    >
                      Fixed Altitude (AGL)
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Fixed Altitude (AGL)</DropdownMenuItem>
                    <DropdownMenuItem>Relative to Leader</DropdownMenuItem>
                    <DropdownMenuItem>Absolute Altitude</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border-b border-dashed border-[#FFFFFF1A] pb-5 flex flex-col gap-6">
                {/* Start Trigger */}
                <div className="space-y-2">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Start Trigger
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                      >
                        Manual Command
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Manual Command</DropdownMenuItem>
                      <DropdownMenuItem>Waypoint Reached</DropdownMenuItem>
                      <DropdownMenuItem>Time Based</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Formation Duration */}
                <div className="space-y-2">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Formation Duration
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                      >
                        Until Disband Command
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Until Disband Command</DropdownMenuItem>
                      <DropdownMenuItem>Until Waypoint</DropdownMenuItem>
                      <DropdownMenuItem>Time Limited</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Disband Behavior */}
              <div className="space-y-2 border-b border-dashed border-[#FFFFFF1A] pb-5">
                <div className="text-xs font-medium mb-2 text-white/70">
                  Disband Behavior
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                    >
                      Hold Position
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Hold Position</DropdownMenuItem>
                    <DropdownMenuItem>Return to Base</DropdownMenuItem>
                    <DropdownMenuItem>Continue on Path</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="pb-5 flex flex-col gap-6">
                {/* Speed Mode / Sync Behavior */}
                <div className="space-y-2">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Speed Mode / Sync Behavior
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                      >
                        Match Leader Speed
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Match Leader Speed</DropdownMenuItem>
                      <DropdownMenuItem>
                        Maintain Individual Speed
                      </DropdownMenuItem>
                      <DropdownMenuItem>Adaptive Speed</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Failsafe Behavior */}
                <div className="space-y-2">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Failsafe Behavior
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                      >
                        Return to Base
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Return to Base</DropdownMenuItem>
                      <DropdownMenuItem>Hold Position</DropdownMenuItem>
                      <DropdownMenuItem>Land Immediately</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Heading Alignment */}
                <div className="space-y-2">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Heading Alignment
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                      >
                        Align to Formation Path
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        Align to Formation Path
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Maintain Individual Heading
                      </DropdownMenuItem>
                      <DropdownMenuItem>Follow Leader Heading</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-end sticky bottom-0 bg-[#37383BF2] border-white/10 py-3 px-4 border-t">
              <Button className="bg-[#7B70D6] hover:bg-[#6458cf]">Add</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Second Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <div
              className="bg-[#414141] border border-[#fff]/10 rounded-[4px] 
            w-12 h-12 cursor-pointer flex justify-center items-center"
            >
              <img src={layers} alt="Layers" className="w-5 h-5" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto bg-[#37383BF2] border-[#37383BF2] rounded-[8px] text-white p-0">
            <div className="space-y-2 sticky top-0 bg-[#37383B] border-white/10 py-3 px-4 border-b z-10">
              <h4 className="leading-none font-medium font-mono">
                Track Parameters
              </h4>
            </div>
            <div className="grid gap-4 p-4">
              {/* Spacing */}
              <div className="space-y-2 pb-5">
                <div className="text-xs font-medium mb-2 text-white/70">
                  Profile
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white"
                    >
                      Custom (enter value)
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Close</DropdownMenuItem>
                    <DropdownMenuItem>Medium</DropdownMenuItem>
                    <DropdownMenuItem>Wide</DropdownMenuItem>
                    <DropdownMenuItem>Custom (enter value)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Custom Parameters inputs */}
                <div className="text-xs font-medium mb-2 text-white/70">
                  Parameters
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 relative">
                    <div className="text-xs font-medium mb-2 text-white/70">
                      Lat
                    </div>
                    <Label
                      className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 
                      w-9 h-9 flex justify-center items-center"
                    >
                      Deg
                    </Label>
                    <Input
                      defaultValue="12"
                      className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white rounded-[4px]"
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <div className="text-xs font-medium mb-2 text-white/70">
                      Long
                    </div>
                    <Label className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 w-9 h-9 flex justify-center items-center">
                      Deg
                    </Label>
                    <Input
                      defaultValue="12"
                      className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 hover:text-white rounded-[4px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-end sticky bottom-0 bg-[#37383BF2] border-white/10 py-3 px-4 border-t">
              <Button className="bg-[#7B70D6] hover:bg-[#6458cf]">Add</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default EWConfig;
