'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsEvents() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll tracking
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll >= 70 && maxScroll < 71) { // Trigger once around 70%
            if (typeof window.dataLayer !== 'undefined') {
                window.dataLayer.push({
                    event: 'scroll_depth_70',
                    path: pathname
                });
            }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
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
      }
    };

    document.addEventListener('click', handleWhatsAppClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleWhatsAppClick);
    };
  }, [pathname]);

  return null;
}
