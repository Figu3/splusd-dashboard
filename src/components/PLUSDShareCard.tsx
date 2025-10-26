import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import type { PLUSDShareData } from '../types';
import { Wallet } from 'lucide-react';

interface PLUSDShareCardProps {
  plusdShare: PLUSDShareData;
}

export const PLUSDShareCard = ({ plusdShare }: PLUSDShareCardProps) => {
  const { plusdInSplUSD, totalSplUSD, percentage } = plusdShare;

  // Prepare data for pie chart
  const chartData = [
    {
      name: 'plUSD',
      value: percentage,
      color: '#8b5cf6'
    },
    {
      name: 'Other Assets',
      value: 100 - percentage,
      color: '#374151'
    }
  ];

  return (
    <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-plasma-accent" />
        <h3 className="text-xl font-semibold text-white">plUSD Share in splUSD</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-plasma-dark/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">plUSD in splUSD</p>
            <p className="text-2xl font-bold text-white">{plusdInSplUSD}</p>
          </div>

          <div className="bg-plasma-dark/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Total splUSD Supply</p>
            <p className="text-2xl font-bold text-white">{totalSplUSD}</p>
          </div>

          <div className="bg-gradient-to-r from-plasma-accent/20 to-purple-500/20 rounded-lg p-4 border border-plasma-accent/30">
            <p className="text-sm text-gray-400 mb-1">plUSD Share</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-plasma-accent">{percentage.toFixed(2)}%</p>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <p>plUSD Token: <a
              href={`https://plasmascan.to/token/0xf91c31299E998C5127Bc5F11e4a657FC0cF358CD`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-plasma-accent hover:underline"
            >
              0xf91c...358CD
            </a></p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: PieLabelRenderProps) => {
                  const name = props.name as string;
                  const value = props.value as number;
                  return `${name}: ${value.toFixed(2)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
              <Legend
                wrapperStyle={{ color: '#9ca3af' }}
                formatter={(value: unknown) => <span className="text-gray-400">{value as string}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-plasma-border">
        <p className="text-sm text-gray-400">
          This metric shows how much of splUSD's backing consists of plUSD tokens.
          A higher percentage indicates greater exposure to plUSD in the splUSD reserve composition.
        </p>
      </div>
    </div>
  );
};
