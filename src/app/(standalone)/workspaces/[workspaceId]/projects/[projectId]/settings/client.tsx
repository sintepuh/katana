"use client";

import PageLoader from "@/components/page-loader";
import { useGetProject } from "@/features/projects/api/use-get-project";
import DeleteProjectForm from "@/features/projects/components/delete-project-form";
import EditProjectForm from "@/features/projects/components/edit-project-form";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

const ProjectIdClientSettingsPage = () => {
  const projectId = useProjectId();
  const { data: initialValue, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValue) throw new Error("Project not found");

  return (
    <div className="flex flex-col gap-y-4">
      <EditProjectForm initialValues={initialValue} />
      <DeleteProjectForm projectId={projectId} />
    </div>
  );
};

export default ProjectIdClientSettingsPage;
