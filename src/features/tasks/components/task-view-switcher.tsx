"use client";

import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { GetTasksResponseType, useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModel } from "../hooks/use-create-task-model";
import { useTaskFilter } from "../hooks/use-task-filter";
import { columns } from "./columns";
import DataFilters from "./data-filters";
import DataKanban from "./data-kanban";
import { DataTable } from "./data-table";
import { useCallback } from "react";
import { TaskStatus } from "../types";
import { useBuildUpdateTask } from "../api/use-bulk-update-task";
import DataCalender from "./calender/data-calender";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import TasksLoadingPage from "@/app/dashboard/workspaces/[workspaceId]/tasks/loading";
import { AnimatePresence, motion } from "framer-motion";

type TaskViewSwitcherProps = {
  hideProjectFilter?: boolean;
  isLoading?: boolean,
  data?: GetTasksResponseType["data"],
};

const TaskViewSwitcher = ({ hideProjectFilter, isLoading: isLoadingProps, data: tasks }: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const { mutate } = useBuildUpdateTask();
  const { open } = useCreateTaskModel();
  const [{ projectId, assigneeId, dueDate, search, status }] = useTaskFilter();

  const workspaceId = useWorkspaceId();
  const paramsProjectId = useProjectId();

  const { data, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId: workspaceId,
    projectId: paramsProjectId || projectId,
    assigneeId,
    dueDate,
    search,
    status,
  });

  const tableData =
    data?.documents ||
    tasks?.documents ||
    [];

  const hasPropTasks = typeof tasks !== "undefined";
  const isLoading = (hasPropTasks ? !tasks : false) || isLoadingTasks || isLoadingProps || false;

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

  if (isLoading) {
    return <TasksLoadingPage />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex flex-col gap-y-4"
    >
      <Tabs
        className="flex-1 w-full rounded-lg border bg-card shadow"
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
              Новая задача
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
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ height: 0, opacity: 0, y: 10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                layout
                style={{
                  overflow: "hidden",
                }}
              >
                {view === "table" && (
                  <TabsContent value="table" className="mt-0">
                    <DataTable columns={columns} data={tableData} />
                  </TabsContent>
                )}
                {view === "kanban" && (
                  <TabsContent value="kanban" className="mt-0">
                    <DataKanban data={tableData} onChange={onKanbanChange} />
                  </TabsContent>
                )}
                {view === "calender" && (
                  <TabsContent value="calender" className="mt-0 h-full pb-4">
                    <DataCalender data={tableData} />
                  </TabsContent>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </Tabs>
    </motion.div>
  );
};

export default TaskViewSwitcher;
