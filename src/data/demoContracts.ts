import { ContractAnalysis } from '../types/contract';

export const DEMO_FREELANCE_CONTRACT: ContractAnalysis = {
  id: 'demo-freelance-msa-2026',
  contractName: 'Master_Services_Agreement_TechFlow.pdf',
  userRole: 'freelancer',
  createdAt: new Date().toISOString(),
  fileSize: '248 KB',
  isDemo: true,
  contractType: 'Freelance Master Services Agreement',
  contractSummary: 'Master Services Agreement for software development and UI design consulting between TechFlow Enterprise Solutions LLC and independent contractor.',
  overallRiskScore: 78,
  riskLevel: 'HIGH',
  riskExplanation: 'Overall risk is 78% (HIGH) because the contract contains 4 critical high-impact clauses including uncapped unlimited liability, one-sided termination without notice, sweeping assignment of pre-existing intellectual property, and a 24-month global non-compete.',
  keyTerms: {
    duration: '12 Months (with silent auto-renewal)',
    payment: '$6,500 / month (Net 90 days delay)',
    noticePeriod: '0 days for Client / 60 days for Contractor',
    renewal: 'Automatic 1-year renewals unless opted out 90 days prior',
    governingLaw: 'State of Delaware, USA (Mandatory Arbitration)',
    liabilityLimit: 'Unlimited for Contractor / Capped at $100 for Client',
    ipOwnership: 'Full assignment of all pre-existing and future creations'
  },
  riskCounts: {
    high: 4,
    medium: 3,
    low: 3,
    total: 10
  },
  categoryScores: {
    'Liability': 94,
    'Termination': 88,
    'Intellectual Property': 85,
    'Indemnification': 82,
    'Non-Compete': 78,
    'Auto Renewal': 65,
    'Payment': 55,
    'Dispute Resolution': 50,
    'Confidentiality': 20,
    'Notice Period': 80
  },
  topRisks: [
    {
      category: 'Liability',
      riskScore: 94,
      riskLevel: 'HIGH',
      summary: 'Unlimited liability forcing you to pay for all direct, indirect, and consequential client losses without any financial cap.',
      clauseNumber: 'Clause 5.1'
    },
    {
      category: 'Termination',
      riskScore: 88,
      riskLevel: 'HIGH',
      summary: 'Client can terminate immediately without cause, notice, or paying for completed milestone work in progress.',
      clauseNumber: 'Clause 3.2'
    },
    {
      category: 'Intellectual Property',
      riskScore: 85,
      riskLevel: 'HIGH',
      summary: 'You lose ownership of your own pre-existing code libraries, tools, and background intellectual property.',
      clauseNumber: 'Clause 4.3'
    },
    {
      category: 'Indemnification',
      riskScore: 82,
      riskLevel: 'HIGH',
      summary: 'You are obligated to defend the client against third-party lawsuits and pay their high legal defense fees.',
      clauseNumber: 'Clause 6.1'
    },
    {
      category: 'Non-Compete',
      riskScore: 78,
      riskLevel: 'HIGH',
      summary: 'Prohibits working with any company in the same broad tech sector worldwide for 2 full years after contract ends.',
      clauseNumber: 'Clause 7.2'
    }
  ],
  beforeYouSign: [
    'The client can cancel your contract at any second with 0 days notice and withhold payment for in-progress work.',
    'You are exposed to unlimited personal financial liability with no cap, while the client\'s liability is capped at $100.',
    'All your proprietary pre-existing software tools and background IP are irrevocably transferred to the client.',
    'You are legally barred from taking any other freelance clients in this industry globally for 24 months.',
    'Payment is on Net-90 day terms, meaning you might wait 3 months after invoice approval before receiving funds.'
  ],
  beforeYouSignTranslations: {
    ta: [
      'முன்னறிவிப்பு இன்றி வாடிக்கையாளர் எந்த நேரத்திலும் ஒப்பந்தத்தை ரத்து செய்து பணம் தராமல் போகலாம்.',
      'உங்களுக்கு வரம்பற்ற நிதிப் பொறுப்பு உள்ளது, ஆனால் வாடிக்கையாளரின் பொறுப்பு வெறும் \$100 மட்டுமே.',
      'உங்கள் சொந்த பழைய டூல்ஸ் மற்றும் ஐபி உரிமைகள் வாடிக்கையாளருக்கே நிரந்தரமாக செல்கின்றன.',
      'ஒப்பந்தம் முடிந்த பிறகு 24 மாதங்களுக்கு இந்த துறையில் வேறு எங்கும் வேலை செய்ய தடை உள்ளது.',
      'இன்வாய்ஸ் கொடுத்த 90 நாட்களுக்கு (3 மாதங்கள்) பிறகே பணம் வழங்கப்படும்.'
    ],
    hi: [
      'क्लाइंट बिना किसी नोटिस के कभी भी कॉन्ट्रैक्ट समाप्त कर सकता है और काम का भुगतान रोक सकता है।',
      'आप पर असीमित व्यक्तिगत वित्तीय देनदारी है, जबकि क्लाइंट की देयता केवल \$100 तक सीमित है।',
      'आपके सभी पूर्व-मौजूदा सॉफ्टवेयर टूल्स और आईपी का मालिकाना हक क्लाइंट को हस्तांतरित हो जाता है।',
      'अनुबंध समाप्त होने के बाद 24 महीने तक आप इस उद्योग में कोई अन्य काम नहीं कर सकते।',
      'भुगतान 90 दिनों की देरी से होगा, यानी आपको इनवॉइस के 3 महीने बाद पैसे मिलेंगे।'
    ],
    te: [
      'క్లయింట్ ఎటువంటి నోటీసు లేకుండా ఎప్పుడైనా ఒప్పందాన్ని రద్దు చేయవచ్చు మరియు డబ్బును నిలిపివేయవచ్చు.',
      'మీపై అపరిమిత వ్యక్తిగత బాధ్యత ఉంటుంది, కానీ క్లయింట్ బాధ్యత కేవలం \$100 మాత్రమే.',
      'మీ మునుపటి సాఫ్ట్‌వేర్ టూల్స్ మరియు మేధో సంపత్తి హక్కులు అన్నీ క్లయింట్‌కు బదిలీ అవుతాయి.',
      'కాంట్రాక్ట్ ముగిసిన తర్వాత 24 నెలల పాటు ప్రపంచవ్యాప్తంగా ఇతర క్లయింట్లతో పని చేయకూడదు.',
      'చెల్లింపు నిబంధన 90 రోజులు, అంటే ఇన్వాయిస్ తర్వాత 3 నెలలు వేచి ఉండాలి.'
    ],
    ml: [
      'ക്ലയന്റിന് എപ്പോൾ വേണമെങ്കിലും മുന്നറിയിപ്പില്ലാതെ കരാർ റദ്ദാക്കാനും പണം നൽകാതിരിക്കാനും കഴിയും.',
      'നിങ്ങൾക്ക് പരിധിയില്ലാത്ത ബാധ്യതയുണ്ട്, എന്നാൽ ക്లയന്റിന്റെ ബാധ്യത \$100 മാത്രമാണ്.',
      'നിങ്ങളുടെ മുൻകാല ടൂളുകളും ഐപി അവകാശങ്ങളും ക്ലയന്റിന് പൂർണ്ണമായും കൈമാറുന്നു.',
      'കരാർ കഴിഞ്ഞ് 24 മാസത്തേക്ക് ഈ രംഗത്ത് മറ്റ് ജോലികൾ ചെയ്യാൻ വിലക്കുണ്ട്.',
      'ഇൻവോയ്സ് നൽകി 90 ദിവസങ്ങൾക്ക് (3 മാസം) ശേഷമേ പണം ലഭിക്കൂ.'
    ]
  },
  clauses: [
    {
      clauseNumber: 'Clause 1.1',
      category: 'Other',
      title: 'Engagement and Scope of Services',
      originalText: 'Contractor agrees to perform software development, UI design, and consulting services as designated in applicable Statements of Work (SOW). Contractor shall devote their best professional efforts to achieve client objectives.',
      riskScore: 15,
      riskLevel: 'LOW',
      plainExplanation: 'You are agreeing to provide the specific software and design services described in the project work orders.',
      whyRisky: 'Standard engagement clause. Ensure each Statement of Work has clear boundaries so the client cannot add free extra work.',
      potentialImpact: 'Minimal risk as long as you approve each Statement of Work before beginning tasks.',
      suggestedAlternative: 'Contractor agrees to perform specific software development and design milestones explicitly detailed in mutually executed Statements of Work.',
      confidence: 96,
      translations: {
        ta: {
          plainExplanation: 'திட்ட ஒப்பந்தத்தில் குறிப்பிடப்பட்டுள்ள மென்பொருள் மற்றும் வடிவமைப்பு சேவைகளை நீங்கள் வழங்க ஒப்புக்கொள்கிறீர்கள்.',
          whyRisky: 'இது வழக்கமான விதிமுறை. கூடுதல் இலவச வேலைகளை வாடிக்கையாளர் திணிக்காமல் இருக்க வரம்புகளை தெளிவாக வைக்கவும்.',
          suggestedAlternative: 'இரு தரப்பினரும் ஒப்புக்கொண்ட பணி அறிக்கையில் உள்ள குறிப்பிட்ட பணிகளை மட்டுமே ஒப்பந்ததாரர் செய்வார்.'
        },
        hi: {
          plainExplanation: 'आप प्रोजेक्ट वर्क ऑर्डर में दिए गए सॉफ़्टवेयर और डिज़ाइन कार्य को प्रदान करने के लिए सहमत हैं।',
          whyRisky: 'यह एक सामान्य खंड है। ध्यान रखें कि क्लाइंट बिना अतिरिक्त भुगतान के अतिरिक्त काम न जोड़े।',
          suggestedAlternative: 'ठेकेदार केवल दोनों पक्षों द्वारा हस्ताक्षरित कार्य विवरण में उल्लिखित कार्यों को ही पूरा करेगा।'
        },
        te: {
          plainExplanation: 'ప్రాజెక్ట్ వర్క్ ఆర్డర్‌లలో పేర్కొన్న సాఫ్ట్‌వేర్ మరియు డిజైన్ సేవలను అందించడానికి మీరు అంగీకరిస్తున్నారు.',
          whyRisky: 'ఇది సాధారణ నిబంధన. క్లయింట్ ఉచిత అదనపు పనిని జోడించకుండా పని పరిధిని స్పష్టంగా ఉంచండి.',
          suggestedAlternative: 'రెండు పక్షాలు ఆమోదించిన నిర్దిష్ట పనులను మాత్రమే కాంట్రాక్టర్ నిర్వహిస్తారు.'
        },
        ml: {
          plainExplanation: 'പ്രോജക്റ്റ് വർക്ക് ഓർഡറിൽ പറഞ്ഞിരിക്കുന്ന സോഫ്റ്റ്‌വെയർ സേവനങ്ങൾ നൽകാൻ നിങ്ങൾ സമ്മതിക്കുന്നു.',
          whyRisky: 'ഇത് സാധാരണ വ്യവസ്ഥയാണ്. കൂടുതൽ സൗജന്യ ജോലികൾ ക്ലയന്റ് ആവശ്യപ്പെടാതിരിക്കാൻ ശ്രദ്ധിക്കുക.',
          suggestedAlternative: 'ഇരു കക്ഷികളും ഒപ്പിട്ട രേഖയിലുള്ള ജോലികൾ മാത്രമേ കരാറുകാരൻ ചെയ്യുകയുള്ളൂ.'
        }
      }
    },
    {
      clauseNumber: 'Clause 2.4',
      category: 'Payment',
      title: 'Payment Terms & Invoicing Delay',
      originalText: 'Client shall remit payment to Contractor within ninety (90) calendar days of invoice verification. Client reserves the right to withhold, deduct, or offset payments without prior written notice in the event of disputed deliverables.',
      riskScore: 55,
      riskLevel: 'MEDIUM',
      plainExplanation: 'The client will take up to 90 days (3 months) to pay your invoice and can deduct or withhold your money at will without telling you in advance.',
      whyRisky: 'Net 90 payment is severe for freelancers and damages your cash flow. Giving the client unilateral right to withhold pay without notice allows arbitrary payment freezes.',
      potentialImpact: 'You could deliver 3 months of hard work and have payments delayed or arbitrarily slashed with zero recourse.',
      suggestedAlternative: 'Client shall remit undisputed invoice payments within fifteen (15) calendar days of receipt. Any fee disputes must be submitted in writing with specific reasons within seven (7) business days.',
      confidence: 94,
      translations: {
        ta: {
          plainExplanation: 'இன்வாய்ஸ் சரிபார்க்கப்பட்ட 90 நாட்களுக்குப் பிறகுதான் வாடிக்கையாளர் பணம் செலுத்துவார். மேலும் முன் அறிவிப்பின்றி பணத்தை நிறுத்திவைக்க அவருக்கு உரிமை உண்டு.',
          whyRisky: '90 நாட்கள் என்பது மிக நீண்ட காலம். இது உங்கள் பணப்புழக்கத்தை கடுமையாகப் பாதிக்கும்.',
          suggestedAlternative: 'இன்வாய்ஸ் பெற்ற 15 நாட்களுக்குள் வாடிக்கையாளர் பணம் செலுத்த வேண்டும். ஏதேனும் சர்ச்சை இருந்தால் 7 நாட்களுக்குள் எழுத்துப்பூர்வமாக தெரிவிக்க வேண்டும்.'
        },
        hi: {
          plainExplanation: 'क्लाइंट इनवॉइस के 90 दिनों बाद भुगतान करेगा और बिना किसी पूर्व सूचना के आपका भुगतान रोक या काट सकता है।',
          whyRisky: '90 दिनों की भुगतान अवधि फ़्रीलांसरों के लिए बहुत लंबी है और आपके नकदी प्रवाह को बाधित कर सकती है।',
          suggestedAlternative: 'क्लाइंट इनवॉइस प्राप्त होने के 15 दिनों के भीतर भुगतान करेगा। किसी भी विवाद की स्थिति में 7 दिनों के भीतर लिखित सूचना देना अनिवार्य होगा।'
        },
        te: {
          plainExplanation: 'క్లయింట్ ఇన్వాయిస్ అందిన 90 రోజుల తర్వాతే చెల్లింపు చేస్తారు మరియు ముందుగా చెప్పకుండానే డబ్బును నిలిపివేయవచ్చు.',
          whyRisky: '90 రోజుల చెల్లింపు గడువు చాలా ఎక్కువ, ఇది మీ ఆదాయాన్ని దెబ్బతీస్తుంది.',
          suggestedAlternative: 'ఇన్వాయిస్ అందిన 15 రోజుల్లోగా క్లయింట్ చెల్లింపు చేయాలి. ఏవైనా అభ్యంతరాలు ఉంటే 7 రోజుల్లోగా లిఖితపూర్వకంగా తెలియజేయాలి.'
        },
        ml: {
          plainExplanation: 'ഇൻവോയ്സ് നൽകി 90 ദിവസത്തിന് ശേഷമേ ക്ലയന്റ് പണം നൽകൂ. അറിയിപ്പില്ലാതെ പണം തടഞ്ഞുവെക്കാനും അവർക്ക് അവകാശമുണ്ട്.',
          whyRisky: '90 ദിവസത്തെ കാലാവധി വളരെ കൂടുതലാണ്. ഇത് നിങ്ങളുടെ സാമ്പത്തിക സ്ഥിതിയെ ബാധിക്കും.',
          suggestedAlternative: 'ഇൻവോയ്സ് ലഭിച്ച് 15 ദിവസത്തിനകം പണം നൽകണം. എന്തെങ്കിലും തർക്കമുണ്ടെങ്കിൽ 7 ദിവസത്തിനകം രേഖാമൂലം അറിയിക്കണം.'
        }
      }
    },
    {
      clauseNumber: 'Clause 3.2',
      category: 'Termination',
      title: 'Unilateral Immediate Termination without Cause',
      originalText: 'Client may terminate this Agreement or any Statement of Work at any time, with or without cause, immediately upon verbal or electronic notification. Contractor shall not be entitled to compensation for incomplete milestones or consequential costs incurred.',
      riskScore: 88,
      riskLevel: 'HIGH',
      plainExplanation: 'The client can fire you instantly at any moment without giving a reason, and they do not have to pay you for any half-finished milestone work.',
      whyRisky: 'This is completely one-sided. If you spend weeks building complex architecture, the client can terminate on day 29 and legally refuse to pay you a single cent for that work.',
      potentialImpact: 'Immediate total loss of anticipated project income and uncompensated labor hours.',
      suggestedAlternative: 'Either party may terminate this Agreement without cause by providing thirty (30) days prior written notice. Upon termination, Client shall promptly compensate Contractor on a prorated basis for all work completed and expenses incurred up to the effective termination date.',
      confidence: 98,
      translations: {
        ta: {
          plainExplanation: 'வாடிக்கையாளர் எந்த காரணமும் கூறாமல் எந்த நேரத்திலும் உடனடியாக ஒப்பந்தத்தை ரத்து செய்யலாம். முடிக்கப்படாத பணிகளுக்கு பணம் தர வேண்டியதில்லை.',
          whyRisky: 'நீங்கள் பல வாரங்கள் உழைத்தாலும், அவர்கள் திடீரென ரத்து செய்துவிட்டு ஒரு ரூபாய் கூட தராமல் போகலாம்.',
          suggestedAlternative: 'இரு தரப்பினரும் 30 நாட்கள் முன் அறிவிப்பு கொடுத்து ரத்து செய்யலாம். ரத்து செய்யப்படும் வரை செய்யப்பட்ட அனைத்து வேலைகளுக்கும் வாடிக்கையாளர் பணம் செலுத்த வேண்டும்.'
        },
        hi: {
          plainExplanation: 'क्लाइंट बिना कोई कारण बताए कभी भी तुरंत कॉन्ट्रैक्ट समाप्त कर सकता है और अधूरे काम का कोई पैसा नहीं देगा।',
          whyRisky: 'यह पूरी तरह एकतरफा है। हफ्तों की कड़ी मेहनत के बाद भी क्लाइंट बिना भुगतान किए अचानक प्रोजेक्ट बंद कर सकता है।',
          suggestedAlternative: 'कोई भी पक्ष 30 दिन की लिखित पूर्व सूचना देकर अनुबंध समाप्त कर सकता है। समाप्ति की तारीख तक किए गए सभी कार्यों का पूरा भुगतान क्लाइंट को करना होगा।'
        },
        te: {
          plainExplanation: 'క్లయింట్ ఎటువంటి కారణం చెప్పకుండా ఎప్పుడైనా వెంటనే ఒప్పందాన్ని రద్దు చేయవచ్చు మరియు అసంపూర్ణ పనికి ఎలాంటి డబ్బు చెల్లించరు.',
          whyRisky: 'ఇది చాలా ప్రమాదకరం. మీరు కష్టపడి పనిచేసినా క్లయింట్ అకస్మాత్తుగా రద్దు చేసి రూపాయి కూడా ఇవ్వకుండా పోవచ్చు.',
          suggestedAlternative: 'ఏ పక్షమైనా 30 రోజుల ముందస్తు లిఖితపూర్వక నోటీసుతో రద్దు చేసుకోవచ్చు. ఆ సమయం వరకు చేసిన మొత్తం పనికి చెల్లింపు జరగాలి.'
        },
        ml: {
          plainExplanation: 'ക്ലയന്റിന് എപ്പോൾ വേണമെങ്കിലും മുന്നറിയിപ്പില്ലാതെ കരാർ റദ്ദാക്കാം. പൂർത്തിയാകാത്ത ജോലികൾക്ക് പണം നൽകേണ്ടതില്ല.',
          whyRisky: 'നിങ്ങൾ ചെയ്ത അധ്വാനത്തിന് പണം ലഭിക്കാതെ കരാർ പെട്ടെന്ന് അവസാനിപ്പിക്കാൻ ക്ലയന്റിന് അധികാരം നൽകുന്നു.',
          suggestedAlternative: 'ഇരു കക്ഷികൾക്കും 30 ദിവസത്തെ രേഖാമൂലമുള്ള നോട്ടീസ് നൽകി കരാർ അവസാനിപ്പിക്കാം. അതുവരെ ചെയ്ത ജോലികൾക്ക് മുഴുവൻ തുകയും നൽകണം.'
        }
      }
    },
    {
      clauseNumber: 'Clause 4.3',
      category: 'Intellectual Property',
      title: 'Sweeping Assignment of Pre-Existing IP & Tools',
      originalText: 'Contractor hereby irrevocably assigns, transfers, and conveys to Client all rights, title, and interest in all Works, including all pre-existing software tools, frameworks, proprietary code libraries, inventions, and moral rights utilized during the engagement.',
      riskScore: 85,
      riskLevel: 'HIGH',
      plainExplanation: 'You are giving away permanent ownership of not just the project deliverables, but also all your own pre-existing code libraries, starter templates, and tools you built prior to this project.',
      whyRisky: 'If you use your own boilerplate or UI libraries, this clause means the client now owns them. You could be sued for copyright infringement if you use your own code on future clients.',
      potentialImpact: 'Loss of your core software assets, tools, and intellectual property developed over your entire career.',
      suggestedAlternative: 'Client shall own the final custom deliverables upon receipt of full payment. Contractor retains all right, title, and ownership in Contractor\'s pre-existing tools, libraries, and frameworks, granting Client a non-exclusive, perpetual, royalty-free license to use such tools as incorporated into the deliverables.',
      confidence: 97,
      translations: {
        ta: {
          plainExplanation: 'இந்த திட்டத்திற்கு மட்டுமல்லாமல், நீங்கள் ஏற்கனவே சொந்தமாக உருவாக்கிய டூல்ஸ் மற்றும் கோட்களையும் வாடிக்கையாளருக்கே நிரந்தரமாக எழுதித் தருகிறீர்கள்.',
          whyRisky: 'உங்கள் சொந்த ஸ்டார்ட்டர் கோட் மற்றும் டூல்ஸை எதிர்காலத்தில் மற்ற வாடிக்கையாளர்களுக்கு பயன்படுத்த முடியாமல் போகும்.',
          suggestedAlternative: 'முழு பணமும் செலுத்திய பிறகு இறுதியான புதிய வேலைகளை மட்டும் வாடிக்கையாளர் சொந்தமாக்கிக் கொள்ளலாம். உங்கள் பழைய டூல்ஸ் மற்றும் கோட்களின் உரிமை உங்களிடமே இருக்கும்.'
        },
        hi: {
          plainExplanation: 'आप न केवल प्रोजेक्ट बल्कि अपने पहले से बने कोड लाइब्रेरी, टूल्स और फ्रेमवर्क का पूरा मालिकाना हक भी क्लाइंट को दे रहे हैं।',
          whyRisky: 'इससे आप भविष्य में किसी अन्य क्लाइंट के लिए अपने ही कोड या टूल्स का उपयोग नहीं कर पाएंगे।',
          suggestedAlternative: 'पूरा भुगतान मिलने पर क्लाइंट को अंतिम कार्य का अधिकार मिलेगा। ठेकेदार अपने पहले से मौजूद टूल्स और कोड का मालिकाना हक अपने पास रखेगा।'
        },
        te: {
          plainExplanation: 'మీరు ప్రాజెక్ట్ మాత్రమే కాకుండా, గతంలో మీరు స్వయంగా తయారు చేసుకున్న కోడింగ్ టూల్స్ మరియు లైబ్రరీల హక్కులను కూడా క్లయింట్‌కు అప్పగిస్తున్నారు.',
          whyRisky: 'దీనివల్ల భవిష్యత్తులో వేరే క్లయింట్ల కోసం మీ స్వంత కోడ్‌ను ఉపయోగించే హక్కును కోల్పోతారు.',
          suggestedAlternative: 'పూర్తి చెల్లింపు తర్వాత మాత్రమే క్లయింట్‌కు కొత్త ప్రాజెక్ట్ హక్కులు ఉంటాయి. కాంట్రాక్టర్ తన పాత టూల్స్ యాజమాన్యాన్ని తన వద్దే ఉంచుకుంటారు.'
        },
        ml: {
          plainExplanation: 'പ്രോജക്റ്റ് മാത്രമല്ല, നിങ്ങൾ മുൻപ് നിർമ്മിച്ച ടൂളുകളും കോഡുകളും ഉൾപ്പെടെ എല്ലാ അവകാശങ്ങളും ക്ലയന്റിന് നൽകുന്നു.',
          whyRisky: 'ഭാവിയിൽ മറ്റ് ക്ലയന്റുകൾക്കായി നിങ്ങളുടെ സ്വന്തം കോഡ് ഉപയോഗിക്കാൻ കഴിയില്ല.',
          suggestedAlternative: 'മുഴുവൻ തുകയും നൽകിയ ശേഷം മാത്രമേ ക്ലയന്റിന് പുതിയ സൃഷ്ടികളുടെ അവകാശം ലഭിക്കൂ. നിങ്ങളുടെ മുൻകാല ടൂളുകളുടെ അവകാശം നിങ്ങളിൽ തന്നെ നിലനിൽക്കും.'
        }
      }
    },
    {
      clauseNumber: 'Clause 5.1',
      category: 'Liability',
      title: 'Unlimited Contractor Liability with Asymmetric Cap',
      originalText: 'Contractor assumes unlimited liability for any and all direct, indirect, special, incidental, punitive, or consequential damages arising out of or related to this Agreement. Client\'s maximum aggregate liability shall under no circumstances exceed one hundred US dollars ($100.00).',
      riskScore: 94,
      riskLevel: 'HIGH',
      plainExplanation: 'You have unlimited personal financial liability for any bug, server downtime, or loss the client suffers, while the client\'s liability to you is capped at a maximum of just $100.',
      whyRisky: 'If a small bug in your code causes their e-commerce platform to lose $500,000, they can sue you for the entire $500,000 and seize your personal assets.',
      potentialImpact: 'Catastrophic personal financial ruin and bankruptcy from business loss claims.',
      suggestedAlternative: 'In no event shall either party\'s total aggregate liability arising under this Agreement exceed the total fees actually paid or payable by Client to Contractor in the three (3) months preceding the incident. Neither party shall be liable for indirect, incidental, or consequential damages.',
      confidence: 99,
      translations: {
        ta: {
          plainExplanation: 'வாடிக்கையாளருக்கு ஏற்படும் எந்தவொரு இழப்பிற்கும் உங்கள் மீது வரம்பற்ற பொறுப்பு சுமத்தப்படுகிறது. ஆனால் உங்களுக்கு ஏற்படும் இழப்பிற்கு வாடிக்கையாளர் அதிகபட்சமாக \$100 மட்டுமே தருவார்.',
          whyRisky: 'மென்பொருளில் சிறிய பிழை ஏற்பட்டு அவர்களுக்கு நஷ்டம் வந்தால், லட்சக்கணக்கில் உங்களிடம் நஷ்டஈடு கேட்டு வழக்கு தொடரலாம்.',
          suggestedAlternative: 'இரு தரப்பினரின் அதிகபட்ச பொறுப்பும் இந்த ஒப்பந்தத்தின் கீழ் கடந்த 3 மாதங்களில் பெறப்பட்ட கட்டணத் தொகைக்கு மட்டுமே உட்பட்டதாக இருக்க வேண்டும்.'
        },
        hi: {
          plainExplanation: 'क्लाइंट को होने वाले किसी भी नुकसान के लिए आप पर असीमित वित्तीय देनदारी होगी, जबकि आपके नुकसान के लिए क्लाइंट की अधिकतम देयता केवल \$100 होगी।',
          whyRisky: 'यदि आपके कोड में किसी छोटी सी खराबी के कारण उनका बड़ा नुकसान होता है, तो वे आप पर लाखों का दावा कर सकते हैं।',
          suggestedAlternative: 'दोनों पक्षों की अधिकतम कुल देयता पिछले 3 महीनों में प्राप्त कुल फीस तक ही सीमित होगी। कोई भी पक्ष अप्रत्यक्ष नुकसान के लिए उत्तरदायी नहीं होगा।'
        },
        te: {
          plainExplanation: 'క్లయింట్‌కు జరిగే ఏ నష్టానికైనా మీరే పూర్తి అపరిమిత బాధ్యత వహించాలి, కానీ మీకు జరిగే నష్టానికి క్లయింట్ కేవలం \$100 మాత్రమే చెల్లిస్తారు.',
          whyRisky: 'సాఫ్ట్‌వేర్‌లో ఏదైనా పొరపాటు వల్ల వారికి భారీ నష్టం జరిగితే, మీ నుండి మొత్తం రికవరీ చేసుకునే ప్రమాదం ఉంది.',
          suggestedAlternative: 'రెండు పక్షాల బాధ్యత గత 3 నెలల్లో కాంట్రాక్టర్‌కు చెల్లించిన రుసుము మొత్తానికి మాత్రమే పరిమితం కావాలి.'
        },
        ml: {
          plainExplanation: 'ക്ലയന്റിനുണ്ടാകുന്ന നഷ്ടങ്ങൾക്ക് പരിധിയില്ലാത്ത ബാധ്യത നിങ്ങൾക്കാണ്. എന്നാൽ അവർ നൽകുന്ന പരമാവധി തുക \$100 മാത്രമാണ്.',
          whyRisky: 'ഒരു ചെറിയ സോഫ്റ്റ്‌വെയർ പിഴവ് കാരണം ക്ലയന്റിന് ലക്ഷങ്ങളുടെ നഷ്ടമുണ്ടായാൽ നിങ്ങളുടെ സ്വത്തുക്കൾ പോലും കണ്ടുകെട്ടാൻ സാധ്യതയുണ്ട്.',
          suggestedAlternative: 'ഇരു കക്ഷികളുടെയും ബാധ്യത കഴിഞ്ഞ 3 മാസങ്ങളിൽ ലഭിച്ച ഫീസിൽ കൂടുതലാകരുത്. പരോക്ഷ നഷ്ടങ്ങൾക്ക് ആരും ബാധ്യസ്ഥരല്ല.'
        }
      }
    },
    {
      clauseNumber: 'Clause 6.1',
      category: 'Indemnification',
      title: 'Broad Unilateral Third-Party Indemnification',
      originalText: 'Contractor shall indemnify, defend, and hold harmless Client, its affiliates, directors, and agents from any and all claims, demands, losses, attorney fees, and liabilities arising out of or related to the services or any alleged defect.',
      riskScore: 82,
      riskLevel: 'HIGH',
      plainExplanation: 'If anyone sues the client regarding anything connected to your work, you must pay all of the client\'s expensive lawyer fees and settlement costs.',
      whyRisky: 'Indemnification without fault or breach requirements means you could be forced to pay hundreds of thousands in legal defense costs even if you did nothing wrong.',
      potentialImpact: 'Enormous out-of-pocket legal expenses defending a corporate client against third-party lawsuits.',
      suggestedAlternative: 'Contractor shall indemnify and hold harmless Client solely against third-party claims directly resulting from Contractor\'s gross negligence, willful misconduct, or proven copyright infringement in the delivered work.',
      confidence: 95,
      translations: {
        ta: {
          plainExplanation: 'வாடிக்கையாளர் மீது யாரேனும் வழக்கு தொடர்ந்தால், வாடிக்கையாளரின் வழக்கறிஞர் கட்டணம் மற்றும் இழப்பீடு முழுவதையும் நீங்களே ஏற்க வேண்டும்.',
          whyRisky: 'நீங்கள் தவறு செய்யாவிட்டாலும் கூட, கார்ப்பரேட் வழக்கறிஞர்களின் லட்சக்கணக்கான கட்டணத்தை நீங்கள் கட்ட நேரிடும்.',
          suggestedAlternative: 'ஒப்பந்ததாரரின் நிரூபிக்கப்பட்ட தீவிர அலட்சியம் அல்லது பதிப்புரிமை மீறல் காரணமாக ஏற்படும் நேரடி இழப்புகளுக்கு மட்டுமே ஒப்பந்ததாரர் பொறுப்பாவார்.'
        },
        hi: {
          plainExplanation: 'यदि कोई तीसरा पक्ष क्लाइंट पर मुकदमा करता है, तो आपको क्लाइंट के वकीलों की भारी फीस और हर्जाना खुद भरना होगा।',
          whyRisky: 'भले ही आपकी कोई गलती न हो, फिर भी आपको लाखों रुपये कानूनी खर्च के रूप में वहन करने पड़ सकते हैं।',
          suggestedAlternative: 'ठेकेदार केवल अपनी जानबूझकर की गई गलती या कॉपीराइट उल्लंघन से उत्पन्न सीधे दावों के लिए ही क्षतिपूर्ति करेगा।'
        },
        te: {
          plainExplanation: 'క్లయింట్‌పై ఎవరైనా కేసు వేస్తే, వారి లాయర్ ఫీజులు మరియు నష్టపరిహారాన్ని మీరే స్వయంగా చెల్లించాలి.',
          whyRisky: 'మీ తప్పు లేకపోయినా కూడా భారీ కోర్టు ఖర్చులు మరియు లాయర్ ఫీజులు చెల్లించాల్సి వస్తుంది.',
          suggestedAlternative: 'కాంట్రాక్టర్ యొక్క తీవ్రమైన నిర్లక్ష్యం లేదా రుజువైన కాపీరైట్ ఉల్లంఘన వల్ల మాత్రమే నష్టపరిహారం చెల్లించబడుతుంది.'
        },
        ml: {
          plainExplanation: 'ക്ലയന്റിനെതിരെ ആരെങ്കിലും കേസ് കൊടുത്താൽ അവരുടെ വക്കീൽ ഫീസും നഷ്ടപരിഹാരവും നിങ്ങൾ നൽകണം.',
          whyRisky: 'നിങ്ങളുടെ തെറ്റല്ലെങ്കിൽ പോലും വൻതുക വക്കീൽ ഫീസായി നൽകേണ്ടി വരും.',
          suggestedAlternative: 'കരാറുകാരന്റെ ബോധപൂർവ്വമായ തെറ്റ് കാരണം ഉണ്ടാകുന്ന നേരിട്ടുള്ള നഷ്ടങ്ങൾക്ക് മാത്രമേ നഷ്ടപരിഹാരം നൽകേണ്ടതുള്ളൂ.'
        }
      }
    },
    {
      clauseNumber: 'Clause 7.2',
      category: 'Non-Compete',
      title: 'Global 24-Month Restrictive Non-Compete',
      originalText: 'During the term of this Agreement and for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide services, consult for, or be employed by any enterprise operating in the digital commerce or software industry globally.',
      riskScore: 78,
      riskLevel: 'HIGH',
      plainExplanation: 'You are legally prohibited from working for or consulting with any other software or digital commerce company anywhere in the world for 2 full years after leaving.',
      whyRisky: 'This is an overly broad, unconscionable restraint of trade that effectively deprives you of your livelihood as a developer or designer.',
      potentialImpact: 'Inability to earn a living in your professional domain for 2 years.',
      suggestedAlternative: 'Contractor agrees not to directly solicit Client\'s existing active proprietary customers for a period of six (6) months following termination. No restriction shall apply to general industry consulting or non-compete engagements.',
      confidence: 96,
      translations: {
        ta: {
          plainExplanation: 'ஒப்பந்தம் முடிந்த பிறகு 2 ஆண்டுகளுக்கு உலகளவில் வேறு எந்த சாப்ட்வேர் நிறுவனத்துடனும் நீங்கள் பணியாற்றக் கூடாது.',
          whyRisky: 'இது மிகக் கடுமையான கட்டுப்பாடு. 2 வருடங்களுக்கு நீங்கள் உங்கள் துறையில் வேலை செய்ய முடியாமல் போய்விடும்.',
          suggestedAlternative: 'ஒப்பந்தம் முடிந்த 6 மாதங்களுக்கு வாடிக்கையாளரின் நேரடி வாடிக்கையாளர்களை மட்டும் நீங்கள் அணுகக்கூடாது. மற்றபடி எந்த தடைக்கட்டுப்பாடும் இருக்கக்கூடாது.'
        },
        hi: {
          plainExplanation: 'अनुबंध समाप्त होने के बाद 2 साल तक आप दुनिया भर में किसी भी अन्य सॉफ्टवेयर कंपनी के लिए काम नहीं कर सकते।',
          whyRisky: 'यह बहुत अनुचित है और आपको अपने पेशे में 2 साल तक काम करने और कमाने से रोकता है।',
          suggestedAlternative: 'अनुबंध समाप्ति के 6 महीने तक केवल क्लाइंट के मौजूदा ग्राहकों से संपर्क न करने की सहमति होगी। सामान्य उद्योग कार्य पर कोई प्रतिबंध नहीं होगा।'
        },
        te: {
          plainExplanation: 'కాంట్రాక్ట్ ముగిసిన తర్వాత 2 సంవత్సరాల వరకు ప్రపంచవ్యాప్తంగా మరే ఇతర సాఫ్ట్‌వేర్ కంపెనీతోనూ పని చేయకూడదు.',
          whyRisky: 'ఇది మీ జీవనోపాధిని తీవ్రంగా దెబ్బతీస్తుంది మరియు 2 సంవత్సరాలు మీ రంగంలో పని చేయకుండా అడ్డుకుంటుంది.',
          suggestedAlternative: 'కాంట్రాక్ట్ ముగిసిన 6 నెలల పాటు క్లయింట్ యొక్క ప్రత్యక్ష కస్టమర్లను సంప్రదించకుండా మాత్రమే పరిమితి ఉండాలి.'
        },
        ml: {
          plainExplanation: 'കരാർ കഴിഞ്ഞ് 2 വർഷത്തേക്ക് ലോകത്തെവിടെയും മറ്റ് സോഫ്റ്റ്‌വെയർ കമ്പനികൾക്ക് വേണ്ടി ജോലി ചെയ്യാൻ പാടില്ല.',
          whyRisky: 'ഇത് നിങ്ങളുടെ തൊഴിലെടുക്കാനുള്ള അവകാശത്തെ നിഷേധിക്കുകയും ഉപജീവനത്തെ ബാധിക്കുകയും ചെയ്യുന്നു.',
          suggestedAlternative: 'കരാർ കഴിഞ്ഞ് 6 മാസത്തേക്ക് ക്ലയന്റിന്റെ നേരിട്ടുള്ള ഇടപാടുകാരെ സമീപിക്കാതിരിക്കുക. പൊതുവായ ജോലികൾക്ക് വിലക്കുണ്ടാകില്ല.'
        }
      }
    },
    {
      clauseNumber: 'Clause 8.1',
      category: 'Auto Renewal',
      title: 'Perpetual Automatic Renewal with Lock-in',
      originalText: 'This Agreement shall automatically renew for successive twelve (12) month terms unless Contractor provides written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term.',
      riskScore: 65,
      riskLevel: 'HIGH',
      plainExplanation: 'The contract automatically renews for an entire additional year unless you remember to send a formal cancellation notice 3 whole months before it ends.',
      whyRisky: 'If you miss the tight 90-day window, you are trapped in the contract for another 12 months under unchanged pricing.',
      potentialImpact: 'Locked into unfavorable rates and terms for an additional 12-month period.',
      suggestedAlternative: 'This Agreement shall renew only upon mutual written agreement of both parties at least thirty (30) days prior to the expiration of the term.',
      confidence: 93,
      translations: {
        ta: {
          plainExplanation: 'ஒப்பந்தம் முடிவதற்கு 90 நாட்களுக்கு முன்னரே நீங்கள் ரத்து செய்யாவிட்டால், தானாகவே மேலும் 1 வருடத்திற்கு நீட்டிக்கப்படும்.',
          whyRisky: 'அந்த 90 நாள் காலக்கெடுவை நீங்கள் தவறவிட்டால், அதே விலையில் மேலும் 1 வருடம் சிக்கிக்கொள்வீர்கள்.',
          suggestedAlternative: 'இரு தரப்பினரும் எழுத்துப்பூர்வமாக ஒப்புக்கொண்டால் மட்டுமே ஒப்பந்தம் மேலும் நீட்டிக்கப்பட வேண்டும்.'
        },
        hi: {
          plainExplanation: 'यदि आप समाप्त होने के 90 दिन पहले लिखित नोटिस नहीं देते हैं, तो यह अनुबंध अपने आप 1 साल के लिए आगे बढ़ जाएगा।',
          whyRisky: 'यदि आप 90 दिन की समय सीमा चूक जाते हैं, तो आप पुरानी दरों पर अगले 12 महीने के लिए फंस जाएंगे।',
          suggestedAlternative: 'यह अनुबंध केवल दोनों पक्षों की आपसी लिखित सहमति से ही आगे बढ़ाया जाएगा।'
        },
        te: {
          plainExplanation: 'గడువు ముగియడానికి 90 రోజుల ముందు నోటీసు ఇవ్వకపోతే, ఈ ఒప్పందం ఆటోమేటిక్‌గా మరో 1 సంవత్సరం పొడిగించబడుతుంది.',
          whyRisky: 'మీరు 90 రోజుల గడువు మిస్ అయితే, పాత ధరలకే మరో ఏడాది పాటు ఇరుక్కుపోతారు.',
          suggestedAlternative: 'ఇరువర్గాల లిఖితపూర్వక పరస్పర సమ్మతితో మాత్రమే ఒప్పందం పునరుద్ధరించబడాలి.'
        },
        ml: {
          plainExplanation: 'കാലാവധി തീരുന്നതിന് 90 ദിവസം മുൻപ് അറിയിച്ചില്ലെങ്കിൽ കരാർ സ്വയമേവ ഒരു വർഷത്തേക്ക് കൂടി നീളും.',
          whyRisky: '90 ദിവസത്തെ സമയം മറന്നുപോയാൽ പഴയ തുകയിൽ ഒരു വർഷം കൂടി ജോലി ചെയ്യാൻ നിർബന്ധിതരാകും.',
          suggestedAlternative: 'ഇരു കക്ഷികളും പരസ്പരം സമ്മതിച്ചാൽ മാത്രമേ കരാർ നീട്ടി നൽകാവൂ.'
        }
      }
    },
    {
      clauseNumber: 'Clause 9.3',
      category: 'Confidentiality',
      title: 'Standard Confidentiality and Non-Disclosure',
      originalText: 'Contractor agrees to hold Client\'s proprietary technical and business information in strict confidence and use such information solely for the purpose of fulfilling the obligations under this Agreement.',
      riskScore: 20,
      riskLevel: 'LOW',
      plainExplanation: 'You agree to keep the client\'s private business and technical information confidential.',
      whyRisky: 'Standard NDA clause. Fair and balanced as long as publicly available information is excluded.',
      potentialImpact: 'Standard commercial practice; low risk.',
      suggestedAlternative: 'Standard confidentiality terms are acceptable provided they exclude information that is publicly known or independently developed.',
      confidence: 98,
      translations: {
        ta: {
          plainExplanation: 'வாடிக்கையாளரின் ரகசிய வணிகத் தகவல்களை நீங்கள் பாதுகாப்பாக வைத்திருக்க ஒப்புக்கொள்கிறீர்கள்.',
          whyRisky: 'வழக்கமான ரகசிய காப்பு விதிமுறை. குறைந்த ஆபத்து.',
          suggestedAlternative: 'பொதுவெளியில் உள்ள தகவல்களைத் தவிர்த்து மற்ற ரகசியங்களை காப்பது நியாயமானது.'
        },
        hi: {
          plainExplanation: 'आप क्लाइंट की गोपनीय तकनीकी और व्यावसायिक जानकारी को सुरक्षित रखने के लिए सहमत हैं।',
          whyRisky: 'यह एक मानक गोपनीयता खंड है। कम जोखिम।',
          suggestedAlternative: 'सार्वजनिक रूप से उपलब्ध जानकारी को छोड़कर गोपनीयता की शर्तें स्वीकार्य हैं।'
        },
        te: {
          plainExplanation: 'క్లయింట్ యొక్క వ్యాపార మరియు సాంకేతిక సమాచారాన్ని గోప్యంగా ఉంచడానికి మీరు అంగీకరిస్తున్నారు.',
          whyRisky: 'ఇది సాధారణ నిబంధన. తక్కువ ప్రమాదం.',
          suggestedAlternative: 'బహిరంగ సమాచారం మినహా గోప్యతా నిబంధనలు ఆమోదయోగ్యమైనవి.'
        },
        ml: {
          plainExplanation: 'ക്ലയന്റിന്റെ ബിസിനസ്സ് വിവരങ്ങൾ രഹസ്യമായി സൂക്ഷിക്കാൻ നിങ്ങൾ സമ്മതിക്കുന്നു.',
          whyRisky: 'ഇത് സാധാരണ നിബന്ധനയാണ്. കുറഞ്ഞ അപകടസാധ്യത.',
          suggestedAlternative: 'പൊതുവായ വിവരങ്ങൾ ഒഴികെയുള്ളവ രഹസ്യമായി സൂക്ഷിക്കുന്നത് സ്വീകാര്യമാണ്.'
        }
      }
    },
    {
      clauseNumber: 'Clause 10.2',
      category: 'Dispute Resolution',
      title: 'Out-of-State Jurisdiction & Loser-Pays Arbitration',
      originalText: 'Any disputes arising out of this Agreement shall be resolved through confidential binding arbitration seated in Dover, Delaware, USA. The prevailing party shall be entitled to recover all reasonable attorney fees and costs.',
      riskScore: 50,
      riskLevel: 'MEDIUM',
      plainExplanation: 'Any legal dispute must be resolved in arbitration in Delaware, USA, and the losing party must pay all attorney fees for both sides.',
      whyRisky: 'If you are located elsewhere, travelling to Delaware and funding expensive private arbitration makes it almost impossible for you to sue for unpaid invoices.',
      potentialImpact: 'High financial barrier to enforcing your contractual payment rights.',
      suggestedAlternative: 'Any disputes shall be resolved through good-faith mediation, and if necessary, in the competent courts of Contractor\'s local jurisdiction, with each party bearing its own legal fees.',
      confidence: 92,
      translations: {
        ta: {
          plainExplanation: 'ஏதேனும் சர்ச்சை ஏற்பட்டால் அமெரிக்காவின் டெலாவேரில் மட்டுமே சட்டப் போராட்டம் நடத்த முடியும். தோற்கும் தரப்பு அனைத்து செலவுகளையும் ஏற்க வேண்டும்.',
          whyRisky: 'வெளிநாட்டில் வழக்கு நடத்துவது அதிக செலவு பிடிக்கும் என்பதால் உங்கள் சம்பள பாக்கியை கூட கேட்க முடியாமல் போகலாம்.',
          suggestedAlternative: 'உங்கள் உள்ளூர் நீதிமன்றங்கள் மூலமாகவே சட்ட பிரச்சனைகளை தீர்க்க வேண்டும் மற்றும் அவரவர் வழக்கறிஞர் கட்டணத்தை அவரவரே ஏற்க வேண்டும்.'
        },
        hi: {
          plainExplanation: 'किसी भी विवाद का निपटारा डेलावेयर, यूएसए में मध्यस्थता के माध्यम से होगा और हारने वाले पक्ष को सारा कानूनी खर्च उठाना होगा।',
          whyRisky: 'विदेश में कानूनी कार्रवाई करना बहुत महंगा है, जिससे आप अपने बकाए पैसों के लिए भी आसानी से दावा नहीं कर पाएंगे।',
          suggestedAlternative: 'विवादों का निपटारा ठेकेदार के स्थानीय अधिकार क्षेत्र में होना चाहिए और प्रत्येक पक्ष अपना कानूनी खर्च स्वयं वहन करेगा।'
        },
        te: {
          plainExplanation: 'ఏవైనా వివాదాలు వస్తే అమెరికాలోని డెలావేర్‌లోనే పరిష్కరించుకోవాలి మరియు ఓడిపోయిన వారే మొత్తం ఖర్చులు భరించాలి.',
          whyRisky: 'విదేశాల్లో కేసు నడపడం చాలా ఖర్చుతో కూడుకున్నది, దీనివల్ల మీ బకాయిలను వసూలు చేసుకోవడం కష్టమవుతుంది.',
          suggestedAlternative: 'కాంట్రాక్టర్ స్థానిక న్యాయస్థానాల ద్వారా వివాదాలను పరిష్కరించుకోవాలి మరియు ఎవరి ఖర్చులు వారే భరించాలి.'
        },
        ml: {
          plainExplanation: 'തർക്കങ്ങൾ ഉണ്ടായാൽ അമേരിക്കയിലെ ഡെലവെയറിൽ വെച്ച് തീർപ്പാക്കണം. തോൽക്കുന്നവർ മുഴുവൻ ചെലവും നൽകണം.',
          whyRisky: 'വിദേശത്ത് കേസ് നടത്തുന്നത് വലിയ ചെലവായതിനാൽ ന്യായമായ പണം ചോദിക്കാൻ പോലും മടിക്കും.',
          suggestedAlternative: 'പ്രാദേശിക കോടതികൾ വഴി തർക്കങ്ങൾ പരിഹരിക്കുകയും അവരവരുടെ വക്കീൽ ഫീസ് അവരവർ വഹിക്കുകയും വേണം.'
        }
      }
    }
  ],
  rawText: `MASTER SERVICES AGREEMENT (MSA)

This Master Services Agreement ("Agreement") is entered into as of January 15, 2026, by and between TechFlow Enterprise Solutions LLC ("Client") and the undersigned independent contractor ("Contractor").

1. ENGAGEMENT AND SCOPE OF SERVICES
Clause 1.1: Contractor agrees to perform software development, UI design, and consulting services as designated in applicable Statements of Work (SOW). Contractor shall devote their best professional efforts to achieve client objectives.

2. PAYMENT TERMS AND INVOICING
Clause 2.4: Client shall remit payment to Contractor within ninety (90) calendar days of invoice verification. Client reserves the right to withhold, deduct, or offset payments without prior written notice in the event of disputed deliverables.

3. TERM AND TERMINATION
Clause 3.2: Client may terminate this Agreement or any Statement of Work at any time, with or without cause, immediately upon verbal or electronic notification. Contractor shall not be entitled to compensation for incomplete milestones or consequential costs incurred.

4. INTELLECTUAL PROPERTY RIGHTS
Clause 4.3: Contractor hereby irrevocably assigns, transfers, and conveys to Client all rights, title, and interest in all Works, including all pre-existing software tools, frameworks, proprietary code libraries, inventions, and moral rights utilized during the engagement.

5. LIMITATION OF LIABILITY
Clause 5.1: Contractor assumes unlimited liability for any and all direct, indirect, special, incidental, punitive, or consequential damages arising out of or related to this Agreement. Client's maximum aggregate liability shall under no circumstances exceed one hundred US dollars ($100.00).

6. INDEMNIFICATION
Clause 6.1: Contractor shall indemnify, defend, and hold harmless Client, its affiliates, directors, and agents from any and all claims, demands, losses, attorney fees, and liabilities arising out of or related to the services or any alleged defect.

7. NON-COMPETE AND RESTRICTIVE COVENANTS
Clause 7.2: During the term of this Agreement and for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide services, consult for, or be employed by any enterprise operating in the digital commerce or software industry globally.

8. TERM AND AUTOMATIC RENEWAL
Clause 8.1: This Agreement shall automatically renew for successive twelve (12) month terms unless Contractor provides written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term.

9. CONFIDENTIALITY AND NON-DISCLOSURE
Clause 9.3: Contractor agrees to hold Client's proprietary technical and business information in strict confidence and use such information solely for the purpose of fulfilling the obligations under this Agreement.

10. GOVERNING LAW AND DISPUTE RESOLUTION
Clause 10.2: Any disputes arising out of this Agreement shall be resolved through confidential binding arbitration seated in Dover, Delaware, USA. The prevailing party shall be entitled to recover all reasonable attorney fees and costs.`
};

