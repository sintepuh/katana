"use client";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteMember } from "../api/use-delete-member";
import { useGetMembers } from "../api/use-get-members";
import { useUpdateMember } from "../api/use-update-member";
import { MemberRole } from "../types";
import MemberAvatar from "./member-avatar";
import { Skeleton } from "@/components/ui/skeleton";

type MembersListProps = {
  workspaceId: string;
};

const MembersList = ({ workspaceId }: MembersListProps) => {
  const router = useRouter();

  const { data, isLoading } = useGetMembers({ workspaceId });
  const [ConfirmDialog, confirm] = useConfirm(
    "Исключить участника",
    "Вы уверены, что хотите исключить этого участника?",
    "destructive"
  );

  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();

  const handleDelete = async (memberId: string) => {
    const ok = await confirm();

    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  const handleUpdate = (memberId: string, role: MemberRole) => {
    updateMember({ param: { memberId }, json: { role } });
  };

  if (!data || isLoading) {
    return <Skeleton className="rounded-xl border bg-card w-full border-none shadow-none h-[300px]" />;
  }

  return (
    <Card className="w-full h-full border shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button size="sm" variant="secondary" asChild>
          <Link href={`/dashboard/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-2 mr-2" /> Назад
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Список участников</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                avatarUrl={member.imageUrl}
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" size="icon" variant="secondary">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdate(member.$id, MemberRole.ADMIN)}
                    disabled={isUpdating || isDeleting}
                  >
                    Назначить админом
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdate(member.$id, MemberRole.MEMBER)}
                    disabled={isUpdating || isDeleting}
                  >
                    Назначить участником
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-[#e13a60]"
                    onClick={() => handleDelete(member.$id)}
                    disabled={isUpdating || isDeleting}
                  >
                    Исключить {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-2.5" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default MembersList;
