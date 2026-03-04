// import { useEffect, useRef, useState } from "react";
// import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
// import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
// import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
// import Graphic from "@arcgis/core/Graphic";
// import Polygon from "@arcgis/core/geometry/Polygon";
// import * as turf from "@turf/turf";
// import { useAoiStore } from "../../store/missionStore";
// import { fetchMissionTree, AOIbyID } from "../../services/AdroneServices";

// export const useAOIManagement = (
//   view,
//   drawLayer,
//   is3D,
//   missionId,
//   isMapReady
// ) => {
//   const sketchVMRef = useRef(null);
//   const aoiGraphicsRef = useRef({});
//   const allAoiPolygonsRef = useRef([]);

//   const { isDrawingAOI, stopDrawing, openModal } = useAoiStore();

//   // ----------------------------------------------------
//   // 1. Initialize SketchViewModel
//   // ----------------------------------------------------
//   useEffect(() => {
//     if (!view || !drawLayer || !isMapReady) return;

//     const sketchVM = new SketchViewModel({
//       view,
//       layer: drawLayer,
//       creationMode: "single",
//       defaultCreateOptions: { hasZ: false },
//       updateOnGraphicClick: false,
//       defaultUpdateOptions: {
//         tool: null,
//         enableRotation: false,
//         enableScaling: false,
//       },
//       polygonSymbol: {
//         type: "simple-fill",
//         color: [64, 160, 255, 0.4],
//         outline: { color: [64, 160, 255, 1], width: 2 },
//       },
//       snappingOptions: {
//         enabled: true,
//         featureSources: [{ layer: drawLayer, enabled: true }],
//       },
//     });

//     sketchVMRef.current = sketchVM;

//     sketchVM.on("update", (event) => {
//       event.preventDefault();
//       sketchVM.cancel();
//     });

//     return () => sketchVM.destroy();
//   }, [view, drawLayer, isMapReady]);

//   // ----------------------------------------------------
//   // 2. Handle Drawing Logic (Create)
//   // ----------------------------------------------------
//   useEffect(() => {
//     const vm = sketchVMRef.current;
//     if (!vm) return;

//     if (isDrawingAOI) {
//       if (is3D) {
//         alert("AOI Drawing is not available in 3D mode. Please switch to 2D.");
//         stopDrawing();
//         return;
//       }

//       console.log("Activating Draw Tool (2D Only)");
//       vm.create("polygon");

//       const handleCreate = (evt) => {
//         if (evt.state !== "complete") return;

//         const geom = evt.graphic.geometry;
//         let geom4326;

//         if (geom.spatialReference.isWebMercator) {
//           geom4326 = webMercatorUtils.webMercatorToGeographic(geom);
//         } else {
//           geom4326 = geom;
//         }

//         const area_m2 = geometryEngine.geodesicArea(geom4326, "square-meters");
//         const perimeter_m = geometryEngine.geodesicLength(geom4326, "meters");
//         const area_km2 = Number((area_m2 / 1_000_000).toFixed(2));
//         const perimeter_km = Number((perimeter_m / 1_000).toFixed(2));

//         let rings = geom4326?.rings?.[0] || [];
//         // Ensure closed ring
//         if (
//           rings.length > 1 &&
//           rings[0][0] === rings[rings.length - 1][0] &&
//           rings[0][1] === rings[rings.length - 1][1]
//         ) {
//           rings = rings.slice(0, -1);
//         }

//         const results = rings.map(([lon, lat, z]) => ({
//           geometry: { latitude: lat, longitude: lon, z: z || 0 },
//         }));

//         const points = results.map((res) => {
//           const { latitude, longitude, z } = res.geometry;
//           return {
//             lat: `${latitude.toFixed(6)}° N`,
//             long: `${longitude.toFixed(6)}° E`,
//             alt: `${z.toFixed(1)} m`,
//             raw: { lat: latitude, long: longitude, alt: z },
//           };
//         });

//         const tempId = `temp-${Date.now()}`;

//         const polygonGraphic = new Graphic({
//           geometry: geom4326,
//           symbol: {
//             type: "simple-fill",
//             color: [64, 160, 255, 0.2],
//             outline: { color: [64, 160, 255, 1], width: 2 },
//           },
//           attributes: { locked: true, aoiId: tempId, isTemp: true },
//         });

