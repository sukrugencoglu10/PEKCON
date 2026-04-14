'use client';

import { useEffect } from 'react';

export default function AnalyticsEvents() {
  useEffect(() => {
    // Ensure dataLayer is initialized
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
    }
    
    const pathname = window.location.pathname;
    // Enhanced scroll tracking with multiple thresholds
    const scrollThresholds = [25, 50, 75, 90, 100];
    const triggered = new Set<number>();

    const handleScroll = () => {
      const scrollPercent =
        ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100;

      scrollThresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push({
              event: 'scroll_depth',
              scroll_percentage: threshold,
              page: pathname,
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // WhatsApp Click Tracking
    const handleWhatsAppClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href.includes('wa.me')) {
        if (typeof window.dataLayer !== 'undefined') {
             window.dataLayer.push({
                event: 'whatsapp_click',
                path: pathname
            });
        }

        // Analytics DB kaydı (catch-all)
        try {
          const tracking = JSON.parse(localStorage.getItem('site_tracking_data') || '{}');
          fetch('/api/analytics/conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'whatsapp_click',
              utm_source: tracking.utmSource,
              utm_medium: tracking.utmMedium,
              utm_campaign: tracking.utmCampaign,
              utm_term: tracking.utmTerm,
              gclid: tracking.gclid,
              fbclid: tracking.fbclid,
              original_referrer: tracking.originalReferrer,
              page_url: window.location.href,
            }),
          }).catch(() => {});
        } catch {}
      }
    };

    document.addEventListener('click', handleWhatsAppClick);

    // Section visibility tracking with Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof window.dataLayer !== 'undefined') {
            const sectionId = entry.target.id || entry.target.getAttribute('data-track-section');
            if (sectionId) {
              window.dataLayer.push({
                event: 'section_view',
                section_name: sectionId,
                page: pathname,
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe key sections
    const sections = document.querySelectorAll('[data-track-section], section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleWhatsAppClick);
      observer.disconnect();
    };
  }, []);

  return null;
}
