"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";

import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import Analytics from "@/components/analytics";

const ProjectIdClient = () => {
  const projectId = useProjectId();

  const { data: project, isLoading } = useGetProject({ projectId });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  if (isLoading || isLoadingAnalytics) return <PageLoader />;

  if (!project) throw new Error("Project not found");

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-9"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${projectId}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectIdClient;
