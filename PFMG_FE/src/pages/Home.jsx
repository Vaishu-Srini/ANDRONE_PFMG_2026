import missionPlanning from "../assets/images/mission-planning.svg";
import postMission from "../assets/images/post-mission.svg";
import memoryLoader from "../assets/images/memory-loader.svg";
import liveMissions from "../assets/images/LiveMissions.svg";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Greeting Section */}
      <div className="px-10 py-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[24px] font-medium text-white/95 font-mono">
            Hello Raj
          </h1>
          <p className="text-white/65 text-[12px] font-karla font-normal leading-normal capitalize not-italic">
            Welcome To The Dashboard Panel
          </p>
        </div>
      </div>

      {/* Modules Section */}
      <div className="space-y-6 px-10 py-15">
        <h2 className="text-[16px] font-medium text-white/95 not-italic leading-4 capitalize font-mono">
          Your Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-15">
          {/* Mission Planning Card */}
          <button
            onClick={() => {
              navigate("/missions");
            }}
            className="bg-[#37383B] hover:bg-white/10 transition-colors duration-200 rounded-lg p-8 cursor-pointer group  h-[240px] flex items-center"
          >
            <div className="flex flex-col items-start gap-10 ">
              <div className="w-[56px] h-[56px] flex items-center justify-center">
                <img src={missionPlanning} alt={missionPlanning}></img>
              </div>
              <h3 className="text-white/95 font-medium font-mono text-2xl text-start h-[68px] leading-[33.6px] not-italic">
                Mission Planning
              </h3>
            </div>
          </button>

          {/* Post-Mission Debrief Card */}
          <button
            onClick={() => {
              window.location.href = "http://localhost:4000/analysisHome";
            }}
          >
            <div className="bg-[#37383B] hover:bg-white/10 transition-colors duration-200 rounded-lg p-8 cursor-pointer group  h-[240px] flex items-center">
              <div className="flex flex-col items-start gap-10 ">
                <div className="w-[56px] h-[56px] flex items-center justify-center">
                  <img src={postMission} alt={postMission}></img>
                </div>
                <h3 className="text-white/95 font-medium font-mono text-2xl text-start h-[68px] leading-[33.6px] not-italic">
                  Post-Mission Debrief & Analysis
                </h3>
              </div>
            </div>
          </button>

          {/* Memory Loader Card */}
          <div className="bg-[#37383B] hover:bg-white/10 transition-colors duration-200 rounded-lg p-8 cursor-pointer group  h-[240px] flex items-center">
            <div className="flex flex-col items-start  gap-10 ">
              <div className="w-[56px] h-[56px] flex items-center justify-center">
                <img src={memoryLoader} alt={memoryLoader}></img>
              </div>
              <h3 className="text-white/95 font-medium font-mono text-2xl text-start h-[68px] leading-[33.6px] not-italic">
                Memory Loader & Verifier
              </h3>
            </div>
          </div>

          {/* Live Missions */}
          <button
            onClick={() => {
              navigate("/live-missions");
            }}
            className="bg-[#37383B] hover:bg-white/10 transition-colors duration-200 rounded-lg p-8 cursor-pointer group  h-[240px] flex items-center"
          >
            <div className="flex flex-col items-start gap-10 ">
              <div className="w-[56px] h-[56px] flex items-center justify-center">
                <img src={liveMissions} alt={liveMissions}></img>
              </div>
              <h3 className="text-white/95 font-medium font-mono text-2xl text-start h-[68px] leading-[33.6px] not-italic">
                Live Missions
              </h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
