import { Heart, Flame, Snowflake, Brain, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ResponseStyleKey } from "@/lib/analyze.functions";

const STYLES: Array<{
  key: ResponseStyleKey;
  icon: typeof Heart;
  labelKey: string;
  tone: string;
}> = [
  {
    key: "romantic",
    icon: Heart,
    labelKey: "style_romantic",
    tone: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-300",
  },
  {
    key: "bold",
    icon: Flame,
    labelKey: "style_bold",
    tone: "from-orange-500/20 to-red-500/10 border-orange-500/30 text-orange-300",
  },
  {
    key: "cold",
    icon: Snowflake,
    labelKey: "style_cold",
    tone: "from-sky-500/20 to-cyan-500/10 border-sky-500/30 text-sky-300",
  },
  {
    key: "smart",
    icon: Brain,
    labelKey: "style_smart",
    tone: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-300",
  },
  {
    key: "defensive",
    icon: Shield,
    labelKey: "style_defensive",
    tone: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300",
  },
];

interface Props {
  value: ResponseStyleKey | null;
  onChange: (k: ResponseStyleKey | null) => void;
}

export function ResponseStylePicker({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {t("response_style_label")}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STYLES.map(({ key, icon: Icon, labelKey, tone }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(active ? null : key)}
              className={`group relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all bg-gradient-to-br ${tone} ${
                active
                  ? "scale-[1.02] ring-2 ring-primary/60 shadow-[var(--shadow-glow-primary)]"
                  : "opacity-80 hover:opacity-100 hover:scale-[1.01]"
              }`}
              aria-pressed={active}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-semibold leading-tight text-center text-foreground/90">
                {t(labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