export const DEMO_RENTAL_CONTRACT: ContractAnalysis = {
  id: 'demo-rental-agreement-2026',
  contractName: 'Residential_Tenancy_Agreement.pdf',
  userRole: 'tenant',
  createdAt: new Date().toISOString(),
  fileSize: '185 KB',
  isDemo: true,
  contractType: 'Residential Lease Agreement',
  contractSummary: 'Standard residential tenancy agreement for an 11-month lease term with automatic rent escalation.',
  overallRiskScore: 54,
  riskLevel: 'MEDIUM',
  riskExplanation: 'Overall risk is 54% (MEDIUM). The lease agreement contains an onerous security deposit forfeiture clause, landlord entry without prior notice, and shifts routine structural maintenance liabilities onto the tenant.',
  keyTerms: {
    duration: '11 Months',
    payment: '₹28,000 / month (5% compounding late fee per day)',
    noticePeriod: '15 days for Landlord / 60 days for Tenant',
    renewal: 'Rent increases automatically by 12% upon renewal',
    governingLaw: 'Local Rent Control Jurisdiction',
    liabilityLimit: 'Tenant fully liable for all plumbing, electrical, and appliance repairs'
  },
  riskCounts: {
    high: 2,
    medium: 4,
    low: 2,
    total: 8
  },
  categoryScores: {
    'Penalties': 75,
    'Privacy / Data': 70,
    'Warranty': 65,
    'Payment': 60,
    'Termination': 55,
    'Notice Period': 50,
    'Auto Renewal': 45,
    'Refund': 40
  },
  topRisks: [
    {
      category: 'Penalties',
      riskScore: 75,
      riskLevel: 'HIGH',
      summary: 'Immediate 100% forfeiture of security deposit if tenant vacates before 11 months for any personal emergency.',
      clauseNumber: 'Clause 4.2'
    },
    {
      category: 'Privacy / Data',
      riskScore: 70,
      riskLevel: 'HIGH',
      summary: 'Landlord reserves right to enter premises at any hour without prior written notice.',
      clauseNumber: 'Clause 7.1'
    },
    {
      category: 'Warranty',
      riskScore: 65,
      riskLevel: 'MEDIUM',
      summary: 'Tenant must pay for all pre-existing structural, plumbing, and major appliance repairs.',
      clauseNumber: 'Clause 5.3'
    }
  ],
  beforeYouSign: [
    'You lose your entire 3-month security deposit if you need to move out before 11 months.',
    'The landlord can enter your home at any time without giving you 24 hours notice.',
    'Late payment incurs an excessive 5% compounded penalty per day.',
    'You are required to give 60 days notice to vacate, while the landlord can ask you to leave in 15 days.',
    'Rent automatically increases by 12% annually upon renewal.'
  ],
  clauses: [
    {
      clauseNumber: 'Clause 1.0',
      category: 'Other',
      title: 'Premises & Term',
      originalText: 'Landlord hereby leases to Tenant the residential property for a period of eleven (11) months starting from the Commencement Date.',
      riskScore: 10,
      riskLevel: 'LOW',
      plainExplanation: 'Standard lease duration of 11 months.',
      whyRisky: 'Standard term.',
      potentialImpact: 'Minimal risk.',
      suggestedAlternative: 'Standard term is acceptable.',
      confidence: 99
    },
    {
      clauseNumber: 'Clause 4.2',
      category: 'Penalties',
      title: 'Total Security Deposit Forfeiture on Early Exit',
      originalText: 'In the event Tenant vacates the premises prior to the completion of the eleven (11) month term for any reason whatsoever, the entire security deposit shall be immediately forfeited as liquidated damages without refund.',
      riskScore: 75,
      riskLevel: 'HIGH',
      plainExplanation: 'If you have to move out early (even for a job transfer or medical emergency), the landlord keeps 100% of your deposit.',
      whyRisky: 'Unfair penalty that deprives you of thousands in savings regardless of advance notice provided.',
      potentialImpact: 'Total loss of full security deposit amount.',
      suggestedAlternative: 'Tenant may terminate the lease early by providing thirty (30) days notice and a reasonable early termination fee equivalent to one half-month rent, after which the remaining deposit shall be refunded.',
      confidence: 96
    },
    {
      clauseNumber: 'Clause 7.1',
      category: 'Privacy / Data',
      title: 'Unrestricted Landlord Inspection without Notice',
      originalText: 'Landlord or Landlord\'s agents may enter the premises at any hour of the day or night for inspection, showing, or maintenance purposes without prior notice to Tenant.',
      riskScore: 70,
      riskLevel: 'HIGH',
      plainExplanation: 'The landlord can walk into your rented house at any time without giving you any notice.',
      whyRisky: 'Violates your fundamental right to quiet enjoyment and privacy in your home.',
      potentialImpact: 'Severe invasion of personal privacy and security.',
      suggestedAlternative: 'Landlord may enter the premises only upon providing at least twenty-four (24) hours advance written notice, during reasonable daylight hours, except in case of active emergencies.',
      confidence: 98
    }
  ],
  rawText: `RESIDENTIAL LEASE AGREEMENT

1. PREMISES & TERM
Clause 1.0: Landlord hereby leases to Tenant the residential property for a period of eleven (11) months starting from the Commencement Date.

2. RENT AND LATE CHARGES
Clause 2.1: Monthly rent of ₹28,000 is due on the 1st of each month. Late payments shall incur a compounded daily surcharge of 5%.

4. SECURITY DEPOSIT
Clause 4.2: In the event Tenant vacates the premises prior to the completion of the eleven (11) month term for any reason whatsoever, the entire security deposit shall be immediately forfeited as liquidated damages without refund.

5. MAINTENANCE AND REPAIRS
Clause 5.3: Tenant shall bear all financial costs for plumbing, electrical wiring, appliance maintenance, and structural upkeep during tenancy.

7. ACCESS AND INSPECTION
Clause 7.1: Landlord or Landlord's agents may enter the premises at any hour of the day or night for inspection, showing, or maintenance purposes without prior notice to Tenant.`
};

export const SAMPLE_CONTRACTS_LIST = [
  {
    id: 'sample-freelance',
    title: 'Freelance Master Services Agreement (High Risk)',
    category: 'Freelance / Tech',
    role: 'freelancer' as const,
    risk: '78% HIGH RISK',
    riskScore: 78,
    data: DEMO_FREELANCE_CONTRACT
  },
  {
    id: 'sample-rental',
    title: 'Residential Tenancy Agreement (Medium Risk)',
    category: 'Real Estate / Lease',
    role: 'tenant' as const,
    risk: '54% MEDIUM RISK',
    riskScore: 54,
    data: DEMO_RENTAL_CONTRACT
  }
];
