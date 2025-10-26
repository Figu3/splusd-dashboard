import { useState } from 'react';
import type { BorrowerInfo } from '../types';
import { ChevronDown, ChevronUp, Repeat, ArrowRightLeft, Package, Coins } from 'lucide-react';

interface BorrowerDetailsListProps {
  borrowers: BorrowerInfo[];
}

export const BorrowerDetailsList = ({ borrowers }: BorrowerDetailsListProps) => {
  const [expandedBorrower, setExpandedBorrower] = useState<string | null>(null);

  if (!borrowers || borrowers.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400 text-sm">
        <p>Analyzing borrower activity...</p>
        <p className="text-xs mt-1">Tracking individual borrowers and their USDT0 usage</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <Repeat className="w-3.5 h-3.5" />;
      case 'bridge':
        return <ArrowRightLeft className="w-3.5 h-3.5" />;
      case 'deposit':
        return <Package className="w-3.5 h-3.5" />;
      case 'mint':
        return <Coins className="w-3.5 h-3.5" />;
      default:
        return <Coins className="w-3.5 h-3.5" />;
    }
  };

  const getCRColor = (cr: number): string => {
    if (cr >= 200) return 'text-green-400';
    if (cr >= 150) return 'text-yellow-400';
    if (cr >= 120) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCRLabel = (cr: number): string => {
    if (cr >= 200) return 'Safe';
    if (cr >= 150) return 'Moderate';
    if (cr >= 120) return 'Risky';
    return 'Critical';
  };

  const toggleBorrower = (address: string) => {
    setExpandedBorrower(expandedBorrower === address ? null : address);
  };

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-plasma-border">
        <h4 className="text-sm font-semibold text-gray-300">Borrower Details</h4>
        <span className="text-xs text-gray-500">{borrowers.length} borrowers</span>
      </div>

      {borrowers.map((borrower, index) => {
        const isExpanded = expandedBorrower === borrower.address;

        return (
          <div
            key={index}
            className="bg-plasma-dark rounded-lg overflow-hidden border border-plasma-border hover:border-plasma-accent/50 transition-colors"
          >
            {/* Borrower Header */}
            <button
              onClick={() => toggleBorrower(borrower.address)}
              className="w-full p-3 flex items-center justify-between hover:bg-plasma-darker/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="text-xs text-gray-500 mb-0.5">Address</div>
                  <a
                    href={`https://plasmascan.to/address/${borrower.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-plasma-accent hover:underline font-mono text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {borrower.address.slice(0, 6)}...{borrower.address.slice(-4)}
                  </a>
                </div>

                <div className="flex-shrink-0 border-l border-plasma-border pl-3">
                  <div className="text-xs text-gray-500 mb-0.5">Borrowed</div>
                  <div className="text-white font-medium text-sm">
                    {borrower.borrowedAmount} USDT0
                  </div>
                </div>

                <div className="flex-shrink-0 border-l border-plasma-border pl-3">
                  <div className="text-xs text-gray-500 mb-0.5">Collateral</div>
                  <div className="text-white font-medium text-sm">
                    {borrower.collateralAmount} splUSD
                  </div>
                </div>

                <div className="flex-shrink-0 border-l border-plasma-border pl-3">
                  <div className="text-xs text-gray-500 mb-0.5">CR Ratio</div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${getCRColor(borrower.collateralizationRatio)}`}>
                      {borrower.collateralizationRatio.toFixed(0)}%
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getCRColor(borrower.collateralizationRatio)} bg-opacity-20`}>
                      {getCRLabel(borrower.collateralizationRatio)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-3">
                <span className="text-xs text-gray-500">
                  {borrower.actions.length} {borrower.actions.length === 1 ? 'action' : 'actions'}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Borrower Actions */}
            {isExpanded && (
              <div className="border-t border-plasma-border bg-plasma-darker/30 p-3 space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  USDT0 Usage
                </div>
                {borrower.actions.map((action, actionIndex) => (
                  <div
                    key={actionIndex}
                    className="flex items-center justify-between p-2 bg-plasma-dark/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      <div
                        className="p-1.5 rounded"
                        style={{ backgroundColor: `${action.color}20` }}
                      >
                        <div style={{ color: action.color }}>
                          {getIcon(action.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">
                            {action.protocol}
                          </span>
                          {action.token && (
                            <span className="text-xs text-gray-400">
                              → {action.token}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right ml-3 flex-shrink-0">
                      <div className="text-white font-semibold text-sm">
                        {action.percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-400">
                        {action.amount} USDT0
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-4 pt-3 border-t border-plasma-border">
        <p className="text-xs text-gray-500 text-center">
          CR Ratio = (Collateral Value / Borrowed Amount) × 100 • Data tracked from on-chain events
        </p>
      </div>
    </div>
  );
};
