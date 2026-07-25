import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Send,
  Loader2,
  Languages,
  Plus,
  Paperclip,
  History as HistoryIcon,
  Image as ImageIcon,
  Share2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useServerFn } from "@tanstack/react-start";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  analyzeInteraction,
  type AnalysisResult,
  type ResponseStyleKey,
} from "@/lib/analyze.functions";
import { PulseAnalysis } from "@/components/persona/PulseAnalysis";
import { StrategyCards } from "@/components/persona/StrategyCards";
import { ResponseStylePicker } from "@/components/persona/ResponseStylePicker";
import { AnalyzingLoader } from "@/components/persona/AnalyzingLoader";
import { LockedStrategy } from "@/components/persona/LockedStrategy";
import { StoryCard } from "@/components/persona/StoryCard";
import { extractTextFromImage } from "@/lib/ocr";
import { exportElementAsStory } from "@/lib/export-story";

import { maybeShowInterstitialAfterScan } from "@/lib/ads/AdService";
import {
  addHistoryItem,
  loadHistory,
  PENDING_LOAD_KEY,
  type HistoryItem,
} from "@/lib/history-store";
import "@/lib/i18n";

export function PersonaWorkspace() {
  const { t, i18n } = useTranslation();
  const analyzeFn = useServerFn(analyzeInteraction);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const [caseId, setCaseId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [recipientContext, setRecipientContext] = useState("");
  const [responseStyle, setResponseStyle] = useState<ResponseStyleKey | null>(null);
  const [strategyUnlocked, setStrategyUnlocked] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const storyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Load pending history item if user opened one from /history
  useEffect(() => {
    if (!hydrated) return;
    try {
      const pending = sessionStorage.getItem(PENDING_LOAD_KEY);
      if (pending) {
        const item = JSON.parse(pending) as HistoryItem;
        setResult(item.result);
        setAnalyzedText(item.text);
        setCaseId(item.caseId);
        sessionStorage.removeItem(PENDING_LOAD_KEY);
      }
    } catch {
      // ignore
    }
  }, [hydrated]);

  // Sync HTML dir/lang with i18n
  useEffect(() => {
    if (!hydrated || typeof document === "undefined") return;
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language, i18n, hydrated]);

  const handleAnalyze = async () => {
    if (!input.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setStrategyUnlocked(false);
    try {
      const lang = (i18n.language?.startsWith("ar") ? "ar" : "en") as "en" | "ar";
      const { result: data, error } = await analyzeFn({
        data: {
          text: input.slice(0, 8000),
          language: lang,
          recipientContext: recipientContext.trim() || undefined,
          responseStyle: responseStyle ?? undefined,
        },
      });

      if (error || !data) {
        if (error === "rate_limit") toast.error(t("error_rate_limit"));
        else if (error === "credits") toast.error(t("error_credits"));
        else toast.error(t("error_generic"));
        return;
      }

      const id = Math.random().toString(36).substring(2, 8).toUpperCase();
      setResult(data);
      setAnalyzedText(input);
      setCaseId(id);
      addHistoryItem({
        id,
        text: input,
        result: data,
        caseId: id,
        createdAt: Date.now(),
      });
      setInput("");

      // Unity interstitial — only every Nth scan (default: every 3rd).
      void maybeShowInterstitialAfterScan();
    } catch (e) {
      console.error(e);
      toast.error(t("error_generic"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const tid = toast.loading(t("ocr_processing"));
    try {
      const { text } = await extractTextFromImage(file);
      if (text && text.trim()) {
        setInput((prev) => prev + (prev ? "\n\n" : "") + text);
        toast.success("✓", { id: tid });
      } else {
        toast.error(t("ocr_failed"), { id: tid });
      }
    } catch {
      toast.error(t("ocr_failed"), { id: tid });
    }
  };

  const handleExportStory = async () => {
    if (!storyRef.current || isExporting) return;
    setIsExporting(true);
    const tid = toast.loading(t("exporting_story"));
    try {
      await exportElementAsStory(storyRef.current, `personapulse-${caseId || "story"}.png`);
      toast.success(t("story_exported"), { id: tid });
    } catch (e) {
      console.error(e);
      toast.error(t("error_generic"), { id: tid });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleLanguage = () => {
    const next = i18n.language?.startsWith("ar") ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === "string") {
        setInput((prev) => prev + (prev ? "\n\n" : "") + content);
      }
      setIsUploading(false);
    };
    reader.onerror = () => setIsUploading(false);
    reader.readAsText(file);
    e.target.value = "";
  };

  const isRtl = hydrated && i18n.dir() === "rtl";
  const historyCount = hydrated ? loadHistory().length : 0;

  return (
    <TooltipProvider>
      <div
        className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden relative"
        suppressHydrationWarning
      >
        {/* Top bar */}
        <header className="relative z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-foreground/5 bg-background/60 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 glow-primary">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1
                className="font-bold tracking-tight text-sm leading-none"
                suppressHydrationWarning
              >
                PersonaPulse AI — Decode subtext, manipulation & intent
              </h1>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground mt-1">
                v1.0 Forensics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setResult(null);
                setInput("");
                setCaseId("");
              }}
              className="hidden sm:inline-flex h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10"
              suppressHydrationWarning
            >
              <Plus className="w-4 h-4 me-1.5" />
              <span suppressHydrationWarning>
                {hydrated ? t("new_analysis") : "New analysis"}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/history" })}
              className="h-9 rounded-xl text-xs text-foreground bg-foreground/5 hover:bg-foreground/10"
              suppressHydrationWarning
              aria-label={hydrated ? `${t("view_history")} — ${historyCount} ${isRtl ? "عملية مسح محفوظة" : "saved scans"}` : "Open saved forensic scan history"}
            >
              <HistoryIcon className="w-4 h-4 me-1.5" aria-hidden="true" />
              <span suppressHydrationWarning>
                {hydrated ? t("view_history") : "History"}
              </span>
              {hydrated && historyCount > 0 && (
                <span className="ms-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono">
                  {historyCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10"
              onClick={toggleLanguage}
              suppressHydrationWarning
              aria-label={isRtl ? "Switch interface language to English" : "تبديل لغة الواجهة إلى العربية"}
            >
              <Languages className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <ScrollArea className="flex-1">
            <div className={`max-w-5xl mx-auto p-6 md:p-12 ${result ? "pb-44" : "pb-12"}`}>
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center pt-8"
                  >
                    <div
                      className="mb-8 inline-flex items-center gap-3 pl-1 pr-3 py-1 rounded-full glass-panel"
                      suppressHydrationWarning
                    >
                      <span className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/25">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-primary">
                          {hydrated ? t("hero_badge_status") : "LIVE"}
                        </span>
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                        {hydrated ? t("hero_badge_meta") : "AI · Reply Studio"}
                      </span>
                    </div>

                    <div className="relative mb-8">
                      <div className="absolute inset-0 -m-3 rounded-[2rem] bg-primary/10 blur-2xl" aria-hidden />
                      <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/25 glow-primary">
                        <Brain className="w-10 h-10 text-primary" />
                      </div>
                    </div>

                    <h2
                      className="text-5xl md:text-7xl font-bold tracking-tight max-w-3xl leading-[1.05]"
                      suppressHydrationWarning
                    >
                      {hydrated ? t("hero_title_1") : "Never wonder"}{" "}
                      <span className="text-gradient-primary italic font-serif">
                        {hydrated ? t("hero_title_span") : "what to reply"}
                      </span>{" "}
                      {hydrated ? t("hero_title_2") : "again"}
                    </h2>

                    <div className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden />

                    <p
                      className="text-foreground/80 max-w-xl text-lg md:text-xl mt-6 font-medium"
                      suppressHydrationWarning
                    >
                      {hydrated ? t("hero_subheading") : "AI-crafted replies for any message, chat, or conversation"}
                    </p>
                    <p
                      className="text-muted-foreground max-w-2xl text-base md:text-lg mt-4 leading-relaxed"
                      suppressHydrationWarning
                    >
                      {hydrated
                        ? t("hero_description")
                        : "Paste any message you received — a text, a chat thread, or a screenshot — and PersonaPulse writes the perfect reply for you in seconds."}
                    </p>

                    {/* Editorial 3-step ribbon */}
                    <div
                      className="mt-10 w-full max-w-3xl grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/5"
                      suppressHydrationWarning
                    >
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="flex flex-col items-start gap-1 p-4 bg-background/40 text-start"
                        >
                          <span className="text-[10px] font-mono text-primary/80 tracking-[0.3em]">
                            {`0${n}`}
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {hydrated ? t(`step_${n}_title`) : ""}
                          </span>
                          <span className="text-xs text-muted-foreground leading-snug">
                            {hydrated ? t(`step_${n}_desc`) : ""}
                          </span>
                        </div>
                      ))}
                    </div>



                    {/* Professional inline composer — placed BEFORE ads */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mt-12 w-full max-w-3xl"
                    >
                      <div className="glass-obsidian rounded-3xl premium-shadow border border-foreground/10 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/5 bg-foreground/[0.02]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                              {hydrated ? t("composer_title") : "Composer"}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground/60">
                            {input.length} / 8000
                          </span>
                        </div>
                        <Textarea
                          placeholder={hydrated ? t("input_placeholder") : ""}
                          className="min-h-[160px] max-h-[360px] bg-transparent border-none focus-visible:ring-0 text-base resize-none p-5 placeholder:text-muted-foreground/50 shadow-none rounded-none"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                              e.preventDefault();
                              handleAnalyze();
                            }
                          }}
                          dir={isRtl ? "rtl" : "ltr"}
                          maxLength={8000}
                        />

                        {/* Recipient intel */}
                        <div className="px-5 pb-2 pt-1 border-t border-foreground/5 bg-foreground/[0.02]">
                          <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground block py-2">
                            {hydrated ? t("recipient_intel_label") : "Recipient intel"}
                          </label>
                          <Textarea
                            placeholder={hydrated ? t("recipient_intel_placeholder") : ""}
                            className="min-h-[60px] max-h-[160px] bg-transparent border border-foreground/10 focus-visible:ring-1 focus-visible:ring-primary/40 text-sm resize-none p-3 rounded-xl placeholder:text-muted-foreground/50"
                            value={recipientContext}
                            onChange={(e) => setRecipientContext(e.target.value)}
                            dir={isRtl ? "rtl" : "ltr"}
                            maxLength={2000}
                          />
                        </div>

                        {/* Style picker */}
                        <div className="px-5 pt-3 pb-4 border-t border-foreground/5 bg-foreground/[0.02]">
                          <ResponseStylePicker
                            value={responseStyle}
                            onChange={setResponseStyle}
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-foreground/5 bg-foreground/[0.02]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              accept=".txt,.md,.csv,.json,.log"
                              onChange={handleFileUpload}
                            />
                            <input
                              type="file"
                              id="screenshot-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={handleScreenshotUpload}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10"
                              onClick={() => document.getElementById("file-upload")?.click()}
                              disabled={isUploading}
                              aria-label={isRtl ? "إرفاق ملف محادثة نصي (.txt أو .md)" : "Attach a plain-text conversation file (.txt or .md)"}
                            >
                              {isUploading ? (
                                <Loader2 className="w-4 h-4 me-1.5 animate-spin" aria-hidden="true" />
                              ) : (
                                <Paperclip className="w-4 h-4 me-1.5" aria-hidden="true" />
                              )}
                              <span className="hidden sm:inline">{hydrated ? t("attach_file") : "Attach"}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10"
                              onClick={() => document.getElementById("screenshot-upload")?.click()}
                              aria-label={isRtl ? "رفع لقطة شاشة للمحادثة لاستخراج النص تلقائياً" : "Upload a conversation screenshot to extract text via OCR"}
                            >
                              <ImageIcon className="w-4 h-4 me-1.5" aria-hidden="true" />
                              <span className="hidden sm:inline">{hydrated ? t("attach_screenshot") : "Screenshot"}</span>
                            </Button>
                          </div>
                          <Button
                            onClick={handleAnalyze}
                            disabled={!input.trim() || isAnalyzing}
                            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all active:scale-95 disabled:opacity-40 disabled:glow-primary font-semibold"
                            aria-label={t("send")}
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 me-2 animate-spin" />
                                {hydrated ? t("analyzing") : "Analyzing…"}
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 me-2 rtl:rotate-180" />
                                {hydrated ? t("send") : "Run scan"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Trust proof strip */}
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70">
                        <span>{hydrated ? t("trust_private") : ""}</span>
                        <span className="w-1 h-1 rounded-full bg-foreground/20" aria-hidden />
                        <span>{hydrated ? t("trust_instant") : ""}</span>
                        <span className="w-1 h-1 rounded-full bg-foreground/20" aria-hidden />
                        <span>{hydrated ? t("trust_multilingual") : ""}</span>
                      </div>
                    </motion.div>


                    {hydrated && isAnalyzing && (
                      <div className="mt-10 w-full">
                        <AnalyzingLoader />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-10"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                          {t("analysis_report")}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.25em] mt-1">
                          {t("case_id")}: {caseId}
                        </p>
                      </div>
                      <Button
                        onClick={handleExportStory}
                        disabled={isExporting}
                        size="sm"
                        className="h-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 text-xs font-semibold"
                      >
                        {isExporting ? (
                          <Loader2 className="w-4 h-4 me-2 animate-spin" />
                        ) : (
                          <Share2 className="w-4 h-4 me-2" />
                        )}
                        {t("export_story")}
                      </Button>
                    </div>

                    <PulseAnalysis data={result.pulse} />

                    <LockedStrategy
                      unlocked={strategyUnlocked}
                      onUnlock={() => setStrategyUnlocked(true)}
                    >
                      <StrategyCards
                        strategies={result.strategies}
                        sourceText={analyzedText}
                        recipientPersona={result.pulse.recipientPersona}
                      />
                    </LockedStrategy>

                    {/* Off-screen Story render target */}
                    <div
                      style={{
                        position: "fixed",
                        left: "-99999px",
                        top: 0,
                        pointerEvents: "none",
                      }}
                      aria-hidden
                    >
                      <StoryCard
                        ref={storyRef}
                        caseId={caseId}
                        recipientPersona={result.pulse.recipientPersona}
                        manipulationScore={result.pulse.manipulationScore ?? 0}
                        topMotive={result.pulse.motives?.[0] ?? ""}
                        language={isRtl ? "ar" : "en"}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Floating command bar — only when viewing results */}
          {result && (
            <div className="absolute bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-full max-w-2xl px-6 z-40">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="glass-strong p-2 rounded-[2rem] premium-shadow flex items-end gap-2"
              >
                <input
                  type="file"
                  id="file-upload-floating"
                  className="hidden"
                  accept=".txt,.md,.csv,.json,.log"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 shrink-0"
                  onClick={() => document.getElementById("file-upload-floating")?.click()}
                  disabled={isUploading}
                  aria-label={t("attach_file")}
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Paperclip className="w-5 h-5" />
                  )}
                </Button>
                <Textarea
                  placeholder={hydrated ? t("input_placeholder") : ""}
                  className="min-h-[48px] max-h-48 bg-transparent border-none focus-visible:ring-0 text-sm resize-none py-3 px-2 placeholder:text-muted-foreground/60 shadow-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAnalyze();
                    }
                  }}
                  dir={isRtl ? "rtl" : "ltr"}
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!input.trim() || isAnalyzing}
                  size="icon"
                  className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 glow-primary transition-all active:scale-95 disabled:opacity-40 disabled:glow-primary"
                  aria-label={t("send")}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 rtl:rotate-180" />
                  )}
                </Button>
              </motion.div>
            </div>
          )}
        </main>

        <footer className="border-t border-foreground/5 py-4 px-6 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/history" className="hover:text-foreground transition-colors">
            {hydrated ? t("privacy_policy") : "Privacy Policy"}
          </Link>
        </footer>
      </div>

    </TooltipProvider>
  );
}
