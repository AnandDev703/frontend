import React, { useEffect, useState } from 'react';
import { useContract } from '../../context/ContractContext';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  Scale
} from 'lucide-react';

export const AnalysisProgress: React.FC = () => {
  const { userRole } = useContract();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(2), 1200);
    const t2 = setTimeout(() => setCurrentStep(3), 2600);
    const t3 = setTimeout(() => setCurrentStep(4), 4200);
    const t4 = setTimeout(() => setCurrentStep(5), 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const steps = [
    { id: 1, label: 'Uploading document to ClauseX Review API', sub: 'Transmitting PDF to server endpoint' },
    { id: 2, label: 'Extracting substantive legal clauses', sub: 'Scanning for liability, termination, payment & IP' },
    { id: 3, label: 'Calculating weighted hazard scores', sub: 'Categorizing risk percentage per category' },
    { id: 4, label: `Evaluating risk from ${userRole.toUpperCase()} perspective`, sub: 'Mapping display summaries & plain explanations' },
    { id: 5, label: 'Generating executive audit report', sub: 'Finalizing visual radar and donut charts' }
  ];

  return (
    <div className="relative max-w-xl mx-auto my-8 p-8 rounded-3xl backdrop-blur-2xl bg-white/75 dark:bg-[#0d1322]/85 border border-white/60 dark:border-white/10 shadow-2xl shadow-purple-500/10 animate-fade-in text-center transition-colors">
      {/* Animated icon header */}
      <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-purple-500/25 animate-ping"></div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Scale size={30} className="animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
        Analyzing Your Contract...
      </h3>
      <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-1.5 flex items-center justify-center gap-1.5">
        <Sparkles size={13} />
        <span>Evaluating clauses with Backend Review Engine...</span>
      </p>

      {/* Progress Steps Timeline */}
      <div className="mt-8 space-y-3 text-left">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 backdrop-blur-md ${
                isCurrent
                  ? 'border-purple-500/60 bg-purple-500/15 shadow-sm text-purple-900 dark:text-purple-100'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-white/40 dark:border-white/5 bg-white/30 dark:bg-[#101729]/30 opacity-50'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 size={18} className="text-purple-600 dark:text-purple-400 animate-spin" />
                ) : (
                  <Circle size={18} className="text-slate-300 dark:text-slate-600" />
                )}
              </div>

              <div className="flex-1">
                <p className={`text-xs font-bold ${
                  isCurrent ? 'text-purple-700 dark:text-purple-300' :
                  isDone ? 'text-emerald-800 dark:text-emerald-300' :
                  'text-slate-600 dark:text-slate-400'
                }`}>
                  {step.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#8a99ad]">
                  {step.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#141d33] text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck size={13} className="text-emerald-500" />
        <span>TLS 256-bit encrypted processing</span>
      </div>
    </div>
  );
};
