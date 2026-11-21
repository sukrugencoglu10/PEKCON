'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Mail,
  Images,
  LogOut,
  ExternalLink,
  RotateCcw,
  Menu,
  X,
  AlertCircle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import StepIndicator from './StepIndicator';
import StockUploader from './StockUploader';
import ContactsFetcher from './ContactsFetcher';
import EmailTemplatePreview from './EmailTemplatePreview';
import SendProgress from './SendProgress';
import ContainerImagesManager from './ContainerImagesManager';
import type { StockRow, Contact } from '@/lib/send-session';

const STEPS = [
  { id: 1, label: 'Stok Yükle' },
  { id: 2, label: 'Kişileri Çek' },
  { id: 3, label: 'Önizle' },
  { id: 4, label: 'Gönder' },
];

type AdminSection = 'email' | 'images';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<AdminSection>('email');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

      if (stock.length === 0) {
        fetch(`/api/admin/stock?sessionId=${sessionId}`).catch(() => null);
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
    setSidebarOpen(false);
    router.push('/admin/dashboard');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A1628] text-slate-200 select-none">
      {/* Marka */}
      <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0069b4] to-[#004a82] flex items-center justify-center shadow-lg shadow-[#0069b4]/30 ring-1 ring-white/15">
            <Layers size={20} className="text-white" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-wider text-white leading-none">
              PEKCON
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-sky-300/80 mt-1">
              Admin Paneli
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Menüyü kapat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menü */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2.5">
            Menü
          </p>
          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveSection('email');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeSection === 'email'
                  ? 'bg-[#0069b4] text-white shadow-md shadow-[#0069b4]/25 ring-1 ring-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail size={18} className="shrink-0" />
              <span className="tracking-tight">Toplu E-posta</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSection('images');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeSection === 'images'
                  ? 'bg-[#0069b4] text-white shadow-md shadow-[#0069b4]/25 ring-1 ring-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Images size={18} className="shrink-0" />
              <span className="tracking-tight">Konteyner Görselleri</span>
            </button>
          </nav>
        </div>

        {/* Oturum özeti */}
        {(stock.length > 0 || contacts.length > 0 || currentStep > 1) && (
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Aktif Gönderim
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Adım</span>
                <span className="font-semibold text-white">
                  {currentStep} / {STEPS.length}
                </span>
              </div>
              {stock.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Stok Satırı</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                    <CheckCircle2 size={13} /> {stock.length}
                  </span>
                </div>
              )}
              {contacts.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Alıcı Kişi</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-sky-300">
                    <CheckCircle2 size={13} /> {contacts.length}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full mt-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 transition-colors"
            >
              <RotateCcw size={13} />
              Yeni Gönderim Başlat
            </button>
          </div>
        )}
      </div>

      {/* Alt bağlantılar */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <a
          href="/tr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={17} className="shrink-0 text-slate-400" />
          <span>Siteyi Görüntüle</span>
        </a>
        <a
          href="/admin/logout"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={17} className="shrink-0" />
          <span>Çıkış Yap</span>
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Masaüstü Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen shadow-xl z-20">
        {sidebarContent}
      </aside>

      {/* Mobil Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] h-full shadow-2xl z-50">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Ana İçerik */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobil Üst Bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#0A1628] text-white px-4 py-3.5 flex items-center justify-between shadow-md">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menüyü aç"
          >
            <Menu size={22} />
          </button>
          <span className="font-extrabold tracking-wider text-base">
            PEKCON <span className="text-sky-300 font-medium text-xs ml-1">Admin</span>
          </span>
          <a
            href="/admin/logout"
            className="p-2 -mr-1 rounded-lg text-rose-300 hover:bg-white/10 transition-colors"
            aria-label="Çıkış Yap"
          >
            <LogOut size={19} />
          </a>
        </header>

        <main
          className={`flex-1 w-full mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12 ${
            activeSection === 'images' ? 'max-w-5xl' : 'max-w-4xl'
          }`}
        >
          {activeSection === 'email' ? (
            <>
              {/* Sayfa Başlığı */}
              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#0069b4] bg-[#0069b4]/10 px-3 py-1 rounded-full mb-3">
                  <Mail size={13} />
                  Toplu E-posta
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Toplu E-posta Gönderimi
                </h1>
                <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
                  Konteyner stok listesini yükleyin, Outlook kişilerinizi seçin ve şablonu tek tıkla gönderin.
                </p>
              </div>

              {/* Adım Göstergesi */}
              <div className="mb-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm px-6 py-5">
                <StepIndicator steps={STEPS} currentStep={currentStep} />
              </div>

              {/* İçerik Kartı */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 lg:p-10">
                {oauthError && (
                  <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{oauthError}</span>
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
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#0069b4] bg-[#0069b4]/10 px-3 py-1 rounded-full mb-3">
                  <Images size={13} />
                  Satılık Konteyner
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Konteyner Görselleri
                </h1>
                <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
                  Satılık konteyner kutularında görünecek fotoğrafları yönetin.
                </p>
              </div>
              <ContainerImagesManager />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
