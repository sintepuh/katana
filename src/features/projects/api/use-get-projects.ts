import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

export const useGetProjects = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: [QueryKeys.PROJECTS, workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: {
          workspaceId,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch projects");

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
