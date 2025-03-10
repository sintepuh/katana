import { parseAsString, useQueryState } from "nuqs";

export const useEditTaskModel = () => {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);

  return {
    taskId,
    open: (id: string) => setTaskId(id),
    close: () => setTaskId(null),
    setTaskId,
  };
};
