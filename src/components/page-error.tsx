"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type PageErrorProps = {
  message?: string;
  reset?: () => void;
};

const PageError = ({
  message = "Something went wrong",
  reset,
}: PageErrorProps) => {
  return (
    <div className="h-[75vh] flex items-center justify-center flex-col gap-3">
      <AlertTriangle className="size-8" />
      <p className="text-sm">{message}</p>
      <div className="flex gap-2">
        {reset && (
          <Button variant="outline" size="sm" onClick={() => reset()}>
            <Link href="/">Try Again</Link>
          </Button>
        )}
        <Button variant="tertiary" size="sm" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default PageError;
