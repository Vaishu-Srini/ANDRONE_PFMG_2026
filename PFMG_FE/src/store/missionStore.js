import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AOIbyID } from "../services/AdroneServices";

// ---------------- Mission Store ----------------
export const useMissionStore = create(
  persist(
    (set) => ({
      mission: null,
      setMission: (mission) => set({ mission }),
      clearMission: () => set({ mission: null }),
    }),
    { name: "mission-storage" }
  )
);

// ---------------- Platform Store ----------------
export const usePlatformStore = create(
  persist(
    (set) => ({
      platform: null,
      setPlatform: (platform) => set({ platform }),
      clearPlatform: () => set({ platform: null }),
    }),
    { name: "platform-storage" }
  )
);

export const useEmitterStore = create((set) => ({
  emitter: null,
  setEmitter: (emitter) => set({ emitter }),
  clearEmitter: () => set({ emitter: null }),
}));

export const useModeStore = create((set, get) => ({
  modes: {},
  setMode: (modeId, payload) =>
    set((state) => ({ modes: { ...state.modes, [modeId]: payload } })),
  getMode: (modeId) => get().modes[modeId],
  removeMode: (modeId) =>
    set((state) => {
      const updated = { ...state.modes };
      delete updated[modeId];
      return { modes: updated };
    }),
  clearModes: () => set({ modes: {} }),
}));

// ---------------- Sidebar Store ----------------
export const useSidebarStore = create(
  persist(
    (set, get) => ({
      sidebarData: [],
      selectedItem: null,
      refetchSidebarData: false,
      expandedItems: new Set(["em-01233"]), // default expanded emitter
      isCreating: false,
      creatingItemId: null, // Track which specific item is being created

      setRefetchSidebarData: (data) => set({ refetchSidebarData: data }),

      setCreating: (isCreating, itemId = null) =>
        set({ isCreating, creatingItemId: itemId }),

      setSidebarData: (data) => set({ sidebarData: data }),

      setSelectedItem: (itemId) => set({ selectedItem: itemId }),

      toggleExpanded: (itemId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedItems);
          if (newExpanded.has(itemId)) newExpanded.delete(itemId);
          else newExpanded.add(itemId);
          return { expandedItems: newExpanded };
        }),

      //  helper function to manually clear all sidebar data
      clearAllSidebarData: () => {
        set({
          sidebarData: [],
          selectedItem: null,
          refetchSidebarData: false,
          expandedItems: new Set(),
          isCreating: false,
          creatingItemId: null,
        });
      },
    }),
    {
      name: "sidebar-store", // key in localStorage
      partialize: (state) => ({
        sidebarData: state.sidebarData,
        selectedItem: state.selectedItem,
        expandedItems: Array.from(state.expandedItems),
      }),
      // convert array back to Set when rehydrating
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        expandedItems: new Set(persistedState.expandedItems || []),
      }),
    }
  )
);

// ---------------- Form Store ----------------
export const useFormStore = create(
  persist(
    (set) => ({
      emitterForm: null,
      setEmitterForm: (form) => set({ emitterForm: form }),
      clearEmitterForm: () => set({ emitterForm: null }),

      modeForm: null,
      setModeForm: (form) => set({ modeForm: form }),
      clearModeForm: () => set({ modeForm: null }),

      jammingForm: null,
      setJammingForm: (form) => set({ jammingForm: form }),
      clearJammingForm: () => set({ jammingForm: null }),
    }),
    { name: "forms-storage" }
  )
);

// ---------------- Platform Id Store ----------------
export const usePlatformIdStore = create(
  persist(
    (set) => ({
      platformId: null,
      setPlatformId: (platformId) => set({ platformId }),
      clearPlatformId: () => set({ platformId: null }),
    }),
    { name: "platform-id-storage" }
  )
);

