import React, { PropsWithChildren } from "react";

type OverviewPropertyProps = PropsWithChildren<{ label: string }>;

const OverviewProperty = ({ label, children }: OverviewPropertyProps) => {
  return (
    <div className="flex items-start gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-center gap-x-2">{children}</div>
      </div>
    </div>
  );
};

export default OverviewProperty;
