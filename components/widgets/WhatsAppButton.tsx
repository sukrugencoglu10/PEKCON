'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { trackWhatsAppConversion } from '@/lib/gtm';

export default function WhatsAppButton() {
  const params = useParams();
  const locale = params?.locale as string || 'tr';

  const phoneNumber = '905427179357'; // +90 542 717 93 57
  const displayNumber = '+90 542 717 93 57';

  // Localized messages
  const message = locale === 'en'
    ? "Hello, I would like to get information about containers."
    : "Merhaba, konteyner hakkında bilgi almak istiyorum.";

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const handleClick = () => {
    trackWhatsAppConversion(locale);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 animate-[fadeInUp_0.3s_ease_forwards] md:bottom-6">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all group md:hover:scale-110 md:active:scale-95 animate-heartbeat md:animate-none"
        aria-label="WhatsApp ile iletişime geç"
      >
        {/* WhatsApp Logo SVG */}
        <svg
          viewBox="0 0 24 24"
          className="w-9 h-9 relative z-10"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Tooltip - Desktop only */}
        <div className="absolute right-full mr-4 bottom-0 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out pointer-events-none hidden md:block">
          <div className="relative w-[260px] bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden">

            {/* Brand header */}
            <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-100">
              <Image src="/SVGpekcon_x.svg" alt="PEKCON" width={100} height={28} className="h-[22px] w-auto" />
              <span className="text-[10px] text-gray-400 font-medium">{locale === 'en' ? 'Support' : 'Destek'}</span>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              <p className="text-[13px] text-gray-700 leading-snug">
                {locale === 'en'
                  ? 'Get a quick quote or ask about our container solutions.'
                  : 'H\u{0131}zl\u{0131} teklif al\u{0131}n veya konteyner \u{00E7}\u{00F6}z\u{00FC}mlerimiz hakk\u{0131}nda bilgi edinin.'}
              </p>
              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-100">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="text-[13px] font-semibold text-gray-900">{displayNumber}</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute right-0 bottom-5 translate-x-full w-0 h-0 border-l-8 border-l-white border-y-[6px] border-y-transparent" />
          </div>
        </div>

        {/* Pulse animation ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" />
      </a>
    </div>
  );
}
