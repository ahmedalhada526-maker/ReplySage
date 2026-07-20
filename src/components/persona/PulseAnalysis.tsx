import { Badge } from "@/components/ui/badge";
import { Eye, Fingerprint, Sparkles, Target } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { AnalysisResult } from "@/lib/analyze.functions";
import { ManipulationGauge } from "./ManipulationGauge";
import { MotivesList } from "./MotivesList";

interface PulseAnalysisProps {
  data: AnalysisResult["pulse"];
}

export function PulseAnalysis({ data }: PulseAnalysisProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div className="bento-grid">
        <div className="md:col-span-2">
          <ManipulationGauge score={data.manipulationScore ?? 0} />
        </div>
      </div>

      <div className="bento-grid">
      {/* Recipient Persona — large card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="md:col-span-2"
      >
        <div className="glass-panel p-8 rounded-3xl h-full relative overflow-hidden group premium-shadow">
          <div className="absolute top-0 end-0 p-6 opacity-[0.06] group-hover:opacity-10 transition-opacity">
            <Fingerprint className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Fingerprint className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                {t("recipient_persona")}
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-8">
              {data.recipientPersona}
            </p>
            <div className="flex flex-wrap gap-2">
              {data.personalityTraits?.mbti && (
                <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider">
                  {t("mbti")}: {data.personalityTraits.mbti}
                </Badge>
              )}
              {data.personalityTraits?.bigFive && (
                <Badge className="bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider">
                  {t("big_five")}: {data.personalityTraits.bigFive}
                </Badge>
              )}
              {data.personalityTraits?.enneagram && (
                <Badge className="bg-foreground/5 text-foreground/70 border border-foreground/10 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider">
                  {t("enneagram")}: {data.personalityTraits.enneagram}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Dynamic */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="glass-panel p-6 rounded-3xl h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
              <Target className="w-4 h-4 text-accent" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {t("current_dynamic")}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">{data.currentDynamic}</p>
        </div>
      </motion.div>

      {/* Hidden Needs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="glass-panel p-6 rounded-3xl h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center border border-foreground/10">
              <Eye className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {t("hidden_needs")}
            </span>
          </div>
          <p className="text-sm italic text-foreground/85 leading-relaxed border-s-2 border-primary/40 ps-4">
            "{data.hiddenNeeds}"
          </p>
        </div>
      </motion.div>

      {/* Advanced Insights — full width, free for everyone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="md:col-span-2"
      >
        <div className="glass-panel p-8 rounded-3xl border-primary/20 relative overflow-hidden premium-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {t("advanced_insights")}
            </span>
          </div>
          <p className="text-base leading-relaxed text-foreground/90">{data.advancedInsights}</p>
        </div>
      </motion.div>
      </div>

      <MotivesList motives={data.motives ?? []} />
    </div>
  );
}
