'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { month: 'January', Wins: 5, Losses: 30 },
  { month: 'February', Wins: 22, Losses: 50 },
  { month: 'March', Wins: 237, Losses: 20 },
  { month: 'April', Wins: 73, Losses: 190 },
  { month: 'May', Wins: 209, Losses: 130 },
  { month: 'June', Wins: 214, Losses: 140 },
];

const chartConfig = {
  Wins: {
    label: 'Wins',
    color: 'hsl(var(--chart-1))',
  },
  Losses: {
    label: 'Losses',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const ChartLine = () => {
  return (
    <div className="w-[500px] h-[300px] ">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
              dataKey="Wins"
              type="monotone"
              stroke="var(--color-Wins)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="Losses"
              type="monotone"
              stroke="var(--color-Losses)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
    </div>
  );
};
