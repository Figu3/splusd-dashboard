import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TVLHistoryPoint } from '../types';
import { TrendingUp } from 'lucide-react';
import { MetricCard } from './ui/MetricCard';
import { formatChartValue } from '../utils/format';

interface TVLHistoryChartProps {
  history: TVLHistoryPoint[];
}

export const TVLHistoryChart = ({ history }: TVLHistoryChartProps) => {
  // Prepare data for chart
  const chartData = history.map(point => ({
    time: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    tvl: parseFloat(point.tvlRaw) / 1e18, // Convert to actual number for chart
    displayTVL: point.tvl
  }));

  // Calculate trend
  const firstTVL = chartData.length > 0 ? chartData[0].tvl : 0;
  const lastTVL = chartData.length > 0 ? chartData[chartData.length - 1].tvl : 0;
  const percentageChange = firstTVL > 0 ? ((lastTVL - firstTVL) / firstTVL) * 100 : 0;
  const isPositive = percentageChange >= 0;

  return (
    <MetricCard title="TVL Evolution" icon={TrendingUp}>
      {chartData.length > 1 && (
        <div className={`mb-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg ${
          isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <span className="text-sm font-semibold">
            {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
          </span>
          <span className="text-xs opacity-80">since tracking</span>
        </div>
      )}

      {chartData.length < 2 ? (
        <div className="h-48 flex items-center justify-center text-gray-400">
          <p className="text-sm">Collecting data... Check back soon</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={false}
              tickFormatter={formatChartValue}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f35',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(value: number) => [formatChartValue(value), 'TVL']}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Line
              type="monotone"
              dataKey="tvl"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </MetricCard>
  );
};
