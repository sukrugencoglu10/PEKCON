export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-8">
            Hakkımızda
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-dark-700 mb-6">
              PEKCON Container & Logistics, 25 yılı aşkın tecrübesiyle uluslararası
              taşımacılık ve konteyner tedariği alanında faaliyet gösteren lider bir
              şirkettir.
            </p>

            <h2 className="text-2xl font-display font-bold text-dark-900 mb-4 mt-8">
              Misyonumuz
            </h2>
            <p className="text-dark-700 mb-6">
              Müşterilerimize en kaliteli ve güvenilir lojistik çözümleri sunarak, global
              ticarette güvenilir bir partner olmak.
            </p>

            <h2 className="text-2xl font-display font-bold text-dark-900 mb-4 mt-8">
              Vizyonumuz
            </h2>
            <p className="text-dark-700 mb-6">
              Türkiye'nin ve bölgenin en tercih edilen konteyner ve lojistik hizmet
              sağlayıcısı olmak, sürekli gelişim ve inovasyon ile sektörde öncü olmak.
            </p>

            <h2 className="text-2xl font-display font-bold text-dark-900 mb-4 mt-8">
              Değerlerimiz
            </h2>
            <ul className="space-y-3 text-dark-700">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0"
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
                <span>
                  <strong>Güvenilirlik:</strong> Her zaman sözümüzün arkasında dururuz
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0"
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
                <span>
                  <strong>Kalite:</strong> En yüksek standartlarda hizmet sunuyoruz
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0"
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
                <span>
                  <strong>İnovasyon:</strong> Sürekli gelişim ve yenilikçi çözümler
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0"
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
                <span>
                  <strong>Müşteri Odaklılık:</strong> Müşteri memnuniyeti önceliğimiz
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
