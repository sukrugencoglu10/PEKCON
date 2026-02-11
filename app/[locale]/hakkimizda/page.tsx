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
          
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* Text Content */}
            <div className="flex-1">
              <div className="prose prose-lg max-w-none">
                {t.about.description.split('\n\n').map((para, i) => (
                  <p key={i} className="text-lg text-dark-700 leading-relaxed mb-6">
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

            {/* Image Content */}
            <div className="flex-1 w-full lg:sticky lg:top-32">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <Image
                  src="/hakkimizda.jpg" // Lütfen dosyanızın public klasöründe hakkimizda.jpg adıyla olduğundan emin olun
                  alt={t.about.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
