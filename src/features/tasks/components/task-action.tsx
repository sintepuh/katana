import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteTask } from "../api/use-delete-task";
import { useEditTaskModel } from "../hooks/use-edit-task-model";

type TaskActionProps = {
  id: string;
  projectId: string;
  children: ReactNode;
};

export const TaskAction = ({ id, projectId, children }: TaskActionProps) => {
  const router = useRouter();

  const { open } = useEditTaskModel();

  const [ConfirmDialog, confirmDelete] = useConfirm(
    "Удалить задачу",
    "Вы уверены, что хотите удалить эту задачу?",
    "destructive"
  );
  const { mutate, isPending } = useDeleteTask();
  const workspaceId = useWorkspaceId();

  const onDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/dashboard/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Подробности
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Проект
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Изменить
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="font-medium p-[10px] text-[#e13a60] focus:text-[#e13a60]"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
