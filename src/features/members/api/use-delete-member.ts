import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.members[":memberId"].$delete({
        param,
      });

      if (!res.ok) throw new Error("Не удалось исключить участника.");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Участник исключен.");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MEMBERS] });
    },
    onError: (err) => {
      console.log(err);

      toast.error(err.message ?? "Не удалось исключить участника.");
    },
  });

  return mutation;
};
