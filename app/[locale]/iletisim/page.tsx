import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-4">
            İletişime Geçin
          </h1>
          <p className="text-lg text-dark-700">
            Sorularınız için bize ulaşın, size yardımcı olmaktan mutluluk duyarız
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Phone */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">Telefon</h3>
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
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">E-posta</h3>
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
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">Adres</h3>
            <p className="text-dark-700">
              Gülbahar Mah. Avni Dilligil Sok.
              <br />
              Köroğlu İş Merkezi No:5 D:6
              <br />
              34394 Şişli/İstanbul
            </p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <p className="text-gray-600">Google Maps entegrasyonu buraya eklenecek</p>
          </div>
        </div>
      </div>
    </div>
  );
}
