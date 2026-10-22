"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface GoogleAdSlotProps {
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  responsive?: boolean;
  className?: string;
  label?: string;
}

export function GoogleAdSlot({
  slotId = "1234567890",
  format = "horizontal",
  responsive = true,
  className = "",
  label = "Advertisement",
}: GoogleAdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isPushedRef = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const hasRealId = !!clientId && clientId !== "ca-pub-XXXXXXXXXXXXXXXX";

  useEffect(() => {
    if (typeof window === "undefined" || !hasRealId || isPushedRef.current) return;

    try {
      if (adRef.current && adRef.current.innerHTML.trim() === "") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushedRef.current = true;
        setAdLoaded(true);
      }
    } catch (e) {
      console.warn("Google AdSense push error:", e);
    }
  }, [hasRealId]);

  // When no real AdSense Publisher ID is active, keep the slot in the DOM code
  // but completely invisible to clients & visitors (no placeholder boxes, no borders, no text).
  if (!hasRealId) {
    return (
      <div 
        className={`google-ad-placeholder hidden opacity-0 pointer-events-none select-none ${className}`}
        aria-hidden="true"
        data-ads-slot-reserved="true"
      >
        <ins
          className="adsbygoogle"
          style={{ display: "none" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format={format === "auto" ? "auto" : undefined}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden ${className}`}>
      {adLoaded && (
        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 select-none font-medium">
          Advertisement
        </span>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
