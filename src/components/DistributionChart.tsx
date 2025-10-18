import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { TokenDistribution } from '../types';
import { PROTOCOLS } from '../config';

interface DistributionChartProps {
  distributions: TokenDistribution[];
}

export const DistributionChart = ({ distributions }: DistributionChartProps) => {
  const getProtocolColor = (location: string): string => {
    if (location === 'Idle Wallets') return '#6b7280';

    const protocolKey = Object.keys(PROTOCOLS).find(key =>
      PROTOCOLS[key].name === location
    );
    return protocolKey ? PROTOCOLS[protocolKey].color : '#6b7280';
  };

  const chartData = distributions.map(d => ({
    name: d.location,
    value: d.percentage,
    amount: d.amount,
    color: getProtocolColor(d.location),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-plasma-card border border-plasma-border rounded-lg p-3">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p className="text-gray-300 text-sm">
            {payload[0].value.toFixed(2)}% ({payload[0].payload.amount} splUSD)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-plasma-card border border-plasma-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Distribution Overview</h2>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => `${props.name}: ${props.value.toFixed(1)}%`}
            outerRadius={130}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-white">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
