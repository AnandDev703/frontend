import { SupportedLanguage } from '../types/contract';

export type TranslationKey =
  // App & Navbar
  | 'app_title'
  | 'app_tagline'
  | 'gemini_active'
  | 'demo_mode'
  | 'sample_data'
  | 'sign_in'
  | 'sign_out'
  | 'my_saved_contracts'
  | 'translate_explanations'
  
  // Sidebar
  | 'nav_dashboard'
  | 'nav_analyze'
  | 'nav_my_contracts'
  | 'nav_compare'
  | 'nav_ask_ai'
  | 'nav_settings'
  | 'active_document'
  | 'perspective'
  | 'instant_demo_title'
  | 'instant_demo_desc'
  | 'try_demo_btn'
  | 'legal_disclaimer_short'

  // Landing Page
  | 'hero_badge'
  | 'hero_title_1'
  | 'hero_title_2'
  | 'hero_subtitle'
  | 'cta_analyze'
  | 'cta_demo'
  | 'stat_categories'
  | 'stat_scoring'
  | 'stat_languages'
  | 'stat_private'
  | 'preview_title'
  | 'preview_sub'
  | 'feature_heading'
  | 'feature_sub'
  | 'feat_1_title'
  | 'feat_1_desc'
  | 'feat_2_title'
  | 'feat_2_desc'
  | 'feat_3_title'
  | 'feat_3_desc'
  | 'feat_4_title'
  | 'feat_4_desc'
  | 'feat_5_title'
  | 'feat_5_desc'
  | 'feat_6_title'
  | 'feat_6_desc'
  | 'how_heading'
  | 'step_1_title'
  | 'step_1_desc'
  | 'step_2_title'
  | 'step_2_desc'
  | 'step_3_title'
  | 'step_3_desc'
  | 'step_4_title'
  | 'step_4_desc'
  | 'disclaimer_title'
  | 'disclaimer_full'

  // Upload & Roles
  | 'upload_page_title'
  | 'upload_page_sub'
  | 'role_section_title'
  | 'role_section_sub'
  | 'role_freelancer'
  | 'role_freelancer_sub'
  | 'role_tenant'
  | 'role_tenant_sub'
  | 'role_employee'
  | 'role_employee_sub'
  | 'role_gig'
  | 'role_gig_sub'
  | 'role_business'
  | 'role_business_sub'
  | 'role_general'
  | 'role_general_sub'
  | 'upload_section_title'
  | 'paste_contract_text'
  | 'drag_drop_title'
  | 'drag_drop_sub'
  | 'client_side_badge'
  | 'private_badge'
  | 'analyze_risks_btn'
  | 'change_doc_btn'
  | 'no_contract_banner_title'
  | 'no_contract_banner_sub'

  // Dashboard & Metrics
  | 'btn_upload_another'
  | 'btn_ask_contract_ai'
  | 'btn_download_report'
  | 'risk_score_label'
  | 'high_risk_label'
  | 'med_risk_label'
  | 'low_risk_label'
  | 'high_risk_clauses'
  | 'med_risk_clauses'
  | 'low_risk_clauses'
  | 'total_evaluated'
  | 'key_terms_title'
  | 'term_duration'
  | 'term_payment'
  | 'term_notice'
  | 'term_jurisdiction'
  | 'before_you_sign_title'
  | 'before_you_sign_sub'
  | 'high_priority_badge'
  | 'top_risks_title'
  | 'top_risks_sub'
  | 'inspect_clause_btn'
  | 'chart_title'
  | 'chart_sub'

  // Viewer & Inspector
  | 'inspector_title'
  | 'inspector_sub'
  | 'tab_structured'
  | 'tab_fulltext'
  | 'search_placeholder'
  | 'filter_all'
  | 'filter_high'
  | 'filter_med'
  | 'filter_low'
  | 'orig_clause_label'
  | 'plain_meaning_label'
  | 'why_risky_label'
  | 'potential_impact_label'
  | 'safer_alt_label'
  | 'copy_alt_btn'
  | 'copied_btn'
  | 'confidence_label'
  | 'ask_ai_clause_btn'

  // Chat
  | 'chat_title'
  | 'chat_clear'
  | 'chat_placeholder'
  | 'chat_send'
  | 'chat_source'
  | 'chat_suggested'

  // Compare
  | 'compare_title'
  | 'compare_sub'
  | 'risk_delta'
  | 'provisions_matrix';

