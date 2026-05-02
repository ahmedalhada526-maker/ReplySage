import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Brain } from "lucide-react";

const STEP_KEYS = ["loader_step_1", "loader_step_2", "loader_step_3"];
const INTERVAL_MS = 1600;

export function AnalyzingLoader() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % STEP_KEYS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="glass-obsidian rounded-3xl premium-shadow p-8 flex flex-col items-center text-center gap-5 max-w-xl mx-auto"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-primary">
          <Brain className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <span className="absolute -inset-2 rounded-3xl border border-primary/20 animate-ping" />
      </div>

      <div className="h-8 relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
            className="text-base md:text-lg font-semibold text-foreground/95 absolute inset-0"
          >
            {t(STEP_KEYS[idx])}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        {STEP_KEYS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-8 bg-primary" : "w-2 bg-foreground/15"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
