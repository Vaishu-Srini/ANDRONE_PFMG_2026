// import { useEffect, useMemo, useRef, useState } from "react";

// export function useWebSocket() {
//   const [status, setStatus] = useState("connecting…");
//   const [data, setData] = useState(null);
//   const wsRef = useRef(null);

//   const wsUrl = useMemo(() => {
//     const host = "192.168.0.116:5058";
//     const scheme = window.location.protocol === "https:" ? "wss" : "ws";
//     return `${scheme}://${host}/ws/telemetry`;
//   }, []);

//   useEffect(() => {
//     const ws = new WebSocket(wsUrl);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("✅ WebSocket Connected");
//       setStatus("open");
//     };

//     ws.onclose = () => {
//       console.log("❌ WebSocket Closed");
//       setStatus("closed");
//     };

//     ws.onerror = (error) => {
//       console.error("⚠️ WebSocket Error:", error);
//       setStatus("error");
//     };

//     ws.onmessage = (e) => {
//       console.log("📡 Received telemetry data:", e.data);
//       try {
//         const parsedData = JSON.parse(e.data);
//         setData(parsedData);
//       } catch (err) {
//         console.error("Could not parse message as JSON:", e.data);
//         // Store raw data if not JSON
//         setData(e.data);
//       }
//     };

//     return () => {
//       console.log("🔌 Cleaning up WebSocket");
//       ws.close();
//     };
//   }, [wsUrl]);

//   return {
//     status,
//     data,
//     isConnected: status === "open",
//     isConnecting: status === "connecting…",
//     hasError: status === "error",
//   };
// }

import { useEffect, useMemo, useRef, useState } from "react";

export function useWebSocket() {
  const [status, setStatus] = useState("connecting…");
  const [messages, setMessages] = useState([]); // store all emitter messages
  const wsRef = useRef(null);

  const wsUrl = useMemo(() => {
    const host = "192.168.0.116:5058";
    const scheme = window.location.protocol === "https:" ? "wss" : "ws";
    return `${scheme}://${host}/ws/telemetry`;
  }, []);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      setStatus("open");
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Closed");
      setStatus("closed");
    };

    ws.onerror = (error) => {
      console.error("⚠ WebSocket Error:", error);
      setStatus("error");
    };

    ws.onmessage = (e) => {
      console.log("📡 Received telemetry data:", e.data);
      try {
        const parsedData = JSON.parse(e.data);

        // ✅ If backend sends one object at a time
        setMessages((prev) => [...prev, parsedData]);

        // ✅ If backend sends an array of emitters instead
        // setMessages((prev) => [...prev, ...parsedData]);
      } catch (err) {
        console.error("Could not parse message as JSON:", e.data);
      }
    };

    return () => {
      console.log("🔌 Cleaning up WebSocket");
      ws.close();
    };
  }, [wsUrl]);

  return {
    status,
    data: messages,
    isConnected: status === "open",
    isConnecting: status === "connecting…",
    hasError: status === "error",
};
}



export function useCsvWebSocket() {
  const [status, setStatus] = useState("connecting…");
  const [messages, setMessages] = useState([]); // store all CSV messages
  const wsRef = useRef(null);

  useEffect(() => {
    // ✅ Direct WebSocket URL
    const ws = new WebSocket("ws://192.168.0.116:5058/ws/csv");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ CSV WebSocket Connected");
      setStatus("open");
    };

    ws.onclose = () => {
      console.log("❌ CSV WebSocket Closed");
      setStatus("closed");
    };

    ws.onerror = (error) => {
      console.error("⚠️ CSV WebSocket Error:", error);
      setStatus("error");
    };

    ws.onmessage = (e) => {
      console.log("📩 Received CSV data:", e.data);
      try {
        const parsedData = JSON.parse(e.data);

        // ✅ Append to messages array
        setMessages((prev) => [...prev, parsedData]);
      } catch (err) {
        console.error("Could not parse CSV message as JSON:", e.data);
      }
    };

    return () => {
      console.log("🔌 Cleaning up CSV WebSocket");
      ws.close();
    };
  }, []); // ✅ No dependencies needed since URL is hardcoded

  return {
    status,
    data: messages,
    isConnected: status === "open",
    isConnecting: status === "connecting…",
    hasError: status === "error",
  };
}
