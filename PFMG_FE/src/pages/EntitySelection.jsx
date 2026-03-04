import { useLocation, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import weaponIcon from "../../src/assets/images/sidebar-icons/Emitters.svg";
import emitterIcon from "../../src/assets/images/sidebar-icons/ico_emitter_24px.svg";
import modeIcon from "../../src/assets/images/sidebar-icons/ico_Mode_24px2x.png";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useSidebarStore, useWeaponIdStore } from "../store/missionStore";

// Validation Schema
const EntitySchema = z.object({
  entityType: z.enum(["WEAPON SYSTEM", "EMITTER", "MODE", "JAMMING"], {
    errorMap: () => ({ message: "Please select an entity type" }),
  }),
  entityName: z
    .string()
    .trim()
    .min(2, "Entity name must be at least 2 characters")
    .max(50, "Entity name must not exceed 50 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must not exceed 200 characters"),
});

export default function EntitySelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultType = location.state?.defaultType;

  const methods = useForm({
    resolver: zodResolver(EntitySchema),
    defaultValues: {
      entityType:
        defaultType === "weapons"
          ? "WEAPON SYSTEM"
          : defaultType === "modes"
            ? "MODE"
            : defaultType === "emitters"
              ? "EMITTER"
              : "JAMMING",
      entityName: "Test_Path Mission",
      description: "The mode is designed...",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const entityType = watch("entityType");

  const handleCancel = () => navigate(-1);

  //  Corrected Navigation Logic
  const onSubmit = async (data) => {
    try {
      // console.log("EntitySelection form submitted:", data);
      const componentMap = {
        "WEAPON SYSTEM": "weapon",
        EMITTER: "emitter",
        MODE: "mode",
        JAMMING: "jamming",
      };

      const component = componentMap[data.entityType];
      // reset Zustand sidebar state in memory
      useSidebarStore.getState().clearAllSidebarData();
      if (component) {
        useWeaponIdStore.getState().clearWeaponId();
        navigate(`/mission-creation?component=${component}`, {
          state: { fromEntitySelection: true },
        });
      } else {
        toast.error("Unknown entity type selected!");
      }
    } catch (err) {
      console.error("Redirect error:", err);
      toast.error("Failed to redirect. Please try again.");
    }
  };

  const entityOptions = [
    {
      label: "WEAPON SYSTEM",
      color: "#B7AFFF",
      icon: weaponIcon,
    },
    {
      label: "EMITTER",
      color: "#FFD580",
      icon: emitterIcon,
    },
    {
      label: "MODE",
      color: "#8FFFAB",
      icon: modeIcon,
    },
    {
      label: "JAMMING",
      color: "#8FFFAB",
      icon: modeIcon,
    },
  ];

  return (
    <div className="bg-[#414141] text-white relative min-h-screen">
      <div className="max-w-5xl mx-auto pb-[120px]">
        <h1 className="text-3xl font-bold mb-8 text-center py-7 font-mono">
          Select Entity Type To Create
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ENTITY TYPE SECTION */}
            <div className="mt-30">
              <h2 className="text-base font-semibold flex justify-start mb-4 text-white/70 font-mono text-center">
                Choose an Entity Type
              </h2>

              <div className="flex gap-6 flex-wrap justify-center">
                {entityOptions.map((item) => (
                  <Button
                    key={item.label}
                    type="button"
                    variant="outline"
                    className={`w-[320px] h-[160px] border transition-all duration-300 rounded-xl ${
                      entityType === item.label
                        ? "bg-white/10 border-white/30 scale-105 shadow-lg"
                        : "bg-transparent border-white/10 hover:bg-white/5"
                    }`}
                    onClick={() => setValue("entityType", item.label)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-[64px] h-[64px]"
                      />
                      <span
                        className={`text-base font-semibold transition-colors ${
                          entityType === item.label
                            ? `text-[${item.color}]`
                            : "text-white/70"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>

              {errors.entityType && (
                <p className="text-sm text-red-500 mt-3 text-center">
                  {errors.entityType.message}
                </p>
              )}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-between fixed bottom-0 left-0 right-0 w-full bg-[#fff]/5 p-4 backdrop-blur-md border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                className="bg-transparent border-[#C5BFFF] text-[#C5BFFF]"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#7B70D6]"
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
