"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import DatePicker from "@/components/date-picker";

import { useCreateTask } from "../api/use-create-task";
import { createTaskSchema, CreateTaskSchemaType } from "../schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MemberAvatar from "@/features/members/components/member-avatar";
import { TaskStatus } from "../types";
import ProjectAvatar from "@/features/projects/components/project-avatar";

type CreateTaskFormProps = {
  onCancel?: () => void;
  projectOptions: {
    id: string;
    name: string;
    imageUrl?: string;
  }[];
  membersOptions: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
};

export const formatTaskStatus = (status: TaskStatus) => {
  return status
    .replace("_", " ")
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CreateTaskForm = ({
  onCancel,
  membersOptions,
  projectOptions,
}: CreateTaskFormProps) => {
  const { mutate, isPending } = useCreateTask();
  const workspaceId = useWorkspaceId();
  const form = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId,
      dueDate: new Date()
    },
  });

  const onSubmit = (data: CreateTaskSchemaType) => {
    mutate(
      {
        json: {
          ...data,
          workspaceId,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.()
        },
      }
    );
  };



  return (
    <Card className="!bg-card overflow-y-auto hide-scrollbar w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="font-bold text-xl">Создать задачу</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                disabled={isPending}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Навание</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введите название" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                disabled={isPending}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Срок выполнения</FormLabel>
                    <FormControl>
                      <DatePicker className={'min-h-[48px]'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                disabled={isPending}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ответственный</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите ответственного" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {membersOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar avatarUrl={member.imageUrl} name={member.name} />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={isPending}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {Object.values(TaskStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {formatTaskStatus(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={isPending}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Проект</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите проект" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                image={project.imageUrl}
                                name={project.name}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-between flex-row-reverse">
              <Button disabled={isPending} size="lg">
                Создать
              </Button>

              {onCancel && (
                <Button
                  disabled={isPending}
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={onCancel}
                >
                  Отмена
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm;
