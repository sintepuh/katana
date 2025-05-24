import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { WorkspaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";


const formatTaskStatus = (status: string) => {
    return status
        .replace("_", " ")
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};


const chartConfig = {
    count: {
        label: "Задач",
    },
    TODO: {
        label: `${formatTaskStatus("TODO")}`,
        color: "--chart-1",
    },
    IN_PROGRESS: {
        label: `${formatTaskStatus("IN_PROGRESS")}`,
        color: "hsl(var(--chart-2))",
    },
    IN_REVIEW: {
        label: `${formatTaskStatus("IN_REVIEW")}`,
        color: "hsl(var(--chart-3))",
    },
    DONE: {
        label: `${formatTaskStatus("DONE")}`,
        color: "hsl(var(--chart-4))",
    },
    BACKLOG: {
        label: `${formatTaskStatus("BACKLOG")}`,
        color: "hsl(var(--chart-4))",
    }
} satisfies ChartConfig


type WorkspaceTaskStatisticResponseTypeProps = {
    data: WorkspaceAnalyticsResponseType["data"];
    isLoading?: boolean
    dateRange: string
};


export function TasksByStatus({ data, isLoading, dateRange }: WorkspaceTaskStatisticResponseTypeProps) {
    const statistic = data.taskStatusCounts;
    const hasData = statistic.some((item) => item.count > 0);

    let maxStatus = null;
    if (statistic.length > 0) {
        maxStatus = statistic.reduce((max, current) =>
            current.count > max.count ? current : max
        );
    }

    const message = maxStatus
        ? `Больше всего задач с статусом ${maxStatus.status}: ${maxStatus.count}`
        : '';

    if (isLoading)
        return null

    return (
        <Card className="flex flex-col h-full justify-between min-w-[280px]">
            <CardHeader className=" pb-0">
                <CardTitle>Статусы задач</CardTitle>
                <CardDescription>Показано сколько задач находяться в работе</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto relative"
                >
                    {!hasData ? (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-base">
                            Нет данных
                        </div>
                    ) : (
                        <RadarChart data={statistic}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <PolarAngleAxis dataKey="status" />
                            <PolarGrid />
                            <Radar
                                dataKey="count"
                                fill="var(--chart-2)"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    )}
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                {hasData
                    &&
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {message}
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {dateRange}

                        </div>
                    </div>
                }

            </CardFooter>
        </Card >
    )
}
