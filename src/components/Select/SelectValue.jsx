import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../../lib/utils";

const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => {
    const value = props.value; // Get the selected value from props


  
    return (
      <span ref={ref} className={cn("text-sm", className)}>
        {value ? value : <span className="text-muted-foreground">{placeholder}</span>}
      </span>
    );
  });
  
export { SelectValue };
