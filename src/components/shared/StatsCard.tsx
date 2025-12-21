import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className = '' }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="mt-1 sm:mt-2 text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{value}</p>
          {trend && (
            <div className={`mt-1 sm:mt-2 flex items-center text-xs sm:text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="bg-indigo-100 rounded-full p-2 sm:p-2.5 lg:p-3">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

