import WorkspaceSwitcher from "@/features/workspaces/components/workspace-switcher";
import DottedSeparator from "./dotted-separator";
import Logo from "./logo";
import Navigation from "./navigation";
import Projects from "./projects";

const Sidebar = () => {
  return (
    <aside className="h-full bg-sidebar p-4 w-full">
      <Logo />
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};

export default Sidebar;
