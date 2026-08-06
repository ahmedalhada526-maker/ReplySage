import { useState } from "react";
import { Lock, Play, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { showRewarded } from "@/lib/ads/AdService";
import { toast } from "sonner";

interface Props {
  unlocked: boolean;
  onUnlock: () => void;
  children: React.ReactNode;
}

/**
 * Wraps the strategy content. While locked: heavy blur + gold CTA overlay.
 * On click: triggers Start.io rewarded video; on completion -> unlocks.
 */
export function LockedStrategy({ unlocked, onUnlock, children }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await showRewarded();
      if (res.completed) {
        onUnlock();
        toast.success(t("strategy_unlocked"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`transition-all duration-500 ${
          unlocked ? "" : "blur-[10px] pointer-events-none select-none"
        }`}
        aria-hidden={!unlocked}
      >
        {children}
      </div>

      {!unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center p-6"
        >
          <div className="glass-obsidian rounded-3xl premium-shadow p-7 max-w-md w-full text-center border border-[color:var(--gold)]/30">
            <div className="mx-auto w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mb-4 glow-gold">
              <Lock className="w-7 h-7 text-[color:var(--gold-foreground)]" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1.5">{t("strategy_locked_title")}</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              {t("strategy_locked_desc")}
            </p>
            <button
              onClick={handleUnlock}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-2xl gradient-gold text-[color:var(--gold-foreground)] font-extrabold text-sm glow-gold transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("strategy_unlocking")}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  {t("strategy_unlock_cta")}
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
