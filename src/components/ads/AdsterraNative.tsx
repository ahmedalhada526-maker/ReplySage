import { useEffect, useRef } from "react";
import { ADSTERRA, isPlaceholder } from "@/lib/adsterra-config";

interface AdsterraNativeProps {
  className?: string;
}

/**
 * Renders an Adsterra Native Banner.
 * Silently renders nothing if the script URL is still a placeholder.
 */
export function AdsterraNative({ className }: AdsterraNativeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (isPlaceholder(ADSTERRA.native.scriptSrc)) return;

    const wrapper = wrapperRef.current;

    // Inject the container div Adsterra expects
    const container = document.createElement("div");
    container.id = ADSTERRA.native.containerId;
    wrapper.appendChild(container);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ADSTERRA.native.scriptSrc;
    wrapper.appendChild(script);

    return () => {
      wrapper.innerHTML = "";
    };
  }, []);

  if (isPlaceholder(ADSTERRA.native.scriptSrc)) return null;

  return (
    <div
      ref={wrapperRef}
      className={className}
      aria-label="Sponsored content"
    />
  );
}
