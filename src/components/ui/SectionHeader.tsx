import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export const SectionHeader = ({ title, subtitle, icon: Icon }: SectionHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="p-2 bg-plasma-accent/20 rounded-lg">
            <Icon className="w-5 h-5 text-plasma-accent" />
          </div>
        )}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-gray-400 text-sm ml-12">{subtitle}</p>
      )}
    </div>
  );
};
