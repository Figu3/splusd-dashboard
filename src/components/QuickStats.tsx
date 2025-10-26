import { TrendingUp, Wallet, PieChart, Layers } from 'lucide-react';
import type { DashboardData } from '../types';

interface QuickStatsProps {
  data: DashboardData;
}

export const QuickStats = ({ data }: QuickStatsProps) => {
  // Calculate idle wallet percentage
  const idleWallet = data.distributions.find(d => d.location === 'Idle Wallets');
  const idlePercentage = idleWallet?.percentage || 0;

  // Calculate number of active protocols (excluding idle wallets)
  const activeProtocols = data.distributions.filter(d => d.location !== 'Idle Wallets').length;

  // Get plUSD share percentage
  const plusdPercentage = data.plusdShare?.percentage || 0;

  // Calculate TVL change from history
  const tvlChange = calculateTVLChange(data.tvlHistory || []);

  const stats = [
    {
      label: 'Total Value Locked',
      value: data.totalSupply,
      icon: TrendingUp,
      color: '#8b5cf6',
      change: tvlChange,
    },
    {
      label: 'plUSD Share',
      value: `${plusdPercentage.toFixed(2)}%`,
      icon: PieChart,
      color: '#10b981',
    },
    {
      label: 'Idle Wallets',
      value: `${idlePercentage.toFixed(2)}%`,
      icon: Wallet,
      color: '#6b7280',
    },
    {
      label: 'Active Protocols',
      value: activeProtocols.toString(),
      icon: Layers,
      color: '#f59e0b',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-plasma-card border border-plasma-border rounded-xl p-6 hover:border-plasma-accent/50 transition-all shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              {stat.change && (
                <div
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    stat.change.value >= 0
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {stat.change.value >= 0 ? '+' : ''}
                  {stat.change.value.toFixed(2)}%
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className="text-white text-3xl font-bold">
                {stat.value}
              </p>
              {stat.change?.label && (
                <p className="text-gray-500 text-xs mt-2">
                  {stat.change.label}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to calculate TVL change
const calculateTVLChange = (history: Array<{ tvlRaw: string; timestamp: number }>): { value: number; label: string } | undefined => {
  if (history.length < 2) return undefined;

  const latest = parseFloat(history[history.length - 1].tvlRaw) / 1e18;
  const earliest = parseFloat(history[0].tvlRaw) / 1e18;

  if (earliest === 0) return undefined;

  const change = ((latest - earliest) / earliest) * 100;

  // Calculate time period
  const timeDiff = history[history.length - 1].timestamp - history[0].timestamp;
  const hours = Math.round(timeDiff / (1000 * 60 * 60));
  const days = Math.round(timeDiff / (1000 * 60 * 60 * 24));

  let label = '';
  if (days > 1) {
    label = `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    label = `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    label = 'recent';
  }

  return {
    value: change,
    label: `vs ${label} ago`
  };
};
