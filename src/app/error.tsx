"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-3">
      <AlertTriangle className="size-10" />
      <p className="text-sm">Something went wrong</p>
      <Button variant="secondary" size="sm" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
