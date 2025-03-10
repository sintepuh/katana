import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

type useGetTaskProps = {
  taskId: string;
};

export const useGetTask = ({ taskId }: useGetTaskProps) => {
  const query = useQuery({
    queryKey: [QueryKeys.TASK, taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
