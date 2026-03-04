import React, { useEffect, useRef, useState } from "react";
import config from "@arcgis/core/config";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import BaseElevationLayer from "@arcgis/core/layers/BaseElevationLayer";
import Polyline from "@arcgis/core/geometry/Polyline";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Extent from "@arcgis/core/geometry/Extent";
import uavIcon from "../assets/images/uavpreview.png";
import FlightRoutes_ByMission from "../routeData/FlightRoutes_ByMission.json";
import { MdMyLocation } from "react-icons/md";
import { useAoiStore } from "../store/missionStore";
import { AOIModal } from "../components/aoi-modal";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import Polygon from "@arcgis/core/geometry/Polygon";
import {
  AOIbyID,
  fetchAllEmitter,
  fetchAllStandAloneEmitters,
  fetchMissionTree,
} from "../services/AdroneServices";
import * as turf from "@turf/turf";
import friendlyPin from "../../src/assets/images/MapPinFriendly.png";
import enemyPin from "../../src/assets/images/MapPinEnemy.png";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import { Button } from "../components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { TfiLocationArrow } from "react-icons/tfi";

// SET ASSETS PATH (Crucial for offline)
config.assetsPath = "/assets";

const HEADING_UPDATE_THRESH_DEG = 1.0;

const PlatformMaps = ({ missionId }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [fetchedAoi, setFetchedAoi] = useState(null);

  const sketchVMRef = useRef(null);
  const drawLayerRef = useRef(null);
  const geometryEngineRef = useRef(null);

  const aoiGraphicsRef = useRef({});
  const allAoiPolygonsRef = useRef([]);

  const [emitterList, setEmitterList] = useState([]);
  const [independentEmitters, setIndependentEmitters] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(5);
  const [is3D, setIs3D] = useState(false); // 🔹 2D / 3D toggle

  const { isDrawingAOI, stopDrawing, openModal } = useAoiStore();
  const { isModalOpen, closeModal, aoiData } = useAoiStore();

  // =========================================
  //  BUTTON HANDLERS (ADDED)
  // =========================================
  const handleToggle3D = () => {
    setIs3D((prev) => !prev);
  };

  const handleZoomIn = () => {
    if (window.mapViewRef) {
      const view = window.mapViewRef;
      view.goTo({ zoom: view.zoom + 1 });
    }
  };

  const handleZoomOut = () => {
    if (window.mapViewRef) {
      const view = window.mapViewRef;
      view.goTo({ zoom: view.zoom - 1 });
    }
  };

  const handleRecenter = () => {
    if (window.mapViewRef) {
      const indiaExtent = new Extent({
        xmin: 68.0,
        ymin: 6.0,
        xmax: 97.5,
        ymax: 37.0,
        spatialReference: { wkid: 4326 },
      });
      window.mapViewRef.goTo(indiaExtent.expand(1.1));
    }
  };

  // =========================================
  //  Draw AOI when fetchedAoi is updated
  // =========================================
  useEffect(() => {
    if (!fetchedAoi) return;

    const data = fetchedAoi.payload || fetchedAoi; // force unwrap
    console.log("AOI data structure:", data);

    if (
      !data.areaInterestCoordinateDtos ||
      !data.areaInterestCoordinateDtos.length
    ) {
      console.warn("No AOI coordinates found in fetched data:", data);
      return;
    }

    const tryDraw = () => {
      if (window.mapViewRef && drawLayerRef.current) {
        console.log(
          "Map ready, drawing AOI now with coords:",
          data.areaInterestCoordinateDtos.length
        );
        drawAOIFromFetchedData(data);
        return true;
      }
      return false;
    };

    if (tryDraw()) return;
    const interval = setInterval(() => {
      if (tryDraw()) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [fetchedAoi]);

  // =========================================
  //  MAIN MAP INIT (2D / 3D)
  // =========================================
  useEffect(() => {
    if (!containerRef.current) return;

    let map;
    let view;

    if (is3D) {
      // ==========================
      // 3D MODE: SceneView + Offline Satellite + Terrarium Elevation
      // ==========================
      const satelliteLayer = new WebTileLayer({
        urlTemplate: "http://localhost:3001/satellitetiles/{z}/{x}/{y}.jpg",
        tileInfo: TileInfo.create({
          size: 256,
          format: "jpg",
          spatialReference: new SpatialReference({ wkid: 3857 }),
        }),
        title: "Offline Satellite",
      });

      const TerrariumElevationLayer = BaseElevationLayer.createSubclass({
        properties: {
          urlTemplate: "http://localhost:3001/tiles/{z}/{x}/{y}.png",
        },

        tileInfo: TileInfo.create({
          size: 256,
          spatialReference: { wkid: 3857 },
        }),

        createZeroTile() {
          const size = 256;
          return Promise.resolve({
            values: new Float32Array(size * size).fill(0),
            width: size,
            height: size,
            noDataValue: -32768,
          });
        },

        load() {
          this.addResolvingPromise(Promise.resolve());
        },

        fetchTile(level, row, col, options) {
          const url = this.urlTemplate
            .replace("{z}", level)
            .replace("{x}", col)
            .replace("{y}", row);

          return fetch(url, { signal: options?.signal ?? null })
            .then((res) => (res.ok ? res.blob() : null))
            .then((blob) => {
              if (!blob) return this.createZeroTile();

              return new Promise((resolve) => {
                const img = new Image();
                img.src = URL.createObjectURL(blob);

                img.onload = () => {
                  const size = 256;
                  const canvas = document.createElement("canvas");
                  canvas.width = size;
                  canvas.height = size;

                  const ctx = canvas.getContext("2d", {
                    willReadFrequently: true,
                  });
                  ctx.drawImage(img, 0, 0);

                  const raw = ctx.getImageData(0, 0, size, size).data;
                  const values = new Float32Array(size * size);

                  for (let i = 0; i < values.length; i++) {
                    const r = raw[i * 4 + 0];
                    const g = raw[i * 4 + 1];
                    const b = raw[i * 4 + 2];

                    const h = r * 256 + g + b / 256 - 32768;
                    values[i] = h < -11000 ? 0 : h;
                  }

                  resolve({
                    values,
                    width: size,
                    height: size,
                    noDataValue: -32768,
                  });

                  URL.revokeObjectURL(img.src);
                };

                img.onerror = () => {
                  this.createZeroTile().then(resolve);
                };
              });
            })
            .catch(() => this.createZeroTile());
        },
      });

      map = new Map({
        basemap: { baseLayers: [satelliteLayer] },
        ground: {
          layers: [new TerrariumElevationLayer()],
        },
      });

      view = new SceneView({
        container: containerRef.current,
        map,
        ui: { components: [] },
        camera: {
          position: {
            x: 77.5,
            y: 31.5,
            z: 20000,
            spatialReference: { wkid: 4326 },
          },
          tilt: 60,
        },
        environment: {
          background: { type: "color", color: [0, 0, 0, 1] },
          starsEnabled: false,
          atmosphereEnabled: false,
        },
        qualityProfile: "high",
      });
    } else {
      // ==========================
      // 2D MODE: Original MapView + offline tiles
      // ==========================
      const offlineTileLayer = new WebTileLayer({
        urlTemplate: `${window.location.origin}/Satellite/{z}/{x}/{y}.png`,
        tileInfo: TileInfo.create({
          dpi: 96,
          format: "png",
          spatialReference: new SpatialReference({ wkid: 3857 }),
          rows: 256,
          cols: 256,
        }),
      });
      map = new Map({ basemap: { baseLayers: [offlineTileLayer] } });

      view = new MapView({
        container: containerRef.current,
        map,
        ui: { components: [] },
      });
    }

    // ========= Polygon Drawing Layer (FIXED FOR 3D) =========
    geometryEngineRef.current = geometryEngine;

    const drawLayer = new GraphicsLayer({
      // Keep elevation info so existing AOIs show up in 3D, even if we can't draw new ones
      elevationInfo: is3D
        ? { mode: "on-the-ground" }
        : { mode: "relative-to-ground" },
    });
    drawLayerRef.current = drawLayer;
    map.add(drawLayer);

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

    // Disable edits offline/online
    sketchVM.on("update", (event) => {
      event.preventDefault();
      sketchVM.cancel();
    });

    const colorPalette = [
      [255, 0, 0, 0.9],
      [0, 255, 0, 0.9],
      [0, 0, 255, 0.9],
      [255, 255, 0, 0.9],
      [255, 0, 255, 0.9],
      [0, 255, 255, 0.9],
    ];

    // ========= UAV routes =========

    const missions = Array.isArray(FlightRoutes_ByMission)
      ? FlightRoutes_ByMission
      : [FlightRoutes_ByMission]; // wrap single object safely

    const uavDatasets = missions
      .map((mission, index) => ({
        id: mission.MissionId || `Mission${index + 1}`,
        name: mission.MissionId || `Mission${index + 1}`,
        color: colorPalette[index % colorPalette.length],
        routes: mission.FlightRoutes ?? [],
      }))
      .filter((ds) => ds.routes.length > 0);

    window.mapViewRef = view;

    // ========= UAV route polylines =========
    uavDatasets.forEach((ds) => {
      if (!ds.routes?.length) return;

      const path = ds.routes.map((r) => [r.Long, r.Lat]);
      const polyline = new Polyline({
        paths: [path],
        spatialReference: { wkid: 4326 },
      });

      const routeGraphic = new Graphic({
        geometry: polyline,
        symbol: {
          type: "simple-line",
          color: ds.color,
          width: 2,
        },
        attributes: { uavId: ds.id },
        visible: false,
      });

      view.graphics.add(routeGraphic);
    });

    // ========= UAV icons (add AFTER routes so icons appear above) =========
    const uavGraphics = uavDatasets.map((ds) => {
      const start = ds.routes[0];
      const symbol = {
        type: "picture-marker",
        url: uavIcon,
        width: "100px",
        height: "100px",
        angle: 0,
      };

      const g = new Graphic({
        geometry: new Point({
          longitude: start.Long,
          latitude: start.Lat,
          spatialReference: { wkid: 4326 },
        }),
        symbol,
        attributes: { uavId: ds.id, _angle: 0 },
        visible: false,
      });

      view.graphics.add(g);

      return { id: ds.id, graphic: g, symbol, routes: ds.routes };
    });

    // ========= Auto extent =========
    view.when(() => {
      const indiaExtent = new Extent({
        xmin: 68.0, // west
        ymin: 6.0, // south
        xmax: 97.5, // east
        ymax: 37.0, // north
        spatialReference: { wkid: 4326 },
      });

      view.goTo(indiaExtent.expand(1.1)).catch(() => {});
    });

    // ========= Animation =========

    let frameIndex = 0;

    const move = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(move);
        return;
      }

      if (frameIndex % animationSpeed === 0) {
        uavGraphics.forEach(({ graphic, symbol, routes }) => {
          if (!routes.length) return;

          const i = (frameIndex / animationSpeed) % routes.length;
          const r = routes[Math.floor(i)];

          graphic.geometry = new Point({
            longitude: r.Long,
            latitude: r.Lat,
            spatialReference: { wkid: 4326 },
          });

          const headingDeg = r.TrueHeading_pi_rad
            ? (r.TrueHeading_pi_rad * 180) / Math.PI
            : 0;
          const prevAngle = graphic.attributes._angle ?? 0;

          if (Math.abs(headingDeg - prevAngle) >= HEADING_UPDATE_THRESH_DEG) {
            symbol.angle = headingDeg;
            graphic.symbol = symbol;
            graphic.attributes._angle = headingDeg;
          }
        });
      }

      frameIndex++;
      animationRef.current = requestAnimationFrame(move);
    };
    move();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      view?.destroy?.();
      if (window.mapViewRef === view) {
        window.mapViewRef = null;
      }
    };
  }, [isPlaying, animationSpeed, is3D]);

  // =========================================
  //  Mission change: cleanup AOIs/emitters only
  // =========================================
  useEffect(() => {
    if (!window.mapViewRef) return;
    const view = window.mapViewRef;

    console.log(`Selective cleanup for new missionId ${missionId}`);

    const toRemove = view.graphics.items.filter(
      (g) =>
        g.attributes?.aoiId || // AOI polygons
        g.attributes?.id?.startsWith("E") || // emitters
        g.attributes?.id?.startsWith("IND-") || // independent emitters
        g.attributes?.isTemp // temporary AOIs
    );
    toRemove.forEach((g) => view.graphics.remove(g));

    if (drawLayerRef.current) {
      drawLayerRef.current.removeAll();
    }

    aoiGraphicsRef.current = {};
    allAoiPolygonsRef.current = [];
    setFetchedAoi(null);
    setEmitterList([]);
    setIndependentEmitters([]);

    delete window.__lastAoiGeometry__;
    localStorage.removeItem("aois_mission_" + missionId);

    console.log("Map reset complete — platform visuals preserved.");
  }, [missionId]);

  // =========================================
  //  Fetch emitter data once
  // =========================================
  useEffect(() => {
    const loadEmitters = async () => {
      try {
        const data = await fetchAllEmitter();
        if (data.statusCode === 200 && Array.isArray(data.payload)) {
          setEmitterList(data.payload);
          console.log("Emitter data loaded:", data.payload);
        } else {
          console.warn("Invalid emitter API response:", data);
        }
      } catch (error) {
        console.error("Error loading emitter coordinates:", error);
      }
    };

    loadEmitters();
  }, []);

  // Fetch independent emitter data
  useEffect(() => {
    const loadEmitters = async () => {
      try {
        const data = await fetchAllStandAloneEmitters();
        if (data.statusCode === 200 && Array.isArray(data.payload)) {
          setIndependentEmitters(data.payload);
          console.log("Independent emitter data loaded:", data.payload);
        } else {
          console.warn("Invalid independent emitter API response:", data);
        }
      } catch (error) {
        console.error("Error loading independent emitter coordinates:", error);
      }
    };

    loadEmitters();
  }, []);

  // =========================================
  //  Fetch Mission Tree → Save AOI ID → Fetch AOI by ID
  // =========================================
  useEffect(() => {
    const fetchAndDrawAOIs = async () => {
      try {
        if (!missionId) return;
        console.log(`Fetching Mission Tree for missionId: ${missionId}`);
        const treeRes = await fetchMissionTree(missionId);

        if (treeRes.statusCode !== 200 || !treeRes.payload) {
          console.warn("Invalid mission tree response:", treeRes.payload);
          return;
        }

        const aois = treeRes.payload.areaInterests || [];
        if (!aois.length) {
          console.warn("No AOIs found in mission tree:", treeRes.payload);
          return;
        }

        console.log(`Found ${aois.length} AOIs in mission tree`);
        localStorage.setItem(
          "aois_mission_" + missionId,
          JSON.stringify(aois.map((a) => a.areaInterestId))
        );

        for (const aoi of aois) {
          let aoiObj = aoi;
          if (
            !Array.isArray(aoi.areaInterestCoordinateDtos) ||
            aoi.areaInterestCoordinateDtos.length < 3
          ) {
            console.log(
              `AOI ${aoi.areaInterestId} missing coords, fetching...`
            );
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
      if (window.mapViewRef && drawLayerRef.current) {
        clearInterval(interval);
        fetchAndDrawAOIs();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [missionId, is3D]);

  // =========================================
  //  Re-render AOI if standalone emitters load later
  // =========================================

  useEffect(() => {
    const handleAoiAdded = (e) => {
      const { geometry, refreshOnly } = e.detail || {};

      if (
        (!geometry && !refreshOnly) ||
        (!emitterList.length && !independentEmitters.length) ||
        !window.mapViewRef
      )
        return;

      const view = window.mapViewRef;

      if (geometry) {
        window.__lastAoiGeometry__ = geometry;
      }

      try {
        if (geometry) {
          const newAoiPolygon = turf.polygon([geometry.rings[0]]);
          allAoiPolygonsRef.current.push(newAoiPolygon);
        }
        const toRemove = view.graphics.items.filter(
          (g) =>
            g.attributes?.id?.startsWith("E") ||
            g.attributes?.id?.startsWith("IND-")
        );
        toRemove.forEach((g) => view.graphics.remove(g));

        if (allAoiPolygonsRef.current.length === 0) {
          console.log("No active AOIs left. Hiding all emitters.");
          return;
        }

        const isInsideAnyAoi = (point) =>
          allAoiPolygonsRef.current.some((poly) =>
            turf.booleanPointInPolygon(point, poly)
          );

        const plotEmitters = (emitters, isIndependent = false) => {
          emitters.forEach((em) => {
            const lat = parseFloat(em.latitude);
            const lon = parseFloat(em.longitude);
            if (!isFinite(lat) || !isFinite(lon)) return;

            const point = turf.point([lon, lat]);
            const inside = isInsideAnyAoi(point);

            const emitterPoint = new Point({
              longitude: lon,
              latitude: lat,
              spatialReference: { wkid: 4326 },
            });

            const iconUrl = inside ? friendlyPin : enemyPin;

            const emitterGraphic = new Graphic({
              geometry: emitterPoint,
              symbol: {
                type: "picture-marker",
                url: iconUrl,
                width: isIndependent ? "20px" : "20px",
                height: isIndependent ? "30px" : "30px",
              },
              attributes: {
                id: `${isIndependent ? "IND-" : "E"}${em.emitterId}`,
                name: em.emitterName,
                _inside: inside,
              },
            });

            const label = new Graphic({
              geometry: emitterPoint,
              symbol: {
                type: "text",
                text:
                  em.emitterName ||
                  `${isIndependent ? "Ind-" : "E"}${em.emitterId}`,
                color: "white",
                haloColor: "black",
                haloSize: 2,
                yoffset: -25,
                font: { size: 12, family: "Arial", weight: "bold" },
              },
              attributes: {
                id: `${isIndependent ? "IND-" : "E"}${em.emitterId}`,
              },
            });

            view.graphics.addMany([emitterGraphic, label]);
          });
        };

        plotEmitters(emitterList, false);
        plotEmitters(independentEmitters, true);

        console.log(
          `Emitters re-rendered. Active AOIs: ${allAoiPolygonsRef.current.length}`
        );
      } catch (err) {
        console.error("Emitter AOI filter error:", err);
      }
    };

    window.addEventListener("AOI_ADDED", handleAoiAdded);
    return () => window.removeEventListener("AOI_ADDED", handleAoiAdded);
  }, [emitterList, independentEmitters]);

  useEffect(() => {
    if (independentEmitters.length > 0 && window.__lastAoiGeometry__) {
      const event = new CustomEvent("AOI_ADDED", {
        detail: { geometry: window.__lastAoiGeometry__ },
      });
      window.dispatchEvent(event);
    }
  }, [independentEmitters]);

  // =========================================
  //  Function: drawAOIFromFetchedData
  // =========================================
  const drawAOIFromFetchedData = (data, recenter = true) => {
    const view = window.mapViewRef;
    const layer = drawLayerRef.current;
    if (!layer) return;

    // Clean up any orphan AOI polygons left without attributes
    layer.graphics.items
      .filter((g) => g.geometry?.type === "polygon" && !g.attributes?.aoiId)
      .forEach((g) => {
        console.log("🧹 Removing orphan AOI graphic");
        layer.remove(g);
      });

    if (!view || !layer) {
      console.warn("Map or draw layer not ready to draw AOI");
      return;
    }

    if (!data?.areaInterestCoordinateDtos?.length) {
      console.warn("No AOI coordinates found to draw");
      return;
    }

    const coords = data.areaInterestCoordinateDtos
      .map((c) => [parseFloat(c.longitude), parseFloat(c.latitude)])
      .filter(([lon, lat]) => isFinite(lon) && isFinite(lat));

    if (coords.length < 3) {
      console.warn("AOI draw skipped — invalid coordinates", coords);
      return;
    }

    // Ensure closed ring
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) coords.push([...first]);

    const polygon = new Polygon({
      rings: [coords],
      spatialReference: { wkid: 4326 },
    });

    // Give each AOI a distinct color for debugging
    const color = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      255,
      0.25,
    ];

    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: {
        type: "simple-fill",
        color,
        outline: { color, width: 2 },
      },
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
        font: { size: 12, family: "Arial", weight: "bold" },
      },
      attributes: {
        aoiId: String(data.areaInterestId),
      },
    });

    const existing = layer.graphics.items.filter(
      (g) => g.attributes?.aoiId === String(data.areaInterestId)
    );
    existing.forEach((g) => layer.remove(g));

    layer.addMany([polygonGraphic, labelGraphic]);

    aoiGraphicsRef.current[data.areaInterestId.toString()] = {
      polygon: polygonGraphic,
      label: labelGraphic,
    };

    if (recenter && polygon.extent) {
      view.goTo(polygon.extent.expand(1.2)).catch(() => {});
    }

    console.log("AOI drawn:", data.areaName);

    const event = new CustomEvent("AOI_ADDED", {
      detail: {
        id: data.areaInterestId,
        name: data.areaName || "Fetched AOI",
        geometry: polygon.toJSON(),
      },
    });
    window.dispatchEvent(event);
  };

  // =========================================
  //  Online/offline reload hooks
  // =========================================
  useEffect(() => {
    const handleOnline = () => window.location.reload();
    const handleOffline = () => window.location.reload();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // =========================================
  //  AOI draw interaction (Sketch)
  // =========================================
  useEffect(() => {
    const vm = sketchVMRef.current;
    const geo = geometryEngineRef.current;

    // Safety check: ensure VM and Geometry Engine are ready
    if (!vm || !geo) return;

    if (isDrawingAOI) {
      if (is3D) {
        alert("AOI Drawing is not available in 3D mode. Please switch to 2D.");
        stopDrawing();
        return;
      }

      console.log("🟦 Activating Draw Tool (2D Only)");

      vm.create("polygon");

      const handleCreate = async (evt) => {
        if (evt.state !== "complete") return;

        // --- 4. MODIFIED: Offline-safe coordinate conversion ---
        const geom = evt.graphic.geometry;
        let geom4326;

        // Use webMercatorUtils instead of projection.project()
        if (geom.spatialReference.isWebMercator) {
          geom4326 = webMercatorUtils.webMercatorToGeographic(geom);
        } else {
          geom4326 = geom;
        }

        const area_m2 = geo.geodesicArea(geom4326, "square-meters");
        const perimeter_m = geo.geodesicLength(geom4326, "meters");

        const area_km2 = Number((area_m2 / 1_000_000).toFixed(2));
        const perimeter_km = Number((perimeter_m / 1_000).toFixed(2));

        let rings = geom4326?.rings?.[0] || [];
        if (
          rings.length > 1 &&
          rings[0][0] === rings[rings.length - 1][0] &&
          rings[0][1] === rings[rings.length - 1][1]
        ) {
          rings = rings.slice(0, -1);
        }

        const results = rings.map(([lon, lat, z]) => ({
          geometry: { latitude: lat, longitude: lon, z: z || 0 },
        }));

        const points = results.map((res) => {
          const { latitude, longitude, z } = res.geometry;
          return {
            lat: `${latitude.toFixed(6)}° N`,
            long: `${longitude.toFixed(6)}° E`,
            alt: `${z.toFixed(1)} m`,
            raw: { lat: latitude, long: longitude, alt: z },
          };
        });

        const tempId = `temp-${Date.now()}`;

        const polygonGraphic = new Graphic({
          geometry: geom4326,
          symbol: {
            type: "simple-fill",
            color: [64, 160, 255, 0.2],
            outline: { color: [64, 160, 255, 1], width: 2 },
          },
          attributes: {
            locked: true,
            aoiId: tempId,
            isTemp: true,
          },
        });

        const labelGraphic = new Graphic({
          geometry: geom4326.centroid,
          symbol: {
            type: "text",
            text: "New AOI",
            color: "white",
            haloColor: "black",
            haloSize: 2,
            font: { size: 12, family: "Arial", weight: "bold" },
          },
          attributes: { aoiId: tempId },
        });

        drawLayerRef.current.addMany([polygonGraphic, labelGraphic]);

        aoiGraphicsRef.current[tempId] = {
          polygon: polygonGraphic,
          label: labelGraphic,
          isTemp: true,
        };

        openModal({
          area: area_km2,
          perimeter: perimeter_km,
          points,
          tempId: tempId,
        });

        const sketchVM = sketchVMRef.current;
        if (sketchVM) {
          sketchVM.cancel();
          sketchVM.updateOnGraphicClick = false;
        }

        stopDrawing();
      };

      const handle = vm.on("create", handleCreate);
      return () => handle.remove();
    }
  }, [isDrawingAOI, is3D]);

  // =========================================
  //  AOI UPDATED listener
  // =========================================

  useEffect(() => {
    const handleAoiUpdate = (e) => {
      const { id, points, name } = e.detail || {};
      if (!id) return;

      const key = String(id);
      const existing = aoiGraphicsRef.current[key];

      const layer = drawLayerRef.current;
      const view = window.mapViewRef;
      console.log(
        "AOI refs:",
        Object.entries(aoiGraphicsRef.current).map(([k, v]) => ({
          id: k,
          hasLabel: !!v.label,
          text: v.label?.symbol?.text,
        }))
      );

      // ==========================
      // NAME UPDATE (NO GEOMETRY)
      // ==========================
      if (name && existing?.label) {
        const sym = existing.label.symbol.clone();
        sym.text = name;
        existing.label.symbol = sym;

        console.log(`AOI ${id} renamed to: ${name}`);
      }

      // ==========================
      // No geometry → stop here
      // ==========================
      if (!points || points.length < 3) return;

      let coords = points
        .map((p) => {
          const raw = p.raw ?? p;
          let lat = parseFloat(raw.lat);
          let lon = parseFloat(raw.long);
          if (Math.abs(lat) > 90 && Math.abs(lon) <= 90)
            [lat, lon] = [lon, lat];
          return isFinite(lat) && isFinite(lon) ? [lon, lat] : null;
        })
        .filter(Boolean);

      if (coords.length < 3) return;
      const first = coords[0];
      const last = coords[coords.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coords.push([...first]);
      }

      const newPolygon = new Polygon({
        rings: [coords],
        spatialReference: { wkid: 4326 },
      });

      if (existing) {
        existing.polygon.geometry = newPolygon;
        if (existing.label) {
          existing.label.geometry = newPolygon.centroid;
        }
        console.log(`AOI ${id} geometry updated`);
      } else if (layer) {
        const newGraphic = new Graphic({
          geometry: newPolygon,
          symbol: {
            type: "simple-fill",
            color: [64, 160, 255, 0.2],
            outline: { color: [64, 160, 255, 1], width: 2 },
          },
        });

        const label = new Graphic({
          geometry: newPolygon.centroid,
          symbol: {
            type: "text",
            text: name || `AOI_${id}`,
            color: "white",
            haloColor: "black",
            haloSize: 2,
            font: { size: 12, family: "Arial", weight: "bold" },
          },
        });

        layer.addMany([newGraphic, label]);
        aoiGraphicsRef.current[id] = { polygon: newGraphic, label };
        console.log(`🆕 AOI ${id} created`);
      }

      if (view && newPolygon.extent) {
        view.goTo(newPolygon.extent.expand(1.2)).catch(() => {});
      }
    };

    window.addEventListener("AOI_UPDATED", handleAoiUpdate);
    return () => window.removeEventListener("AOI_UPDATED", handleAoiUpdate);
  }, []);

  // =========================================
  //  AOI Removal — remove only deleted AOI
  // =========================================
  useEffect(() => {
    const handleAoiRemoved = async (e) => {
      const { id, tempId } = e.detail || {};
      const removalId = String(id || tempId);
      if (!removalId) return;

      const layer = drawLayerRef.current;
      const entry = aoiGraphicsRef.current[removalId];

      if (entry && layer) {
        if (entry.polygon) layer.remove(entry.polygon);
        if (entry.label) layer.remove(entry.label);

        delete aoiGraphicsRef.current[removalId];

        allAoiPolygonsRef.current = Object.values(aoiGraphicsRef.current)
          .map((item) => {
            if (!item.polygon || !item.polygon.geometry) return null;
            return turf.polygon(item.polygon.geometry.rings);
          })
          .filter(Boolean);

        window.dispatchEvent(
          new CustomEvent("AOI_ADDED", {
            detail: {
              geometry: null,
              refreshOnly: true,
            },
          })
        );

        console.log(`AOI ${removalId} removed. Emitters turning red...`);
      }
    };

    window.addEventListener("AOI_REMOVED", handleAoiRemoved);
    return () => window.removeEventListener("AOI_REMOVED", handleAoiRemoved);
  }, [missionId]);

  // Clean up all AOI graphics when component unmounts
  useEffect(() => {
    return () => {
      if (drawLayerRef.current) {
        drawLayerRef.current.removeAll();
      }
      aoiGraphicsRef.current = {};
    };
  }, []);

  // =========================================
  //  Platform visibility event
  // =========================================
  useEffect(() => {
    const handlePlatformVisibility = (e) => {
      const { visible } = e.detail || {};
      if (!window.mapViewRef) return;
      const view = window.mapViewRef;

      view.graphics.items.forEach((g) => {
        if (g.attributes?.uavId || g.geometry?.type === "polyline") {
          g.visible = visible;
        }
      });

      if (visible) {
        const routeGraphics = view.graphics.items.filter(
          (g) => g.geometry?.type === "polyline"
        );

        if (routeGraphics.length > 0) {
          let combinedExtent = routeGraphics[0].geometry.extent.clone();
          for (let i = 1; i < routeGraphics.length; i++) {
            combinedExtent = combinedExtent.union(
              routeGraphics[i].geometry.extent
            );
          }

          const paddedExtent = combinedExtent.expand(1.2);

          view.goTo(paddedExtent, { duration: 1200 }).catch(() => {});
        }
      }
    };

    window.addEventListener(
      "PLATFORM_VISIBILITY_TOGGLED",
      handlePlatformVisibility
    );

    return () =>
      window.removeEventListener(
        "PLATFORM_VISIBILITY_TOGGLED",
        handlePlatformVisibility
      );
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      <AOIModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAdd={async (savedAOI) => {
          console.log("AOI saved:", savedAOI);
          closeModal();

          try {
            const newId =
              savedAOI?.payload?.areaInterestId ?? savedAOI?.areaInterestId;
            if (!newId) {
              console.warn("Missing AOI ID in savedAOI payload:", savedAOI);
              return;
            }

            const tempKeys = Object.keys(aoiGraphicsRef.current).filter((key) =>
              key.startsWith("temp-")
            );

            tempKeys.forEach((tempKey) => {
              const entry = aoiGraphicsRef.current[tempKey];
              if (entry && drawLayerRef.current) {
                drawLayerRef.current.remove(entry.polygon);
                if (entry.label) drawLayerRef.current.remove(entry.label);
                delete aoiGraphicsRef.current[tempKey];
              }
            });

            window.dispatchEvent(
              new CustomEvent("AOI_ADDED", {
                detail: {
                  id: newId,
                  name: savedAOI?.payload?.areaName ?? "New AOI",
                },
              })
            );

            let res,
              attempts = 0;
            do {
              await new Promise((r) => setTimeout(r, 400));
              res = await AOIbyID(newId);
              attempts++;
            } while (
              attempts < 8 &&
              (!res?.payload?.areaName ||
                !Array.isArray(res?.payload?.areaInterestCoordinateDtos) ||
                res.payload.areaInterestCoordinateDtos.length < 3)
            );

            if (res?.statusCode === 200 && res?.payload) {
              drawAOIFromFetchedData(res.payload, true);
              console.log(
                `AOI ${res.payload.areaName} drawn instantly with label`
              );
            } else {
              console.warn("AOI fetch incomplete even after retries:", res);
            }
          } catch (err) {
            console.error("Error fetching AOI after save:", err);
          }
        }}
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

      {/* 2D/3D Toggle Button - WIRED UP */}
      <div
        style={{
          position: "absolute",
          bottom: 165,
          right: 60,
          color: "white",
          padding: "4px 4px",
          borderRadius: 0,
          fontSize: 12,
        }}
      >
        <div className="flex flex-col items-center justify-between gap-0 w-10">
          <Button
            size="sm"
            // onClick={handleToggle3D}
            className=" !py-2 w-8 h-8 bg-[#414141] rounded-xs cursor-pointer hover:bg-gray-600"
            title={is3D ? "Switch to 2D" : "Switch to 3D"}
          >
            <TfiLocationArrow
              className={is3D ? "text-blue-400" : "text-white"}
            />
          </Button>
        </div>
      </div>

      {/* Recenter / My Location Button - WIRED UP */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          right: 60,
          color: "white",
          padding: "4px 4px",
          borderRadius: 0,
          fontSize: 12,
        }}
      >
        <div className="flex flex-col items-center justify-between gap-0 w-10">
          <Button
            size="sm"
            onClick={handleRecenter}
            className=" !py-2 w-8 h-8 bg-[#414141] rounded-xs cursor-pointer hover:bg-gray-600"
            title="Recenter Map"
          >
            <MdMyLocation />
          </Button>
        </div>
      </div>

      {/* Zoom Controls - WIRED UP */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 64,
          color: "white",
          padding: "4px 4px",
          borderRadius: 0,
          fontSize: 12,
        }}
      >
        <div className="flex flex-col items-center justify-between gap-0 ">
          <Button
            size="sm"
            onClick={handleZoomIn}
            className=" !py-2 w-8 h-8 bg-[#414141] rounded-none rounded-t-xs cursor-pointer hover:bg-gray-600"
          >
            <Plus className="h-10 w-10" />
          </Button>
          <Separator className="bg-white/50" />
          <Button
            size="sm"
            onClick={handleZoomOut}
            className=" !py-2 w-8 h-8 bg-[#414141] rounded-none rounded-b-xs cursor-pointer hover:bg-gray-600"
          >
            <Minus className="h-10 w-10" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformMaps;

// Global debug utility — inspect all layers and AOI graphics
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
