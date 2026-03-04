// import { useEffect, useState, useRef } from "react";
// import Graphic from "@arcgis/core/Graphic";
// import Point from "@arcgis/core/geometry/Point";
// import * as turf from "@turf/turf";
// import friendlyPin from "../../assets/images/MapPinFriendly.png"; // Adjust
// import enemyPin from "../../assets/images/MapPinEnemy.png"; // Adjust
// import {
//   fetchAllEmitter,
//   fetchAllStandAloneEmitters,
// } from "../../services/AdroneServices";

// export const useEmitterManagement = (view, missionId) => {
//   const [emitterList, setEmitterList] = useState([]);
//   const [independentEmitters, setIndependentEmitters] = useState([]);
//   const allAoiPolygonsRef = useRef([]);

//   // 1. Fetch Data
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const eData = await fetchAllEmitter();
//         if (eData.statusCode === 200) setEmitterList(eData.payload);

//         const iData = await fetchAllStandAloneEmitters();
//         if (iData.statusCode === 200) setIndependentEmitters(iData.payload);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     load();
//   }, []);

//   // 2. Clear Emitters on Mission Change
//   useEffect(() => {
//     if (!view) return;
//     const toRemove = view.graphics.items.filter(
//       (g) =>
//         g.attributes?.id?.startsWith("E") ||
//         g.attributes?.id?.startsWith("IND-")
//     );
//     toRemove.forEach((g) => view.graphics.remove(g));

//     setEmitterList([]);
//     setIndependentEmitters([]);
//     allAoiPolygonsRef.current = [];
//   }, [missionId, view]);

//   // 3. Main Logic: Listen for AOI changes and Re-calculate Emitters
//   useEffect(() => {
//     const handleAoiAdded = (e) => {
//       const { geometry, refreshOnly } = e.detail || {};
//       if ((!geometry && !refreshOnly) || !view) return;

//       if (geometry) {
//         window.__lastAoiGeometry__ = geometry;
//         allAoiPolygonsRef.current.push(turf.polygon([geometry.rings[0]]));
//       } else if (refreshOnly) {
//         // Rebuild turf polygons from scratch based on global/ref if needed,
//         // but typically AOI removal handles its own state.
//         // For simplicity based on original code, we rely on existing cache or rebuild:
//         // (Note: The original code had a partial bug here regarding removal not updating the ref array perfectly,
//         // but we will implement the redrawing logic securely).
//       }

//       // Cleanup existing
//       const toRemove = view.graphics.items.filter(
//         (g) =>
//           g.attributes?.id?.startsWith("E") ||
//           g.attributes?.id?.startsWith("IND-")
//       );
//       toRemove.forEach((g) => view.graphics.remove(g));

//       if (allAoiPolygonsRef.current.length === 0 && !refreshOnly) return;

//       const isInsideAnyAoi = (point) =>
//         allAoiPolygonsRef.current.some((poly) =>
//           turf.booleanPointInPolygon(point, poly)
//         );

//       const plot = (list, isInd) => {
//         list.forEach((em) => {
//           const lat = parseFloat(em.latitude);
//           const lon = parseFloat(em.longitude);
//           if (!isFinite(lat)) return;

//           const point = turf.point([lon, lat]);
//           const inside = isInsideAnyAoi(point);

//           const ptGeom = new Point({
//             longitude: lon,
//             latitude: lat,
//             spatialReference: { wkid: 4326 },
//           });

//           const g = new Graphic({
//             geometry: ptGeom,
//             symbol: {
//               type: "picture-marker",
//               url: inside ? friendlyPin : enemyPin,
//               width: "20px",
//               height: "30px",
//             },
//             attributes: {
//               id: `${isInd ? "IND-" : "E"}${em.emitterId}`,
//               name: em.emitterName,
//               _inside: inside,
//             },
//           });

//           const label = new Graphic({
//             geometry: ptGeom,
//             symbol: {
//               type: "text",
//               text: em.emitterName || (isInd ? "Ind-" : "E") + em.emitterId,
//               color: "white",
//               haloColor: "black",
//               haloSize: 2,
//               yoffset: -25,
//               font: { size: 12, weight: "bold" },
//             },
//             attributes: { id: `${isInd ? "IND-" : "E"}${em.emitterId}` },
//           });

//           view.graphics.addMany([g, label]);
//         });
//       };

//       plot(emitterList, false);
//       plot(independentEmitters, true);
//     };

//     window.addEventListener("AOI_ADDED", handleAoiAdded);
//     return () => window.removeEventListener("AOI_ADDED", handleAoiAdded);
//   }, [emitterList, independentEmitters, view]);

//   // Initial trigger if data loads late
//   useEffect(() => {
//     if (independentEmitters.length > 0 && window.__lastAoiGeometry__) {
//       window.dispatchEvent(
//         new CustomEvent("AOI_ADDED", {
//           detail: { geometry: window.__lastAoiGeometry__ },
//         })
//       );
//     }
//   }, [independentEmitters]);
// };

import { useEffect, useState, useRef } from "react";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import * as turf from "@turf/turf";
import friendlyPin from "../../assets/images/MapPinFriendly.png";
import enemyPin from "../../assets/images/MapPinEnemy.png";
import {
  fetchAllEmitter,
  fetchAllStandAloneEmitters,
} from "../../services/AdroneServices";

