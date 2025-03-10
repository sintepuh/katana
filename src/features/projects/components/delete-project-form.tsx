"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteProject } from "../api/use-delete-project";

type DeleteProjectFormProps = {
  projectId: string;
};

const DeleteProjectForm = ({ projectId }: DeleteProjectFormProps) => {

  const [DeleteDialog, confirm] = useConfirm(
    "Delete Project",
    "Are you sure you want to delete this project?",
    "destructive"
  );

  const { mutate, isPending } = useDeleteProject();

  const handleDelete = async () => {
    const result = await confirm();
    if (!result) return;

    mutate({
      param: { projectId },
    });
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

export default DeleteProjectForm;
