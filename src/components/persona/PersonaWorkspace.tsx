import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Send,
  Loader2,
  Languages,
  Plus,
  Paperclip,
  History as HistoryIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useServerFn } from "@tanstack/react-start";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { analyzeInteraction, type AnalysisResult } from "@/server/analyze.functions";
import { PulseAnalysis } from "@/components/persona/PulseAnalysis";
import { StrategyCards } from "@/components/persona/StrategyCards";
import { AdSlot } from "@/components/ads/AdSlot";
import { AdsterraBanner } from "@/components/ads/AdsterraBanner";
import { AdsterraNative } from "@/components/ads/AdsterraNative";
import { AdsterraSocialBar } from "@/components/ads/AdsterraSocialBar";
import { AdsterraPopunder, triggerAdsterraPopunder } from "@/components/ads/AdsterraPopunder";
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

    // Trigger popunder ad on user gesture (Start Scan click)
    triggerAdsterraPopunder();

    setIsAnalyzing(true);
    try {
      const lang = (i18n.language?.startsWith("ar") ? "ar" : "en") as "en" | "ar";
      const { result: data, error } = await analyzeFn({
        data: { text: input.slice(0, 8000), language: lang },
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
    } catch (e) {
      console.error(e);
      toast.error(t("error_generic"));
    } finally {
      setIsAnalyzing(false);
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
                {hydrated ? t("app_name") : "PersonaPulse"}
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
              aria-label={t("view_history")}
            >
              <HistoryIcon className="w-4 h-4 me-1.5" />
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
              aria-label="Language"
            >
              <Languages className="w-4 h-4" />
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
                    <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                      <span
                        className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground"
                        suppressHydrationWarning
                      >
                        {hydrated ? t("hero_eyebrow") : "Behavioral psychology, weaponized"}
                      </span>
                    </div>

                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 glow-primary mb-8">
                      <Brain className="w-10 h-10 text-primary" />
                    </div>

                    <h2
                      className="text-5xl md:text-7xl font-bold tracking-tight max-w-3xl leading-[1.05]"
                      suppressHydrationWarning
                    >
                      {hydrated ? t("hero_title_1") : "Master the"}{" "}
                      <span className="text-gradient-primary italic font-serif">
                        {hydrated ? t("hero_title_span") : "Subtext"}
                      </span>{" "}
                      {hydrated ? t("hero_title_2") : "of human interaction"}
                    </h2>

                    <p
                      className="text-muted-foreground max-w-xl text-base md:text-lg mt-6 leading-relaxed"
                      suppressHydrationWarning
                    >
                      {hydrated
                        ? t("hero_description")
                        : "Paste any conversation to decode hidden intentions, personality traits, and architect strategic responses that bypass resistance."}
                    </p>

                    {/* Professional inline composer — placed BEFORE ads */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mt-12 w-full max-w-3xl"
                    >
                      <div className="glass-strong rounded-3xl premium-shadow border border-foreground/10 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/5 bg-foreground/[0.02]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                              {hydrated ? t("input_placeholder").slice(0, 0) || "Composer" : "Composer"}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground/60">
                            {input.length} / 8000
                          </span>
                        </div>
                        <Textarea
                          placeholder={hydrated ? t("input_placeholder") : ""}
                          className="min-h-[180px] max-h-[400px] bg-transparent border-none focus-visible:ring-0 text-base resize-none p-5 placeholder:text-muted-foreground/50 shadow-none rounded-none"
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
                        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-foreground/5 bg-foreground/[0.02]">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              accept=".txt,.md,.csv,.json,.log"
                              onChange={handleFileUpload}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10"
                              onClick={() => document.getElementById("file-upload")?.click()}
                              disabled={isUploading}
                              aria-label={t("attach_file")}
                            >
                              {isUploading ? (
                                <Loader2 className="w-4 h-4 me-1.5 animate-spin" />
                              ) : (
                                <Paperclip className="w-4 h-4 me-1.5" />
                              )}
                              <span className="hidden sm:inline">{hydrated ? t("attach_file") : "Attach"}</span>
                            </Button>
                            <span className="hidden md:inline text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/50">
                              ⌘ + ↵
                            </span>
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
                    </motion.div>

                    {hydrated && (
                      <>
                        <AdSlot hide={false} minHeight={250} className="mt-12 w-full max-w-2xl">
                          <AdsterraNative />
                        </AdSlot>
                        <AdSlot hide={false} minHeight={100} className="mt-6 w-full">
                          <AdsterraBanner />
                        </AdSlot>
                      </>
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
                    <div className="mb-2">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {t("analysis_report")}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.25em] mt-1">
                        {t("case_id")}: {caseId}
                      </p>
                    </div>

                    <PulseAnalysis data={result.pulse} />

                    <AdSlot hide={!hydrated} minHeight={100}>
                      <AdsterraBanner />
                    </AdSlot>

                    <AdSlot hide={!hydrated} minHeight={250} className="w-full max-w-2xl mx-auto">
                      <AdsterraNative />
                    </AdSlot>

                    <StrategyCards
                      strategies={result.strategies}
                      sourceText={analyzedText}
                      recipientPersona={result.pulse.recipientPersona}
                    />
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

      {hydrated && <AdsterraSocialBar />}
      {hydrated && <AdsterraPopunder />}
    </TooltipProvider>
  );
}
