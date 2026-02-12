
import { Language, HelpItem } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    home: 'Home',
    admin: 'Admin',
    news: 'AI News',
    profile: 'Profile',
    trending: 'Trending',
    recommended: 'Recommended For You',
    readMore: 'Read More',
    comments: 'Comments',
    leaveComment: 'Leave a comment...',
    post: 'Post',
    latestNews: 'Latest Viral News',
    analytics: 'Analytics',
    settings: 'Settings',
    search: 'Search...',
    language: 'Language',
    suggestIdeas: 'AI Idea Suggestions',
    activeUsers: 'Active Users',
    trafficSources: 'Traffic Sources',
    geoDist: 'Geographic Distribution',
    approve: 'Approve',
    reject: 'Reject',
    pending: 'Pending Moderation',
    logout: 'Logout',
    aiTools: 'Top AI Tools',
    saudiHelper: 'Saudi Helper'
  },
  bn: {
    home: 'হোম',
    admin: 'অ্যাডমিন',
    news: 'এআই নিউজ',
    profile: 'প্রোফাইল',
    trending: 'ট্রেন্ডিং',
    recommended: 'আপনার জন্য প্রস্তাবিত',
    readMore: 'আরও পড়ুন',
    comments: 'মন্তব্য',
    leaveComment: 'মন্তব্য করুন...',
    post: 'পোস্ট',
    latestNews: 'লেটেস্ট ভাইরাল নিউজ',
    analytics: 'অ্যানালিটিক্স',
    settings: 'সেটিংস',
    search: 'অনুসন্ধান...',
    language: 'ভাষা',
    suggestIdeas: 'এআই আইডিয়া সাজেশন',
    activeUsers: 'সক্রিয় ব্যবহারকারী',
    trafficSources: 'ট্রাফিক উৎস',
    geoDist: 'ভৌগলিক বন্টন',
    approve: 'অনুমোদন',
    reject: 'প্রত্যাখ্যান',
    pending: 'অপেক্ষমাণ',
    logout: 'লগআউট',
    aiTools: 'সেরা এআই টুলস',
    saudiHelper: 'সৌদি হেল্পার'
  },
  ar: {
    home: 'الرئيسية',
    admin: 'المسؤول',
    news: 'أخبار الذكاء الاصطناعي',
    profile: 'الملف الشخصي',
    trending: 'رائج',
    recommended: 'موصى به لك',
    readMore: 'اقرأ المزيد',
    comments: 'تعليقات',
    leaveComment: 'اترك تعليقاً...',
    post: 'نشر',
    latestNews: 'أحدث الأخبار الفيروسية',
    analytics: 'تحليلات',
    settings: 'إعدادات',
    search: 'بحث...',
    language: 'اللغة',
    suggestIdeas: 'اقتراحات الأفكار بالذكاء الاصطناعي',
    activeUsers: 'المستخدمون النشطون',
    trafficSources: 'مصادر الحركة',
    geoDist: 'التوزيع الجغرافي',
    approve: 'موافقة',
    reject: 'رفض',
    pending: 'في انتظار المراجعة',
    logout: 'تسجيل الخروج',
    aiTools: 'أدوات الذكاء الاصطناعي',
    saudiHelper: 'مساعد السعودية'
  }
};

