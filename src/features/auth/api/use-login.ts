import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.auth.login["$post"]({ json });

      if (!res.ok) throw new Error("Не удалось войти.");

      return await res.json();
    },
    // http://localhost:3000/dashboard/workspaces/6817d13000117fcdb36f/join/ioqn7T
    onSuccess: () => {
      const inviteCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("postAuthRedirect="))
        ?.split("=")[1];

      const redirectUrl = inviteCookie
        ? decodeURIComponent(inviteCookie)
        : "/"; // Перенаправляем на главную страницу или на любую другую

        console.log(inviteCookie)
      // Перенаправляем после успешного логина
      router.push(redirectUrl);

      // Обновляем кэш пользователя
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });

     
      document.cookie = "postAuthRedirect=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    },
    onError: () => {
      toast.error("Не удалось войти.");
    },
  });

  return mutation;
};
