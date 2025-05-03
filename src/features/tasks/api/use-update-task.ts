import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useUpdateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.tasks[":taskId"].$patch({ json, param });
      if (!res.ok) throw new Error("Не удалось обновить задачу.");

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Задача обновлена!");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROJECT_ANALYTICS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WORKSPACE_ANALYTICS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TASKS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TASK, data.$id],
      });
    },
    onError: () => {
      toast.error("Не удалось обновить задачу.");
    },
  });

  return mutation;
};
