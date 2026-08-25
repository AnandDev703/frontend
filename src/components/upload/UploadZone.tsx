import React, { useState, useRef } from 'react';
import { useContract } from '../../context/ContractContext';
import { useUITranslations } from '../../data/uiTranslations';
import { RoleSelector } from './RoleSelector';
import { AnalysisProgress } from './AnalysisProgress';
import { reviewContractWithBackend } from '../../services/backendApiService';
import { saveContractAnalysis } from '../../services/storageService';
import {
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UploadZone: React.FC = () => {
  const {
    userRole,
    setUserRole,
    loadContract,
    refreshHistory,
    setCurrentView,
    selectedLanguage
  } = useContract();

  const t = useUITranslations(selectedLanguage);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setErrorMsg(null);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!['pdf', 'docx', 'txt', 'md'].includes(ext || '')) {
      setErrorMsg('Unsupported file format. Please upload a PDF or DOCX file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a valid contract file first.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      // Direct call to backendApiService.ts with the PDF file
      const contractResult = await reviewContractWithBackend(selectedFile, userRole);

      console.log('===== BACKEND API OUTPUT RECEIVED IN UPLOADZONE =====');
      console.log(contractResult);
      console.log('======================================================');

      let pdfBlobUrl: string | undefined = undefined;
      try {
        if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
          pdfBlobUrl = URL.createObjectURL(selectedFile);
        }
      } catch (e) {
        console.warn('Could not create object URL for PDF:', e);
      }

      const enrichedContract: ContractAnalysis = {
        ...contractResult,
        pdfFile: selectedFile,
        pdfUrl: pdfBlobUrl
      };

      // Save to persistence and history
      await saveContractAnalysis(enrichedContract);
      await refreshHistory();

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Load contract in Dashboard
      loadContract(enrichedContract);
      setCurrentView('dashboard');
    } catch (err: any) {
      console.error('Backend contract review failed:', err);
      setErrorMsg(
        err.message || 'Contract review failed. Please check your backend connection and try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return <AnalysisProgress />;
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="relative max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Dynamic Animated Liquid Glass Background Blobs */}
      <div className="absolute top-0 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-600/30 to-indigo-600/25 blur-3xl -z-10 pointer-events-none liquid-blob-1" />
      <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/25 via-sky-500/20 to-purple-600/25 blur-3xl -z-10 pointer-events-none liquid-blob-2" />
      <div className="absolute bottom-10 left-1/3 w-88 h-88 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 blur-3xl -z-10 pointer-events-none liquid-blob-3" />

      {/* Header */}
      <div className="text-center space-y-2 relative">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full liquid-glass text-purple-700 dark:text-purple-300 text-xs font-black shadow-xs mb-1">
          <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
          <span>Automated Contract Risk Audit</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('upload_page_title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8a99ad] max-w-xl mx-auto leading-relaxed font-medium">
          {t('upload_page_sub')}
        </p>
      </div>

      {/* 1. Liquid Glass Role Selection Card */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass space-y-2 relative overflow-hidden">
        {/* Subtle top specular line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
        <RoleSelector
          selectedRole={userRole}
          onSelectRole={setUserRole}
        />
      </div>

      {/* 2. Liquid Glass Upload Dropzone Card */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass space-y-4 relative overflow-hidden">
        {/* Subtle top specular line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud size={17} className="text-purple-600 dark:text-purple-400" />
            <label className="block text-sm font-black text-slate-900 dark:text-white tracking-tight">
              {t('upload_section_title')}
            </label>
          </div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-[#8a99ad] flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-card">
            <Lock size={11} className="text-emerald-500" />
            <span>Encrypted & Private</span>
          </span>
        </div>

        {/* Drag and drop liquid glass area */}
        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all relative overflow-hidden group ${
              dragActive
                ? 'border-purple-500 bg-purple-500/20 scale-[1.01] shadow-2xl shadow-purple-500/30'
                : 'border-purple-300/60 dark:border-purple-800/50 liquid-glass-card hover:border-purple-500 hover:bg-purple-50/40 dark:hover:bg-purple-950/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {/* Glowing Fluid Icon Container */}
            <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 opacity-25 blur-lg group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-purple-500/35 group-hover:scale-110 transition-transform">
                <UploadCloud size={30} className="animate-pulse" />
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {t('drag_drop_title')}
            </h4>

            <p className="text-xs text-slate-500 dark:text-[#8a99ad] mt-1.5 max-w-sm mx-auto font-medium">
              {t('drag_drop_sub')}
            </p>

            {/* Liquid Glass Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-[11px] text-slate-700 dark:text-slate-200">
              <span className="px-3.5 py-1.5 rounded-xl liquid-glass-card flex items-center gap-1.5 font-bold shadow-2xs">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>Backend Automated Review</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl liquid-glass-card font-bold shadow-2xs">
                {t('private_badge')}
              </span>
            </div>
          </div>
        ) : (
          /* Selected File Liquid Glass Card */
          <div className="p-5 sm:p-6 rounded-2xl liquid-glass-card space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 shrink-0">
                  <FileText size={24} />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#8a99ad] mt-0.5 font-medium flex items-center gap-2">
                    <span>{formatSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      Ready to Review
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                title="Remove file"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/40 dark:border-white/10">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {t('change_doc_btn')}
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-500/35 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-purple-500/45 cursor-pointer"
              >
                <Sparkles size={16} />
                <span>{t('analyze_risks_btn')}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/60 backdrop-blur-md border border-rose-200 dark:border-rose-800/80 flex items-center gap-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 animate-fade-in shadow-xs">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};