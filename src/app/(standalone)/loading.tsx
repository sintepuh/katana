"use client";

import { Loader } from "lucide-react";

const StandaloneLoadingPage = () => {
  return (
    <div className="h-[calc(80dvh)] flex items-center justify-center flex-col">
      <Loader className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default StandaloneLoadingPage;
