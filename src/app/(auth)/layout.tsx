"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "@/components/logo";
import PageTransitionWrapper from "@/components/page-transition-wrapper";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathName = usePathname();

  const isSignUp = pathName === "/sign-up";

  return (
    <main className="min-h-screen ">
      <div className="max-w-screen-2xl mx-auto p-2 sm:p-4 flex flex-col min-h-screen ">
        <nav className="flex justify-between items-center">
          <Logo />
          <Button asChild variant="secondary">
            <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
              {isSignUp ? "Войти" : "Зарегистрироваться"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center py-4 sm:py-14 m-auto">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
