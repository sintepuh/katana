import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-skeleton ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Skeleton };
