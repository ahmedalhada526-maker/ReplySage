import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — PersonaPulse AI" },
      {
        name: "description",
        content:
          "How PersonaPulse AI handles your data, conversations, analytics, and third-party advertising. Read our full privacy policy.",
      },
      { property: "og:title", content: "Privacy Policy — PersonaPulse AI" },
      {
        property: "og:description",
        content:
          "Transparency on data, AI processing, cookies, and advertising in PersonaPulse AI.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { i18n, t } = useTranslation();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const isAr = hydrated && i18n.language === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
          {hydrated ? t("back_home") : "Back home"}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          {isAr ? "آخر تحديث: 21 أبريل 2026" : "Last updated: April 21, 2026"}
        </p>

        <div className="space-y-10 leading-relaxed text-foreground/85">
          {isAr ? <PrivacyArabic /> : <PrivacyEnglish />}
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/10 text-xs text-muted-foreground">
          {isAr
            ? "للاستفسارات حول الخصوصية، يرجى التواصل عبر صفحة التطبيق الرئيسية."
            : "For privacy questions, please contact us via the main application page."}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">{title}</h2>
      <div className="space-y-3 text-sm md:text-base">{children}</div>
    </section>
  );
}

function PrivacyEnglish() {
  return (
    <>
      <Section title="1. Introduction">
        <p>
          PersonaPulse AI ("we", "our", "the service") provides AI-powered
          behavioral analysis of conversations you submit. This policy explains
          what we collect, how we use it, and the third parties involved.
        </p>
      </Section>

      <Section title="2. Information We Process">
        <ul className="list-disc ps-6 space-y-2">
          <li>
            <strong>Conversation text you paste</strong> — sent to our AI
            provider (Lovable AI Gateway / Google Gemini) to generate the
            analysis. We do not permanently store this text on our servers.
          </li>
          <li>
            <strong>Local browser storage</strong> — your recent scan history
            and language preference are kept only in your browser
            (localStorage). They never leave your device.
          </li>
          <li>
            <strong>Technical data</strong> — IP address and request metadata
            are temporarily processed for rate-limiting and abuse prevention.
          </li>
        </ul>
      </Section>

      <Section title="3. AI Processing">
        <p>
          Submitted text is forwarded to large-language-model providers solely
          to generate the analysis returned to you. Providers may retain
          requests transiently for safety and abuse-detection purposes per
          their own policies. Do not submit highly sensitive personal data,
          credentials, or confidential business information.
        </p>
      </Section>

      <Section title="4. Cookies & Local Storage">
        <p>
          We use localStorage to remember your language and recent scans. We do
          not set tracking cookies ourselves. Third-party advertising scripts
          (see below) may set their own cookies.
        </p>
      </Section>

      <Section title="5. Advertising">
        <p>
          The free version of the service is supported by advertising provided
          by <strong>Adsterra</strong>. Adsterra may display banner, native,
          social bar, and popunder ads, and may use cookies and device
          identifiers to deliver relevant advertising and measure performance.
          Review Adsterra's privacy policy at{" "}
          <a
            href="https://adsterra.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            adsterra.com/privacy-policy
          </a>
          .
        </p>
      </Section>

      <Section title="6. Data Sharing">
        <p>
          We do not sell your data. We share submitted conversation text only
          with the AI provider strictly to generate the analysis. We share
          technical data with our hosting/CDN providers as needed to serve the
          application.
        </p>
      </Section>

      <Section title="7. Children">
        <p>
          The service is not directed to children under 13. Do not use the
          service if you are below the minimum age required in your country.
        </p>
      </Section>

      <Section title="8. Your Rights">
        <p>
          Because we don't keep conversation text on our servers, the simplest
          way to delete your local data is to clear your browser storage for
          this site. Depending on your jurisdiction (GDPR, CCPA, etc.) you may
          have additional rights to access, correct, or delete data — contact
          us to exercise them.
        </p>
      </Section>

      <Section title="9. Security">
        <p>
          We use HTTPS for all traffic and apply rate-limiting and input
          validation on AI endpoints. No system is perfectly secure; use the
          service with appropriate discretion regarding sensitive content.
        </p>
      </Section>

      <Section title="10. Changes">
        <p>
          We may update this policy. Material changes will be reflected by
          updating the "Last updated" date above.
        </p>
      </Section>
    </>
  );
}

