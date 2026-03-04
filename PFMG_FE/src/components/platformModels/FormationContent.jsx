import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";

const FormationContent = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // to track position
  const nodeRef = useRef(null); //  required in React 18

  return (
    <PopoverContent
      forceMount
      sideOffset={8}
      className="!fixed left-0 -top-70 w-auto bg-transparent border-none shadow-none"
      style={{ zIndex: 9999 }}
    >
      <Draggable
        nodeRef={nodeRef}
        handle=".drag-handle"
        position={position}
        onStop={(_, data) => setPosition({ x: data.x, y: data.y })}
      >
        <div
          ref={nodeRef}
          className="w-80 max-h-[80vh] overflow-y-auto bg-[#37383BF2]
                     border border-[#37383BF2] rounded-[8px] text-white p-0 
                     select-none shadow-lg"
        >
          <div
            className="drag-handle sticky top-0 bg-[#37383B] border-white/10 py-3 px-4 border-b 
             z-20 cursor-grab active:cursor-grabbing shadow-md"
          >
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
                <DropdownMenuContent className="z-[10000] overflow-visible">
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
                <DropdownMenuContent className="z-[10000] overflow-visible">
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
                <DropdownMenuContent className="z-[10000] overflow-visible">
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
                  <DropdownMenuContent className="z-[10000] overflow-visible">
                    <DropdownMenuItem>Manual Command</DropdownMenuItem>
                    <DropdownMenuItem>Waypoint Reached</DropdownMenuItem>
                    <DropdownMenuItem>Time Based</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Formation Duration */}
              <div className="space-y-2 ">
                <div className="text-xs font-medium mb-2 text-white/70 ">
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
                  <DropdownMenuContent className="z-[10000] overflow-visible">
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
                <DropdownMenuContent className="z-[10000] overflow-visible">
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
                  <DropdownMenuContent className="z-[10000] overflow-visible">
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
                  <DropdownMenuContent className="z-[10000] overflow-visible">
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
                  <DropdownMenuContent className="z-[10000] overflow-visible">
                    <DropdownMenuItem>Align to Formation Path</DropdownMenuItem>
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
        </div>
      </Draggable>
    </PopoverContent>
  );
};

export default FormationContent;
