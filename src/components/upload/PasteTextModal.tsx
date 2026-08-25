import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FileText, Sparkles } from 'lucide-react';

interface PasteTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (text: string, title?: string) => void;
}

export const PasteTextModal: React.FC<PasteTextModalProps> = ({
  isOpen,
  onClose,
  onAnalyze
}) => {
  const [contractTitle, setContractTitle] = useState('Pasted_Contract.txt');
  const [contractText, setContractText] = useState('');
  const [error, setError] = useState('');

  const wordCount = contractText.trim() ? contractText.trim().split(/\s+/).length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractText.trim() || contractText.trim().length < 50) {
      setError('Please paste at least a couple of sentences of contract text (minimum 50 characters).');
      return;
    }
    setError('');
    onAnalyze(contractText.trim(), contractTitle.trim() || 'Pasted_Contract.txt');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Paste Contract Text"
      subtitle="Directly paste agreement clauses or full contract text for instant AI analysis."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Contract Title / Identifier
          </label>
          <input
            type="text"
            value={contractTitle}
            onChange={(e) => setContractTitle(e.target.value)}
            placeholder="e.g. Freelance_Design_Agreement.txt"
            className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Contract Text & Clauses
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {wordCount} words | {contractText.length} chars
            </span>
          </div>
          <textarea
            rows={10}
            value={contractText}
            onChange={(e) => {
              setContractText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste contract clauses here... (e.g. 1. Term and Termination: Client may terminate this agreement at any time without notice... 2. Limitation of Liability: Contractor assumes unlimited liability...)"
            className="w-full p-3 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={wordCount === 0}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles size={14} />
            <span>Analyze Pasted Text</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
