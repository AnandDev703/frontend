import React from 'react';
import { UserRole } from '../../types/contract';
import { useContract } from '../../context/ContractContext';
import { useUITranslations } from '../../data/uiTranslations';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Laptop, 
  Home, 
  Briefcase, 
  Bike, 
  Building2, 
  FileText,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

interface RoleOption {
  id: UserRole;
  labelKey: any;
  subKey: any;
  icon: React.ReactNode;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole
}) => {
  const { selectedLanguage } = useContract();
  const t = useUITranslations(selectedLanguage);

  const roles: RoleOption[] = [
    {
      id: 'freelancer',
      labelKey: 'role_freelancer',
      subKey: 'role_freelancer_sub',
      icon: <Laptop size={20} />
    },
    {
      id: 'tenant',
      labelKey: 'role_tenant',
      subKey: 'role_tenant_sub',
      icon: <Home size={20} />
    },
    {
      id: 'employee',
      labelKey: 'role_employee',
      subKey: 'role_employee_sub',
      icon: <Briefcase size={20} />
    },
    {
      id: 'gig_worker',
      labelKey: 'role_gig',
      subKey: 'role_gig_sub',
      icon: <Bike size={20} />
    },
    {
      id: 'small_business',
      labelKey: 'role_business',
      subKey: 'role_business_sub',
      icon: <Building2 size={20} />
    },
    {
      id: 'other',
      labelKey: 'role_general',
      subKey: 'role_general_sub',
      icon: <FileText size={20} />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600 dark:text-purple-400 animate-pulse" />
          <label className="block text-sm font-black text-slate-900 dark:text-white tracking-tight">
            {t('role_section_title')}
          </label>
        </div>
        <span className="text-xs font-extrabold px-3 py-1 rounded-full liquid-glass-badge text-purple-700 dark:text-purple-300">
          {t('role_section_sub')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {roles.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <motion.button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-4 rounded-2xl relative flex flex-col justify-between cursor-pointer overflow-hidden liquid-glass-option ${
                isSelected
                  ? 'text-white'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {/* Framer Motion Moving Liquid Indicator Pill with smooth deliberate glide duration */}
              {isSelected && (
                <motion.div
                  layoutId="activeLiquidRolePill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/95 via-indigo-600/90 to-purple-700/95 border border-purple-300/80 shadow-2xl shadow-purple-500/40 z-0"
                  transition={{
                    type: 'spring',
                    stiffness: 160,
                    damping: 22,
                    mass: 1.1
                  }}
                />
              )}

              {/* Specular Liquid Top Curve */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />

              <div className="relative z-10 w-full">
                <div className="flex items-center justify-between mb-3">
                  {/* Liquid Droplet Capsule Icon */}
                  <motion.div
                    layout
                    transition={{
                      type: 'spring',
                      stiffness: 160,
                      damping: 22
                    }}
                    className={`p-2.5 rounded-xl transition-colors duration-400 ${
                      isSelected
                        ? 'bg-white/25 text-white shadow-md backdrop-blur-md border border-white/40 scale-105'
                        : 'bg-gradient-to-br from-purple-100/90 to-purple-50/50 dark:from-purple-950/70 dark:to-purple-900/30 text-purple-600 dark:text-purple-400 border border-white/60 dark:border-purple-800/40 shadow-xs group-hover:border-purple-400'
                    }`}
                  >
                    {r.icon}
                  </motion.div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-md shadow-xs border border-white/30"
                      >
                        <CheckCircle2 size={11} />
                        Active
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <h4 className={`text-xs sm:text-sm font-extrabold transition-colors duration-300 ${
                  isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}>
                  {t(r.labelKey)}
                </h4>
                <p className={`text-[11px] mt-0.5 leading-snug transition-colors duration-300 ${
                  isSelected ? 'text-purple-100 font-medium' : 'text-slate-500 dark:text-[#8a99ad]'
                }`}>
                  {t(r.subKey)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
