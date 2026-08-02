import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

interface Props {
  score: number; // 0-100
}

export function ManipulationGauge({ score }: Props) {
  const { t } = useTranslation();
  const safe = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(safe));
    return () => cancelAnimationFrame(id);
  }, [safe]);

  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (animated / 100) * circ;

  const color = safe >= 75 ? "var(--destructive)" : safe >= 45 ? "var(--gold)" : "var(--primary)";

  const level = safe >= 75 ? "عالي جدًا" : safe >= 45 ? "متوسط" : "منخفض";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="glass-obsidian p-6 rounded-3xl premium-shadow flex items-center gap-5"
    >
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="oklch(1 0 0 / 0.06)"
            strokeWidth="10"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tabular-nums" style={{ color }}>
            {animated}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" style={{ color }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            {t("manipulation_score")}
          </span>
        </div>
        <p className="text-lg font-bold" style={{ color }}>
          {level}
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {safe >= 75
            ? "الرسالة فيها تلاعب عاطفي واضح — انتبه لكل كلمة."
            : safe >= 45
              ? "في إشارات تلاعب جزئية، خذ وقتك قبل الرد."
              : "الرسالة طبيعية نسبيًا، بدون تلاعب واضح."}
        </p>
      </div>
    </motion.div>
  );
}
