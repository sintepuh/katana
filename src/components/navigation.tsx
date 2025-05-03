"use client";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Settings, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

export const routes = [
  {
    label: "Домашняя страница",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Задачи",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Настройки",
    href: "/settings",
    icon: Settings,
    activeIcon: Settings,
  },
  {
    label: "Участники",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];

const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map((route) => {
        const fullHref = `/dashboard/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <Link key={route.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-accent-foreground transition text-neutral-500",
                isActive && "bg-sidebar-accent shadow-sm hover:opacity-100 text-accent-foreground"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {route.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

export default Navigation;
