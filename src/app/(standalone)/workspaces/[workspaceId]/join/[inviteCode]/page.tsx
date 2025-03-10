import { getCurrentUser } from "@/features/auth/queries";
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { PageWithWorkspaceId } from "@/features/workspaces/types";
import { redirect } from "next/navigation";
import React from "react";

type JoinWorkspacePageProps = PageWithWorkspaceId & {
  params: {
    inviteCode: string;
  };
};

const JoinWorkspacePage = async ({
  params: { workspaceId, inviteCode },
}: JoinWorkspacePageProps) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspaceInfo({ workspaceId });

  if (!workspace || !workspace.name) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        inviteCode={inviteCode}
        workspaceId={workspaceId}
        workspaceName={workspace.name}
      />
    </div>
  );
};

export default JoinWorkspacePage;
