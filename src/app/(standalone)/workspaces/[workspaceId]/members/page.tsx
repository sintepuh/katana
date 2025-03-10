import { getCurrentUser } from "@/features/auth/queries";
import MembersList from "@/features/members/components/members-list";
import { PageWithWorkspaceId } from "@/features/workspaces/types";
import { redirect } from "next/navigation";
import React from "react";

const WorkspaceMemberPage = async ({
  params: { workspaceId },
}: PageWithWorkspaceId) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <div className="w-full lg:max-w-xl">
    <MembersList workspaceId={workspaceId} />
  </div>;
};

export default WorkspaceMemberPage;
