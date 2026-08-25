import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ContractAnalysis } from '../types/contract';

/**
 * Generates a clean, professional, non-overflowing PDF Risk Report
 * mirroring the exact analytics and data structure of the Dashboard.
 */
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

  // ------------------------------------------------------------
  // 1. BRAND HEADER BANNER
  // ------------------------------------------------------------
  doc.setFillColor(15, 23, 42); // #0F172A (Deep Slate)
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(124, 58, 237); // #7C3AED (Purple)
  doc.rect(0, 27, pageWidth, 1.2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CONTRACT AUDIT & RISK ANALYSIS REPORT', margin, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Document: ${contract.contractName || 'Contract Document'} (Report #${contract.id})`, margin, 17);

  const dateStr = new Date(contract.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  doc.text(`Generated: ${dateStr}  |  Perspective: ${contract.userRole.toUpperCase()} ROLE`, margin, 23);

  // ------------------------------------------------------------
  // 2. DASHBOARD METRICS SUMMARY BAR
  // ------------------------------------------------------------
  const clauses = contract.clauses || [];
  const highRiskCount = clauses.filter(c => c.riskScore >= 61 || c.riskLevel === 'HIGH').length;
  const mediumRiskCount = clauses.filter(c => c.riskScore >= 31 && c.riskScore < 61 && c.riskLevel !== 'HIGH').length;
  const lowRiskCount = clauses.filter(c => c.riskScore < 31 && c.riskLevel !== 'HIGH').length;

  const metricsTableData = [[
    `OVERALL RISK SCORE\n${contract.overallRiskScore}% (${contract.riskLevel} RISK)`,
    `HIGH RISK CLAUSES\n${highRiskCount} Clauses`,
    `MEDIUM RISK CLAUSES\n${mediumRiskCount} Clauses`,
    `LOW / STANDARD CLAUSES\n${lowRiskCount} Clauses`
  ]];

  autoTable(doc, {
    startY: 33,
    body: metricsTableData,
    theme: 'plain',
    styles: {
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      textColor: [15, 23, 42],
      cellPadding: 3.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.3
    },
    columnStyles: {
      0: { 
        fillColor: contract.overallRiskScore >= 61 ? [254, 242, 242] : contract.overallRiskScore >= 31 ? [255, 247, 237] : [240, 253, 244],
        textColor: contract.overallRiskScore >= 61 ? [185, 28, 28] : contract.overallRiskScore >= 31 ? [194, 65, 12] : [21, 128, 61]
      },
      1: { fillColor: [254, 242, 242], textColor: [185, 28, 28] },
      2: { fillColor: [255, 247, 237], textColor: [194, 65, 12] },
      3: { fillColor: [240, 253, 244], textColor: [21, 128, 61] }
    },
    margin: { left: margin, right: margin }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 6;

  // ------------------------------------------------------------
  // 3. EXECUTIVE SUMMARY & DISPLAY HEADLINE
  // ------------------------------------------------------------
  const summaryTitle = contract.displaySummary || `${contract.contractType || 'Contract'} Risk Summary`;
  const summaryBody = contract.contractSummary || contract.displaySummary || 'No executive summary provided for this report.';

  autoTable(doc, {
    startY: currentY,
    head: [['1. EXECUTIVE RISK ASSESSMENT & SUMMARY']],
    body: [[
      `${summaryTitle.toUpperCase()}\n\n${summaryBody}`
    ]],
    theme: 'grid',
    headStyles: {
      fillColor: [124, 58, 237], // Purple
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 4,
      lineHeightFactor: 1.3
    },
    margin: { left: margin, right: margin }
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // ------------------------------------------------------------
  // 4. KEY EXTRACTED CONTRACT TERMS
  // ------------------------------------------------------------
  const keyTerms = contract.keyTerms || ({} as any);
  const keyTermsData = [
    ['Duration / Term', keyTerms.duration || 'Not specified'],
    ['Notice Period', keyTerms.noticePeriod || 'Not specified'],
    ['Parties Involved', keyTerms.parties || `Employer & ${contract.userRole.toUpperCase()}`],
    ['Payment / Invoicing Terms', keyTerms.payment || 'Not specified'],
    ['Start Date / Effective Date', keyTerms.startDate || dateStr],
    ['Governing Jurisdiction & Law', keyTerms.governingLaw || 'Not specified']
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Key Provision', 'Extracted Term Details']],
    body: keyTermsData,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229], // Indigo
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 2.5
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: margin, right: margin }
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // ------------------------------------------------------------
  // 5. RISK CATEGORIES BREAKDOWN (IF AVAILABLE)
  // ------------------------------------------------------------
  const categoriesList: { category: string; risk: number; count: number }[] = [];
  
  if (contract.riskCategories && contract.riskCategories.length > 0) {
    contract.riskCategories.forEach(cat => {
      categoriesList.push({
        category: cat.category,
        risk: cat.risk_percentage,
        count: cat.clauses?.length || 0
      });
    });
  } else if (contract.categoryScores) {
    Object.entries(contract.categoryScores).forEach(([catName, score]) => {
      const matchCount = clauses.filter(c => c.category?.toLowerCase() === catName.toLowerCase()).length;
      categoriesList.push({
        category: catName,
        risk: score,
        count: matchCount
      });
    });
  }

  if (categoriesList.length > 0) {
    const categoryRows = categoriesList
      .sort((a, b) => b.risk - a.risk)
      .map(c => [
        c.category,
        `${c.risk}%`,
        c.risk >= 61 ? 'HIGH RISK' : c.risk >= 31 ? 'MEDIUM RISK' : 'LOW RISK',
        `${c.count} Clause(s)`
      ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Risk Category', 'Risk Score', 'Severity Level', 'Audited Clauses']],
      body: categoryRows,
      theme: 'grid',
      headStyles: {
        fillColor: [51, 65, 85], // Slate
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8.5
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
        cellPadding: 2.5
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center', fontStyle: 'bold' },
        2: { halign: 'center' },
        3: { halign: 'center' }
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: margin, right: margin }
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // ------------------------------------------------------------
  // 6. RANKED CLAUSE FINDINGS & COUNTER-PROPOSALS
  // ------------------------------------------------------------
  if (clauses.length > 0) {
    const sortedClauses = [...clauses].sort((a, b) => b.riskScore - a.riskScore);

    const clauseTableRows = sortedClauses.map((c, index) => {
      const meta = `#${index + 1} RANK • ${c.clauseNumber || `Clause ${index + 1}`}\nCategory: ${c.category || 'General'}\nRisk: ${c.riskScore}% (${c.riskLevel})`;

      let detail = `PLAIN MEANING:\n${c.plainExplanation || 'Standard provision.'}`;
      
      if (c.whyRisky) {
        detail += `\n\nWHY RISKY / HAZARD:\n${c.whyRisky}`;
      }

      if (c.suggestedAlternative) {
        detail += `\n\nRECOMMENDED SAFER ALTERNATIVE:\n"${c.suggestedAlternative}"`;
      }

      if (c.originalText && c.originalText.trim().length > 0) {
        const textSnippet = c.originalText.length > 250 ? c.originalText.substring(0, 247) + '...' : c.originalText;
        detail += `\n\nORIGINAL TEXT SNIPPET:\n"${textSnippet}"`;
      }

      return [meta, detail];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Clause & Risk Level', 'Plain Meaning, Risk Assessment & Counter-Proposals']],
      body: clauseTableRows,
      theme: 'striped',
      showHead: 'everyPage',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8.5
      },
      bodyStyles: {
        fontSize: 7.8,
        textColor: [30, 41, 59],
        cellPadding: 3.5,
        lineHeightFactor: 1.25
      },
      columnStyles: {
        0: { cellWidth: 46, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      },
      margin: { left: margin, right: margin }
    });
  }

  // ------------------------------------------------------------
  // 7. FOOTER ON ALL PAGES
  // ------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    doc.text(
      'ClauseX AI Contract Risk Analysis — For informational & negotiation review only. Not formal legal advice.',
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 16, pageHeight - 7);
  }

  // Save/Download PDF
  const safeFilename = (contract.contractName || `Contract_${contract.id}`)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');
  doc.save(`Contract_Risk_Report_${safeFilename}.pdf`);
}

export default generatePdfRiskReport;
