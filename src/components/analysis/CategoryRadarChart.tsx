import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ContractAnalysis } from '../../types/contract';
import { useTheme } from '../../context/ThemeContext';
import { Info, TrendingUp, ShieldAlert } from 'lucide-react';

interface CategoryRadarChartProps {
  contract: ContractAnalysis;
}

export const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({ contract }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Extract dynamic categories from Backend API / Contract Analysis
  const radarData: { subject: string; shortName: string; value: number }[] = React.useMemo(() => {
    let rawList: { category: string; risk: number }[] = [];

    if (contract.riskCategories && contract.riskCategories.length > 0) {
      rawList = contract.riskCategories.map(rc => ({
        category: rc.category,
        risk: rc.risk_percentage || 0
      }));
    } else if (contract.categoryScores && Object.keys(contract.categoryScores).length > 0) {
      rawList = Object.entries(contract.categoryScores).map(([category, score]) => ({
        category,
        risk: score
      }));
    } else {
      rawList = [
        { category: 'Termination', risk: 85 },
        { category: 'Compensation', risk: 75 },
        { category: 'Confidentiality', risk: 70 },
        { category: 'Intellectual Property', risk: 80 },
        { category: 'Liability', risk: 90 },
      ];
    }

    return rawList.map(item => {
      const full = item.category;
      // Abbreviate for clean chart labels without overlapping
      let short = full;
      if (full.toLowerCase().includes('intellectual')) short = 'IP Rights';
      else if (full.toLowerCase().includes('compensation')) short = 'Compensation';
      else if (full.toLowerCase().includes('termination')) short = 'Termination';
      else if (full.toLowerCase().includes('confidential')) short = 'Confidentiality';
      else if (full.toLowerCase().includes('restriction')) short = 'Restrictions';
      else if (full.toLowerCase().includes('amendment')) short = 'Policies';
      else if (full.toLowerCase().includes('dispute')) short = 'Disputes';
      else if (full.toLowerCase().includes('work hour')) short = 'Work Hours';
      else if (full.length > 14) short = full.slice(0, 12) + '..';

      return {
        subject: full,
        shortName: short,
        value: Math.min(100, Math.max(0, Math.round(item.risk)))
      };
    });
  }, [contract]);

  // Highest risk category
  const highestCategory = [...radarData].sort((a, b) => b.value - a.value)[0] || { subject: 'General', shortName: 'General', value: contract.overallRiskScore || 0 };

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  return (
    <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl liquid-glass-card text-slate-800 dark:text-slate-100 flex flex-col justify-between shadow-2xl transition-all space-y-4">
      {/* Specular Liquid Top Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

      {/* 1. Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/80 dark:border-white/10 pb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Risk by Category</h3>
          <Info size={13} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 cursor-pointer" />
        </div>

        <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-500/15 border border-purple-300/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <TrendingUp size={11} />
          <span>Peak: {highestCategory.shortName} ({highestCategory.value}%)</span>
        </span>
      </div>

      {/* 2. Radar Chart with Clean Spacing (no label overlap) */}
      <div className="h-64 sm:h-72 w-full relative my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="62%" data={radarData}>
            <PolarGrid stroke={gridColor} strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="shortName" 
              tick={({ payload, x, y, cx, cy, ...rest }) => {
                const item = radarData.find(d => d.shortName === payload.value);
                const val = item ? item.value : 0;
                const scoreColor = val >= 61 ? '#f43f5e' : val >= 31 ? '#f97316' : '#22c55e';
                return (
                  <text
                    {...rest}
                    y={y}
                    x={x}
                    cx={cx}
                    cy={cy}
                    className="text-[10px] font-bold"
                    fill={textColor}
                    textAnchor="middle"
                  >
                    <tspan x={x} dy="-2">{payload.value}</tspan>
                    <tspan x={x} dy="11" className="text-[9px] font-black" fill={scoreColor}>
                      {val}%
                    </tspan>
                  </text>
                );
              }} 
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-2xl bg-white/95 dark:bg-[#090d1a]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 text-xs shadow-2xl text-slate-800 dark:text-slate-100">
                      <p className="font-extrabold text-sm text-slate-900 dark:text-white">{data.subject}</p>
                      <p className="font-black mt-0.5" style={{ color: data.value >= 61 ? '#f43f5e' : data.value >= 31 ? '#f97316' : '#22c55e' }}>
                        {data.value}% Risk Score
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Risk Level"
              dataKey="value"
              stroke="#f43f5e"
              strokeWidth={2.2}
              fill="#f43f5e"
              fillOpacity={0.22}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Structured Category Breakdown Grid */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
          {radarData.map(d => {
            const isHigh = d.value >= 61;
            const isMed = d.value >= 31 && d.value < 61;
            const badgeClass = isHigh 
              ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-200 dark:border-rose-900/40' 
              : isMed 
              ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-200 dark:border-amber-900/40' 
              : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-200 dark:border-emerald-900/40';

            return (
              <div 
                key={d.subject} 
                className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-purple-300 transition-colors text-xs"
              >
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate mr-1.5" title={d.subject}>
                  {d.subject}
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border shrink-0 ${badgeClass}`}>
                  {d.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CategoryRadarChart;
