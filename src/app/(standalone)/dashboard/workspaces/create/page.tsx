import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";

const WorkspaceCreatePage =  async () => {
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
