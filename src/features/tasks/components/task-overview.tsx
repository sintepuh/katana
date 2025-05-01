import { PencilIcon } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MemberAvatar from "@/features/members/components/member-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";

import { Task } from "../types";
import OverviewProperty from "./overview-property";
import TaskDate from "./task-date";
import { useEditTaskModel } from "../hooks/use-edit-task-model";

type TaskOverviewProps = {
  task: Task;
};

const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModel();
  console.log(task.assigneeImageUrl)

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button size="sm" variant="secondary" onClick={() => open(task.$id)}>
            <PencilIcon className="size-4 mr-2" /> Edit
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar avatarUrl={task.assignee.imageUrl} className="size-6" name={task.assignee.name} />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;
