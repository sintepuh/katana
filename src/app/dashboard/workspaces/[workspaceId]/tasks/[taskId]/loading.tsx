"use client";

import DottedSeparator from "@/components/dotted-separator";
import { Skeleton } from "@/components/ui/skeleton";

const TaskIdLoadingPage = () => {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-[180px] h-[32px]" />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="w-full" />
        <Skeleton className="w-full h-[260px]" />
      </div>
    </div>
  );
};

export default TaskIdLoadingPage;
