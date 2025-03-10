import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import ProjectIdClientSettingsPage from "./client";

const ProjectIdSettingsPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-2xl">
      <ProjectIdClientSettingsPage />
    </div>
  );
};

export default ProjectIdSettingsPage;
