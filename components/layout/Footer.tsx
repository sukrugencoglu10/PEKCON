import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-dark-900 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Şirket */}
          <div>
            <Image
              src="/images/logo.svg"
              alt="PEKCON Container & Logistics"
              width={150}
              height={50}
              className="mb-4"
            />
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-700 hover:text-primary-500 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-700 hover:text-primary-500 transition-colors"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Hizmetler */}
          <div>
            <h4 className="text-lg font-display font-bold mb-4">Hizmetlerimiz</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tr/hizmetlerimiz" className="text-dark-700 hover:text-primary-500 transition-colors">
                  Denizyolu Taşımacılık
                </Link>
              </li>
              <li>
                <Link href="/tr/hizmetlerimiz" className="text-dark-700 hover:text-primary-500 transition-colors">
                  Karayolu Taşımacılık
                </Link>
              </li>
              <li>
                <Link href="/tr/hizmetlerimiz" className="text-dark-700 hover:text-primary-500 transition-colors">
                  Havayolu Taşımacılık
                </Link>
              </li>
              <li>
                <Link href="/tr/konteynerlar" className="text-dark-700 hover:text-primary-500 transition-colors">
                  Konteyner Satış & Kiralama
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-lg font-display font-bold mb-4">Kurumsal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tr/hakkimizda" className="text-dark-700 hover:text-primary-500 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/tr/iletisim" className="text-dark-700 hover:text-primary-500 transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/tr/teklif-al" className="text-dark-700 hover:text-primary-500 transition-colors">
                  Teklif Al
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-lg font-display font-bold mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-primary-500 mt-1 flex-shrink-0" />
                <a href="tel:+902122979758" className="text-dark-700 hover:text-primary-500 transition-colors">
                  +90 (212) 297 97 58
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-primary-500 mt-1 flex-shrink-0" />
                <a href="mailto:info@pekcon.com.tr" className="text-dark-700 hover:text-primary-500 transition-colors">
                  info@pekcon.com.tr
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-dark-700">
                  Dap vadi, Merkez mh. Seçkin sokak<br />
                  no2-4a iç kapı:172, Z Ofis<br />
                  34406 Kağıthane/İstanbul
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2026 PEKCON Container & Logistics. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
