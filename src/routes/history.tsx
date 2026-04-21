import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MessageSquare, Trash2, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  loadHistory,
  clearHistory,
  PENDING_LOAD_KEY,
  type HistoryItem,
} from "@/lib/history-store";
import "@/lib/i18n";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History & Privacy — PersonaPulse AI" },
      {
        name: "description",
        content:
          "Your conversation history with PersonaPulse AI and our full privacy policy in one place.",
      },
      { property: "og:title", content: "History & Privacy — PersonaPulse AI" },
      {
        property: "og:description",
        content: "Browse your saved analyses and review how we handle your data.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHydrated(true);
    setItems(loadHistory());
  }, []);

  const isAr = hydrated && i18n.language?.startsWith("ar");
  const dir = isAr ? "rtl" : "ltr";

  const handleOpen = (item: HistoryItem) => {
    try {
      sessionStorage.setItem(PENDING_LOAD_KEY, JSON.stringify(item));
    } catch {
      // ignore
    }
    navigate({ to: "/" });
  };

  const handleClear = () => {
    clearHistory();
    setItems([]);
  };

  return (
    <div dir={dir} className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-foreground/5 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            {hydrated ? t("back_to_chat") : "Back to chat"}
          </Link>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 rounded-lg text-[11px] text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5 me-1.5" />
              {hydrated ? t("clear_history") : "Clear"}
            </Button>
          )}
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {hydrated ? t("history_title") : "Conversation history"}
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            {hydrated
              ? t("history_subtitle")
              : "Your recent forensic scans, stored locally on your device."}
          </p>

          {/* History list */}
          <section className="mb-16">
            {items.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-foreground/10 rounded-2xl">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {hydrated ? t("no_history") : "No analyses yet"}
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleOpen(item)}
                      className="w-full text-start p-4 rounded-2xl bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-foreground/5 hover:border-foreground/10 transition-all group flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">
                            #{item.caseId}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString(
                              isAr ? "ar" : "en",
                              { dateStyle: "short", timeStyle: "short" },
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 line-clamp-2 group-hover:text-foreground transition-colors">
                          {item.text}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-colors shrink-0 ${
                          isAr ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Privacy section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Shield className="w-4.5 h-4.5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mb-8">
              {isAr ? "آخر تحديث: 21 أبريل 2026" : "Last updated: April 21, 2026"}
            </p>

            <div className="space-y-10 leading-relaxed text-foreground/85">
              {isAr ? <PrivacyArabic /> : <PrivacyEnglish />}
            </div>

            <div className="mt-16 pt-8 border-t border-foreground/10 text-xs text-muted-foreground">
              {isAr
                ? "للاستفسارات حول الخصوصية، يرجى التواصل عبر الصفحة الرئيسية."
                : "For privacy questions, please contact us via the main page."}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground">{title}</h3>
      <div className="space-y-3 text-sm md:text-base">{children}</div>
    </section>
  );
}

