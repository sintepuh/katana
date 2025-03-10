import { Query, type Databases } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID } from "@/config";

type GetMemberProps = {
  databases: Databases;
  workspaceId: string;
  userId: string;
};

export const getMember = async ({
  databases,
  userId,
  workspaceId,
}: GetMemberProps) => {
  const member = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", userId),
    Query.equal("workspaceId", workspaceId),
  ]);

  return member.documents[0];
};