//         // --- Offline Font Family ---
//         const labelGraphic = new Graphic({
//           geometry: geom4326.centroid,
//           symbol: {
//             type: "text",
//             text: "New AOI",
//             color: "white",
//             haloColor: "black",
//             haloSize: 2,
//             font: {
//               size: 12,
//               family: "arial-unicode-ms-regular", // <--- CHANGED FONT HERE EX:"Arial"
//               weight: "bold",
//             },
//           },
//           attributes: { aoiId: tempId },
//         });

//         drawLayer.addMany([polygonGraphic, labelGraphic]);

//         aoiGraphicsRef.current[tempId] = {
//           polygon: polygonGraphic,
//           label: labelGraphic,
//           isTemp: true,
//         };

//         openModal({ area: area_km2, perimeter: perimeter_km, points, tempId });

//         vm.cancel();
//         vm.updateOnGraphicClick = false;
//         stopDrawing();
//       };

//       const handle = vm.on("create", handleCreate);
//       return () => handle.remove();
//     }
//   }, [isDrawingAOI, is3D]);

//   // ----------------------------------------------------
//   // 3. Cleanup on Mission Change
//   // ----------------------------------------------------
//   useEffect(() => {
//     if (!drawLayer || !view) return;

//     console.log(`Selective cleanup for new missionId ${missionId}`);

//     const toRemove = view.graphics.items.filter(
//       (g) => g.attributes?.aoiId || g.attributes?.isTemp
//     );
//     toRemove.forEach((g) => view.graphics.remove(g));

//     if (drawLayer) {
//       drawLayer.removeAll();
//     }

//     aoiGraphicsRef.current = {};
//     allAoiPolygonsRef.current = [];

//     delete window.__lastAoiGeometry__;
//     localStorage.removeItem("aois_mission_" + missionId);

//     console.log("Map reset complete — platform visuals preserved.");
//   }, [missionId, drawLayer, view]);

//   // ----------------------------------------------------
//   // 4. Helper: Draw AOI from Fetched Data
//   // ----------------------------------------------------
//   const drawAOIFromFetchedData = (data, recenter = true) => {
//     if (!drawLayer || !view) return;

//     // --- Cleanup  Graphics ---
//     drawLayer.graphics.items
//       .filter((g) => g.geometry?.type === "polygon" && !g.attributes?.aoiId)
//       .forEach((g) => {
//         console.log("Removing orphan AOI graphic");
//         drawLayer.remove(g);
//       });

//     if (!data?.areaInterestCoordinateDtos?.length) return;

//     const coords = data.areaInterestCoordinateDtos
//       .map((c) => [parseFloat(c.longitude), parseFloat(c.latitude)])
//       .filter(([lon, lat]) => isFinite(lon) && isFinite(lat));

//     if (coords.length < 3) return;

//     const first = coords[0];
//     const last = coords[coords.length - 1];
//     if (first[0] !== last[0] || first[1] !== last[1]) coords.push([...first]);

//     const polygon = new Polygon({
//       rings: [coords],
//       spatialReference: { wkid: 4326 },
//     });

//     const color = [
//       Math.floor(Math.random() * 255),
//       Math.floor(Math.random() * 255),
//       255,
//       0.25,
//     ];

//     const polyGraphic = new Graphic({
//       geometry: polygon,
//       symbol: { type: "simple-fill", color, outline: { color, width: 2 } },
//       attributes: { aoiId: String(data.areaInterestId) },
//     });

//     // --- Offline Font Family ---
//     const labelGraphic = new Graphic({
//       geometry: polygon.centroid,
//       symbol: {
//         type: "text",
//         text: data.areaName || "AOI",
//         color: "white",
//         haloColor: "black",
//         haloSize: 2,
//         font: {
//           size: 12,
//           family: "arial-unicode-ms-regular", // <--- CHANGED FONT HERE EX:"Arial"
//           weight: "bold",
//         },
//       },
//       attributes: { aoiId: String(data.areaInterestId) },
//     });

//     // Remove graphics existing before adding
//     const existing = drawLayer.graphics.items.filter(
//       (g) => g.attributes?.aoiId === String(data.areaInterestId)
//     );
//     existing.forEach((g) => drawLayer.remove(g));

//     drawLayer.addMany([polyGraphic, labelGraphic]);
//     aoiGraphicsRef.current[data.areaInterestId.toString()] = {
//       polygon: polyGraphic,
//       label: labelGraphic,
//     };

//     if (recenter && polygon.extent) {
//       view.goTo(polygon.extent.expand(1.2)).catch(() => {});
//     }

