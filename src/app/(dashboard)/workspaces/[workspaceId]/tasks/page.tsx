import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import React from "react";

const TasksPage = async () => {
  return (
    <div className="flex flex-col h-full">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
