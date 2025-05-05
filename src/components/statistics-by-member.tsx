import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { WorkspaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";

const chartConfig = {
    taskCount: {
        label: "Задач",
    },
} satisfies ChartConfig


type WorkspaceTaskStatisticResponseTypeProps = {
    data: WorkspaceAnalyticsResponseType["data"];
    isLoading?: boolean
};



export function TasksByMembers({ data, isLoading }: WorkspaceTaskStatisticResponseTypeProps) {
    const statistic = data.memberTaskArray;
    let maxMember = null;
    if (statistic.length > 0) {
        maxMember = statistic.reduce((max, current) =>
            current.taskCount > max.taskCount ? current : max
        );
    }

    const hasData = statistic.length != 0


    const message = maxMember
        ? `У участника ${maxMember.memberName} больше всего задач: ${maxMember.taskCount}${maxMember.taskCount > 15 ? ', возможно ему стоит отдохнуть?' : ''}`
        : '';

    if (isLoading)
        return null

    return (
        <Card className="flex flex-col h-full justify-between col-span-2">
            <CardHeader>
                <CardTitle>Задачи участников</CardTitle>
                <CardDescription>Показано сколько задач у пользователя</CardDescription>
            </CardHeader>
            <CardContent className="flex h-full">
                <ChartContainer config={chartConfig} className="w-full my-auto max-h-[250px] relative">
                    {!hasData ? (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-base">
                            Нет данных
                        </div>
                    ) : (
                        <BarChart accessibilityLayer data={statistic}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="memberName"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="taskCount" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    )}
                </ChartContainer>
            </CardContent>
            {hasData
                &&
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        {message}
                    </div>
                </CardFooter>
            }
        </Card>
    )
}


