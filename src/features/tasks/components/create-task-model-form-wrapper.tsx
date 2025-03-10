"use client";
import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import CreateTaskForm from "./create-task-form";

type CreateTaskModelFormWrapperProps = {
  onCancel: () => void;
};

const CreateTaskModelFormWrapper = ({
  onCancel,
}: CreateTaskModelFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const memberOptions = members?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
  }));

  const isLoading = isProjectsLoading || isMembersLoading;

  if (isLoading) {
    <Card className="w-full h-[740px] border-none shadow-none">
      <CardContent className="flex items-center justify-center h-full">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </CardContent>
    </Card>;
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      membersOptions={memberOptions ?? []}
    />
  );
};

export default CreateTaskModelFormWrapper;
