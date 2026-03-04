// import * as React from "react"
// import * as SwitchPrimitives from "@radix-ui/react-switch"

// import { cn } from "../../lib/utils"


// const Switch = React.forwardRef(({ className, thumbClassName, ...props }, ref) => (
//   <SwitchPrimitives.Root
//     data-slot="switch"
//     className={cn(
//       "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//       className
//     )}
//     {...props}
//   >
//     <SwitchPrimitives.Thumb
//       data-slot="switch-thumb"
//       className={cn(
//         "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%_-_-5px)] data-[state=unchecked]:translate-x-0",
//         thumbClassName
//       )}
//     />
//   </SwitchPrimitives.Root>
// ))
// Switch.displayName = SwitchPrimitives.Root.displayName

// export { Switch }

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";

const Switch = React.forwardRef(
  (
    {
      className,
      thumbClassName,
      checkedBg = "#7B70D6",
      uncheckedBg = "#414141",
      checkedThumb = "bg-black",
      uncheckedThumb = "bg-gray-500",
      checkedTextColor = "text-white",
      uncheckedTextColor = "text-white",
      checkedText = "ON",
      uncheckedText = "OFF",
      ...props
    },
    ref
  ) => {
    const isChecked = props.checked;

    return (
      <SwitchPrimitives.Root
        ref={ref}
        style={{
          backgroundColor: isChecked ? checkedBg : uncheckedBg, // ✅ Inline style for dynamic color
        }}
        className={cn(
          "relative inline-flex items-center justify-between w-[62px] h-[30px] rounded-full border cursor-pointer transition-colors duration-300 ease-in-out px-[8px]",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "text-[12px] select-none absolute left-[10px] right-[10px] text-center transition-all duration-300 ease-in-out",
            isChecked
              ? `translate-x-[-12px] opacity-100 ${checkedTextColor}`
              : `translate-x-[12px] opacity-100 ${uncheckedTextColor}`
          )}
        >
          {isChecked ? checkedText : uncheckedText}
        </span>

        <SwitchPrimitives.Thumb
          className={cn(
            "block w-[15px] h-[15px] rounded-full transition-transform duration-300 ease-in-out",
            isChecked
              ? `translate-x-[28px] ${checkedThumb}`
              : `translate-x-0 ${uncheckedThumb}`,
            thumbClassName
          )}
        />
      </SwitchPrimitives.Root>
    );
  }
);

Switch.displayName = SwitchPrimitives.Root.displayName;
export { Switch };
