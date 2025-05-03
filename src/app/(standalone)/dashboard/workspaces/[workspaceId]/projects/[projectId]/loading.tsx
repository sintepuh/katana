"use client";

const StandaloneLoadingPage = () => {
  return (
    <div className="w-full lg:max-w-2xl">
      <div className="flex flex-col gap-y-4">
        <div className="animate-pulse bg-skeleton rounded-xl border w-full border-none shadow-none h-[450px]" />
        <div className="animate-pulse bg-skeleton rounded-xl border w-full border-none shadow-none h-[120px]" />
      </div>
    </div>
  );
};

export default StandaloneLoadingPage;
