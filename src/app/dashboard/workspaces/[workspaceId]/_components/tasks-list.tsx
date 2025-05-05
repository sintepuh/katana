import { formatDistanceToNow } from "date-fns";
import { ru } from 'date-fns/locale';
import { CalendarIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateTaskModel } from "@/features/tasks/hooks/use-create-task-model";
import { Task } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type TaskListProps = {
  data?: Task[];
  total?: number;
  isLoading?: boolean
};

const TaskList = ({ data, total, isLoading }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModel();
  const workspaceId = useWorkspaceId();

  if (!data || isLoading) {
    return <Skeleton className="bg-card rounded-lg p-4 h-[450px]" />;
  }

  return (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.8 }}
    className="flex flex-col gap-y-4 col-span-1">
    <div className="bg-card border rounded-lg p-4 shadow">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Задачи ({total})</p>
        <Button variant="secondary" size="icon" onClick={createTask}>
          <PlusIcon className="lucide lucide-plus size-4 text-neutral-400" />
        </Button>
      </div>

      <DottedSeparator className="my-4" />
      <ul className="flex flex-col gap-y-4">
        {data.slice(0, 3).map((task) => (
          <li key={task.$id} className="">
            <Link href={`/dashboard/workspaces/${workspaceId}/tasks/${task.$id}`}>
              <Card className="shadow-none rounded-lg  hover:opacity-75 transition overflow-x-auto">
                <CardContent className="p-4 min-w-fit">
                  <p className="text-lg font-medium truncate">{task.name}</p>
                  <div className="flex items-center gap-x-4">
                    <p className="">{task.project?.name}</p>
                    <div className="size-1 rounded-full bg-neutral-300" />
                    <div className="text-sm text-muted-foreground flex items-center">
                      <CalendarIcon className="size-3 mr-1" />
                      <span className="truncate">
                        {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: ru })}
                      </span>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
        <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
          Задач не найдено
        </li>
      </ul>
      <Button asChild variant="secondary" className="mt-4 w-full">
        <Link href={`/dashboard/workspaces/${workspaceId}/tasks`}>Показать все</Link>
      </Button>
    </div>
  </motion.div>
  );
};

export default TaskList;
