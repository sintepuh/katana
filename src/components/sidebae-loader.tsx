"use client";

import { Skeleton } from "@/components/ui/skeleton";
import DottedSeparator from "./dotted-separator";
import Logo from "./logo";
import { routes } from "./navigation";

const SidebarLoader = () => {
    return (
        <aside className="h-full bg-sidebar p-4 w-full border-r border-border">
            <Logo />
            <DottedSeparator className="my-4" />
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[160px]" />
                    <Skeleton
                        className="size-5 !rounded-full"
                    />
                </div>
                < Skeleton className="w-full font-medium h-12" />
            </div>
            <DottedSeparator className="my-4" />
            <ul className="flex flex-col gap-3">
                <ul className="flex flex-col gap-3">
                    {routes.map((route, index) => {
                        const widths = ['w-[250px]', 'w-[80px]', 'w-[130px]', 'w-[125px]'];
                        const widthClass = widths[index % widths.length];
                        return (
                            <div key={route.label} className="flex items-center gap-2.5 p-2.5 rounded-md">
                                <Skeleton className="size-5" />
                                <Skeleton className={`h-5 ${widthClass}`} />
                            </div>
                        );
                    })}
                </ul>
            </ul>
            <DottedSeparator className="my-4" />
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton
                        className="size-5 !rounded-full"
                    />
                </div>
                < Skeleton className="w-full font-medium h-12" />
                <Skeleton className="h-[44px] w-full" />
                <Skeleton className="h-[44px] w-full" />
                <Skeleton className="h-[44px] w-full" />
            </div>
        </aside>
    );
};

export default SidebarLoader;
