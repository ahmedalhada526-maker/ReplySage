import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ADSTERRA, isPlaceholder } from "@/lib/adsterra-config";

interface AdsterraBannerProps {
  className?: string;
}

/**
 * Renders an Adsterra iframe banner.
 * Auto-switches between 320x50 (mobile) and 728x90 (desktop).
 * Silently renders nothing if keys are still placeholders.
 */
export function AdsterraBanner({ className }: AdsterraBannerProps) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const config = isMobile ? ADSTERRA.bannerMobile : ADSTERRA.bannerDesktop;

  useEffect(() => {
    if (!containerRef.current) return;
    if (isPlaceholder(config.key)) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Adsterra requires the options to be set BEFORE the script loads.
    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.innerHTML = `
      atOptions = {
        'key': '${config.key}',
        'format': '${config.format}',
        'height': ${config.height},
        'width': ${config.width},
        'params': {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `//www.highperformanceformat.com/${config.key}/invoke.js`;
    invokeScript.async = true;

    container.appendChild(optionsScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = "";
    };
  }, [config]);

  if (isPlaceholder(config.key)) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: config.width,
        height: config.height,
        margin: "0 auto",
        overflow: "hidden",
      }}
      aria-label="Advertisement"
    />
  );
}
