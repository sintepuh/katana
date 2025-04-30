"use client";

import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModel } from "../hooks/use-create-task-model";
import { useTaskFilter } from "../hooks/use-task-filter";
import { columns } from "./columns";
import DataFilters from "./data-filters";
import DataKanban from "./data-kanban";
import { DataTable } from "./data-table";
import { useCallback} from "react";
import { TaskStatus } from "../types";
import { useBuildUpdateTask } from "../api/use-bulk-update-task";
import DataCalender from "./calender/data-calender";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import TasksLoadingPage from "@/app/(dashboard)/workspaces/[workspaceId]/tasks/loading";

type TaskViewSwitcherProps = {
  hideProjectFilter?: boolean;
  isLoading?: boolean
};

const TaskViewSwitcher = ({ hideProjectFilter, isLoading}: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const { mutate } = useBuildUpdateTask();

  const [{ projectId, assigneeId, dueDate, search, status }] = useTaskFilter();
  const workspaceId = useWorkspaceId();
  const paramsProjectId = useProjectId();
  const { open } = useCreateTaskModel();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramsProjectId || projectId,
    assigneeId,
    dueDate,
    search,
    status,
  });

  const onKanbanChange = useCallback(
    (
      tasks: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[]
    ) => {
      mutate({
        json: { tasks },
      });
    },
    [mutate]
  );

  if (!tasks || isLoadingTasks || isLoading) {
    return <TasksLoadingPage />
  }

  return (
    <Tabs
      className="flex-1 w-full rounded-lg border bg-card"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground " />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={tasks?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calender" className="mt-0 h-full pb-4 ">
              <DataCalender data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
