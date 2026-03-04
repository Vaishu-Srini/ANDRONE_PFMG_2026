// import React, { useEffect, useRef } from "react";
// import Plotly from "plotly.js-dist";

// /* --------------------------------------------------------
//    SAFE NUMBER HELPERS (Never return NaN or negative values)
// ---------------------------------------------------------*/
// function safeNumber(n, fallback = 0) {
//   const v = Number(n);
//   return Number.isFinite(v) ? v : fallback;
// }

// function safeInt(n, fallback = 0) {
//   const v = Number(n);
//   if (!Number.isFinite(v) || v < 0) return fallback;
//   return Math.round(v);
// }

// /* --------------------------------------------------------
//    REALISTIC EW CURVE GENERATOR (Parabolic Walk, Instant Drop)
// ---------------------------------------------------------*/
// function generateCurve({
//   min,
//   max,
//   rate,
//   walk,
//   hold,
//   stop,
//   pullIn,
//   isVelocity,
// }) {
//   const w = safeInt(walk, 5);
//   const h = safeInt(hold, 5);
//   const s = safeInt(stop, 5);

//   let total = w + h + s;
//   if (total <= 0) total = 10;

//   const resolution = 10;
//   const t = [];
//   const y = [];

//   let acceleration = safeNumber(rate);
//   if (acceleration === 0 && w > 0) {
//     acceleration = (2 * (max - min)) / (w * w);
//   }

//   for (let time = 0; time <= total; time += 1 / resolution) {
//     let val = min;

//     if (time <= h) {
//       val = min;
//     } else if (time <= h + w) {
//       const walkTimeElapsed = time - h;
//       if (isVelocity) {
//         val = min + acceleration * walkTimeElapsed;
//       } else {
//         val = min + 0.5 * acceleration * (walkTimeElapsed * walkTimeElapsed);
//       }
//       if (val > max) val = max;
//     } else {
//       val = max;
//     }

//     if (pullIn) val = -val;

//     t.push(time);
//     y.push(val);
//   }

//   if (s > 0) {
//     t.push(total);
//     y.push(0);
//   }

//   return { t, y, total };
// }

// /* --------------------------------------------------------
//    MAIN COMPONENT
// ---------------------------------------------------------*/
// export default function JammingPlot({ technique, values, pullInOut }) {
//   const plotRef = useRef(null);

//   useEffect(() => {
//     if (!plotRef.current) return;

//     const {
//       minRange,
//       maxRange,
//       rateOfChangeRange,
//       minVelocity,
//       maxVelocity,
//       rateOfChangeVelocity,
//       walkTime,
//       holdTime,
//       stopTime,
//     } = {
//       minRange: safeNumber(values.minRange),
//       maxRange: safeNumber(values.maxRange),
//       rateOfChangeRange: safeNumber(values.rateOfChangeRange),
//       minVelocity: safeNumber(values.minVelocity),
//       maxVelocity: safeNumber(values.maxVelocity),
//       rateOfChangeVelocity: safeNumber(values.rateOfChangeVelocity),
//       walkTime: safeNumber(values.walkTime),
//       holdTime: safeNumber(values.holdTime),
//       stopTime: safeNumber(values.stopTime),
//     };

//     const isCRVPO = technique === "CRVPO_I";
//     const isRGPO = technique === "RGPO_I" || isCRVPO;
//     const isVGPO = technique === "VGPO_I" || isCRVPO;

//     const traces = [];

//     if (isRGPO) {
//       const rangeCurve = generateCurve({
//         min: minRange,
//         max: maxRange,
//         rate: rateOfChangeRange,
//         walk: walkTime,
//         hold: holdTime,
//         stop: stopTime,
//         pullIn: pullInOut === "PULL_IN",
//         isVelocity: false,
//       });

//       traces.push({
//         x: rangeCurve.t,
//         y: rangeCurve.y,
//         type: "scatter",
//         mode: "lines",
//         name: "Range Error (m)",
//         line: { width: 3, color: "#00E5FF", shape: "spline" },
//         fill: "tozeroy",
//         fillcolor: "rgba(0, 229, 255, 0.1)",
//       });
//     }

//     if (isVGPO) {
//       const velocityCurve = generateCurve({
//         min: minVelocity,
//         max: maxVelocity,
//         rate: rateOfChangeVelocity,
//         walk: walkTime,
//         hold: holdTime,
//         stop: stopTime,
//         pullIn: pullInOut === "PULL_IN",
//         isVelocity: true,
//       });

