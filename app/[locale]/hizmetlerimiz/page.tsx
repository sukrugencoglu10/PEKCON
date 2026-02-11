import { Ship, Truck, Train, Plane, Route, Package } from 'lucide-react';
import { getTranslations, type Locale } from '@/lib/i18n';

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const services = [
    {
      icon: Ship,
      title: t.servicesPage.sea.title,
      description: t.servicesPage.sea.desc,
      features: [t.servicesPage.sea.f1, t.servicesPage.sea.f2, t.servicesPage.sea.f3],
    },
    {
      icon: Truck,
      title: t.servicesPage.land.title,
      description: t.servicesPage.land.desc,
      features: [t.servicesPage.land.f1, t.servicesPage.land.f2, t.servicesPage.land.f3],
    },
    {
      icon: Train,
      title: t.servicesPage.rail.title,
      description: t.servicesPage.rail.desc,
      features: [t.servicesPage.rail.f1, t.servicesPage.rail.f2, t.servicesPage.rail.f3],
    },
    {
      icon: Plane,
      title: t.servicesPage.air.title,
      description: t.servicesPage.air.desc,
      features: [t.servicesPage.air.f1, t.servicesPage.air.f2, t.servicesPage.air.f3],
    },
    {
      icon: Route,
      title: t.servicesPage.intermodal.title,
      description: t.servicesPage.intermodal.desc,
      features: [t.servicesPage.intermodal.f1, t.servicesPage.intermodal.f2, t.servicesPage.intermodal.f3],
    },
    {
      icon: Package,
      title: t.servicesPage.project.title,
      description: t.servicesPage.project.desc,
      features: [t.servicesPage.project.f1, t.servicesPage.project.f2, t.servicesPage.project.f3],
    },
  ];

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
