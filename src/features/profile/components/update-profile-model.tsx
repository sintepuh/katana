"use client";

import ResponsiveModel from "@/components/responsive-model";
import UpdateProfileForm from "./update-profile-form";
import { useEditProfileModel } from "../hooks/use-edit-profile-model";
import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";

const UpdateProfileModel = () => {
  const { isOpen, setIsOpen, close } = useEditProfileModel();
  const user = useSelector((state: RootState) => state.user.user)

  const initialValues = {
    name: user?.name,
    imageUrl: user?.prefs.imageUrl as string
  }

  return (
    <ResponsiveModel open={isOpen} onOpen={setIsOpen}>
      <UpdateProfileForm initialValues={initialValues} onCancel={close} />
    </ResponsiveModel>
  );
};

export default UpdateProfileModel;
