import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { useMemo } from "react";
import { WorkspaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";

const chartConfig = {
    taskCount: {
        label: "Задач",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig



type WorkspaceTaskStatisticResponseTypeProps = {
    data: WorkspaceAnalyticsResponseType["data"];
    isLoading?: boolean
};

const dada = [
    {
        month: 'Март',
        taskCount: 2
    },
    {
        month: 'Апрель',
        taskCount: 3
    },
    {
        month: 'Май',
        taskCount: 5
    },
    {
        month: 'Июнь',
        taskCount: 3
    },
    {
        month: 'Июль',
        taskCount: 3
    },

]

export function TasksByMonth({ data, isLoading }: WorkspaceTaskStatisticResponseTypeProps) {

    const statistic = data.taskStatistics;

    const hasData = statistic.some((item) => item.taskCount > 0);

    const current = statistic[2];
    const previous = statistic[1];

    let percentageChangeText = 'Количество задач стало ';
    const trendUp = current.taskCount - previous.taskCount >= 0;

    if (previous.taskCount === 0) {
        percentageChangeText = "Нет данных для сравнения";
    } else {
        const diff = current.taskCount - previous.taskCount;
        const percentage = ((diff / previous.taskCount) * 100).toFixed(0);
        percentageChangeText += `${trendUp ? "больше" : "меньше"} на ${percentage}% чем за ${current.month}`;
    }


    const dateRange = useMemo(() => {
        if (statistic.length === 0) return '';
        return `${statistic[0].month} - ${statistic[statistic.length - 1].month} ${new Date().getFullYear()}`;
    }, [statistic]);


    if (isLoading)
        return null

    return (
        <Card className="flex flex-col h-full justify-between col-span-2">
            <CardHeader>
                <CardTitle>Задач в месяце</CardTitle>
                <CardDescription>
                    Показано количество задач за 5 месяцев
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="relative">
                    {!hasData ? (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-base">
                            Нет данных
                        </div>
                    ) : (
                        <AreaChart
                            accessibilityLayer
                            data={dada}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                interval={0}
                                tickFormatter={(value) => value.length > 3 ? value.slice(0, 3) : value}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Area
                                dataKey="taskCount"
                                type="step"
                                fill="var(--chart-2)"
                                fillOpacity={0.4}
                                stroke="var(--chart-2)"
                            />
                        </AreaChart>
                    )}
                </ChartContainer>
            </CardContent>
            {hasData
                &&
                <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                {percentageChangeText}
                                {previous.taskCount > 0 &&
                                    (trendUp ? (
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                    ))}
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                {dateRange}
                            </div>
                        </div>
                    </div>
                </CardFooter>
            }
        </Card>
    )
}
