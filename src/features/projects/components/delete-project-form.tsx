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
    "Удалить проект",
    "Вы уверены, что хотите удалить этот проект?",
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
      <Card className="w-full h-full border shadow">
        <CardContent className="p-5 lg:p-7 flex items-center justify-between gap-4 ">
          <div className="flex flex-col">
            <h3 className="font-bold">Опасаная зона</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Удаление проекта необратимо и приведет к удалению всех связанных с ним данных.
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

export default DeleteProjectForm;
