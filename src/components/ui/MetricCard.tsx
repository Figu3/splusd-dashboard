import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const MetricCard = ({ title, icon: Icon, children, className = '', action }: MetricCardProps) => {
  return (
    <div className={`bg-plasma-card border border-plasma-border rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-plasma-accent" />}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm text-plasma-accent hover:text-purple-400 font-medium transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};
