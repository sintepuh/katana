import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-update"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;

export const useBuildUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.tasks["bulk-update"].$post({ json });
      if (!res.ok) throw new Error("Не удалось обновить задачу.");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Задача обновлена!");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROJECT_ANALYTICS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WORKSPACE_ANALYTICS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TASKS],
      });
    },
    onError: () => {
      toast.error("Не удалось обновить задачу.");
    },
  });

  return mutation;
};
