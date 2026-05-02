import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Target, Zap, Flame, Eye, HeartCrack } from "lucide-react";

const ICONS = [Target, Zap, Flame, Eye, HeartCrack];

interface Props {
  motives: string[];
}

export function MotivesList({ motives }: Props) {
  const { t } = useTranslation();
  if (!motives?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="glass-obsidian p-6 rounded-3xl premium-shadow"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
          <Target className="w-4 h-4 text-accent" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {t("motives_title")}
        </span>
      </div>
      <ul className="space-y-3">
        {motives.map((m, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 flex-1">{m}</p>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
