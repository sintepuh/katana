import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const res = await client.api.workspaces[":workspaceId"].$patch({
        form,
        param,
      });

      if (!res.ok) throw new Error("Failed to update workspace");

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated!");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WORKSPACES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WORKSPACE, data.$id],
      });
    },
    onError: (err) => {
      console.log(err);

      toast.error(err.message ?? "Failed to update workspace");
    },
  });

  return mutation;
};
