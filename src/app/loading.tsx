"use client";

import { Loader } from "lucide-react";

const AppLoadingPage = () => {
  return (
    <div className="h-[70dvh] flex items-center justify-center flex-col">
      <Loader className="size-10 animate-spin text-muted-foreground" />
    </div>
  );
};

export default AppLoadingPage;
