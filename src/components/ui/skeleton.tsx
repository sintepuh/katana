import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  children?: React.ReactNode;
}

function Skeleton({ className, loading, children, ...props }: SkeletonProps) {
  if (!loading) return <>{children}</>;

  return (
    <div
      className={cn(
        "animate-pulse bg-skeleton rounded-md",
        className
      )}
      {...props}
    >
      {children && React.isValidElement(children) ? (
        <div className={cn(children.props.className, "invisible")}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { Skeleton };
