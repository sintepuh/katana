import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytic"]["$get"],
  200
>;
export const useGetProjectAnalytics = ({
  projectId,
}: {
  projectId: string;
}) => {
  const query = useQuery({
    queryKey: [QueryKeys.PROJECT_ANALYTICS, projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].analytic.$get({
        param: { projectId },
      });

      if (!response.ok) throw new Error("Failed to fetch projects analytics");

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
