import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnalyticsCard from "./analytics-card";
import DottedSeparator from "./dotted-separator";
import { Skeleton } from "./ui/skeleton";

type ProjectAnalyticsResponseTypeProps = {
  data?: ProjectAnalyticsResponseType["data"];
  isLoading?: boolean
};

const Analytics = ({ data, isLoading }: ProjectAnalyticsResponseTypeProps) => {

  if (!data || isLoading) {
    return <Skeleton className="rounded-lg w-full whitespace-nowrap shrink-0 h-[120px]" />;
  }

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Всего задач"
            value={data?.taskCount}
            trend={data?.taskDiff > 0 ? "up" : "down"}
            increaseValue={data?.taskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Назначенные задачи"
            value={data?.assignedTaskCount}
            trend={data?.assignedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data?.taskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Выполненные задачи"
            value={data?.completedTaskCount}
            trend={data?.completedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data?.completedTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Просроченные задачи"
            value={data?.overDueTaskCount}
            trend={data?.overDueTaskDiff > 0 ? "up" : "down"}
            increaseValue={data?.overDueTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Незавершенные задачи"
            value={data?.inCompletedTaskCount}
            trend={data?.inCompletedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data?.inCompletedTaskDiff}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Analytics;
