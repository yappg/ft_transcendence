"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { browser: "Earth", visitors: 30, fill: "var(--color-chrome)" },
  { browser: "Air", visitors: 20, fill: "var(--color-safari)" },
  { browser: "Water", visitors: 5, fill: "var(--color-firefox)" },
  { browser: "Fire", visitors: 11, fill: "var(--color-edge)" },
];

const chartConfig = {
  visitors: {
    label: "Game",
  },
  chrome: {
    label: "Earth",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Air",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Water",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Fire",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export const Chart = () => {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="flex items-start justify-start w-[300px] h-[300px]">
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Game
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};
