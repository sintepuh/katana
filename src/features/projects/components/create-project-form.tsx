"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import DottedSeparator from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { createProjectSchema, CreateProjectSchemaType } from "../schema";
import { useCreateProject } from "../api/use-create-project";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

type CreateProjectFormProps = {
  onCancel?: () => void;
};

const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const form = useForm<CreateProjectSchemaType>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useCreateProject();
  const workspaceId = useWorkspaceId();

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: CreateProjectSchemaType) => {
    const finalData = {
      ...data,
      image: data.image instanceof File ? data.image : undefined,
      workspaceId,
    };
    mutate(
      { form: finalData },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.()

          router.push(`/dashboard/workspaces/${workspaceId}/projects/${data.$id}`);

          if (inputRef.current) {
            inputRef.current.value = "";
          }
        },
      }
    );
  };

  const handleClearImage = () => {
    form.setValue("image", "");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Максимальный размер 1 МБ");
      return;
    }

    form.setValue("image", file);
  };

  return (
    <Card className="w-full h-full border-none shadow-none !bg-card">
      <CardHeader className="flex p-5 lg:p-7">
        <CardTitle className="font-bold text-xl">Создать проект</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-5 lg:p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                disabled={isPending}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введите название" className="border-border" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-20 relative rounded-md overflow-hidden">
                          <Image
                            fill
                            className="object-cover"
                            src={
                              field.value instanceof Blob
                                ? URL.createObjectURL(
                                  new File([field.value], "image", {
                                    type: field.value.type,
                                  })
                                )
                                : field.value
                            }
                            alt="Иконка проекта"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-20">
                          <AvatarFallback>
                            <ImageIcon className="size-9 text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col text-xs md:text-sm">
                        <p >Иконка проекта</p>
                        <p className="text-muted-foreground">
                          JPG, JPEG, PNG, SVG. Максимальный размер 1 МБ
                        </p>
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isPending}
                          onChange={handleImageChange}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            disabled={isPending}
                            onClick={handleClearImage}
                            size="xs"
                            className="w-fit mt-2"
                            variant="destructive"
                          >
                            Удалить изображение
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isPending}
                            onClick={() => inputRef.current?.click()}
                            size="xs"
                            className="w-fit mt-2"
                          >
                            Загрузить изображение
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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

export default CreateProjectForm;