export const useEmitterManagement = (view, missionId) => {
  const [emitterList, setEmitterList] = useState([]);
  const [independentEmitters, setIndependentEmitters] = useState([]);
  const activeTurfPolygonsRef = useRef([]);

  // Fetch Data (Runs only on mount)
  useEffect(() => {
    const load = async () => {
      try {
        const eData = await fetchAllEmitter();
        if (eData.statusCode === 200) setEmitterList(eData.payload);
        const iData = await fetchAllStandAloneEmitters();
        if (iData.statusCode === 200) setIndependentEmitters(iData.payload);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []); // Only runs once

  // Data Cleanup (Runs ONLY when missionId changes)
  useEffect(() => {
    setEmitterList([]);
    setIndependentEmitters([]);
    // We don't clear activeTurfPolygonsRef here necessarily,
    // but the next AOI update will handle it.
  }, [missionId]);

  // View Cleanup (Runs when view changes, e.g., 2D<->3D toggle)
  useEffect(() => {
    if (!view) return;

    // Clear graphics from the *previous* view (or current before unmount)
    // Note: ArcGIS usually handles cleanup when view.destroy() is called,
    // but this ensures we don't leave references.
    return () => {
      if (view && !view.destroyed) {
        const toRemove = view.graphics.items.filter(
          (g) =>
            g.attributes?.id?.startsWith("E") ||
            g.attributes?.id?.startsWith("IND-")
        );
        toRemove.forEach((g) => view.graphics.remove(g));
      }
    };
  }, [view]);

  //  Main Logic: Plot Emitters
  // This will run automatically when 'view' updates because 'view' is in the dependency array
  useEffect(() => {
    // If we have no view, we can't plot.
    if (!view) return;

    // Define the plotting function
    const plotEmitters = () => {
      // Clear existing emitters first to avoid duplicates
      const toRemove = view.graphics.items.filter(
        (g) =>
          g.attributes?.id?.startsWith("E") ||
          g.attributes?.id?.startsWith("IND-")
      );
      toRemove.forEach((g) => view.graphics.remove(g));

      // If no AOIs, stop (or plot all as enemy if that's your requirement)
      // Based on your previous logic, you hide them if no AOI exists.
      if (activeTurfPolygonsRef.current.length === 0) {
        // However, on a View Refresh, we might want to wait for AOIs to load.
        // But if you want them invisible initially, return.
        return;
      }

      const isInsideAnyAoi = (point) =>
        activeTurfPolygonsRef.current.some((poly) =>
          turf.booleanPointInPolygon(point, poly)
        );

      const plot = (list, isInd) => {
        const graphicsToAdd = [];
        list.forEach((em) => {
          const lat = parseFloat(em.latitude);
          const lon = parseFloat(em.longitude);
          if (!isFinite(lat)) return;

          const point = turf.point([lon, lat]);
          const inside = isInsideAnyAoi(point);

          const ptGeom = new Point({
            longitude: lon,
            latitude: lat,
            spatialReference: { wkid: 4326 },
          });
          const iconUrl = inside ? friendlyPin : enemyPin;

          const g = new Graphic({
            geometry: ptGeom,
            symbol: {
              type: "picture-marker",
              url: iconUrl,
              width: "20px",
              height: "30px",
            },
            attributes: {
              id: `${isInd ? "IND-" : "E"}${em.emitterId}`,
              name: em.emitterName,
              _inside: inside,
            },
          });

          const label = new Graphic({
            geometry: ptGeom,
            symbol: {
              type: "text",
              text: em.emitterName || (isInd ? "Ind-" : "E") + em.emitterId,
              color: "white",
              haloColor: "black",
              haloSize: 2,
              yoffset: -25,
              font: {
                size: 12,
                family: "arial-unicode-ms-regular",
                weight: "bold",
              },
            },
            attributes: { id: `${isInd ? "IND-" : "E"}${em.emitterId}` },
          });

          graphicsToAdd.push(g, label);
        });
        view.graphics.addMany(graphicsToAdd);
      };

      plot(emitterList, false);
      plot(independentEmitters, true);
    };

    const handleAoiAdded = (e) => {
      const { geometry, activeGeometries } = e.detail || {};

      if (activeGeometries) {
        activeTurfPolygonsRef.current = activeGeometries
          .map((geom) => (geom.rings ? turf.polygon(geom.rings) : null))
          .filter(Boolean);
      } else if (geometry) {
        window.__lastAoiGeometry__ = geometry;
        activeTurfPolygonsRef.current.push(turf.polygon([geometry.rings[0]]));
      }

      plotEmitters();
    };

    window.addEventListener("AOI_ADDED", handleAoiAdded);

    // EDGE CASE: On View Toggle, AOI_ADDED might have fired before this hook was ready.
    // Since useAOIManagement refetches AOIs on view load, it will likely fire again.
    // But if we already have data and AOIs, we should plot immediately.
    if (
      activeTurfPolygonsRef.current.length > 0 &&
      (emitterList.length > 0 || independentEmitters.length > 0)
    ) {
      plotEmitters();
    }

    return () => window.removeEventListener("AOI_ADDED", handleAoiAdded);
  }, [emitterList, independentEmitters, view]); // Re-runs when data or view is ready

  // Retry Mechanism
  // Triggers an update if data arrives after the view is ready
  useEffect(() => {
    if (
      (independentEmitters.length > 0 || emitterList.length > 0) &&
      window.__lastAoiGeometry__
    ) {
      window.dispatchEvent(
        new CustomEvent("AOI_ADDED", {
          detail: { geometry: window.__lastAoiGeometry__ },
        })
      );
    }
  }, [independentEmitters, emitterList]);
};;
