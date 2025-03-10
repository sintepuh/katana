import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.workspaces[":workspaceId"].$delete({
        param,
      });

      if (!res.ok) throw new Error("Failed to delete workspace");

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace deleted");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.WORKSPACES] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WORKSPACE, data.$id],
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message ?? "Failed to delete workspace");
    },
  });

  return mutation;
};
