"use client";

import { useRouter } from "next/navigation";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";

type JoinWorkspaceFormProps = {
  workspaceName: string;
  inviteCode: string;
  workspaceId: string;
};

const JoinWorkspaceForm = ({
  inviteCode,
  workspaceName,
  workspaceId,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useJoinWorkspace();

  const onJoin = async () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{workspaceName}</strong>{" "}
          workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <div className="flex items-center justify-between flex-col lg:flex-row gap-2">
          <Button
            className="w-full lg:w-fit"
            variant="secondary"
            type="button"
            asChild
            size="lg"
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            size="lg"
            onClick={onJoin}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinWorkspaceForm;
