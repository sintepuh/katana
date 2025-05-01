"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateProfileSchemaType, updateProfileSchema } from '../schemas'
import { useUpdateProfile } from "../api/use-update-profile";

type UpdateProfileFormProps = {
  onCancel?: () => void;
};

function removeUndefined(obj: any) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
  );
}

const UpdateProfileForm = ({ onCancel }: UpdateProfileFormProps) => {
  const form = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const { mutate, isPending } = useUpdateProfile();

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: UpdateProfileSchemaType) => {
    const finalData = removeUndefined({
      ...data,
      image: data.image instanceof File ? data.image : undefined
    });
    mutate(
      { form: finalData },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.()
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check if file is more than 1MB
    if (file.size > 1024 * 1024) {
      toast.error("File size should not exceed 1MB");
      return;
    }

    form.setValue("image", file);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="font-bold text-xl">Update Profile</CardTitle>
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter profile name" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                disabled={isPending}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Новый пароль</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter password" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                disabled={isPending}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Старый пароль</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter password" />
                    </FormControl>
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
                            alt="Workspace Icon"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-20">
                          <AvatarFallback>
                            <ImageIcon className="size-9 text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col">
                        <p className="text-sm">Profile Avatar</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, JPEG, PNG, SVG. Max size of 1MB
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
                            onClick={() => {
                              form.setValue("image", "");
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                            size="xs"
                            className="w-fit mt-2"
                            variant="destructive"
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isPending}
                            onClick={() => inputRef.current?.click()}
                            size="xs"
                            className="w-fit mt-2"
                            variant="tertiary"
                          >
                            Upload Image
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
                Update Profile
              </Button>

              {onCancel && (
                <Button
                  disabled={isPending}
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfileForm;
