import type { TokenDistribution } from '../types';
import { PROTOCOLS } from '../config';

interface DistributionCardProps {
  distribution: TokenDistribution;
}

export const DistributionCard = ({ distribution }: DistributionCardProps) => {
  const getProtocolColor = (location: string): string => {
    if (location === 'Idle Wallets') return '#6b7280';

    const protocolKey = Object.keys(PROTOCOLS).find(key =>
      PROTOCOLS[key].name === location
    );
    return protocolKey ? PROTOCOLS[protocolKey].color : '#6b7280';
  };

  const color = getProtocolColor(distribution.location);

  return (
    <div className="bg-plasma-card border border-plasma-border rounded-lg p-5 hover:border-plasma-accent transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-lg font-semibold text-white">
            {distribution.location}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {distribution.percentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Amount</span>
          <span className="text-sm font-medium text-white">
            {distribution.amount} splUSD
          </span>
        </div>

        {distribution.address && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Address</span>
            <a
              href={`https://plasmascan.to/address/${distribution.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-plasma-accent hover:underline font-mono"
            >
              {distribution.address.slice(0, 6)}...{distribution.address.slice(-4)}
            </a>
          </div>
        )}

        {distribution.change24h !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">24h Change</span>
            <span
              className={`text-sm font-medium ${
                distribution.change24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {distribution.change24h >= 0 ? '+' : ''}
              {distribution.change24h.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-plasma-darker rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${distribution.percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};
