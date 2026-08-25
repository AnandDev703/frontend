import React from 'react';
import { useContract } from '../../context/ContractContext';
import { useUITranslations } from '../../data/uiTranslations';
import MoltenMetal from '../common/MoltenMetal';
import { 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Scale, 
  MessageSquare, 
  Download, 
  Users,
  ShieldCheck,
  Zap,
  Lock,
  LayoutDashboard
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, selectedLanguage } = useContract();
  const t = useUITranslations(selectedLanguage);

  return (
    <div className="relative space-y-16 pb-16 animate-fade-in overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto px-4">
        {/* Brand Logo & Hero badge */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="cursor-pointer mb-4" onClick={() => setCurrentView('upload')}>
            <img 
              src="/logo.png" 
              alt="ClauseX" 
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain animate-float"
            />
          </div>

          {/* Liquid Glass Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-badge text-purple-700 dark:text-purple-300 text-xs font-extrabold shadow-sm animate-slide-down">
            <Sparkles size={14} className="text-purple-600 dark:text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t('hero_badge')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>{t('app_tagline')}</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] animate-slide-down">
          {t('hero_title_1')} <br />
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400 bg-clip-text text-transparent">
            {t('hero_title_2')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-[#8a99ad] max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '150ms' }}>
          {t('hero_subtitle')}
        </p>

        {/* Primary CTA Buttons with Liquid Glass & Specular Sheen */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-scale-in" style={{ animationDelay: '250ms' }}>
          <button
            onClick={() => setCurrentView('upload')}
            className="relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-500/35 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer group"
          >
            {/* Specular Top Reflection */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
            <span>{t('cta_analyze')}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className="relative overflow-hidden w-full sm:w-auto px-7 py-4 rounded-2xl liquid-glass-card text-slate-800 dark:text-slate-200 font-extrabold text-sm shadow-sm transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none" />
            <LayoutDashboard size={16} className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <span>View Dashboard</span>
          </button>
        </div>

        {/* 4 Trust Stats Cards with Liquid Glass Effect */}
        <div className="mt-12 pt-8 border-t border-white/20 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="relative overflow-hidden p-4 rounded-3xl liquid-glass-card hover:scale-105 transform transition-all group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform inline-block">18+</p>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] font-bold mt-0.5">{t('stat_categories')}</p>
          </div>

          <div className="relative overflow-hidden p-4 rounded-3xl liquid-glass-card hover:scale-105 transform transition-all group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform inline-block">0-100%</p>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] font-bold mt-0.5">{t('stat_scoring')}</p>
          </div>

          <div className="relative overflow-hidden p-4 rounded-3xl liquid-glass-card hover:scale-105 transform transition-all group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform inline-block">5</p>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] font-bold mt-0.5">{t('stat_languages')}</p>
          </div>

          <div className="relative overflow-hidden p-4 rounded-3xl liquid-glass-card hover:scale-105 transform transition-all group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform inline-block">100%</p>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] font-bold mt-0.5">{t('stat_private')}</p>
          </div>
        </div>
      </section>

      {/* 2. Feature Cards Grid with Liquid Glass Effect */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-black text-purple-600 dark:text-purple-400 tracking-wider">
            {t('feature_sub')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('feature_heading')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card hover:scale-[1.02] transform transition-all space-y-3 group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-300/50 dark:border-rose-700/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <ShieldAlert size={24} />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t('feat_1_title')}</h4>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] leading-relaxed">
              {t('feat_1_desc')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card hover:scale-[1.02] transform transition-all space-y-3 group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-300/50 dark:border-purple-700/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t('feat_2_title')}</h4>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] leading-relaxed">
              {t('feat_2_desc')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card hover:scale-[1.02] transform transition-all space-y-3 group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-300/50 dark:border-emerald-700/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Scale size={24} />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t('feat_3_title')}</h4>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] leading-relaxed">
              {t('feat_3_desc')}
            </p>
          </div>

          {/* Card 4 */}
          <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card hover:scale-[1.02] transform transition-all space-y-3 group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-300/50 dark:border-indigo-700/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t('feat_4_title')}</h4>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] leading-relaxed">
              {t('feat_4_desc')}
            </p>
          </div>

          {/* Card 5 */}
          <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card hover:scale-[1.02] transform transition-all space-y-3 group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-300/50 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Download size={24} />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t('feat_5_title')}</h4>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] leading-relaxed">
              {t('feat_5_desc')}
            </p>
          </div>

          {/* Card 6 */}
          <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card hover:scale-[1.02] transform transition-all space-y-3 group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-300/50 dark:border-cyan-700/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t('feat_6_title')}</h4>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] leading-relaxed">
              {t('feat_6_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. 4-Step Process Section with Liquid Glass Effect */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-black text-purple-600 dark:text-purple-400 tracking-wider">
            4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('how_heading')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative overflow-hidden p-5 rounded-3xl liquid-glass-card hover:scale-105 transform transition-all group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <span className="text-3xl font-black text-purple-500/20 absolute top-3 right-4">01</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-300/40 dark:border-purple-700/40 flex items-center justify-center font-black text-sm mb-3 shadow-xs">
              1
            </div>
            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('step_1_title')}</h5>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] mt-1 leading-relaxed">
              {t('step_1_desc')}
            </p>
          </div>

          <div className="relative overflow-hidden p-5 rounded-3xl liquid-glass-card hover:scale-105 transform transition-all group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <span className="text-3xl font-black text-purple-500/20 absolute top-3 right-4">02</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-300/40 dark:border-purple-700/40 flex items-center justify-center font-black text-sm mb-3 shadow-xs">
              2
            </div>
            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('step_2_title')}</h5>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] mt-1 leading-relaxed">
              {t('step_2_desc')}
            </p>
          </div>

          <div className="relative overflow-hidden p-5 rounded-3xl liquid-glass-card hover:scale-105 transform transition-all group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <span className="text-3xl font-black text-purple-500/20 absolute top-3 right-4">03</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-300/40 dark:border-purple-700/40 flex items-center justify-center font-black text-sm mb-3 shadow-xs">
              3
            </div>
            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('step_3_title')}</h5>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] mt-1 leading-relaxed">
              {t('step_3_desc')}
            </p>
          </div>

          <div className="relative overflow-hidden p-5 rounded-3xl liquid-glass-card hover:scale-105 transform transition-all group">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />
            <span className="text-3xl font-black text-purple-500/20 absolute top-3 right-4">04</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-300/40 dark:border-purple-700/40 flex items-center justify-center font-black text-sm mb-3 shadow-xs">
              4
            </div>
            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('step_4_title')}</h5>
            <p className="text-xs text-slate-600 dark:text-[#8a99ad] mt-1 leading-relaxed">
              {t('step_4_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Legal Disclaimer Box */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="p-4 rounded-2xl liquid-glass-badge text-center text-xs text-slate-600 dark:text-[#8a99ad] space-y-1">
          <p className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5">
            <Lock size={13} className="text-purple-600 dark:text-purple-400" />
            <span>{t('disclaimer_title')}</span>
          </p>
          <p className="leading-relaxed font-medium">{t('disclaimer_full')}</p>
        </div>
      </section>
    </div>
  );
};
