import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import TaskIdClient from "./client";

const TaskIdPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <TaskIdClient />;
};

export default TaskIdPage;
