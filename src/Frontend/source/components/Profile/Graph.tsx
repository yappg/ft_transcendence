"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Graph() {
  return (
    <Card className="size-full bg-transparent pt-12">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            className="size-full"
            // margin={{
            //   left: 12,
            //   right: 12,
            // }}
          >
            <CartesianGrid className="w-full" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              className="size-1/2"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              className="size-1/2"
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
