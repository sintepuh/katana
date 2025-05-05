import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MemberAvatar from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type MemberListProps = {
  data?: Member[];
  total?: number;
  isLoading?: boolean
};

const MembersList = ({ data, total, isLoading }: MemberListProps) => {
  const workspaceId = useWorkspaceId();

  if (!data || isLoading) {
    return <Skeleton className="bg-card rounded-lg p-4 h-[220px]" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="flex flex-col gap-y-4 col-span-1"
    >
      <div className="bg-card border rounded-lg p-4 shadow">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Участники ({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/dashboard/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>

        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.$id} className="">
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex items-center flex-col gap-x-2.5">
                  <MemberAvatar
                    avatarUrl={member.imageUrl}
                    name={member.name}
                    className="size-12"
                    fallbackClassName="text-lg"
                  />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm font-medium line-clamp-1">
                      {member?.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            Участники не найдены.
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default MembersList;
