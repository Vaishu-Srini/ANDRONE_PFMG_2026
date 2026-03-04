import { useEffect, useRef, useState } from "react";
import config from "@arcgis/core/config";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import BaseElevationLayer from "@arcgis/core/layers/BaseElevationLayer";
import Extent from "@arcgis/core/geometry/Extent";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

// // SET ASSETS PATH
// config.assetsPath = "/assets";

// //Tells ArcGIS to look in your local folder for fonts
// config.fontsUrl = "/assets/fonts";
// ... imports ...

// FIX: Use relative path (.) so Electron finds it in the build folder
config.assetsPath = "./assets";

// FIX: Use relative path for fonts too
config.fontsUrl = "./assets/fonts";

export const useMapInitialize = (containerRef, is3D) => {
  const viewRef = useRef(null);
  const drawLayerRef = useRef(null); // We expose this for the AOI hook+
  const [isMapReady, setIsMapReady] = useState(false);
  // This automatically grabs the IP
  const currentIP = "constelli.local";
  console.log("Current IP for tiles:", currentIP);

  useEffect(() => {
    if (!containerRef.current) return;

    // cleanup previous view
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    let map;
    let view;

    // if (is3D) {
    //   // ------------------------------------------------------
    //   // 3D MODE: SceneView + Custom Elevation
    //   // ------------------------------------------------------
    //   const satelliteLayer = new WebTileLayer({
    //     urlTemplate: `http://${currentIP}:3001/satellitetiles/{z}/{x}/{y}.jpg`,
    //     tileInfo: TileInfo.create({
    //       size: 256,
    //       format: "jpg",
    //       spatialReference: new SpatialReference({ wkid: 3857 }),
    //     }),
    //     title: "Offline Satellite",
    //   });

    //   const TerrariumElevationLayer = BaseElevationLayer.createSubclass({
    //     properties: {
    //       urlTemplate: `http://${currentIP}:3001/tiles/{z}/{x}/{y}.png`,
    //     },
    //     tileInfo: TileInfo.create({
    //       size: 256,
    //       spatialReference: { wkid: 3857 },
    //     }),
    //     createZeroTile() {
    //       const size = 256;
    //       return Promise.resolve({
    //         values: new Float32Array(size * size).fill(0),
    //         width: size,
    //         height: size,
    //         noDataValue: -32768,
    //       });
    //     },
    //     load() {
    //       this.addResolvingPromise(Promise.resolve());
    //     },
    //     fetchTile(level, row, col, options) {
    //       const url = this.urlTemplate
    //         .replace("{z}", level)
    //         .replace("{x}", col)
    //         .replace("{y}", row);

    //       return fetch(url, { signal: options?.signal ?? null })
    //         .then((res) => (res.ok ? res.blob() : null))
    //         .then((blob) => {
    //           if (!blob) return this.createZeroTile();
    //           return new Promise((resolve) => {
    //             const img = new Image();
    //             img.src = URL.createObjectURL(blob);
    //             img.onload = () => {
    //               const size = 256;
    //               const canvas = document.createElement("canvas");
    //               canvas.width = size;
    //               canvas.height = size;
    //               const ctx = canvas.getContext("2d", {
    //                 willReadFrequently: true,
    //               });
    //               ctx.drawImage(img, 0, 0);
    //               const raw = ctx.getImageData(0, 0, size, size).data;
    //               const values = new Float32Array(size * size);
    //               for (let i = 0; i < values.length; i++) {
    //                 const r = raw[i * 4 + 0];
    //                 const g = raw[i * 4 + 1];
    //                 const b = raw[i * 4 + 2];
    //                 const h = r * 256 + g + b / 256 - 32768;
    //                 values[i] = h < -11000 ? 0 : h;
    //               }
    //               resolve({
    //                 values,
    //                 width: size,
    //                 height: size,
    //                 noDataValue: -32768,
    //               });
    //               URL.revokeObjectURL(img.src);
    //             };
    //             img.onerror = () => this.createZeroTile().then(resolve);
    //           });
    //         })
    //         .catch(() => this.createZeroTile());
    //     },
    //   });

    //   map = new Map({
    //     basemap: { baseLayers: [satelliteLayer] },
    //     ground: { layers: [new TerrariumElevationLayer()] },
    //   });

    //   view = new SceneView({
    //     container: containerRef.current,
    //     map,
    //     ui: { components: [] },
    //     camera: {
    //       position: {
    //         x: 77.5,
    //         y: 31.5,
    //         z: 20000,
    //         spatialReference: { wkid: 4326 },
    //       },
    //       tilt: 60,
    //     },
    //     environment: {
    //       background: { type: "color", color: [0, 0, 0, 1] },
    //       starsEnabled: false,
    //       atmosphereEnabled: false,
    //     },
    //     qualityProfile: "high",
    //   });
    // } else {
    //   // ------------------------------------------------------
    //   // 2D MODE: MapView
    //   // ------------------------------------------------------
    //   const offlineTileLayer = new WebTileLayer({
    //     urlTemplate: `${window.location.origin}/Satellite/{z}/{x}/{y}.png`,
    //     tileInfo: TileInfo.create({
    //       dpi: 96,
    //       format: "png",
    //       spatialReference: new SpatialReference({ wkid: 3857 }),
    //       rows: 256,
    //       cols: 256,
    //     }),
    //   });
    //   map = new Map({ basemap: { baseLayers: [offlineTileLayer] } });

    //   view = new MapView({
    //     container: containerRef.current,
    //     map,
    //     ui: { components: [] },
    //   });
    // }

    // Common setup: Draw Layer

    //online maps
    if (is3D) {
      map = new Map({
        basemap: "satellite",
        ground: "world-elevation",
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
      map = new Map({
        basemap: "satellite",
      });

      view = new MapView({
        container: containerRef.current,
        map,
        ui: { components: [] },
      });
    }

    const drawLayer = new GraphicsLayer({
      elevationInfo: is3D
        ? { mode: "on-the-ground" }
        : { mode: "relative-to-ground" },
    });
    map.add(drawLayer);
    drawLayerRef.current = drawLayer;

    // Set Global Ref (as required by original code)
    window.mapViewRef = view;
    viewRef.current = view;

    view.when(() => {
      // Auto Extent
      const indiaExtent = new Extent({
        xmin: 68.0,
        ymin: 6.0,
        xmax: 97.5,
        ymax: 37.0,
        spatialReference: { wkid: 4326 },
      });
      view.goTo(indiaExtent.expand(1.1)).catch(() => {});
      setIsMapReady(true);
    });

    return () => {
      // Cleanup happens at start of next run or component unmount
      setIsMapReady(false);
      if (window.mapViewRef === view) window.mapViewRef = null;
    };
  }, [is3D]);

  // Handle Offline/Online reload
  useEffect(() => {
    const handleReload = () => window.location.reload();
    window.addEventListener("online", handleReload);
    window.addEventListener("offline", handleReload);
    return () => {
      window.removeEventListener("online", handleReload);
      window.removeEventListener("offline", handleReload);
    };
  }, []);

  return { view: viewRef.current, drawLayer: drawLayerRef.current, isMapReady };
};
