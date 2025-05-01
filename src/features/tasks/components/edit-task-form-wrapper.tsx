"use client";
import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useGetTask } from "../api/use-get-task";
import EditTaskForm from "./edit-task-form";

type EditTaskFormWrapperProps = {
  onCancel: () => void;
  id: string;
};

const EditTaskFormWrapper = ({ onCancel, id }: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValue, isLoading: isInitialValueLoading } = useGetTask({
    taskId: id,
  });

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
  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
    imageUrl: member.imageUrl
  }));

  const isLoading =
    isProjectsLoading || isMembersLoading || isInitialValueLoading;

  if (isLoading) {
    <Card className="w-full h-[740px] border-none shadow-none">
      <CardContent className="flex items-center justify-center h-full">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </CardContent>
    </Card>;
  }

  if (!initialValue) return null;

  return (
    <EditTaskForm
      initialValues={initialValue}
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      membersOptions={memberOptions ?? []}
    />
  );
};

export default EditTaskFormWrapper;
