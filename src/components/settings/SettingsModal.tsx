import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { getGeminiApiKey, setGeminiApiKey, getSelectedModel, setSelectedModel, CANDIDATE_MODELS } from '../../services/geminiService';
import { isFirebaseConfigured } from '../../services/firebase';
import { useContract } from '../../context/ContractContext';
import { 
  Key, 
  Database, 
  ExternalLink, 
  Check, 
  Cpu, 
  Info
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { userRole, setUserRole } = useContract();
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setModel] = useState('gemini-2.0-flash');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getGeminiApiKey());
      setModel(getSelectedModel());
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKey);
    setSelectedModel(selectedModel);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Settings & AI Configuration"
      subtitle="Configure your AI keys, model selection, storage, and evaluation preferences."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Gemini API Key Section */}
        <form onSubmit={handleSave} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Key size={14} className="text-brand-500" />
              <span>Google Gemini API Key</span>
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <span>Get Free Key</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Model Selector */}
          <div className="space-y-1 pt-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Cpu size={14} className="text-brand-500" />
              <span>Preferred AI Model (with Auto-Fallback)</span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-white"
            >
              {CANDIDATE_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m} {m.includes('2.0') ? '(Recommended - Fast & Accurate)' : m.includes('2.5') ? '(Latest)' : ''}
                </option>
              ))}
            </select>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            The platform automatically negotiates across Gemini model endpoints with fallback. Keys are stored locally in your browser.
          </p>

          <div className="flex items-center justify-between pt-1">
            {isSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Check size={14} /> Settings Saved Successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>

        {/* Cloud & Database Status */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Database size={14} className="text-slate-500" />
              <span>Storage & Persistence</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isFirebaseConfigured
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
            }`}>
              {isFirebaseConfigured ? 'Firebase Firestore Cloud' : 'Local Browser Cache'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {isFirebaseConfigured
              ? 'Your analyzed contracts are synced to your cloud account.'
              : 'Contracts are safely preserved locally in your browser storage.'}
          </p>
        </div>

        {/* Default Evaluation Role */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            Default Evaluation Perspective
          </label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-white"
          >
            <option value="freelancer">Freelancer / Contractor (Focus: IP, Payment, Termination)</option>
            <option value="tenant">Tenant / Renter (Focus: Deposit, Entry, Maintenance)</option>
            <option value="employee">Employee (Focus: Non-Compete, Notice, NDA)</option>
            <option value="gig_worker">Gig Worker (Focus: Deactivation, Rates)</option>
            <option value="small_business">Small Business Owner (Focus: Liability, Indemnity)</option>
            <option value="other">General Review</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
