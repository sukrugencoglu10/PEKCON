'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';

function TrackingLogic() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');
      const utmTerm = searchParams.get('utm_term');
      const gclid = searchParams.get('gclid');
      const fbclid = searchParams.get('fbclid');
      const referrer = document.referrer;

      const hasNewUtmSignal = !!(utmSource || gclid);

      const existingTracking = localStorage.getItem('site_tracking_data');
      let trackingData: Record<string, string> = existingTracking ? JSON.parse(existingTracking) : {};

      if (hasNewUtmSignal) {
        // New ad/utm signal: reset to last-touch attribution
        trackingData = {};
        if (utmSource) trackingData.utmSource = utmSource;
        if (utmMedium) trackingData.utmMedium = utmMedium;
        if (utmCampaign) trackingData.utmCampaign = utmCampaign;
        if (utmTerm) trackingData.utmTerm = utmTerm;
        if (gclid) trackingData.gclid = gclid;
        if (fbclid) trackingData.fbclid = fbclid;
        trackingData.originalReferrer = referrer || 'Direct';
        localStorage.setItem('site_tracking_data', JSON.stringify(trackingData));
      } else if (!existingTracking) {
        // First visit with no UTM — record referrer only
        trackingData.originalReferrer = referrer || 'Direct';
        localStorage.setItem('site_tracking_data', JSON.stringify(trackingData));
      }

      // Send page view once per browser session when UTM/gclid is present
      const sessionKey = 'pv_sent';
      const alreadySent = sessionStorage.getItem(sessionKey);
      if (!alreadySent && (utmSource || gclid)) {
        let sessionId = sessionStorage.getItem('pv_session_id');
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          sessionStorage.setItem('pv_session_id', sessionId);
        }

        const payload = {
          sessionId,
          utmSource: utmSource ?? trackingData.utmSource ?? null,
          utmMedium: utmMedium ?? trackingData.utmMedium ?? null,
          utmCampaign: utmCampaign ?? trackingData.utmCampaign ?? null,
          utmTerm: utmTerm ?? trackingData.utmTerm ?? null,
          gclid: gclid ?? trackingData.gclid ?? null,
          fbclid: fbclid ?? trackingData.fbclid ?? null,
          originalReferrer: referrer || trackingData.originalReferrer || 'Direct',
          pageUrl: window.location.href,
          locale: pathname.split('/')[1] ?? 'tr',
        };

        fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then(() => {
          sessionStorage.setItem(sessionKey, '1');
        }).catch(() => {/* silent fail */});
      }
    } catch {
      // Silent fail — tracking must never break UX
    }
  }, [searchParams, pathname]);

  return null;
}

export function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingLogic />
    </Suspense>
  );
}
