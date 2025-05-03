"use client";


import WorkspaceSwitcher from "@/features/workspaces/components/workspace-switcher";
import DottedSeparator from "./dotted-separator";
import Logo from "./logo";
import Navigation from "./navigation";
import Projects from "./projects";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import SidebarLoader from "./sidebae-loader";

const Sidebar = () => {
  const { data: workspaces, isLoading: workspacesIsLoading } = useGetWorkspaces();
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: projectsIsLoading } = useGetProjects({ workspaceId });

  const isLoading = workspacesIsLoading || projectsIsLoading

  if (isLoading) {
    return (
      <SidebarLoader />
    )
  }

  return (
    <aside className="h-full bg-sidebar p-4 w-full border-r border-border">
      <Logo />
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher workspaces={workspaces} workspaceId={workspaceId} />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects projects={projects} workspaceId={workspaceId} />
    </aside>
  );
};

export default Sidebar;
