import React from 'react';
import { RiskLevel } from '../../types/contract';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  size = 140,
  strokeWidth = 12,
  showLabel = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10B981'; // Green
  let glowColor = 'rgba(16, 185, 129, 0.2)';
  if (level === 'HIGH') {
    strokeColor = '#EF4444'; // Red
    glowColor = 'rgba(239, 68, 68, 0.25)';
  } else if (level === 'MEDIUM') {
    strokeColor = '#F59E0B'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.25)';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center"
          style={{ filter: `drop-shadow(0px 0px 8px ${glowColor})` }}
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Active progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {clampedScore}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
            Risk Score
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2.5 text-center">
          <span 
            className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            style={{
              backgroundColor: level === 'HIGH' ? '#FEE2E2' : level === 'MEDIUM' ? '#FEF3C7' : '#D1FAE5',
              color: level === 'HIGH' ? '#991B1B' : level === 'MEDIUM' ? '#92400E' : '#065F46',
            }}
          >
            {level} RISK
          </span>
        </div>
      )}
    </div>
  );
};
