"use client";

import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useCreateProjectModel } from "@/features/projects/hooks/use-create-project-model";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

const Projects = () => {
  const pathname = usePathname();

  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetProjects({ workspaceId });

  const { open } = useCreateProjectModel();

  if (isLoading)
    return <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 hover:opacity-75 transition cursor-pointer"
        />
      </div>
      <Skeleton className="h-[44px] w-full" />
      <Skeleton className="h-[44px] w-full" />
      <Skeleton className="h-[44px] w-full" />
    </div>

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 hover:opacity-75 transition cursor-pointer"
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;

        return (
          <Link
            key={project.$id}
            href={href}
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
              isActive && "bg-card-foreground shadow-sm hover:opacity-100 text-primary"
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
