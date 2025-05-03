import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.profile)['update-theme']["$patch"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.profile)['update-theme']["$patch"]
>;

export const useUpdateTheme = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const res = await client.api.profile['update-theme'].$patch({
        form,
      });

      if (!res.ok) throw new Error("Не удалось обновить тему.");

      return await res.json();
    },
  });

  return mutation;
};