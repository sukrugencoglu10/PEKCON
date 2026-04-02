'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TrackingLogic() {
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');
      const utmTerm = searchParams.get('utm_term');
      const gclid = searchParams.get('gclid');
      const fbclid = searchParams.get('fbclid');
      const referrer = document.referrer;

      const existingTracking = localStorage.getItem('site_tracking_data');
      let trackingData: Record<string, string> = existingTracking ? JSON.parse(existingTracking) : {};

      let hasNewData = false;

      if (utmSource) { trackingData.utmSource = utmSource; hasNewData = true; }
      if (utmMedium) { trackingData.utmMedium = utmMedium; hasNewData = true; }
      if (utmCampaign) { trackingData.utmCampaign = utmCampaign; hasNewData = true; }
      if (utmTerm) { trackingData.utmTerm = utmTerm; hasNewData = true; }
      if (gclid) { trackingData.gclid = gclid; hasNewData = true; }
      if (fbclid) { trackingData.fbclid = fbclid; hasNewData = true; }
      
      // Save the original referrer only if it's not already set
      if (!trackingData.originalReferrer) {
        trackingData.originalReferrer = referrer || 'Direct';
        hasNewData = true;
      }

      if (hasNewData) {
        localStorage.setItem('site_tracking_data', JSON.stringify(trackingData));
      }
    } catch (error) {
      console.error('Tracking parse error', error);
    }
  }, [searchParams]);

  return null;
}

export function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingLogic />
    </Suspense>
  );
}