export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  en: {
    app_title: 'ClauseX',
    app_tagline: 'Understand Before You Sign',
    gemini_active: 'Gemini 2.0 Flash Active',
    demo_mode: 'Demo Mode Engine',
    sample_data: 'Sample Data',
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
    my_saved_contracts: 'My Saved Contracts',
    translate_explanations: 'Change Language',

    nav_dashboard: 'Dashboard',
    nav_analyze: 'Analyze Contract',
    nav_my_contracts: 'My Contracts',
    nav_compare: 'Compare',
    nav_ask_ai: 'Ask AI',
    nav_settings: 'Settings',
    active_document: 'Document',
    perspective: 'Perspective',
    instant_demo_title: 'Instant Hackathon Demo',
    instant_demo_desc: 'Test full risk detection with our pre-loaded Freelance MSA contract.',
    try_demo_btn: 'Try Demo Contract',
    legal_disclaimer_short: 'AI analysis for education only. Does not replace professional legal counsel.',

    hero_badge: 'Next-Gen Legal Tech AI Platform',
    hero_title_1: 'Understand Your Contract',
    hero_title_2: 'Before You Sign.',
    hero_subtitle: 'AI-powered contract risk detection that turns complicated legal jargon into simple, actionable insights, highlights dangerous clauses, and suggests safer alternatives.',
    cta_analyze: 'Analyze My Contract',
    cta_demo: 'Try Demo Contract (Instant)',
    stat_categories: 'Risk Categories',
    stat_scoring: 'Weighted Scoring',
    stat_languages: 'Indian Multilingual',
    stat_private: 'Private & Client-Side',
    preview_title: 'Live Contract Risk Detection',
    preview_sub: 'Evaluated from Freelancer perspective',
    feature_heading: 'Everything You Need Before Signing',
    feature_sub: 'Comprehensive Capabilities',
    feat_1_title: 'AI Risk Detection',
    feat_1_desc: 'Detects unlimited liability, unilateral termination, silent auto-renewals, non-competes, and deposit traps across 18 legal categories.',
    feat_2_title: 'Plain English Explanations',
    feat_2_desc: 'Translates complex legal jargon into straightforward 5-second explanations that anyone can grasp instantly.',
    feat_3_title: 'Safer Clause Suggestions',
    feat_3_desc: 'Provides balanced, legally standard counter-clauses with 1-click copy to help you negotiate better terms.',
    feat_4_title: 'Ask Your Contract AI',
    feat_4_desc: 'Chat directly with your contract. Answers are strictly anchored to the text with clause citations to eliminate hallucinations.',
    feat_5_title: 'Executive PDF Audit Reports',
    feat_5_desc: 'Export clean, professional multi-page PDF risk audits containing risk scores, key terms, top risks, and negotiation alternatives.',
    feat_6_title: 'Role-Specific Perspective',
    feat_6_desc: 'Risk is evaluated specifically for your role (Freelancer, Tenant, Employee, Gig Worker, SMB) rather than generic boilerplate.',
    how_heading: 'How It Works',
    step_1_title: 'Upload Contract',
    step_1_desc: 'Drag and drop your PDF, DOCX, or TXT contract, or paste raw text.',
    step_2_title: 'AI Analysis',
    step_2_desc: 'AI parses terms, calculates weighted risk scores, and detects hidden pitfalls.',
    step_3_title: 'Understand Risks',
    step_3_desc: 'Interactive 2-column viewer highlights dangerous clauses in plain English.',
    step_4_title: 'Negotiate & Act',
    step_4_desc: 'Copy safer counter-proposals, chat with AI, and download your risk report.',
    disclaimer_title: '⚠️ Legal Disclaimer & Compliance',
    disclaimer_full: 'Contract Risk AI provides automated risk summaries and linguistic explanations for educational and informational purposes only. This tool does not provide formal legal advice and does not create an attorney-client relationship.',

    upload_page_title: 'Upload Your Contract for Risk Detection',
    upload_page_sub: 'Upload any rental, freelance, employment, or business agreement. Our AI detects risky clauses and explains them in simple language.',
    role_section_title: '1. Select Your Role (Perspective-Weighted Analysis)',
    role_section_sub: 'Risk is tailored to your position',
    role_freelancer: 'Freelancer / Contractor',
    role_freelancer_sub: 'Software devs, designers, consultants',
    role_tenant: 'Tenant / Renter',
    role_tenant_sub: 'Residential & commercial leases',
    role_employee: 'Employee',
    role_employee_sub: 'Full-time / part-time employment',
    role_gig: 'Gig Worker',
    role_gig_sub: 'Platform / on-demand independent workers',
    role_business: 'Small Business Owner',
    role_business_sub: 'Vendors, B2B services, suppliers',
    role_general: 'General Review',
    role_general_sub: 'Standard commercial & legal agreements',
    upload_section_title: '2. Upload Document or Paste Text',
    paste_contract_text: 'Paste Contract Text',
    drag_drop_title: 'Drag and drop your contract here, or browse files',
    drag_drop_sub: 'Supports PDF, DOCX, TXT (up to 15 MB)',
    client_side_badge: '🔒 Client-Side Text Extraction',
    private_badge: '⚡ 100% Private Analysis',
    analyze_risks_btn: 'Analyze Contract Risks',
    change_doc_btn: 'Change Document',
    no_contract_banner_title: "Don't have a contract document ready?",
    no_contract_banner_sub: 'Load our pre-built high-risk Freelance MSA to test full risk detection instantly.',

    btn_upload_another: 'Upload Another Contract',
    btn_ask_contract_ai: 'Ask Contract AI',
    btn_download_report: 'Download Report',
    risk_score_label: 'Risk Score',
    high_risk_label: 'HIGH RISK',
    med_risk_label: 'MEDIUM RISK',
    low_risk_label: 'LOW RISK',
    high_risk_clauses: 'High Risk Clauses',
    med_risk_clauses: 'Medium Risk Clauses',
    low_risk_clauses: 'Low Risk Clauses',
    total_evaluated: 'Total Evaluated',
    key_terms_title: 'Key Contract Terms Extracted',
    term_duration: 'Duration',
    term_payment: 'Payment',
    term_notice: 'Notice Period',
    term_jurisdiction: 'Jurisdiction',
    before_you_sign_title: 'Before You Sign — 5 Critical Checkpoints',
    before_you_sign_sub: 'Read these top takeaways in under 10 seconds before signing or negotiating.',
    high_priority_badge: 'High Priority',
    top_risks_title: 'Highest Hazard Clauses Found',
    top_risks_sub: 'Ranked by weighted severity and legal exposure',
    inspect_clause_btn: 'Inspect & Fix Clause',
    chart_title: 'Risk Distribution by Legal Category',
    chart_sub: 'Weighted severity assessment across key contractual obligations',

    inspector_title: 'Interactive Clause Inspector',
    inspector_sub: 'Click any clause to see its plain-language translation and safer alternative',
    tab_structured: 'Structured Clauses',
    tab_fulltext: 'Full Contract Text',
    search_placeholder: 'Search clauses by keyword (e.g. termination, liability, 90 days)...',
    filter_all: 'All Risks',
    filter_high: 'HIGH Only',
    filter_med: 'MEDIUM Only',
    filter_low: 'LOW Only',
    orig_clause_label: 'Original Contract Clause',
    plain_meaning_label: 'Plain-Language Meaning',
    why_risky_label: 'Why This Is Risky',
    potential_impact_label: 'Potential Real-World Impact',
    safer_alt_label: 'AI Suggested Safer Alternative',
    copy_alt_btn: 'Copy Alternative',
    copied_btn: 'Copied!',
    confidence_label: 'AI Confidence',
    ask_ai_clause_btn: 'Ask AI About This Clause',

    chat_title: 'Ask Your Contract — Grounded AI Assistant',
    chat_clear: 'Clear Chat',
    chat_placeholder: 'Ask anything about your contract (e.g. Can I terminate without penalty?)...',
    chat_send: 'Ask AI',
    chat_source: 'Source',
    chat_suggested: 'Suggested',

    compare_title: 'Side-by-Side Contract Comparison',
    compare_sub: 'Compare legal obligations, liability exposure, and risk deltas between two contracts',
    risk_delta: 'Risk Delta',
    provisions_matrix: 'Key Contract Provisions Matrix'
  },

  ta: {
    app_title: 'ClauseX (கிளாஸ் எக்ஸ்)',
    app_tagline: 'கையெழுத்திடும் முன் உங்கள் ஒப்பந்த ஆபத்தை அறிந்து கொள்ளுங்கள்',
    gemini_active: 'ஜெமினி 2.0 AI செயலில் உள்ளது',
    demo_mode: 'மாதிரி டெமோ பயன்முறை',
    sample_data: 'மாதிரி தரவு',
    sign_in: 'உள்நுழைக',
    sign_out: 'வெளியேறுக',
    my_saved_contracts: 'எனது சேமிக்கப்பட்ட ஒப்பந்தங்கள்',
    translate_explanations: 'மொழியை மாற்றுக',

    nav_dashboard: 'டாஷ்போர்டு',
    nav_analyze: 'ஒப்பந்த ஆய்வு',
    nav_my_contracts: 'எனது ஒப்பந்தங்கள்',
    nav_compare: 'ஒப்பீடு',
    nav_ask_ai: 'AI-யிடம் கேட்க',
    nav_settings: 'அமைப்புகள்',
    active_document: 'ஆவணம்',
    perspective: 'பார்வை',
    instant_demo_title: 'உடனடி ஹேக்கத்தான் டெமோ',
    instant_demo_desc: 'எங்கள் ஃப்ரீலான்ஸ் மாதிரி ஒப்பந்தம் மூலம் அனைத்து அம்சங்களையும் சோதிக்கவும்.',
    try_demo_btn: 'மாதிரி ஒப்பந்தத்தை சோதிக்க',
    legal_disclaimer_short: 'AI பகுப்பாய்வு கல்வி நோக்கங்களுக்காக மட்டுமே. இது சட்ட ஆலோசனை அல்ல.',

    hero_badge: 'அடுத்த தலைமுறை சட்ட AI தளம்',
    hero_title_1: 'கையெழுத்திடும் முன்',
    hero_title_2: 'உங்கள் ஒப்பந்தத்தை புரிந்து கொள்ளுங்கள்.',
    hero_subtitle: 'சிக்கலான சட்ட வாசகங்களை எளிய தமிழ் விளக்கங்களாக மாற்றி, ஆபத்தான விதிகளை சுட்டிக்காட்டி, பாதுகாப்பான மாற்று வாசகங்களை பரிந்துரைக்கும் AI தளம்.',
    cta_analyze: 'என் ஒப்பந்தத்தை ஆய்வு செய்',
    cta_demo: 'மாதிரி ஒப்பந்தத்தை சோதிக்க (உடனடி)',
    stat_categories: 'ஆபத்து பிரிவுகள்',
    stat_scoring: 'எடையிடப்பட்ட மதிப்பீடு',
    stat_languages: 'இந்திய மொழிகள்',
    stat_private: 'முழுமையான தனிஉரிமை',
    preview_title: 'நேரடி ஒப்பந்த அபாய கண்டறிதல்',
    preview_sub: 'ஃப்ரீலான்சர் பார்வையில் மதிப்பிடப்பட்டது',
    feature_heading: 'கையெழுத்திடுவதற்கு முன் உங்களுக்கு தேவையான அனைத்தும்',
    feature_sub: 'முழுமையான திறன்கள்',
    feat_1_title: 'AI அபாய கண்டறிதல்',
    feat_1_desc: 'வரம்பற்ற பொறுப்பு, ஒருதலைப்பட்ச ரத்து, தானியங்கி நீட்டிப்பு போன்ற ஆபத்துகளை 18 பிரிவுகளில் கண்டறிகிறது.',
    feat_2_title: 'எளிய தமிழ் விளக்கங்கள்',
    feat_2_desc: 'கடினமான சட்ட வாசகங்களை 5 வினாடிகளில் எளிதாக புரியும் எளிய மொழியாக மாற்றுகிறது.',
    feat_3_title: 'பாதுகாப்பான மாற்று வாசகங்கள்',
    feat_3_desc: 'ஒரே கிளிக்கில் நகலெடுக்கக்கூடிய நியாயமான மாற்று விதிமுறைகளை பரிந்துரைக்கிறது.',
    feat_4_title: 'ஒப்பந்த AI-யிடம் கேட்கவும்',
    feat_4_desc: 'ஒப்பந்தம் குறித்து நேரடியாக கேள்விகள் கேட்கலாம். ஆதாரம் மற்றும் விதி எண்களுடன் துல்லியமாக பதிலளிக்கும்.',
    feat_5_title: 'நிர்வாக PDF அறிக்கை',
    feat_5_desc: 'அபாய மதிப்பெண்கள், முக்கிய விதிமுறைகள் மற்றும் மாற்று வழிகள் அடங்கிய PDF அறிக்கையை பதிவிறக்கவும்.',
    feat_6_title: 'பயனர் பங்கு சார்ந்த பார்வை',
    feat_6_desc: 'பொதுவானதாக இல்லாமல் உங்கள் தொழில் மற்றும் பங்குக்கு ஏற்ப ஆபத்து மதிப்பிடப்படுகிறது.',
    how_heading: 'இது எவ்வாறு செயல்படுகிறது?',
    step_1_title: 'ஒப்பந்தத்தை பதிவேற்றுக',
    step_1_desc: 'உங்கள் PDF, DOCX, TXT கோப்பை பதிவேற்றவும் அல்லது உரையை ஒட்டவும்.',
    step_2_title: 'AI பகுப்பாய்வு',
    step_2_desc: 'AI விதிமுறைகளை ஆய்வு செய்து மறைக்கப்பட்ட அபாயங்களை கணக்கிடுகிறது.',
    step_3_title: 'ஆபத்துகளை புரிந்துகொள்க',
    step_3_desc: '2-பகுதி காட்சித்திரை மூலம் ஆபத்தான பகுதிகளை வண்ணங்களுடன் காண்க.',
    step_4_title: 'பேசி மாற்றி கையெழுத்திடுக',
    step_4_desc: 'பாதுகாப்பான மாற்று வாசகங்களை நகலெடுத்து பேசி மாற்றி திருப்தியுடன் கையெழுத்திடுங்கள்.',
    disclaimer_title: '⚠️ சட்ட மறுப்பு மற்றும் இணக்கம்',
    disclaimer_full: 'கான்ட்ராக்ட் ரிஸ்க் AI கல்வி மற்றும் தகவல் நோக்கங்களுக்காக மட்டுமே தகவல்களை வழங்குகிறது. இது முறையான சட்ட ஆலோசனை அல்ல.',

    upload_page_title: 'அபாய கண்டறிதலுக்கு உங்கள் ஒப்பந்தத்தை பதிவேற்றவும்',
    upload_page_sub: 'வாடகை, ஃப்ரீலான்ஸ், வேலைவாய்ப்பு அல்லது வணிக ஒப்பந்தத்தை பதிவேற்றவும். AI ஆபத்தான விதிகளை எளிய தமிழில் விளக்கும்.',
    role_section_title: '1. உங்கள் பங்கை தேர்ந்தெடுக்கவும் (பங்கு சார்ந்த மதிப்பீடு)',
    role_section_sub: 'உங்கள் நிலைக்கு ஏற்ப ஆபத்து கணக்கிடப்படுகிறது',
    role_freelancer: 'ஃப்ரீலான்சர் / ஒப்பந்ததாரர்',
    role_freelancer_sub: 'மென்பொருள் வல்லுநர்கள், டிசைனர்கள்',
    role_tenant: 'வாடகைதாரர்',
    role_tenant_sub: 'வீடு மற்றும் வணிக வாடகை',
    role_employee: 'பணியாளர்',
    role_employee_sub: 'முழுநேர / பகுதிநேர வேலை',
    role_gig: 'கிக் ஊழியர்',
    role_gig_sub: 'பிளாட்பார்ம் / டெலிவரி பணியாளர்கள்',
    role_business: 'சிறு தொழில் உரிமையாளர்',
    role_business_sub: 'விற்பனையாளர்கள், B2B சேவைகள்',
    role_general: 'பொதுவான ஆய்வு',
    role_general_sub: 'நிலையான வணிக ஒப்பந்தங்கள்',
    upload_section_title: '2. ஆவணத்தை பதிவேற்றவும் அல்லது உரையை ஒட்டவும்',
    paste_contract_text: 'ஒப்பந்த உரையை ஒட்டுக',
    drag_drop_title: 'ஒப்பந்தக் கோப்பை இங்கே இழுத்து விடவும் அல்லது தேர்வு செய்யவும்',
    drag_drop_sub: 'PDF, DOCX, TXT ஆதரிக்கப்படுகிறது (15 MB வரை)',
    client_side_badge: '🔒 பாதுகாப்பான உள்ளூர் பிரித்தெடுத்தல்',
    private_badge: '⚡ 100% தனிப்பட்ட பகுப்பாய்வு',
    analyze_risks_btn: 'ஒப்பந்த அபாயங்களை ஆய்வு செய்',
    change_doc_btn: 'ஆவணத்தை மாற்றுக',
    no_contract_banner_title: 'ஒப்பந்த ஆவணம் தயாராக இல்லையா?',
    no_contract_banner_sub: 'உடனடியாக சோதிக்க எங்கள் ஃப்ரீலான்ஸ் மாதிரி ஒப்பந்தத்தை ஏற்றவும்.',

    btn_upload_another: 'மற்றொரு ஒப்பந்தத்தை ஆய்வு செய்',
    btn_ask_contract_ai: 'AI-யிடம் கேட்கவும்',
    btn_download_report: 'அறிக்கையை பதிவிறக்குக',
    risk_score_label: 'அபாய மதிப்பெண்',
    high_risk_label: 'அதி தீவிர ஆபத்து',
    med_risk_label: 'நடுத்தர ஆபத்து',
    low_risk_label: 'குறைந்த ஆபத்து',
    high_risk_clauses: 'தீவிர ஆபத்தான விதிகள்',
    med_risk_clauses: 'நடுத்தர ஆபத்தான விதிகள்',
    low_risk_clauses: 'குறைந்த ஆபத்தான விதிகள்',
    total_evaluated: 'மொத்தம் ஆய்வு செய்யப்பட்டவை',
    key_terms_title: 'பிரித்தெடுக்கப்பட்ட முக்கிய ஒப்பந்த விதிமுறைகள்',
    term_duration: 'கால அளவு',
    term_payment: 'பணம் செலுத்துதல்',
    term_notice: 'அறிவிப்பு காலம்',
    term_jurisdiction: 'நீதிமன்ற வரம்பு',
    before_you_sign_title: 'கையெழுத்திடும் முன் — 5 மிக முக்கியமான எச்சரிக்கைகள்',
    before_you_sign_sub: 'கையெழுத்திடும் முன் 10 வினாடிகளில் இந்த 5 முக்கிய அம்சங்களை படியுங்கள்.',
    high_priority_badge: 'முக்கிய முன்னுரிமை',
    top_risks_title: 'கண்டறியப்பட்ட உச்சகட்ட ஆபத்தான விதிகள்',
    top_risks_sub: 'சட்டரீதியான பாதிப்பின் அடிப்படையில் வரிசைப்படுத்தப்பட்டுள்ளது',
    inspect_clause_btn: 'விதியை ஆய்வு செய்து திருத்தவும்',
    chart_title: 'சட்ட பிரிவுகள் வாரியான அபாய பரவல்',
    chart_sub: 'முக்கிய கடமைகள் மீதான எடையிடப்பட்ட தீவிரத்தன்மை',

    inspector_title: 'ஊடாடும் விதி ஆய்வாளர்',
    inspector_sub: 'எந்தவொரு விதியையும் கிளிக் செய்து அதன் எளிய விளக்கத்தையும் மாற்றையும் காண்க',
    tab_structured: 'கட்டமைக்கப்பட்ட விதிகள்',
    tab_fulltext: 'முழு ஒப்பந்த உரை',
    search_placeholder: 'முக்கிய சொற்கள் மூலம் தேடவும் (எ.கா. termination, liability, payment)...',
    filter_all: 'அனைத்து அபாயங்களும்',
    filter_high: 'தீவிர ஆபத்து மட்டும்',
    filter_med: 'நடுத்தர ஆபத்து மட்டும்',
    filter_low: 'குறைந்த ஆபத்து மட்டும்',
    orig_clause_label: 'அசல் ஒப்பந்த விதி',
    plain_meaning_label: 'எளிய தமிழ் விளக்கம்',
    why_risky_label: 'இது ஏன் ஆபத்தானது?',
    potential_impact_label: 'சாத்தியமான நேரடி பாதிப்பு',
    safer_alt_label: 'AI பரிந்துரைக்கும் பாதுகாப்பான மாற்று வாசகம்',
    copy_alt_btn: 'மாற்றை நகலெடு',
    copied_btn: 'நகலெடுக்கப்பட்டது!',
    confidence_label: 'AI நம்பகத்தன்மை',
    ask_ai_clause_btn: 'இந்த விதி குறித்து AI-யிடம் கேட்கவும்',

    chat_title: 'ஒப்பந்த AI உதவி — நேரடி வினா விடை',
    chat_clear: 'அரட்டையை அழிக்கவும்',
    chat_placeholder: 'உங்கள் ஒப்பந்தம் குறித்து ஏதேனும் கேளுங்கள் (எ.கா. முன்னறிவிப்பு இன்றி ரத்து செய்யலாமா?)...',
    chat_send: 'கேட்க',
    chat_source: 'ஆதாரம்',
    chat_suggested: 'பரிந்துரைக்கப்பட்டவை',

    compare_title: 'ஒப்பந்தங்களின் நேரடி ஒப்பீடு',
    compare_sub: 'இரண்டு ஒப்பந்தங்களுக்கு இடையேயான அபாய வேறுபாடுகளை ஒப்பிட்டு காண்க',
    risk_delta: 'அபாய வேறுபாடு',
    provisions_matrix: 'முக்கிய விதிமுறைகள் ஒப்பீட்டு அட்டவணை'
  },

  hi: {
    app_title: 'ClauseX (क्लॉज एक्स)',
    app_tagline: 'हस्ताक्षर करने से पहले अपने अनुबंध के जोखिम को जानें',
    gemini_active: 'जेमिनी 2.0 AI सक्रिय',
    demo_mode: 'डेमो मोड इंजन',
    sample_data: 'नमूना डेटा',
    sign_in: 'साइन इन करें',
    sign_out: 'साइन आउट',
    my_saved_contracts: 'मेरे सहेजे गए अनुबंध',
    translate_explanations: 'भाषा बदलें',

    nav_dashboard: 'डैशबोर्ड',
    nav_analyze: 'अनुबंध विश्लेषण',
    nav_my_contracts: 'मेरे अनुबंध',
    nav_compare: 'तुलना करें',
    nav_ask_ai: 'AI से पूछें',
    nav_settings: 'सेटिंग्स',
    active_document: 'दस्तावेज़',
    perspective: 'दृष्टिकोण',
    instant_demo_title: 'त्वरित हैकाथॉन डेमो',
    instant_demo_desc: 'हमारे फ्रीलांस अनुबंध के साथ संपूर्ण जोखिम जांच का परीक्षण करें।',
    try_demo_btn: 'डेमो अनुबंध आज़माएं',
    legal_disclaimer_short: 'AI विश्लेषण केवल शैक्षणिक उद्देश्य के लिए है। यह कानूनी सलाह नहीं है।',

    hero_badge: 'अगली पीढ़ी का लीगल टेक AI प्लेटफॉर्म',
    hero_title_1: 'हस्ताक्षर करने से पहले',
    hero_title_2: 'अपने अनुबंध को समझें।',
    hero_subtitle: 'AI-संचालित कानूनी जोखिम पहचान प्रणाली जो जटिल कानूनी भाषा को सरल, समझने योग्य जानकारी में बदलती है।',
    cta_analyze: 'मेरे अनुबंध का विश्लेषण करें',
    cta_demo: 'डेमो अनुबंध आज़माएं (त्वरित)',
    stat_categories: 'जोखिम श्रेणियां',
    stat_scoring: 'भारित स्कोरिंग',
    stat_languages: 'भारतीय भाषाएं',
    stat_private: '100% गोपनीय व सुरक्षित',
    preview_title: 'लाइव अनुबंध जोखिम पहचान',
    preview_sub: 'फ्रीलांसर दृष्टिकोण से मूल्यांकित',
    feature_heading: 'हस्ताक्षर करने से पहले आपको जो कुछ भी चाहिए',
    feature_sub: 'व्यापक क्षमताएं',
    feat_1_title: 'AI जोखिम पहचान',
    feat_1_desc: '18 कानूनी श्रेणियों में असीमित देयता, एकतरफा समाप्ति और छुपे हुए नुकसान का पता लगाता है।',
    feat_2_title: 'सरल भाषा में व्याख्या',
    feat_2_desc: 'जटिल कानूनी शब्दों को 5 सेकंड में समझ आने वाली सरल भाषा में अनुवादित करता है।',
    feat_3_title: 'सुरक्षित वैकल्पिक सुझाव',
    feat_3_desc: 'बातचीत के लिए 1-क्लिक कॉपी के साथ संतुलित, कानूनी रूप से सुरक्षित खंड सुझाता है।',
    feat_4_title: 'अनुबंध AI से पूछें',
    feat_4_desc: 'अपने अनुबंध से सीधे प्रश्न पूछें। उत्तर केवल आपके दस्तावेज़ और खंड संख्या पर आधारित होते हैं।',
    feat_5_title: 'PDF ऑडिट रिपोर्ट',
    feat_5_desc: 'जोखिम स्कोर, मुख्य शर्तों और सुरक्षित विकल्पों वाली पेशेवर PDF रिपोर्ट डाउनलोड करें।',
    feat_6_title: 'भूमिका-विशिष्ट दृष्टिकोण',
    feat_6_desc: 'जोखिम का मूल्यांकन आपकी विशिष्ट भूमिका (फ्रीलांसर, किरायेदार, कर्मचारी) के अनुसार किया जाता है।',
    how_heading: 'यह कैसे काम करता है',
    step_1_title: 'अनुबंध अपलोड करें',
    step_1_desc: 'अपना PDF, DOCX, TXT दस्तावेज़ अपलोड करें या टेक्स्ट पेस्ट करें।',
    step_2_title: 'AI विश्लेषण',
    step_2_desc: 'AI शर्तों का विश्लेषण करता है और जोखिम स्कोर की गणना करता है।',
    step_3_title: 'जोखिम समझें',
    step_3_desc: 'इंटरैक्टिव 2-कॉलम व्यूअर खतरनाक खंडों को सरल भाषा में दिखाता है।',
    step_4_title: 'सुरक्षित शर्तें अपनाएं',
    step_4_desc: 'सुरक्षित विकल्पों को कॉपी करें, AI से चर्चा करें और रिपोर्ट डाउनलोड करें।',
    disclaimer_title: '⚠️ कानूनी अस्वीकरण',
    disclaimer_full: 'कॉन्ट्रैक्ट रिस्क AI केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए स्वचालित सारांश प्रदान करता है। यह औपचारिक कानूनी सलाह नहीं है।',

    upload_page_title: 'जोखिम पहचान के लिए अपना अनुबंध अपलोड करें',
    upload_page_sub: 'किराया, फ्रीलांस, रोजगार या व्यावसायिक अनुबंध अपलोड करें। हमारा AI सरल भाषा में व्याख्या करेगा।',
    role_section_title: '1. अपनी भूमिका चुनें (दृष्टिकोण-आधारित विश्लेषण)',
    role_section_sub: 'आपकी स्थिति के अनुसार जोखिम का मूल्यांकन होता है',
    role_freelancer: 'फ्रीलांसर / ठेकेदार',
    role_freelancer_sub: 'सॉफ्टवेयर डेवलपर्स, डिजाइनर्स',
    role_tenant: 'किरायेदार',
    role_tenant_sub: 'आवासीय एवं वाणिज्यिक पट्टे',
    role_employee: 'कर्मचारी',
    role_employee_sub: 'पूर्णकालिक / अंशकालिक रोजगार',
    role_gig: 'गिग वर्कर',
    role_gig_sub: 'ऑन-डिमांड डिलीवरी / प्लेटफॉर्म वर्कर',
    role_business: 'लघु व्यवसाय स्वामी',
    role_business_sub: 'विक्रेता, B2B सेवाएं',
    role_general: 'सामान्य समीक्षा',
    role_general_sub: 'मानक वाणिज्यिक अनुबंध',
    upload_section_title: '2. दस्तावेज़ अपलोड करें या टेक्स्ट पेस्ट करें',
    paste_contract_text: 'अनुबंध टेक्स्ट पेस्ट करें',
    drag_drop_title: 'अपनी फ़ाइल यहां खींचें और छोड़ें, या ब्राउज़ करें',
    drag_drop_sub: 'PDF, DOCX, TXT समर्थित (15 MB तक)',
    client_side_badge: '🔒 सुरक्षित स्थानीय निष्कर्षण',
    private_badge: '⚡ 100% निजी विश्लेषण',
    analyze_risks_btn: 'अनुबंध जोखिमों का विश्लेषण करें',
    change_doc_btn: 'दस्तावेज़ बदलें',
    no_contract_banner_title: 'अनुबंध दस्तावेज़ तैयार नहीं है?',
    no_contract_banner_sub: 'तुरंत परीक्षण के लिए हमारा फ्रीलांस डेमो अनुबंध लोड करें।',

    btn_upload_another: 'दूसरा अनुबंध अपलोड करें',
    btn_ask_contract_ai: 'अनुबंध AI से पूछें',
    btn_download_report: 'रिपोर्ट डाउनलोड करें',
    risk_score_label: 'जोखिम स्कोर',
    high_risk_label: 'उच्च जोखिम',
    med_risk_label: 'मध्यम जोखिम',
    low_risk_label: 'कम जोखिम',
    high_risk_clauses: 'उच्च जोखिम खंड',
    med_risk_clauses: 'मध्यम जोखिम खंड',
    low_risk_clauses: 'कम जोखिम खंड',
    total_evaluated: 'कुल मूल्यांकित खंड',
    key_terms_title: 'निकाली गई मुख्य अनुबंध शर्तें',
    term_duration: 'अवधि',
    term_payment: 'भुगतान',
    term_notice: 'नोटिस अवधि',
    term_jurisdiction: 'अधिकार क्षेत्र',
    before_you_sign_title: 'हस्ताक्षर करने से पहले — 5 महत्वपूर्ण बातें',
    before_you_sign_sub: 'हस्ताक्षर करने से पहले 10 सेकंड में ये 5 मुख्य बिंदु पढ़ें।',
    high_priority_badge: 'उच्च प्राथमिकता',
    top_risks_title: 'पहचाने गए सबसे खतरनाक खंड',
    top_risks_sub: 'कानूनी गंभीरता के आधार पर क्रमबद्ध',
    inspect_clause_btn: 'खंड की जांच करें और सुधारें',
    chart_title: 'कानूनी श्रेणी के अनुसार जोखिम वितरण',
    chart_sub: 'मुख्य कानूनी देनदारियों का मूल्यांकन',

    inspector_title: 'इंटरैक्टिव खंड निरीक्षक',
    inspector_sub: 'किसी भी खंड पर क्लिक करके उसका सरल अर्थ और सुरक्षित विकल्प देखें',
    tab_structured: 'संरचित खंड',
    tab_fulltext: 'पूर्ण अनुबंध टेक्स्ट',
    search_placeholder: 'कीवर्ड द्वारा खंड खोजें (उदा. समाप्ति, देयता, भुगतान)...',
    filter_all: 'सभी जोखिम',
    filter_high: 'केवल उच्च जोखिम',
    filter_med: 'केवल मध्यम जोखिम',
    filter_low: 'केवल कम जोखिम',
    orig_clause_label: 'मूल अनुबंध खंड',
    plain_meaning_label: 'सरल हिंदी अर्थ',
    why_risky_label: 'यह जोखिम भरा क्यों है?',
    potential_impact_label: 'संभावित वास्तविक प्रभाव',
    safer_alt_label: 'AI द्वारा सुझाया गया सुरक्षित विकल्प',
    copy_alt_btn: 'विकल्प कॉपी करें',
    copied_btn: 'कॉपी हो गया!',
    confidence_label: 'AI सटीकता विश्वास',
    ask_ai_clause_btn: 'इस खंड के बारे में AI से पूछें',

    chat_title: 'अनुबंध AI सहायक — सीधे सवाल पूछें',
    chat_clear: 'चैट साफ़ करें',
    chat_placeholder: 'अपने अनुबंध के बारे में कुछ भी पूछें (उदा. क्या मैं बिना पेनल्टी अनुबंध समाप्त कर सकता हूँ?)...',
    chat_send: 'पूछें',
    chat_source: 'स्रोत',
    chat_suggested: 'सुझाव',

    compare_title: 'अनुबंधों की आमने-सामने तुलना',
    compare_sub: 'दो अनुबंधों के बीच कानूनी दायित्वों और जोखिम अंतर की तुलना करें',
    risk_delta: 'जोखिम अंतर',
    provisions_matrix: 'मुख्य अनुबंध शर्तों की तुलना तालिका'
  },

  te: {
    app_title: 'ClauseX (క్లాజ్ ఎక్స్)',
    app_tagline: 'సంతకం చేసే ముందు మీ ఒప్పంద ప్రమాదాన్ని తెలుసుకోండి',
    gemini_active: 'జెమినీ 2.0 AI క్రియాశీలంగా ఉంది',
    demo_mode: 'డెమో మోడ్ ఇంజిన్',
    sample_data: 'నమూనా డేటా',
    sign_in: 'సైన్ ఇన్',
    sign_out: 'సైన్ అవుట్',
    my_saved_contracts: 'నా సేవ్ చేసిన కాంట్రాక్టులు',
    translate_explanations: 'భాషను మార్చండి',

    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_analyze: 'కాంట్రాక్ట్ విశ్లేషణ',
    nav_my_contracts: 'నా కాంట్రాక్టులు',
    nav_compare: 'పోలిక',
    nav_ask_ai: 'AI ని అడగండి',
    nav_settings: 'సెట్టింగ్‌లు',
    active_document: 'పత్రం',
    perspective: 'దృక్కోణం',
    instant_demo_title: 'తక్షణ హ్యాకథాన్ డెమో',
    instant_demo_desc: 'మా ఫ్రీలాన్స్ నమూనా ఒప్పందంతో పూర్తి ఫీచర్లను పరీక్షించండి.',
    try_demo_btn: 'డెమో కాంట్రాక్ట్‌ను ప్రయత్నించండి',
    legal_disclaimer_short: 'AI విశ్లేషణ కేవలం విద్యా ప్రయోజనాల కోసం మాత్రమే. ఇది న్యాయ సలహా కాదు.',

    hero_badge: 'నెక్స్ట్-జెన్ లీగల్ టెక్ AI ప్లాట్‌ఫారమ్',
    hero_title_1: 'సంతకం చేసే ముందు',
    hero_title_2: 'మీ ఒప్పందాన్ని అర్థం చేసుకోండి.',
    hero_subtitle: 'క్లిష్టమైన చట్టపరమైన భాషను సాధారణ, సులభమైన తెలుగు వివరణలుగా మార్చే AI ప్లాట్‌ఫారమ్.',
    cta_analyze: 'నా కాంట్రాక్ట్‌ను విశ్లేషించండి',
    cta_demo: 'డెమో కాంట్రాక్ట్ ప్రయత్నించండి (తక్షణం)',
    stat_categories: 'రిస్క్ కేటగిరీలు',
    stat_scoring: 'వెయిటెడ్ స్కోరింగ్',
    stat_languages: 'భారతీయ భాషలు',
    stat_private: '100% గోప్యమైనది',
    preview_title: 'ప్రత్యక్ష కాంట్రాక్ట్ రిస్క్ గుర్తింపు',
    preview_sub: 'ఫ్రీలాన్సర్ కోణంలో విశ్లేషించబడింది',
    feature_heading: 'సంతకం చేయడానికి ముందు మీకు అవసరమైన ప్రతిదీ',
    feature_sub: 'సమగ్ర సామర్థ్యాలు',
    feat_1_title: 'AI రిస్క్ గుర్తింపు',
    feat_1_desc: 'అపరిమిత బాధ్యత, ఏకపక్ష రద్దు వంటి ప్రమాదకర నిబంధనలను 18 విభాగాలలో గుర్తిస్తుంది.',
    feat_2_title: 'సరళమైన తెలుగు వివరణలు',
    feat_2_desc: 'క్లిష్టమైన చట్టపరమైన నిబంధనలను 5 సెకన్లలో అర్థమయ్యే సాధారణ భాషలోకి మారుస్తుంది.',
    feat_3_title: 'సురక్షితమైన ప్రత్యామ్నాయ సూచనలు',
    feat_3_desc: 'చర్చల కోసం 1-క్లిక్ కాపీతో న్యాయమైన, సురక్షితమైన ప్రత్యామ్నాయాలను సూచిస్తుంది.',
    feat_4_title: 'కాంట్రాక్ట్ AI ని అడగండి',
    feat_4_desc: 'మీ ఒప్పందం గురించి నేరుగా ప్రశ్నలు అడగండి. క్లాజ్ సంఖ్యలతో ఖచ్చితమైన సమాధానాలు ఇస్తుంది.',
    feat_5_title: 'PDF ఆడిట్ నివేదిక',
    feat_5_desc: 'రిస్క్ స్కోర్‌లు, ముఖ్య నిబంధనలు మరియు సురక్షిత ప్రత్యామ్నాయాలతో ప్రొఫెషనల్ PDF రిపోర్ట్ డౌన్‌లోడ్ చేసుకోండి.',
    feat_6_title: 'పాత్ర-ఆధారిత దృక్పథం',
    feat_6_desc: 'మీ వృత్తి మరియు పాత్రకు అనుగుణంగా ప్రమాద తీవ్రత అంచనా వేయబడుతుంది.',
    how_heading: 'ఇది ఎలా పనిచేస్తుంది?',
    step_1_title: 'కాంట్రాక్ట్ అప్‌లోడ్ చేయండి',
    step_1_desc: 'మీ PDF, DOCX, TXT ఫైల్‌ను అప్‌లోడ్ చేయండి లేదా టెక్స్ట్‌ను పేస్ట్ చేయండి.',
    step_2_title: 'AI విశ్లేషణ',
    step_2_desc: 'AI నిబంధనలను పరిశీలించి దాగి ఉన్న రిస్క్‌లను గణిస్తుంది.',
    step_3_title: 'ప్రమాదాలను అర్థం చేసుకోండి',
    step_3_desc: '2-కాలమ్ స్క్రీన్‌లో రంగులతో హైలైట్ చేయబడిన ప్రమాదకర భాగాలను చూడండి.',
    step_4_title: 'సురక్షిత నిబంధనలతో సంతకం చేయండి',
    step_4_desc: 'సురక్షిత ప్రత్యామ్నాయాలను కాపీ చేసి క్లయింట్‌తో చర్చించి సంతకం చేయండి.',
    disclaimer_title: '⚠️ లీగల్ డిస్క్లైమర్',
    disclaimer_full: 'కాంట్రాక్ట్ రిస్క్ AI సమాచార ప్రయోజనాల కోసం మాత్రమే ఆటోమేటెడ్ సారాంశాలను అందిస్తుంది. ఇది న్యాయవాది సలహాకు ప్రత్యామ్నాయం కాదు.',

    upload_page_title: 'రిస్క్ గుర్తింపు కోసం మీ కాంట్రాక్ట్‌ను అప్‌లోడ్ చేయండి',
    upload_page_sub: 'అద్దె, ఫ్రీలాన్స్ లేదా వ్యాపార ఒప్పందాన్ని అప్‌లోడ్ చేయండి. AI సరళమైన తెలుగులో వివరిస్తుంది.',
    role_section_title: '1. మీ పాత్రను ఎంచుకోండి (దృక్పథం ఆధారిత విశ్లేషణ)',
    role_section_sub: 'మీ స్థానానికి తగినట్లు రిస్క్ లెక్కించబడుతుంది',
    role_freelancer: 'ఫ్రీలాన్సర్ / కాంట్రాక్టర్',
    role_freelancer_sub: 'సాఫ్ట్‌వేర్ ఇంజనీర్లు, డిజైనర్లు',
    role_tenant: 'అద్దెదారు',
    role_tenant_sub: 'నివాస మరియు వాణిజ్య లీజులు',
    role_employee: 'ఉద్యోగి',
    role_employee_sub: 'పూర్తి సమయం / పార్ట్ టైమ్ ఉద్యోగం',
    role_gig: 'గిగ్ వర్కర్',
    role_gig_sub: 'డెలివరీ / ప్లాట్‌ఫారమ్ కార్మికులు',
    role_business: 'చిన్న వ్యాపార యజమాని',
    role_business_sub: 'విక్రేతలు, B2B సేవలు',
    role_general: 'సాధారణ సమీక్ష',
    role_general_sub: 'ప్రామాణిక వాణిజ్య ఒప్పందాలు',
    upload_section_title: '2. పత్రాన్ని అప్‌లోడ్ చేయండి లేదా వచనాన్ని అతికించండి',
    paste_contract_text: 'కాంట్రాక్ట్ టెక్స్ట్ పేస్ట్ చేయండి',
    drag_drop_title: 'మీ ఫైల్‌ను ఇక్కడ లాగి వదలండి, లేదా బ్రౌజ్ చేయండి',
    drag_drop_sub: 'PDF, DOCX, TXT మద్దతు ఉంది (15 MB వరకు)',
    client_side_badge: '🔒 సురక్షిత స్థానిక ప్రాసెసింగ్',
    private_badge: '⚡ 100% గోప్యమైన విశ్లేషణ',
    analyze_risks_btn: 'కాంట్రాక్ట్ రిస్క్‌లను విశ్లేషించండి',
    change_doc_btn: 'పత్రాన్ని మార్చండి',
    no_contract_banner_title: 'కాంట్రాక్ట్ పత్రం సిద్ధంగా లేదా?',
    no_contract_banner_sub: 'వెంటనే పరీక్షించడానికి మా ఫ్రీలాన్స్ డెమో కాంట్రాక్ట్‌ను లోడ్ చేయండి.',

    btn_upload_another: 'మరొక కాంట్రాక్ట్‌ను విశ్లేషించండి',
    btn_ask_contract_ai: 'AI ని అడగండి',
    btn_download_report: 'నివేదికను డౌన్‌లోడ్ చేయండి',
    risk_score_label: 'రిస్క్ స్కోరు',
    high_risk_label: 'అధిక ప్రమాదం',
    med_risk_label: 'మధ్యస్థ ప్రమాదం',
    low_risk_label: 'తక్కువ ప్రమాదం',
    high_risk_clauses: 'అధిక ప్రమాదకర నిబంధనలు',
    med_risk_clauses: 'మధ్యస్థ ప్రమాదకర నిబంధనలు',
    low_risk_clauses: 'తక్కువ ప్రమాదకర నిబంధనలు',
    total_evaluated: 'మొత్తం విశ్లేషించినవి',
    key_terms_title: 'గుర్తించబడిన ముఖ్య కాంట్రాక్ట్ నిబంధనలు',
    term_duration: 'కాలపరిమితి',
    term_payment: 'చెల్లింపు',
    term_notice: 'నోటీసు కాలం',
    term_jurisdiction: 'న్యాయ పరిధి',
    before_you_sign_title: 'సంతకం చేసే ముందు — 5 కీలక హెచ్చరికలు',
    before_you_sign_sub: 'సంతకం చేసే ముందు 10 సెకన్లలో ఈ 5 ముఖ్య అంశాలను చదవండి.',
    high_priority_badge: 'అధిక ప్రాధాన్యత',
    top_risks_title: 'గుర్తించబడిన అత్యంత ప్రమాదకర నిబంధనలు',
    top_risks_sub: 'తీవ్రత ఆధారంగా క్రమబద్ధీకరించబడింది',
    inspect_clause_btn: 'నిబంధనను పరిశీలించి సరిదిద్దండి',
    chart_title: 'చట్టపరమైన విభాగాల వారీగా రిస్క్ పంపిణీ',
    chart_sub: 'ముఖ్య బాధ్యతలపై తీవ్రత అంచనా',

    inspector_title: 'ఇంటరాక్టివ్ క్లాజ్ ఇన్స్పెక్టర్',
    inspector_sub: 'ఏదైనా నిబంధనపై క్లిక్ చేసి దాని సరళమైన వివరణ మరియు ప్రత్యామ్నాయాన్ని చూడండి',
    tab_structured: 'నిర్మాణాత్మక నిబంధనలు',
    tab_fulltext: 'పూర్తి కాంట్రాక్ట్ టెక్స్ట్',
    search_placeholder: 'కీవర్డ్ ద్వారా వెతకండి (ఉదా. termination, liability, payment)...',
    filter_all: 'అన్ని రిస్క్‌లు',
    filter_high: 'అధిక రిస్క్ మాత్రమే',
    filter_med: 'మధ్యస్థ రిస్క్ మాత్రమే',
    filter_low: 'తక్కువ రిస్క్ మాత్రమే',
    orig_clause_label: 'అసలు కాంట్రాక్ట్ నిబంధన',
    plain_meaning_label: 'సరళమైన తెలుగు అర్థం',
    why_risky_label: 'ఇది ఎందుకు ప్రమాదకరం?',
    potential_impact_label: 'సంభావ్య వాస్తవ ప్రభావం',
    safer_alt_label: 'AI సూచించిన సురక్షిత ప్రత్యామ్నాయం',
    copy_alt_btn: 'ప్రత్యామ్నాయాన్ని కాపీ చేయండి',
    copied_btn: 'కాపీ చేయబడింది!',
    confidence_label: 'AI విశ్వసనీయత',
    ask_ai_clause_btn: 'ఈ నిబంధన గురించి AI ని అడగండి',

    chat_title: 'కాంట్రాక్ట్ AI సహాయకుడు — ప్రశ్నలు అడగండి',
    chat_clear: 'చాట్ క్లియర్ చేయండి',
    chat_placeholder: 'మీ కాంట్రాక్ట్ గురించి ఏదైనా అడగండి (ఉదా. పెనాల్టీ లేకుండా రద్దు చేయవచ్చా?)...',
    chat_send: 'అడగండి',
    chat_source: 'మూలం',
    chat_suggested: 'సూచనలు',

    compare_title: 'కాంట్రాక్టుల ప్రత్యక్ష పోలిక',
    compare_sub: 'రెండు కాంట్రాక్టుల మధ్య రిస్క్ తేడాలను పోల్చి చూడండి',
    risk_delta: 'రిస్క్ తేడా',
    provisions_matrix: 'ముఖ్య నిబంధనల పోలిక పట్టిక'
  },

  ml: {
    app_title: 'ClauseX (ക്ലോസ് എക്സ്)',
    app_tagline: 'ഒപ്പിടുന്നതിന് മുൻപ് കരാറിലെ അപകടസാധ്യത മനസ്സിലാക്കുക',
    gemini_active: 'ജെമിനി 2.0 AI സജീവം',
    demo_mode: 'ഡെമോ മോഡ് എഞ്ചിൻ',
    sample_data: 'സാമ്പിൾ ഡാറ്റ',
    sign_in: 'സൈൻ ഇൻ ചെയ്യുക',
    sign_out: 'സൈൻ ഔട്ട്',
    my_saved_contracts: 'എന്റെ കരാറുകൾ',
    translate_explanations: 'ഭാഷ മാറ്റുക',

    nav_dashboard: 'ഡാഷ്‌ബോർഡ്',
    nav_analyze: 'കരാർ വിശകലനം',
    nav_my_contracts: 'എന്റെ കരാറുകൾ',
    nav_compare: 'താരതമ്യം',
    nav_ask_ai: 'AI-യോട് ചോദിക്കുക',
    nav_settings: 'ക്രമീകരണങ്ങൾ',
    active_document: 'പ്രമാണം',
    perspective: 'ദൃഷ്ടികോൺ',
    instant_demo_title: 'തത്സമയ ഹാക്കത്തോൺ ഡെമോ',
    instant_demo_desc: 'ഞങ്ങളുടെ ഫ്രീലാൻസ് കരാർ ഉപയോഗിച്ച് എല്ലാ ഫീച്ചറുകളും പരിശോധിക്കുക.',
    try_demo_btn: 'ഡെമോ കരാർ പരീക്ഷിക്കുക',
    legal_disclaimer_short: 'AI വിശകലനം വിവരങ്ങൾക്ക് മാത്രമുള്ളതാണ്. ഇത് നിയമോപദേശമല്ല.',

    hero_badge: 'നെക്സ്റ്റ്-ജെൻ ലീഗൽ ടെക് AI പ്ലാറ്റ്‌ഫോം',
    hero_title_1: 'ഒപ്പിടുന്നതിന് മുൻപ്',
    hero_title_2: 'നിങ്ങളുടെ കരാർ മനസ്സിലാക്കുക.',
    hero_subtitle: 'സങ്കീർണ്ണമായ നിയമവാചകങ്ങളെ ലളിതമായ മലയാള വിശദീകരണങ്ങളാക്കി മാറ്റുന്ന AI പ്ലാറ്റ്‌ഫോം.',
    cta_analyze: 'എന്റെ കരാർ വിശകലനം ചെയ്യുക',
    cta_demo: 'ഡെമോ കരാർ പരീക്ഷിക്കുക (തത്സമയം)',
    stat_categories: 'റിസ്ക് വിഭാഗങ്ങൾ',
    stat_scoring: 'വെയ്റ്റഡ് സ്കോറിംഗ്',
    stat_languages: 'ഇന്ത്യൻ ഭാഷകൾ',
    stat_private: '100% സുരക്ഷിതം',
    preview_title: 'തത്സമയ കരാർ റിസ്ക് കണ്ടെത്തൽ',
    preview_sub: 'ഫ്രീലാൻസർ കാഴ്ചപ്പാടിൽ വിലയിരുത്തിയത്',
    feature_heading: 'ഒപ്പിടുന്നതിന് മുൻപ് നിങ്ങൾക്ക് ആവശ്യമുള്ളതെല്ലാം',
    feature_sub: 'പൂർണ്ണ സവിശേഷതകൾ',
    feat_1_title: 'AI റിസ്ക് കണ്ടെത്തൽ',
    feat_1_desc: 'പരിധിയില്ലാത്ത ബാധ്യത, ഏകപക്ഷീയമായ റദ്ദാക്കൽ തുടങ്ങിയവ 18 വിഭാഗങ്ങളിലായി കണ്ടെത്തുന്നു.',
    feat_2_title: 'ലളിതമായ മലയാള വിശദീകരണങ്ങൾ',
    feat_2_desc: 'സങ്കീർണ്ണമായ നിയമവാചകങ്ങളെ 5 സെക്കൻഡിൽ മനസ്സിലാകുന്ന ഭാഷയിലേക്ക് മാറ്റുന്നു.',
    feat_3_title: 'സുരക്ഷിതമായ ബദൽ നിർദ്ദേശങ്ങൾ',
    feat_3_desc: 'ക്ലയന്റുമായി സംസാരിക്കുന്നതിനായി 1-ക്ലിക്ക് കോപ്പി വഴി സുരക്ഷിതമായ വാചകങ്ങൾ നൽകുന്നു.',
    feat_4_title: 'കരാർ AI-യോട് ചോദിക്കുക',
    feat_4_desc: 'കരാറിനെക്കുറിച്ച് നേരിട്ട് സംശയങ്ങൾ ചോദിക്കാം. കൃത്യമായ വകുപ്പ് നമ്പറുകളോടെ മറുപടി ലഭിക്കും.',
    feat_5_title: 'PDF ഓഡിറ്റ് റിപ്പോർട്ട്',
    feat_5_desc: 'റിസ്ക് സ്കോറുകളും സുരക്ഷിത ബദലുകളും അടങ്ങിയ പ്രൊഫഷണൽ PDF റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക.',
    feat_6_title: 'തൊഴിൽ അധിഷ്ഠിത കാഴ്ചപ്പാട്',
    feat_6_desc: 'നിങ്ങളുടെ തൊഴിലിനും പങ്കിനും അനുയോജ്യമായ രീതിയിൽ അപകടസാധ്യത കണക്കാക്കുന്നു.',
    how_heading: 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു?',
    step_1_title: 'കരാർ അപ്‌ലോഡ് ചെയ്യുക',
    step_1_desc: 'നിങ്ങളുടെ PDF, DOCX, TXT ഫയൽ അപ്‌ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ ടെക്സ്റ്റ് ഒട്ടിക്കുക.',
    step_2_title: 'AI വിശകലനം',
    step_2_desc: 'AI നിയമപരമായ നിബന്ധനകൾ പരിശോധിച്ച് റിസ്ക് സ്കോർ കണക്കാക്കുന്നു.',
    step_3_title: 'റിസ്കുകൾ മനസ്സിലാക്കുക',
    step_3_desc: '2-കോളം സ്ക്രീനിൽ നിറങ്ങളോടെ അപകടസാധ്യതയുള്ള ഭാഗങ്ങൾ കാണുക.',
    step_4_title: 'സുരക്ഷിതമായി ഒപ്പിടുക',
    step_4_desc: 'സുരക്ഷിത ബദലുകൾ ഉപയോഗിച്ച് ക്ലയന്റുമായി സംസാരിച്ച് സുരക്ഷിതമായി ഒപ്പിടുക.',
    disclaimer_title: '⚠️ നിയമപരമായ അറിയിപ്പ്',
    disclaimer_full: 'കോൺട്രാക്ട് റിസ്ക് AI വിദ്യാഭ്യാസ വിവരങ്ങൾക്ക് മാത്രമുള്ളതാണ്. ഇത് ഔദ്യോഗിക നിയമോപദേശമല്ല.',

    upload_page_title: 'റിസ്ക് പരിശോധനയ്ക്കായി കരാർ അപ്‌ലോഡ് ചെയ്യുക',
    upload_page_sub: 'വാടക, ഫ്രീലാൻസ് അല്ലെങ്കിൽ ബിസിനസ്സ് കരാർ അപ്‌ലോഡ് ചെയ്യുക. AI ലളിതമായി വിശദീകരിക്കും.',
    role_section_title: '1. നിങ്ങളുടെ പങ്ക് തിരഞ്ഞെടുക്കുക (റോൾ അടിസ്ഥാനമാക്കിയുള്ള വിലയിരുത്തൽ)',
    role_section_sub: 'നിങ്ങളുടെ സ്ഥാനത്തിന് അനുയോജ്യമായി റിസ്ക് കണക്കാക്കുന്നു',
    role_freelancer: 'ഫ്രീലാൻസർ / കോൺട്രാക്ടർ',
    role_freelancer_sub: 'സോഫ്റ്റ്‌വെയർ ഡെവലപ്പർമാർ, ഡിസൈനർമാർ',
    role_tenant: 'വാടകക്കാരൻ',
    role_tenant_sub: 'താമസ, വാണിജ്യ വാടകക്കരാറുകൾ',
    role_employee: 'ജീവനക്കാരൻ',
    role_employee_sub: 'മുഴുസമയ / പാർട്ട് ടൈം ജോലി',
    role_gig: 'ഗിഗ് വർക്കർ',
    role_gig_sub: 'ഡെലിവറി / പ്ലാറ്റ്‌ഫോം തൊഴിലാളികൾ',
    role_business: 'ചെറുകിട ബിസിനസ്സ് ഉടമ',
    role_business_sub: 'വെണ്ടർമാർ, B2B സേവനങ്ങൾ',
    role_general: 'പൊതുവായ പരിശോധന',
    role_general_sub: 'സാധാരണ വാണിജ്യ കരാറുകൾ',
    upload_section_title: '2. പ്രമാണം അപ്‌ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ ടെക്സ്റ്റ് ഒട്ടിക്കുക',
    paste_contract_text: 'കരാർ ടെക്സ്റ്റ് ഒട്ടിക്കുക',
    drag_drop_title: 'ഫയൽ ഇവിടെ ഇടുക, അല്ലെങ്കിൽ തിരഞ്ഞെടുക്കുക',
    drag_drop_sub: 'PDF, DOCX, TXT പിന്തുണയ്ക്കുന്നു (15 MB വരെ)',
    client_side_badge: '🔒 സുരക്ഷിതമായ പ്രോസസ്സിംഗ്',
    private_badge: '⚡ 100% സ്വകാര്യ വിശകലനം',
    analyze_risks_btn: 'കരാറിലെ റിസ്കുകൾ വിശകലനം ചെയ്യുക',
    change_doc_btn: 'ഫയൽ മാറ്റുക',
    no_contract_banner_title: 'കരാർ പ്രമാണം കൈവശമില്ലേ?',
    no_contract_banner_sub: 'ഉടൻ പരീക്ഷിക്കാൻ ഞങ്ങളുടെ ഫ്രീലാൻസ് ഡെമോ കരാർ ഉപയോഗിക്കുക.',

    btn_upload_another: 'മറ്റൊരു കരാർ പരിശോധിക്കുക',
    btn_ask_contract_ai: 'AI-യോട് ചോദിക്കുക',
    btn_download_report: 'റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക',
    risk_score_label: 'റിസ്ക് സ്കോർ',
    high_risk_label: 'ഉയർന്ന അപകടസാധ്യത',
    med_risk_label: 'ഇടത്തരം അപകടസാധ്യത',
    low_risk_label: 'കുറഞ്ഞ അപകടസാധ്യത',
    high_risk_clauses: 'ഉയർന്ന അപകടമുള്ള വകുപ്പുകൾ',
    med_risk_clauses: 'ഇടത്തരം അപകടമുള്ള വകുപ്പുകൾ',
    low_risk_clauses: 'കുറഞ്ഞ അപകടമുള്ള വകുപ്പുകൾ',
    total_evaluated: 'ആകെ പരിശോധിച്ചവ',
    key_terms_title: 'കണ്ടെത്തിയ പ്രധാന കരാർ വ്യവസ്ഥകൾ',
    term_duration: 'കാലാവധി',
    term_payment: 'വേതനം',
    term_notice: 'നോട്ടീസ് കാലാവധി',
    term_jurisdiction: 'കോടതി പരിധി',
    before_you_sign_title: 'ഒപ്പിടുന്നതിന് മുൻപ് — 5 പ്രധാന മുന്നറിയിപ്പുകൾ',
    before_you_sign_sub: 'ഒപ്പിടുന്നതിന് മുൻപ് 10 സെക്കൻഡിൽ ഈ 5 പ്രധാന കാര്യങ്ങൾ വായിക്കുക.',
    high_priority_badge: 'പ്രധാന മുൻഗണന',
    top_risks_title: 'കണ്ടെത്തിയ ഏറ്റവും അപകടകരമായ വകുപ്പുകൾ',
    top_risks_sub: 'തീവ്രതയുടെ അടിസ്ഥാനത്തിൽ ക്രമീകരിച്ചത്',
    inspect_clause_btn: 'വകുപ്പ് പരിശോധിച്ച് തിരുത്തുക',
    chart_title: 'നിയമ വിഭാഗങ്ങൾ തിരിച്ചുള്ള റിസ്ക് വിതരണം',
    chart_sub: 'പ്രധാന ബാധ്യതകളുടെ അപകടസാധ്യത കണക്കാക്കൽ',

    inspector_title: 'ഇന്ററാക്ടീവ് വകുപ്പ് ഇൻസ്പെക്ടർ',
    inspector_sub: 'ഏതെങ്കിലും വകുപ്പിൽ ക്ലിക്ക് ചെയ്ത് ലളിതമായ അർത്ഥവും ബദലും കാണുക',
    tab_structured: 'ക്രമീകരിച്ച വകുപ്പുകൾ',
    tab_fulltext: 'മുഴുവൻ കരാർ ടെക്സ്റ്റ്',
    search_placeholder: 'തിരയുക (ഉദാ: termination, liability, payment)...',
    filter_all: 'എല്ലാ റിസ്കുകളും',
    filter_high: 'ഉയർന്ന റിസ്ക് മാത്രം',
    filter_med: 'ഇടത്തരം റിസ്ക് മാത്രം',
    filter_low: 'കുറഞ്ഞ റിസ്ക് മാത്രം',
    orig_clause_label: 'യഥാർത്ഥ കരാർ വകുപ്പ്',
    plain_meaning_label: 'ലളിതമായ മലയാള അർത്ഥം',
    why_risky_label: 'ഇത് എന്തുകൊണ്ട് അപകടകരമാണ്?',
    potential_impact_label: 'സാധ്യമായ യഥാർത്ഥ പ്രത്യാഘാതം',
    safer_alt_label: 'AI നിർദ്ദേശിക്കുന്ന സുരക്ഷിത ബദൽ',
    copy_alt_btn: 'ബദൽ കോപ്പി ചെയ്യുക',
    copied_btn: 'കോപ്പി ചെയ്തു!',
    confidence_label: 'AI കൃത്യത',
    ask_ai_clause_btn: 'ഈ വകുപ്പിനെക്കുറിച്ച് AI-യോട് ചോദിക്കുക',

    chat_title: 'കരാർ AI സഹായി — സംശയങ്ങൾ ചോദിക്കാം',
    chat_clear: 'ചാറ്റ് മായ്ക്കുക',
    chat_placeholder: 'കരാറിനെക്കുറിച്ച് എന്തും ചോദിക്കാം...',
    chat_send: 'ചോദിക്കുക',
    chat_source: 'ഉറവിടം',
    chat_suggested: 'നിർദ്ദേശങ്ങൾ',

    compare_title: 'കരാറുകളുടെ താരതമ്യം',
    compare_sub: 'രണ്ട് കരാറുകൾ തമ്മിലുള്ള റിസ്ക് വ്യത്യാസങ്ങൾ താരതമ്യം ചെയ്യുക',
    risk_delta: 'റിസ്ക് വ്യത്യാസം',
    provisions_matrix: 'പ്രധാന കരാർ വ്യവസ്ഥകളുടെ താരതമ്യ പട്ടിക'
  }
};

export function useUITranslations(lang: SupportedLanguage) {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  return (key: TranslationKey): string => {
    return dict[key] || UI_TRANSLATIONS.en[key] || key;
  };
}
