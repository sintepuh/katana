import { getWorkspace } from "@/lib/workspace-server";
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";
import DeleteWorkspaceForm from "@/features/workspaces/components/delete-workspace-form";
import ResetInviteForm from "@/features/workspaces/components/reset-invite-form";
import { PageWithWorkspaceId } from "@/features/workspaces/types";

const WorkspaceSettingsPage = async ({
  params: { workspaceId },
}: PageWithWorkspaceId) => {
  const workspace = await getWorkspace({ workspaceId });

  return (
    <div className="w-full lg:max-w-2xl">
      <div className="flex flex-col gap-y-4">
        <EditWorkspaceForm initialValues={workspace} />
        <ResetInviteForm initialValues={workspace} />
        <DeleteWorkspaceForm workspaceId={workspaceId} />
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;
