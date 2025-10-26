import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { TokenDistribution } from '../types';
import { getProtocolColor } from '../utils/colors';
import { MetricCard } from './ui/MetricCard';
import { PieChart as PieChartIcon } from 'lucide-react';

interface DistributionChartProps {
  distributions: TokenDistribution[];
}

export const DistributionChart = ({ distributions }: DistributionChartProps) => {
  const chartData = distributions.map(d => ({
    name: d.location,
    value: d.percentage,
    amount: d.amount,
    color: getProtocolColor(d.location),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-plasma-card border border-plasma-border rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold text-sm mb-1">{payload[0].name}</p>
          <p className="text-gray-300 text-xs">
            {payload[0].value.toFixed(2)}%
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {payload[0].payload.amount} splUSD
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <MetricCard title="Distribution Overview" icon={PieChartIcon}>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              // Only show label if percentage is significant
              if (props.value < 3) return '';
              return `${props.name}: ${props.value.toFixed(1)}%`;
            }}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0e1a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </MetricCard>
  );
};
