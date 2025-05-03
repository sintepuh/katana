import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;

export const useUpdateProject = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const res = await client.api.projects[":projectId"].$patch({
        form,
        param,
      });

      if (!res.ok) throw new Error("Не удалось обновить проект.");

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Проект обновлен!");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROJECTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROJECT, data.$id],
      });
    },
    onError: () => {
      toast.error("Не удалось обновить проект.");
    },
  });

  return mutation;
};
