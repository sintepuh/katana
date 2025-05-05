import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

export type WorkspaceAnalyticsResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["analytic"]["$get"],
  200
>;

export const useGetWorkspaceAnalytics = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const query = useQuery({
    queryKey: [QueryKeys.WORKSPACE_ANALYTICS, workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[
        ":workspaceId"
      ].analytic.$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch workspace analytics");

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
