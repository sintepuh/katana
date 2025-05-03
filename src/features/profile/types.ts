import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  imageUrl?: string;
  inviteCode: string;
  userId: string;
};

export type PageWithWorkspaceId = {
  params: WorkspaceIdProps;
};

export type WorkspaceIdProps = {
  workspaceId: string;
};
