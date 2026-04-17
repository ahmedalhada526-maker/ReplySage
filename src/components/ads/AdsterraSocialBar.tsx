import { useEffect } from "react";
import { ADSTERRA, isPlaceholder } from "@/lib/adsterra-config";

const SCRIPT_ID = "adsterra-social-bar";

/**
 * Injects the Adsterra Social Bar script into <body> once.
 * Removes it on unmount (e.g. when user upgrades to Pro mid-session).
 */
export function AdsterraSocialBar() {
  useEffect(() => {
    if (isPlaceholder(ADSTERRA.socialBar.scriptSrc)) return;
    if (typeof document === "undefined") return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ADSTERRA.socialBar.scriptSrc;
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById(SCRIPT_ID);
      if (existing) existing.remove();
      // Adsterra Social Bar injects floating elements — best-effort cleanup
      document
        .querySelectorAll('[id^="rnd-"], [id^="ofrm-"]')
        .forEach((el) => el.remove());
    };
  }, []);

  return null;
}
