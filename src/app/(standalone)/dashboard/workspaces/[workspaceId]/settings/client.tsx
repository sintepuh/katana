"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import DeleteWorkspaceForm from "@/features/workspaces/components/delete-workspace-form";
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";
import ResetInviteForm from "@/features/workspaces/components/reset-invite-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const WorkspaceSettingsClientPage = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValue, isLoading } = useGetWorkspace({ workspaceId });

  if (!initialValue) throw new Error("Project not found");

  return (
    <div className="flex flex-col gap-y-4">
      <EditWorkspaceForm initialValues={initialValue} isLoading={isLoading} />
      <ResetInviteForm initialValues={initialValue} />
      <DeleteWorkspaceForm workspaceId={workspaceId} />
    </div>
  );
};

export default WorkspaceSettingsClientPage;
