import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ModeForm from "@/components/ModeForm";
import { useSidebarStore } from "../store/missionStore";
import {
  fetchModeIndependentTree,
  fetchModeTree,
  fetchStandaloneModeTree,
  saveIndependentMode,
  saveMode,
  saveStandaloneMode,
} from "../services/AdroneServices";
import { toast } from "react-toastify";
// CHANGED: Import the new centralized validation schema
import { getModeValidationSchema } from "@/config/modeValidationRules";

export default function PFMGDbMgmtListingDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isIndependentDialogOpen, setIsIndependentDialogOpen] = useState(false);
  const [modeName, setModeName] = useState("");
  const [hasJamming, setHasJamming] = useState(false);

  // Emitter context for this page comes from query param as per new flow
  const emitterIdFromQuery = searchParams.get("emitterId");
  const modeId = searchParams.get("modeId");
  console.log("modeId from query in details page:", modeId);
  const weaponId = searchParams.get("weaponId");

  // Shared defaults to allow rebinding when loading payloads
  const initialDefaults = useMemo(
    () => ({
      emitterName: emitterIdFromQuery || "",
      groundOnly: false,
      isUnknown: false,
      description: "",

      // Symbol fields used by ModeForm
      modeSymbol: "",
      foregroundColor: "#FFFFFF",
      backgroundColor: "#F7B500",

      // High-level mode fields
      modeName: "",
      modeType: "",
      subModeType: "",
      platformType: "",
      threatType: "",

      // Estimation & comments
      diskRangeEstimation: "",
      eirpValue: 0,
      lethalRange: 0,
      comments: "",
      modeTestType: "",

      // EW Parameters
      frequencyType: "",
      frequencyClass: "RANGE",
      priType: "",
      priClass: "RANGE",
      pwType: "",
      pwClass: "RANGE",

      // Scan Details
      scanType: "",
      minScanSector: 0,
      maxScanSector: 0,
      minScanRate: 0,
      maxScanRate: 0,
      normalScanRate: 0,
      sideLobeLevel: 0,
      sideLobeStd: 0,
      minBeamWidth: 0,
      maxBeamWidth: 0,
      minTot: 0,
      maxTot: 0,

      // Mode Parameters
      testName: "",
      testTimeInterval: 0,
      ageOut: 0,
      priority: 0,
      testType: "",
      powerLevel: 0,
      pwTimeBase: 0,
      pvMinSamples: 0,
      pvMeasurementTime: "",

      // Dynamic Tables
      frequencyTables: [],
      priTables: [],
      pwTables: [],
    }),
    [emitterIdFromQuery],
  );

  // Form setup with FormProvider for standalone mode form
  const methods = useForm({
    // CHANGED: Pass 'values' context to Yup for conditional logic inside arrays
    resolver: (values, context, options) => {
      const schema = getModeValidationSchema();
      return yupResolver(schema)(values, values, options);
    },
    defaultValues: initialDefaults,
    mode: "onChange", // CHANGED: Enable live validation
  });

  const { handleSubmit, setValue, getValues } = methods;

  const loadModeData = async () => {
    if (!modeId) return;
    let functionToCall;

    const validWeaponId =
      weaponId && weaponId !== "null" && weaponId !== "undefined";

    if (validWeaponId) {
      functionToCall = fetchModeTree;
    } else if (!validWeaponId && emitterIdFromQuery) {
      functionToCall = fetchStandaloneModeTree;
    } else {
      functionToCall = fetchModeIndependentTree;
    }

    try {
      const response = await functionToCall(modeId, emitterIdFromQuery);

      const m = response?.payload || response;
      if (!m) return;

      console.log("API Mode Data:", m);

      const mapped = {
        modeId: m.modeId || "",
        modeName: m.modeName || "",
        description: m.description || "",
        modeType: m.modeType || "",
        subModeType: m.subMode || "",
        platformType: m.platformType || "",
        threatType: m.threatType || "",
        modeTestType: m.testType || "",
        modeSymbol: m.modeSymbol || "",
        foregroundColor: m.fgColor || "#FFFFFF",
        backgroundColor: m.bgColor || "#F7B500",

        diskRangeEstimation: m.rangeEstimation || "",
        eirpValue: m.eirpValue || 0,
        lethalRange: m.lethalRange || 0,
        groundOnly: m.groundOnly ?? false,
        isUnknown: m.isUnknown ?? false,

        // EW main types
        frequencyType: m.frequencyType || "",
        frequencyClass: m.frequencyClass || "RANGE",
        priType: m.priType || "",
        priClass: m.priClass || "RANGE",
        pwType: m.pwType || "",
        pwClass: m.pwClass || "RANGE",

        // ========= FREQUENCY TABLES =========
        frequencyTables:
          m.modeFrequencyDetails?.map((f) => ({
            id: f.id,
            minFrequency: f.minFrequency ?? "",
            maxFrequency: f.maxFrequency ?? "",
            frequencyStaggerLevel: f.frequencyStaggerLevel ?? "",
            frequencyJitterMean: f.frequencyJitterMean ?? "",
            frequencyJitterPercentage: f.frequencyJitterPercentage ?? "",
          })) || [],

        // ========= PRI TABLES =========
        priTables:
          m.modePriDetails?.map((p) => ({
            id: p.id,
            minPri: p.minPri ?? "",
            maxPri: p.maxPri ?? "",
            priStaggerLevel: p.priStaggerLevel ?? "",
            priJitterMean: p.priJitterMean ?? "",
            priJitterPercentage: p.priJitterPercentage ?? "",
          })) || [],

        // ========= PW TABLES =========
        pwTables:
          m.modePwDetails?.map((w) => ({
            id: w.id,
            minPw: w.minPw ?? "",
            maxPw: w.maxPw ?? "",
            pwStaggerLevel: w.pwStaggerLevel ?? "",
            pwJitterMean: w.pwJitterMean ?? "",
            pwJitterPercentage: w.pwJitterPercentage ?? "",
          })) || [],

        // ========= SCAN DETAILS =========
        scanType: m.modeScanDetails?.[0]?.scanType || "",
        minScanSector: m.modeScanDetails?.[0]?.minScanSector ?? "",
        maxScanSector: m.modeScanDetails?.[0]?.maxScanSector ?? "",
        minScanRate: m.modeScanDetails?.[0]?.minScanRate ?? "",
        maxScanRate: m.modeScanDetails?.[0]?.maxScanRate ?? "",
        normalScanRate: m.modeScanDetails?.[0]?.nominalScanRate ?? "",
        sideLobeLevel: m.modeScanDetails?.[0]?.sideLobeLevel ?? "",
        sideLobeStd: m.modeScanDetails?.[0]?.sideLobeStd ?? "",
        minBeamWidth: m.modeScanDetails?.[0]?.minBeamWidth ?? "",
        maxBeamWidth: m.modeScanDetails?.[0]?.maxBeamWidth ?? "",
        minTot: m.modeScanDetails?.[0]?.minTot ?? "",
        maxTot: m.modeScanDetails?.[0]?.maxTot ?? "",
      };

      setHasJamming((m.jammings || []).length > 100);
      methods.reset(mapped);

      return mapped;
    } catch (err) {
      console.error("Error loading Mode data:", err);
    }
  };

  useEffect(() => {
    if (!modeId) return;

    (async () => {
      const fullMapped = await loadModeData(); // gets mapped object
      if (fullMapped) {
        setModeName(fullMapped.modeName || "");
      }
    })();
  }, [modeId]);

  const setRefetchSidebarData = useSidebarStore((s) => s.setRefetchSidebarData);
  const refetchSidebarData = useSidebarStore((s) => s.refetchSidebarData);
  const setCreating = useSidebarStore((s) => s.setCreating);

  const remapTablesForBackend = (data) => {
    const newData = { ...data };

    newData.frequencyTables = (data.frequencyTables || []).map((row) => ({
      id: row.id || 0,
      minFrequency: Number(row.minFrequency ?? 0),
      maxFrequency: Number(row.maxFrequency ?? 0),
      frequencyStaggerLevel: Number(row.frequencyStaggerLevel ?? 0),
      frequencyJitterMean: Number(row.frequencyJitterMean ?? 0),
      frequencyJitterPercentage: Number(row.frequencyJitterPercentage ?? 0),
    }));

    newData.priTables = (data.priTables || []).map((row) => ({
      id: row.id || 0,
      minPri: Number(row.minPri ?? 0),
      maxPri: Number(row.maxPri ?? 0),
      priStaggerLevel: Number(row.priStaggerLevel ?? 0),
      priJitterMean: Number(row.priJitterMean ?? 0),
      priJitterPercentage: Number(row.priJitterPercentage ?? 0),
    }));

    newData.pwTables = (data.pwTables || []).map((row) => ({
      id: row.id || 0,
      minPw: Number(row.minPw ?? 0),
      maxPw: Number(row.maxPw ?? 0),
      pwStaggerLevel: Number(row.pwStaggerLevel ?? 0),
      pwJitterMean: Number(row.pwJitterMean ?? 0),
      pwJitterPercentage: Number(row.pwJitterPercentage ?? 0),
    }));

    return newData;
  };

  const onSubmit = async (data) => {
    try {
      // FIX: remap all dynamic table fields
      const mappedData = remapTablesForBackend(data);

      const modePayload = modeId ? { ...mappedData, modeId } : mappedData;

      let modeResp;

      const validWeaponId =
        weaponId && weaponId !== "null" && weaponId !== "undefined";
      const validEmitterId =
        emitterIdFromQuery &&
        emitterIdFromQuery !== "null" &&
        emitterIdFromQuery !== "undefined";

      if (validWeaponId) {
        // CASE 1: Weapon > Emitter > Mode Flow
        console.log("Saving via Weapon Flow API...");
        modeResp = await saveMode(modePayload, emitterIdFromQuery);
      } else if (validEmitterId) {
        // CASE 2: Standalone Emitter > Mode Flow
        console.log("Saving via Standalone Emitter Flow API...");
        modeResp = await saveStandaloneMode(modePayload, emitterIdFromQuery);
      } else if (!validEmitterId && !validWeaponId) {
        // CASE 3: Independent Mode Flow
        console.log("Saving via Independent Mode API...");
        modeResp = await saveIndependentMode(modePayload);

        const newModeId = modeResp?.payload?.modeId;
        if (newModeId) {
          navigate(`/mission-creation?modeId=${newModeId}&component=mode`, {
            state: { fromEntitySelection: true },
            replace: true,
          });
        }
      }

      const backendMsg = modeResp?.message || "Mode saved successfully!";
      const isSuccess = modeResp?.success ?? true;

      if (isSuccess) {
        toast.success(backendMsg, { position: "top-center" });
        setRefetchSidebarData(!refetchSidebarData);
        useSidebarStore.getState().setRefetchSidebarData(true);
      } else {
        toast.error(backendMsg, { position: "top-center" });
      }

      if (modeId) {
        setRefetchSidebarData(!refetchSidebarData);
        useSidebarStore.getState().setRefetchSidebarData(true);
      }
    } catch (err) {
      console.error("Error saving mode:", err);

      const backendError =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save mode. Please try again.";

      toast.error(backendError, { position: "top-center" });
    }
  };

  const onError = (errors) => {
    console.error("Validation errors:", errors);
  };

  const component = searchParams.get("component");

  // srikanth approach of plus button in side nav bar BBN - 17/12/2025
  // start;
  const isCreateMode = component === "mode" && !modeId;
  const isEditMode = Boolean(modeId);

  useEffect(() => {
    if (isCreateMode) {
      methods.reset(initialDefaults);
      setModeName("");
      setHasJamming(false);
    }
  }, [isCreateMode, initialDefaults, methods]);
  // end

  const isWeaponFlow =
    weaponId && weaponId !== "null" && weaponId !== "undefined";

  const isStandaloneEmitterFlow =
    !weaponId &&
    emitterIdFromQuery &&
    emitterIdFromQuery !== "null" &&
    emitterIdFromQuery !== "undefined";

  const isIndependentModeFlow =
    !weaponId &&
    (!emitterIdFromQuery || emitterIdFromQuery === "null") &&
    modeId;

  const isJammingFlow = component === "jamming";

  const showSaveAsIndependent =
    // If emitterId exists → OK (weapon OR standalone flow)
    (emitterIdFromQuery &&
      emitterIdFromQuery !== "null" &&
      emitterIdFromQuery !== "undefined") ||
    // Or if weapon flow
    (weaponId && weaponId !== "null" && weaponId !== "undefined");

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="min-h-screen bg-[#414141] text-white p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {modeName || "New Mode"}
            </h1>

            <p className="text-gray-300">
              {modeId
                ? modeName
                  ? `Edit mode details for “${modeName}”`
                  : `Edit mode details`
                : "Add emitter details and Modes to the emitter"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className={`bg-transparent border-[#C5BFFF] text-[#C5BFFF] rounded-xs font-semibold ${
                hasJamming ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!modeId || hasJamming}
              onClick={() => {
                if (hasJamming) return;

                const isIndependent =
                  !weaponId &&
                  (!emitterIdFromQuery || emitterIdFromQuery === "null");

                if (!modeId) {
                  console.warn("Missing modeId. Cannot navigate to jamming.");
                  return;
                }

                setCreating(true, modeId);

                if (isIndependent) {
                  // Correct URL for independent mode
                  navigate(
                    `/mission-creation?modeId=${modeId}&component=jamming`,
                  );
                  return;
                }

                // Standalone emitter flow
                if (!weaponId && emitterIdFromQuery) {
                  navigate(
                    `/mission-creation?emitterId=${emitterIdFromQuery}&modeId=${modeId}&component=jamming`,
                  );
                  return;
                }

                // Weapon flow
                navigate(
                  `/mission-creation?weaponId=${weaponId}&emitterId=${emitterIdFromQuery}&modeId=${modeId}&component=jamming`,
                );
              }}
            >
              {hasJamming ? "Jamming Already Exists" : "Add Jamming"}
            </Button>

            {showSaveAsIndependent && (
              <Button
                type="button"
                className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
                onClick={() => setIsIndependentDialogOpen(true)}
              >
                Save As Independent Mode
              </Button>
            )}

            <Button
              type="submit"
              className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Use ModeForm component for standalone mode form */}
        <div className="pr-[200px]">
          <ModeForm />
        </div>

        {/* Add Independent Mode Dialog */}
        <Dialog
          open={isIndependentDialogOpen}
          onOpenChange={setIsIndependentDialogOpen}
        >
          <DialogContent className="max-w-xl w-[95vw] bg-[#2E2E2E] border-white/10 text-gray-200">
            <DialogHeader>
              <DialogTitle className="text-sm font-medium font-mono text-white">
                {!weaponId && emitterIdFromQuery
                  ? "Save as Standalone Mode"
                  : "Save as Independent Mode"}
              </DialogTitle>
            </DialogHeader>

            <div className="px-5 py-2">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 mb-4">
                <div className="text-sm flex items-center gap-2">
                  <div className="text-white/70">Created date:</div>
                  <div className="font-medium">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm flex items-center justify-end gap-2">
                  <div className="text-white/70">Created by:</div>
                  <div className="font-medium">Current User</div>
                </div>
              </div>

              <div className="mb-3 text-white/70 font-mono">Add Details</div>

              <div className="mb-4">
                <Label className="mb-1 block text-sm text-white/70">
                  Mode Name
                </Label>
                <Input
                  value={modeName}
                  onChange={(e) => setModeName(e.target.value)}
                  placeholder={
                    !weaponId && emitterIdFromQuery
                      ? "Standalone_mode_1"
                      : "Independent_Mode_001"
                  }
                  className="h-10 bg-[#0000001A] text-gray-100 placeholder:text-white/40 border-[#FFFFFF1A]"
                />
              </div>

              <div className="mb-2">
                <Label className="mb-1 block text-sm text-white/70">
                  Description
                </Label>
                <Textarea
                  value={methods.watch("description")}
                  onChange={(e) =>
                    methods.setValue("description", e.target.value)
                  }
                  rows={4}
                  placeholder="Enter description for this mode..."
                  className="file:text-foreground placeholder:text-white/40 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 w-full rounded-md border bg-[#0000001A] p-3 text-sm text-gray-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 border-[#FFFFFF1A]"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-white/10 px-5 py-4">
              <Button
                className="h-9 cursor-pointer rounded-sm bg-[#7B70D6] px-4 text-white hover:bg-[#7C70FF]/90"
                onClick={async () => {
                  try {
                    const data = methods.getValues();

                    // Replace only name + description with dialog values
                    const updatedPayload = {
                      ...data,
                      modeName: modeName?.trim() || data.modeName,
                      description:
                        methods.watch("description")?.trim() ||
                        data.description,
                    };

                    if (modeId) {
                      updatedPayload.modeId = modeId;
                    }

                    console.log(
                      "Saving Independent Mode with updated payload:",
                      updatedPayload,
                    );

                    const resp = await saveIndependentMode(
                      updatedPayload,
                      emitterIdFromQuery,
                    ); // no second argument
                    const msg =
                      resp?.message || "Independent Mode saved successfully!";
                    toast.success(msg, { position: "top-center" });
                    setIsIndependentDialogOpen(false);
                    setRefetchSidebarData(!refetchSidebarData);
                    loadModeData();
                  } catch (err) {
                    console.error("Error saving independent mode:", err);
                    toast.error(
                      err?.message || "Failed to save independent mode",
                      { position: "top-center" },
                    );
                  }
                }}
              >
                Add Mode To All
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </FormProvider>
  );
}
