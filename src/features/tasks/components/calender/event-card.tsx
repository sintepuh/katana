import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

import MemberAvatar from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

import { TaskStatus } from "../../types";

type EventCardProps = {
  title: string;
  project: Project;
  assignee: Member;
  id: string;
  status: TaskStatus;
};

const statusColorsMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};

const EventCard = ({
  assignee,
  id,
  project,
  status,
  title,
}: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/dashboard/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2 ">
      <div
        onClick={onClick}
        className={cn(
          "p-1.5 text-xs bg-card border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition min-w-[100px]",
          statusColorsMap[status]
        )}
      >
        {/* Заголовок с обрезанием текста */}
        <p className="truncate">{title}</p>

        <div className="flex items-center gap-x-1">
          <MemberAvatar avatarUrl={assignee.imageUrl} name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project?.name} image={project?.imageUrl} />

          {/* Название проекта с обрезанием текста */}
          <p className="truncate flex-1 min-w-0">{project?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
