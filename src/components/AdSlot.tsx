import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ADSENSE_CLIENT, ADSENSE_SLOT, adsConfigured } from '../lib/ads';
import { adsConsented, useConsent } from '../state/consent';

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number };
  }
}

const SCRIPT_ID = 'adsbygoogle-js';

/** Load the AdSense script once, only after consent. */
function loadScript() {
  if (document.getElementById(SCRIPT_ID)) return;
  // Non-personalized ads only: no interest profiles, whatever the account default.
  const q = (window.adsbygoogle = window.adsbygoogle || []);
  q.requestNonPersonalizedAds = 1;
  const s = document.createElement('script');
  s.id = SCRIPT_ID;
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
  document.head.appendChild(s);
}

/**
 * One responsive ad unit. Renders nothing unless AdSense is configured and
 * the visitor allowed advertising cookies. Every request is tagged for teen
 * age treatment and non-personalized ads, since the pages that carry it are
 * the high-school courses.
 */
export function AdSlot() {
  const choice = useConsent((s) => s.choice);
  const { pathname } = useLocation();
  const ref = useRef<HTMLModElement>(null);
  const show = adsConfigured && adsConsented(choice);

  useEffect(() => {
    if (!show || !ref.current) return;
    loadScript();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* blocked or offline: the slot stays empty */
    }
  }, [show, pathname]);

  if (!show) {
    // In development, show where the ad would sit so layout can be checked.
    if (import.meta.env.DEV && adsConsented(choice)) {
      return (
        <div className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border-2 border-dashed border-line px-4 py-6 text-center font-display text-xs font-bold uppercase tracking-wider text-ink-dim">
          Ad slot · set VITE_ADSENSE_CLIENT and VITE_ADSENSE_SLOT
        </div>
      );
    }
    return null;
  }

  return (
    <aside aria-label="Advertisement" className="mx-auto mt-8 w-full max-w-3xl">
      <div className="mb-1 text-center font-display text-[10px] font-bold uppercase tracking-wider text-ink-dim">
        Advertisement
      </div>
      <ins
        key={pathname}
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-tag-for-age-treatment="2"
        {...(import.meta.env.DEV ? { 'data-adtest': 'on' } : {})}
      />
    </aside>
  );
}