export const SAUDI_HELP_ITEMS: HelpItem[] = [
  {
    id: 's1',
    title: { en: 'Absher Services', bn: 'আবশির সেবা', ar: 'خدمات أبشر' },
    description: { 
      en: 'Manage your Iqama, Exit-Reentry, and Traffic violations.', 
      bn: 'আপনার ইকামা, এক্সিট-রিএন্ট্রি এবং ট্রাফিক ভায়োলেশন পরিচালনা করুন।', 
      ar: 'إدارة الإقامة، خروج وعودة، والمخالفات المرورية.' 
    },
    url: 'https://www.absher.sa',
    category: 'government',
    simpleGuide: { 
      en: 'Login with your ID, check your status, and pay fees easily.', 
      bn: 'আপনার আইডি দিয়ে লগইন করুন, স্ট্যাটাস চেক করুন এবং ফি প্রদান করুন।', 
      ar: 'سجل دخولك بهويتك، تحقق من حالتك، وادفع الرسوم بسهولة.' 
    }
  },
  {
    id: 's2',
    title: { en: 'Muqeem Residency', bn: 'মুকিম রেসিডেন্সি', ar: 'مقيم - خدمات الإقامة' },
    description: { 
      en: 'Residency verification and employer-related electronic services.', 
      bn: 'রেসিডেন্সি ভেরিফিকেশন এবং নিয়োগকর্তা সম্পর্কিত ইলেকট্রনিক সেবা।', 
      ar: 'التحقق من الإقامة والخدمات الإلكترونية المتعلقة بصاحب العمل.' 
    },
    url: 'https://muqeem.sa/#/login',
    category: 'government',
    simpleGuide: { 
      en: 'Check Iqama validity and print residency reports.', 
      bn: 'ইকামার বৈধতা পরীক্ষা করুন এবং রেসিডেন্সি রিপোর্ট প্রিন্ট করুন।', 
      ar: 'تحقق من صلاحية الإقامة واطبع تقارير المقيمين.' 
    }
  },
  {
    id: 's3',
    title: { en: 'Qiwa Platform', bn: 'কিওয়া প্ল্যাটফর্ম', ar: 'منصة قوى' },
    description: { 
      en: 'Manage employment contracts, job transfers, and work permits.', 
      bn: 'চাকরির চুক্তি, কর্মসংস্থান পরিবর্তন এবং কাজের অনুমতি পরিচালনা করুন।', 
      ar: 'إدارة عقود العمل ونقل الخدمات ورخص العمل.' 
    },
    url: 'https://qiwa.sa',
    category: 'utility',
    simpleGuide: { 
      en: 'Accept your new contract and view your professional profile.', 
      bn: 'আপনার নতুন চুক্তি গ্রহণ করুন এবং পেশাদার প্রোফাইল দেখুন।', 
      ar: 'اقبل عقدك الجديد واستعرض ملفك المهني.' 
    }
  },
  {
    id: 's4',
    title: { en: 'GOSI Insurance', bn: 'গোসি ইন্সুরেন্স', ar: 'التأمينات الاجتماعية - GOSI' },
    description: { 
      en: 'Social insurance details and professional employment history.', 
      bn: 'সামাজিক বিমার বিবরণ এবং পেশাদার কর্মসংস্থানের ইতিহাস।', 
      ar: 'تفاصيل التأمينات الاجتماعية وسجل العمل المهني.' 
    },
    url: 'https://gosi.gov.sa',
    category: 'government',
    simpleGuide: { 
      en: 'Verify your salary is registered correctly with the government.', 
      bn: 'আপনার বেতন সরকারের কাছে সঠিকভাবে নিবন্ধিত কিনা তা নিশ্চিত করুন।', 
      ar: 'تأكد من تسجيل راتبك بشكل صحيح لدى الحكومة.' 
    }
  },
  {
    id: 's5',
    title: { en: 'Huroob & Status Check', bn: 'হুরুব ও স্ট্যাটাস চেক', ar: 'الاستعلام عن موظف وافد' },
    description: { 
      en: 'Check your current labor status and employment inquiry.', 
      bn: 'আপনার বর্তমান লেবার স্ট্যাটাস এবং কর্মসংস্থান অনুসন্ধান করুন।', 
      ar: 'التحقق من حالة الموظف الوافد والاستعلام عن العمل.' 
    },
    url: 'https://es.hrsd.gov.sa/services/inquiry/nonsaudiempinquiry.aspx',
    category: 'government',
    simpleGuide: { 
      en: 'Enter your Iqama number to see if you are "On Duty" or "Absent".', 
      bn: 'আপনার ইকামা নম্বর দিয়ে দেখুন আপনি "অন ডিউটি" নাকি "অ্যাবসেন্ট"।', 
      ar: 'أدخل رقم إقامتك لمعرفة ما إذا كنت "على رأس العمل" أو "متغيب".' 
    }
  },
  {
    id: 's6',
    title: { en: 'Health Insurance (CCHI)', bn: 'স্বাস্থ্য বিমা (CCHI)', ar: 'مجلس الضمان الصحي' },
    description: { 
      en: 'Check the status and validity of your cooperative health insurance.', 
      bn: 'আপনার স্বাস্থ্য বিমার স্থিতি এবং বৈধতা পরীক্ষা করুন।', 
      ar: 'التحقق من حالة وصلاحية التأمين الصحي التعاوني.' 
    },
    url: 'https://chi.gov.sa/',
    category: 'utility',
    simpleGuide: { 
      en: 'See which company provides your insurance and its expiry date.', 
      bn: 'কোন কোম্পানি আপনার বিমা প্রদান করছে এবং মেয়াদের তারিখ দেখুন।', 
      ar: 'تعرف على شركة التأمين الخاصة بك وتاريخ انتهائها.' 
    }
  },
  {
    id: 's7',
    title: { en: 'Mudad Payroll', bn: 'মুদাদ পেরোল', ar: 'منصة مدد' },
    description: { 
      en: 'Payroll and salary compliance management for expatriates.', 
      bn: 'প্রবাসী কর্মীদের বেতন এবং স্যালারি কমপ্লায়েন্স ম্যানেজমেন্ট।', 
      ar: 'إدارة الرواتب والالتزام بالأجور للمقيمين.' 
    },
    url: 'https://mudad.com.sa',
    category: 'utility',
    simpleGuide: { 
      en: 'Check your salary payment status and electronic contracts.', 
      bn: 'আপনার বেতন পেমেন্ট স্ট্যাটাস এবং ইলেকট্রনিক চুক্তি চেক করুন।', 
      ar: 'تحقق من حالة دفع راتبك وعقودك الإلكترونية.' 
    }
  },
  {
    id: 's8',
    title: { en: 'Sehhaty Health', bn: 'সেহাতি স্বাস্থ্য', ar: 'صحتي' },
    description: { 
      en: 'Book medical appointments, view vaccines, and medical records.', 
      bn: 'মেডিকেল অ্যাপয়েন্টমেন্ট বুক করুন, টিকা এবং মেডিকেল রেকর্ড দেখুন।', 
      ar: 'حجز المواعيد الطبية، عرض اللقاحات، والسجلات الطبية.' 
    },
    url: 'https://sehhaty.sa',
    category: 'utility',
    simpleGuide: { 
      en: 'Essential for COVID-19 vaccines and general health services.', 
      bn: 'কোভিড-১৯ টিকা এবং সাধারণ স্বাস্থ্য সেবার জন্য অপরিহার্য।', 
      ar: 'ضروري للقاحات كورونا والخدمات الصحية العامة.' 
    }
  },
  {
    id: 's9',
    title: { en: 'Najiz Legal Portal', bn: 'নাজিজ আইনি পোর্টাল', ar: 'منصة ناجز العدلية' },
    description: { 
      en: 'Ministry of Justice portal for case tracking and legal services.', 
      bn: 'মামলা ট্র্যাকিং এবং আইনি সেবার জন্য বিচার মন্ত্রণালয় পোর্টাল।', 
      ar: 'بوابة وزارة العدل لتتبع القضايا والخدمات القانونية.' 
    },
    url: 'https://najiz.sa',
    category: 'government',
    simpleGuide: { 
      en: 'File cases, check powers of attorney, and legal status.', 
      bn: 'মামলা দায়ের করুন, পাওয়ার অফ অ্যাটর্নি এবং আইনি অবস্থা পরীক্ষা করুন।', 
      ar: 'رفع القضايا، التحقق من الوكالات، والحالة القانونية.' 
    }
  },
  {
    id: 's10',
    title: { en: 'Efaa Violations', bn: 'এফা ভায়োলেশন', ar: 'منصة إيفاء' },
    description: { 
      en: 'National platform for all national and traffic violations.', 
      bn: 'জাতীয় এবং ট্রাফিক সংক্রান্ত সকল ভায়োলেশনের জন্য জাতীয় প্ল্যাটফর্ম।', 
      ar: 'المنصة الوطنية لكافة المخالفات الوطنية والبيئية والبلدية.' 
    },
    url: 'https://efaa.sa/home.aspx',
    category: 'government',
    simpleGuide: { 
      en: 'Check if you have any unpaid fines from any government entity.', 
      bn: 'যেকোনো সরকারি সংস্থার কোনো বকেয়া জরিমানা আছে কিনা তা দেখুন।', 
      ar: 'تحقق مما إذا كان لديك أي غرامات غير مدفوعة لأي جهة حكومية.' 
    }
  },
  {
    id: 's11',
    title: { en: 'STC Pay', bn: 'এসটিসি পে', ar: 'اس تي سي باي' },
    description: { 
      en: 'Best way to send money home and pay local bills.', 
      bn: 'দেশে টাকা পাঠানোর এবং স্থানীয় বিল পরিশোধের সেরা উপায়।', 
      ar: 'أفضل طريقة لإرسال الأموال للمنزل ودفع الفواتير المحلية.' 
    },
    url: 'https://www.stcpay.com.sa',
    category: 'utility',
    simpleGuide: { 
      en: 'Add money from your bank card and transfer home with low fees.', 
      bn: 'আপনার ব্যাঙ্ক কার্ড থেকে টাকা যোগ করুন এবং কম ফিতে দেশে পাঠান।', 
      ar: 'أضف الأموال من بطاقتك البنكية وحولها للمنزل برسوم منخفضة.' 
    }
  }
];

