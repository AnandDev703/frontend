import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ContractAnalysis } from '../types/contract';

export function generatePdfRiskReport(contract: ContractAnalysis): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);

  // 1. Header Banner - Deep Indigo Brand Styling
  doc.setFillColor(30, 27, 75); // #1E1B4B
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand Accent Line
  doc.setFillColor(124, 58, 237); // #7C3AED
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  // Header Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CONTRACT RISK & AUDIT REPORT', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(196, 181, 253);
  doc.text('Automated Risk Analysis • Negotiation Counter-Proposals', margin, 18);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })} | Perspective: ${contract.userRole.toUpperCase()}`,
    margin,
    23
  );

  // 2. Document Overview & Risk Score Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 34, contentWidth, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const docTitle = contract.contractName || `Contract Report #${contract.id}`;
  doc.text(docTitle.length > 50 ? docTitle.substring(0, 48) + '...' : docTitle, margin + 4, 41);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Type: ${contract.contractType || 'Legal Agreement'} | Report ID: #${contract.id}`, margin + 4, 47);
  doc.text(`Total Clauses Audited: ${contract.clauses?.length || 0}`, margin + 4, 53);

  // Risk Score Badge Box
  const isHigh = contract.overallRiskScore >= 61;
  const isMed = contract.overallRiskScore >= 31 && contract.overallRiskScore < 61;
  const scoreBoxX = pageWidth - margin - 44;

  if (isHigh) {
    doc.setFillColor(239, 68, 68); // Red
  } else if (isMed) {
    doc.setFillColor(249, 115, 22); // Orange
  } else {
    doc.setFillColor(16, 185, 129); // Green
  }
  doc.roundedRect(scoreBoxX, 37, 40, 20, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${contract.overallRiskScore}% RISK`, scoreBoxX + 20, 46, { align: 'center' });

  doc.setFontSize(7.5);
  doc.text(`${contract.riskLevel} SEVERITY`, scoreBoxX + 20, 52, { align: 'center' });

  // 3. Executive Summary
  let currentY = 66;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('1. EXECUTIVE SUMMARY', margin, currentY);

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const summaryText = contract.displaySummary || contract.contractSummary || contract.riskExplanation || 'Review critical clauses and recommended counter-proposals below before signing.';
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(summaryLines, margin, currentY);
  currentY += (summaryLines.length * 4.2) + 5;

  // 4. Extracted Key Terms Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. KEY EXTRACTED TERMS', margin, currentY);
  currentY += 3.5;

  const keyTermsData = [
    ['Duration / Term', contract.keyTerms?.duration || '12 Months (Renewable)'],
    ['Notice Period', contract.keyTerms?.noticePeriod || '30 Days Notice'],
    ['Parties Involved', contract.keyTerms?.parties || `Employer & You (${contract.userRole})`],
    ['Payment / Invoicing', contract.keyTerms?.payment || 'Standard Compensation'],
    ['Start Date', contract.keyTerms?.startDate || 'As defined in contract'],
    ['Governing Jurisdiction', contract.keyTerms?.governingLaw || 'Applicable Jurisdiction & Laws']
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Key Provision', 'Contractual Term Details']],
    body: keyTermsData,
    theme: 'grid',
    headStyles: { 
      fillColor: [79, 70, 229], // Indigo #4F46E5
      textColor: 255, 
      fontStyle: 'bold', 
      fontSize: 8.5 
    },
    bodyStyles: { 
      fontSize: 8, 
      textColor: [30, 41, 59] 
    },
    columnStyles: {
      0: { cellWidth: 48, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: margin, right: margin }
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // 5. Detailed Clause Breakdown & Counter-Proposals
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. RANKED CLAUSE RISKS & COUNTER-PROPOSALS', margin, currentY);
  currentY += 4;

  const sortedClauses = [...(contract.clauses || [])].sort((a, b) => b.riskScore - a.riskScore);

  const clauseRows = sortedClauses.map((c, idx) => {
    const rankLabel = `#${idx + 1} Rank • ${c.clauseNumber}`;
    const categoryLabel = `[${c.category}]`;
    const riskLabel = `Risk: ${c.riskScore}% (${c.riskLevel})`;

    const col1 = `${rankLabel}\n${categoryLabel}\n${riskLabel}`;
    
    let col2 = `PLAIN MEANING:\n${c.plainExplanation}`;
    if (c.whyRisky) {
      col2 += `\n\nWHY RISKY:\n${c.whyRisky}`;
    }
    if (c.suggestedAlternative) {
      col2 += `\n\nRECOMMENDED SAFER ALTERNATIVE:\n"${c.suggestedAlternative}"`;
    }

    return [col1, col2];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Clause & Risk', 'Plain-English Meaning, Risk Assessment & Recommended Alternative']],
    body: clauseRows,
    theme: 'striped',
    headStyles: { 
      fillColor: [30, 27, 75], // Deep indigo
      textColor: 255, 
      fontStyle: 'bold', 
      fontSize: 8.5 
    },
    columnStyles: {
      0: { cellWidth: 46, fontSize: 8, fontStyle: 'bold' },
      1: { cellWidth: 'auto', fontSize: 7.8 }
    },
    margin: { left: margin, right: margin }
  });

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'LEGAL DISCLAIMER: ClauseX provides informational contract risk reviews for negotiation guidance. Not formal legal advice.',
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 16, pageHeight - 8);
  }

  // Download PDF
  const safeName = (contract.contractName || `Contract_${contract.id}`).replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Contract_Risk_Report_${safeName}.pdf`);
}
export default generatePdfRiskReport;
