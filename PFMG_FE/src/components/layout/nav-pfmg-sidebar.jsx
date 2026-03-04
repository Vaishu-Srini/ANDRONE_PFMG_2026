import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Copy, MoreVertical, Plus, Trash2 } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSidebarStore } from "@/store/missionStore";
import {
  deleteEmitter,
  deleteJamming,
  deleteMode,
  deleteWeapon,
  fetchEmitterStandloneTree,
  fetchWeaponTree,
  fetchModeIndependentTree,
  deleteStandaloneEmitter,
  deleteStandaloneMode,
  deleteStandaloneJamming,
  deleteIndependentMode,
  deleteIndependentJamming,
  fetchAllIndependentJammings,
  deleteIndependentStandaloneJamming,
} from "../../services/AdroneServices";
import { useWeaponIdStore } from "../../store/missionStore";
import wpnImage from "../../assets/images/sidebar-icons/Emitters.svg";
import emtImage from "../../assets/images/sidebar-icons/ico_emitter_24px.svg";
import mdImage from "../../assets/images/sidebar-icons/ico_Mode_24px2x.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const PFMGSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { weaponId, setWeaponId } = useWeaponIdStore();

  // Track the current tree context to avoid unnecessary refetches
  const currentTreeContext = useRef(null);

  // Use non-persisted sidebar store for UI tree
  const sidebarData = useSidebarStore((s) => s.sidebarData);
  const expandedItems = useSidebarStore((s) => s.expandedItems);
  const selectedItem = useSidebarStore((s) => s.selectedItem);
  const isCreating = useSidebarStore((s) => s.isCreating);
  const creatingItemId = useSidebarStore((s) => s.creatingItemId);
  const setSidebarData = useSidebarStore((s) => s.setSidebarData);
  const toggleExpanded = useSidebarStore((s) => s.toggleExpanded);
  const setSelectedItem = useSidebarStore((s) => s.setSelectedItem);
  const refetchSidebarData = useSidebarStore((s) => s.refetchSidebarData);
  const setCreating = useSidebarStore((s) => s.setCreating);

  // Select helper using store
  const handleItemSelect = useCallback(
    (itemId) => setSelectedItem(itemId),
    [setSelectedItem],
  );

  // Helper function to get indent class
  const getIndentClass = useCallback((level) => {
    if (level === 1) return "ml-4";
    if (level >= 2) return "ml-8";
    return "";
  }, []);

  const fetchSidebarData = async () => {
    // console.log("fetchSidebarData triggered");
    setIsLoading(true);
    setError(null);

    const queryParams = new URLSearchParams(location.search);
    // console.log("queryParams:", queryParams.toString());
    const component = queryParams.get("component"); // weapon | emitter | mode | jamming
    // console.log("component from query params:", component);
    let weaponId = queryParams.get("weaponId");
    // console.log("weaponId from query params:", weaponId);
    let emitterId = queryParams.get("emitterId");
    // console.log("emitterId from query params:", emitterId);
    let modeId = queryParams.get("modeId");
    // console.log("modeId from query params:", modeId);
    let jammingId = queryParams.get("jammingId");
    // console.log("jammingId from query params:", jammingId);

    // Bulletproof normalization against "null" and "undefined" strings
    if (weaponId === "null" || weaponId === "undefined") weaponId = null;
    if (emitterId === "null" || emitterId === "undefined") emitterId = null;
    if (modeId === "null" || modeId === "undefined") modeId = null;
    if (jammingId === "null" || jammingId === "undefined") jammingId = null;

    try {
      let response, transformedData;

      // ========================================================
      // CASE 1 — WEAPON FLOW (Weapon → Emitters → Modes → Jamming)
      // ========================================================
      if (weaponId) {
        // console.log("Sidebar Mode: WEAPON flow → weaponId:", weaponId);

        response = await fetchWeaponTree(weaponId);
        const data = response?.payload;

        const emitters = data.emitters || [];
        const emitterNodes = emitters.map((emitter) => {
          const modeNodes = (emitter.modes || []).map((mode) => {
            const jammingNodes = (mode.jammings || []).map(
              (jamming, index) => ({
                id: jamming.jammingId,
                uniqueId: `jamming_${jamming.jammingId}`,
                // title: jamming.techniqueType,
                title: `Jamming_${index + 1}`,
                type: "jamming",
                jammingId: jamming.jammingId,
                modeId: mode.modeId,
                emitterId: emitter.emitterId,
                children: [],
              }),
            );

            return {
              id: mode.modeId,
              uniqueId: `mode_${mode.modeId}`,
              title: mode.modeName,
              type: "mode",
              modeId: mode.modeId,
              emitterId: emitter.emitterId,
              children: jammingNodes,
            };
          });

          return {
            id: emitter.emitterId,
            uniqueId: `emitter_${emitter.emitterId}`,
            title: emitter.emitterName,
            type: "emitter",
            emitterId: emitter.emitterId,
            children: modeNodes,
          };
        });

        transformedData = [
          {
            id: data.weaponId,
            uniqueId: `weapon_${data.weaponId}`,
            title: data.weaponName || "Weapon System",
            type: "weapon",
            weaponId: data.weaponId,
            children: emitterNodes,
          },
        ];
      }

      // ========================================================
      // CASE 2 — STANDALONE EMITTER FLOW
      // Only triggered if NO weaponId is present
      // ========================================================
      else if (
        emitterId &&
        !weaponId &&
        ["emitter", "mode", "jamming"].includes(component)
      ) {
        // console.log("🌲 Sidebar Mode: STANDALONE flow → emitterId:", emitterId);

        response = await fetchEmitterStandloneTree(emitterId);
        const data = response?.payload;

        const modeNodes = (data.modes || []).map((mode) => {
          const jammingNodes = (mode.jammings || []).map((jam, index) => ({
            id: jam.jammingId,
            uniqueId: `jamming_${jam.jammingId}`,
            // title: jam.techniqueName,
            title: `Jamming_${index + 1}`,
            type: "jamming",
            jammingId: jam.jammingId,
            modeId: mode.modeId,
            emitterId: data.emitterId,
            children: [],
          }));

          return {
            id: mode.modeId,
            uniqueId: `mode_${mode.modeId}`,
            title: mode.modeName,
            type: "mode",
            modeId: mode.modeId,
            emitterId: data.emitterId,
            children: jammingNodes,
          };
        });

        transformedData = [
          {
            id: data.emitterId,
            uniqueId: `emitter_${data.emitterId}`,
            title: data.emitterName,
            type: "emitter",
            emitterId: data.emitterId,
            children: modeNodes,
          },
        ];
      }

      // ========================================================
      // CASE 3 — STANDALONE MODE FLOW (Updated)
      // Only triggered if NO weaponId and NO emitterId are present
      // ========================================================
      else if (
        modeId &&
        !weaponId &&
        !emitterId &&
        (component === "mode" || component === "jamming") // FIX: Allow "jamming" here
      ) {
        // console.log("🌲 Sidebar Mode: STANDALONE MODE flow → modeId:", modeId);
        response = await fetchModeIndependentTree(modeId);
        const data = response?.payload;

        const jammingNodes = (data.jammings || []).map((jam, index) => ({
          id: jam.jammingId,
          uniqueId: `jamming_${jam.jammingId}`,
          // title: jam.techniqueName || jam.techniqueType,
          title: `Jamming_${index + 1}`,
          type: "jamming",
          jammingId: jam.jammingId,
          modeId: data.modeId,
          children: [],
        }));

        transformedData = [
          {
            id: data.modeId,
            uniqueId: `mode_${data.modeId}`,
            title: data.modeName,
            type: "mode",
            modeId: data.modeId,
            children: jammingNodes,
          },
        ];
      }
      // ========================================================
      // CASE 4 — STANDALONE JAMMING FLOW
      // Only triggered if NO weaponId, NO emitterId, and NO modeId
      // ========================================================
      else if (
        jammingId &&
        !modeId &&
        !weaponId &&
        !emitterId &&
        component === "jamming"
      ) {
        // 1. Fetch ALL independent jammings using your existing API
        response = await fetchAllIndependentJammings();

        // The API returns { payload: [...] }, so we extract the array
        const allJammings = response?.payload || [];

        // 2. Find the specific jamming scenario that matches the URL ID
        const data = allJammings.find(
          (j) => String(j.jammingId) === String(jammingId),
        );

        if (data) {
          transformedData = [
            {
              id: data.jammingId,
              uniqueId: `jamming_${data.jammingId}`,
              title:
                data.jammingName ||
                data.scenarioName ||
                `Jamming_${data.jammingId}`,
              type: "jamming",
              jammingId: data.jammingId,
              children: [], // No phases rendered in sidebar
            },
          ];
        } else {
          throw new Error("Jamming scenario not found in the database.");
        }
      }
      // ========================================================
      //  CASE 5 — INVALID CONTEXT
      // ========================================================
      else {
        console.warn("No valid context for sidebar tree fetch", {
          weaponId,
          emitterId,
          modeId,
          component,
        });
        setError("Invalid navigation context or missing IDs.");
        setSidebarData([]);
        return;
      }

      // console.log("Sidebar updated:", transformedData);
      setSidebarData(JSON.parse(JSON.stringify(transformedData))); // deep clone → trigger Zustand updates
    } catch (error) {
      // console.error("Sidebar fetch failed:", error);
      setError("Failed to load sidebar. Please retry.");
      setSidebarData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(location.search);

      let urlWeaponId = params.get("weaponId");
      const emitterId = params.get("emitterId");
      const modeId = params.get("modeId");
      const jammingId = params.get("jammingId");
      const component = params.get("component");

      // Sanitize the weaponId
      if (urlWeaponId === "null" || urlWeaponId === "undefined")
        urlWeaponId = null;

      // Create a unique context identifier for the current tree

      const newContext = urlWeaponId
        ? `weapon_${urlWeaponId}`
        : emitterId
          ? `emitter_${emitterId}`
          : modeId
            ? `mode_${modeId}`
            : jammingId
              ? `jamming_${jammingId}`
              : null;

      // Only fetch if:
      // 1. Force refetch is requested OR
      // 2. The tree context has actually changed (different weapon/emitter root)
      const shouldFetch =
        refetchSidebarData === true ||
        (newContext && newContext !== currentTreeContext.current);

      if (shouldFetch) {
        if (
          urlWeaponId ||
          (emitterId &&
            (component === "emitter" ||
              component === "mode" ||
              component === "jamming")) ||
          (modeId &&
            !urlWeaponId &&
            !emitterId &&
            (component === "mode" || component === "jamming")) ||
          (jammingId &&
            !urlWeaponId &&
            !emitterId &&
            !modeId &&
            component === "jamming")
        ) {
          // Update the context reference
          currentTreeContext.current = newContext;

          fetchSidebarData().finally(() => {
            useSidebarStore.getState().setRefetchSidebarData(false);
          });
        }
      } else {
        // console.log("Skipping fetch - navigating within same tree:", {
        //   currentContext: currentTreeContext.current,
        //   newContext,
        // });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [location.search, weaponId, refetchSidebarData]);

  // Clear creating state when sidebar data is refreshed
  useEffect(() => {
    if (refetchSidebarData && isCreating) {
      setCreating(false, null);
    }
  }, [refetchSidebarData, isCreating, setCreating]);
  // Keep selected + expanded items consistent after navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const { weaponId, emitterId, modeId, jammingId } =
      Object.fromEntries(params);

    const { sidebarData, expandedItems, toggleExpanded, setSelectedItem } =
      useSidebarStore.getState();

    // pick the deepest level id
    const currentId =
      (jammingId && `jamming_${jammingId}`) ||
      (modeId && `mode_${modeId}`) ||
      (emitterId && `emitter_${emitterId}`) ||
      (weaponId && `weapon_${weaponId}`);

    if (!currentId) return;

    setSelectedItem(currentId);

    const findParentChain = (nodes, targetId, chain = []) => {
      if (!Array.isArray(nodes)) return [];

      for (const node of nodes) {
        if (!node) continue;
        const id = `${node.type}_${node.id}`;
        if (id === targetId) {
          return [...chain, id];
        }
        const result = findParentChain(node.children, targetId, [...chain, id]);
        if (Array.isArray(result) && result.length > 0) {
          return result;
        }
      }

      return [];
    };

    const parents = findParentChain(sidebarData, currentId);
    parents.forEach((id) => {
      if (!expandedItems.has(id)) toggleExpanded(id);
    });
  }, [location.search]);

  // srikanth side nav bar approach
  // start
  const [searchParams] = useSearchParams();
  const modeIdFromQuery = searchParams.get("modeId");
  const rawModeId = searchParams.get("modeId");
  const rawEmitterId = searchParams.get("emitterId");
  const rawWeaponId = searchParams.get("weaponId");
  const rawJammingId = searchParams.get("jammingId"); // <-- ADD THIS

  const hasModeId =
    rawModeId && rawModeId !== "null" && rawModeId !== "undefined";

  const hasEmitterId =
    rawEmitterId && rawEmitterId !== "null" && rawEmitterId !== "undefined";

  const hasWeaponId =
    rawWeaponId && rawWeaponId !== "null" && rawWeaponId !== "undefined";

  const hasJammingId =
    rawJammingId && rawJammingId !== "null" && rawJammingId !== "undefined";

  const isIndependentModeRoot = hasModeId && !hasEmitterId && !hasWeaponId;

  const isIndependentJammingRoot =
    hasJammingId && !hasModeId && !hasEmitterId && !hasWeaponId;
  // end
  const renderItem = useCallback(
    (item, level = 0) => {
      const isExpanded = expandedItems.has(item.uniqueId);
      const isSelected = selectedItem === `${item.type}_${item.id}`;
      const hasChildren = item.children && item.children.length > 0;

      const handleItemClick = () => {
        const componentType = item.type;
        const emitterId = item.emitterId;
        const modeId = item.modeId;
        const jammingId = item.jammingId;

        handleItemSelect(item.uniqueId);

        // Start with current URL params to preserve context
        const params = new URLSearchParams(location.search);

        // Update based on what was clicked
        params.set("component", componentType);

        if (componentType === "weapon") {
          params.set("weaponId", item.weaponId || item.id);
          params.delete("emitterId");
          params.delete("modeId");
          params.delete("jammingId");
        } else if (componentType === "emitter") {
          params.set("emitterId", emitterId);
          params.delete("modeId");
          params.delete("jammingId");
        } else if (componentType === "mode") {
          // For standalone mode flow, don't set emitterId if it doesn't exist
          if (emitterId) {
            params.set("emitterId", emitterId);
          } else {
            params.delete("emitterId");
          }
          params.set("modeId", modeId);
          params.delete("jammingId");
        } else if (componentType === "jamming") {
          if (emitterId) {
            params.set("emitterId", emitterId);
          } else {
            params.delete("emitterId");
          }

          if (modeId && modeId !== 0) {
            params.set("modeId", modeId);
          } else {
            params.delete("modeId"); // Ensures "undefined" doesn't get into the URL!
          }

          params.set("jammingId", jammingId);
        }

        // Navigate safely
        navigate(`/mission-creation?${params.toString()}`, {
          state: { fromEntitySelection: true },
        });
      };

      const handleToggleClick = (e) => {
        e.stopPropagation();
        toggleExpanded(item.uniqueId);
      };

      const componentType = item.type;

      return (
        <div key={item.uniqueId} className="mb-1">
          {/* 1. 'group' class goes HERE (Inner Row) */}
          {/* <div className="flex items-center justify-between hover:bg-[#4b4c4e] rounded-md group"> */}
          <div className="group flex items-center justify-between hover:bg-[#4b4c4e] rounded-md">
            {/* Title / Name Section */}
            <div className="flex-1 min-w-0">
              <button
                className={`group flex items-center gap-2 flex-1 min-w-0 px-0 py-2 rounded-md cursor-pointer transition-colors
         ${
           isSelected
             ? "bg-transparent text-[#A78BFA]"
             : "text-white hover:bg-[#4b4c4e]"
         }
         ${getIndentClass(level)}
       `}
                onClick={handleItemClick}
              >
                {componentType === "weapon" ? (
                  <img src={wpnImage} className="w-6 h-6 mr-0 ml-2" />
                ) : componentType === "emitter" ? (
                  <img src={emtImage} className="ml-2 w-6 h-6 mr-0" />
                ) : componentType === "mode" ? (
                  <img src={mdImage} className="ml-2 w-6 h-6 mr-0" />
                ) : (
                  <div className="mx-5"></div>
                )}

                <span className="block text-lg font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0 -ml-0">
                  {/* {item.title.replace(/_\d+$/, "")} */}

                  {item.title}
                </span>
              </button>
            </div>

            {/* Actions Section (Menu, Plus, Arrow) */}
            <div className="flex items-center -gap-5 shrink-0 !ml-0">
              {/* 2. Opacity classes go HERE */}
              <div className="-ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-transparent flex items-center justify-center cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="bg-[#37383B] border-[#555]"
                  >
                    <DropdownMenuItem
                      className="text-white hover:bg-[#404040] cursor-pointer"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          // 1. DETERMINE CURRENT FLOW CONTEXT
                          const params = new URLSearchParams(location.search);
                          const urlWeaponId = params.get("weaponId");
                          const urlEmitterId = params.get("emitterId");
                          const urlModeId = params.get("modeId");
                          const urlJammingId = params.get("jammingId");

                          // Flow 1: Weapon is present
                          const isWeaponFlow =
                            !!urlWeaponId && urlWeaponId !== "null";

                          // Flow 2: No Weapon, but Emitter is present (Standalone Emitter Root)
                          const isStandaloneEmitterFlow =
                            !isWeaponFlow && !!urlEmitterId;

                          // Flow 3: No Weapon, No Emitter, but Mode is present (Independent Mode Root)
                          const isIndependentModeFlow =
                            !isWeaponFlow &&
                            !isStandaloneEmitterFlow &&
                            !!urlModeId;

                          // Flow 4: Only Jamming is present (Standalone Jamming Root)
                          const isIndependentJammingFlow =
                            !isWeaponFlow &&
                            !isStandaloneEmitterFlow &&
                            !isIndependentModeFlow &&
                            !!urlJammingId;

                          // console.log("Delete Context:", {
                          //   isWeaponFlow,
                          //   isStandaloneEmitterFlow,
                          //   isIndependentModeFlow,
                          // });

                          // 2. EXECUTE LOGIC BASED ON ITEM TYPE

                          // --- WEAPON DELETE ---
                          if (item.type === "weapon") {
                            await deleteWeapon(item.weaponId);
                            navigate("/mission-creation"); // Root deleted
                            return;
                          }

                          // --- EMITTER DELETE ---
                          if (item.type === "emitter") {
                            if (isStandaloneEmitterFlow) {
                              // Flow 2 Root
                              await deleteStandaloneEmitter(item.emitterId);
                              navigate("/mission-creation"); // Root deleted
                              return;
                            } else {
                              // Flow 1 Child
                              await deleteEmitter(item.emitterId);
                            }
                          }

                          // --- MODE DELETE ---
                          if (item.type === "mode") {
                            if (isIndependentModeFlow) {
                              // Flow 3 Root
                              await deleteIndependentMode(item.modeId);
                              navigate("/mission-creation"); // Root deleted
                              return;
                            } else if (isStandaloneEmitterFlow) {
                              // Flow 2 Child (Mode inside Standalone Emitter)
                              await deleteStandaloneMode(item.modeId);
                            } else {
                              // Flow 1 Child (Standard)
                              await deleteMode(item.modeId);
                            }
                          }

                          // --- JAMMING DELETE ---
                          if (item.type === "jamming") {
                            if (isIndependentJammingFlow) {
                              await deleteIndependentStandaloneJamming(
                                item.jammingId,
                              );
                              navigate("/mission-creation"); // Root deleted, go back to blank screen
                              return;
                            } else if (isIndependentModeFlow) {
                              // Flow 3 Child (Jamming inside Independent Mode)
                              await deleteIndependentJamming(item.jammingId);
                            } else if (isStandaloneEmitterFlow) {
                              // Flow 2 Child (Jamming inside Standalone Emitter)
                              await deleteStandaloneJamming(item.jammingId);
                            } else {
                              // Flow 1 Child (Standard)
                              await deleteJamming(item.jammingId);
                            }
                          }

                          // 3. REFRESH SIDEBAR (If we didn't navigate away)
                          useSidebarStore
                            .getState()
                            .setRefetchSidebarData(true);
                        } catch (err) {
                          console.error("Delete failed:", err);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                    {item.type !== "jamming" && (
                      <DropdownMenuItem className="text-white hover:bg-[#404040] cursor-pointer">
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Plus Button */}
              {/* Bharat Approach of Sidenav bar - BBN 17/12/2025 */}
              {/* start */}
              {/* <div className="mr-1 -ml-2">
                {item.type !== "jamming" && item.type !== "mode" && (
                  <Button
                    type="button"
                    disabled={item.type === "mode" && item.children?.length > 0}
                    className={`bg-transparent text-white w-7 h-7 p-0 flex items-center justify-center
              ${
                item.type === "mode" && item.children?.length > 0
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }
              hover:bg-transparent`}
                    onClick={() => {
                      if (item.type === "mode" && item.children?.length > 0)
                        return;

                      setCreating(true, null);
                      let componentToAdd = "";
                      let query = new URLSearchParams(location.search);

                      if (item.type === "weapon") {
                        componentToAdd = "emitter";
                        query.set("weaponId", item.weaponId || item.id);
                        query.delete("emitterId");
                        query.delete("modeId");
                      } else if (item.type === "emitter") {
                        componentToAdd = "mode";
                        query.set("emitterId", item.emitterId || item.id);
                        query.delete("modeId");
                        query.delete("jammingId");
                      } else if (item.type === "mode") {
                        componentToAdd = "jamming";
                        query.set("modeId", item.modeId);
                      }

                      if (componentToAdd) {
                        query.set("component", componentToAdd);
                        navigate(`/mission-creation?${query.toString()}`, {
                          state: { fromEntitySelection: true },
                        });
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div> */}
              {/* end */}

              {/* srikanth Apporach of side nav bar plus button */}
              {/* start - BBN 17/12/2025      */}
              <div
                className={`mr-1 -ml-2 transition-opacity duration-200 ${
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {(item.type === "emitter" ||
                  (item.type === "mode" && !isIndependentModeRoot) ||
                  (item.type === "jamming" && !isIndependentJammingRoot)) && (
                  <Button
                    type="button"
                    className="bg-transparent text-white w-7 h-7 p-0 flex items-center justify-center hover:bg-transparent"
                    onClick={() => {
                      setCreating(true, null);

                      const query = new URLSearchParams(location.search);

                      if (item.type === "emitter") {
                        query.set("component", "emitter");
                        query.delete("emitterId");
                        query.delete("modeId");
                        query.delete("jammingId");
                      }

                      if (item.type === "mode") {
                        query.set("component", "mode");
                        query.set(
                          "emitterId",
                          item.emitterId || query.get("emitterId"),
                        );
                        query.delete("modeId");
                        query.delete("jammingId");
                      }
                      if (item.type === "jamming") {
                        query.set("component", "jamming");
                        query.set("modeId", item.modeId || query.get("modeId"));
                        query.delete("jammingId");
                      }

                      navigate(`/mission-creation?${query.toString()}`, {
                        state: { fromEntitySelection: true },
                      });
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* END 17/12/2025 */}
              {/* Expand/Collapse Arrow */}
              {hasChildren && (
                <div
                  className="cursor-pointer p-1 -ml-1"
                  onClick={handleToggleClick}
                  role="button"
                  tabIndex={0}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  <ChevronRight
                    className={`w-4 h-4 text-white transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. Children Rendering Logic is OUTSIDE the 'group' div */}
          {hasChildren && isExpanded && (
            <div className="relative">
              {item.children.map((child) => renderItem(child, level + 1))}
            </div>
          )}

          {/* Creating Indicator */}
          {isCreating && String(creatingItemId) === String(item.id) && (
            <div className={`${getIndentClass(level + 1)}`}>
              <div></div>
            </div>
          )}
        </div>
      );
    },
    [
      expandedItems,
      selectedItem,
      weaponId,
      modeIdFromQuery,
      handleItemSelect,
      toggleExpanded,
      isCreating,
      creatingItemId,
      getIndentClass,
    ],
  );

  // Helper function to render content based on state
  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-32 text-red-400 text-sm">
          <div className="text-center">
            <p className="mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-400 hover:text-blue-300 underline text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (sidebarData.length > 0) {
      return (
        <>
          {sidebarData.map((item, idx) => (
            <React.Fragment key={`${item.id || idx}-${item.title}`}>
              {renderItem(item)}
            </React.Fragment>
          ))}

          {/* Show creating indicator at bottom for top-level emitter creation */}
          {isCreating && creatingItemId === null && <div></div>}
        </>
      );
    }

    return (
      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
        <div className="text-center w-full px-3">
          <p>Please Enter the Data</p>
        </div>
      </div>
    );
  }, [isLoading, error, sidebarData, renderItem, isCreating, creatingItemId]);

  return (
    <div className="w-64 bg-[#2C2D30] h-full p-4">
      <div className="space-y-1">
        {renderContent()}

        {/* Persistent Add Emitter action */}
        {/* <div className="mb-3">
          <Button
            type="button"
            className="w-full bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
            onClick={() => {
              setCreating(true, null);
              if (weaponId && weaponId !== "null" && weaponId !== "undefined") {
                navigate(
                  `/mission-creation?weaponId=${weaponId}&component=emitter`
                );
              } else {
                // Standalone emitter creation
                useWeaponIdStore.getState().clearWeaponId(); //clear stale weaponId
                navigate(`/mission-creation?component=emitter`, {
                  state: { fromEntitySelection: true },
                });
              }
            }}
          >
            <Plus className="w-4 h-4" />
            Add Emitter
          </Button>
        </div> */}
      </div>
    </div>
  );
};
