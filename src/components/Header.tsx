import { RefreshCw, Download, Activity } from 'lucide-react';
import { formatTime } from '../utils/format';

interface HeaderProps {
  lastUpdate: number;
  onRefresh: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  isLoading: boolean;
}

export const Header = ({
  lastUpdate,
  onRefresh,
  onExportCSV,
  onExportJSON,
  isLoading,
}: HeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-plasma-card to-plasma-card/80 border border-plasma-border rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-plasma-accent/20 rounded-xl">
            <Activity className="w-6 h-6 text-plasma-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              splUSD Analytics
            </h1>
            <p className="text-gray-400 text-sm">
              Real-time distribution tracking across Plasma DeFi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Last Updated
            </div>
            <div className="text-sm font-semibold text-white">
              {formatTime(lastUpdate)}
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-plasma-accent hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg shadow-plasma-accent/20 hover:shadow-plasma-accent/40"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-plasma-card hover:bg-plasma-hover border border-plasma-border text-white rounded-lg font-medium transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-plasma-card border border-plasma-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={onExportCSV}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-plasma-hover transition-colors rounded-t-lg"
              >
                Export as CSV
              </button>
              <button
                onClick={onExportJSON}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-plasma-hover transition-colors rounded-b-lg"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
