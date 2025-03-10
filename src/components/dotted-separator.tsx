import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";
import React from "react";

type DottedSeparatorProps = {
  className?: ClassValue;
  color?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: "horizontal" | "vertical";
};

const DottedSeparator = ({
  className,
  direction = "horizontal",
  dotSize = "2px",
  gapSize = "6px",
  height = "2px",
}: DottedSeparatorProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center",
        className
      )}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, var(--border) 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
            : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default DottedSeparator;
