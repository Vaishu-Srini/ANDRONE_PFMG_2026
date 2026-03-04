import { useEffect, useRef } from 'react';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Polyline from '@arcgis/core/geometry/Polyline';
import Point from '@arcgis/core/geometry/Point';
import droneIcon from '../assets/images/uav-removebg-preview.png'
export const useCsvFlightRenderer = ({
  viewRef,
  mapInstance,
  csvData,
  is3D = false
}) => {
  const previousCountRef = useRef(0);
  const droneGraphicRefs = useRef([null, null, null]); // ✅ 3 drones
  const currentLOBRefs = useRef([null, null, null]); // ✅ 3 LOBs
  const flightLayerRef = useRef(null);

  // ✅ Define 3 flight paths with different offsets (in degrees)
  const FLIGHT_PATHS = [
    { id: 'path-1', name: 'Flight Path 1', latOffset: 0, lonOffset: 0, color: [66, 135, 245] }, // Blue (original)
    { id: 'path-2', name: 'Flight Path 2', latOffset: 0.0, lonOffset: 0.03, color: [255, 165, 0] }, // Orange
    { id: 'path-3', name: 'Flight Path 3', latOffset: 0.0, lonOffset: 0.06, color: [0, 255, 0] } // Green
  ];

  const EMITTER_COLORS = {
 'E1': [255, 20, 147],    // ✅ Deep Pink (was red)
  'E2': [0, 0, 255],       // Blue
  'E3': [0, 255, 0],       // Green
  'E4': [255, 165, 0],     // Orange
  'E5': [128, 0, 128],     // Purple
  'unknown': [128, 128, 128] // Gray
  };

  const calculateLOBEndpoint = (droneLat, droneLon, aoaDegrees, rangeKm) => {
    let normalizedAzimuth = aoaDegrees % 360;
    if (normalizedAzimuth < 0) normalizedAzimuth += 360;
    const mathematicalAngle = (90 - normalizedAzimuth) * Math.PI / 180;
    const R = 6371;
    const lat1 = (droneLat * Math.PI) / 180;
    const lon1 = (droneLon * Math.PI) / 180;
    
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(rangeKm / R) +
      Math.cos(lat1) * Math.sin(rangeKm / R) * Math.cos(mathematicalAngle)
    );
    
    const lon2 = lon1 + Math.atan2(
      Math.sin(mathematicalAngle) * Math.sin(rangeKm / R) * Math.cos(lat1),
      Math.cos(rangeKm / R) - Math.sin(lat1) * Math.sin(lat2)
    );
    
    return {
      lat: (lat2 * 180) / Math.PI,
      lon: (lon2 * 180) / Math.PI
    };
  };

  useEffect(() => {
    const view = viewRef.current;
    const map = mapInstance.current;

    if (!view || !map || !csvData || csvData.length === 0) return;

    // Find or create layer
    let layer = map.layers.find(l => l.id === 'csv-flight-layer');

    if (!layer) {
      layer = new GraphicsLayer({
        id: 'csv-flight-layer',
        title: 'CSV Flight Data',
        elevationInfo: is3D ? { mode: 'absolute-height' } : undefined
      });
      map.add(layer);
      flightLayerRef.current = layer;
      console.log('✅ Created CSV flight layer');
    }

    const currentCount = csvData.length;
    const previousCount = previousCountRef.current;

    if (currentCount <= previousCount) return;

    console.log(`📊 Processing ${currentCount - previousCount} new points for ${FLIGHT_PATHS.length} paths`);

    const newData = csvData.slice(previousCount);

    // ✅ Process each flight path
    FLIGHT_PATHS.forEach((pathConfig, pathIndex) => {
      newData.forEach((detection, index) => {
        const globalIndex = previousCount + index;

        // ✅ Apply offset to coordinates
        const currentLat = parseFloat(detection.Lat) + pathConfig.latOffset;
        const currentLon = parseFloat(detection.Long) + pathConfig.lonOffset;

        if (isNaN(currentLat) || isNaN(currentLon)) return;

        // ==========================================
        // DRAW FLIGHT PATH SEGMENT
        // ==========================================
        if (globalIndex > 0) {
          const prevDetection = csvData[globalIndex - 1];
          const prevLat = parseFloat(prevDetection.Lat) + pathConfig.latOffset;
          const prevLon = parseFloat(prevDetection.Long) + pathConfig.lonOffset;

          if (!isNaN(prevLat) && !isNaN(prevLon)) {
            const pathSegment = new Polyline({
              paths: [[[prevLon, prevLat], [currentLon, currentLat]]],
              spatialReference: { wkid: 4326 },
              hasZ: false
            });

            const pathGraphic = new Graphic({
              geometry: pathSegment,
              symbol: {
                type: 'simple-line',
                color: pathConfig.color,
                width: 2,
                style: 'solid'
              },
              attributes: {
                pathId: pathConfig.id,
                pathName: pathConfig.name
              }
            });

            layer.add(pathGraphic);
          }
        }
      });
    });

    // ==========================================
    // REMOVE OLD LOBs FOR ALL PATHS
    // ==========================================
    currentLOBRefs.current.forEach((lob, idx) => {
      if (lob) {
        layer.remove(lob);
        currentLOBRefs.current[idx] = null;
      }
    });

    // ==========================================
    // DRAW NEW LOBs FOR ALL PATHS
    // ==========================================
    const latestDetection = csvData[csvData.length - 1];
    const aoa = parseFloat(latestDetection.AOA);
    const range = parseFloat(latestDetection.EmitterRange);

    if (!isNaN(aoa) && !isNaN(range) && range > 0) {
      FLIGHT_PATHS.forEach((pathConfig, pathIndex) => {
        const droneLat = parseFloat(latestDetection.Lat) + pathConfig.latOffset;
        const droneLon = parseFloat(latestDetection.Long) + pathConfig.lonOffset;

        const lobEnd = calculateLOBEndpoint(droneLat, droneLon, aoa, range);

        const lobLine = new Polyline({
          paths: [[[droneLon, droneLat], [lobEnd.lon, lobEnd.lat]]],
          spatialReference: { wkid: 4326 },
          hasZ: false
        });

        const emitterType = latestDetection.Emitter || 'unknown';
        const color = EMITTER_COLORS[emitterType] || EMITTER_COLORS['unknown'];

        const lobGraphic = new Graphic({
          geometry: lobLine,
          symbol: {
            type: 'simple-line',
            color: color,
            width: 2,
            style: 'dash'
          },
          attributes: {
            pathId: pathConfig.id,
            emitter: emitterType
          }
        });

        layer.add(lobGraphic);
        currentLOBRefs.current[pathIndex] = lobGraphic;
      });
    }

    // ==========================================
    // REMOVE OLD DRONES FOR ALL PATHS
    // ==========================================
    droneGraphicRefs.current.forEach((drone, idx) => {
      if (drone) {
        layer.remove(drone);
        droneGraphicRefs.current[idx] = null;
      }
    });

    // ==========================================
    // ADD NEW DRONES FOR ALL PATHS
    // ==========================================
    const headingRadians = parseFloat(latestDetection.TrueHeadingPiRad) || 0;
    const headingDegrees = (headingRadians * 180) / Math.PI;

    FLIGHT_PATHS.forEach((pathConfig, pathIndex) => {
      const droneLat = parseFloat(latestDetection.Lat) + pathConfig.latOffset;
      const droneLon = parseFloat(latestDetection.Long) + pathConfig.lonOffset;

      const dronePoint = new Point({
        longitude: droneLon,
        latitude: droneLat,
        spatialReference: { wkid: 4326 }
      });

    const droneGraphic = new Graphic({
      geometry: dronePoint,
      symbol: {
      type: 'picture-marker',
      url: droneIcon, // ✅ Your drone image
      width: '52px',
      height: '52px',
      angle: headingDegrees,
        },
        attributes: {
          pathId: pathConfig.id,
          pathName: pathConfig.name
        }
      });

      layer.add(droneGraphic);
      droneGraphicRefs.current[pathIndex] = droneGraphic;
    });

    previousCountRef.current = currentCount;
    console.log(`✅ Rendered ${currentCount} points across ${FLIGHT_PATHS.length} paths`);

  }, [csvData, is3D, viewRef, mapInstance]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (flightLayerRef.current) {
        flightLayerRef.current.removeAll();
      }
    };
  }, []);
};