//       traces.push({
//         x: velocityCurve.t,
//         y: velocityCurve.y,
//         type: "scatter",
//         mode: "lines",
//         name: "Velocity Error (m/s)",
//         yaxis: isCRVPO ? "y2" : "y",
//         line: {
//           width: 3,
//           dash: isCRVPO ? "dash" : "solid",
//           color: "#FF3D00",
//           shape: "spline",
//         },
//         fill: "tozeroy",
//         fillcolor: "rgba(255, 61, 0, 0.1)",
//       });
//     }

//     const layout = {
//       title: {
//         text: `${technique} Deception Curve`,
//         font: { color: "#FFFFFF", size: 16 },
//         x: 0.05, // Shifts the title to the left so it doesn't hit the toolbar
//       },
//       height: 400,
//       // Increased bottom margin ('b') from 40 to 80 to make room for the legend below
//       margin: { t: 50, l: 60, r: 60, b: 80 },

//       paper_bgcolor: "#2C2D30",
//       plot_bgcolor: "#2C2D30",

//       font: {
//         color: "#D1D5DB",
//         family: "system-ui, -apple-system, sans-serif",
//       },
//       hovermode: "x unified",

//       // MOVED LEGEND TO BOTTOM CENTER
//       legend: {
//         orientation: "h",
//         yanchor: "top",
//         y: -0.25, // Pushes it below the X-axis
//         xanchor: "center",
//         x: 0.5,
//         font: { color: "#FFFFFF" },
//       },

//       xaxis: {
//         title: { text: "Time (seconds)", font: { color: "#FFFFFF", size: 13 } },
//         showgrid: true,
//         gridcolor: "rgba(255,255,255,0.15)",
//         gridwidth: 1,
//         zeroline: true,
//         zerolinecolor: "rgba(255,255,255,0.3)",
//       },

//       yaxis: {
//         title: {
//           text: isVGPO && !isCRVPO ? "Velocity Error (m/s)" : "Range Error (m)",
//           font: { color: isVGPO && !isCRVPO ? "#FF3D00" : "#00E5FF", size: 13 },
//         },
//         showgrid: true,
//         gridcolor: "rgba(255,255,255,0.15)",
//         gridwidth: 1,
//         zeroline: true,
//         zerolinecolor: "rgba(255,255,255,0.3)",
//       },

//       yaxis2: isCRVPO
//         ? {
//             title: {
//               text: "Velocity Error (m/s)",
//               font: { color: "#FF3D00", size: 13 },
//             },
//             overlaying: "y",
//             side: "right",
//             showline: true,
//             showgrid: false,
//             zeroline: false,
//           }
//         : { visible: false },
//     };

//     const config = {
//       displayModeBar: true,
//       displaylogo: false,
//       responsive: true,
//       modeBarButtons: [
//         ["zoom2d", "pan2d"],
//         ["select2d", "lasso2d"],
//         ["zoomIn2d", "zoomOut2d", "autoScale2d", "resetScale2d"],
//         ["toImage"],
//       ],
//     };

//     Plotly.newPlot(plotRef.current, traces, layout, config);

//     return () => {
//       if (plotRef.current) Plotly.purge(plotRef.current);
//     };
//   }, [technique, values, pullInOut]);

//   return (
//     <div
//       ref={plotRef}
//       style={{
//         width: "100%",
//         height: "100%",
//         minHeight: "380px",
//         borderRadius: "8px",
//         overflow: "hidden",
//       }}
//     ></div>
//   );
// }

// import React, { useEffect, useRef } from "react";
// import Plotly from "plotly.js-dist";
// import { calculatePhaseTimeInSeconds } from "@/utils/kinematics";

// function safeNumber(n, fallback = 0) {
//   const v = Number(n);
//   return Number.isFinite(v) ? v : fallback;
// }

// export default function JammingPlot({
//   phasesData,
//   activeTab,
//   velUnit,
//   rangeUnit,
// }) {
//   const plotRef = useRef(null);

//   useEffect(() => {
//     if (!plotRef.current || !phasesData || phasesData.length === 0) return;

//     const t = [];
//     const traceData = [];
//     const resolution = 10; // 10 points per second
//     let globalTimeOffset = 0; // Tracks X-axis across all phases

