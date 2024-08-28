"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../../lib/utils";

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", "text-black dark:text-white", className)} // Add dark mode text color
      {...props} />
  ));

SelectLabel.displayName = SelectPrimitive.Label.displayName;
export { SelectLabel };
