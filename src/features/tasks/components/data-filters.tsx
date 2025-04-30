import { ListCheckIcon, UserIcon } from "lucide-react";

import DatePicker from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import MemberAvatar from "@/features/members/components/member-avatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useTaskFilter } from "../hooks/use-task-filter";
import { TaskStatus } from "../types";
import { formatTaskStatus } from "./create-task-form";

type DataFiltersProps = {
  hideProjectFilter?: boolean;
};

const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects } = useGetProjects({
    workspaceId,
  });
  const { data: members } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const membersOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const [{ projectId, assigneeId, dueDate, status }, setFilters] =
    useTaskFilter();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onValueChange = (
    key: "projectId" | "assigneeId" | "search",
    value: string
  ) => {
    setFilters({ [key]: value === "all" ? null : (value as string) });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select onValueChange={onStatusChange} defaultValue={status ?? undefined}>
        <SelectTrigger className="w-full lg:w-auto h-8 border-border">
          <div className="flex items-center pr-2 ">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectSeparator />
          {Object.values(TaskStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {formatTaskStatus(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => onValueChange("assigneeId", value)}
        defaultValue={assigneeId ?? undefined}
      >
        <SelectTrigger className="w-full lg:w-auto h-8 border-border">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {membersOptions?.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              <div className="flex items-center gap-x-2">
                <MemberAvatar name={member.name} />
                {member.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          onValueChange={(value) => onValueChange("projectId", value)}
          defaultValue={projectId ?? undefined}
        >
          <SelectTrigger className="w-full lg:w-auto h-8 border-border">
            <div className="flex items-center pr-2">
              <ListCheckIcon className="size-4 mr-2" />
              <SelectValue placeholder="All Projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Due Date"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(value) =>
          setFilters({ dueDate: value ? value.toISOString() : null })
        }
        className="h-8 w-full lg:w-auto border-border"
      />
    </div>
  );
};

export default DataFilters;
