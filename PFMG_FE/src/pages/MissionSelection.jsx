// JUST ADDED PLATFORM ID TO STORAGE HERE NOTHING ELSE IS CHANGED
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import singleIcon from "@/assets/images/airplane.svg";
import airplane_selected from "@/assets/images/Airplane_selected.svg";
import Missionselectionselected from "@/assets/images/Missionselectionselected.svg";
import Missionselection from "@/assets/images/Missionselection.svg";
import { saveMission } from "../services/AdroneServices";
import {
  useMissionStore,
  usePlatformStore,
  usePlatformIdStore,
  useMissionIdStore,
} from "../store/missionStore";
import { toast } from "react-toastify";

const missionSchema = z.object({
  missionType: z.enum(["SINGLE", "FORMATION"], {
    errorMap: () => ({ message: "Please select a mission type" }),
  }),
  missionName: z
    .string()
    .trim()
    .min(2, "Mission name must be at least 2 characters")
    .max(50, "Mission name must not exceed 50 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must not exceed 200 characters"),
});

export default function MissionSelection() {
  const navigate = useNavigate();

  // Zustand action
  const setMission = useMissionStore((state) => state.setMission);
  const setPlatform = usePlatformStore((state) => state.setPlatform);
  const setPlatformId = usePlatformIdStore((state) => state.setPlatformId);
  const setMissionId = useMissionIdStore((state) => state.setMissionId);
  // RHF setup
  const methods = useForm({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      missionType: "SINGLE",
      missionName: "Test_Path Mission",
      description:
        "The mode is designed to enhance user experience by providing seamless navigation...",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const missionType = watch("missionType");

  // Cancel navigation
  const handleCancel = () => {
    navigate(-1);
  };

  const onSubmit = async (data) => {
    try {
      // Save Mission
      const missionResult = await saveMission(data);
      console.log("Mission API response:", missionResult);

      const missionId = missionResult?.payload?.missionId;
      const missionName = missionResult?.payload?.missionName;
      const missionMessage =
        missionResult?.message || "Mission saved successfully!";

      if (!missionId || !missionName) {
        throw new Error("MissionId or MissionName not returned from API");
      }

      // Feedback
      toast.success(missionMessage, { position: "top-center" });

      // Save to Zustand
      setMission(missionResult.payload);

      // Navigate to EWConfig (include both ID + Name)
      const encodedMissionName = encodeURIComponent(missionName);
      // navigate(
      //   `/ew-config?missionId=${missionId}&missionName=${encodedMissionName}`
      // );
      // Navigate directly to EWConfig page
      navigate(
        `/ew-config?missionId=${missionId}&missionName=${encodedMissionName}`,
        {
          state: { fromMissionSave: true },
        }
      );
    } catch (error) {
      console.error("Error saving mission:", error);
      let backendMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save mission.";

      try {
        const errObj = JSON.parse(
          backendMsg.replace("Failed to save mission: ", "")
        );
        backendMsg = errObj.message || backendMsg;
      } catch {}
      toast.error(backendMsg, { position: "top-center" });
    }
  };

  return (
    <div className="bg-[#414141] text-white relative">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center py-5 px-10 text-white/95 font-mono text-2xl not-italic font-bold leading-6 capitalize">
          Select The Mission
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Mission Type */}
            <div className="mb-10 mt-8">
              <h2 className="text-sm font-bold mb-4 text-white/70 font-mono not-italic capitalize">
                Select Mission Type
              </h2>
              <div className="flex gap-6">
                <Button
                  type="button"
                  variant="outline"
                  className={`w-[388px] h-[180px] ${
                    missionType === "SINGLE"
                      ? "bg-white/10 hover:bg-white/10  border-[#C5BFFF]"
                      : "bg-transparent hover:bg-white/10 border-white/10"
                  }`}
                  onClick={() => setValue("missionType", "SINGLE")}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    {missionType === "SINGLE" ? (
                      <img src={airplane_selected} alt="Single" />
                    ) : (
                      <img src={singleIcon} alt="Single" />
                    )}
                    {/* singleSelected */}
                    <span
                      className={`font-karla text-base not-italic font-medium leading-normal tracking-[0.32px] uppercase ${
                        missionType === "SINGLE"
                          ? "text-[#B7AFFF]"
                          : "text-white/70"
                      }`}
                    >
                      SINGLE
                    </span>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className={`w-[380px] h-[180px] ${
                    missionType === "FORMATION"
                      ? "bg-white/10 hover:bg-white/10 border-[#C5BFFF]"
                      : "bg-transparent hover:bg-white/10 border-white/10"
                  }`}
                  onClick={() => setValue("missionType", "FORMATION")}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    {missionType === "FORMATION" ? (
                      <div>
                        <img src={Missionselectionselected} alt="Formation" />
                      </div>
                    ) : (
                      <div>
                        <img src={Missionselection} alt="Formation" />
                      </div>
                    )}

                    <span
                      className={`font-karla text-base not-italic font-medium leading-normal tracking-[0.32px] uppercase  ${
                        missionType === "FORMATION"
                          ? "text-[#B7AFFF]"
                          : "text-white/70"
                      }`}
                    >
                      FORMATION
                    </span>
                  </div>
                </Button>
              </div>
              {errors.missionType && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.missionType.message}
                </p>
              )}
            </div>
            <div className="pb-8">
              <label className="block text-white/60 font-mono text-sm not-italic font-bold leading-normal capitalize">
                Add Details
              </label>
            </div>
            {/* Mission Details */}
            <div className="mb-8 space-y-8">
              <div>
                <label className="block text-xs font-medium mb-2 text-white/70 not-italic leading-normal capitalize">
                  Mission Name
                </label>
                <Input
                  {...register("missionName")}
                  className="bg-white/5 border-white/10 text-white/95 font-karla text-base not-italic font-medium leading-normal"
                  placeholder="Enter mission name"
                />
                {errors.missionName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.missionName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 text-white/70 not-italic leading-normal capitalize">
                  Description
                </label>
                <Textarea
                  {...register("description")}
                  rows={4}
                  className="bg-white/5 border-white/10  text-white/95 font-karla text-base not-italic font-medium leading-normal resize-none"
                  placeholder="Enter mission description"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between fixed bottom-0 left-0 right-0 w-full bg-white/5 py-4 px-10">
              <Button
                type="button"
                variant="outline"
                className="bg-transparent border-[#C5BFFF] text-[#C5BFFF] px-6 cursor-pointer"
                onClick={handleCancel}
              >
                <span className="text-[#C5BFFF] font-karla text-base not-italic font-bold leading-normal capitalize">
                  Cancel
                </span>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#7B70D6] px-6 cursor-pointer font-karla text-base not-italic font-bold leading-normal capitalize"
              >
                {isSubmitting ? "Saving..." : "Continue →"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
