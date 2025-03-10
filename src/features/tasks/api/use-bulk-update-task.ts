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
      if (!res.ok) throw new Error("Failed to update tasks");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Tasks updated!");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TASKS],
      });
    },
    onError: () => {
      toast.error("Failed to update tasks");
    },
  });

  return mutation;
};