//     phasesData.forEach((phase) => {
//       const minVel = safeNumber(phase.minVelocity);
//       const maxVel = safeNumber(phase.maxVelocity, minVel);
//       const minRng = safeNumber(phase.minRange);
//       const maxRng = safeNumber(phase.maxRange, minRng);
//       const acc = safeNumber(phase.acceleration);
//       const dirMulti = phase.targetDirection === "inbound" ? -1 : 1;

//       // 1. Calculate true duration using DSP Math
//       let mathMinV = velUnit === "kmph" ? minVel / 3.6 : minVel;
//       let mathMaxV = velUnit === "kmph" ? maxVel / 3.6 : maxVel;
//       let mathMinR = rangeUnit === "km" ? minRng * 1000 : minRng;
//       let mathMaxR = rangeUnit === "km" ? maxRng * 1000 : maxRng;

//       let trueDuration = calculatePhaseTimeInSeconds(
//         acc,
//         mathMinV,
//         mathMaxV,
//         mathMinR,
//         mathMaxR,
//         phase.targetDirection,
//       );

//       // Fallback if physics are impossible
//       if (trueDuration <= 0) {
//         trueDuration = safeNumber(phase.selectedPhaseDuration, 10);
//       }

//       // 2. Plot the curve using the true duration
//       for (let time = 0; time <= trueDuration; time += 1 / resolution) {
//         t.push(globalTimeOffset + time);

//         if (activeTab === "velocity") {
//           let v = minVel + acc * time;
//           v = Math.max(
//             Math.min(v, Math.max(minVel, maxVel)),
//             Math.min(minVel, maxVel),
//           );
//           traceData.push(v);
//         } else {
//           let r = minRng + dirMulti * (minVel * time + 0.5 * acc * time * time);
//           r = Math.max(
//             Math.min(r, Math.max(minRng, maxRng)),
//             Math.min(minRng, maxRng),
//           );
//           traceData.push(r);
//         }
//       }
//       globalTimeOffset += trueDuration;
//     });

//     const isRange = activeTab === "range";

//     const trace = {
//       x: t,
//       y: traceData,
//       type: "scatter",
//       mode: "lines",
//       name: isRange ? "Range" : "Velocity",
//       line: {
//         width: 3,
//         color: isRange ? "#00E5FF" : "#FF3D00",
//         shape: "spline",
//       },
//       fill: "tozeroy",
//       fillcolor: isRange ? "rgba(0, 229, 255, 0.1)" : "rgba(255, 61, 0, 0.1)",
//     };

//     const layout = {
//       autosize: true,
//       paper_bgcolor: "#2C2D30",
//       plot_bgcolor: "#2C2D30",
//       margin: { t: 30, l: 60, r: 60, b: 60 },
//       font: { color: "#D1D5DB" },
//       hovermode: "x unified",
//       xaxis: {
//         title: { text: "Global Scenario Time (s)", font: { size: 12 } },
//         gridcolor: "rgba(255,255,255,0.1)",
//       },
//       yaxis: {
//         title: {
//           text: isRange ? "Range" : "Velocity",
//           font: { color: isRange ? "#00E5FF" : "#FF3D00" },
//         },
//         gridcolor: "rgba(255,255,255,0.1)",
//       },
//     };

//     Plotly.newPlot(plotRef.current, [trace], layout, {
//       displayModeBar: false,
//       responsive: true,
//     });

//     return () => {
//       if (plotRef.current) Plotly.purge(plotRef.current);
//     };
//   }, [phasesData, activeTab, velUnit, rangeUnit]);

//   return (
//     <div
//       ref={plotRef}
//       style={{ width: "100%", height: "100%", minHeight: "380px" }}
//     />
//   );
// }

