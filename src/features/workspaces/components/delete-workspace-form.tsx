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
    "Удалить рабочее пространство",
    "Вы уверены, что хотите удалить это рабочее пространство?",
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
      <Card className="w-full h-full border shadow">
        <CardContent className="p-5 lg:p-7 flex items-center justify-between gap-4 ">
          <div className="flex flex-col">
            <h3 className="font-bold">Опасаная зона</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Удаление рабочего пространства необратимо и приведет к удалению всех связанных с ним данных.
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
            Удалить
          </Button>
        </CardContent>
      </Card>
      <DeleteDialog />
    </>
  );
};

export default DeleteWorkspaceForm;