//     console.log("AOI drawn:", data.areaName);

//     window.dispatchEvent(
//       new CustomEvent("AOI_ADDED", {
//         detail: {
//           id: data.areaInterestId,
//           name: data.areaName || "Fetched AOI",
//           geometry: polygon.toJSON(),
//         },
//       })
//     );
//   };

//   // ----------------------------------------------------
//   // 5. Fetch Mission Tree (with Wait Interval)
//   // ----------------------------------------------------
//   useEffect(() => {
//     const fetchAndDrawAOIs = async () => {
//       try {
//         if (!missionId) return;
//         console.log(`Fetching Mission Tree for missionId: ${missionId}`);
//         const treeRes = await fetchMissionTree(missionId);

//         if (treeRes.statusCode !== 200 || !treeRes.payload) return;

//         const aois = treeRes.payload.areaInterests || [];
//         console.log(`Found ${aois.length} AOIs in mission tree`);

//         localStorage.setItem(
//           "aois_mission_" + missionId,
//           JSON.stringify(aois.map((a) => a.areaInterestId))
//         );

//         for (const aoi of aois) {
//           let aoiObj = aoi;
//           if (
//             !aoi.areaInterestCoordinateDtos ||
//             aoi.areaInterestCoordinateDtos.length < 3
//           ) {
//             const res = await AOIbyID(aoi.areaInterestId);
//             if (res.statusCode === 200 && res.payload) aoiObj = res.payload;
//           }
//           drawAOIFromFetchedData(aoiObj, false);
//         }
//       } catch (err) {
//         console.error("Error fetching AOIs:", err);
//       }
//     };

//     // Use interval to ensure map is truly ready
//     const interval = setInterval(() => {
//       if (view && drawLayer) {
//         clearInterval(interval);
//         fetchAndDrawAOIs();
//       }
//     }, 500);

//     return () => clearInterval(interval);
//   }, [missionId, is3D, view, drawLayer]);

//   // ----------------------------------------------------
//   // 6. AOI Events (Update/Remove)
//   // ----------------------------------------------------
//   useEffect(() => {
//     const handleUpdate = (e) => {
//       const { id, points, name } = e.detail || {};
//       if (!id) return;

//       const key = String(id);
//       const existing = aoiGraphicsRef.current[key];

//       // Rename logic
//       if (name && existing?.label) {
//         const sym = existing.label.symbol.clone();
//         sym.text = name;
//         existing.label.symbol = sym;
//         console.log(`AOI ${id} renamed to: ${name}`);
//       }

//       if (!points || points.length < 3) return;

//       let coords = points
//         .map((p) => {
//           const raw = p.raw ?? p;
//           let lat = parseFloat(raw.lat);
//           let lon = parseFloat(raw.long);

//           // Protection against swapped Lat/Long
//           if (Math.abs(lat) > 90 && Math.abs(lon) <= 90) {
//             [lat, lon] = [lon, lat];
//           }
//           return isFinite(lat) && isFinite(lon) ? [lon, lat] : null;
//         })
//         .filter(Boolean);

//       if (coords.length < 3) return;

//       const first = coords[0];
//       const last = coords[coords.length - 1];
//       if (first[0] !== last[0] || first[1] !== last[1]) {
//         coords.push([...first]);
//       }

//       const newPolygon = new Polygon({
//         rings: [coords],
//         spatialReference: { wkid: 4326 },
//       });

//       if (existing) {
//         existing.polygon.geometry = newPolygon;
//         if (existing.label) existing.label.geometry = newPolygon.centroid;
//         console.log(`AOI ${id} geometry updated`);
//       } else if (drawLayer) {
//         // Creation logic if update event fires for non-existent graphic
//         const newGraphic = new Graphic({
//           geometry: newPolygon,
//           symbol: {
//             type: "simple-fill",
//             color: [64, 160, 255, 0.2],
//             outline: { color: [64, 160, 255, 1], width: 2 },
//           },
//         });

//         // --- Offline Font Family ---
//         const label = new Graphic({
//           geometry: newPolygon.centroid,
//           symbol: {
//             type: "text",
//             text: name || `AOI_${id}`,
//             color: "white",
//             haloColor: "black",
//             haloSize: 2,
//             font: {
//               size: 12,
//               family: "arial-unicode-ms-regular",
//               weight: "bold",
//             },
//           },
//         });
//         drawLayer.addMany([newGraphic, label]);
//         aoiGraphicsRef.current[id] = { polygon: newGraphic, label };
//         console.log(`AOI ${id} created`);
//       }

