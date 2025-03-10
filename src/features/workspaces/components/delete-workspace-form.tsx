"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteWorkspace } from "../api/use-delete-workspace";

type DeleteWorkspaceFormProps = {
  workspaceId: string;
};

const DeleteWorkspaceForm = ({ workspaceId }: DeleteWorkspaceFormProps) => {

  const [DeleteDialog, confirm] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace?",
    "destructive"
  );

  const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace();

  const handleDelete = async () => {
    const result = await confirm();
    if (!result) return;

    deleteWorkspace(
      {
        param: { workspaceId },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  return (
    <>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7 flex items-center justify-between gap-4 ">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Deleting a workspace is irreversible and will delete all
              associated data
            </p>
          </div>
          <Button
            className="w-fit"
            size="sm"
            variant="destructive"
            type="button"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete Workspace
          </Button>
        </CardContent>
      </Card>
      <DeleteDialog />
    </>
  );
};

export default DeleteWorkspaceForm;
