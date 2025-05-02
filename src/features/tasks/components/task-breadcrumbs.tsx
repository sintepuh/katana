import { ChevronRightIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useDeleteTask } from "../api/use-delete-task";
import { Task } from "../types";

type TaskBreadcrumbsProps = {
  project: Project;
  task: Task;
};

const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const router = useRouter();

  const [ConfirmDialog, confirmDelete] = useConfirm(
    "Удалить задачу",
    "Вы уверены, что хотите удалить эту задачу?",
    "destructive"
  );

  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useDeleteTask();

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/dashboard/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/dashboard/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        className="ml-auto"
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={handleDelete}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Удалить задачу</span>
      </Button>
    </div>
  );
};

export default TaskBreadcrumbs;
