import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TVLHistoryPoint } from '../types';
import { TrendingUp } from 'lucide-react';

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
    <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-plasma-accent" />
          <h3 className="text-xl font-semibold text-white">Total Value Locked Evolution</h3>
        </div>
        {chartData.length > 1 && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
            isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <span className="text-sm font-semibold">
              {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {chartData.length < 2 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Collecting TVL data... Check back in a few minutes.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
                return value.toFixed(0);
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => {
                if (value >= 1_000_000) return [`${(value / 1_000_000).toFixed(2)}M`, 'TVL'];
                if (value >= 1_000) return [`${(value / 1_000).toFixed(2)}K`, 'TVL'];
                return [value.toFixed(2), 'TVL'];
              }}
            />
            <Legend
              wrapperStyle={{ color: '#9ca3af' }}
              formatter={() => 'Total Value Locked'}
            />
            <Line
              type="monotone"
              dataKey="tvl"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 3 }}
              activeDot={{ r: 5 }}
              name="TVL"
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="mt-4 text-sm text-gray-400">
        <p>Current TVL: <span className="text-white font-semibold">{chartData[chartData.length - 1]?.displayTVL || 'N/A'}</span></p>
        {chartData.length > 1 && (
          <p className="mt-1">
            Period: {chartData[0].time} - {chartData[chartData.length - 1].time}
          </p>
        )}
      </div>
    </div>
  );
};
