import { useState } from "react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Plus, SlidersHorizontal } from "lucide-react";
import FormationContent from "../components/platformModels/FormationContent";
import TrackContent from "../components/platformModels/TrackContent";

import { Button } from "../components/ui/button";
import AssignSite from "../components/platformModels/AssignSite";

export default function FormationPopoverButton({ type = "formation" }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* === Trigger Button === */}
      <PopoverTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="ml-auto text-white/80 hover:text-white focus:outline-none"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </PopoverTrigger>

      {/* === Popover Content === */}
      {type === "formation" ? <FormationContent /> : <TrackContent />}
    </Popover>
  );
}

export function AssignSitePopoverButton({ type = "formation" }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* === Trigger Button === */}
      <PopoverTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          aria-label="Add"
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#C5BFFF] text-white/80 hover:text-white focus:outline-none leading-none"
        >
          <Plus className="h-4 w-4 text-black hover:text-gray-700" />
        </button>
      </PopoverTrigger>

      {/* === Popover Content === */}
      {type === "site" ? <AssignSite /> : null}
    </Popover>
  );
}
