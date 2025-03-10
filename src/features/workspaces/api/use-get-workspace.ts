import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

export const useGetWorkspace = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: [QueryKeys.WORKSPACE, workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"].$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch workspaces");

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
