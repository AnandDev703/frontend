import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
// Use Vite's URL worker resolution for pdfjs-dist
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

export interface ExtractedDocument {
  text: string;
  fileName: string;
  fileSize: string;
  pageCount?: number;
  wordCount: number;
}

export async function extractTextFromFile(file: File): Promise<ExtractedDocument> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const formattedSize = formatFileSize(file.size);

  if (!['pdf', 'docx', 'txt', 'md'].includes(extension || '')) {
    throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT document.');
  }

  if (file.size > 25 * 1024 * 1024) {
    throw new Error('File size exceeds the 25MB limit. Please upload a smaller document.');
  }

  let extractedText = '';
  let pageCount: number | undefined;

  try {
    if (extension === 'txt' || extension === 'md') {
      extractedText = await file.text();
    } else if (extension === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
      if (!extractedText.trim() && result.messages.length > 0) {
        throw new Error('Could not extract text from DOCX. The document might be empty or password protected.');
      }
    } else if (extension === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const loadingTask = pdfjsLib.getDocument({ 
          data: new Uint8Array(arrayBuffer),
          useSystemFonts: true
        });
        const pdfDoc = await loadingTask.promise;
        pageCount = pdfDoc.numPages;

        const textParts: string[] = [];
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item: any) => item.str || '')
            .join(' ');
          
          if (pageText.trim()) {
            textParts.push(`--- Page ${i} ---\n${pageText.trim()}`);
          }
        }
        extractedText = textParts.join('\n\n');
      } catch (pdfErr: any) {
        console.warn('PDF.js extraction error:', pdfErr);
        // Fallback: extract legible ASCII/Unicode text strings without binary PDF headers
        const raw = await file.text();
        const cleaned = cleanPdfBinaryGarbage(raw);
        if (cleaned.length > 50) {
          extractedText = cleaned;
        } else {
          throw new Error('Could not read PDF text. Please ensure the PDF is not a scanned image or password protected.');
        }
      }
    }

    const cleanText = extractedText.trim();
    if (!cleanText || cleanText.length < 20) {
      throw new Error('The uploaded document contains very little or no readable text. Please check the file.');
    }

    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

    return {
      text: cleanText,
      fileName: file.name,
      fileSize: formattedSize,
      pageCount,
      wordCount
    };
  } catch (err: any) {
    console.error('File extraction error:', err);
    throw new Error(err.message || 'Error extracting text from document.');
  }
}

function cleanPdfBinaryGarbage(raw: string): string {
  // Strip PDF headers and binary streams if fallback text was read
  return raw
    .replace(/%PDF-[\s\S]*?stream/g, '')
    .replace(/endstream[\s\S]*?endobj/g, '')
    .replace(/<<[\s\S]*?>>/g, '')
    .replace(/xref[\s\S]*?trailer[\s\S]*?%%EOF/g, '')
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
