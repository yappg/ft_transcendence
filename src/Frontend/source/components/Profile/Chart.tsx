"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


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
  statistics,
} : {
  total_games?: number;
  statistics?: {
    earth_ratio: number;
    fire_ratio: number;
    water_ratio: number;
    ice_ratio: number;
    graph_data: {
      date: string;
      wins: number;
      losses: number;
    }[];
  };
}) => {
  console.log(statistics, total_games);
  if (!statistics?.earth_ratio && !statistics?.ice_ratio && !statistics?.water_ratio && !statistics?.fire_ratio) {
    return <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-2xl font-bold font-dayson text-white">No data available</h1>
    </div>;
  }
  const chartData = [
    { browser: "Earth", visitors:  statistics?.earth_ratio , fill: "var(--color-chrome)" },
    { browser: "Ice", visitors:  statistics?.ice_ratio , fill: "var(--color-safari)" },
    { browser: "Water", visitors:  statistics?.water_ratio , fill: "var(--color-firefox)" },
    { browser: "Fire", visitors:  statistics?.fire_ratio , fill: "var(--color-edge)" },
  ];

  return (
    <div className="flex items-start justify-start w-[50%] h-[300px]">
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
