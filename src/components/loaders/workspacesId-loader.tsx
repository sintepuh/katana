import { Skeleton } from "../ui/skeleton";

const WorkspaceIdLoader = () => { 
  return (
    <div className="h-full flex flex-col space-y-4">
      <Skeleton className="rounded-lg w-full whitespace-nowrap shrink-0"/>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Skeleton className="flex flex-col gap-y-4 col-span-1" />
        <Skeleton  />
        <Skeleton  />
      </div>
    </div>
  );
};

export default WorkspaceIdLoader;
