import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.tasks.$post({ json });

      if (!res.ok) throw new Error("Не удалось создать задачу.");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Задача создана!");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROJECT_ANALYTICS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WORKSPACE_ANALYTICS],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TASKS] });
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message ?? "Не удалось создать задачу.");
    },
  });

  return mutation;
};
