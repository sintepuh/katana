"use client";

import { Loader, LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrent } from "@/features/auth/api/use-current";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DottedSeparator from "@/components//dotted-separator";
import { useLogout } from "@/features/auth/api/use-logout";
import { ThemeSwithcer } from "./theme-switcher/ui/theme-switcher";

const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex justify-center items-center bg-neutral-200 border border-neutral-300">
        <Loader className="animate-spin text-muted-foreground size-4" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {user.name ? user.name[0] : user.email[0] ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {user?.name ? user.name[0] : user?.email[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {user.name ?? "User"}
            </p>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <ThemeSwithcer />
        <DropdownMenuItem
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut className="size-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
