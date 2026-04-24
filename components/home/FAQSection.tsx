import JsonLd from '@/components/seo/JsonLd';
import type { Locale } from '@/lib/i18n';

const FAQ_DATA: Record<Locale, { heading: string; items: { q: string; a: string }[] }> = {
  tr: {
    heading: 'Sıkça Sorulan Sorular',
    items: [
      {
        q: 'Hangi konteyner tiplerini satıyorsunuz?',
        a: '20ft DC, 40ft DC, 40ft HC, 45ft HC, Reefer (soğutmalı), Flat Rack ve Open Top dahil tüm standart ve özel tip yük konteynerlerini sıfır ve ikinci el olarak tedarik ediyoruz.',
      },
      {
        q: 'Konteyner fiyatları nasıl belirleniyor?',
        a: 'Fiyat; konteyner tipine, kondisyonuna (sıfır / ikinci el), adetine ve teslimat lokasyonuna göre değişir. Hızlı teklif için formumuzu doldurmanız yeterlidir, 24 saat içinde dönüş yapıyoruz.',
      },
      {
        q: 'Teslimat süresi ne kadar?',
        a: 'Stokta bulunan konteynerler için 2-5 iş günü içinde teslimat sağlıyoruz. Özel ölçü, modifiye veya sıfır üretim talepleri için süre proje bazında belirlenir.',
      },
      {
        q: 'İkinci el konteynerler garantili mi?',
        a: 'Tüm ikinci el konteynerlerimiz CSC plakalı, su geçirmez (wind & watertight) ve uluslararası taşımacılığa uygun (cargo worthy) sertifikalıdır.',
      },
      {
        q: 'Türkiye dışına teslimat yapıyor musunuz?',
        a: 'Evet, Türkiye\'den 100+ ülkeye konteyner satışı ve lojistik desteği sağlıyoruz. Küresel depo ağımız sayesinde dünya çapında tedarik mümkündür.',
      },
      {
        q: 'Konteyner kiralama hizmetiniz var mı?',
        a: 'Evet, kısa ve uzun dönem konteyner kiralama hizmeti sunuyoruz. SOC ve COC seçenekleriyle uluslararası dolaşıma uygun konteynerler mevcuttur.',
      },
    ],
  },
  en: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        q: 'Which container types do you sell?',
        a: 'We supply all standard and special shipping container types including 20ft DC, 40ft DC, 40ft HC, 45ft HC, Reefer, Flat Rack and Open Top — as both new and used.',
      },
      {
        q: 'How are container prices determined?',
        a: 'Price depends on container type, condition (new / used), quantity and delivery location. Submit our form for a fast quote — we respond within 24 hours.',
      },
      {
        q: 'What is the delivery time?',
        a: 'In-stock containers are delivered within 2-5 business days. Custom-size, modified or factory-new orders are scheduled per project.',
      },
      {
        q: 'Are used containers guaranteed?',
        a: 'All our used containers are CSC-plated, wind & watertight and certified cargo worthy for international transport.',
      },
      {
        q: 'Do you deliver outside Türkiye?',
        a: 'Yes — we sell containers and provide logistics support to 100+ countries from Türkiye. With our global depot network, worldwide supply is available.',
      },
      {
        q: 'Do you offer container rental?',
        a: 'Yes, we offer both short-term and long-term container rental. SOC and COC options are available for international circulation.',
      },
    ],
  },
};

export default function FAQSection({ locale = 'tr' }: { locale?: Locale }) {
  const data = FAQ_DATA[locale] || FAQ_DATA.tr;

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
    <section className="py-16 md:py-20 bg-gray-50">
      <JsonLd data={schema} />
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 text-center mb-10">
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
              <div className="px-5 pb-5 pt-0 text-gray-700 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
