"use client";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";

import { useResetInvite } from "../api/use-reset-invite";
import { Workspace } from "../types";

type ResetInviteFormProps = {
  initialValues: Workspace;
};

const ResetInviteForm = ({ initialValues }: ResetInviteFormProps) => {
  const { mutate, isPending } = useResetInvite();
  const [ResetDialog, confirmReset] = useConfirm(
    "Сбросить приглашение",
    "Это сделает текущую ссылку-приглашение недействительной.",
    "destructive"
  );

  const fullInviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Скопировано в буфер обмена"));
  };

  const handleResetInvite = async () => {
    const result = await confirmReset();
    if (!result) return;

    mutate({
      param: { workspaceId: initialValues.$id },
    });
  };

  return (
    <Card className="w-full h-full border shadow">
      <ResetDialog />
      <CardContent className="p-5 lg:p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Пригласить участника</h3>
          <p className="text-sm text-muted-foreground text-pretty">
            Поделитесь этой ссылкой с участниками, чтобы пригласить их в это рабочее пространство.
          </p>
          <div className="mt-4">
            <div className="flex items-center gap-x-2">
              <Input value={fullInviteLink} disabled />
              <Button
                className="size-12"
                variant="secondary"
                onClick={handleCopy}
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>
          </div>
          <DottedSeparator className="py-6" />
          <Button
            className="w-fit mt-6 ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isPending}
            onClick={handleResetInvite}
          >
            Сбросить приглашение
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetInviteForm;
