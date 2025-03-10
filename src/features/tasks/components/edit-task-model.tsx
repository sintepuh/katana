"use client";

import ResponsiveModel from "@/components/responsive-model";

import { useEditTaskModel } from "../hooks/use-edit-task-model";
import EditTaskFormWrapper from "./edit-task-form-wrapper";

const EditTaskModel = () => {
  const { taskId, close } = useEditTaskModel();

  return (
    <ResponsiveModel onOpen={close} open={!!taskId}>
      {!!taskId && <EditTaskFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModel>
  );
};

export default EditTaskModel;
