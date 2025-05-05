import { PlusIcon } from "lucide-react";
import Link from "next/link";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useCreateProjectModel } from "@/features/projects/hooks/use-create-project-model";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type ProjectListProps = {
  data?: Project[];
  total?: number;
  isLoading?: boolean
};

const ProjectList = ({ data, total, isLoading }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModel();

  const workspaceId = useWorkspaceId();

  if (!data || isLoading) {
    return <Skeleton className="bg-card rounded-lg p-4 h-[280px]" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="flex flex-col gap-y-4 col-span-1"
    >
      <div className="bg-card border rounded-lg p-4 shadow">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Проекты ({total})</p>
          <Button variant="secondary" size="icon" onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>

        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id} className="">
              <Link href={`/dashboard/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            Проектов не найденно.
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ProjectList;
