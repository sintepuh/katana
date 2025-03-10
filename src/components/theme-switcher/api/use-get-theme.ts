import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { QueryKeys } from "@/lib/constants";

export const useGetTheme = () => {
  return useQuery({
    queryKey: [QueryKeys.THEME],
    queryFn: async () => {
      const response = await client.api.theme.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch theme preferences");
      }

      const data = await response.json();

      return data.theme; 
    },
    enabled: false,
  });
};
