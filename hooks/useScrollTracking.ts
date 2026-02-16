'use client';

import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/gtm';

/**
 * Scroll depth tracking hook
 * Tracks when user scrolls to 25%, 50%, 75%, and 90% of page
 */
export function useScrollTracking() {
  const trackedPercentages = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

      // Track at 25%, 50%, 75%, 90% milestones
      const milestones = [25, 50, 75, 90];

      milestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !trackedPercentages.current.has(milestone)) {
          trackedPercentages.current.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    };

    // Throttle scroll event for performance
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      if (timeoutId) {
        return;
      }
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null as any;
      }, 500); // Check every 500ms
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
}
