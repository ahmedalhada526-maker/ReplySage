import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  Flame,
  Heart,
  Shield,
  Zap,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import type { AnalysisResult } from "@/lib/analyze.functions";
import { regenerateSavage } from "@/lib/analyze.functions";

interface StrategyCardsProps {
  strategies: AnalysisResult["strategies"];
  sourceText: string;
  recipientPersona: string;
}

type StrategyKey = "tactician" | "empath" | "alpha" | "savage";

interface SavageVariant {
  response: string;
  whyItWorks: string;
}

const META: Record<
  StrategyKey,
  { icon: typeof Shield; tone: "primary" | "accent" | "neutral" | "danger" }
> = {
  tactician: { icon: Shield, tone: "primary" },
  empath: { icon: Heart, tone: "accent" },
  alpha: { icon: Zap, tone: "neutral" },
  savage: { icon: Flame, tone: "danger" },
};

function ToneClasses(tone: "primary" | "accent" | "neutral" | "danger") {
  switch (tone) {
    case "primary":
      return {
        chip: "bg-primary/10 text-primary border-primary/25",
        active:
          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--shadow-glow-primary)]",
      };
    case "accent":
      return {
        chip: "bg-accent/10 text-accent border-accent/25",
        active:
          "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-[var(--shadow-glow-accent)]",
      };
    case "danger":
      return {
        chip: "bg-destructive/10 text-destructive border-destructive/30",
        active:
          "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
      };
    default:
      return {
        chip: "bg-foreground/10 text-foreground border-foreground/15",
        active: "data-[state=active]:bg-foreground data-[state=active]:text-background",
      };
  }
}

const MAX_SAVAGE_VARIANTS = 3;

export function StrategyCards({ strategies, sourceText, recipientPersona }: StrategyCardsProps) {
  const { t, i18n } = useTranslation();
  const regenerateFn = useServerFn(regenerateSavage);
  const [copied, setCopied] = useState<string | null>(null);

  // Savage variants: index 0 is the original; user can generate up to MAX_SAVAGE_VARIANTS-1 alternatives
  const [savageVariants, setSavageVariants] = useState<SavageVariant[]>([
    { response: strategies.savage.response, whyItWorks: strategies.savage.whyItWorks },
  ]);
  const [savageIndex, setSavageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegenerateSavage = async () => {
    if (isGenerating || savageVariants.length >= MAX_SAVAGE_VARIANTS) return;
    setIsGenerating(true);
    try {
      const lang = (i18n.language?.startsWith("ar") ? "ar" : "en") as "en" | "ar";
      const { response, whyItWorks, error } = await regenerateFn({
        data: {
          text: sourceText.slice(0, 8000),
          language: lang,
          recipientPersona: recipientPersona?.slice(0, 2000),
          previousResponses: savageVariants.map((v) => v.response).slice(0, 5),
        },
      });
      if (error || !response || !whyItWorks) {
        if (error === "rate_limit") toast.error(t("error_rate_limit"));
        else if (error === "credits") toast.error(t("error_credits"));
        else toast.error(t("error_generic"));
        return;
      }
      setSavageVariants((prev) => {
        const next = [...prev, { response, whyItWorks }];
        setSavageIndex(next.length - 1);
        return next;
      });
    } catch (e) {
      console.error(e);
      toast.error(t("error_generic"));
    } finally {
      setIsGenerating(false);
    }
  };

  const renderCard = (key: StrategyKey) => {
    const isSavage = key === "savage";
    const data = isSavage ? savageVariants[savageIndex] : strategies[key];
    const Icon = META[key].icon;
    const cls = ToneClasses(META[key].tone);
    const title = t(key);
    const copyId = isSavage ? `savage-${savageIndex}` : key;
    const canGenerateMore = isSavage && savageVariants.length < MAX_SAVAGE_VARIANTS;

    return (
      <div className="space-y-6 mt-6">
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group premium-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cls.chip}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold tracking-tight">{title}</h4>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(data.response, copyId)}
              className="rounded-full hover:bg-foreground/5 h-9 w-9"
              aria-label={t("copy")}
            >
              {copied === copyId ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSavage ? `savage-content-${savageIndex}` : `${key}-content`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-foreground/[0.03] p-6 rounded-2xl border border-foreground/5 mb-6 group-hover:bg-foreground/[0.05] transition-colors">
                <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                  {data.response}
                </p>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground block mb-1">
                    {t("why_it_works")}
                  </span>
                  <p className="text-sm text-foreground/75 leading-relaxed">{data.whyItWorks}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {isSavage && (
            <div className="mt-6 pt-6 border-t border-foreground/5 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSavageIndex((i) => Math.max(0, i - 1))}
                  disabled={savageIndex === 0}
                  className="rounded-full h-9 w-9 hover:bg-destructive/10"
                  aria-label={t("previous_variant")}
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                  {savageIndex + 1} / {savageVariants.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSavageIndex((i) => Math.min(savageVariants.length - 1, i + 1))}
                  disabled={savageIndex >= savageVariants.length - 1}
                  className="rounded-full h-9 w-9 hover:bg-destructive/10"
                  aria-label={t("next_variant")}
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </div>

              <Button
                onClick={handleRegenerateSavage}
                disabled={isGenerating || !canGenerateMore}
                size="sm"
                className="rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 text-xs font-medium h-9 px-4 disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 me-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 me-2" />
                )}
                {canGenerateMore ? t("generate_alternative") : t("max_variants_reached")}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-12"
    >
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
          {t("strategy_architecture")}
        </span>
      </div>

      <Tabs defaultValue="tactician" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto glass-panel p-1 rounded-2xl mb-6 h-auto">
          {(["tactician", "empath", "alpha", "savage"] as StrategyKey[]).map((key) => {
            const Icon = META[key].icon;
            const cls = ToneClasses(META[key].tone);
            return (
              <TabsTrigger
                key={key}
                value={key}
                className={`rounded-xl py-2.5 text-xs font-medium transition-all ${cls.active}`}
              >
                <Icon className="w-4 h-4 sm:me-2" />
                <span className="hidden sm:inline">{t(key)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="tactician">{renderCard("tactician")}</TabsContent>
        <TabsContent value="empath">{renderCard("empath")}</TabsContent>
        <TabsContent value="alpha">{renderCard("alpha")}</TabsContent>
        <TabsContent value="savage">{renderCard("savage")}</TabsContent>
      </Tabs>
    </motion.div>
  );
}
