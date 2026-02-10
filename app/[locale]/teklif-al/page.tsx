import QuoteForm from '@/components/forms/QuoteForm';

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-4">
              Teklif Talep Formu
            </h1>
            <p className="text-lg text-dark-700">
              Aşağıdaki formu doldurarak hızlı bir şekilde teklif alabilirsiniz
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <QuoteForm />
          </div>

          <div className="mt-8 text-center text-sm text-dark-700">
            <p>
              Sorularınız mı var?{' '}
              <a href="tel:+902122979758" className="text-primary-500 hover:underline">
                +90 (212) 297 97 58
              </a>{' '}
              numaralı telefondan bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
