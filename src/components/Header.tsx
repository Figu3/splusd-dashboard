import { RefreshCw, Download } from 'lucide-react';

interface HeaderProps {
  totalSupply: string;
  lastUpdate: number;
  onRefresh: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  isLoading: boolean;
}

export const Header = ({
  totalSupply,
  lastUpdate,
  onRefresh,
  onExportCSV,
  onExportJSON,
  isLoading,
}: HeaderProps) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-plasma-card border border-plasma-border rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            splUSD Distribution Tracker
          </h1>
          <p className="text-gray-400 text-sm">
            Real-time tracking of Staked Plasma USD across DeFi protocols
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Supply</div>
            <div className="text-2xl font-bold text-white">{totalSupply}</div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {formatTime(lastUpdate)}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-plasma-accent hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-md transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>

        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-plasma-hover hover:bg-plasma-border border border-plasma-border text-white rounded-md transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>

        <button
          onClick={onExportJSON}
          className="flex items-center gap-2 px-4 py-2 bg-plasma-hover hover:bg-plasma-border border border-plasma-border text-white rounded-md transition-colors"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>
    </div>
  );
};
