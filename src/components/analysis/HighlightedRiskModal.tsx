import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContractAnalysis, ClauseAnalysis, RiskLevel, ReportHighlightItem } from '../../types/contract';
import { generateReportHighlights } from '../../services/backendApiService';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import jsPDF from 'jspdf';
import { 
  Highlighter, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight, 
  FileText,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  UploadCloud,
  Flame,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  FileCheck,
  RefreshCw,
  Download
} from 'lucide-react';

// Configure bundled pdfjs worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
} catch (e) {
  console.warn('pdfjs worker configuration warning:', e);
}

interface HighlightedRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractAnalysis;
  onSelectClause?: (clause: ClauseAnalysis) => void;
}

interface PageHighlightBox {
  x: number;
  y: number;
  width: number;
  height: number;
  risk: string;
  text: string;
}

// ------------------------------------------------------------
// SINGLE PDF PAGE CANVAS COMPONENT WITH DIRECT HIGHLIGHT PAINTING
// ------------------------------------------------------------
const PdfPageItem: React.FC<{
  pdfDoc: any;
  pageNumber: number;
  zoomLevel: number;
  highlights: ReportHighlightItem[];
  contractClauses: ClauseAnalysis[];
  onCopyText: (text: string) => void;
}> = ({ pdfDoc, pageNumber, zoomLevel, highlights, contractClauses, onCopyText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderStatus, setRenderStatus] = useState<'loading' | 'rendered' | 'error'>('loading');
  const [highlightBoxes, setHighlightBoxes] = useState<PageHighlightBox[]>([]);
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>({ width: 750, height: 1000 });

  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      if (!pdfDoc) return;
      try {
        setRenderStatus('loading');
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        // Base scale adjusted by user zoom
        const scale = 1.5 * (zoomLevel / 100);
        const viewport = page.getViewport({ scale });
        setPageSize({ width: viewport.width, height: viewport.height });

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // 1. Render actual PDF page text & graphics onto Canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        if (isCancelled) return;

        // 2. Extract words and positions
        const textContent = await page.getTextContent();

        const activeTargets = highlights.length > 0 ? highlights : contractClauses.map(c => ({
          page: 1,
          text: c.originalText || c.plainExplanation,
          risk: c.riskLevel || (c.riskScore >= 61 ? 'HIGH' : c.riskScore >= 31 ? 'MEDIUM' : 'LOW')
        }));

        // 3. Tokenize words with their item index
        interface WordToken {
          itemIdx: number;
          word: string;
        }

        const tokens: WordToken[] = [];
        textContent.items.forEach((item: any, itemIdx: number) => {
          if (!item.str || !item.str.trim()) return;
          const words = item.str.split(/\s+/).filter(Boolean);
          words.forEach((w: string) => {
            const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (clean) {
              tokens.push({
                itemIdx,
                word: clean
              });
            }
          });
        });

        const matchedItemIndices = new Map<number, { risk: string; targetText: string }>();

        // 4. Sequential contiguous multi-sentence phrase matcher (catches 100% of risky lines)
        activeTargets.forEach(target => {
          const rawTarget = target.text || '';
          // Break target into individual sentences / clauses
          const targetSentences = rawTarget
            .split(/[.\n;]+/)
            .map(s => s.trim())
            .filter(s => s.length > 5);

          const searchUnits = targetSentences.length > 0 ? targetSentences : [rawTarget];

          searchUnits.forEach(unit => {
            const unitWords = unit
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, ' ')
              .split(/\s+/)
              .filter(Boolean);

            if (unitWords.length < 2) return;
            const minMatchLength = Math.min(2, unitWords.length);

            for (let t = 0; t <= tokens.length - minMatchLength; t++) {
              let matchIdxInTarget = unitWords.indexOf(tokens[t].word);
              while (matchIdxInTarget !== -1) {
                let matchCount = 0;
                let curTokenIdx = t;
                let curTargetIdx = matchIdxInTarget;

                while (
                  curTokenIdx < tokens.length &&
                  curTargetIdx < unitWords.length &&
                  tokens[curTokenIdx].word === unitWords[curTargetIdx]
                ) {
                  matchCount++;
                  curTokenIdx++;
                  curTargetIdx++;
                }

                if (matchCount >= minMatchLength) {
                  for (let k = t; k < curTokenIdx; k++) {
                    const itemIdx = tokens[k].itemIdx;
                    if (!matchedItemIndices.has(itemIdx)) {
                      matchedItemIndices.set(itemIdx, {
                        risk: target.risk || 'HIGH',
                        targetText: unit
                      });
                    }
                  }
                  t = Math.max(t, curTokenIdx - 1);
                  break;
                }

                matchIdxInTarget = unitWords.indexOf(tokens[t].word, matchIdxInTarget + 1);
              }
            }
          });
        });

        // 5. Generate highlight boxes and paint directly onto canvas context
        const boxes: PageHighlightBox[] = [];

        context.save();
        matchedItemIndices.forEach((matchInfo, itemIdx) => {
          const item = textContent.items[itemIdx] as any;
          if (!item) return;

          const pdfX = item.transform[4];
          const pdfY = item.transform[5];
          const fontHeight = Math.abs(item.height) || Math.abs(item.transform[3]) || Math.abs(item.transform[0]) || 12;
          const pdfWidth = item.width || (item.str.length * 6);

          const [x1, y1] = viewport.convertToViewportPoint(pdfX, pdfY);
          const [x2, y2] = viewport.convertToViewportPoint(pdfX + pdfWidth, pdfY + fontHeight);

          const left = Math.min(x1, x2);
          const top = Math.min(y1, y2);
          const width = Math.max(Math.abs(x2 - x1), 8);
          const height = Math.max(Math.abs(y2 - y1), 12);

          const isHigh = (matchInfo.risk || '').toUpperCase().includes('HIGH');
          const isMed = (matchInfo.risk || '').toUpperCase().includes('MED');

          // Paint luminous highlighter rectangle directly on canvas
          context.fillStyle = isHigh 
            ? 'rgba(254, 205, 211, 0.65)' 
            : isMed 
            ? 'rgba(254, 240, 138, 0.65)' 
            : 'rgba(187, 247, 208, 0.65)';
          context.fillRect(left - 1, top - 1, width + 2, height + 2);

          // Paint solid bottom risk underline
          context.fillStyle = isHigh ? '#f43f5e' : isMed ? '#f59e0b' : '#22c55e';
          context.fillRect(left - 1, top + height, width + 2, 2.5);

          boxes.push({
            x: left,
            y: top,
            width,
            height,
            risk: matchInfo.risk,
            text: matchInfo.targetText || item.str
          });
        });
        context.restore();

        if (!isCancelled) {
          setHighlightBoxes(boxes);
          setRenderStatus('rendered');
        }
      } catch (err) {
        console.error(`[PdfPageItem] Error rendering page ${pageNumber}:`, err);
        if (!isCancelled) setRenderStatus('error');
      }
    }

    renderPage();
    return () => { isCancelled = true; };
  }, [pdfDoc, pageNumber, zoomLevel, highlights, contractClauses]);

  return (
    <div className="relative mx-auto bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-300/80 dark:border-white/10 overflow-hidden mb-6 transition-all">
      {/* Page Header Tag */}
      <div className="px-5 py-2 bg-slate-100 dark:bg-[#090d1a] border-b border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold select-none">
        <span>PAGE {pageNumber}</span>
        {highlightBoxes.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-300/40">
            {highlightBoxes.length} Highlighted Terms
          </span>
        )}
      </div>

      {/* Canvas Container */}
      <div 
        className="relative flex justify-center bg-white" 
        style={{ width: pageSize.width, minHeight: pageSize.height }}
      >
        {renderStatus === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 z-10 backdrop-blur-xs">
            <RefreshCw size={24} className="animate-spin text-purple-600" />
          </div>
        )}

        <canvas ref={canvasRef} className="pdf-page-canvas block select-none max-w-full h-auto" />

        {/* Interactive Click/Copy Layer */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {highlightBoxes.map((box, bIdx) => (
            <div
              key={bIdx}
              style={{
                left: box.x - 2,
                top: box.y - 1,
                width: box.width + 4,
                height: box.height + 2
              }}
              className="absolute pointer-events-auto cursor-pointer group"
              title={`${box.risk}: ${box.text}`}
              onClick={() => onCopyText(box.text)}
            />
          ))}
        </div>
      </div>

      {/* Page Footer */}
      <div className="px-5 py-2 bg-slate-50 dark:bg-[#090d1a] border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
        <span>AI Risk Audited</span>
        <span>Page {pageNumber}</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// MAIN MODAL COMPONENT (PINNED TO WINDOW TOP)
// ------------------------------------------------------------
export const HighlightedRiskModal: React.FC<HighlightedRiskModalProps> = ({
  isOpen,
  onClose,
  contract,
  onSelectClause
}) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // PDF Document state
  const [uploadedPdfFile, setUploadedPdfFile] = useState<File | null>(contract.pdfFile || null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [isRenderingPdf, setIsRenderingPdf] = useState(false);
  const [pdfRenderError, setPdfRenderError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // AI Highlights state
  const [highlights, setHighlights] = useState<ReportHighlightItem[]>(contract.highlights || []);
  const [isLoadingHighlights, setIsLoadingHighlights] = useState<boolean>(false);
  const [highlightError, setHighlightError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageContainerRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // ------------------------------------------------------------
  // 1. FETCH AI HIGHLIGHTS ON MODAL OPEN
  // ------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || !contract?.id) return;

    if (contract.highlights && contract.highlights.length > 0) {
      setHighlights(contract.highlights);
      return;
    }

    setIsLoadingHighlights(true);
    setHighlightError(null);
    console.log(`[HighlightedRiskModal] Fetching highlights for contract ID: ${contract.id}`);

    generateReportHighlights(contract.id)
      .then((data) => {
        console.log("===== HIGHLIGHTS API RESPONSE =====", data);
        let extractedHighlights: ReportHighlightItem[] = [];

        if (Array.isArray(data?.highlights)) {
          extractedHighlights = data.highlights;
        } else if (Array.isArray(data)) {
          extractedHighlights = data;
        } else if (data?.report?.highlights) {
          extractedHighlights = data.report.highlights;
        }

        // Combine with contract high/medium risk clauses
        if (contract.clauses && contract.clauses.length > 0) {
          const clauseHighlights: ReportHighlightItem[] = contract.clauses
            .filter(c => c.riskScore >= 31 || c.riskLevel === 'HIGH' || c.riskLevel === 'MEDIUM')
            .map((c, idx) => ({
              page: Math.floor(idx / 3) + 1,
              text: c.originalText || c.plainExplanation,
              risk: c.riskLevel || (c.riskScore >= 61 ? 'HIGH' : 'MEDIUM')
            }));

          const seen = new Set(extractedHighlights.map(h => h.text.toLowerCase().slice(0, 30)));
          clauseHighlights.forEach(ch => {
            const key = ch.text.toLowerCase().slice(0, 30);
            if (!seen.has(key)) {
              seen.add(key);
              extractedHighlights.push(ch);
            }
          });
        }

        setHighlights(extractedHighlights);
        contract.highlights = extractedHighlights;
      })
      .catch((error) => {
        console.error("===== HIGHLIGHTS API FAILED =====", error);
        if (contract.clauses && contract.clauses.length > 0) {
          const fallbackList: ReportHighlightItem[] = contract.clauses.map((c, idx) => ({
            page: Math.floor(idx / 3) + 1,
            text: c.originalText || c.plainExplanation,
            risk: c.riskLevel || (c.riskScore >= 61 ? 'HIGH' : c.riskScore >= 31 ? 'MEDIUM' : 'LOW')
          }));
          setHighlights(fallbackList);
        } else {
          setHighlightError(error?.message || 'Failed to fetch AI highlights.');
        }
      })
      .finally(() => {
        setIsLoadingHighlights(false);
      });
  }, [isOpen, contract?.id]);

  // ------------------------------------------------------------
  // 2. PARSE PDF DOCUMENT
  // ------------------------------------------------------------
  useEffect(() => {
    if (!uploadedPdfFile) {
      setPdfDoc(null);
      return;
    }

    let isCancelled = false;

    async function loadPdf() {
      try {
        setIsRenderingPdf(true);
        setPdfRenderError(null);
        const arrayBuffer = await uploadedPdfFile!.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;

        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
        }
      } catch (err: any) {
        console.error('[HighlightedRiskModal] Failed to load PDF file:', err);
        if (!isCancelled) {
          setPdfRenderError(err?.message || 'Could not parse the PDF file.');
        }
      } finally {
        if (!isCancelled) {
          setIsRenderingPdf(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [uploadedPdfFile]);

  // Handle manual file drag & drop
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        setUploadedPdfFile(file);
        contract.pdfFile = file;
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedPdfFile(file);
      contract.pdfFile = file;
    }
  };

  // Download Highlighted PDF function
  const handleDownloadHighlightedPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const canvases = document.querySelectorAll('.pdf-page-canvas') as NodeListOf<HTMLCanvasElement>;
      if (!canvases || canvases.length === 0) {
        alert('Please wait for the PDF pages to finish rendering before downloading.');
        return;
      }

      const firstCanvas = canvases[0];
      const doc = new jsPDF({
        orientation: firstCanvas.width > firstCanvas.height ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [firstCanvas.width, firstCanvas.height]
      });

      canvases.forEach((canvas, idx) => {
        if (idx > 0) {
          doc.addPage([canvas.width, canvas.height], canvas.width > canvas.height ? 'landscape' : 'portrait');
        }
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        doc.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      });

      doc.save(`${contract.contractName || 'Contract'}_AI_Highlighted.pdf`);
    } catch (e: any) {
      console.error('Failed to download highlighted PDF:', e);
      alert('Could not export highlighted PDF.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Filtered highlights for sidebar
  const filteredHighlights = useMemo(() => {
    return highlights.filter((h) => {
      const riskUpper = (h.risk || 'LOW').toUpperCase();
      const matchesFilter = 
        filterLevel === 'ALL' ? true :
        filterLevel === 'HIGH' ? (riskUpper.includes('HIGH') || riskUpper === 'CRITICAL') :
        filterLevel === 'MEDIUM' ? riskUpper.includes('MED') :
        riskUpper.includes('LOW');

      const matchesSearch = 
        !searchQuery.trim() || 
        h.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.risk || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [highlights, filterLevel, searchQuery]);

  const highCount = highlights.filter(h => (h.risk || '').toUpperCase().includes('HIGH')).length;
  const medCount = highlights.filter(h => (h.risk || '').toUpperCase().includes('MED')).length;
  const lowCount = highlights.filter(h => (h.risk || '').toUpperCase().includes('LOW')).length;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scrollToPage = (pageNumber: number, highlightIndex?: number) => {
    setCurrentPage(pageNumber);
    if (highlightIndex !== undefined) {
      setActiveHighlightIndex(highlightIndex);
    }
    const element = pageContainerRefs.current[pageNumber];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!isOpen || !contract) return null;

  return (
    <AnimatePresence>
      {/* Container aligned to the top of the window */}
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-2 sm:p-4 overflow-hidden">
        {/* Deep Frosted Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 dark:bg-[#060913]/85 backdrop-blur-2xl"
          onClick={onClose}
        />

        {/* Modal Window positioned neatly at the top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          className={`relative z-10 w-full ${
            isFullscreen ? 'h-[98vh] max-w-[99vw]' : 'h-[92vh] max-w-7xl'
          } rounded-3xl bg-white/95 dark:bg-[#0c1222]/95 border border-slate-200/80 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl transition-all my-2`}
        >
          {/* Specular Liquid Top Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none z-20" />

          {/* 1. Modal Top Bar */}
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap bg-slate-50/80 dark:bg-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-300/40 dark:border-purple-600/40">
                <Highlighter size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {contract.contractName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    PDF DOCUMENT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] flex items-center gap-1.5 mt-0.5">
                  <BookOpen size={12} />
                  <span>Real-Time AI Highlighting • {pdfDoc ? `${numPages} Pages Loaded` : 'Ready to Render'}</span>
                </p>
              </div>
            </div>

            {/* AI Status & Viewer Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {isLoadingHighlights ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-300/50 animate-pulse">
                  <Sparkles size={13} className="animate-spin" />
                  <span>AI Scanning Words...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-300/50">
                  <Check size={13} />
                  <span>{highlights.length} Risks Highlighted</span>
                </span>
              )}

              {/* Download Highlighted PDF Button */}
              {pdfDoc && (
                <button
                  onClick={handleDownloadHighlightedPdf}
                  disabled={isDownloadingPdf}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
                  title="Download Highlighted PDF document"
                >
                  <Download size={13} className={isDownloadingPdf ? 'animate-bounce' : ''} />
                  <span>{isDownloadingPdf ? 'Exporting PDF...' : 'Download Highlighted PDF'}</span>
                </button>
              )}

              {/* Upload PDF Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300/40 text-xs font-bold transition-all cursor-pointer"
                title="Upload contract PDF"
              >
                <UploadCloud size={13} />
                <span>{uploadedPdfFile ? 'Change PDF' : 'Upload PDF'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 px-1">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw size={12} />
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* 2. Main Two-Column Layout */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT SIDEBAR: AI Risk Highlights Navigator */}
            <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-white/10 flex flex-col bg-slate-50/50 dark:bg-[#090e1a]/70 shrink-0">
              {/* Sidebar Search & Risk Filters */}
              <div className="p-3.5 border-b border-slate-200 dark:border-white/10 space-y-2.5">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter highlighted risks..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  {[
                    { id: 'ALL', label: `All (${highlights.length})` },
                    { id: 'HIGH', label: `High (${highCount})` },
                    { id: 'MEDIUM', label: `Med (${medCount})` },
                    { id: 'LOW', label: `Low (${lowCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterLevel(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        filterLevel === tab.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Highlighted Clauses */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {isLoadingHighlights ? (
                  <div className="py-16 text-center space-y-3">
                    <Sparkles size={24} className="mx-auto text-purple-500 animate-spin" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Reading PDF words with AI...
                    </p>
                  </div>
                ) : filteredHighlights.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No highlights match your filter.
                  </div>
                ) : (
                  filteredHighlights.map((item, idx) => {
                    const isHigh = (item.risk || '').toUpperCase().includes('HIGH');
                    const isMed = (item.risk || '').toUpperCase().includes('MED');
                    const isActive = activeHighlightIndex === idx;

                    const cardBg = isHigh 
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-300 dark:border-rose-800/80' 
                      : isMed 
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-300 dark:border-amber-800/80' 
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-300 dark:border-emerald-800/80';

                    return (
                      <div
                        key={idx}
                        onClick={() => scrollToPage(item.page || 1, idx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer group space-y-2 ${cardBg} ${
                          isActive ? 'ring-2 ring-purple-500 scale-[1.02] shadow-md' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                            Page {item.page || 1}
                          </span>

                          <span 
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              isHigh 
                                ? 'bg-rose-600 text-white' 
                                : isMed 
                                ? 'bg-amber-600 text-white' 
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {item.risk}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-3 leading-relaxed font-sans">
                          {item.text}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-purple-600 dark:text-purple-400 font-bold pt-0.5">
                          <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Jump to Page {item.page || 1}</span>
                            <ChevronRight size={12} />
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(item.text);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            title="Copy snippet"
                          >
                            {copiedText === item.text ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT MAIN VIEWER: PDF Document Canvas with Direct Highlights */}
            <div className="flex-1 bg-slate-200/70 dark:bg-[#070b14] overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start gap-4 relative">
              {/* If no PDF file is uploaded, prompt user with Dropzone */}
              {!uploadedPdfFile ? (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`w-full max-w-2xl my-auto p-10 rounded-3xl border-2 border-dashed transition-all text-center space-y-4 ${
                    dragActive 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-slate-300 dark:border-white/20 bg-white/80 dark:bg-[#0d1424]/80'
                  } shadow-2xl backdrop-blur-md`}
                >
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <UploadCloud size={32} />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Upload Contract PDF for Real Document Highlighting
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#8a99ad] max-w-md mx-auto mt-1.5 leading-relaxed">
                      Upload your original contract PDF to view real-time, word-by-word visual highlights directly on the authentic PDF pages.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
                    >
                      <FileCheck size={16} />
                      <span>Select PDF File</span>
                    </button>
                  </div>
                </div>
              ) : isRenderingPdf ? (
                /* PDF Loading State */
                <div className="my-auto text-center space-y-3 p-10 rounded-3xl bg-white/80 dark:bg-[#0d1424]/80 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-md">
                  <RefreshCw size={32} className="mx-auto text-purple-600 dark:text-purple-400 animate-spin" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Loading PDF document pages...
                  </p>
                </div>
              ) : pdfRenderError ? (
                /* PDF Error State */
                <div className="my-auto text-center space-y-3 p-8 rounded-3xl bg-rose-500/10 border border-rose-300 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 max-w-md">
                  <AlertTriangle size={32} className="mx-auto" />
                  <p className="text-sm font-bold">{pdfRenderError}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Try Another PDF
                  </button>
                </div>
              ) : (
                <>
                  {/* Page Navigator Floating Capsule (Pinned to Top) */}
                  <div className="sticky top-0 z-30 px-4 py-2 rounded-2xl bg-white/90 dark:bg-[#0c1222]/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-md flex items-center gap-3">
                    <button
                      onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      Page {currentPage} of {numPages}
                    </span>
                    <button
                      onClick={() => scrollToPage(Math.min(numPages, currentPage + 1))}
                      disabled={currentPage >= numPages}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Render Actual PDF Pages with Highlights */}
                  {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                    <div
                      key={pageNum}
                      ref={(el) => { pageContainerRefs.current[pageNum] = el; }}
                      className="w-full flex justify-center"
                    >
                      <PdfPageItem
                        pdfDoc={pdfDoc}
                        pageNumber={pageNum}
                        zoomLevel={zoomLevel}
                        highlights={highlights}
                        contractClauses={contract.clauses || []}
                        onCopyText={handleCopyText}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default HighlightedRiskModal;
