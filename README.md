# Contract Risk AI

> **"Know the risk before you sign."**
> AI-Powered Legal Tech SaaS platform for real-time contract risk detection, clause plain-language translation, and negotiating safer terms.

---

## 🌟 Overview

**Contract Risk AI** empowers freelancers, tenants, employees, gig workers, and small business owners to upload complex legal contracts (PDF, DOCX, TXT) and automatically:
1. **Detect High-Hazard Clauses** across 18 distinct legal categories (Unlimited Liability, Unilateral Termination, Sweeping IP Transfer, Deposit Forfeiture, Restrictive Non-Competes, Silent Auto-Renewals).
2. **Assign Perspective-Weighted Risk Scores (0–100%)** based on the user's specific role (e.g. Freelancer vs Tenant).
3. **Translate Legalese into Plain English** with 5-second simplified explanations.
4. **Suggest Balanced, Safer Counter-Clauses** ready for 1-click copying during negotiations.
5. **Multilingual Explanations** supporting **English, Tamil, Hindi, Telugu, and Malayalam**.
6. **"Ask Your Contract" AI Chat** strictly grounded in the document text with clause citation links to eliminate hallucinations.
7. **Executive PDF Audit Reports** downloadable with full risk breakdowns, key terms, and legal summaries.
8. **Side-by-Side Contract Comparison** to compare two agreements and evaluate risk deltas.
9. **Instant Offline Demo Mode** loaded with realistic sample agreements to ensure 100% reliable hackathon judging without requiring an API key.

---

## 🚀 Recommended Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti
- **Document Text Extraction**: `pdfjs-dist` (Client-side PDF text extraction), `mammoth` (DOCX extraction), Native `FileReader` (TXT)
- **AI Engine**: Google Gemini API (`gemini-1.5-flash` / `@google/genai`) with structured JSON schema outputs and grounded Q&A prompts
- **Storage & Auth**: Firebase Auth & Cloud Firestore with automatic local storage fallback for zero-friction guest sessions
- **PDF Generation**: `jspdf` and `jspdf-autotable`

---

## 🛠️ Quick Start

### 1. Installation
```bash
cd contract-risk-ai
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
> *Tip: If no API key is provided, the platform automatically runs in realistic **Demo Fallback Mode** so all features work seamlessly.*

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📋 18 Legal Risk Categories Monitored

1. **Liability** (Uncapped losses, consequential damages)
2. **Indemnification** (Third-party defense mandates, uncapped legal costs)
3. **Termination** (Unilateral termination without notice or cause)
4. **Intellectual Property** (Sweeping assignment of background tools & moral rights)
5. **Penalties** (Liquidated damages, deposit forfeitures)
6. **Non-Compete** (Broad multi-year global restrictions)
7. **Auto Renewal** (Perpetual auto-extension with short cancellation windows)
8. **Payment** (Net-90 delays, pay-when-paid, unilateral deductions)
9. **Hidden Fees** (Surprise maintenance, admin charges)
10. **Refund** (Strict no-refund or clawback policies)
11. **Notice Period** (Zero notice requirements from counterparty)
12. **Dispute Resolution** (Out-of-state arbitration, jury trial waivers)
13. **Governing Law** (Unfavorable remote jurisdictions)
14. **Confidentiality** (Perpetual NDAs, portfolio presentation bans)
15. **Privacy / Data** (Surveillance clauses, unconstrained data transfers)
16. **Cancellation** (Fee forfeiture on contract cancellation)
17. **Warranty** (Uncapped bug-free performance guarantees)
18. **Other Boilerplate** (Unilateral amendment provisions)

---

## ⚡ Key Hackathon Demo Flow (Under 2 Minutes)

1. Open landing page and click **"Try Demo Contract (Instant)"** or **"Analyze My Contract"**.
2. Experience the 5-step animated **AI Contract Extraction Pipeline**.
3. View the **78% High Risk Dashboard** with category distribution chart and the **Before You Sign** 5-point alert box.
4. Click on **Clause 5.1 (Unlimited Liability)** or **Clause 3.2 (Unilateral Termination)** to inspect the plain-English meaning and copy the AI-suggested safer counter-proposal.
5. Switch explanation language to **Tamil, Hindi, Telugu, or Malayalam**.
6. Switch to **"Ask AI"** and test queries like *"Can I cancel this contract early?"* or *"Who owns the IP?"*.
7. Click **"Download Report"** to export an executive multi-page PDF audit report.
8. Navigate to **"Compare"** to see side-by-side risk deltas between two contracts.

---

## 🔒 Security & Privacy

- **Client-Side Processing**: Document extraction runs in-browser without sending raw files to unnecessary third-party servers.
- **API Key Privacy**: User-entered API keys stay in local browser storage and are never logged.
- **Legal Compliance**: Prominent disclaimers remind users that AI summaries are educational and do not constitute formal legal counsel.
