import { useEffect, useRef } from "react";
import Polyline from "@arcgis/core/geometry/Polyline";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import uavIcon from "../../assets/images/uavpreview.png";
import FlightRoutes_ByMission from "../../routeData/FlightRoutes_ByMission.json";

const HEADING_UPDATE_THRESH_DEG = 1.0;

export const useUAVSimulation = (
  view,
  isPlaying,
  animationSpeed,
  isMapReady
) => {
  const animationRef = useRef(null);
  const uavGraphicsRef = useRef([]);

  useEffect(() => {
    if (!view || !isMapReady) return;

    // Color Palette
    const colorPalette = [
      [255, 0, 0, 0.9],
      [0, 255, 0, 0.9],
      [0, 0, 255, 0.9],
      [255, 255, 0, 0.9],
      [255, 0, 255, 0.9],
      [0, 255, 255, 0.9],
    ];

    // Data prep
    const missions = Array.isArray(FlightRoutes_ByMission)
      ? FlightRoutes_ByMission
      : [FlightRoutes_ByMission];

    const uavDatasets = missions
      .map((mission, index) => ({
        id: mission.MissionId || `Mission${index + 1}`,
        color: colorPalette[index % colorPalette.length],
        routes: mission.FlightRoutes ?? [],
      }))
      .filter((ds) => ds.routes.length > 0);

    // Draw Routes & Icons
    const currentUavGraphics = [];

    uavDatasets.forEach((ds) => {
      // 1. Polyline
      const path = ds.routes.map((r) => [r.Long, r.Lat]);
      const polyline = new Polyline({
        paths: [path],
        spatialReference: { wkid: 4326 },
      });
      const routeGraphic = new Graphic({
        geometry: polyline,
        symbol: { type: "simple-line", color: ds.color, width: 2 },
        attributes: { uavId: ds.id },
        visible: false,
      });
      view.graphics.add(routeGraphic);

      // 2. Icon
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
      currentUavGraphics.push({
        id: ds.id,
        graphic: g,
        symbol,
        routes: ds.routes,
      });
    });

    uavGraphicsRef.current = currentUavGraphics;

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [view, isMapReady]);

  // Animation Loop
  useEffect(() => {
    let frameIndex = 0;

    const move = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(move);
        return;
      }

      if (
        frameIndex % animationSpeed === 0 &&
        uavGraphicsRef.current.length > 0
      ) {
        uavGraphicsRef.current.forEach(({ graphic, symbol, routes }) => {
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

    if (isMapReady) {
      move();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, animationSpeed, isMapReady]);

  // Visibility Toggle Handler
  useEffect(() => {
    const handlePlatformVisibility = (e) => {
      const { visible } = e.detail || {};
      if (!view) return;

      view.graphics.items.forEach((g) => {
        if (g.attributes?.uavId || g.geometry?.type === "polyline") {
          g.visible = visible;
        }
      });

      if (visible) {
        // Zoom to routes
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
          view
            .goTo(combinedExtent.expand(1.2), { duration: 1200 })
            .catch(() => {});
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
  }, [view]);
};
