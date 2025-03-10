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

type MembersListProps = {
  workspaceId: string;
};

const MembersList = ({ workspaceId }: MembersListProps) => {
  const router = useRouter();

  const { data } = useGetMembers({ workspaceId });
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?",
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

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button size="sm" variant="secondary" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-2 mr-2" /> Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
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
                    Set as Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdate(member.$id, MemberRole.MEMBER)}
                    disabled={isUpdating || isDeleting}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDelete(member.$id)}
                    disabled={isUpdating || isDeleting}
                  >
                    Remove {member.name}
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
