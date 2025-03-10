import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"

import { TaskStatus } from "../types"

export const useTaskFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    assigneeId: parseAsString,
    dueDate: parseAsString,
    search: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
  })
}