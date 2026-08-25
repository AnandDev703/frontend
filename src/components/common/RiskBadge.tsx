import React from 'react';
import { RiskLevel } from '../../types/contract';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-bold gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  if (level === 'HIGH') {
    return (
      <span className={`inline-flex items-center rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80 shadow-xs ${sizeClasses[size]} ${className}`}>
        {showIcon && <AlertCircle size={iconSizes[size]} className="text-red-600 dark:text-red-400 shrink-0" />}
        <span>HIGH RISK{score !== undefined ? ` • ${score}%` : ''}</span>
      </span>
    );
  }

  if (level === 'MEDIUM') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 shadow-xs ${sizeClasses[size]} ${className}`}>
        {showIcon && <AlertTriangle size={iconSizes[size]} className="text-amber-600 dark:text-amber-400 shrink-0" />}
        <span>MEDIUM RISK{score !== undefined ? ` • ${score}%` : ''}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-xs ${sizeClasses[size]} ${className}`}>
      {showIcon && <CheckCircle2 size={iconSizes[size]} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
      <span>LOW RISK{score !== undefined ? ` • ${score}%` : ''}</span>
    </span>
  );
};
