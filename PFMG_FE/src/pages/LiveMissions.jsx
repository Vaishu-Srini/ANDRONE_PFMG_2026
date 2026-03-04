import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import externalLink from "../assets/images/ExternalLink.svg";
ModuleRegistry.registerModules([AllCommunityModule]);
import LiveMissionTablesCode from "../components/tables/LiveMissionTablesCode";
import LiveMissionMapCode from "../components/pfmgMaps/LiveMissionMapCode";
import { useWebSocket, useCsvWebSocket } from "@/services/useWebSocket";

export default function LiveMissions() {
  const { status, data: telemetryData, isConnected } = useWebSocket();
  const { status1, data: CsvData, isConnected1 } = useCsvWebSocket();
  // console.log(CsvData, "77777777777777777777777");
  const [emittersArray, setEmittersArray] = useState([]);
  const emittersMapRef = useRef(new Map());
  const drones = [
    { color: "#4BC26E", name: "Drone_Alpha" },
    { color: "#4BC26E", name: "Drone_Beta" },
    { color: "#797979", name: "Drone_Gamma" },
    { color: "#E32C44", name: "Drone_Delta" },
  ];
  useEffect(() => {
    if (telemetryData) {
      console.log("📥 Parent received telemetry:", telemetryData.EmitterId);

      // Create emitter object from incoming data
      const newEmitter = {
        emitterId: telemetryData.EmitterId || `EMIT-${Date.now()}`,
        frequency: telemetryData.Frequency || 0,
        error: telemetryData.BoresightError || 0,
        priority: "Low",
        status: telemetryData.Jammed ? "Jamming" : "Idle",
        action: telemetryData.Jammed || false,
        detectionTime: telemetryData.DetectionTime,
        latitude: telemetryData.Latitude,
        longitude: telemetryData.Longitude,
      };

      // Add or update emitter in Map
      emittersMapRef.current.set(newEmitter.emitterId, newEmitter);

      // Convert Map to array and update state
      const updatedArray = Array.from(emittersMapRef.current.values());
      setEmittersArray(updatedArray);

      console.log(
        `📊 Parent accumulated total: ${updatedArray.length} emitters`
      );
    }
  }, [telemetryData]);
  return (
    <div className="flex flex-col h-[100%] bg-[#414141] overflow-hidden box-border">
      {/* Header */}
      <header className="h-[56px] bg-[#37383B] px-[40px] py-[16px] flex gap-[60px] items-center">
        <span className="text-[#AFAFB1] font-mono">Drone Status</span>

        <div className="flex gap-[50px]">
          {drones.map((drone) => (
            <div
              key={drone.name}
              className="flex gap-[5px] items-center text-white"
            >
              <div
                className="h-[18px] w-[18px] rounded-full"
                style={{ backgroundColor: drone.color }}
              />
              <span>{drone.name}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 gap-[5px]">
        {/* Left side */}
        <section className="w-[60%] flex flex-col">
          {/* Section header */}
          <div className="h-[68px] border-[#545454] border-[2px] px-[40px] py-[5px] box-border">
            <p className="font-mono text-white text-[24px]">Emitters</p>
            <p className="text-[#BCBCBC] text-[12px]">
              The emitters which are detected in the mission
            </p>
          </div>

          {/* Jamming and select */}
          <LiveMissionTablesCode
            telemetryData={telemetryData}
          ></LiveMissionTablesCode>
        </section>

        {/* Right side */}
        <aside className="w-[40%] flex flex-col">
          {/* Section header */}
          <div className="h-[68px] border-[#545454] border-[2px] px-[40px] py-[5px] box-border flex items-center justify-between">
            <div className="font-mono text-white text-[24px]">Map</div>
            <div>
              <img src={externalLink} className="h-[20px] w-[20px]" />
            </div>
          </div>

          {/* Map screen */}
          <LiveMissionMapCode
            telemetryData={telemetryData}
            CsvData={CsvData}
          ></LiveMissionMapCode>
        </aside>
      </main>
    </div>
  );
}
