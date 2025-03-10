import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

export const useGetProject = ({ projectId }: { projectId: string }) => {
  const query = useQuery({
    queryKey: [QueryKeys.PROJECT, projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: { projectId },
      });

      if (!response.ok) throw new Error("Failed to fetch projects");

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
