'use client';

import { useEffect } from 'react';

export default function ChatWidget() {
  useEffect(() => {
    // Tawk.to integration
    // Replace with your actual Tawk.to Property ID and Widget ID
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.head.appendChild(script);

      // Cleanup
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return null; // Widget is injected via script
}
