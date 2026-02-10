import { Ship, Truck, Train, Plane, Route, Package } from 'lucide-react';

const services = [
  {
    icon: Ship,
    title: 'Denizyolu Taşımacılık',
    description: 'Global ağımızla güvenilir denizyolu taşımacılığı hizmetleri',
    features: ['FCL (Full Container Load)', 'LCL (Less than Container Load)', 'Break Bulk'],
  },
  {
    icon: Truck,
    title: 'Karayolu Taşımacılık',
    description: 'Parsiyel ve komple yük çözümleri ile hızlı teslimat',
    features: ['FTL (Full Truck Load)', 'LTL (Less than Truck Load)', 'Kapıdan kapıya'],
  },
  {
    icon: Train,
    title: 'Demiryolu Taşımacılık',
    description: 'Çevre dostu ve ekonomik çözümler',
    features: ['Blok tren taşımacılığı', 'Avrupa-Asya hattı', 'Kombine taşıma'],
  },
  {
    icon: Plane,
    title: 'Hava Kargo',
    description: 'Acil ve zaman hassas yükler için hızlı taşımacılık',
    features: ['Express teslimat', 'Door-to-door', 'Gümrük hizmetleri'],
  },
  {
    icon: Route,
    title: 'İntermodal Taşımacılık',
    description: 'Farklı taşıma modlarının kombinasyonu',
    features: ['Entegre çözümler', 'Maliyet optimizasyonu', 'Esnek rotalar'],
  },
  {
    icon: Package,
    title: 'Proje Kargo',
    description: 'Büyük ölçekli ve özel projelerde uzmanlaşmış hizmet',
    features: ['Ağır yük taşıma', 'Özel ekipman', 'Proje yönetimi'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-4">
            Hizmetlerimiz
          </h1>
          <p className="text-lg text-dark-700 max-w-2xl mx-auto">
            Kapsamlı lojistik çözümlerimizle iş süreçlerinizi optimize ediyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-dark-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-dark-700 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-dark-700">
                      <svg
                        className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
