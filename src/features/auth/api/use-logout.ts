import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.auth.logout["$post"]();
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");

      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.WORKSPACES] });

      router.push("/");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  return mutation;
};