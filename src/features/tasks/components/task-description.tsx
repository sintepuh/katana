import { PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { useUpdateTask } from "../api/use-update-task";
import { Textarea } from "@/components/ui/textarea";

type TaskDescriptionProps = {
  task: Task;
};

const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);

  const { mutate, isPending } = useUpdateTask();

  const handleSave = async () => {
    mutate({
      json: {
        description: value,
      },
      param: { taskId: task.$id },
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? (
            <XIcon className="size-4 mr-2" />
          ) : (
            <PencilIcon className="size-4 mr-2" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            value={value}
            rows={4}
            placeholder="Add a description"
            disabled={isPending}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            size="sm"
            className="w-fit ml-auto"
            disabled={isPending}
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : (
        <p>
          {task.description ?? (
            <span className="text-muted-foreground"> No description set</span>
          )}
        </p>
      )}
    </div>
  );
};

export default TaskDescription;
