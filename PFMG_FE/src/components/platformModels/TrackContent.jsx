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
import { ChevronDown } from "lucide-react";

const TrackContent = () => {
  const nodeRef = useRef(null);

  return (
    <PopoverContent
      forceMount
      sideOffset={8}
      className="!fixed left-0 -top-80 w-auto bg-transparent border-none shadow-none"
      style={{ zIndex: 9999 }}
    >
      <Draggable nodeRef={nodeRef} handle=".drag-handle">
        <div
          ref={nodeRef}
          className="w-80 max-h-[80vh] overflow-y-auto bg-[#37383BF2]
                     border border-[#37383BF2] rounded-[8px] text-white p-0 
                     select-none shadow-lg"
        >
          {/* === Header (sticky + draggable handle) === */}
          <div
            className="drag-handle sticky top-0 bg-[#37383B] border-white/10 py-3 px-4 border-b 
                       z-20 cursor-grab hover:bg-[#434447] active:cursor-grabbing
                       shadow-md transition-colors"
          >
            <h4 className="leading-none font-medium font-mono select-none">
              Track Parameters
            </h4>
          </div>

          {/* === Scrollable Body === */}
          <div className="grid gap-4 p-4">
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

                {/* 👇 ensure dropdown appears above draggable */}
                <DropdownMenuContent className="z-[10000] overflow-visible">
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
                    className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 
                               hover:text-white rounded-[4px]"
                  />
                </div>

                <div className="space-y-1 relative">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Long
                  </div>
                  <Label
                    className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 
                               w-9 h-9 flex justify-center items-center"
                  >
                    Deg
                  </Label>
                  <Input
                    defaultValue="12"
                    className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 
                               hover:text-white rounded-[4px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 relative">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Altitude(MSL)
                  </div>
                  <Label
                    className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 
                               w-9 h-9 flex justify-center items-center"
                  >
                    Km
                  </Label>
                  <Input
                    defaultValue="12"
                    className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 
                               hover:text-white rounded-[4px]"
                  />
                </div>

                <div className="space-y-1 relative">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Range
                  </div>
                  <Label
                    className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 
                               w-9 h-9 flex justify-center items-center"
                  >
                    Km
                  </Label>
                  <Input
                    defaultValue="12"
                    className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 
                               hover:text-white rounded-[4px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 relative">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Speed
                  </div>
                  <Label
                    className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 
                               w-9 h-9 flex justify-center items-center"
                  >
                    Km/H
                  </Label>
                  <Input
                    defaultValue="12"
                    className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 
                               hover:text-white rounded-[4px]"
                  />
                </div>

                <div className="space-y-1 relative">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Width
                  </div>
                  <Label
                    className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 
                               w-9 h-9 flex justify-center items-center"
                  >
                    Km
                  </Label>
                  <Input
                    defaultValue="12"
                    className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 
                               hover:text-white rounded-[4px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 relative">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Length
                  </div>
                  <Label
                    className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 
                               w-9 h-9 flex justify-center items-center"
                  >
                    Km
                  </Label>
                  <Input
                    defaultValue="12"
                    className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 
                               hover:text-white rounded-[4px]"
                  />
                </div>

                <div className="space-y-1 relative">
                  <div className="text-xs font-medium mb-2 text-white/70">
                    Bearing
                  </div>
                  <Label
                    className="text-xs text-white/80 absolute top-6 right-0 border-l border-[#fff]/10 
                               w-9 h-9 flex justify-center items-center"
                  >
                    0
                  </Label>
                  <Input
                    defaultValue="12"
                    className="h-9 bg-[#fff]/5 border-[#fff]/10 hover:bg-[#fff]/5 
                               hover:text-white rounded-[4px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === Footer Button === */}
          <div
            className="flex justify-end sticky bottom-0 bg-[#37383BF2] 
                       border-white/10 py-3 px-4 border-t"
          >
            <Button className="bg-[#7B70D6] hover:bg-[#6458cf]">Save</Button>
          </div>
        </div>
      </Draggable>
    </PopoverContent>
  );
};

export default TrackContent;
