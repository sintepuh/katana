import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const workspaceId = useWorkspaceId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.projects[":projectId"].$delete({
        param,
      });

      if (!res.ok) throw new Error("Failed to delete project");

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project deleted!");
      router.push(`/workspaces/${workspaceId}`);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROJECTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROJECT, data.$id],
      });
    },
    onError: () => {
      toast.error("Failed to delete Project");
    },
  });

  return mutation;
};
