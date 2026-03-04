// // import React from "react";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import Map from "@arcgis/core/Map";
// // import externalLink from "../assets/images/ExternalLink.svg";
// import Layer from "../../assets/images/LayerIconLiveMission.svg";
// import NavigationArrow from "../../assets/images/NavigationArrowLiveMission.svg";
// import Location from "../../assets/images/LocationIconLiveMission.svg";
// import ZoomIn from "../../assets/images/ZoomInLiveMission.svg";
// import ZoomOut from "../../assets/images/ZoomOutLiveMission.svg";
// import MapView from "@arcgis/core/views/MapView";
// import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
// import TileInfo from "@arcgis/core/layers/support/TileInfo";
// import SpatialReference from "@arcgis/core/geometry/SpatialReference";
// const LiveMissionMapCode = ({ telemetryData }) => {
//   const containerRef = useRef(null);
//   const [view, setView] = useState(null);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const map = new Map();
//     const customTileLayer = new WebTileLayer({
//       urlTemplate: `${window.location.origin}/Satellite/{z}/{x}/{y}.png`,
//       tileInfo: TileInfo.create({
//         dpi: 96,
//         format: "png",
//         spatialReference: new SpatialReference({ wkid: 3857 }),
//         rows: 256,
//         cols: 256,
//       }),
//       fetchOptions: { mode: "cors" },
//     });

//     // map.add(customTileLayer);
//     map.basemap = "satellite";
//     const mapView = new MapView({
//       container: containerRef.current,
//       map,
//       center: [78, 22],
//       zoom: 5,
//       ui: {
//         components: [], // <-- THIS REMOVES all default buttons/widgets
//       },
//     });

//     setView(mapView);

//     return () => mapView.destroy();
//   }, []);

//   return (
//     <div className="flex-1 border-[#545454] border-[2px] rounded-[16px] m-[20px] overflow-hidden relative">
//       {/* ArcGIS Map */}
//       <div ref={containerRef} className="w-full h-full" />

//       {/* --- TOP-RIGHT: Layers button --- */}
//       <div className="absolute top-[42px] right-[42px]">
//         <button className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-[5px] flex items-center justify-center border border-[#545454]">
//           <img src={Layer} />
//         </button>
//       </div>

//       {/* --- BOTTOM-RIGHT: Navigation & Zoom controls --- */}
//       <div className="absolute bottom-[42px] right-[42px] flex flex-col gap-[16px]">
//         <button className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-[5px] flex items-center justify-center border border-[#545454]">
//           <img src={NavigationArrow} />
//         </button>

//         {/* Location */}
//         <button className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-[5px] flex items-center justify-center border border-[#545454]">
//           <img src={Location} />
//         </button>

//         {/* Zoom controls (stacked tighter) */}
//         <div className="flex flex-col">
//           <button className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-t-[5px] flex items-center justify-center border border-[#545454]">
//             <img src={ZoomIn} />
//           </button>
//           <button className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-b-[5px] flex items-center justify-center border border-[#545454] border-t-0">
//             <img src={ZoomOut} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveMissionMapCode;

import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { useCsvFlightRenderer } from "@/hooks/useCsvFlightRenderer";

import Layer from "../../assets/images/LayerIconLiveMission.svg";
import NavigationArrow from "../../assets/images/NavigationArrowLiveMission.svg";
import Location from "../../assets/images/LocationIconLiveMission.svg";
import ZoomIn from "../../assets/images/ZoomInLiveMission.svg";
import ZoomOut from "../../assets/images/ZoomOutLiveMission.svg";

