import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface Strategy {
  name: string;
  protocol: string;
  allocation: number;
  percentage: number;
  apy: number;
  risk: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Inactive';
}

interface VaultData {
  tvl: number;
  tvlUSD: number;
  activeStrategies: number;
  totalStrategies: number;
  avgAPY: number;
  minAPY: number;
  maxAPY: number;
  depositors: number;
  avgDeposit: number;
  allocation: Array<{ strategy: string; percentage: number; value: number }>;
  strategies: Strategy[];
  performance: Array<{ date: string; value: number }>;
}

const VAULT_ADDRESS = '0xA1FF1458aaD268B846005CE26d36eC6a7Fc658dA';

const COLORS = ['#00d4ff', '#7b61ff', '#00ff88', '#ffb800', '#ff4757', '#a8b2d1'];

export const RestakingVault = () => {
  const [data, setData] = useState<VaultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVaultData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, use mock data until API is implemented
      // In production, this would fetch from: `/api/vault/${VAULT_ADDRESS}`
      const mockData: VaultData = {
        tvl: 1250000,
        tvlUSD: 1250000,
        activeStrategies: 5,
        totalStrategies: 6,
        avgAPY: 12.5,
        minAPY: 8.2,
        maxAPY: 18.7,
        depositors: 342,
        avgDeposit: 3655.91,
        allocation: [
          { strategy: 'Aave USDC', percentage: 35, value: 437500 },
          { strategy: 'Compound DAI', percentage: 25, value: 312500 },
          { strategy: 'Curve 3pool', percentage: 20, value: 250000 },
          { strategy: 'Yearn USDT', percentage: 15, value: 187500 },
          { strategy: 'Convex FRAX', percentage: 5, value: 62500 }
        ],
        strategies: [
          { name: 'Aave USDC', protocol: 'Aave V3', allocation: 437500, percentage: 35, apy: 11.2, risk: 'Low', status: 'Active' },
          { name: 'Compound DAI', protocol: 'Compound', allocation: 312500, percentage: 25, apy: 9.8, risk: 'Low', status: 'Active' },
          { name: 'Curve 3pool', protocol: 'Curve', allocation: 250000, percentage: 20, apy: 14.5, risk: 'Medium', status: 'Active' },
          { name: 'Yearn USDT', protocol: 'Yearn', allocation: 187500, percentage: 15, apy: 18.7, risk: 'Medium', status: 'Active' },
          { name: 'Convex FRAX', protocol: 'Convex', allocation: 62500, percentage: 5, apy: 8.2, risk: 'Low', status: 'Active' }
        ],
        performance: generateMockPerformanceData()
      };

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vault data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVaultData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadVaultData} />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Vault Info */}
      <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border">
        <h2 className="text-2xl font-bold text-white mb-2">splUSD Vault Allocation</h2>
        <p className="text-gray-400 text-sm mb-4">
          Vault Address:{' '}
          <a
            href={`https://plasmascan.to/address/${VAULT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-plasma-accent hover:underline font-mono"
          >
            {VAULT_ADDRESS}
          </a>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <h3 className="text-sm text-gray-400 uppercase tracking-wider">Total Value Locked</h3>
              <div className="text-2xl font-bold text-white mt-1">
                {formatNumber(data.tvl, 2)} splUSD
              </div>
              <div className="text-sm text-gray-500 mt-1">
                ${formatNumber(data.tvlUSD, 2)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <h3 className="text-sm text-gray-400 uppercase tracking-wider">Active Strategies</h3>
              <div className="text-2xl font-bold text-white mt-1">{data.activeStrategies}</div>
              <div className="text-sm text-gray-500 mt-1">Total: {data.totalStrategies}</div>
            </div>
          </div>
        </div>

        <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📈</div>
            <div>
              <h3 className="text-sm text-gray-400 uppercase tracking-wider">Average APY</h3>
              <div className="text-2xl font-bold text-green-400 mt-1">{formatNumber(data.avgAPY, 2)}%</div>
              <div className="text-sm text-gray-500 mt-1">
                Range: {formatNumber(data.minAPY, 2)}% - {formatNumber(data.maxAPY, 2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border">
          <div className="flex items-center gap-3">
            <div className="text-3xl">👥</div>
            <div>
              <h3 className="text-sm text-gray-400 uppercase tracking-wider">Depositors</h3>
              <div className="text-2xl font-bold text-white mt-1">{formatNumber(data.depositors)}</div>
              <div className="text-sm text-gray-500 mt-1">
                Avg: ${formatNumber(data.avgDeposit, 2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Chart */}
      <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border">
        <h3 className="text-xl font-bold text-white mb-4">Vault Allocation by Strategy</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.allocation}
              dataKey="percentage"
              nameKey="strategy"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ strategy, percentage }) => `${strategy}: ${percentage}%`}
            >
              {data.allocation.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #2d3454' }}
              formatter={(value: number) => `${value}%`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Strategies Table */}
      <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border overflow-x-auto">
        <h3 className="text-xl font-bold text-white mb-4">Active Strategies</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-plasma-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Strategy</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Protocol</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Allocation</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">APY</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Risk</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.strategies.map((strategy, index) => (
              <tr key={index} className="border-b border-plasma-border hover:bg-plasma-dark/50">
                <td className="py-3 px-4 text-white">{strategy.name}</td>
                <td className="py-3 px-4 text-gray-300">{strategy.protocol}</td>
                <td className="py-3 px-4 text-right text-white">
                  {formatNumber(strategy.allocation, 2)} splUSD
                  <span className="text-gray-500 ml-2">({formatNumber(strategy.percentage, 1)}%)</span>
                </td>
                <td className="py-3 px-4 text-right text-green-400">{formatNumber(strategy.apy, 2)}%</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded text-sm ${getRiskColor(strategy.risk)}`}>
                    {strategy.risk}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded text-sm ${strategy.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {strategy.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Chart */}
      <div className="bg-plasma-card rounded-xl p-6 border border-plasma-border">
        <h3 className="text-xl font-bold text-white mb-4">Vault Performance History (30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.performance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3454" />
            <XAxis dataKey="date" stroke="#6b7592" />
            <YAxis stroke="#6b7592" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #2d3454' }}
              formatter={(value: number) => `$${formatNumber(value, 2)}`}
            />
            <Line type="monotone" dataKey="value" stroke="#00d4ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper functions
function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function getRiskColor(risk: 'Low' | 'Medium' | 'High'): string {
  switch (risk) {
    case 'Low':
      return 'bg-green-500/20 text-green-400';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'High':
      return 'bg-red-500/20 text-red-400';
  }
}

function generateMockPerformanceData() {
  const today = new Date();
  const data = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const baseValue = 1200000;
    const variance = Math.sin(i / 5) * 50000 + Math.random() * 20000;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: baseValue + variance
    });
  }

  return data;
}
