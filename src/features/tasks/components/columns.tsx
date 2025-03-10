"use client";

import { MoreVerticalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import TaskDate from "@/features/tasks/components/task-date";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import { Task } from "../types";
import ColumnFilterIcon from "./column-filter-icon";
import { TaskAction } from "./task-action";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ColumnFilterIcon sort={column.getIsSorted()} />
        </Button>
      );
    },

    cell: ({ row }) => {
      return <p className="truncate line-clamp-1">{row.original.name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ColumnFilterIcon sort={column.getIsSorted()} />
        </Button>
      );
    },

    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="flex items-center gap-x-2  font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.imageUrl}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ColumnFilterIcon sort={column.getIsSorted()} />
        </Button>
      );
    },

    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className="flex items-center gap-x-2  font-medium">
          <MemberAvatar
            fallbackClassName="text-xs"
            className="size-6"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ColumnFilterIcon sort={column.getIsSorted()} />
        </Button>
      );
    },

    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ColumnFilterIcon sort={column.getIsSorted()} />
        </Button>
      );
    },

    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;
    
      return <TaskAction id={id} projectId={projectId}>
        <Button variant="ghost" className="size-8 p-0">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </TaskAction>;
    
    },
  }
];
