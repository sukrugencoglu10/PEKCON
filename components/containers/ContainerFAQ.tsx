import JsonLd from '@/components/seo/JsonLd';
import { containersFaq } from '@/data/container-specs';
import type { Locale } from '@/lib/i18n';

export default function ContainerFAQ({ locale = 'tr' }: { locale?: Locale }) {
  const data = containersFaq[locale] || containersFaq.tr;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section aria-labelledby="containers-faq-title">
      <JsonLd data={schema} />
      <div className="max-w-4xl mx-auto">
        <h2
          id="containers-faq-title"
          className="text-3xl md:text-4xl font-display font-black text-dark-900 text-center mb-10"
        >
          {data.heading}
        </h2>

        <div className="space-y-3">
          {data.items.map((item, i) => (
            <details
              key={i}
              className="group bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between font-semibold text-dark-900 text-base md:text-lg select-none">
                <span>{item.q}</span>
                <span className="ml-4 text-primary-600 text-2xl leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-gray-700 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
