"use client";

import ResponsiveModel from "@/components/responsive-model";

import { useCreateProjectModel } from "../hooks/use-create-project-model";
import CreateProjectForm from "./create-project-form";

const CreateProjectModel = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModel();

  return (
    <ResponsiveModel open={isOpen} onOpen={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModel>
  );
};

export default CreateProjectModel;
