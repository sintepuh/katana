"use client";

import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useCreateProjectModel } from "@/features/projects/hooks/use-create-project-model";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Projects = ({
  projects,
  workspaceId
}:
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: any;
    workspaceId: string
  }) => {
  const pathname = usePathname();


  const { open } = useCreateProjectModel();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Проекты</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 hover:opacity-75 transition cursor-pointer"
        />
      </div>
      {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projects?.documents.map((project: any) => {
        const href = `/dashboard/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;

        return (
          <Link
            key={project.$id}
            href={href}
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
              isActive && "bg-sidebar-accent shadow-sm hover:opacity-100 text-sidebar-text"
            )}
          >
            <ProjectAvatar name={project.name} image={project.imageUrl} />
            <span className="truncate">{project.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Projects;
