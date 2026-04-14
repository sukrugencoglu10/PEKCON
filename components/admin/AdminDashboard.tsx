'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StepIndicator from './StepIndicator';
import StockUploader from './StockUploader';
import ContactsFetcher from './ContactsFetcher';
import EmailTemplatePreview from './EmailTemplatePreview';
import SendProgress from './SendProgress';
import FormHeatmapTab from './FormHeatmapTab';
import AnalyticsDashboard from './AnalyticsDashboard';
import type { StockRow, Contact } from '@/lib/send-session';

const STEPS = [
  { id: 1, label: 'Stok Yükle' },
  { id: 2, label: 'Kişileri Çek' },
  { id: 3, label: 'Önizle' },
  { id: 4, label: 'Gönder' },
];

type AdminTab = 'email' | 'analytics';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('email');
  const [sessionId, setSessionId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [stock, setStock] = useState<StockRow[]>([]);
  const [containerTypes, setContainerTypes] = useState<string[]>([]);
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
    setContainerTypes([]);
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

      <div className={`${activeTab === 'analytics' ? 'max-w-7xl' : 'max-w-4xl'} mx-auto py-8 px-4 transition-all`}>
        {/* Tab navigation */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'email'
                ? 'bg-white border border-b-white border-gray-200 -mb-px text-[#0069b4]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Toplu E-posta
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white border border-b-white border-gray-200 -mb-px text-[#0069b4]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analitik
          </button>
        </div>

        {activeTab === 'email' && (
          <>
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
                  onComplete={(newSid, rows, types) => {
                    setSessionId(newSid);
                    setStock(rows);
                    setContainerTypes(types);
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
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <EmailTemplatePreview
                  sessionId={sessionId}
                  stock={stock}
                  containerTypes={containerTypes}
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
                  onBack={() => setCurrentStep(3)}
                />
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <AnalyticsDashboard />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Form Alan Analizi (Heatmap)</h3>
              <FormHeatmapTab />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
