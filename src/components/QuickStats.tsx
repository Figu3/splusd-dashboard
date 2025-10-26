import { TrendingUp, Wallet, PieChart, Layers } from 'lucide-react';
import { QuickStat } from './ui/QuickStat';
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <QuickStat
        label="Total Value Locked"
        value={data.totalSupply}
        icon={TrendingUp}
        change={tvlChange}
        color="#8b5cf6"
      />

      <QuickStat
        label="plUSD Share"
        value={`${plusdPercentage.toFixed(2)}%`}
        icon={PieChart}
        color="#10b981"
      />

      <QuickStat
        label="Idle Wallets"
        value={`${idlePercentage.toFixed(2)}%`}
        icon={Wallet}
        color="#6b7280"
      />

      <QuickStat
        label="Active Protocols"
        value={activeProtocols.toString()}
        icon={Layers}
        color="#f59e0b"
      />
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
