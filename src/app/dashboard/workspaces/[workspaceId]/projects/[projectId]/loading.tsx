"use client";

import { Skeleton } from "@/components/ui/skeleton";

const TaskIdLoadingPage = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Skeleton className="w-[100px] h-9" />
        </div>
        <div>
          <Skeleton className="w-[125px] h-9" />
        </div>
      </div>
      <Skeleton className="rounded-lg w-full whitespace-nowrap shrink-0 h-[120px]" />
      <Skeleton className="rounded-xl w-full shadow-none h-[600px]" />
    </div >
  );
};

export default TaskIdLoadingPage;
