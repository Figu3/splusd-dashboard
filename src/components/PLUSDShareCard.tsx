import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { PLUSDShareData } from '../types';
import { PieChart as PieChartIcon } from 'lucide-react';
import { MetricCard } from './ui/MetricCard';

interface PLUSDShareCardProps {
  plusdShare: PLUSDShareData;
}

export const PLUSDShareCard = ({ plusdShare }: PLUSDShareCardProps) => {
  const { plusdInSplUSD, percentage } = plusdShare;

  // Prepare data for pie chart
  const chartData = [
    {
      name: 'plUSD',
      value: percentage,
      color: '#10b981'
    },
    {
      name: 'Other',
      value: 100 - percentage,
      color: '#374151'
    }
  ];

  return (
    <MetricCard title="plUSD Composition" icon={PieChartIcon}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-4 border border-green-500/20">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">plUSD Share</p>
            <p className="text-3xl font-bold text-green-400">{percentage.toFixed(2)}%</p>
          </div>

          <div className="bg-plasma-dark/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Amount Held</p>
            <p className="text-lg font-semibold text-white">{plusdInSplUSD}</p>
          </div>

          <div className="text-xs text-gray-500 pt-2">
            <a
              href={`https://plasmascan.to/token/0xf91c31299E998C5127Bc5F11e4a657FC0cF358CD`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-plasma-accent hover:underline"
            >
              View plUSD Token →
            </a>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f35',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MetricCard>
  );
};
