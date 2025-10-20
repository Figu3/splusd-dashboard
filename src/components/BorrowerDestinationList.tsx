import type { BorrowerDestination } from '../types';
import { ArrowRight, Repeat, ArrowRightLeft, Package } from 'lucide-react';

interface BorrowerDestinationListProps {
  destinations: BorrowerDestination[];
}

export const BorrowerDestinationList = ({ destinations }: BorrowerDestinationListProps) => {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400 text-sm">
        <p>Analyzing borrower activity...</p>
        <p className="text-xs mt-1">Tracking where borrowed USDT0 flows</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <Repeat className="w-4 h-4" />;
      case 'bridge':
        return <ArrowRightLeft className="w-4 h-4" />;
      case 'deposit':
        return <Package className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'swap':
        return 'Swapped';
      case 'bridge':
        return 'Bridged';
      case 'deposit':
        return 'Deposited';
      default:
        return 'Sent to';
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-plasma-border">
        <h4 className="text-sm font-semibold text-gray-300">Borrowed USDT0 Destinations</h4>
        <span className="text-xs text-gray-500">Last 7 days</span>
      </div>

      {destinations.map((dest, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-plasma-dark rounded-lg hover:bg-plasma-darker transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: dest.color }}
            />
            <div
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${dest.color}20` }}
            >
              <div style={{ color: dest.color }}>
                {getIcon(dest.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm truncate">
                  {dest.protocol}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: `${dest.color}30`,
                    color: dest.color,
                  }}
                >
                  {getTypeLabel(dest.type)}
                </span>
              </div>
              {dest.description && (
                <p className="text-xs text-gray-400 mt-0.5">{dest.description}</p>
              )}
            </div>
          </div>

          <div className="text-right ml-4 flex-shrink-0">
            <div className="text-white font-semibold text-sm">
              {dest.percentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">
              {dest.amount} USDT0
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4 pt-3 border-t border-plasma-border">
        <p className="text-xs text-gray-500 text-center">
          Data tracked from on-chain USDT0 transfer events
        </p>
      </div>
    </div>
  );
};
