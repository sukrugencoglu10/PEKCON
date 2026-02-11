import Image from 'next/image';
import { getTranslations, type Locale } from '@/lib/i18n';

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-12 text-center lg:text-left">
            {t.about.title}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="prose prose-lg max-w-none">
                {t.about.description.split('\n\n').map((para, i) => (
                  <p key={i} className="text-lg text-dark-700 leading-relaxed mb-6 indent-8">
                    {para}
                  </p>
                ))}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center">
                  <div className="text-3xl font-black text-primary-600 mb-2">500+</div>
                  <div className="text-sm font-bold text-dark-600 uppercase tracking-wider">
                    {locale === 'tr' ? 'Mutlu Müşteri' : 'Happy Customers'}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center">
                  <div className="text-3xl font-black text-primary-600 mb-2">1000+</div>
                  <div className="text-sm font-bold text-dark-600 uppercase tracking-wider">
                    {locale === 'tr' ? 'Tamamlanan Proje' : 'Completed Projects'}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center">
                  <div className="text-3xl font-black text-primary-600 mb-2">15+</div>
                  <div className="text-sm font-bold text-dark-600 uppercase tracking-wider">
                    {locale === 'tr' ? 'Yıllık Deneyim' : 'Years of Experience'}
                  </div>
                </div>
              </div>
            </div>

            {/* Image on the right */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/x2.jpeg"
                alt="PEKCON Container & Logistics"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
