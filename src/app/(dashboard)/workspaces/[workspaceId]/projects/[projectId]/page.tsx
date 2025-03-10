import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries";
import ProjectIdClient from "./client";

const ProjectIdPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <ProjectIdClient />;
};

export default ProjectIdPage;
