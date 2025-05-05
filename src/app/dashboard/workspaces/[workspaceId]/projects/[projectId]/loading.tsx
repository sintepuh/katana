"use client";

import { Skeleton } from "@/components/ui/skeleton";

const TaskIdLoadingPage = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 justify-between w-full">
          <Skeleton className="w-[100px] h-9" />
          <Skeleton className="w-[100px] h-9" />
        </div>
      </div>
      <Skeleton className="rounded-xl w-full shadow-none h-[600px]" />
      <div className="h-full flex flex-col gap-2 lg:gap-4">
        <Skeleton className="rounded-lg w-full whitespace-nowrap shrink-0 h-[120px]" />
        <div className=" grid flex-1 scroll-mt-20 items-start gap-2 lg:gap-4 grid-cols-1 lg:grid-cols-2 min-[1780px]:grid-cols-5 [grid-auto-rows:1fr]">
          <Skeleton className="col-span-1 min-[1780px]:col-span-2 order-0 h-[300px]" />
          <Skeleton className="col-span-1 lg:col-span-2 min-[1780px]:col-span-2 order-1 lg:order-2 min-[1780px]:order-1 h-[300px]" />
          <Skeleton className="col-span-1 order-2 lg:order-1 min-[1780px]:order-2 h-[300px]" />
        </div>
      </div>
    </div >
  );
};

export default TaskIdLoadingPage;
