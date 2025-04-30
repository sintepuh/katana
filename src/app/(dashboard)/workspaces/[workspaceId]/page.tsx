"use client";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import ProjectsList from "./_components/projects-list";
import TasksList from "./_components/tasks-list";
import MembersList from "./_components/members-list";
import Analytics from "@/components/analytics";

const WorkspaceId = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} isLoading={isLoading} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TasksList data={tasks?.documents} total={tasks?.total} isLoading={isLoading} />
        <ProjectsList data={projects?.documents} total={projects?.total} isLoading={isLoading} />
        <MembersList data={members?.documents} total={members?.total} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default WorkspaceId;
