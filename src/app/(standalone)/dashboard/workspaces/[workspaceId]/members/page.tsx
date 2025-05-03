import MembersList from "@/features/members/components/members-list";
import { PageWithWorkspaceId } from "@/features/workspaces/types";
import React from "react";

const WorkspaceMemberPage = async ({
  params: { workspaceId },
}: PageWithWorkspaceId) => {
  return <div className="w-full lg:max-w-xl">
    <MembersList workspaceId={workspaceId} />
  </div>;
};

export default WorkspaceMemberPage;
