import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Draggable from "react-draggable";
import { useAoiStore } from "../store/missionStore";
import { SaveAOI } from "../services/AdroneServices";
import { useSearchParams } from "react-router-dom";
import { useResponseModal } from "../context/ResponseModalContext";

export function AOIModal({ isOpen, onClose, onAdd }) {
  const { aoiData, openModal, closeModal } = useAoiStore();
  const { open } = useResponseModal();
  const [aoiName, setAoiName] = useState("AOI_3344");
  const [description] = useState(
    "Nulla facilisi. Morbi tempus iaculis urna id volutpat lacus laoreet non laoreet..."
  );
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const area = aoiData?.area?.toFixed(2) ?? 0;
  const perimeter = aoiData?.perimeter?.toFixed(2) ?? 0;
  const points = aoiData?.points ?? [];
  const [searchParams] = useSearchParams();
  const missionId = Number(searchParams.get("missionId")) || 0;
  const missionName = searchParams.get("missionName") || "";

  const onSubmit = async () => {
    try {
      if (!aoiName || !points || points.length < 3) {
        open({
          type: "error",
          title: "Incomplete AOI",
          message: "Please draw at least 3 points before saving.",
          onConfirm: () => {
            openModal(aoiData); // reopen AOI via Zustand
          },
        });
        closeModal(); // close AOI first
        return;
      }

      const areaInterestCoordinateDtos = points.map((p) => {
        const rawLat = p.lat ?? p.latitude;
        const rawLon = p.long ?? p.longitude;
        const rawAlt = p.alt ?? 0;

        // Clean & convert values
        const latNum = parseFloat(String(rawLat).replace(/[^\d.-]/g, ""));
        const lonNum = parseFloat(String(rawLon).replace(/[^\d.-]/g, ""));
        const altNum = parseFloat(String(rawAlt).replace(/[^\d.-]/g, ""));

        return {
          id: 0,
          latitude: latNum.toString(),
          longitude: lonNum.toString(),
          altitude: altNum.toString(),
        };
      });

      // auto-close polygon if needed
      if (areaInterestCoordinateDtos.length >= 3) {
        const first = areaInterestCoordinateDtos[0];
        const last = areaInterestCoordinateDtos.at(-1);
        if (
          first.latitude !== last.latitude ||
          first.longitude !== last.longitude
        ) {
          areaInterestCoordinateDtos.push({ ...first });
        }
      }

      // get existing AOI id from localStorage
      const storedAoiId =
        Number(localStorage.getItem(`aoiId_mission_${missionId}`)) || 0;

      const payload = {
        aoiId: storedAoiId || aoiData?.aoiId || 0,
        aoiName,
        aoiArea: area,
        aoiPerimeter: perimeter,
        missionId,
        aoiCoordinates: areaInterestCoordinateDtos,
      };

      const response = await SaveAOI(payload);

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        const newId = response?.payload?.areaInterestId;
        if (newId) {
          // NEW STORAGE FOR AOI NAME MAPPING
          const existingNameMap = JSON.parse(
            localStorage.getItem(`aoiNameMap_mission_${missionId}`) || "[]"
          );

          const updatedNameMap = [
            ...existingNameMap.filter((a) => a.id !== newId),
            { id: newId, name: aoiName },
          ];

          localStorage.setItem(
            `aoiNameMap_mission_${missionId}`,
            JSON.stringify(updatedNameMap)
          );

          // Keep old one intact for backward compatibility
          localStorage.setItem(`aoiId_mission_${missionId}`, newId);

          //  Dispatch AOI_ADDED to sidebar
          const event = new CustomEvent("AOI_ADDED", {
            detail: { id: newId, name: aoiName },
          });
          window.dispatchEvent(event);

          // Dispatch AOI_SAVED to refresh emitters sidebar
          const refreshEvent = new CustomEvent("AOI_SAVED", {
            detail: { missionId, aoiId: newId },
          });
          window.dispatchEvent(refreshEvent);
        }

        // NEW: inform PlatformMaps so it can draw AOI instantly
        if (typeof onAdd === "function") {
          onAdd(response.payload);
        }

        onClose();
        open({
          type: "success",
          title: "Saved",
          message: "Area of Interest saved successfully.",
        });
      } else {
        onClose(); // close AOI

        open({
          type: "error",
          title: "Save Failed",
          message:
            response?.message ||
            response?.error ||
            "Failed to save AOI. Please fix and try again.",
          onConfirm: () => {
            openModal(aoiData); // reopen AOI
          },
        });

        throw new Error(response?.message || "Failed to save AOI");
      }
    } catch (error) {
      console.error("Error saving AOI:", error);

      onClose();
      open({
        type: "error",
        title: "System Error",
        message:
          error?.message ||
          "Something went wrong while saving AOI. Please try again.",
        onConfirm: () => {
          openModal(aoiData);
        },
      });
    }
  };

  return (
    // <Dialog open={isOpen}>
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        // Remove modal overlay and enable map interactivity
        className="fixed top-1/2 left-1/2 -translate-x-1/2 bg-transparent border-none shadow-none p-0 z-[9999]"
        style={{ pointerEvents: "none" }}
        // Disable outside click close
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <Draggable
          nodeRef={nodeRef}
          handle=".drag-handle"
          position={position}
          onStop={(_, data) => setPosition({ x: data.x, y: data.y })}
        >
          <div
            ref={nodeRef}
            style={{ pointerEvents: "auto" }}
            className="bg-[#2A2A2A] border border-[#404040] text-white w-[308px] rounded-lg overflow-hidden shadow-xl"
          >
            {/* Header */}
            <DialogHeader className="drag-handle flex flex-row items-center justify-between px-4 py-2 bg-[rgba(55,56,59,0.95)] border-b border-white/10 cursor-move">
              <DialogTitle className="text-white/95 font-mono text-sm not-italic font-medium leading-normal">
                Area Of Interest
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
                onClick={onClose}
              >
                ✕
              </Button>
            </DialogHeader>

            {/* Body */}
            <div className="px-4 py-6 space-y-6 bg-[rgba(55,56,59,0.95)] border-b border-white/10">
              <p className="text-white/95 font-karla text-[11px] not-italic font-medium leading-4 tracking-[0.353px]">
                Click points on the map to draw a path or polygon
              </p>

              {/* AOI Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="aoi-name"
                  className="text-xs font-medium text-white/70 font-karla not-italic leading-normal block"
                >
                  AOI Name
                </Label>
                <Input
                  id="aoi-name"
                  value={aoiName}
                  onChange={(e) => setAoiName(e.target.value)}
                  className="bg-[#404343] border-[#7B70D6] text-white/95 font-karla text-base not-italic font-medium leading-normal placeholder:text-white/50"
                />
              </div>

              {/* Area and Perimeter */}

              <div className="flex justify-start gap-8">
                <div>
                  <div className="text-white/70 font-karla text-xs not-italic font-medium leading-4">
                    Area
                  </div>
                  <div className="text-white/95 font-karla text-sm not-italic font-medium leading-4 tracking-[0.353px]">
                    {aoiData?.area ? `${aoiData.area.toFixed(2)} km²` : "—"}
                  </div>
                  <div className="text-xs">Area</div>
                </div>
                <div>
                  <div className="text-white/70 font-karla text-xs not-italic font-medium leading-4">
                    Perimeter
                  </div>
                  <div className="text-white/95 font-karla text-sm not-italic font-medium leading-4 tracking-[0.353px]">
                    {aoiData?.perimeter
                      ? `${aoiData.perimeter.toFixed(2)} km`
                      : "—"}
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="space-y-3">
                <Label className=" text-white/95 font-mono text-xs not-italic font-medium leading-4 tracking-[0.353px] block">
                  Points
                </Label>
                <div className="bg-[#404343]   overflow-hidden">
                  <div className="grid grid-cols-2 bg-[#393A3E] ">
                    <div className="px-3 py-0.5 text-white/95 font-mono text-[11px] not-italic font-medium leading-4 tracking-[0.353px]  ">
                      LAT
                    </div>
                    <div className="px-3 py-0.5  text-white/95 font-mono text-[11px] not-italic font-medium leading-4 tracking-[0.353px]">
                      LONG
                    </div>
                    {/* <div className="px-4 py-3 text-xs font-semibold text-white/90">
                      ALT [M]
                    </div> */}
                  </div>
                  {points.map((p, i) => (
                    <div key={i} className="grid grid-cols-2">
                      <div className="p-2 text-sm text-white/95 font-karla not-italic font-medium leading-4 tracking-[0.353px]">
                        {p.lat}
                      </div>
                      <div className="p-2 text-sm text-white/95 font-karla not-italic font-medium leading-4 tracking-[0.353px]">
                        {p.long}
                      </div>
                      {/* <div className="px-4 py-3 text-sm text-white">
                        {p.alt}
                      </div> */}
                    </div>
                  ))}
                </div>
                <div className="w-4 h-4 bg-white border border-[#8A38F5] rounded-full mt-6  " />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center border-t bg-[rgba(55,56,59,0.95)] border-black/10 py-3 px-6">
              <Button
                size="sm"
                className="bg-[#7B70D6] hover:bg-[#6B60C6] text-white/95 font-karla  px-4.5 py-1.5 text-sm font-bold leading-normal rounded-sm "
                onClick={onSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </Draggable>
      </DialogContent>
    </Dialog>
  );
}
