import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

import { TaskStatus } from "../types";
import { InferResponseType } from "hono";


type useGetTasksProps = {
  workspaceId: string;
  projectId?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
  status?: TaskStatus | null;
};

export type GetTasksResponseType = InferResponseType<
  (typeof client.api.tasks)["$get"],
  200
>;

export const useGetTasks = ({
  workspaceId,
  assigneeId,
  dueDate,
  projectId,
  status,
  search,
}: useGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      QueryKeys.TASKS,
      workspaceId,
      assigneeId,
      dueDate,
      projectId,
      status,
      search,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
