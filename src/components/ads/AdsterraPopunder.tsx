import { useEffect } from "react";
import { ADSTERRA, isPlaceholder } from "@/lib/adsterra-config";

const SCRIPT_ID = "adsterra-popunder";
const TRIGGERED_KEY = "adsterra-popunder-loaded";

/**
 * Manually triggers the Adsterra Popunder script.
 * Should be called in response to a user gesture (e.g. button click)
 * to comply with Adsterra policy and avoid popup blockers.
 *
 * Loads only once per browser session.
 */
export function triggerAdsterraPopunder() {
  if (typeof document === "undefined") return;
  if (isPlaceholder(ADSTERRA.popunder.scriptSrc)) return;
  if (document.getElementById(SCRIPT_ID)) return;
  if (sessionStorage.getItem(TRIGGERED_KEY) === "1") return;

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = ADSTERRA.popunder.scriptSrc;
  document.body.appendChild(script);
  sessionStorage.setItem(TRIGGERED_KEY, "1");
}

/**
 * No-op component kept for backwards compatibility.
 * The popunder is now triggered explicitly from the "Start Scan" button.
 */
export function AdsterraPopunder() {
  useEffect(() => {
    // Intentionally empty — trigger is manual via triggerAdsterraPopunder().
  }, []);
  return null;
}
