import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useUpdateTheme = () => {
  const mutation = useMutation({
    mutationFn: async (theme: "light" | "dark") => {
      const response = await client.api.theme.$post({
        json: { theme },
      });

      if (!response.ok) {
        throw new Error("Failed to update theme");
      }

      const result = await response.json();
      return result;
    }
  });

  return mutation;
};
