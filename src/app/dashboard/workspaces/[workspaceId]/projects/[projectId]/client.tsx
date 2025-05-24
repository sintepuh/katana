"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import TaskIdLoadingPage from "./loading";
import { Statistic } from "@/components/statistic";
import { WorkspaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { GetTasksResponseType, useGetTasks } from "@/features/tasks/api/use-get-tasks";

const ProjectIdClient = () => {
  const projectId = useProjectId();

  const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId }) as { data: WorkspaceAnalyticsResponseType["data"], isLoading: boolean };
  const workspaceId = useWorkspaceId();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId
  }) as { data: GetTasksResponseType["data"], isLoading: boolean };

  const isLoading =
    isLoadingProject ||
    isLoadingAnalytics ||
    isLoadingTasks

  if (isLoading)
    return <TaskIdLoadingPage />

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 min-w-0">
          <ProjectAvatar
            name={project?.name || 'S'}
            image={project?.imageUrl}
            className="size-9"
          />
          <p className="text-lg font-semibold truncate flex-1 min-w-0">{project?.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/dashboard/workspaces/${project?.workspaceId}/projects/${projectId}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Редактировать
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter data={tasks} />
      {analytics && <Statistic data={analytics} isLoading={isLoading} />}
    </div>
  );
};

export default ProjectIdClient;