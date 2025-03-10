"use client";

import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";
import { useCreateWorkspaceModel } from "@/features/workspaces/hooks/use-create-workspace-model";
import ResponsiveModel from "@/components/responsive-model";

const CreateWorkspaceModel = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModel();

  return (
    <ResponsiveModel open={isOpen} onOpen={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModel>
  );
};

export default CreateWorkspaceModel;
