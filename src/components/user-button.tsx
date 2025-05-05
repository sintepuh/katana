"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrent } from "@/features/auth/api/use-current";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DottedSeparator from "@/components//dotted-separator";
import { useLogout } from "@/features/auth/api/use-logout";
import { Skeleton } from "./ui/skeleton";
import { useDispatch } from 'react-redux'
import { setUser } from "@/features/auth/module/slice/userSlice";
import { useEffect } from "react";
import { useEditProfileModel } from "@/features/profile/hooks/use-edit-profile-model";
import { ThemeSwitcher } from "./theme-switcher/theme-switcher";


const UserButton = () => {
  const { data: user, isLoading, isSuccess } = useCurrent();
  const { mutate: logout } = useLogout();
  const { open } = useEditProfileModel();

  const dispatch = useDispatch()

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(user));
    }
  }, [user, dispatch, isSuccess]);

  if (isLoading) {
    return (
      <div className="flex flex-row gap-2">
        <Skeleton className="!rounded-full size-10" />
        <div className="flex flex-row gap-2 items-center">
          <Skeleton className="!rounded-full size-10" />
          <Skeleton className="w-[100px] h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      <ThemeSwitcher />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <div className="flex flex-row gap-2 items-center">
            <Avatar className="size-10 hover:opacity-75 transition border">
              <AvatarImage src={user?.prefs.imageUrl} alt="avatar" />
              <AvatarFallback className="font-medium text-neutral-500 flex items-center justify-center">
                {user?.name ? user?.name[0] : user?.email[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <p>{user?.name ?? "user"}</p>
          </div>

        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-60"
          sideOffset={10}
        >
          <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
            <Avatar className="size-[52px] border cursor-pointer" onClick={open}>
              <AvatarImage src={user?.prefs.imageUrl} alt="avatar" />
              <AvatarFallback className="text-xl font-medium text-neutral-500 flex items-center justify-center">
                {user?.name ? user?.name[0] : user?.email[0] ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-medium text">
                {user?.name ?? "User"}
              </p>
              <p className="text-sm text-neutral-500">{user?.email}</p>
            </div>
          </div>
          <DottedSeparator className="mb-1" />
          <DropdownMenuItem
            className="h-10 flex items-center justify-center text-[#e13a60] font-medium cursor-pointer"
            onClick={() => logout()}
          >
            <LogOut className="size-4 mr-2" /> Выход
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

  );
};

export default UserButton;
