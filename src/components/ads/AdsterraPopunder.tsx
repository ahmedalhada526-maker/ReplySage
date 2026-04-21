import { useEffect } from "react";
import { ADSTERRA, isPlaceholder } from "@/lib/adsterra-config";

const SCRIPT_ID = "adsterra-popunder";
const TRIGGERED_KEY = "adsterra-popunder-loaded";

/**
 * Injects the Adsterra Popunder script on the FIRST user interaction
 * (click / touch / keydown) — this matches Adsterra's policy and avoids
 * triggering popup blockers on initial page load.
 *
 * The script is loaded only once per page session.
 */
export function AdsterraPopunder() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isPlaceholder(ADSTERRA.popunder.scriptSrc)) return;
    if (document.getElementById(SCRIPT_ID)) return;
    // Avoid re-triggering if user navigates between routes in the same session
    if (sessionStorage.getItem(TRIGGERED_KEY) === "1") return;

    const inject = () => {
      if (document.getElementById(SCRIPT_ID)) return;
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = ADSTERRA.popunder.scriptSrc;
      document.body.appendChild(script);
      sessionStorage.setItem(TRIGGERED_KEY, "1");
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("click", inject);
      document.removeEventListener("touchstart", inject);
      document.removeEventListener("keydown", inject);
    };

    document.addEventListener("click", inject, { once: true });
    document.addEventListener("touchstart", inject, { once: true });
    document.addEventListener("keydown", inject, { once: true });

    return cleanup;
  }, []);

  return null;
}
