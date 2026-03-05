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
    <div className="bg-[#414141] text-white relative min-h-screen md:w-170 xl:w-auto mx-auto ">
      <div>
        <h1 className="page-heading text-primary mb-8 text-center py-2.5 px-5 xl:py-5 xl:px-10">
           Select Entity Type To Create 
          
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ENTITY TYPE SECTION */}
            <div className=" xl:mt-16!">
              <h2 className=" flex justify-start mb-2 xl:mb-8 text-secondary subheading-sm ">
                {/* Choose an Entity Type */}
                Select mission type
              </h2>

              <div className="flex gap-6 flex-wrap justify-start">
                {entityOptions.map((item) => (
                  <Button
                    key={item.label}
                    type="button"
                    variant="outline"
                    className={`w-[320px] h-[160px] border transition-all duration-300 rounded-xl ${
                      entityType === item.label
                        ? "bg-white/10 text-accent border-focus scale-105 shadow-lg hover-bg-glass font-bold! cursor-pointer"
                        : "bg-transparent border-divider hover-bg-glass card-text-sm cursor-pointer"
                    }`}
                    onClick={() => setValue("entityType", item.label)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-6 h-6"
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
            {/* Important:the following form was not commented already-->developed by vaishnavi on {05-03-2026(12:00pm)} */}
              <div className="pt-5 xl:pt-10 pb-2 xl:pb-8">
              <label className="block text-secondary subheading-sm">
                Add Details
              </label>
            </div>
            {/* Mission Details */}
            <div className="mb-8 space-y-8">
              <div className="flex-col-2 items-start!" >
                <label className="block label-text text-emphasis-strong ">
                  Entity Name
                </label>
                <Input
                   {...register("entityName")}
                  className="bg-white/5 border border-white/5 input-text text-primary
  focus:border-[#7B70D6] focus:outline-none!
  focus:ring-0! focus-visible:ring-0! focus:ring-offset-0!
  focus:shadow-none! shadow-none!"
                  placeholder="Enter mission name"
                />
                {errors.missionName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.missionName.message}
                  </p>
                )}
              </div>

              <div className="flex-col-2 items-start!" >
                <label className="block label-text text-emphasis-strong ">
                  Description 
                </label>
                <Textarea
                    {...register("description")}
                  rows={4}
                  className="bg-white/5 border-white/10 input-text text-primary focus:border-[#7B70D6] focus:outline-none!
  focus:ring-0! focus-visible:ring-0! focus:ring-offset-0!
  focus:shadow-none! shadow-none!resize-none"
                  placeholder="Enter mission description"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-between items-center px-10 fixed bottom-0 left-0 right-0 w-full py-4 bg-white/5 backdrop-blur-md border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                className="btn-border-accent  px-6"
                onClick={handleCancel}
              >
                  <span className="text-accent"> Cancel</span>
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                 className="btn-primary px-6 "
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
