import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const res = await client.api.members[":memberId"].$patch({
        param,
        json,
      });

      if (!res.ok) throw new Error("Failed to update member");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Member updated");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MEMBERS] });
    },
    onError: (err) => {
      console.log(err);

      toast.error(err.message ?? "Failed to update members");
    },
  });

  return mutation;
};
