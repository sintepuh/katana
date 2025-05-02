"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "@/components/logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathName = usePathname();

  const isSignUp = pathName === "/sign-up";

  return (
    <main className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto  p-4">
        <nav className="flex justify-between items-center">
          <Logo />
          <Button asChild variant="secondary">
            <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
              {isSignUp ? "Войти" : "Зарегистрироваться"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
