import { useState } from 'react';
import type { TokenDistribution } from '../types';
import { BorrowerDestinationList } from './BorrowerDestinationList';
import { BorrowerDetailsList } from './BorrowerDetailsList';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getProtocolColor } from '../utils/colors';
import { shortenAddress } from '../utils/format';

interface DistributionCardProps {
  distribution: TokenDistribution;
}

export const DistributionCard = ({ distribution }: DistributionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const color = getProtocolColor(distribution.location);

  // Debug logging for Pendle
  if (distribution.location === 'Pendle Protocol') {
    console.log('Pendle card rendering, breakdown:', distribution.pendleBreakdown);
  }

  return (
    <div className="bg-plasma-card border border-plasma-border rounded-xl p-5 hover:border-plasma-accent/50 transition-all shadow-lg hover:shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-base font-semibold text-white">
            {distribution.location}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">
            {distribution.percentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Amount</span>
          <span className="text-sm font-semibold text-white">
            {distribution.amount}
          </span>
        </div>

        {distribution.address && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Address</span>
            <a
              href={`https://plasmascan.to/address/${distribution.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-plasma-accent hover:text-purple-400 font-mono transition-colors"
            >
              {shortenAddress(distribution.address)}
            </a>
          </div>
        )}

        {distribution.change24h !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wide">24h Change</span>
            <span
              className={`text-sm font-semibold ${
                distribution.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {distribution.change24h >= 0 ? '+' : ''}
              {distribution.change24h.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-plasma-dark/50 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${distribution.percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Expandable section for Pendle breakdown */}
      {distribution.location === 'Pendle Protocol' && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-between p-3 bg-plasma-darker rounded-lg hover:bg-plasma-dark transition-colors"
          >
            <span className="text-sm font-medium text-gray-300">
              SY/PT/YT Breakdown
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {isExpanded && (
            <div className="overflow-hidden transition-all duration-300">
              {distribution.pendleBreakdown ? (
                <div className="mt-3 space-y-2">
                  <div className="p-3 bg-plasma-dark rounded-lg border border-plasma-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">SY Token</span>
                      <span className="text-sm font-semibold text-white">
                        {distribution.pendleBreakdown.sy.percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Amount</span>
                      <span className="text-xs text-gray-300">{distribution.pendleBreakdown.sy.amount}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-plasma-dark rounded-lg border border-plasma-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">PT Token</span>
                      <span className="text-sm font-semibold text-white">
                        {distribution.pendleBreakdown.pt.percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Amount</span>
                      <span className="text-xs text-gray-300">{distribution.pendleBreakdown.pt.amount}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-plasma-dark rounded-lg border border-plasma-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">YT Token</span>
                      <span className="text-sm font-semibold text-white">
                        {distribution.pendleBreakdown.yt.percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Amount</span>
                      <span className="text-xs text-gray-300">{distribution.pendleBreakdown.yt.amount}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-plasma-dark rounded-lg border border-plasma-border">
                  <p className="text-sm text-gray-400 text-center">
                    Loading Pendle breakdown data...
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Check browser console for details
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Expandable section for Euler borrowers */}
      {distribution.location === 'Euler Protocol' && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-between p-3 bg-plasma-darker rounded-lg hover:bg-plasma-dark transition-colors"
          >
            <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <span>Borrower Details</span>
              {distribution.borrowers && distribution.borrowers.length > 0 && (
                <span className="text-xs text-gray-500">
                  ({distribution.borrowers.length} {distribution.borrowers.length === 1 ? 'borrower' : 'borrowers'})
                </span>
              )}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {isExpanded && (
            <div className="overflow-hidden transition-all duration-300">
              {distribution.borrowers && distribution.borrowers.length > 0 ? (
                <BorrowerDetailsList borrowers={distribution.borrowers} />
              ) : (
                <div className="mt-4 p-4 bg-plasma-dark rounded-lg border border-plasma-border">
                  <p className="text-sm text-gray-400 text-center">
                    {distribution.borrowers !== undefined
                      ? 'No active borrowers found in the last 10,000 blocks'
                      : 'Loading borrower data from blockchain...'}
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Check browser console for details
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Expandable section for legacy borrower destinations */}
      {!distribution.borrowers && distribution.borrowerDestinations && distribution.borrowerDestinations.length > 0 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-between p-3 bg-plasma-darker rounded-lg hover:bg-plasma-dark transition-colors"
          >
            <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <span>Borrowed USDT0 Flow</span>
              <span className="text-xs text-gray-500">
                ({distribution.borrowerDestinations.length} destinations)
              </span>
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {isExpanded && (
            <div className="overflow-hidden transition-all duration-300">
              <BorrowerDestinationList destinations={distribution.borrowerDestinations} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
