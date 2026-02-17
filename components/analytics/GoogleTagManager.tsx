'use client';

import { useEffect } from 'react';

export default function GoogleTagManager({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    // Load GTM script dynamically
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    script.async = true;
    document.head.appendChild(script);

    // Track initial pageview after GTM loads
    script.onload = () => {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'pageview',
          page: window.location.pathname,
        });
      }
    };
  }, [gtmId]);

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
