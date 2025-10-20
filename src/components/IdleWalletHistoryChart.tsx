import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { IdleWalletHistoryPoint } from '../types';
import { TrendingDown, TrendingUp, Activity } from 'lucide-react';

interface IdleWalletHistoryChartProps {
  history: IdleWalletHistoryPoint[];
}

export const IdleWalletHistoryChart = ({ history }: IdleWalletHistoryChartProps) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-plasma-dark-light rounded-lg p-6 shadow-lg border border-plasma-border">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-plasma-accent" />
          <h2 className="text-xl font-semibold text-white">Idle Wallets % Over Time</h2>
        </div>
        <div className="text-center py-12 text-gray-400">
          <p>Historical data is being collected...</p>
          <p className="text-sm mt-2">Data points are recorded every 5 minutes</p>
        </div>
      </div>
    );
  }

  // Format data for the chart
  const chartData = history.map(point => ({
    ...point,
    displayDate: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  // Calculate trend
  const firstPoint = history[0]?.percentage || 0;
  const lastPoint = history[history.length - 1]?.percentage || 0;
  const change = lastPoint - firstPoint;
  const changePercent = firstPoint !== 0 ? (change / firstPoint) * 100 : 0;

  // Calculate min and max for better Y-axis scaling
  const percentages = history.map(p => p.percentage);
  const minPercentage = Math.min(...percentages);
  const maxPercentage = Math.max(...percentages);
  const padding = (maxPercentage - minPercentage) * 0.1 || 5;

  return (
    <div className="bg-plasma-dark-light rounded-lg p-6 shadow-lg border border-plasma-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-plasma-accent" />
          <h2 className="text-xl font-semibold text-white">Idle Wallets % Since Launch</h2>
        </div>
        <div className="flex items-center gap-2">
          {change >= 0 ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
          <span className="text-gray-400 text-sm">since tracking began</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-plasma-dark p-3 rounded">
          <p className="text-gray-400 text-xs mb-1">Current</p>
          <p className="text-white font-semibold">{lastPoint.toFixed(2)}%</p>
        </div>
        <div className="bg-plasma-dark p-3 rounded">
          <p className="text-gray-400 text-xs mb-1">Peak</p>
          <p className="text-white font-semibold">{maxPercentage.toFixed(2)}%</p>
        </div>
        <div className="bg-plasma-dark p-3 rounded">
          <p className="text-gray-400 text-xs mb-1">Low</p>
          <p className="text-white font-semibold">{minPercentage.toFixed(2)}%</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="displayDate"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            domain={[Math.max(0, minPercentage - padding), maxPercentage + padding]}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Idle Wallets']}
          />
          <Legend
            wrapperStyle={{ color: '#9ca3af' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ fill: '#22d3ee', r: 3 }}
            activeDot={{ r: 5 }}
            name="Idle Wallets %"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center text-gray-500 text-xs">
        <p>Tracking {history.length} data points over {Math.ceil((Date.now() - history[0].timestamp) / (24 * 60 * 60 * 1000))} days</p>
        <p className="mt-1">Data is sampled every 5 minutes and stored locally</p>
      </div>
    </div>
  );
};
