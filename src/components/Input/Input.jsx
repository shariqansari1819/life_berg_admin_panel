import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(
  ({ className, type, icons, iconPosition = "left", ...props }, ref) => {
    const iconLeft = iconPosition === "left";

    return (
      <div className="relative flex items-center">
        {icons && iconLeft && (
          <span className="absolute left-3 text-muted-foreground">
            {icons}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 border bg-whiteBackground px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            
            icons && iconLeft ? "pl-9" : "",
            icons && !iconLeft ? "pr-9" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {icons && !iconLeft && (
          <span className="absolute right-3 text-muted-foreground">
            {icons}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
