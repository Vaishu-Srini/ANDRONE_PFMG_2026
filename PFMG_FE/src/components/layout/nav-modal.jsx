import { Plus, ChevronRight, ChevronDown } from "lucide-react";
import { SidebarGroup } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tree } from "react-arborist";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { AOIbyID, GetEmittersInArea } from "../../services/AdroneServices";
import {
  useSelectedItemsStore,
  useTreeDataStore,
} from "../../store/missionStore";

// --- HELPER FUNCTIONS ---
function transformWeaponsForTree(apiData) {
  if (!apiData) return [];
  const rootArray = Array.isArray(apiData) ? apiData : [apiData];

  return rootArray.flatMap((root) => {
    if (!root?.weapons?.length) return [];
    const aoiKey = root.areaInterestId
      ? `AOI_${root.areaInterestId}`
      : "GLOBAL";

    return root.weapons.map((weapon, wIndex) => ({
      id: `${aoiKey}_Weapon_${weapon.weaponId}_${wIndex}`,
      name: weapon.weaponName,
      type: "weapon",
      children: (weapon.emitterLinkDtos || []).map((emitter, eIndex) => ({
        id: `${aoiKey}_Weapon_${weapon.weaponId}_Emitter_${emitter.emitterId}_${eIndex}`,
        name: emitter.emitterName,
        type: "emitter",
        latitude: emitter.latitude,
        longitude: emitter.longitude,
        children: (emitter.modeLinkDtos || []).map((mode, mIndex) => ({
          id: `${aoiKey}_Weapon_${weapon.weaponId}_Emitter_${emitter.emitterId}_Mode_${mode.modeId}_${mIndex}`,
          name: mode.modeName,
          type: "mode",
          children: (mode.jammingLinkDtos || []).map((jam, jIndex) => ({
            id: `${aoiKey}_Weapon_${weapon.weaponId}_Emitter_${emitter.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_${jIndex}`,
            name: jam.jammingName?.replace(/_[^_]*$/, "") ?? "Jamming",
            type: "jamming",
          })),
        })),
      })),
    }));
  });
}

const getNavigationRoute = (node) => {
  const nodeData = node.data;
  const type = nodeData.type?.toLowerCase() || "";

  switch (type) {
    case "jamming":
      return { route: `/modal-detail?nodeId=${node.id}`, type: "jamming" };
    case "mode":
      return { route: `/modal-mode?nodeId=${node.id}`, type: "mode" };
    case "emitter":
      return { route: `/modal-em?nodeId=${node.id}`, type: "emitter" };
    case "weapon":
      return { route: `/modal-ws?nodeId=${node.id}`, type: "weapon" };
    default:
      return { route: "/", type: "unknown" };
  }
};

