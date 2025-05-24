"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub, FaYandex } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/api/use-login";
import { type LoginSchema, loginSchema } from "@/features/auth/schemas";
import { signUpWithGithub, signUpWithGoogle, signUpWithYandex } from "@/lib/server/oauth";

const SignInCard = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = (data: LoginSchema) => {
    mutate({ json: data });
  };

  return (
    <Card className="w-full h-full md:w-[490px] border shadow-none ">
      <CardHeader className=" flex items-center justify-center text-center p-5 lg:p-7">
        <CardTitle className="text-2xl">Добро пожаловать!</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-5 lg:p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Введите почту" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Введите пароль"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              Войти
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-5 lg:p-7 flex flex-col gap-y-4">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => signUpWithGoogle()}
          disabled={isPending}
        >
          <FcGoogle className="mr-2 size-5" />
          Войти через Google
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => signUpWithGithub()}
          disabled={isPending}
        >
          <FaGithub className="mr-2 size-5" />
          Войти через Github
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => signUpWithYandex()}
          disabled={isPending}
        >
          <FaYandex className="mr-2 size-5" />

          Войти через Яндекс
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardFooter className="p-5 lg:p-7 flex items-center justify-center">
        <p>
          Нет аккаунта?{" "}
          <Link href="/sign-up" className="text-primary">
            Зарегистрироваться
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInCard;
