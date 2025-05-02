import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.tasks[":taskId"].$delete({
        param,
      });

      if (!res.ok) throw new Error("Не удалось удалить задачу.");

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Задача удалена!");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TASKS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TASK, data.$id],
      });
    },
    onError: () => {
      toast.error("Не удалось удалить задачу.");
    },
  });

  return mutation;
};
