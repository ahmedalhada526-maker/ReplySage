import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      app_name: "PersonaPulse",
      tagline: "The Unfair Advantage",
      hero_eyebrow: "Behavioral psychology, weaponized",
      hero_title_1: "Master the",
      hero_title_span: "Subtext",
      hero_title_2: "of human interaction",
      hero_description:
        "Paste any conversation to decode hidden intentions, personality traits, and architect strategic responses that bypass resistance.",

      input_placeholder: "Paste the message or conversation snippet here…",
      run_analysis: "Run Analysis",
      analyzing: "Analyzing pulse…",
      new_analysis: "New analysis",
      history: "Recent scans",
      no_history: "No scan history yet",
      attach_file: "Attach .txt file",
      send: "Run forensic scan",

      analysis_report: "Forensic Report",
      case_id: "Case ID",
      pro_analysis: "Pro analysis",
      pulse_analysis: "Pulse analysis",
      recipient_persona: "Recipient persona",
      current_dynamic: "Current dynamic",
      hidden_needs: "Hidden needs",
      advanced_insights: "Advanced insights",
      strategy_architecture: "Strategic response architecture",
      tactician: "The Tactician",
      empath: "The Empath",
      alpha: "The Alpha",
      savage: "The Silencer",
      why_it_works: "Why it works",
      copy: "Copy response",
      copied: "Copied",
      generate_alternative: "Generate alternative",
      max_variants_reached: "Max variants reached",
      previous_variant: "Previous variant",
      next_variant: "Next variant",
      mbti: "MBTI",
      big_five: "BIG 5",
      enneagram: "ENNEAGRAM",

      free_tier: "Free tier",
      daily_scans_left_one: "{{count}} daily scan left",
      daily_scans_left_other: "{{count}} daily scans left",
      upgrade_pro: "Upgrade to Pro",
      pro_only: "Pro only",
      unlock_pro_insights: "Unlock pro insights",
      upgrade_message:
        "Upgrade to Pro to unlock deep-level psychological analysis and unlimited forensic scans.",
      upgrade_unlimited: "Unlimited forensic scans",
      upgrade_advanced: "Advanced psychological insights",
      upgrade_clean: "Clean, focused workspace",
      activate_pro: "Activate Pro (demo)",
      maybe_later: "Maybe later",

      error_generic: "Analysis failed. Please try again.",
      error_rate_limit: "Too many requests. Please wait a moment.",
      error_credits: "AI credits exhausted. Please add credits to continue.",
      limit_reached: "Daily free limit reached",
    },
  },
  ar: {
    translation: {
      app_name: "نبض الشخصية",
      tagline: "الميزة غير العادلة",
      hero_eyebrow: "علم النفس السلوكي، كسلاح",
      hero_title_1: "أتقن",
      hero_title_span: "ما وراء الكلمات",
      hero_title_2: "في كل تفاعل بشري",
      hero_description:
        "ألصق أي محادثة لفك شفرة النوايا الخفية، وسمات الشخصية، وصياغة ردود استراتيجية تتجاوز كل مقاومة.",

      input_placeholder: "ألصق الرسالة أو جزءاً من المحادثة هنا…",
      run_analysis: "ابدأ التحليل",
      analyzing: "جارٍ تحليل النبض…",
      new_analysis: "تحليل جديد",
      history: "عمليات المسح الأخيرة",
      no_history: "لا يوجد سجل مسح بعد",
      attach_file: "إرفاق ملف نصي",
      send: "ابدأ المسح الجنائي",

      analysis_report: "التقرير الجنائي",
      case_id: "رقم الحالة",
      pro_analysis: "تحليل احترافي",
      pulse_analysis: "تحليل النبض",
      recipient_persona: "شخصية المتلقي",
      current_dynamic: "الديناميكية الحالية",
      hidden_needs: "الاحتياجات الخفية",
      advanced_insights: "تحليلات متقدمة",
      strategy_architecture: "بنية الاستجابة الاستراتيجية",
      tactician: "المخطط",
      empath: "المتعاطف",
      alpha: "المسيطر",
      savage: "الرد المفحم",
      why_it_works: "لماذا ينجح هذا",
      copy: "نسخ الرد",
      copied: "تم النسخ",
      mbti: "نمط الشخصية",
      big_five: "الخمسة الكبار",
      enneagram: "إنياغرام",

      free_tier: "الباقة المجانية",
      daily_scans_left_one: "تبقى {{count}} مسح يومي",
      daily_scans_left_other: "تبقى {{count}} عمليات مسح يومية",
      upgrade_pro: "الترقية إلى برو",
      pro_only: "للمشتركين فقط",
      unlock_pro_insights: "افتح التحليلات الاحترافية",
      upgrade_message:
        "قم بالترقية إلى برو لفتح التحليل النفسي العميق ومسح جنائي غير محدود.",
      upgrade_unlimited: "عمليات مسح جنائي غير محدودة",
      upgrade_advanced: "تحليلات نفسية متقدمة",
      upgrade_clean: "مساحة عمل نظيفة ومركّزة",
      activate_pro: "تفعيل برو (تجريبي)",
      maybe_later: "ربما لاحقاً",

      error_generic: "فشل التحليل. يرجى المحاولة مرة أخرى.",
      error_rate_limit: "طلبات كثيرة جداً. يرجى الانتظار قليلاً.",
      error_credits: "تم استنفاد رصيد الذكاء الاصطناعي. يرجى إضافة رصيد للمتابعة.",
      limit_reached: "تم الوصول إلى الحد اليومي المجاني",
    },
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["en", "ar"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
    });
}

export default i18n;