function Node({ node, style, dragHandle, navigate, fullTree, activeNodeId }) {
  const { selectedIds, selectNode, deselectNode } = useSelectedItemsStore();
  const isChecked = selectedIds.has(node.id);
  const isActive = activeNodeId === node.id;

  useEffect(() => {
    if (!isChecked) {
      selectNode(node);
    }
  }, []);

  const handleCheckboxToggle = (checked) => {
    if (checked) selectNode(node);
    else deselectNode(node, fullTree);
  };

  const handleLabelClick = () => {
    const navigation = getNavigationRoute(node);
    navigate(navigation.route);
  };

  return (
    <div style={style} ref={dragHandle} className="flex w-full">
      <div
        className={`flex items-center gap-2 py-1 flex-1 rounded-md transition-colors`}
      >
        {/* Chevron */}
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          {!node.isLeaf &&
            (node.isOpen ? (
              <ChevronDown
                className="w-3 h-3 text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  node.toggle();
                }}
              />
            ) : (
              <ChevronRight
                className="w-3 h-3 text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  node.toggle();
                }}
              />
            ))}
        </div>

        {/* Checkbox */}
        <div className="flex items-center justify-center shrink-0">
          {node.data.type !== "aoi" ? (
            <Checkbox
              id={node.id}
              checked={isChecked}
              onCheckedChange={(checked) => handleCheckboxToggle(checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 border-gray-400 data-[state=checked]:bg-gray-400 data-[state=checked]:text-black"
            />
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>

        {/* Label */}
        <div
          onClick={() => {
            if (node.data.type === "aoi") {
              node.toggle();
              return;
            }
            handleLabelClick();
          }}
          className={`cursor-pointer select-none truncate text-[13px] ${
            isActive ? "text-[#C5BFFE]" : "text-gray-200"
          } hover:text-white`}
        >
          {node.data.name}
        </div>
      </div>
    </div>
  );
}

function countNodes(data) {
  if (!Array.isArray(data)) return 0;
  return data.reduce((acc, node) => {
    const childCount = node.children ? countNodes(node.children) : 0;
    return acc + 1 + childCount;
  }, 0);
}

// --- MAIN COMPONENT ---
export function NavModal() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const nodeId = searchParams.get("nodeId");
    setActiveNodeId(nodeId);
  }, [location, searchParams]);

  let missionId = 0;
  let aoiId = 0;

  try {
    const stored = localStorage.getItem("mission-id-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      missionId = Number(parsed?.state?.missionId) || 0;
    }
  } catch (err) {
    console.error("Error parsing mission-id-storage:", err);
  }

  const { treeData, setTreeData } = useTreeDataStore();

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!missionId) return;
    const currentMission = missionId;
    let isCancelled = false;

    setTreeData([]);

    Object.keys(localStorage)
      .filter(
        (key) =>
          key.startsWith("aoiNameMap_mission_") ||
          key.startsWith("aois_mission_")
      )
      .forEach((key) => localStorage.removeItem(key));

    async function fetchEmittersSafe(useCache = true) {
      if (isCancelled) return;
      let aoiNameMap = [];
      if (useCache) {
        aoiNameMap = JSON.parse(
          localStorage.getItem(`aoiNameMap_mission_${currentMission}`) || "[]"
        );
      }

      try {
        const apiResponse = await GetEmittersInArea(currentMission, aoiId);
        if (isCancelled) return;

        const storedIds = apiResponse.map((b) => b.areaInterestId);
        localStorage.setItem(
          `aois_mission_${currentMission}`,
          JSON.stringify(storedIds)
        );

        if (!aoiNameMap.length && storedIds.length > 0) {
          const freshMap = [];
          for (const id of storedIds) {
            try {
              const res = await AOIbyID(id);
              if (res.statusCode === 200 && res.payload) {
                freshMap.push({
                  id: res.payload.areaInterestId,
                  name: res.payload.areaName,
                });
              }
            } catch (err) {
              console.warn("AOIbyID failed for id:", id, err);
            }
          }

          if (freshMap.length > 0) {
            aoiNameMap = freshMap;
            localStorage.setItem(
              `aoiNameMap_mission_${currentMission}`,
              JSON.stringify(freshMap)
            );
          }
        }

        const groupedByAoi = (apiResponse || []).map((block) => {
          const matched = aoiNameMap.find(
            (a) => String(a.id) === String(block.areaInterestId)
          );
          const displayName = matched
            ? matched.name
            : `AOI ${block.areaInterestId}`;
          return {
            areaInterestId: block.areaInterestId,
            areaName: displayName,
            weapons: block.weapons || [],
            emitters: block.emitters || [],
          };
        });

        setTreeData(groupedByAoi);
      } catch (error) {
        if (isCancelled) return;
        setTreeData([]);
      }
    }

    fetchEmittersSafe(true);

    const handleAoiSaved = () => fetchEmittersSafe(true);
    const handleAoiRemoved = (e) => {
      const { id } = e.detail || {};
      if (!id) return;
      setIsLoading(true);
      setTreeData((prev) => prev.filter((aoi) => aoi.areaInterestId !== id));
      setTimeout(async () => {
        try {
          await fetchEmittersSafe(true);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    };

    window.addEventListener("AOI_SAVED", handleAoiSaved);
    window.addEventListener("AOI_REMOVED", handleAoiRemoved);

    return () => {
      isCancelled = true;
      window.removeEventListener("AOI_SAVED", handleAoiSaved);
      window.removeEventListener("AOI_REMOVED", handleAoiRemoved);
    };
  }, [missionId]);

  // --- DEFAULT VALUES FOR OUTER ACCORDION ---
  const allAoiValues = Array.isArray(treeData)
    ? treeData.map((block) => `aoi-${block.areaInterestId}`)
    : [];

  const [openAois, setOpenAois] = useState(() =>
    Array.isArray(treeData)
      ? treeData.map((b) => `aoi-${b.areaInterestId}`)
      : []
  );

  useEffect(() => {
    if (!Array.isArray(treeData)) return;

    const allAoiKeys = treeData.map((block) => `aoi-${block.areaInterestId}`);

    setOpenAois((prev) => {
      // keep already opened AOIs
      const existing = prev.filter((v) => allAoiKeys.includes(v));

      // auto-open newly added AOIs
      const newlyAdded = allAoiKeys.filter((v) => !existing.includes(v));

      return [...existing, ...newlyAdded];
    });
  }, [treeData]);
  const [openSectionsByAoi, setOpenSectionsByAoi] = useState({});
  useEffect(() => {
    if (!Array.isArray(treeData)) return;

    setOpenSectionsByAoi((prev) => {
      const next = { ...prev };

      treeData.forEach((aoi) => {
        const key = `aoi-${aoi.areaInterestId}`;
        if (!next[key]) {
          next[key] = ["weapons", "emitters"]; // default open
        }
      });

      // cleanup removed AOIs
      Object.keys(next).forEach((key) => {
        if (!treeData.some((a) => `aoi-${a.areaInterestId}` === key)) {
          delete next[key];
        }
      });

      return next;
    });
  }, [treeData]);

  return (
    <SidebarGroup>
      <div className="px-5 py-4">
        <div className="text-white/60 font-mono text-xs not-italic font-normal leading-normal ">
          EW DETAILS
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-gray-300 text-sm">
          Loading...
        </div>
      ) : Array.isArray(treeData) && treeData.length > 0 ? (
        // 1. OUTER ACCORDION FOR AOIs
        // <Accordion
        //   type="multiple"
        //   className="w-full space-y-1 px-4"
        //   defaultValue={allAoiValues}
        // >

        <Accordion
          type="multiple"
          className="w-full space-y-1 px-4"
          value={openAois}
          onValueChange={setOpenAois}
        >
          {treeData.map((aoiBlock) => {
            const hasWeapons = (aoiBlock.weapons?.length ?? 0) > 0;
            const hasEmitters = (aoiBlock.emitters?.length ?? 0) > 0;

            if (!hasWeapons && !hasEmitters) return null;

            // Process Data
            const weaponTreeData = hasWeapons
              ? transformWeaponsForTree([aoiBlock])
              : [];
            const weaponNodeCount = countNodes(weaponTreeData);

            const emitterTreeData = hasEmitters
              ? aoiBlock.emitters.map((emitter, eIndex) => ({
                  id: `AOI_${aoiBlock.areaInterestId}_Emitter_${emitter.emitterId}_${eIndex}`,
                  name: emitter.emitterName,
                  type: "emitter",
                  latitude: emitter.latitude,
                  longitude: emitter.longitude,
                  children: (emitter.modeLinkDtos || []).map(
                    (mode, mIndex) => ({
                      id: `AOI_${aoiBlock.areaInterestId}_Emitter_${emitter.emitterId}_Mode_${mode.modeId}_${mIndex}`,
                      name: mode.modeName,
                      type: "mode",
                      children: (mode.jammingLinkDtos || []).map(
                        (jam, jIndex) => ({
                          id: `AOI_${aoiBlock.areaInterestId}_Emitter_${emitter.emitterId}_Mode_${mode.modeId}_Jamming_${jam.jammingId}_${jIndex}`,
                          name:
                            jam.jammingName.replace(/_[^_]*$/, "") || "Jamming",
                          type: "jamming",
                        })
                      ),
                    })
                  ),
                }))
              : [];
            const emitterNodeCount = countNodes(emitterTreeData);

            return (
              <AccordionItem
                key={`aoi_item_${aoiBlock.areaInterestId}`}
                value={`aoi-${aoiBlock.areaInterestId}`}
                className=" overflow-hidden border-none"
              >
                {/* border border-[#4A4A4F] bg-[#4b4c4e] overflow-hidden */}
                {/* AOI HEADER */}

                <AccordionTrigger className="px-2 py-2 hover:no-underline hover:bg-[#45454d] transition-colors [&[data-state=open]>svg]:rotate-180 mb-2 border border-white/10 bg-white/10 rounded-none">
                  <div className="text-white/95 font-mono text-xs not-italic font-bold uppercase">
                    {aoiBlock.areaName}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="border border-white/10 bg-white/10 rounded-none px-0 pb-0">
                  {/* 2. INNER ACCORDION FOR CATEGORIES */}
                  {/* <Accordion
                    type="multiple"
                    defaultValue={["weapons", "emitters"]}
                    className="w-full"
                  > */}

                  <Accordion
                    type="multiple"
                    value={
                      openSectionsByAoi[`aoi-${aoiBlock.areaInterestId}`] || []
                    }
                    onValueChange={(val) =>
                      setOpenSectionsByAoi((prev) => ({
                        ...prev,
                        [`aoi-${aoiBlock.areaInterestId}`]: val,
                      }))
                    }
                    className="w-full"
                  >
                    {/* Weapon System Section */}
                    {hasWeapons && (
                      <AccordionItem value="weapons" className="border-none">
                        <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-[#333338] [&[data-state=open]>div>svg]:rotate-180">
                          <div className="flex items-center gap-3 w-full">
                            <span className="text-white/95 font-karla text-sm not-italic font-medium leading-normal capitalize">
                              Weapon System
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-2 pr-2 pt-2">
                          <Tree
                            data={weaponTreeData}
                            openByDefault={true}
                            width={280}
                            height={32 * (weaponNodeCount + 1)}
                            indent={20}
                            rowHeight={32}
                          >
                            {({ node, style, dragHandle }) => (
                              <Node
                                node={node}
                                style={style}
                                dragHandle={dragHandle}
                                selectedNode={selectedNode}
                                setSelectedNode={setSelectedNode}
                                navigate={navigate}
                                fullTree={treeData}
                                activeNodeId={activeNodeId}
                              />
                            )}
                          </Tree>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Emitters Section */}
                    {hasEmitters && (
                      <AccordionItem value="emitters" className="border-none">
                        <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-[#333338] [&[data-state=open]>div>svg]:rotate-180">
                          <div className="flex items-center gap-3 w-full">
                            <span className="text-[14px] text-gray-200">
                              Emitters
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-2 pr-2 pt-1">
                          <Tree
                            data={emitterTreeData}
                            openByDefault={true}
                            width={280}
                            height={32 * (emitterNodeCount + 1)}
                            indent={20}
                            rowHeight={32}
                          >
                            {({ node, style, dragHandle }) => (
                              <Node
                                node={node}
                                style={style}
                                dragHandle={dragHandle}
                                selectedNode={selectedNode}
                                setSelectedNode={setSelectedNode}
                                navigate={navigate}
                                fullTree={treeData}
                                activeNodeId={activeNodeId}
                              />
                            )}
                          </Tree>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <div className="text-white/60 font-karla text-sm not-italic font-normal leading-normal px-5 pb-4">
          No Data Found
        </div>
      )}
    </SidebarGroup>
  );
}

export default NavModal;
