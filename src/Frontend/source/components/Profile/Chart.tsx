"use client";
/* eslint-disable tailwindcss/no-custom-classname */
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Statistics } from "@/context/GlobalContext";

const chartConfig = {
  visitors: {
    label: "Game",
  },
  chrome: {
    label: "Earth",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Ice",
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

export const Chart = ({
  total_games,
  stats,
}: {
  total_games: number;
  stats: Statistics;
}) => {
  if (
    !stats?.earth_ratio &&
    !stats?.air_ratio &&
    !stats?.water_ratio &&
    !stats?.fire_ratio
  ) {
    return (
      <div className="flex size-full items-center justify-center">
        <h1 className="font-dayson text-lg font-bold text-white 2xl:text-2xl">
          No data available
        </h1>
      </div>
    );
  }
  const chartData = [
    {
      browser: "Earth",
      visitors: stats?.earth_ratio,
      fill: "var(--color-chrome)",
    },
    { browser: "Ice", visitors: stats?.air_ratio, fill: "var(--color-safari)" },
    {
      browser: "Water",
      visitors: stats?.water_ratio,
      fill: "var(--color-firefox)",
    },
    { browser: "Fire", visitors: stats?.fire_ratio, fill: "var(--color-edge)" },
  ];

  return (
    <div className="flex size-full items-start justify-start">
      <div className="flex size-full items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="aspect-square mx-auto size-full max-h-[250px]"
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
              innerRadius={40}
              strokeWidth={80}
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
                          className="fill-foreground text-3xl font-bold text-white"
                        >
                          {total_games}
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
