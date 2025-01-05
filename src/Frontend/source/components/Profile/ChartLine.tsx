'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Statistics } from '@/context/GlobalContext';

const chartConfig = {
  Wins: {
    label: 'Wins',
    color: 'hsl(var(--chart-2))',
  },
  Losses: {
    label: 'Losses',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export const ChartLine = ({ statistics }: { statistics: Statistics }) => {
  // if (!statistics?.graph_data[0].wins && !statistics?.graph_data[0].losses && !statistics?.graph_data[1].wins && !statistics?.graph_data[1].losses && !statistics?.graph_data[2].wins && !statistics?.graph_data[2].losses && !statistics?.graph_data[3].wins && !statistics?.graph_data[3].losses && !statistics?.graph_data[4].wins && !statistics?.graph_data[4].losses && !statistics?.graph_data[5].wins && !statistics?.graph_data[5].losses && !statistics?.graph_data[6].wins && !statistics?.graph_data[6].losses) {
  //   return <div className="w-full h-full flex items-center justify-center">
  //     <h1 className="text-2xl font-bold font-dayson text-white">No data available</h1>
  //   </div>;
  // }
  const chartData = [
    {
      day: 'Monday',
      Wins: statistics?.graph_data[0]?.wins,
      Losses: statistics?.graph_data[0]?.losses,
    },
    {
      day: 'Tuesday',
      Wins: statistics?.graph_data[1]?.wins,
      Losses: statistics?.graph_data[1]?.losses,
    },
    {
      day: 'Wednesday',
      Wins: statistics?.graph_data[2]?.wins,
      Losses: statistics?.graph_data[2]?.losses,
    },
    {
      day: 'Thursday',
      Wins: statistics?.graph_data[3]?.wins,
      Losses: statistics?.graph_data[3]?.losses,
    },
    {
      day: 'Friday',
      Wins: statistics?.graph_data[4]?.wins,
      Losses: statistics?.graph_data[4]?.losses,
    },
    {
      day: 'Saturday',
      Wins: statistics?.graph_data[5]?.wins,
      Losses: statistics?.graph_data[5]?.losses,
    },
    {
      day: 'Sunday',
      Wins: statistics?.graph_data[6]?.wins,
      Losses: statistics?.graph_data[6]?.losses,
    },
  ];
  return (
    <div className="flex size-full items-center justify-center p-0">
      <ChartContainer className="size-[90%]" config={chartConfig}>
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
            dataKey="day"
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
