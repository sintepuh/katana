import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { QueryKeys } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.profile)["$patch"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.profile)["$patch"]
>;

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const res = await client.api.profile.$patch({
        form,
      });

      if (!res.ok) throw new Error("Не удалось обновить профиль.");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Профиль обновлен!");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER],
      });
    },
    onError: (err) => {
      console.log(err);

      toast.error(err.message ?? "Не удалось обновить профиль.");
    },
  });

  return mutation;
};