const LiveMissionMapCode = ({ CsvData }) => {
  console.log(
    "🗺️ LiveMissionMapCode props CsvData-------------------------------:",
    {
      CsvData,
      type: typeof CsvData,
      keys: CsvData ? Object.keys(CsvData) : "N/A",
    }
  );

  const containerRef = useRef(null);
  const [view, setView] = useState(null);
  const mapInstanceRef = useRef(null);
  const hasZoomedRef = useRef(false); // ✅ Track if we've already zoomed

  // ✅ Initialize map once
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new Map({
      basemap: "satellite",
    });

    mapInstanceRef.current = map;

    const mapView = new MapView({
      container: containerRef.current,
      map,
      center: [78, 22], // ✅ Default center (India)
      zoom: 5, // ✅ Default zoom (country level)
      ui: {
        components: [],
      },
    });

    setView(mapView);

    return () => {
      mapView.destroy();
    };
  }, []);

  // ✅ Use CSV flight renderer hook
  useCsvFlightRenderer({
    viewRef: { current: view },
    mapInstance: mapInstanceRef,
    csvData: CsvData,
    is3D: false,
  });

  // ✅ Auto-zoom to flight path when data first arrives
  useEffect(() => {
    if (!view || !CsvData || CsvData.length === 0 || hasZoomedRef.current)
      return;

    const validPoints = CsvData.filter(
      (d) =>
        d.Lat &&
        d.Long &&
        !isNaN(parseFloat(d.Lat)) &&
        !isNaN(parseFloat(d.Long))
    );

    if (validPoints.length === 0) return;

    // Calculate center of all points
    const avgLat =
      validPoints.reduce((sum, d) => sum + parseFloat(d.Lat), 0) /
      validPoints.length;
    const avgLon =
      validPoints.reduce((sum, d) => sum + parseFloat(d.Long), 0) /
      validPoints.length;

    console.log(
      `🎯 Auto-zooming to flight path at [${avgLat.toFixed(4)}, ${avgLon.toFixed(4)}]`
    );

    view
      .goTo({
        center: [avgLon, avgLat],
        zoom: 10,
        duration: 1500,
      })
      .then(() => {
        hasZoomedRef.current = true; // ✅ Mark as zoomed
        console.log("✅ Auto-zoom complete");
      });
  }, [view, CsvData]);

  // ✅ Zoom controls handlers
  const handleZoomIn = () => {
    if (view) {
      view.zoom = view.zoom + 1;
    }
  };

  const handleZoomOut = () => {
    if (view) {
      view.zoom = view.zoom - 1;
    }
  };

  // ✅ Manual center on flight path (can be used anytime)
  const handleCenterOnPath = () => {
    if (!view || !CsvData || CsvData.length === 0) return;

    const validPoints = CsvData.filter(
      (d) =>
        d.Lat &&
        d.Long &&
        !isNaN(parseFloat(d.Lat)) &&
        !isNaN(parseFloat(d.Long))
    );

    if (validPoints.length === 0) {
      console.warn("⚠️ No valid points to center on");
      return;
    }

    const avgLat =
      validPoints.reduce((sum, d) => sum + parseFloat(d.Lat), 0) /
      validPoints.length;
    const avgLon =
      validPoints.reduce((sum, d) => sum + parseFloat(d.Long), 0) /
      validPoints.length;

    view.goTo({
      center: [avgLon, avgLat],
      zoom: 12,
      duration: 1000,
    });
  };

  return (
    <div className="flex-1 border-[#545454] border-[2px] rounded-[16px] m-[20px] overflow-hidden relative">
      {/* ArcGIS Map */}
      <div ref={containerRef} className="w-full h-full" />

      {/* --- TOP-RIGHT: Layers button --- */}
      <div className="absolute top-[42px] right-[42px]">
        <button className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-[5px] flex items-center justify-center border border-[#545454]">
          <img src={Layer} alt="Layers" />
        </button>
      </div>

      {/* --- BOTTOM-RIGHT: Navigation & Zoom controls --- */}
      <div className="absolute bottom-[42px] right-[42px] flex flex-col gap-[16px]">
        <button className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-[5px] flex items-center justify-center border border-[#545454]">
          <img src={NavigationArrow} alt="Navigation" />
        </button>

        {/* Location - Center on flight path */}
        <button
          onClick={handleCenterOnPath}
          className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-[5px] flex items-center justify-center border border-[#545454]"
        >
          <img src={Location} alt="Center" />
        </button>

        {/* Zoom controls */}
        <div className="flex flex-col">
          <button
            onClick={handleZoomIn}
            className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-t-[5px] flex items-center justify-center border border-[#545454]"
          >
            <img src={ZoomIn} alt="Zoom In" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-[40px] h-[40px] bg-[#37383B] hover:bg-[#4B4B4B] rounded-b-[5px] flex items-center justify-center border border-[#545454] border-t-0"
          >
            <img src={ZoomOut} alt="Zoom Out" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveMissionMapCode;
