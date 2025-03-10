import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.auth.register["$post"]({ json });

      return await res.json();
    },
    onSuccess: ({ success }) => {
      if (!success) {
        toast.error("Failed to register");
      } else {
        toast.success("Registered successfully");
      }
      router.refresh();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
    onError: () => {
      toast.error("Failed to register");
    },
  });

  return mutation;
};
