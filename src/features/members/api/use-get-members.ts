import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";

type UseGetMembersProps = {
  workspaceId: string;
};

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: [QueryKeys.MEMBERS, workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
