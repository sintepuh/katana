import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnalyticsCard from "./analytics-card";
import DottedSeparator from "./dotted-separator";
import { WorkspaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";

type WorkspaceTaskStatisticResponseTypeProps = {
  data: WorkspaceAnalyticsResponseType["data"];
  isLoading?: boolean
};

const Analytics = ({ data, isLoading }: WorkspaceTaskStatisticResponseTypeProps) => {

  const statistic = data?.analytic;

  if (!statistic || isLoading) {
    return null;
  }

  return (
    <ScrollArea className=" rounded-lg w-full whitespace-nowrap shrink-0 shadow ">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Всего задач"
            value={statistic?.taskCount}
            trend={statistic?.taskDiff > 0 ? "up" : "down"}
            increaseValue={statistic?.taskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Назначенные задачи"
            value={statistic?.assignedTaskCount}
            trend={statistic?.assignedTaskDiff > 0 ? "up" : "down"}
            increaseValue={statistic?.assignedTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Выполненные задачи"
            value={statistic?.completedTaskCount}
            trend={statistic?.completedTaskDiff > 0 ? "up" : "down"}
            increaseValue={statistic?.completedTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Просроченные задачи"
            value={statistic?.overDueTaskCount}
            trend={statistic?.overDueTaskDiff > 0 ? "up" : "down"}
            increaseValue={statistic?.overDueTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Незавершенные задачи"
            value={statistic?.inCompletedTaskCount}
            trend={statistic?.inCompletedTaskDiff > 0 ? "up" : "down"}
            increaseValue={statistic?.inCompletedTaskDiff}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Analytics;
