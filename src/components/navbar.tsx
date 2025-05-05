"use client";

import { usePathname } from "next/navigation";
import UserButton from "./user-button";
import MobileSidebar from "./mobile-sidebar";

const pathnameMap = {
  tasks: {
    title: "Задачи",
    description: "Здесь вы можете посмотреть задачи.",
  },
  projects: {
    title: "Проекты",
    description: "Здесь вы можете посмотреть все задачи вашего проекта.",
  },
};

const defaultMap = {
  title: "Домашняя страница",
  description: "Здесь вы можете контролировать все свои проекты и задачи.",
};

const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[4] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 pb-2 px-2 sm:px-6 flex items-center justify-between sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-navbar">
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
