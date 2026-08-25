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

  // Header Banner - Navy Brand Color
  doc.setFillColor(11, 25, 44); // #0B192C
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CLAUSEX — EXECUTIVE CONTRACT RISK REPORT', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Know the risk before you sign • AI-Powered Legal Risk Analysis', margin, 18);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Role: ${contract.userRole.toUpperCase()}`, margin, 24);

  // Metadata Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 34, pageWidth - (margin * 2), 26, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(contract.contractName || 'Contract Document', margin + 4, 41);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Type: ${contract.contractType} | Total Clauses Evaluated: ${contract.clauses.length}`, margin + 4, 47);
  doc.text(`Analysis ID: ${contract.id}`, margin + 4, 53);

  // Risk Score Badge in Card
  const scoreBoxX = pageWidth - margin - 46;
  if (contract.riskLevel === 'HIGH') {
    doc.setFillColor(239, 68, 68);
  } else if (contract.riskLevel === 'MEDIUM') {
    doc.setFillColor(245, 158, 11);
  } else {
    doc.setFillColor(16, 185, 129);
  }
  doc.roundedRect(scoreBoxX, 37, 42, 20, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${contract.overallRiskScore}% RISK`, scoreBoxX + 21, 46, { align: 'center' });

  doc.setFontSize(8);
  doc.text(`${contract.riskLevel} SEVERITY`, scoreBoxX + 21, 52, { align: 'center' });

  // Executive Summary & Explanation
  let currentY = 66;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. EXECUTIVE SUMMARY & RISK ASSESSMENT', margin, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(contract.riskExplanation || contract.contractSummary, pageWidth - (margin * 2));
  doc.text(summaryLines, margin, currentY);
  currentY += (summaryLines.length * 4.5) + 4;

  // Key Contract Terms Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. KEY CONTRACT TERMS', margin, currentY);
  currentY += 4;

  const keyTermsData = [
    ['Duration / Term', contract.keyTerms.duration || 'Not specified'],
    ['Payment / Invoicing', contract.keyTerms.payment || 'Not specified'],
    ['Notice Period', contract.keyTerms.noticePeriod || 'Not specified'],
    ['Renewal Provision', contract.keyTerms.renewal || 'Not specified'],
    ['Governing Jurisdiction', contract.keyTerms.governingLaw || 'Not specified'],
    ['Liability Limitation', contract.keyTerms.liabilityLimit || 'Not specified']
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Key Provision', 'Contractual Terms Extracted']],
    body: keyTermsData,
    theme: 'grid',
    headStyles: { fillColor: [15, 132, 235], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: margin, right: margin }
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // 5 Things Before You Sign
  if (contract.beforeYouSign && contract.beforeYouSign.length > 0) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('3. BEFORE YOU SIGN — 5 CRITICAL CHECKPOINTS', margin, currentY);
    currentY += 6;

    contract.beforeYouSign.forEach((point, index) => {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      
      const pointLines = doc.splitTextToSize(`${index + 1}. ${point}`, pageWidth - (margin * 2) - 8);
      const boxHeight = (pointLines.length * 4) + 4;

      if (currentY + boxHeight > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }

      doc.roundedRect(margin, currentY, pageWidth - (margin * 2), boxHeight, 1, 1, 'FD');
      doc.setTextColor(153, 27, 27);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(pointLines, margin + 4, currentY + 4);
      currentY += boxHeight + 2;
    });

    currentY += 4;
  }

  // Detailed Risky Clauses Analysis
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. DETAILED CLAUSE RISK BREAKDOWN & SAFER ALTERNATIVES', margin, currentY);
  currentY += 4;

  const clauseRows = contract.clauses.map(c => [
    `${c.clauseNumber}\n[${c.category}]\nRisk: ${c.riskScore}% (${c.riskLevel})`,
    `PLAIN ENGLISH MEANING:\n${c.plainExplanation}\n\nWHY RISKY:\n${c.whyRisky}\n\nSUGGESTED SAFER ALTERNATIVE:\n"${c.suggestedAlternative}"`
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Clause & Risk', 'Plain-English Meaning, Risk Assessment & Safer Alternative']],
    body: clauseRows,
    theme: 'striped',
    headStyles: { fillColor: [11, 25, 44], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    columnStyles: {
      0: { cellWidth: 44, fontSize: 8, fontStyle: 'bold' },
      1: { cellWidth: 'auto', fontSize: 8 }
    },
    margin: { left: margin, right: margin }
  });

  // Footer / Legal Disclaimer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'LEGAL DISCLAIMER: ClauseX generates informational risk analyses for educational purposes and does not constitute formal legal counsel. Always consult a licensed attorney.',
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 14, pageHeight - 8);
  }

  // Trigger browser download
  const safeName = (contract.contractName || 'Contract').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Contract_Risk_Report_${safeName}.pdf`);
}
