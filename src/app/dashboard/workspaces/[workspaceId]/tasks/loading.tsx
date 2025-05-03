"use client";

import { Skeleton } from "@/components/ui/skeleton";

const TasksLoadingPage = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 w-full rounded-lg">
        <Skeleton className="rounded-xl w-full shadow-none h-[600px]" />
      </div>
    </div>
  );
};

export default TasksLoadingPage;
