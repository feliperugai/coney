"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "~/lib/utils";

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    startText?: string;
    endText?: string;
  }
>(
  (
    { className, value, indicatorClassName, startText, endText, ...props },
    ref,
  ) => (
    <>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 bg-primary transition-all",
            indicatorClassName,
          )}
          style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
        />
      </ProgressPrimitive.Root>

      {(startText ?? endText) && (
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{startText}</span>
          <span>{endText}</span>
        </div>
      )}
    </>
  ),
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
