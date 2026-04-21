import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Send,
  Loader2,
  MessageSquare,
  Languages,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Paperclip,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useServerFn } from "@tanstack/react-start";
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
import { AdsterraPopunder } from "@/components/ads/AdsterraPopunder";
import "@/lib/i18n";

interface HistoryItem {
  id: string;
  text: string;
  result: AnalysisResult;
  caseId: string;
}

export function PersonaWorkspace() {
  const { t, i18n } = useTranslation();
  const analyzeFn = useServerFn(analyzeInteraction);

  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const [caseId, setCaseId] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Sync HTML dir/lang with i18n (after hydration to avoid mismatch)
  useEffect(() => {
    if (!hydrated || typeof document === "undefined") return;
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language, i18n, hydrated]);

  const handleAnalyze = async () => {
    if (!input.trim() || isAnalyzing) return;

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
      setHistory((prev) =>
        [{ id, text: input, result: data, caseId: id }, ...prev].slice(0, 12),
      );
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

  return (
    <TooltipProvider>
      <div
        className="min-h-screen flex bg-background text-foreground overflow-hidden relative"
        suppressHydrationWarning
      >
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 288 : 0,
            opacity: sidebarOpen ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="h-screen border-e border-foreground/5 bg-sidebar/60 backdrop-blur-2xl flex flex-col overflow-hidden relative z-50"
        >
          <div className="p-6 flex items-center justify-between">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          </div>

          <div className="px-4 mb-4">
            <Button
              onClick={() => {
                setResult(null);
                setInput("");
              }}
              className="w-full justify-start bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 text-xs font-medium rounded-xl h-10 text-foreground"
              suppressHydrationWarning
            >
              <Plus className="w-4 h-4 me-2" />
              <span suppressHydrationWarning>{hydrated ? t("new_analysis") : "New analysis"}</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-1 pb-6">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-3 px-2"
                suppressHydrationWarning
              >
                {hydrated ? t("history") : "History"}
              </p>
              {history.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground/60">
                  <MessageSquare className="w-7 h-7 mx-auto mb-2 opacity-50" />
                  <p className="text-[11px]" suppressHydrationWarning>
                    {hydrated ? t("no_history") : "No analyses yet"}
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setInput(item.text);
                      setResult(item.result);
                      setAnalyzedText(item.text);
                      setCaseId(item.caseId);
                    }}
                    className="w-full text-start p-3 rounded-xl hover:bg-foreground/5 transition-all border border-transparent hover:border-foreground/5 group"
                  >
                    <p className="text-[10px] font-mono text-muted-foreground mb-1">
                      #{item.caseId}
                    </p>
                    <p className="text-xs line-clamp-2 text-foreground/70 group-hover:text-foreground transition-colors">
                      {item.text}
                    </p>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-4 mt-auto space-y-2 border-t border-foreground/5">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-muted-foreground hover:text-foreground rounded-xl bg-foreground/5 hover:bg-foreground/10"
              onClick={toggleLanguage}
              suppressHydrationWarning
            >
              <Languages className="w-4 h-4 me-2" />
              <span suppressHydrationWarning>
                {hydrated ? (isRtl ? "English" : "العربية") : "العربية"}
              </span>
            </Button>
          </div>
        </motion.aside>

        {/* Main */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="absolute top-6 start-6 z-50 h-10 w-10 glass-panel rounded-xl"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </Button>
          )}

          <ScrollArea className="flex-1">
            <div className="max-w-5xl mx-auto p-6 md:p-12 pb-44">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-[70vh] flex flex-col items-center justify-center text-center"
                  >
                    <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                        {t("hero_eyebrow")}
                      </span>
                    </div>

                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 glow-primary mb-8">
                      <Brain className="w-10 h-10 text-primary" />
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight max-w-3xl leading-[1.05]">
                      {t("hero_title_1")}{" "}
                      <span className="text-gradient-primary italic font-serif">
                        {t("hero_title_span")}
                      </span>{" "}
                      {t("hero_title_2")}
                    </h2>

                    <p className="text-muted-foreground max-w-xl text-base md:text-lg mt-6 leading-relaxed">
                      {t("hero_description")}
                    </p>

                    {hydrated && (
                      <>
                        <AdSlot hide={false} className="mt-12 w-full max-w-2xl">
                          <AdsterraNative />
                        </AdSlot>
                        <AdSlot hide={false} className="mt-6 w-full">
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

                    <AdSlot hide={!hydrated}>
                      <AdsterraBanner />
                    </AdSlot>

                    <AdSlot hide={!hydrated} className="w-full max-w-2xl mx-auto">
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

          {/* Floating command bar */}
          <div className="absolute bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-full max-w-2xl px-6 z-40">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass-strong p-2 rounded-[2rem] premium-shadow flex items-end gap-2"
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".txt,.md,.csv,.json,.log"
                onChange={handleFileUpload}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 shrink-0"
                onClick={() => document.getElementById("file-upload")?.click()}
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
                placeholder={t("input_placeholder")}
                className="min-h-[48px] max-h-48 bg-transparent border-none focus-visible:ring-0 text-sm resize-none py-3 px-2 placeholder:text-muted-foreground/60 shadow-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
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
        </main>
      </div>

      {hydrated && <AdsterraSocialBar />}
      {hydrated && <AdsterraPopunder />}
    </TooltipProvider>
  );
}