function PrivacyEnglish() {
  return (
    <>
      <Section title="1. Introduction">
        <p>
          PersonaPulse AI ("we", "our", "the service") provides AI-powered behavioral
          analysis of conversations you submit. This policy explains what we collect,
          how we use it, and the third parties involved.
        </p>
      </Section>
      <Section title="2. Information We Process">
        <ul className="list-disc ps-6 space-y-2">
          <li>
            <strong>Conversation text you paste</strong> — sent to our AI provider
            (Lovable AI Gateway / Google Gemini) to generate the analysis. We do not
            permanently store this text on our servers.
          </li>
          <li>
            <strong>Local browser storage</strong> — your recent scan history and
            language preference are kept only in your browser (localStorage). They
            never leave your device.
          </li>
          <li>
            <strong>Technical data</strong> — IP address and request metadata are
            temporarily processed for rate-limiting and abuse prevention.
          </li>
        </ul>
      </Section>
      <Section title="3. AI Processing">
        <p>
          Submitted text is forwarded to large-language-model providers solely to
          generate the analysis returned to you. Do not submit highly sensitive
          personal data, credentials, or confidential business information.
        </p>
      </Section>
      <Section title="4. Cookies & Local Storage">
        <p>
          We use localStorage to remember your language and recent scans. We do not
          set tracking cookies ourselves. Third-party advertising scripts may set
          their own cookies.
        </p>
      </Section>
      <Section title="5. Advertising">
        <p>
          The free version of the service is supported by advertising provided by{" "}
          <strong>Adsterra</strong>. Adsterra may display banner, native, social bar,
          and popunder ads, and may use cookies and device identifiers to deliver
          relevant advertising. Review Adsterra's privacy policy at{" "}
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
          We do not sell your data. We share submitted conversation text only with the
          AI provider strictly to generate the analysis.
        </p>
      </Section>
      <Section title="7. Children">
        <p>
          The service is not directed to children under 13. Do not use the service if
          you are below the minimum age required in your country.
        </p>
      </Section>
      <Section title="8. Your Rights">
        <p>
          Because we don't keep conversation text on our servers, the simplest way to
          delete your local data is to clear your browser storage for this site, or
          use the "Clear history" button above.
        </p>
      </Section>
      <Section title="9. Security">
        <p>
          We use HTTPS for all traffic and apply rate-limiting and input validation on
          AI endpoints. No system is perfectly secure; use the service with
          appropriate discretion regarding sensitive content.
        </p>
      </Section>
      <Section title="10. Changes">
        <p>
          We may update this policy. Material changes will be reflected by updating
          the "Last updated" date above.
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
          يقدم PersonaPulse AI ("نحن"، "الخدمة") تحليلاً سلوكياً مدعوماً بالذكاء
          الاصطناعي للمحادثات التي تُدخلها. توضح هذه السياسة ما الذي نجمعه، وكيف
          نستخدمه، والأطراف الثالثة المعنية.
        </p>
      </Section>
      <Section title="٢. المعلومات التي نعالجها">
        <ul className="list-disc pe-6 space-y-2">
          <li>
            <strong>نص المحادثة الذي تُدخله</strong> — يُرسل إلى مزود الذكاء
            الاصطناعي (Lovable AI Gateway / Google Gemini) لتوليد التحليل. لا نحتفظ
            به بشكل دائم على خوادمنا.
          </li>
          <li>
            <strong>تخزين المتصفح المحلي</strong> — يُحفظ سجل عمليات المسح الأخيرة
            وتفضيل اللغة فقط في متصفحك (localStorage)، ولا يغادر جهازك.
          </li>
          <li>
            <strong>البيانات التقنية</strong> — تتم معالجة عنوان IP وبيانات الطلب
            مؤقتاً لأغراض الحد من إساءة الاستخدام.
          </li>
        </ul>
      </Section>
      <Section title="٣. معالجة الذكاء الاصطناعي">
        <p>
          يُمرَّر النص المُدخل إلى مزودي نماذج اللغة الكبيرة فقط لتوليد التحليل. لا
          تُدخل بيانات شخصية بالغة الحساسية أو بيانات اعتماد أو معلومات تجارية سرية.
        </p>
      </Section>
      <Section title="٤. ملفات الارتباط والتخزين المحلي">
        <p>
          نستخدم localStorage لحفظ لغتك وسجلك الأخير. لا نضع ملفات تتبع بأنفسنا. قد
          تضع سكربتات الإعلانات الخارجية ملفات الارتباط الخاصة بها.
        </p>
      </Section>
      <Section title="٥. الإعلانات">
        <p>
          النسخة المجانية من الخدمة مدعومة بإعلانات من <strong>Adsterra</strong>. قد
          تعرض Adsterra إعلانات بانر، أصلية، شريط تواصل، ونوافذ منبثقة، وقد تستخدم
          ملفات ارتباط ومعرّفات الجهاز لتقديم إعلانات ملائمة. راجع سياسة خصوصية
          Adsterra على{" "}
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
          الاصطناعي لغرض توليد التحليل حصراً.
        </p>
      </Section>
      <Section title="٧. الأطفال">
        <p>
          الخدمة غير موجهة للأطفال دون سن 13 عاماً. لا تستخدم الخدمة إذا كنت دون
          السن القانونية في بلدك.
        </p>
      </Section>
      <Section title="٨. حقوقك">
        <p>
          نظراً لأننا لا نحتفظ بنص المحادثات على خوادمنا، فإن أسهل طريقة لحذف بياناتك
          المحلية هي مسح تخزين المتصفح لهذا الموقع، أو استخدام زر "مسح السجل" أعلاه.
        </p>
      </Section>
      <Section title="٩. الأمان">
        <p>
          نستخدم HTTPS لجميع الاتصالات ونطبق الحد من المعدل والتحقق من المدخلات على
          واجهات الذكاء الاصطناعي. لا يوجد نظام آمن تماماً؛ استخدم الخدمة بحكمة فيما
          يخص المحتوى الحساس.
        </p>
      </Section>
      <Section title="١٠. التغييرات">
        <p>
          قد نُحدّث هذه السياسة. ستنعكس التغييرات الجوهرية بتحديث تاريخ "آخر تحديث"
          أعلاه.
        </p>
      </Section>
    </>
  );
}
