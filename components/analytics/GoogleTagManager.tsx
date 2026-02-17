'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleTagManager({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    // Track pageview on mount and route changes
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
          event: 'pageview',
          page: window.location.pathname,
        });
      }
    };

    // Initial pageview
    handleRouteChange();
  }, []);

  return (
    <>
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          className="hidden"
        />
      </noscript>
    </>
  );
}
