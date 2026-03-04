import React, { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import dayjs from "dayjs";
import { Switch } from "../../ui/switch";
import refresh from "../../../assets/images/RefreshMissionHeader.svg";
import setting from "../../../assets/images/SettingMissionHeader.svg";
import { useNavigate } from "react-router-dom";
import backward from "../../../assets/images/backward.svg";
export const LiveMissionsHeader = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm:ss"));
  const [isLive, setIsLive] = useState(true);
  const navigate = useNavigate(); // ✅ Add useNavigate hook
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="h-[56px] px-[24px] py-[13px] flex items-center justify-between">
      <button
        onClick={handleBack}
        className="w-[32px] h-[32px] flex items-center justify-center hover:bg-[#4B4B4B] rounded-[5px] transition-colors"
      >
        <img src={backward} alt="Back" className="w-[20px] h-[20px]" />
      </button>
      <div className="text-white text-[22px]">Mission_30256</div>
      <div className="flex-1 flex justify-center text-[#FFFFFFB2]">
        <div className="flex items-center gap-2">
          <Clock3 className="w-5 h-5" />
          <span className="text-[21px] font-mono font-extrabold">
            {currentTime}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-[24px] font-mono text-white text-[16px]">
        <div className="flex items-center font-mono text-white text-[16px] gap-[16px]">
          <span>Connection</span>

          <div className="flex items-center gap-1">
            <div className="w-[18px] h-[18px] rounded-full bg-[#7B70D6] border-2 border-black"></div>
            <span>Stable Link</span>
          </div>
        </div>

        <div className="flex items-center gap-[16px]">
          <span>Live Mode</span>
          <Switch
            className="border-black"
            checked={isLive}
            onCheckedChange={() => {
              setIsLive(!isLive);
            }}
          />
        </div>

        <div className="flex items-center gap-[16px]">
          <img src={refresh} />
          <span>Refreshed 2 mins ago</span>
        </div>
        <div className="flex items-center justify-center gap-[16px] h-[30px] w-[35px] border-[#4B4C4F] border-[2px] p-[5px] rounded-[5px]">
          <img src={setting} />
        </div>
      </div>
    </div>
  );
};
