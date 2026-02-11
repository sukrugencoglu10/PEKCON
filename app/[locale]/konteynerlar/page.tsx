import { Box } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getTranslations, type Locale } from '@/lib/i18n';

export default async function ContainersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const containers = [
    {
      id: '20dc',
      name: t.containersPage.c20dc.name,
      type: '20DC',
      description: t.containersPage.c20dc.desc,
      specs: {
        volume: '33.2 m³',
        maxPayload: '28,180 kg',
        dimensions: '6.06 x 2.44 x 2.59 m',
      },
      features: [t.containersPage.c20dc.f1, t.containersPage.c20dc.f2, t.containersPage.c20dc.f3],
    },
    {
      id: '40hc',
      name: t.containersPage.c40hc.name,
      type: '40HC',
      description: t.containersPage.c40hc.desc,
      specs: {
        volume: '76.3 m³',
        maxPayload: '26,580 kg',
        dimensions: '12.19 x 2.44 x 2.90 m',
      },
      features: [t.containersPage.c40hc.f1, t.containersPage.c40hc.f2, t.containersPage.c40hc.f3],
    },
    {
      id: '40rf',
      name: t.containersPage.c40rf.name,
      type: '40RF',
      description: t.containersPage.c40rf.desc,
      specs: {
        volume: '67.5 m³',
        maxPayload: '29,200 kg',
        dimensions: '12.19 x 2.44 x 2.90 m',
      },
      features: [t.containersPage.c40rf.f1, t.containersPage.c40rf.f2, t.containersPage.c40rf.f3],
    },
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-4">
            {t.containersPage.title}
          </h1>
          <p className="text-lg text-dark-700 max-w-2xl mx-auto">
            {t.containersPage.subtitle}
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {containers.map((container) => (
            <div
              key={container.id}
              id={container.id}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Icon & Title */}
                <div>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4">
                    <Box className="w-10 h-10 text-white" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-3">
                    {container.type}
                  </div>
                  <h2 className="text-2xl font-display font-bold text-dark-900 mb-2">
                    {container.name}
                  </h2>
                  <p className="text-dark-700">{container.description}</p>
                </div>

                {/* Middle: Specs */}
                <div>
                  <h3 className="text-lg font-display font-bold text-dark-900 mb-4">
                    {t.containersPage.techSpecs}
                  </h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-dark-700">{t.containersPage.volume}:</dt>
                      <dd className="text-lg font-semibold text-dark-900">
                        {container.specs.volume}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-dark-700">{t.containersPage.payload}:</dt>
                      <dd className="text-lg font-semibold text-dark-900">
                        {container.specs.maxPayload}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-dark-700">{t.containersPage.dimensions}:</dt>
                      <dd className="text-lg font-semibold text-dark-900">
                        {container.specs.dimensions}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Right: Features & CTA */}
                <div>
                  <h3 className="text-lg font-display font-bold text-dark-900 mb-4">
                    {t.containersPage.features}
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {container.features.map((feature, idx) => (
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
                  <Link href={`/${locale}/teklif-al`}>
                    <Button variant="primary" className="w-full">
                      {t.nav.quote}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
