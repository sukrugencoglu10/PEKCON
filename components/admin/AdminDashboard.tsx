'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StepIndicator from './StepIndicator';
import StockUploader from './StockUploader';
import ContactsFetcher from './ContactsFetcher';
import EmailTemplatePreview from './EmailTemplatePreview';
import SendProgress from './SendProgress';
import type { StockRow, Contact } from '@/lib/send-session';

const STEPS = [
  { id: 1, label: 'Stok Yükle' },
  { id: 2, label: 'Kişileri Çek' },
  { id: 3, label: 'Önizle' },
  { id: 4, label: 'Gönder' },
];

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sessionId, setSessionId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [stock, setStock] = useState<StockRow[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [oauthError, setOauthError] = useState('');

  useEffect(() => {
    const urlSessionId = searchParams.get('sessionId');
    const urlStep = searchParams.get('step');
    const urlError = searchParams.get('error');

    if (urlSessionId) setSessionId(urlSessionId);
    if (urlStep) {
      const step = parseInt(urlStep, 10);
      if (!isNaN(step)) setCurrentStep(step);
    }
    if (urlError) {
      const errorMap: Record<string, string> = {
        oauth_denied: 'Microsoft oturumu reddedildi.',
        oauth_invalid: 'Geçersiz OAuth yanıtı.',
        oauth_state_mismatch: 'Güvenlik hatası. Lütfen tekrar deneyin.',
        oauth_failed: 'Kişiler alınamadı. Lütfen tekrar deneyin.',
      };
      setOauthError(errorMap[urlError] ?? 'Bilinmeyen hata.');
    }
  }, [searchParams]);

  // OAuth callback sonrası step=3 ise kişileri session'dan çek
  useEffect(() => {
    if (currentStep === 3 && sessionId && contacts.length === 0) {
      fetch(`/api/admin/contacts/list?sessionId=${sessionId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.contacts?.length > 0) setContacts(d.contacts);
        })
        .catch(() => null);

      // Stok verisini de çek
      if (stock.length === 0) {
        fetch(`/api/admin/stock?sessionId=${sessionId}`)
          .catch(() => null);
      }
    }
  }, [currentStep, sessionId, contacts.length, stock.length]);

  const handleReset = () => {
    setSessionId('');
    setStock([]);
    setContacts([]);
    setCurrentStep(1);
    setOauthError('');
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#0069b4] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div>
          <span className="font-black text-lg tracking-wider">PEKCON</span>
          <span className="text-blue-200 text-sm ml-2">Admin Paneli</span>
        </div>
        <a
          href="/admin/logout"
          className="text-sm text-blue-200 hover:text-white transition-colors"
        >
          Çıkış Yap
        </a>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Toplu E-posta Gönderimi</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Konteyner stok listesini yükleyin ve tüm Outlook kişilerinize gönderin.
        </p>

        <StepIndicator steps={STEPS} currentStep={currentStep} />

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          {oauthError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {oauthError}
            </div>
          )}

          {currentStep === 1 && (
            <StockUploader
              sessionId={sessionId}
              onComplete={(newSid, rows) => {
                setSessionId(newSid);
                setStock(rows);
                setCurrentStep(2);
              }}
            />
          )}

          {currentStep === 2 && (
            <ContactsFetcher
              sessionId={sessionId}
              preloadedContacts={contacts.length > 0 ? contacts : undefined}
              onComplete={(fetched) => {
                setContacts(fetched);
                setCurrentStep(3);
              }}
            />
          )}

          {currentStep === 3 && (
            <EmailTemplatePreview
              sessionId={sessionId}
              stock={stock}
              contacts={contacts}
              onConfirm={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <SendProgress
              sessionId={sessionId}
              totalContacts={contacts.length}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