import React, { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist";
import { calculatePhaseTimeInSeconds } from "@/utils/kinematics";

function safeNumber(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

export default function JammingPlot({
  phasesData,
  activeTab,
  velUnit,
  rangeUnit,
}) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!plotRef.current || !phasesData || phasesData.length === 0) return;

    const t = [];
    const traceData = [];
    const resolution = 10; // 10 points per second
    let globalTimeOffset = 0; // Tracks X-axis across all phases

    // Keep track of where the PREVIOUS phase left off so the graph connects smoothly
    let currentGlobalRange = null;
    let currentGlobalVel = null;

    phasesData.forEach((phase) => {
      const minVel = safeNumber(phase.minVelocity);
      const maxVel = safeNumber(phase.maxVelocity, minVel);
      const minRng = safeNumber(phase.minRange);
      const maxRng = safeNumber(phase.maxRange, minRng);
      const acc = safeNumber(phase.acceleration);

      const isInbound = phase.targetDirection === "inbound";

      // 1. Calculate true duration using DSP Math
      let mathMinV = velUnit === "kmph" ? minVel / 3.6 : minVel;
      let mathMaxV = velUnit === "kmph" ? maxVel / 3.6 : maxVel;
      let mathMinR = rangeUnit === "km" ? minRng * 1000 : minRng;
      let mathMaxR = rangeUnit === "km" ? maxRng * 1000 : maxRng;

      let trueDuration = calculatePhaseTimeInSeconds(
        acc,
        mathMinV,
        mathMaxV,
        mathMinR,
        mathMaxR,
        phase.targetDirection,
      );

      // Fallback if physics are impossible
      if (trueDuration <= 0) {
        trueDuration = safeNumber(phase.selectedPhaseDuration, 10);
      }

      // Determine starting points for this specific phase
      // If this is phase 2+, we want it to start exactly where phase 1 ended
      let startVel = currentGlobalVel !== null ? currentGlobalVel : minVel;
      let startRange =
        currentGlobalRange !== null
          ? currentGlobalRange
          : isInbound
            ? maxRng
            : minRng;

      // 2. Plot the curve using the true duration
      for (let time = 0; time <= trueDuration; time += 1 / resolution) {
        t.push(globalTimeOffset + time);

        if (activeTab === "velocity") {
          let v = startVel + acc * time;

          // Clamp Velocity
          v = Math.max(
            Math.min(v, Math.max(minVel, maxVel)),
            Math.min(minVel, maxVel),
          );

          traceData.push(v);
          if (time >= trueDuration - 1 / resolution) currentGlobalVel = v; // Save end state
        } else {
          // Calculate distance traveled during this specific phase
          // Note: If you are mixing km and m/s, you need to normalize units for plotting
          // For graphing purposes, we assume minVel/acc are scaled to match minRng
          let distanceCovered = minVel * time + 0.5 * acc * time * time;

          // If inbound, we subtract distance from maxRng. If outbound, we add to minRng.
          let r = isInbound
            ? startRange - distanceCovered
            : startRange + distanceCovered;

          // Clamp Range strictly between minRng and maxRng
          r = Math.max(
            Math.min(r, Math.max(minRng, maxRng)),
            Math.min(minRng, maxRng),
          );

          traceData.push(r);
          if (time >= trueDuration - 1 / resolution) currentGlobalRange = r; // Save end state
        }
      }
      globalTimeOffset += trueDuration;
    });

    const isRange = activeTab === "range";

    const trace = {
      x: t,
      y: traceData,
      type: "scatter",
      mode: "lines",
      name: isRange ? "Range" : "Velocity",
      line: {
        width: 3,
        color: isRange ? "#00E5FF" : "#FF3D00",
        shape: "spline",
      },
      fill: "tozeroy",
      fillcolor: isRange ? "rgba(0, 229, 255, 0.1)" : "rgba(255, 61, 0, 0.1)",
    };

    const layout = {
      autosize: true,
      paper_bgcolor: "#2C2D30",
      plot_bgcolor: "#2C2D30",
      margin: { t: 30, l: 60, r: 60, b: 60 },
      font: { color: "#D1D5DB" },
      hovermode: "x unified",
      xaxis: {
        title: { text: "Global Scenario Time (s)", font: { size: 12 } },
        gridcolor: "rgba(255,255,255,0.1)",
      },
      yaxis: {
        title: {
          text: isRange ? `Range (${rangeUnit})` : `Velocity (${velUnit})`,
          font: { color: isRange ? "#00E5FF" : "#FF3D00" },
        },
        gridcolor: "rgba(255,255,255,0.1)",
      },
    };

    Plotly.newPlot(plotRef.current, [trace], layout, {
      displayModeBar: false,
      responsive: true,
    });

    return () => {
      if (plotRef.current) Plotly.purge(plotRef.current);
    };
  }, [phasesData, activeTab, velUnit, rangeUnit]);

  return (
    <div
      ref={plotRef}
      style={{ width: "100%", height: "100%", minHeight: "380px" }}
    />
  );
}
