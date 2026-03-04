// import { useEffect } from "react";
// import "ol/ol.css";
// import Map from "ol/Map";
// import View from "ol/View";
// import TileLayer from "ol/layer/Tile";
// import XYZ from "ol/source/XYZ";
// import Overlay from "ol/Overlay";
// import { fromLonLat } from "ol/proj";

// const MapComponent = () => {
//   useEffect(() => {
//     const map = new Map({
//       target: "map",
//       layers: [
//         new TileLayer({
//           source: new XYZ({
//             url: `${window.location.origin}/Satellite/{z}/{x}/{y}.png`,
//           }),
//         }),
//       ],
//       view: new View({
//         center: fromLonLat([78.9629, 20.5937]),
//         zoom: 4,
//       }),
//     });

//     const markersData = [
//       { id: 1, lat: 28.6139, lon: 77.209, jamming: true },
//       { id: 2, lat: 19.076, lon: 72.8777, jamming: true },
//       { id: 3, lat: 12.9716, lon: 77.5946, jamming: true },
//       { id: 4, lat: 22.5726, lon: 88.3639, jamming: true },
//     ];

//     markersData.forEach((m) => {
//       const el = document.createElement("div");
//       el.className = "marker blinking";
//       el.style.width = "20px";
//       el.style.height = "20px";
//       el.style.background = "red";
//       el.style.borderRadius = "50%";
//       el.style.border = "2px solid white";
//       el.style.boxShadow = "0 0 5px black";

//       const overlay = new Overlay({
//         position: fromLonLat([m.lon, m.lat]),
//         positioning: "center-center",
//         element: el,
//         stopEvent: false,
//       });

//       map.addOverlay(overlay);
//     });
//   }, []);

//   return <div id="map" className="w-full h-full"></div>;
// };

// export default MapComponent;

import React from "react";

const MapComponent = () => {
  return <div></div>;
};

export default MapComponent;
