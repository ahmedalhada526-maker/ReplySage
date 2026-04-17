import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, EyeOff, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] glass-strong border-primary/30 p-0 overflow-hidden">
        <div className="bg-primary/10 p-8 text-center relative">
          <div className="absolute top-4 end-4">
            <Crown className="w-8 h-8 text-primary opacity-30" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold tracking-tight mb-2">
              {t("upgrade_pro")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("upgrade_message")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{t("upgrade_unlimited")}</p>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{t("upgrade_advanced")}</p>
            </li>
            <li className="flex items-start gap-3">
              <EyeOff className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{t("upgrade_clean")}</p>
            </li>
          </ul>

          <div className="bg-foreground/5 rounded-2xl p-4 border border-foreground/5 text-center">
            <span className="text-3xl font-bold">$4.99</span>
            <span className="text-xs text-muted-foreground ms-2">one-time</span>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onSuccess}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-12 font-semibold"
            >
              <Crown className="w-4 h-4 me-2" />
              {t("activate_pro")}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full rounded-full text-muted-foreground hover:bg-foreground/5"
            >
              {t("maybe_later")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
