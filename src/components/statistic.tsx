
import { WorkspaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";
import Analytics from "./analytics";
import { TasksByMembers } from "./statistics-by-member";
import { TasksByMonth } from "./statistics-by-month";
import { TasksByStatus } from "./statistics-by-status";
import { motion } from "framer-motion";
import { Skeleton } from "./ui/skeleton";
import { useMemo } from "react";


type StatisticResponseTypeProps = {
    data: WorkspaceAnalyticsResponseType["data"];
    isLoading?: boolean
};

export function Statistic({ data, isLoading }: StatisticResponseTypeProps) {

    const dateRange = useMemo(() => {
        if (data?.taskStatistics.length === 0 || isLoading) return '';
        return `${data.taskStatistics[0].month} - ${data.taskStatistics[data.taskStatistics.length - 1].month} ${new Date().getFullYear()}`;
    }, [data?.taskStatistics,isLoading]);


    if (isLoading)
        return (
            <div className="h-full flex flex-col gap-2 lg:gap-4">
                <Skeleton className="rounded-lg w-full whitespace-nowrap shrink-0 h-[120px]" />
                <div className=" grid flex-1 scroll-mt-20 items-start gap-2 lg:gap-4 grid-cols-1 lg:grid-cols-2 min-[1780px]:grid-cols-5 [grid-auto-rows:1fr]">
                    <Skeleton className="col-span-1 min-[1780px]:col-span-2 order-0 h-[300px]" />
                    <Skeleton className="col-span-1 lg:col-span-2 min-[1780px]:col-span-2 order-1 lg:order-2 min-[1780px]:order-1 h-[300px]" />
                    <Skeleton className="col-span-1 order-2 lg:order-1 min-[1780px]:order-2 h-[300px]" />
                </div>
            </div>
        )

    return (
        <div className="h-full flex flex-col gap-2 lg:gap-4">
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="border rounded-lg w-full whitespace-nowrap shrink-0"
            >
                <Analytics data={data} isLoading={isLoading} />
            </motion.div>
            <div className=" grid flex-1 scroll-mt-20 items-start gap-2 lg:gap-4 grid-cols-1 lg:grid-cols-2 min-[1780px]:grid-cols-5 [grid-auto-rows:1fr]">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full col-span-1 min-[1780px]:col-span-2 order-0"
                >
                    <TasksByMonth data={data} isLoading={isLoading} dateRange={dateRange} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="h-full col-span-1 lg:col-span-2 min-[1780px]:col-span-2 order-1 lg:order-2 min-[1780px]:order-1"
                >
                    <TasksByMembers data={data} isLoading={isLoading} dateRange={dateRange} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="h-full col-span-1 order-2 lg:order-1 min-[1780px]:order-2"
                >
                    <TasksByStatus data={data} isLoading={isLoading} dateRange={dateRange} />
                </motion.div>
            </div>
        </div>
    )
}