//       if (view && newPolygon.extent) {
//         view.goTo(newPolygon.extent.expand(1.2)).catch(() => {});
//       }
//     };

//     const handleRemove = (e) => {
//       const { id, tempId } = e.detail || {};
//       const removalId = String(id || tempId);
//       if (!removalId) return;

//       const entry = aoiGraphicsRef.current[removalId];

//       if (entry && drawLayer) {
//         if (entry.polygon) drawLayer.remove(entry.polygon);
//         if (entry.label) drawLayer.remove(entry.label);

//         delete aoiGraphicsRef.current[removalId];

//         // Re-calculate all polygons for emitter check
//         allAoiPolygonsRef.current = Object.values(aoiGraphicsRef.current)
//           .map((item) => {
//             if (!item.polygon || !item.polygon.geometry) return null;
//             return geometryEngine.fromJSON(item.polygon.geometry);
//           })
//           .filter(Boolean);

//         // Dispatch refresh only event
//         window.dispatchEvent(
//           new CustomEvent("AOI_ADDED", {
//             detail: { geometry: null, refreshOnly: true },
//           })
//         );

//         console.log(`AOI ${removalId} removed. Emitters turning red...`);
//       }
//     };

//     window.addEventListener("AOI_UPDATED", handleUpdate);
//     window.addEventListener("AOI_REMOVED", handleRemove);
//     return () => {
//       window.removeEventListener("AOI_UPDATED", handleUpdate);
//       window.removeEventListener("AOI_REMOVED", handleRemove);
//     };
//   }, [drawLayer, view]);

//   return { drawAOIFromFetchedData, aoiGraphicsRef };
// };

import { useEffect, useRef } from "react";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import { useAoiStore } from "../../store/missionStore";
import { fetchMissionTree, AOIbyID } from "../../services/AdroneServices";
import { useResponseModal } from "../../context/ResponseModalContext";

