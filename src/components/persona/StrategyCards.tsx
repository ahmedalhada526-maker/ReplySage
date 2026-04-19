import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Copy, Flame, Heart, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { AnalysisResult } from "@/server/analyze.functions";

interface StrategyCardsProps {
  strategies: AnalysisResult["strategies"];
}

type StrategyKey = "tactician" | "empath" | "alpha" | "savage";

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
        active: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--shadow-glow-primary)]",
      };
    case "accent":
      return {
        chip: "bg-accent/10 text-accent border-accent/25",
        active: "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-[var(--shadow-glow-accent)]",
      };
    case "danger":
      return {
        chip: "bg-destructive/10 text-destructive border-destructive/30",
        active: "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
      };
    default:
      return {
        chip: "bg-foreground/10 text-foreground border-foreground/15",
        active: "data-[state=active]:bg-foreground data-[state=active]:text-background",
      };
  }
}

export function StrategyCards({ strategies }: StrategyCardsProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderCard = (key: StrategyKey) => {
    const data = strategies[key];
    const Icon = META[key].icon;
    const cls = ToneClasses(META[key].tone);
    const title = t(key);

    return (
      <div className="space-y-6 mt-6">
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group premium-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cls.chip}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold tracking-tight">{title}</h4>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(data.response, key)}
              className="rounded-full hover:bg-foreground/5 h-9 w-9"
              aria-label={t("copy")}
            >
              {copied === key ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>

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
        <TabsList className="flex w-full max-w-md mx-auto glass-panel p-1 rounded-2xl mb-6 h-auto">
          {(["tactician", "empath", "alpha"] as StrategyKey[]).map((key) => {
            const Icon = META[key].icon;
            const cls = ToneClasses(META[key].tone);
            return (
              <TabsTrigger
                key={key}
                value={key}
                className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-all ${cls.active}`}
              >
                <Icon className="w-4 h-4 me-2" />
                <span className="hidden sm:inline">{t(key)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="tactician">{renderCard("tactician")}</TabsContent>
        <TabsContent value="empath">{renderCard("empath")}</TabsContent>
        <TabsContent value="alpha">{renderCard("alpha")}</TabsContent>
      </Tabs>
    </motion.div>
  );
}