export const CATEGORIES = [
  'Technology', 'AI', 'Business', 'Lifestyle', 'Gaming', 'Science'
];

export const AI_TOOLS = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    uses: 'Text generation, coding, brainstorming, and general assistance.',
    howTo: 'Sign up for a free account, type your prompt in the message box, and interact with the AI.',
    category: 'LLM'
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    uses: 'Multimodal AI for text, code, image analysis, and deep Google integration.',
    howTo: 'Login with your Google account and start chatting or uploading files for analysis.',
    category: 'LLM / Multimodal'
  },
  {
    name: 'Leonardo.ai',
    url: 'https://leonardo.ai',
    uses: 'High-quality image generation and creative asset creation.',
    howTo: 'Create an account, use your daily free tokens to generate images from text prompts.',
    category: 'Image Gen'
  },
  {
    name: 'Perplexity',
    url: 'https://perplexity.ai',
    uses: 'AI-powered search engine that providing cited sources for every answer.',
    howTo: 'Simply type a question in the search bar to get factual, real-time answers with links.',
    category: 'Search'
  },
  {
    name: 'Gamma',
    url: 'https://gamma.app',
    uses: 'Generating presentations, documents, and webpages from text prompts.',
    howTo: 'Describe your topic, and Gamma will generate a full slide deck or site in seconds.',
    category: 'Productivity'
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    uses: 'Advanced reasoning, long document analysis, and safe AI interactions.',
    howTo: 'Login and upload PDFs or paste text to summarize or ask complex questions.',
    category: 'LLM'
  },
  {
    name: 'Hugging Face',
    url: 'https://huggingface.co',
    uses: 'Access to thousands of open-source models for various AI tasks.',
    howTo: 'Explore the "Spaces" section to try live demos of various free AI models.',
    category: 'Platform'
  },
  {
    name: 'Canva AI',
    url: 'https://canva.com',
    uses: 'Magic Studio for image editing, background removal, and text-to-graphics.',
    howTo: 'Open a design, go to the Apps tab, and search for "Magic Media" or AI tools.',
    category: 'Design'
  },
  {
    name: 'Poe',
    url: 'https://poe.com',
    uses: 'A single platform to access multiple AI models (Claude, GPT, Gemini) in one place.',
    howTo: 'Select the model you want to use from the sidebar and start chatting.',
    category: 'Aggregator'
  },
  {
    name: 'Luma Dream Machine',
    url: 'https://lumalabs.ai/dream-machine',
    uses: 'High-quality video generation from text and images.',
    howTo: 'Describe a scene or upload an image to generate realistic 5-second videos.',
    category: 'Video Gen'
  }
];

export const SOCIAL_HANDLES = [
  { name: 'Facebook', url: 'https://facebook.com/raihankhan', icon: 'facebook' },
  { name: 'Instagram', url: 'https://instagram.com/raihankhan', icon: 'instagram' },
  { name: 'Telegram', url: 'https://t.me/raihankhan', icon: 'send' }
];
