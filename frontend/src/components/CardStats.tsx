import { ReactNode } from 'react';

interface CardStatsProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red';
  loading?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600'
  }
};

export default function CardStats({ title, value, icon, color, loading = false }: CardStatsProps) {
  return (
    <div className={`p-4 rounded-lg shadow ${colorClasses[color].bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
          ) : (
            <p className={`text-2xl font-bold mt-1 ${colorClasses[color].text}`}>{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].bg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