export const useAOIManagement = (
  view,
  drawLayer,
  is3D,
  missionId,
  isMapReady
) => {
  const sketchVMRef = useRef(null);
  const aoiGraphicsRef = useRef({});
  const { isDrawingAOI, stopDrawing, openModal } = useAoiStore();
  const { open } = useResponseModal();
  // --- HELPER: Get all active geometries for the Emitter hook ---
  const getActiveGeometries = () => {
    return Object.values(aoiGraphicsRef.current)
      .map((item) => item.polygon?.geometry?.toJSON())
      .filter(Boolean);
  };

  // 1. Initialize SketchViewModel
  useEffect(() => {
    if (!view || !drawLayer || !isMapReady) return;

    const sketchVM = new SketchViewModel({
      view,
      layer: drawLayer,
      creationMode: "single",
      defaultCreateOptions: { hasZ: false },
      updateOnGraphicClick: false,
      defaultUpdateOptions: {
        tool: null,
        enableRotation: false,
        enableScaling: false,
      },
      polygonSymbol: {
        type: "simple-fill",
        color: [64, 160, 255, 0.4],
        outline: { color: [64, 160, 255, 1], width: 2 },
      },
      snappingOptions: {
        enabled: true,
        featureSources: [{ layer: drawLayer, enabled: true }],
      },
    });

    sketchVMRef.current = sketchVM;

    sketchVM.on("update", (event) => {
      event.preventDefault();
      sketchVM.cancel();
    });

    return () => sketchVM.destroy();
  }, [view, drawLayer, isMapReady]);

  // 2. Handle Drawing Logic
  useEffect(() => {
    const vm = sketchVMRef.current;
    if (!vm) return;

    if (isDrawingAOI) {
      if (is3D) {
        open({
          type: "error",
          title: "AOI Error",
          message:
            "AOI Drawing is not available in 3D mode. Please switch to 2D.",
          confirmText: "OKAY",
        });
        stopDrawing();
        return;
      }

      console.log("Activating Draw Tool (2D Only)");
      vm.create("polygon");

      const handleCreate = (evt) => {
        if (evt.state !== "complete") return;

        const geom = evt.graphic.geometry;
        let geom4326 = geom.spatialReference.isWebMercator
          ? webMercatorUtils.webMercatorToGeographic(geom)
          : geom;

        const area_m2 = geometryEngine.geodesicArea(geom4326, "square-meters");
        const perimeter_m = geometryEngine.geodesicLength(geom4326, "meters");
        const area_km2 = Number((area_m2 / 1_000_000).toFixed(2));
        const perimeter_km = Number((perimeter_m / 1_000).toFixed(2));

        let rings = geom4326?.rings?.[0] || [];
        if (rings.length > 1 && rings[0][0] === rings[rings.length - 1][0]) {
          rings = rings.slice(0, -1);
        }

        const points = rings.map(([lon, lat, z]) => ({
          lat: `${lat.toFixed(6)}° N`,
          long: `${lon.toFixed(6)}° E`,
          alt: `${(z || 0).toFixed(1)} m`,
          raw: { lat, long: lon, alt: z || 0 },
        }));

        const tempId = `temp-${Date.now()}`;

        const polygonGraphic = new Graphic({
          geometry: geom4326,
          symbol: {
            type: "simple-fill",
            color: [64, 160, 255, 0.2],
            outline: { color: [64, 160, 255, 1], width: 2 },
          },
          attributes: { locked: true, aoiId: tempId, isTemp: true },
        });

        const labelGraphic = new Graphic({
          geometry: geom4326.centroid,
          symbol: {
            type: "text",
            text: "New AOI",
            color: "white",
            haloColor: "black",
            haloSize: 2,
            font: {
              size: 12,
              family: "arial-unicode-ms-regular",
              weight: "bold",
            },
          },
          attributes: { aoiId: tempId },
        });

        drawLayer.addMany([polygonGraphic, labelGraphic]);
        aoiGraphicsRef.current[tempId] = {
          polygon: polygonGraphic,
          label: labelGraphic,
          isTemp: true,
        };

        // *** FIX: REMOVED THE DISPATCH EVENT FROM HERE ***
        // We do NOT tell the app about the AOI yet. We wait for the user to Save in the Modal.

        openModal({ area: area_km2, perimeter: perimeter_km, points, tempId });
        vm.cancel();
        stopDrawing();
      };

      const handle = vm.on("create", handleCreate);
      return () => handle.remove();
    }
  }, [isDrawingAOI, is3D]);

  // 3. Cleanup on Mission Change
  useEffect(() => {
    if (!drawLayer || !view) return;
    const toRemove = view.graphics.items.filter(
      (g) => g.attributes?.aoiId || g.attributes?.isTemp
    );
    toRemove.forEach((g) => view.graphics.remove(g));
    drawLayer.removeAll();
    aoiGraphicsRef.current = {};

    // Broadcast empty state to clear emitters
    window.dispatchEvent(
      new CustomEvent("AOI_ADDED", {
        detail: { activeGeometries: [], refreshOnly: true },
      })
    );

    localStorage.removeItem("aois_mission_" + missionId);
  }, [missionId, drawLayer, view]);

  // 4. Helper: Draw AOI from Fetched Data
  const drawAOIFromFetchedData = (data, recenter = true) => {
    if (!drawLayer || !view || !data?.areaInterestCoordinateDtos?.length)
      return;

    drawLayer.graphics.items
      .filter((g) => g.geometry?.type === "polygon" && !g.attributes?.aoiId)
      .forEach((g) => drawLayer.remove(g));

    const coords = data.areaInterestCoordinateDtos
      .map((c) => [parseFloat(c.longitude), parseFloat(c.latitude)])
      .filter(([lon, lat]) => isFinite(lon) && isFinite(lat));

    if (coords.length < 3) return;
    if (coords[0][0] !== coords[coords.length - 1][0])
      coords.push([...coords[0]]);

    const polygon = new Polygon({
      rings: [coords],
      spatialReference: { wkid: 4326 },
    });
    const color = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      255,
      0.25,
    ];

    const polyGraphic = new Graphic({
      geometry: polygon,
      symbol: { type: "simple-fill", color, outline: { color, width: 2 } },
      attributes: { aoiId: String(data.areaInterestId) },
    });

    const labelGraphic = new Graphic({
      geometry: polygon.centroid,
      symbol: {
        type: "text",
        text: data.areaName || "AOI",
        color: "white",
        haloColor: "black",
        haloSize: 2,
        font: { size: 12, family: "arial-unicode-ms-regular", weight: "bold" },
      },
      attributes: { aoiId: String(data.areaInterestId) },
    });

    const existing = drawLayer.graphics.items.filter(
      (g) => g.attributes?.aoiId === String(data.areaInterestId)
    );
    existing.forEach((g) => drawLayer.remove(g));

    drawLayer.addMany([polyGraphic, labelGraphic]);
    aoiGraphicsRef.current[data.areaInterestId.toString()] = {
      polygon: polyGraphic,
      label: labelGraphic,
    };

    if (recenter && polygon.extent)
      view.goTo(polygon.extent.expand(1.2)).catch(() => {});

    // --- DISPATCH EVENT: This is where we update Sidebar and Emitters ---
    window.dispatchEvent(
      new CustomEvent("AOI_ADDED", {
        detail: {
          id: data.areaInterestId,
          name: data.areaName || "Fetched AOI",
          geometry: polygon.toJSON(),
          activeGeometries: getActiveGeometries(),
        },
      })
    );
  };

  // 5. Fetch Mission Tree
  useEffect(() => {
    const fetchAndDrawAOIs = async () => {
      try {
        if (!missionId) return;
        const treeRes = await fetchMissionTree(missionId);
        if (treeRes.statusCode !== 200 || !treeRes.payload) return;
        const aois = treeRes.payload.areaInterests || [];
        localStorage.setItem(
          "aois_mission_" + missionId,
          JSON.stringify(aois.map((a) => a.areaInterestId))
        );
        for (const aoi of aois) {
          let aoiObj = aoi;
          if (
            !aoi.areaInterestCoordinateDtos ||
            aoi.areaInterestCoordinateDtos.length < 3
          ) {
            const res = await AOIbyID(aoi.areaInterestId);
            if (res.statusCode === 200 && res.payload) aoiObj = res.payload;
          }
          drawAOIFromFetchedData(aoiObj, false);
        }
      } catch (err) {
        console.error("Error fetching AOIs:", err);
      }
    };

    const interval = setInterval(() => {
      if (view && drawLayer) {
        clearInterval(interval);
        fetchAndDrawAOIs();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [missionId, is3D, view, drawLayer]);

  // 6. Events (Update/Remove)
  useEffect(() => {
    const handleUpdate = (e) => {
      const { id, points, name } = e.detail || {};
      if (!id) return;

      const key = String(id);
      const existing = aoiGraphicsRef.current[key];

      if (name && existing?.label) {
        const sym = existing.label.symbol.clone();
        sym.text = name;
        existing.label.symbol = sym;
      }

      if (points && points.length >= 3) {
        let coords = points.map((p) => {
          const raw = p.raw ?? p;
          let lat = parseFloat(raw.lat);
          let lon = parseFloat(raw.long);
          if (Math.abs(lat) > 90 && Math.abs(lon) <= 90)
            [lat, lon] = [lon, lat];
          return [lon, lat];
        });
        if (coords[0][0] !== coords[coords.length - 1][0])
          coords.push([...coords[0]]);

        const newPolygon = new Polygon({
          rings: [coords],
          spatialReference: { wkid: 4326 },
        });

        if (existing) {
          existing.polygon.geometry = newPolygon;
          if (existing.label) existing.label.geometry = newPolygon.centroid;
        }

        if (view && newPolygon.extent)
          view.goTo(newPolygon.extent.expand(1.2)).catch(() => {});
      }

      // Update Emitters on change
      window.dispatchEvent(
        new CustomEvent("AOI_ADDED", {
          detail: {
            activeGeometries: getActiveGeometries(),
            refreshOnly: true,
          },
        })
      );
    };

    const handleRemove = (e) => {
      const { id, tempId } = e.detail || {};
      const removalId = String(id || tempId);
      if (!removalId) return;

      const entry = aoiGraphicsRef.current[removalId];
      if (entry && drawLayer) {
        if (entry.polygon) drawLayer.remove(entry.polygon);
        if (entry.label) drawLayer.remove(entry.label);
        delete aoiGraphicsRef.current[removalId];

        // Notify Emitters that an AOI is gone
        window.dispatchEvent(
          new CustomEvent("AOI_ADDED", {
            detail: {
              activeGeometries: getActiveGeometries(),
              refreshOnly: true,
            },
          })
        );
        console.log(`AOI ${removalId} removed.`);
      }
    };

    window.addEventListener("AOI_UPDATED", handleUpdate);
    window.addEventListener("AOI_REMOVED", handleRemove);
    return () => {
      window.removeEventListener("AOI_UPDATED", handleUpdate);
      window.removeEventListener("AOI_REMOVED", handleRemove);
    };
  }, [drawLayer, view]);

  return { drawAOIFromFetchedData, aoiGraphicsRef };
};
