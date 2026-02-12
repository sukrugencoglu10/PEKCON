import { Ship, Truck, Train, Route, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getTranslations, type Locale } from '@/lib/i18n';

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-4">
            {t.servicesPage.title}
          </h1>
          <p className="text-lg text-dark-700 max-w-2xl mx-auto">
            {t.servicesPage.subtitle}
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-12">
          {/* Denizyolu Taşımacılık - Detaylı */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 border-2 border-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Ship className="w-10 h-10 text-primary-500" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-dark-900 mb-3">
                  {t.servicesPage.sea.title}
                </h2>
                <p className="text-dark-700 text-lg mb-4">
                  {t.servicesPage.sea.desc}
                </p>
              </div>
            </div>
            
            <div className="prose max-w-none text-dark-700 mb-6">
              <p className="mb-4">
                {locale === 'tr' 
                  ? 'PEKCON olarak, global denizyolu taşımacılığında uzman ekibimiz ve geniş liman ağımızla hizmet vermekteyiz. FCL (Full Container Load) ve LCL (Less than Container Load) seçenekleriyle her ölçekte kargo ihtiyacınıza çözüm sunuyoruz. Dünya çapındaki güvenilir nakliye hatlarımız sayesinde yükünüz güvenle ve zamanında varış noktasına ulaşır.'
                  : 'As PEKCON, we provide services in global sea freight with our expert team and extensive port network. We offer solutions for cargo needs of all sizes with FCL (Full Container Load) and LCL (Less than Container Load) options. Thanks to our reliable shipping lines worldwide, your cargo reaches its destination safely and on time.'}
              </p>
              <p>
                {locale === 'tr'
                  ? 'Denizyolu taşımacılığında sunduğumuz hizmetler arasında konteyner konsolidasyonu, gümrük işlemleri, sigortalama ve kapıdan kapıya teslimat bulunmaktadır. Deneyimli operasyon ekibimiz, yükünüzün her aşamasını takip ederek size anlık bilgi sağlar.'
                  : 'Our sea freight services include container consolidation, customs clearance, insurance, and door-to-door delivery. Our experienced operations team tracks every stage of your cargo and provides you with real-time information.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[t.servicesPage.sea.f1, t.servicesPage.sea.f2, t.servicesPage.sea.f3].map((feat, i) => (
                <div key={i} className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-dark-700 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Karayolu Taşımacılık - Detaylı */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 border-2 border-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-10 h-10 text-primary-500" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-dark-900 mb-3">
                  {t.servicesPage.land.title}
                </h2>
                <p className="text-dark-700 text-lg mb-4">
                  {t.servicesPage.land.desc}
                </p>
              </div>
            </div>
            
            <div className="prose max-w-none text-dark-700 mb-6">
              <p className="mb-4">
                {locale === 'tr'
                  ? 'Avrupa ve Asya arasında kesintisiz karayolu taşımacılığı hizmeti sunuyoruz. Modern araç filomuz ve deneyimli sürücü kadromuz ile parsiyel ve komple yük taşımacılığında güvenilir çözümler sağlıyoruz. TIR, kamyon ve kamyonet seçenekleriyle her türlü yük ihtiyacınıza uygun hizmet veriyoruz.'
                  : 'We provide seamless road freight services between Europe and Asia. With our modern vehicle fleet and experienced drivers, we offer reliable solutions in partial and full truckload transportation. We serve all your cargo needs with TIR, truck, and van options.'}
              </p>
              <p>
                {locale === 'tr'
                  ? 'Karayolu taşımacılığında hızlı teslimat, esnek rotalama ve kapıdan kapıya hizmet avantajlarından yararlanın. ADR belgeli araçlarımızla tehlikeli madde taşımacılığı ve soğuk zincir taşımacılığı için de hizmet vermekteyiz.'
                  : 'Benefit from fast delivery, flexible routing, and door-to-door service in road transportation. We also provide services for dangerous goods transportation with ADR-certified vehicles and cold chain transportation.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[t.servicesPage.land.f1, t.servicesPage.land.f2, t.servicesPage.land.f3].map((feat, i) => (
                <div key={i} className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-dark-700 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diğer Hizmetler - Kart Formatında */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Demiryolu */}
            <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col border border-gray-100 transition-all hover:shadow-xl group">
              <div className="w-16 h-16 border-2 border-primary-500 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-primary-50">
                <Train className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-display font-bold text-dark-900 mb-3">
                {t.servicesPage.rail.title}
              </h3>
              <p className="text-dark-700 mb-4">{t.servicesPage.rail.desc}</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {[t.servicesPage.rail.f1, t.servicesPage.rail.f2, t.servicesPage.rail.f3].map((feat, i) => (
                  <li key={i} className="flex items-start text-sm text-dark-700">
                    <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/iletisim`}>
                <Button variant="primary" className="w-full">
                  {locale === 'tr' ? 'Detaylı Bilgi' : 'Contact for Details'}
                </Button>
              </Link>
            </div>

            {/* Intermodal */}
            <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col border border-gray-100 transition-all hover:shadow-xl group">
              <div className="w-16 h-16 border-2 border-primary-500 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-primary-50">
                <Route className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-display font-bold text-dark-900 mb-3">
                {t.servicesPage.intermodal.title}
              </h3>
              <p className="text-dark-700 mb-4">{t.servicesPage.intermodal.desc}</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {[t.servicesPage.intermodal.f1, t.servicesPage.intermodal.f2, t.servicesPage.intermodal.f3].map((feat, i) => (
                  <li key={i} className="flex items-start text-sm text-dark-700">
                    <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/iletisim`}>
                <Button variant="primary" className="w-full">
                  {locale === 'tr' ? 'Detaylı Bilgi' : 'Contact for Details'}
                </Button>
              </Link>
            </div>

            {/* Gümrük İşleri */}
            <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col border border-gray-100 transition-all hover:shadow-xl group">
              <div className="w-16 h-16 border-2 border-primary-500 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-primary-50">
                <ClipboardCheck className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-display font-bold text-dark-900 mb-3">
                {t.servicesPage.project.title}
              </h3>
              <p className="text-dark-700 mb-4">{t.servicesPage.project.desc}</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {[t.servicesPage.project.f1, t.servicesPage.project.f2, t.servicesPage.project.f3].map((feat, i) => (
                  <li key={i} className="flex items-start text-sm text-dark-700">
                    <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/iletisim`}>
                <Button variant="primary" className="w-full">
                  {locale === 'tr' ? 'Detaylı Bilgi' : 'Contact for Details'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
