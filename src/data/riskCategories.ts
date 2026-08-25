import { ClauseCategory, RiskLevel, SupportedLanguage, LanguageOption } from '../types/contract';

export interface CategoryMetadata {
  name: ClauseCategory;
  weight: number; // 1 to 3 multiplier for overall risk
  description: string;
  iconName: string;
  commonRisks: string[];
}

export const RISK_CATEGORIES: Record<ClauseCategory, CategoryMetadata> = {
  'Liability': {
    name: 'Liability',
    weight: 3.0,
    description: 'Clauses dealing with legal responsibility, damages, uncapped losses, and indemnities.',
    iconName: 'ShieldAlert',
    commonRisks: ['Unlimited liability', 'Consequential damages', 'No cap on claims']
  },
  'Indemnification': {
    name: 'Indemnification',
    weight: 2.8,
    description: 'Obligations to compensate the other party for harm, losses, third-party lawsuits, or legal fees.',
    iconName: 'Scale',
    commonRisks: ['Broad third-party indemnity', 'Defending client legal costs', 'No fault required']
  },
  'Termination': {
    name: 'Termination',
    weight: 2.7,
    description: 'Conditions under which either party can cancel or end the contract.',
    iconName: 'UserX',
    commonRisks: ['Unilateral termination without notice', 'Immediate cancellation', 'No cure period']
  },
  'Intellectual Property': {
    name: 'Intellectual Property',
    weight: 2.5,
    description: 'Ownership of created assets, inventions, pre-existing tools, and moral rights.',
    iconName: 'Sparkles',
    commonRisks: ['Assigning background IP', 'Transfer without full payment', 'Broad work-for-hire']
  },
  'Penalties': {
    name: 'Penalties',
    weight: 2.4,
    description: 'Disproportionate financial forfeitures, liquidated damages, or punitive charges.',
    iconName: 'AlertTriangle',
    commonRisks: ['Excessive liquidated damages', 'Deposit forfeiture', 'Arbitrary fine rates']
  },
  'Non-Compete': {
    name: 'Non-Compete',
    weight: 2.3,
    description: 'Restrictions on working with competitors, soliciting clients, or practicing in the same industry.',
    iconName: 'Lock',
    commonRisks: ['Excessive geographic reach', 'Multi-year duration', 'Vague competitor definitions']
  },
  'Auto Renewal': {
    name: 'Auto Renewal',
    weight: 2.2,
    description: 'Clauses that automatically lock the user into subsequent contract cycles.',
    iconName: 'RefreshCw',
    commonRisks: ['Short cancellation window', 'Substantial price increases upon renewal', 'Silent extensions']
  },
  'Payment': {
    name: 'Payment',
    weight: 2.2,
    description: 'Terms of payment, invoicing schedules, net terms, deduction rights, and withholdings.',
    iconName: 'CreditCard',
    commonRisks: ['Net 60/90 days', 'Pay-when-paid clauses', 'Unilateral fee deductions']
  },
  'Hidden Fees': {
    name: 'Hidden Fees',
    weight: 2.0,
    description: 'Unbudgeted maintenance fees, admin charges, platform commissions, or surcharge clauses.',
    iconName: 'DollarSign',
    commonRisks: ['Uncapped processing fees', 'Mandatory expense reimbursements', 'Arbitrary service fees']
  },
  'Refund': {
    name: 'Refund',
    weight: 1.8,
    description: 'Policies regarding deposits, returns, milestone reversals, or clawbacks.',
    iconName: 'RotateCcw',
    commonRisks: ['Strict no-refund policy', 'Clawback of previously earned fees', 'Non-refundable advances']
  },
  'Notice Period': {
    name: 'Notice Period',
    weight: 1.7,
    description: 'Time frames required for notifying changes, renewal opt-outs, or early termination.',
    iconName: 'Clock',
    commonRisks: ['Zero notice required from one party', 'Extremely long notice requirements']
  },
  'Dispute Resolution': {
    name: 'Dispute Resolution',
    weight: 1.6,
    description: 'Mandatory arbitration, jury trial waivers, and escalation steps.',
    iconName: 'Gavel',
    commonRisks: ['Mandatory confidential arbitration', 'Loser-pays legal fees clause', 'Jury waiver']
  },
  'Governing Law': {
    name: 'Governing Law',
    weight: 1.5,
    description: 'Legal jurisdiction and court venue governing any legal disagreements.',
    iconName: 'Compass',
    commonRisks: ['Distant out-of-state/international jurisdiction', 'Unfavorable local statutes']
  },
  'Confidentiality': {
    name: 'Confidentiality',
    weight: 1.4,
    description: 'Obligations regarding proprietary trade secrets, NDA terms, and portfolio showcase rights.',
    iconName: 'EyeOff',
    commonRisks: ['Perpetual confidentiality', 'Ban on including work in portfolio', 'Overly broad definition']
  },
  'Privacy / Data': {
    name: 'Privacy / Data',
    weight: 1.4,
    description: 'Handling of personal customer data, surveillance rights, and data processing liabilities.',
    iconName: 'Database',
    commonRisks: ['Unrestricted data transfer', 'Employee device surveillance', 'Broad data licensing']
  },
  'Cancellation': {
    name: 'Cancellation',
    weight: 1.3,
    description: 'Provisions for cooling-off, event cancellation, or mutual rescission.',
    iconName: 'XCircle',
    commonRisks: ['Forfeiture of all payments on cancellation', 'Steep cancellation penalties']
  },
  'Warranty': {
    name: 'Warranty',
    weight: 1.2,
    description: 'Guarantees of fitness, bug-free performance, or continuous suitability.',
    iconName: 'Award',
    commonRisks: ['Lifetime warranty requirements', 'As-is disclaimers favoring the other party']
  },
  'Other': {
    name: 'Other',
    weight: 1.0,
    description: 'Miscellaneous boilerplate, severability, and general contractual provisions.',
    iconName: 'FileText',
    commonRisks: ['Unbalanced amendments', 'Unilateral modification rights']
  }
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
];

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 61) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
}

export function getRiskColorClass(level: RiskLevel): {
  badge: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
  hex: string;
} {
  switch (level) {
    case 'HIGH':
      return {
        badge: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200 dark:border-red-800/60',
        dot: 'bg-red-500',
        hex: '#EF4444'
      };
    case 'MEDIUM':
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        border: 'border-amber-200 dark:border-amber-800/60',
        dot: 'bg-amber-500',
        hex: '#F59E0B'
      };
    case 'LOW':
    default:
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        dot: 'bg-emerald-500',
        hex: '#10B981'
      };
  }
}
