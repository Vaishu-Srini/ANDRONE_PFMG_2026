import React, { useRef, useState } from "react";
import Extent from "@arcgis/core/geometry/Extent";
import { MdMyLocation } from "react-icons/md";
import { TfiLocationArrow } from "react-icons/tfi";
import { Minus, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { AOIModal } from "../components/aoi-modal";
import { useAoiStore } from "../store/missionStore";
import { AOIbyID } from "../services/AdroneServices";
import { useMapInitialize } from "../hooks/PFMG/useMapInitialize";
import { useUAVSimulation } from "../hooks/PFMG/useUAVSimulation";
import { useAOIManagement } from "../hooks/PFMG/useAOIManagement";
import { useEmitterManagement } from "../hooks/PFMG/useEmitterManagement";

const PlatformMaps = ({ missionId }) => {
  const containerRef = useRef(null);

  // Local State
  const [is3D, setIs3D] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(5);

  // Store
  const { isModalOpen, closeModal } = useAoiStore();

  // 1. Initialize Map
  const { view, drawLayer, isMapReady } = useMapInitialize(containerRef, is3D);

  // 2. UAV Simulation
  useUAVSimulation(view, isPlaying, animationSpeed, isMapReady);

  // 3. AOI Management
  const { drawAOIFromFetchedData, aoiGraphicsRef } = useAOIManagement(
    view,
    drawLayer,
    is3D,
    missionId,
    isMapReady
  );

  // 4. Emitter Management
  useEmitterManagement(view, missionId);

  // ==================== UI Handlers ====================

  const handleZoomIn = () => view?.goTo({ zoom: view.zoom + 1 });
  const handleZoomOut = () => view?.goTo({ zoom: view.zoom - 1 });

  const handleRecenter = () => {
    if (view) {
      const indiaExtent = new Extent({
        xmin: 68.0,
        ymin: 6.0,
        xmax: 97.5,
        ymax: 37.0,
        spatialReference: { wkid: 4326 },
      });
      view.goTo(indiaExtent.expand(1.1));
    }
  };

  const handleModalSave = async (savedAOI) => {
    closeModal();
    const newId = savedAOI?.payload?.areaInterestId ?? savedAOI?.areaInterestId;

    // Clean temp graphics
    const tempKeys = Object.keys(aoiGraphicsRef.current).filter((k) =>
      k.startsWith("temp-")
    );
    tempKeys.forEach((k) => {
      const entry = aoiGraphicsRef.current[k];
      if (drawLayer && entry) {
        drawLayer.remove(entry.polygon);
        if (entry.label) drawLayer.remove(entry.label);
        delete aoiGraphicsRef.current[k];
      }
    });

    // Notify Emitters
    window.dispatchEvent(
      new CustomEvent("AOI_ADDED", {
        detail: { id: newId, name: savedAOI?.payload?.areaName ?? "New AOI" },
      })
    );

    // Fetch and Draw real AOI
    try {
      let res,
        attempts = 0;
      do {
        await new Promise((r) => setTimeout(r, 400));
        res = await AOIbyID(newId);
        attempts++;
      } while (attempts < 8 && !res?.payload?.areaInterestCoordinateDtos);

      if (res?.statusCode === 200 && res?.payload) {
        drawAOIFromFetchedData(res.payload, true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==================== Render ====================

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      <AOIModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAdd={handleModalSave}
      />

      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "4px 8px",
          borderRadius: 6,
          fontSize: 12,
        }}
      >
        🟢 Inside AOI &nbsp;&nbsp; 🔴 Outside AOI
      </div>

      {/* 2D/3D Toggle */}
      <div style={{ position: "absolute", bottom: 165, right: 60 }}>
        <Button
          size="sm"
          // onClick={() => setIs3D(!is3D)}
          className="!py-2 w-8 h-8 bg-[#414141] hover:bg-gray-600"
          title={is3D ? "Switch to 2D" : "Switch to 3D"}
        >
          <TfiLocationArrow className={is3D ? "text-blue-400" : "text-white"} />
        </Button>
      </div>

      {/* Recenter */}
      <div style={{ position: "absolute", bottom: 120, right: 60 }}>
        <Button
          size="sm"
          onClick={handleRecenter}
          className="!py-2 w-8 h-8 bg-[#414141] hover:bg-gray-600"
          title="Recenter Map"
        >
          <MdMyLocation />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div style={{ position: "absolute", bottom: 30, right: 64 }}>
        <div className="flex flex-col items-center">
          <Button
            size="sm"
            onClick={handleZoomIn}
            className="!py-2 w-8 h-8 bg-[#414141] rounded-b-none hover:bg-gray-600"
          >
            <Plus className="h-10 w-10" />
          </Button>
          <Separator className="bg-white/50" />
          <Button
            size="sm"
            onClick={handleZoomOut}
            className="!py-2 w-8 h-8 bg-[#414141] rounded-t-none hover:bg-gray-600"
          >
            <Minus className="h-10 w-10" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Debug Utility ---
window.debugMapLayers = () => {
  const view = window.mapViewRef;
  if (!view || !view.map) {
    console.warn("No MapView found.");
    return;
  }

  console.group("ArcGIS Layer Debug");
  view.map.allLayers.forEach((layer) => {
    console.log(`[${layer.type}]`, layer.title || layer.id, layer);
    if (layer.type === "graphics") {
      console.log(
        "Graphics in layer:",
        layer.graphics.items.map((g) => ({
          id: g.attributes?.aoiId,
          symbol: g.symbol?.type,
          geom: g.geometry?.type,
          text: g.symbol?.text || null,
        }))
      );
    }
  });
  console.groupEnd();
};
export default PlatformMaps;
