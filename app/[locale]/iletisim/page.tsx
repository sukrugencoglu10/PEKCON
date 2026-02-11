import { Mail, Phone, MapPin } from 'lucide-react';
import { getTranslations, type Locale } from '@/lib/i18n';

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-4">
            {t.contactPage.title}
          </h1>
          <p className="text-lg text-dark-700">
            {t.contactPage.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Phone */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">{t.contactPage.phone}</h3>
            <a
              href="tel:+902122979758"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              +90 (212) 297 97 58
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">{t.contactPage.email}</h3>
            <a
              href="mailto:info@pekcon.com.tr"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              info@pekcon.com.tr
            </a>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">{t.contactPage.address}</h3>
            <p className="text-dark-700">
              {t.contactPage.addressLine}
            </p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <p className="text-gray-600">
              {locale === 'tr' ? 'Google Maps entegrasyonu buraya eklenecek' : 'Google Maps integration will be added here'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
