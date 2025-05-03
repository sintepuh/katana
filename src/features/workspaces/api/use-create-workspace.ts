import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const router = useRouter()
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const res = await client.api.workspaces.$post({ form });

      if (!res.ok) throw new Error("Не удалось создать рабочее пространство.");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Рабочее пространство успешно создана!");
      router.refresh()
      queryClient.invalidateQueries({ queryKey: [QueryKeys.WORKSPACES] });
    },
    onError: (err) => {
      console.log(err);

      toast.error(err.message ?? "Не удалось создать рабочее пространство.");
    },
  });

  return mutation;
};
