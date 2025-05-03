"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiAddCircleFill } from "react-icons/ri";
import { useCreateWorkspaceModel } from "../hooks/use-create-workspace-model";
import WorkspaceAvatar from "./workspace-avatar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkspaceSwitcher = ({
  workspaces,
  workspaceId
}:
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workspaces: any;
    workspaceId: string
  }) => {

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

          {Number(workspaces?.documents.length ?? 0) > 0 &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            workspaces?.documents?.map((workspace: any) => (
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
          {!workspaces?.documents.length && (
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
