import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ContractAnalysis } from '../../types/contract';
import { useTheme } from '../../context/ThemeContext';
import { Info, ArrowRight, Sparkles } from 'lucide-react';

interface ClauseRiskDonutChartProps {
  contract: ContractAnalysis;
  onViewBreakdown?: () => void;
}

export const ClauseRiskDonutChart: React.FC<ClauseRiskDonutChartProps> = ({ 
  contract,
  onViewBreakdown
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const clauses = contract.clauses || [];
  const criticalCount = clauses.filter(c => c.riskScore >= 80).length;
  const regularHighCount = clauses.filter(c => c.riskScore >= 61 && c.riskScore < 80).length;
  const mediumCount = clauses.filter(c => c.riskScore >= 31 && c.riskScore < 61).length;
  const lCount = clauses.filter(c => c.riskScore < 31).length;

  const data = [
    { name: 'Critical Risk', count: criticalCount, color: '#f43f5e' },
    { name: 'High Risk', count: regularHighCount, color: '#f97316' },
    { name: 'Medium Risk', count: mediumCount, color: '#eab308' },
    { name: 'Low Risk', count: lCount, color: '#22c55e' },
  ].filter(d => d.count > 0);

  // If no clauses yet or all 0, provide baseline
  const chartData = data.length > 0 ? data : [
    { name: 'Critical Risk', count: 1, color: '#f43f5e' },
    { name: 'High Risk', count: 2, color: '#f97316' },
    { name: 'Medium Risk', count: 1, color: '#eab308' },
    { name: 'Low Risk', count: 2, color: '#22c55e' },
  ];

  const totalEvaluated = clauses.length || chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl liquid-glass-card text-slate-800 dark:text-slate-100 flex flex-col justify-between shadow-2xl transition-all space-y-4">
      {/* Specular Liquid Top Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Clause Risk Distribution</h3>
          <Info size={13} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 cursor-pointer" />
        </div>
        <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-500/15 border border-purple-300/40 px-2.5 py-0.5 rounded-full">
          {totalEvaluated} Clauses Analyzed
        </span>
      </div>

      {/* 2. Big Centered Donut Circle */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
        <div className="relative w-52 h-52 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={96}
                paddingAngle={3}
                dataKey="count"
                stroke={isDark ? '#0d1322' : '#ffffff'}
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-2xl bg-white/95 dark:bg-[#090d1a]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 text-xs shadow-2xl text-slate-800 dark:text-slate-100">
                        <p className="font-extrabold text-slate-900 dark:text-white">{d.name}</p>
                        <p className="font-black mt-0.5" style={{ color: d.color }}>
                          {d.count} Clauses ({Math.round((d.count / totalEvaluated) * 100)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text inside the big donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
              {totalEvaluated}
            </span>
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              Total Clauses
            </span>
          </div>
        </div>
      </div>

      {/* 3. Structured Bottom Legend Grid */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {chartData.map((item, idx) => {
            const pct = Math.round((item.count / totalEvaluated) * 100) || 0;
            return (
              <div 
                key={idx} 
                className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5"
              >
                <div className="flex items-center gap-1.5 truncate mr-1">
                  <span className="w-2 h-2 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate text-[11px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-black text-slate-900 dark:text-white shrink-0 text-[11px]">
                  {item.count} <span className="text-[9px] font-bold text-slate-400">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ClauseRiskDonutChart;