export const useMissionIdStore = create(
  persist(
    (set) => ({
      missionId: null,
      setMissionId: (missionId) => set({ missionId }),
      clearMissionId: () => set({ missionId: null }),
    }),
    { name: "mission-id-storage" }
  )
);

export const useWeaponIdStore = create(
  persist(
    (set) => ({
      weaponId: null,
      setWeaponId: (weaponId) => set({ weaponId }),
      clearWeaponId: () => set({ weaponId: null }),
    }),
    { name: "weapon-id-storage" }
  )
);

export const useAoiStore = create((set, get) => ({
  isDrawingAOI: false,
  startDrawing: () => set({ isDrawingAOI: true }),
  stopDrawing: () => set({ isDrawingAOI: false }),

  isModalOpen: false,
  // aoiData: null,
  aois: [],
  addAoi: (newAoi) => set((state) => ({ aois: [...state.aois, newAoi] })),
  removeAoi: (id) =>
    set((state) => ({
      aois: state.aois.filter((a) => a.areaInterestId !== id),
    })),

  openModal: (data) => set({ isModalOpen: true, aoiData: data }),
  closeModal: () => set({ isModalOpen: false }),

  setAoiData: (data) => set({ aoiData: data }),
  updateAoiPoints: (newPoints) =>
    set((state) => ({
      aoiData: { ...state.aoiData, points: newPoints },
    })),
  resetAOI: () =>
    set({ aoiData: null, isModalOpen: false, isDrawingAOI: false }),
}));

export const useAoiGlobalStore = create((set, get) => ({
  aois: [],
  isAoiLoading: false,

  fetchAoisForMission: async (missionId) => {
    if (!missionId) return;
    set({ isAoiLoading: true });
    try {
      const res = await fetch(`${BASE_URL}AreaInterest/byMission/${missionId}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.payload)) {
        set({ aois: data.payload });
      } else {
        set({ aois: [] });
      }
    } catch (err) {
      console.error("AOI fetch error:", err);
      set({ aois: [] });
    } finally {
      set({ isAoiLoading: false });
    }
  },

  addAoi: (aoi) => set((state) => ({ aois: [...state.aois, aoi] })),
  updateAoi: (updated) =>
    set((state) => ({
      aois: state.aois.map((a) =>
        a.areaInterestId === updated.areaInterestId ? updated : a
      ),
    })),
  removeAoi: (id) =>
    set((state) => ({
      aois: state.aois.filter((a) => a.areaInterestId !== id),
    })),
}));

export const useSelectedItemsStore = create((set, get) => ({
  selectedIds: new Set(),

  selectNode: (node) => {
    const addIdsRecursively = (n, acc = []) => {
      acc.push(n.id);
      (n.children || []).forEach((child) => addIdsRecursively(child, acc));
      return acc;
    };
    const allIds = addIdsRecursively(node);
    set((state) => {
      const updated = new Set(state.selectedIds);
      allIds.forEach((id) => updated.add(id));
      return { selectedIds: updated };
    });
  },

  deselectNode: (node, fullTree) => {
    const removeIdsRecursively = (n, acc = []) => {
      acc.push(n.id);
      (n.children || []).forEach((child) => removeIdsRecursively(child, acc));
      return acc;
    };
    const allIds = removeIdsRecursively(node);
    set((state) => {
      const updated = new Set(state.selectedIds);
      allIds.forEach((id) => updated.delete(id));
      return { selectedIds: updated };
    });
  },

  clearAll: () => set({ selectedIds: new Set() }),
}));

export const useTreeDataStore = create((set) => ({
  treeData: [],
  emittersFlat: [],
  setTreeData: (data) => set({ treeData: data }),
  setEmittersFlat: (data) => set({ emittersFlat: data }),
  updateAoiName: (aoiId, newName) =>
    set((state) => ({
      treeData: state.treeData.map((aoi) =>
        aoi.areaInterestId === aoiId ? { ...aoi, areaName: newName } : aoi
      ),
    })),
}));
