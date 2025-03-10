"use client";

import { usePathname } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";
import UserButton from "./user-button";

const pathnameMap = {
  tasks: {
    title: "Task",
    description: "View your task here",
  },
  projects: {
    title: "Projects",
    description: "View all tasks of your projects here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all your projects and tasks here",
};

const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="mt-4 px-6 flex items-center justify-between h-16">
      <div className="lg:flex flex-col hidden">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export default Navbar;
