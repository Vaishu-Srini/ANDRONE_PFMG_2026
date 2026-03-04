import {
  Plus,
  X,
  CheckSquare,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { useSearchParams } from "react-router-dom";
import { AOIModal } from "../aoi-modal";
import { AOIEditModal } from "../../pages/AOIEditModal";
import AddAOI from "../../assets/images/sidebar-icons/AOI_ADD.svg";
import filter from "../../assets/images/sidebar-icons/Filter.svg";
import NavModal from "./nav-modal";
import { useAoiStore } from "../../store/missionStore";
import { AOIbyID, DeleteAOI } from "../../services/AdroneServices";
import TrackContent from "../platformModels/TrackContent";
import { Popover, PopoverTrigger } from "../ui/popover";
import FormationContent from "../platformModels/FormationContent";
import AssignSite from "../platformModels/AssignSite";
import { MdOutlineArrowOutward } from "react-icons/md";

const Badge = ({ children, solid = false, className = "" }) => (
  <span
    className={
      (solid ? "bg-white/10" : "bg-[#7B70D6]") +
      " rounded px-2 py-0.5 text-[12px] " +
      className
    }
  >
    {children}
  </span>
);
export function NavEwConfig() {
  const [activeMode, setActiveMode] = useState("platform");
  const [isAOIModalOpen, setIsAOIModalOpen] = useState(false);
  const [aois, setAois] = useState([]); // single AOI source
  const [editAoi, setEditAoi] = useState(null);
  const { startDrawing } = useAoiStore();
  const [searchParams] = useSearchParams();
  const missionId = Number(searchParams.get("missionId")) || 0;
  const [hasAOI, setHasAOI] = useState(false);
  const [isPlatformVisible, setIsPlatformVisible] = useState(() => {
    return localStorage.getItem("isPlatformVisible") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isPlatformVisible", isPlatformVisible);
  }, [isPlatformVisible]);

  // Load AOIs for this mission on mount
  useEffect(() => {
    const storedIds = JSON.parse(
      localStorage.getItem(`aois_mission_${missionId}`) || "[]"
    );
    if (storedIds.length === 0) return;

    (async () => {
      const fetched = [];
      for (const id of storedIds) {
        const res = await AOIbyID(id);
        if (res.statusCode === 200 && res.payload) {
          fetched.push({
            id: res.payload.areaInterestId,
            name: res.payload.areaName,
          });
        }
      }
      setAois(fetched);
    })();
  }, [missionId]);

  // Listen for AOI events (add / remove)
  useEffect(() => {
    const handleAoiAdded = (e) => {
      const { id, name } = e.detail || {};
      if (!id) return;

      setAois((prev) => {
        if (prev.some((a) => a.id === id)) return prev; // skip duplicates
        const updated = [...prev, { id, name: name || "AOI" }];
        localStorage.setItem(
          `aois_mission_${missionId}`,
          JSON.stringify(updated.map((a) => a.id))
        );
        return updated;
      });
    };

    const handleAoiRemoved = (e) => {
      const { id } = e.detail || {};
      if (!id) return;
      setAois((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        localStorage.setItem(
          `aois_mission_${missionId}`,
          JSON.stringify(updated.map((a) => a.id))
        );
        return updated;
      });
    };

    window.addEventListener("AOI_ADDED", handleAoiAdded);
    window.addEventListener("AOI_REMOVED", handleAoiRemoved);
    return () => {
      window.removeEventListener("AOI_ADDED", handleAoiAdded);
      window.removeEventListener("AOI_REMOVED", handleAoiRemoved);
    };
  }, [missionId]);

  const handleDeleteAoi = async (id) => {
    try {
      const res = await DeleteAOI(id);

      if (res.statusCode === 200 || res.statusCode === 204) {
        //Remove from sidebar immediately
        const evt = new CustomEvent("AOI_REMOVED", { detail: { id } });
        window.dispatchEvent(evt);
        // console.log(`AOI ${id} removed from sidebar and map`);
      } else {
        // console.warn("AOI delete API returned unexpected code:", res);
      }
    } catch (err) {
      // console.error("Error deleting AOI:", err);
    }
  };
  useEffect(() => {
    const handleAoiAdded = (e) => {
      const { id, name } = e.detail || {};
      if (!id) return;

      setAois((prev) => {
        if (prev.some((a) => a.id === id)) return prev; // skip duplicates
        const updated = [...prev, { id, name: name || "AOI" }];
        localStorage.setItem(
          `aois_mission_${missionId}`,
          JSON.stringify(updated.map((a) => a.id))
        );
        return updated;
      });

      setHasAOI(true); // AOI now exists
    };

    const handleAoiRemoved = (e) => {
      const { id } = e.detail || {};
      if (!id) return;
      setAois((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        localStorage.setItem(
          `aois_mission_${missionId}`,
          JSON.stringify(updated.map((a) => a.id))
        );

        // If no AOIs remain, hide platform toggle
        if (updated.length === 0) setHasAOI(false);
        setActiveMode("platform");
        return updated;
      });
    };

    window.addEventListener("AOI_ADDED", handleAoiAdded);
    window.addEventListener("AOI_REMOVED", handleAoiRemoved);
    return () => {
      window.removeEventListener("AOI_ADDED", handleAoiAdded);
      window.removeEventListener("AOI_REMOVED", handleAoiRemoved);
    };
  }, [missionId]);

  useEffect(() => {
    const handleAoiUpdated = (e) => {
      const { id, name } = e.detail || {};
      if (!id) return;

      setAois((prev) =>
        prev.map((aoi) =>
          aoi.id === id ? { ...aoi, name: name || aoi.name } : aoi
        )
      );
    };

    window.addEventListener("AOI_UPDATED", handleAoiUpdated);
    return () => {
      window.removeEventListener("AOI_UPDATED", handleAoiUpdated);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("isPlatformVisible") === "true";
    setIsPlatformVisible(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("isPlatformVisible", isPlatformVisible);
  }, [isPlatformVisible]);

  return (
    <SidebarGroup>
      <div className="flex items-center gap-2 px-5 py-4">
        <div className="bg-[#414141] rounded-full w-full font-semibold">
          <div className="flex text-[13px]">
            {/* Only show Platform tab if AOI exists */}
            {hasAOI && (
              <button
                onClick={() => setActiveMode("config")}
                className={`px-3 py-2.5 rounded-full w-full text-center transition-colors ${
                  activeMode === "config"
                    ? "bg-[#C5BFFF] text-black/75 font-semibold "
                    : "text-white/70 hover:text-white font-medium"
                }`}
              >
                <span className="font-karla text-xs not-italic leading-normal capitalize">
                  platform
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveMode("platform")}
              className={`px-3 py-2.5 rounded-full ${
                hasAOI ? "w-full" : "w-full"
              } text-center transition-colors  ${
                activeMode === "platform"
                  ? "bg-[#C5BFFF] text-black/75 font-semibold "
                  : "text-white/70 hover:text-white font-medium"
              }`}
            >
              <span className="font-karla text-xs not-italic leading-normal capitalize">
                EW Config
              </span>
            </button>
          </div>
        </div>
      </div>
      <SidebarMenuItem className="px-5 py-4">
        <div className=" text-white/60 font-mono text-xs not-italic font-normal leading-normal mb-4">
          {/* text-[12px] tracking-wider text-white/60*/}
          SITES
        </div>
        <div className="flex ">
          <div className="text-white/95 font-karla text-[13px] not-italic font-medium leading-[18.2px] mb-2">
            Assign Site
          </div>
          {/* text-white text-sm*/}
          <div className="ml-auto text-white/70 hover:text-white">
            <div className="flex ">
              <div className="ml-auto"></div>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="ml-auto text-white/80 hover:text-black/60 hover:bg-[#C5BFFF] ">
                    <Plus className="w-5 h-5" />
                  </button>
                </PopoverTrigger>
                <AssignSite />
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3 mt-2 ">
          <div className="text-[#2D2D2D] font-mono text-xs not-italic font-normal bg-[rgba(179,179,179,0.60)] px-2 py-1 rounded-sm">
            {" "}
            {/* text-xs text-white/80 bg-white/10 rounded px-2 py-1*/}B
          </div>
          <div className="text-white/95 font-karla text-sm not-italic font-normal capitalize">
            Bangalore-Hyderabad
          </div>
        </div>
      </SidebarMenuItem>
      <div className=" border-b border-[#FFFFFF1A]"></div>
      <SidebarMenu>
        {activeMode === "platform" ? (
          <>
            <div className="ml-5 py-4">
              <p className="text-white/60 font-mono text-xs not-italic font-normal leading-normal">
                AOI
              </p>{" "}
              {/*text-[#FFFFFF]/60 text-[12px]*/}
            </div>
            <SidebarMenuItem className="px-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <Button
                  size="sm"
                  onClick={() => startDrawing()}
                  className="border border-dashed border-white/10  rounded-sm flex-1 items-center bg-white/10 cursor-pointer"
                >
                  <Plus />
                  <span className="text-white/95 font-karla text-sm not-italic font-bold leading-normal tracking-[0.21px]">
                    Add AOI
                  </span>
                  {/*text-sm text-[#AFAFB1] */}
                </Button>
                <Button
                  className="bg-[#C5BFFF] hover:bg-[#C5BFFF] h-8 w-8 p-0 rounded-sm cursor-pointer "
                  onClick={() => startDrawing()}
                  title="Draw new AOI"
                >
                  <img src={AddAOI} alt="Add AOI" className="w-4 h-4" />
                </Button>
              </div>

              {aois.length === 0 ? (
                <div className="text-xs text-white/70">
                  {/* No AOIs yet. Click + to start drawing. */}
                </div>
              ) : (
                <div className="space-y-2">
                  {aois.map((aoi) => (
                    <div
                      key={aoi.id}
                      className="bg-[#414141] rounded-lg p-2 flex items-center gap-3"
                    >
                      <div className="bg-[#7D7D7D] p-1 rounded">
                        <img src={AddAOI} className="w-4 h-4" alt="AOI" />
                      </div>
                      <span className="text-sm text-white flex-1">
                        {aoi.name}
                      </span>

                      <Button
                        className=" bg-transparent hover:bg-[#C5BFFF] h-6 w-6 p-0 rounded invert brightness-200 hover:invert-0 hover:brightness-100"
                        onClick={() => setEditAoi(aoi)}
                      >
                        <img src={filter} className="w-3 h-3 " alt="Edit" />
                      </Button>

                      <Button
                        className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10 !bg-[transparent]"
                        onClick={() => handleDeleteAoi(aoi.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SidebarMenuItem>

            <div className="my-4 border-b border-[#FFFFFF1A]"></div>

            {editAoi && (
              <AOIEditModal
                isOpen={!!editAoi}
                onClose={() => setEditAoi(null)}
                aoi={editAoi}
                aoiId={editAoi.id}
              />
            )}
            <NavModal />
          </>
        ) : (
          <>
            <SidebarMenuItem className="px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/65 font-mono text-xs not-italic font-normal leading-normal ">
                  Show Platform
                </span>{" "}
                {/* text-sm text-[#AFAFB1]*/}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isPlatformVisible} // add this line
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setIsPlatformVisible(isChecked);
                      window.dispatchEvent(
                        new CustomEvent("PLATFORM_VISIBILITY_TOGGLED", {
                          detail: { visible: isChecked },
                        })
                      );
                    }}
                  />
                  <div
                    className="
          w-10 h-5 
          bg-gray-400 
          rounded-full 
          peer-checked:bg-[#C5BFFF]
          transition-colors
          duration-300
        "
                  ></div>
                  <div
                    className="
          absolute left-[2px] top-[2px] 
          w-4 h-4 bg-white rounded-full
          transition-transform
          duration-300
          peer-checked:translate-x-5
        "
                  ></div>
                </label>
              </div>
            </SidebarMenuItem>
            {isPlatformVisible && (
              <SidebarMenuItem className="px-5">
                <div className="flex justify-between items-center">
                  <div className="text-white/65 font-mono text-xs not-italic font-normal leading-normal mb-6">
                    {/* text-[10px] tracking-wider text-white/60 mb-2*/}
                    FORMATIONS
                  </div>
                  <button className=" flex gap-1 items-center text-[#C5BFFF] font-karla text-[13px] not-italic font-medium leading-normal mb-6">
                    <Plus className="w-4 h-4" />
                    New
                  </button>
                </div>

                {/* F1 */}
                <div className="text-xs flex items-center gap-2 text-white/90 mb-4">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <Badge className="text-[#2D2D2D] font-mono text-xs not-italic font-normal leading-normal capitalize w-5 h-5 relative bg-[#B7AFFF]">
                    <span className="absolute inset-0 left-1">F1</span>
                  </Badge>
                  <span className="text-white/80 font-karla text-sm not-italic font-medium leading-normal capitalize">
                    Sky Talon
                  </span>
                </div>

                <div className="flex items-center">
                  <div className=" text-white/95 font-karla text-[13px] not-italic font-medium leading-normal mb-1">
                    Platform
                  </div>
                  <button className="ml-auto text-[#C5BFFF] hover:text-white mb-1">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Selected platform */}
                <SidebarMenuButton className="rounded-[8px] px-4 bg-[#C5BFFF] text-white/95 mb-1">
                  <div className="flex items-center gap-1 w-full">
                    <CheckSquare className="w-3.5 h-3.5 -ml-1" />
                    {/* <span className="text-[12px] bg-white/15 rounded px-1.5 py-0.5">
                      P
                    </span> */}
                    <Badge className="text-[#2D2D2D] font-mono text-xs not-italic font-normal leading-normal capitalize w-5 h-5 relative bg-[#B7AFFF]">
                      <span className="absolute inset-0 left-1.5">P</span>
                    </Badge>
                    <span className="text-black/75 font-karla text-xs not-italic font-bold leading-normal capitalize">
                      MQ-9 Reaper
                    </span>
                    <span className="ml-auto text-[#7B70D6] font-karla text-xs not-italic font-bold leading-normal ">
                      Leader...
                    </span>
                    {/* <ChevronRight className="w-4 h-4 rotate-90 text-white/90" /> */}
                  </div>
                </SidebarMenuButton>

                <div className="flex">
                  <div className="ml-auto"></div>
                  <div className=" text-white/95 text-[13px] not-italic font-normal leading-normal mb-1">
                    Race Track
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="ml-auto text-white/80 hover:text-white">
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    {/* <FormationContent /> */}
                    <TrackContent />
                  </Popover>
                </div>
                {/* Quadcopter row */}
                <SidebarMenuButton className="rounded-[4px] px-4 bg-transparent text-white/95 hover:text-black/75 font-normal hover:font-bold mb-1">
                  <div className="flex items-center gap-2 w-full">
                    <CheckSquare className="w-3.5 h-3.5 -ml-1" />
                    {/* <span className="text-[12px] bg-white/15 rounded px-1.5 py-0.5">
                      P
                    </span> */}
                    <Badge className="text-[#2D2D2D] font-mono text-xs not-italic font-normal leading-normal capitalize w-5 h-5 relative bg-[#B7AFFF]">
                      <span className="absolute inset-0 left-1.5">P</span>
                    </Badge>
                    <span className=" font-karla text-xs not-italic leading-normal capitalize">
                      Quadcopter
                    </span>
                  </div>
                </SidebarMenuButton>
                <div className="flex">
                  <div className="ml-auto"></div>
                  <div className="text-white/95 text-[13px] not-italic font-normal leading-normal mb-1">
                    Race Track
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="ml-auto text-white/80 hover:text-white cursor-pointer">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                    </PopoverTrigger>

                    <TrackContent />
                  </Popover>
                </div>
                {/* Skyquest row */}
                <SidebarMenuButton className="rounded-[4px] px-4 bg-transparent text-white/95 hover:text-black/75 font-normal hover:font-bold mb-1">
                  <div className="flex items-center gap-2 w-full">
                    <CheckSquare className="w-3.5 h-3.5 -ml-1" />
                    {/* <span className="text-[12px] bg-white/15 rounded px-1.5 py-0.5">
                      P
                    </span> */}
                    <Badge className="text-[#2D2D2D] font-mono text-xs not-italic font-normal leading-normal capitalize w-5 h-5 relative bg-[#B7AFFF]">
                      <span className="absolute inset-0 left-1.5">P</span>
                    </Badge>
                    <span className="font-karla text-xs not-italic leading-normal capitalize">
                      Skyquest
                    </span>
                    {/* <ChevronRight className="w-4 h-4 rotate-90 ml-auto text-white/80" /> */}
                  </div>
                </SidebarMenuButton>

                <div className="flex">
                  <div className="ml-auto"></div>
                  <div className="pl-4 text-[13px] text-white/65 font-karla not-italic font-normal leading-normal capitalize mb-1">
                    + Add platform Profile
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="ml-auto text-white/80 hover:text-white cursor-pointer">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                    </PopoverTrigger>

                    <TrackContent />
                  </Popover>
                </div>
                {/* Formation Params */}
                <div className="text-sm text-white/90 flex items-center justify-between py-2 mb-10">
                  <span className="font-karla text-[13px] not-italic font-medium leading-normal">
                    Formation Parameters
                  </span>
                  <ChevronRight className="w-4 h-4  text-black/80 bg-[#C5BFFF]" />
                </div>

                {/* F2 */}
                <div className="text-xs flex items-center gap-2 text-white/90 mb-4">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <Badge className="text-[#2D2D2D] font-mono text-xs not-italic font-normal leading-normal capitalize w-5 h-5 relative bg-[#B7AFFF]">
                    <span className="absolute inset-0 left-1">F2</span>
                  </Badge>
                  <span className="text-white/80 font-karla text-sm not-italic font-medium leading-normal capitalize">
                    Sky Talon 2
                  </span>
                </div>
                <div className="flex items-center">
                  <div className=" text-white/95 font-karla text-[13px] not-italic font-medium leading-normal mb-1">
                    Platform
                  </div>
                  <button className="ml-auto text-[#C5BFFF] hover:text-white mb-1">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <SidebarMenuButton className="rounded-[4px] px-4 bg-transparent text-white/95 hover:text-black/75 font-normal hover:font-bold mb-1">
                  <div className="flex items-center gap-2 w-full">
                    <CheckSquare className="w-3.5 h-3.5" />
                    {/* <span className="text-[12px] bg-white/15 rounded px-1.5 py-0.5">
                      P
                    </span> */}
                    <Badge className="text-[#2D2D2D] font-mono text-xs not-italic font-normal leading-normal capitalize w-5 h-5 relative bg-[#B7AFFF]">
                      <span className="absolute inset-0 left-1.5">P</span>
                    </Badge>
                    <span className="font-karla text-xs not-italic leading-normal capitalize">
                      MQ-9 Reaper
                    </span>
                  </div>
                </SidebarMenuButton>
                <div className="flex">
                  <div className="ml-auto"></div>
                  <div className="text-white/95 text-[13px] not-italic font-normal leading-normal mb-1">
                    Race Track
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="ml-auto text-white/80 hover:text-white">
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <FormationContent />
                  </Popover>
                </div>
                <SidebarMenuButton className="rounded-[4px] px-4 bg-transparent text-white/95 hover:text-black/75 font-normal hover:font-bold mb-1">
                  <div className="flex items-center gap-2 w-full">
                    <CheckSquare className="w-3.5 h-3.5" />
                    {/* <span className="text-[12px] bg-white/15 rounded px-1.5 py-0.5">
                      P
                    </span> */}
                    <Badge className="text-[#2D2D2D] font-mono text-xs not-italic font-normal leading-normal capitalize w-5 h-5 relative bg-[#B7AFFF]">
                      <span className="absolute inset-0 left-1.5">P</span>
                    </Badge>
                    <span className="font-karla text-xs not-italic leading-normal capitalize">
                      Quadcopter
                    </span>
                  </div>
                </SidebarMenuButton>

                <div className="flex">
                  <div className="ml-auto"></div>
                  <div className="text-white/95 text-[13px] not-italic font-normal leading-normal mb-1">
                    Race Track
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="ml-auto text-white/80 hover:text-white">
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <FormationContent />
                  </Popover>
                </div>
              </SidebarMenuItem>
            )}
          </>
        )}
        <div className="my-4 border-b border-[#FFFFFF1A]"></div>
        <SidebarMenuItem className="px-3 pb-6">
          <SidebarMenuButton className="rounded-[4px] px-2 bg-transparent text-white/95 hover:text-black/95 ">
            <div className="flex justify-between items-center w-full">
              <span className="font-karla text-[13px] not-italic font-medium leading-normal capitalize">
                View Ambiguity Analysis
              </span>
              <MdOutlineArrowOutward className="w-5 h-5 " />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavEwConfig;