function PrivacyArabic() {
  return (
    <>
      <Section title="١. مقدمة">
        <p>
          يقدم PersonaPulse AI ("نحن"، "الخدمة") تحليلاً سلوكياً مدعوماً
          بالذكاء الاصطناعي للمحادثات التي تُدخلها. توضح هذه السياسة ما الذي
          نجمعه، وكيف نستخدمه، والأطراف الثالثة المعنية.
        </p>
      </Section>

      <Section title="٢. المعلومات التي نعالجها">
        <ul className="list-disc pe-6 space-y-2">
          <li>
            <strong>نص المحادثة الذي تُدخله</strong> — يُرسل إلى مزود الذكاء
            الاصطناعي (Lovable AI Gateway / Google Gemini) لتوليد التحليل. لا
            نحتفظ به بشكل دائم على خوادمنا.
          </li>
          <li>
            <strong>تخزين المتصفح المحلي</strong> — يُحفظ سجل عمليات المسح
            الأخيرة وتفضيل اللغة فقط في متصفحك (localStorage)، ولا يغادر جهازك.
          </li>
          <li>
            <strong>البيانات التقنية</strong> — تتم معالجة عنوان IP وبيانات
            الطلب مؤقتاً لأغراض الحد من إساءة الاستخدام.
          </li>
        </ul>
      </Section>

      <Section title="٣. معالجة الذكاء الاصطناعي">
        <p>
          يُمرَّر النص المُدخل إلى مزودي نماذج اللغة الكبيرة فقط لتوليد التحليل
          الذي يُعاد إليك. قد يحتفظ المزودون بالطلبات مؤقتاً لأغراض السلامة
          وكشف الإساءة وفق سياساتهم. لا تُدخل بيانات شخصية بالغة الحساسية أو
          بيانات اعتماد أو معلومات تجارية سرية.
        </p>
      </Section>

      <Section title="٤. ملفات الارتباط والتخزين المحلي">
        <p>
          نستخدم localStorage لحفظ لغتك وسجلك الأخير. لا نضع ملفات تتبع بأنفسنا.
          قد تضع سكربتات الإعلانات الخارجية (انظر أدناه) ملفات الارتباط الخاصة
          بها.
        </p>
      </Section>

      <Section title="٥. الإعلانات">
        <p>
          النسخة المجانية من الخدمة مدعومة بإعلانات من{" "}
          <strong>Adsterra</strong>. قد تعرض Adsterra إعلانات بانر، أصلية، شريط
          تواصل، ونوافذ منبثقة، وقد تستخدم ملفات ارتباط ومعرّفات الجهاز لتقديم
          إعلانات ملائمة وقياس الأداء. راجع سياسة خصوصية Adsterra على{" "}
          <a
            href="https://adsterra.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            adsterra.com/privacy-policy
          </a>
          .
        </p>
      </Section>

      <Section title="٦. مشاركة البيانات">
        <p>
          نحن لا نبيع بياناتك. نشارك نص المحادثة المُدخل فقط مع مزود الذكاء
          الاصطناعي لغرض توليد التحليل حصراً. نشارك البيانات التقنية مع مزودي
          الاستضافة/CDN حسب الحاجة لتشغيل التطبيق.
        </p>
      </Section>

      <Section title="٧. الأطفال">
        <p>
          الخدمة غير موجهة للأطفال دون سن 13 عاماً. لا تستخدم الخدمة إذا كنت
          دون السن القانونية في بلدك.
        </p>
      </Section>

      <Section title="٨. حقوقك">
        <p>
          نظراً لأننا لا نحتفظ بنص المحادثات على خوادمنا، فإن أسهل طريقة لحذف
          بياناتك المحلية هي مسح تخزين المتصفح لهذا الموقع. قد تتمتع بحقوق
          إضافية (GDPR، CCPA…) للوصول أو التصحيح أو الحذف — تواصل معنا لممارستها.
        </p>
      </Section>

      <Section title="٩. الأمان">
        <p>
          نستخدم HTTPS لجميع الاتصالات ونطبق الحد من المعدل والتحقق من المدخلات
          على واجهات الذكاء الاصطناعي. لا يوجد نظام آمن تماماً؛ استخدم الخدمة
          بحكمة فيما يخص المحتوى الحساس.
        </p>
      </Section>

      <Section title="١٠. التغييرات">
        <p>
          قد نُحدّث هذه السياسة. ستنعكس التغييرات الجوهرية بتحديث تاريخ "آخر
          تحديث" أعلاه.
        </p>
      </Section>
    </>
  );
}
