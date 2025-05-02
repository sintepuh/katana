"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useCreateWorkspaceModel } from "../hooks/use-create-workspace-model";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import WorkspaceAvatar from "./workspace-avatar";

const WorkspaceSwitcher = () => {
  const { data: workspaces, isLoading } = useGetWorkspaces();
  const workspaceId = useWorkspaceId();
  const { open } = useCreateWorkspaceModel();

  const router = useRouter();

  const onSelect = (value: string) => {
    if (value !== "none") {
      router.push(`/dashboard/workspaces/${value}`);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Рабочие пространства</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 hover:opacity-75 transition cursor-pointer"
        />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {isLoading && (
            <SelectItem disabled value="none">
              <div className="flex text-neutral-700">
                <Loader2 className="mr-2 animate-spin size-5" /> Загрузка...
              </div>
            </SelectItem>
          )}
          {!isLoading &&
            Number(workspaces?.documents.length ?? 0) > 0 &&
            workspaces?.documents?.map((workspace) => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
          {!isLoading && !workspaces?.documents.length && (
            <SelectItem disabled value="none">
              <span>У вас рабочих пространств.</span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
