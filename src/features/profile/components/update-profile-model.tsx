"use client";

import ResponsiveModel from "@/components/responsive-model";
import UpdateProfileForm from "./update-profile-form";
import { useEditProfileModel } from "../hooks/use-edit-profile-model";

const UpdateProfileModel = () => {
  const { isOpen, setIsOpen, close } = useEditProfileModel();

  return (
    <ResponsiveModel open={isOpen} onOpen={setIsOpen}>
      <UpdateProfileForm onCancel={close} />
    </ResponsiveModel>
  );
};

export default UpdateProfileModel;
