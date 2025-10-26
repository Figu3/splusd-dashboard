import type { LucideIcon } from 'lucide-react';

interface QuickStatProps {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: {
    value: number;
    label: string;
  };
  color?: string;
}

export const QuickStat = ({ label, value, icon: Icon, change, color = '#8b5cf6' }: QuickStatProps) => {
  return (
    <div className="bg-plasma-card border border-plasma-border rounded-xl p-4 hover:border-plasma-accent/50 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <div
            className={`text-xs font-semibold px-2 py-1 rounded-md ${
              change.value >= 0
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {change.value >= 0 ? '+' : ''}
            {change.value.toFixed(2)}%
          </div>
        )}
      </div>

      <div className="mt-2">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-white text-2xl font-bold">
          {value}
        </p>
        {change?.label && (
          <p className="text-gray-500 text-xs mt-1">
            {change.label}
          </p>
        )}
      </div>
    </div>
  );
};
