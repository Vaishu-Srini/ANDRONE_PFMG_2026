import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import menuDot from "../assets/images/menu-dot.svg";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, X } from "lucide-react";
import profile_image from "../assets/images/profile_image.png";
import { Clock3 } from "lucide-react";
import { Switch } from "./ui/switch";
import { toast } from "react-toastify";
import { BASE_URL, saveEmitterLink } from "../services/AdroneServices";
import {
  useMissionIdStore,
  useMissionStore,
  usePlatformIdStore,
  useSelectedItemsStore,
  useSidebarStore,
  useTreeDataStore,
} from "../store/missionStore";
import SaveFloppy from "../../src/assets/images/saveFloppy.png";
import { LiveMissionsHeader } from "./layout/Headers/LiveMissionsHeader";
import PlayICon from "../../src/assets/images/play.png";

const isModalRoute = (path) =>
  path.startsWith("/modal-") ||
  ["/modal-em", "/modal-mode", "/modal-detail"].includes(path);

const AppLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const handleAoiUpdated = (e) => {
      const { id, name } = e.detail || {};
      if (!id || !name) return;

      useTreeDataStore.getState().updateAoiName(id, name);
    };

    window.addEventListener("AOI_UPDATED", handleAoiUpdated);

    return () => {
      window.removeEventListener("AOI_UPDATED", handleAoiUpdated);
    };
  }, []);

  const path = location.pathname;

  const isEwConfig = path === "/ew-config";
  const PFMGDbMgmtListingPath = [
    "/PFMG-DbMgmt-Listing",
    "/PFMG-DbMgmt-Listing-details",
    "/jammingRecForMode",
  ];
  const isPFMGDbMgmtListing = PFMGDbMgmtListingPath.includes(path);
  const isModal = isModalRoute(path);
  const isEwConfigDetails = path === "/ew-config-details";
  const setPlatformId = usePlatformIdStore((state) => state.setPlatformId);
  const liveMission = path === "/live-missions";

  const baseHeader =
    "flex h-16 shrink-0 items-center bg-[#37383B] border-b border-white/10";

  function EwConfigHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    // Zustand stores
    const { missionId, setMissionId } = useMissionIdStore();
    const { platformId, setPlatformId, clearPlatformId } = usePlatformIdStore();
    const { treeData, emittersFlat } = useTreeDataStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [missionName, setMissionName] = useState("Unnamed_Mission");

    //  Parse mission from URL
    const searchParams = new URLSearchParams(location.search);
    const missionIdFromUrl = searchParams.get("missionId");
    const missionNameFromUrl = searchParams.get("missionName");

    //  Sync mission data with store
    useEffect(() => {
      if (missionIdFromUrl) setMissionId(missionIdFromUrl);
      if (missionNameFromUrl)
        setMissionName(decodeURIComponent(missionNameFromUrl));
    }, [missionIdFromUrl, missionNameFromUrl]);

    // Clear platformId on brand-new mission entry (when coming from /missions)
    useEffect(() => {
      if (missionIdFromUrl && missionIdFromUrl !== missionId) {
        clearPlatformId();
      }
    }, [missionIdFromUrl, missionId]);

    const handleSaveEmitterLink = async (treeDataInput, emittersFlatInput) => {
      try {
        // === Zustand current selections ===
        const { selectedIds } = useSelectedItemsStore.getState();

        // === Normalize input arrays ===
        const treeData = Array.isArray(treeDataInput) ? treeDataInput : [];
        const emittersFlat = Array.isArray(emittersFlatInput)
          ? emittersFlatInput
          : [];

        const groupedByAoi = {};

        treeData.forEach((aoiBlock) => {
          const aoiId = aoiBlock.areaInterestId;
          if (!aoiId) return;

          if (!groupedByAoi[aoiId])
            groupedByAoi[aoiId] = {
              areaInterestId: aoiId,
              weapons: [],
              emitters: [],
            };

          // ----  Process weapons under this AOI ----
          (aoiBlock.weapons || []).forEach((weapon) => {
            const weaponId = weapon.weaponId || 0;

            // Check if this weapon or any descendant is selected
            const weaponNodeId = `AOI_${aoiId}_Weapon_${weaponId}_0`;
            const hasWeaponSelected = selectedIds.has(weaponNodeId);

            const hasSelectedDescendant = (weapon.emitterLinkDtos || []).some(
              (em) => {
                const emitterNodeId = `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_0`;
                if (selectedIds.has(emitterNodeId)) return true;
                return (em.modeLinkDtos || []).some((mode) => {
                  const modeNodeId = `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_0`;
                  if (selectedIds.has(modeNodeId)) return true;
                  return (mode.jammingLinkDtos || []).some((jam) => {
                    const jamNodeId = `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_0`;
                    return selectedIds.has(jamNodeId);
                  });
                });
              },
            );

            if (hasWeaponSelected || hasSelectedDescendant) {
              const emitterDtos = (weapon.emitterLinkDtos || [])
                .filter((em) => {
                  const emNodeId = `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_0`;
                  if (selectedIds.has(emNodeId)) return true;
                  return (em.modeLinkDtos || []).some((mode) => {
                    const modeNodeId = `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_0`;
                    if (selectedIds.has(modeNodeId)) return true;
                    return (mode.jammingLinkDtos || []).some((jam) => {
                      const jamNodeId = `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_0`;
                      return selectedIds.has(jamNodeId);
                    });
                  });
                })
                .map((em) => ({
                  emitterId: em.emitterId,
                  emitterName: em.emitterName,
                  latitude: em.latitude,
                  longitude: em.longitude,
                  modeLinkDtos: (em.modeLinkDtos || [])
                    .filter((mode) => {
                      const modeNodeId = `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_0`;
                      if (selectedIds.has(modeNodeId)) return true;
                      return (mode.jammingLinkDtos || []).some((jam) => {
                        const jamNodeId = `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_0`;
                        return selectedIds.has(jamNodeId);
                      });
                    })
                    .map((mode) => ({
                      modeId: mode.modeId,
                      modeName: mode.modeName,
                      jammingLinkDtos: (mode.jammingLinkDtos || []).filter(
                        (jam) =>
                          selectedIds.has(
                            `AOI_${aoiId}_Weapon_${weaponId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_0`,
                          ),
                      ),
                    })),
                }));

              groupedByAoi[aoiId].weapons.push({
                weaponId,
                weaponName: weapon.weaponName,
                emitterLinkDtos: emitterDtos,
              });
            }
          });

          // Process standalone emitters under this AOI ----
          (aoiBlock.emitters || []).forEach((em) => {
            const emitterNodeId = `AOI_${aoiId}_Emitter_${em.emitterId}_0`;
            const isEmitterSelected = selectedIds.has(emitterNodeId);

            const hasSelectedChild = (em.modeLinkDtos || []).some((mode) => {
              const modeNodeId = `AOI_${aoiId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_0`;
              if (selectedIds.has(modeNodeId)) return true;
              return (mode.jammingLinkDtos || []).some((jam) => {
                const jamNodeId = `AOI_${aoiId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_0`;
                return selectedIds.has(jamNodeId);
              });
            });

            if (isEmitterSelected || hasSelectedChild) {
              groupedByAoi[aoiId].emitters.push({
                emitterId: em.emitterId,
                emitterName: em.emitterName,
                latitude: em.latitude,
                longitude: em.longitude,
                modeLinkDtos: (em.modeLinkDtos || [])
                  .filter((mode) => {
                    const modeNodeId = `AOI_${aoiId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_0`;
                    if (selectedIds.has(modeNodeId)) return true;
                    return (mode.jammingLinkDtos || []).some((jam) => {
                      const jamNodeId = `AOI_${aoiId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_0`;
                      return selectedIds.has(jamNodeId);
                    });
                  })
                  .map((mode) => ({
                    modeId: mode.modeId,
                    modeName: mode.modeName,
                    jammingLinkDtos: (mode.jammingLinkDtos || []).filter(
                      (jam) =>
                        selectedIds.has(
                          `AOI_${aoiId}_Emitter_${em.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_0`,
                        ),
                    ),
                  })),
              });
            }
          });
        });

        // Send payloads for each AOI ===
        for (const [aoiId, payload] of Object.entries(groupedByAoi)) {
          const response = await saveEmitterLink(payload);

          if (response.ok) {
            toast.success(`AOI_${aoiId} saved successfully!`, {
              position: "top-center",
            });
          } else {
            toast.error(`Failed to save AOI_${aoiId}`, {
              position: "top-center",
            });
          }
        }
      } catch (error) {
        toast.error("Error occurred while saving data.", {
          position: "top-center",
        });
      }
    };

    //  Generate PFM
    const handleGeneratePfm = async () => {
      if (!missionId) {
        toast.error("Mission ID missing — cannot generate PFM.");
        return;
      }

      try {
        setIsGenerating(true);

        const response = await fetch(
          `${BASE_URL}Pfm/pfm-generation/${missionId}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "PFM generation request failed");
        }

        const contentDisposition = response.headers.get("content-disposition");
        const filename =
          contentDisposition?.match(/filename="?([^"]+)"?/)?.[1] ??
          `mission_${missionId}_pfm`;

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // don't force .csv — keep whatever API sends
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success(`PFM file "${filename}" downloaded successfully!`);
      } catch (err) {
        toast.error(err.message || "Failed to generate PFM file.");
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <header className="flex h-16 shrink-0 items-center bg-[#37383B] border-b border-white/10 justify-between px-6 py-3">
        {/* === Left Section: Mission Info === */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            onClick={() => navigate("/missions")}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-white/95 font-karla text-[22px] not-italic font-medium leading-normal capitalize">
            {missionName} {missionId ? `(ID: ${missionId})` : ""}
          </span>
        </div>

        {/* === Right Section: Action Buttons === */}
        <div className="flex items-center gap-6">
          <Button
            onClick={() => handleSaveEmitterLink(treeData, emittersFlat)}
            size="sm"
            className="rounded-[4px]  bg-transparent border-sidebar-accent text-sidebar-accent cursor-pointer"
          >
            <img src={SaveFloppy} alt="SaveIcon" />
            <span className="text-white/95 font-karla text-base not-italic font-medium leading-normal capitalize">
              Save
            </span>
          </Button>

          <Button
            size="sm"
            className="rounded-sm border bg-transparent border-sidebar-accent text-sidebar-accent items-center  hover:text-white cursor-pointer"
          >
            <img src={PlayICon} alt="PlayIcon" className="h-3" />
            <span className="text-[#C5BFFF] font-karla text-base not-italic font-medium leading-normal capitalize">
              Play
            </span>
          </Button>

          {/* Always show View button */}
          <Button
            onClick={handleGeneratePfm}
            size="sm"
            className="rounded-sm  bg-[#7B70D6] hover:bg-[#6B60C6] text-white cursor-pointer"
          >
            {/* <Play className="w-4 h-4 text-white" />  */}
            <span className="text-white/95 font-karla text-base not-italic font-medium leading-normal capitalize">
              Generate PFM File
            </span>
          </Button>
        </div>
      </header>
    );
  }

  function PFMGDbMgmtListingHeader() {
    const navigate = useNavigate();
    return (
      <header className={`${baseHeader} justify-between px-4`}>
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            onClick={() => navigate("/emitters")}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white text-[22px]">Emitter Database </span>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-[4px] px-6 py-[2px] bg-[#4B4C4F] text-white cursor-pointer">
            Save
          </Button>
        </div>
      </header>
    );
  }

  function ModalHeader() {
    const navigate = useNavigate();
    return (
      <header
        className={`${baseHeader} justify-between px-10 py-4 rounded-t-[8px]`}
      >
        <div className="flex items-center gap-3">
          <span className="text-white/95 font-mono text-2xl not-italic font-medium leading-normal ">
            EW Detail Page
          </span>
        </div>
        <button
          aria-label="Close"
          className=" text-white/90 hover:text-white"
          // onClick={() => navigate(-1)}
          onClick={() => {
            navigate(-1);
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </header>
    );
  }

  function EwConfigDetailsHeader() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
      return date.toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    return (
      <header className={`${baseHeader} justify-between px-4`}>
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            onClick={() => navigate("/live-missions")}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white text-[22px]">Mission_30256</span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <Clock3 className="w-5 h-5" />
          <span className="text-[21px] font-mono">
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Space for future content */}
          <div className="text-[16px] text-white pr-[8px] ">Connections</div>
          <div className="w-[18px] h-[18px] rounded-full bg-[#00FF4C] border-[2px] border-black "></div>
          <div className="text-[16px] text-white">Stable Link</div>
          <div className="flex items-center ml-[20px] gap-1">
            <div className="text-[16px] text-white">Live Mode</div>
            <Switch defaultChecked />
          </div>
        </div>
      </header>
    );
  }

  function MainHeader({ title, menuDot }) {
    const navigate = useNavigate();

    const handleLogoClick = () => {
      try {
        //  clear all local/session storage (including Zustand persisted data)
        localStorage.clear();
        sessionStorage.clear();
        //   reset Zustand sidebar state in memory
        useSidebarStore.getState().clearAllSidebarData();
        navigate("/");
      } catch (error) {
        toast.error("Failed to clear data.", { position: "top-center" });
      }
    };
// changes in header font is done  by vaishnavi with responsiveness on the 05-03-2026{03:13pm}
    return (
      <header
        className={`${baseHeader} gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 h-14.25 px-6 py-3`}
      >
        <div className="flex items-center  gap-6 px-4 ">
          <SidebarTrigger className="-ml-1 text-gray-300 hover:text-white h-6 w-6" />
          <div
            className="bg-white/10 h-[32.625px] w-[32.625px] p-1.25 rounded-lg flex justify-center items-center cursor-pointer hover:bg-white/20 transition-colors"
            onClick={handleLogoClick}
          >
            <img
              src={menuDot}
              alt="menuDot"
              className="w-[14.625px] h-[14.625px]"
            />
          </div>
          <span className="logo-text text-primary">
            {title}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3 px-4">
          <span className="username-text text-primary">
            Ra-066
          </span>
          <img
            src={profile_image}
            alt="userIcon"
            className="w-[33px] h-[33px]"
          />
        </div>
      </header>
    );
  }

  const getPageTitle = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);

    switch (path) {
      case "/":
      case "/missions":
      case "/generatedFiles":
      case "/mission-selection":
      case "/emitters":
      case "/entity":
        return "Logo";
      case "/members":
        return "Members";
      case "/help":
        return "Help";
      case "/settings":
        return "Settings";
      case "/ew-config":
        return "EWConfig";
      case "/PFMG-DbMgmt-Listing-weapons":
        return "Weapons Database";
      case "/Emitter-Type-Selection":
        return "Entity Selection";
    }

    if (path.startsWith("/mission-creation")) {
      const component = searchParams.get("component");

      const formattedComponent =
        component?.charAt(0).toUpperCase() + component?.slice(1);
      return formattedComponent ? `${formattedComponent}` : "Mission Creation";
    }

    if (path.startsWith("/PFMG-DbMgmt-Listing")) return "Emitter Database";
    if (path.startsWith("/jammingRecForMode")) return "Jamming Recommendation";
    if (path.startsWith("/ew-config-details")) return "EW Config Details";
    if (path.startsWith("/live-missions")) return "Live Missions";

    return "Page Not Found";
  };

  const renderHeader = () => {
    if (isEwConfig) return <EwConfigHeader />;
    if (isModal) return <ModalHeader />;
    if (isPFMGDbMgmtListing) return <PFMGDbMgmtListingHeader />;
    if (isEwConfigDetails) return <EwConfigDetailsHeader />;
    if (liveMission) return <LiveMissionsHeader />;
    return (
      <MainHeader
        menuDot={menuDot}
        title={String(location.state?.title || getPageTitle())}
      />
    );
  };

  return (
    <SidebarProvider>
      <div className="fixed top-0 left-0 right-0 bg-[#37383B] z-20">
        {renderHeader()}
      </div>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col bg-[#414141] pt-16">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
