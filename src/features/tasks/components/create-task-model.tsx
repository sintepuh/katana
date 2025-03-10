"use client";

import ResponsiveModel from "@/components/responsive-model";

import { useCreateTaskModel } from "../hooks/use-create-task-model";
import CreateTaskModelFormWrapper from "./create-task-model-form-wrapper";

const CreateTaskModel = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModel();

  return (
    <ResponsiveModel onOpen={setIsOpen} open={isOpen}>
      <CreateTaskModelFormWrapper onCancel={close} />
    </ResponsiveModel>
  );
};

export default CreateTaskModel;
