'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Loader2, RotateCcw } from 'lucide-react';

interface ProgressState {
  status: 'idle' | 'sending' | 'done' | 'error';
  totalCount: number;
  sentCount: number;
  failedEmails: string[];
}

interface Props {
  sessionId: string;
  totalContacts: number;
  onReset: () => void;
}

export default function SendProgress({ sessionId, totalContacts, onReset }: Props) {
  const [progress, setProgress] = useState<ProgressState>({
    status: 'idle',
    totalCount: totalContacts,
    sentCount: 0,
    failedEmails: [],
  });
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!started) return;

    const es = new EventSource(`/api/admin/send/progress?sessionId=${sessionId}`);
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as ProgressState;
        setProgress(data);
        if (data.status === 'done' || data.status === 'error') {
          es.close();
        }
      } catch {
        // ignore
      }
    };

    es.onerror = () => { es.close(); };

    return () => { es.close(); };
  }, [started, sessionId]);

  const handleStart = async () => {
    setStarting(true);
    setStartError('');
    try {
      const res = await fetch('/api/admin/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        setStarted(true);
      } else {
        const data = await res.json();
        setStartError(data.error ?? 'Gönderim başlatılamadı.');
      }
    } catch {
      setStartError('Bağlantı hatası.');
    } finally {
      setStarting(false);
    }
  };

  const pct =
    progress.totalCount > 0
      ? Math.round((progress.sentCount / progress.totalCount) * 100)
      : 0;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Adım 4: Gönderim</h2>

      {!started && (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-2">
            <strong>{totalContacts}</strong> alıcıya e-posta gönderilecek.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Gönderimler sırayla yapılır. İşlem alıcı sayısına göre birkaç dakika sürebilir.
          </p>
          {startError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {startError}
            </div>
          )}
          <button
            onClick={handleStart}
            disabled={starting}
            className="px-8 py-3 bg-[#aa1917] text-white font-bold rounded-lg
                       hover:bg-[#8f1412] disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors text-lg"
          >
            {starting ? 'Başlatılıyor...' : 'Gönderimi Başlat'}
          </button>
        </div>
      )}

      {started && (
        <div className="py-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1.5">
              <span>{progress.sentCount} / {progress.totalCount} gönderildi</span>
              <span>{pct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  progress.status === 'done'
                    ? 'bg-green-500'
                    : progress.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-[#0069b4]'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium mt-4">
            {progress.status === 'sending' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0069b4]" />
                <span className="text-[#0069b4]">Gönderim devam ediyor...</span>
              </>
            )}
            {progress.status === 'done' && (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-semibold">
                  Tüm e-postalar başarıyla gönderildi!
                </span>
              </>
            )}
            {progress.status === 'error' && (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">
                  Gönderim tamamlandı — {progress.failedEmails.length} hata oluştu.
                </span>
              </>
            )}
          </div>

          {progress.failedEmails.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-800 mb-2">
                Gönderilemeyen e-postalar ({progress.failedEmails.length}):
              </p>
              <ul className="text-xs text-red-700 space-y-0.5 font-mono">
                {progress.failedEmails.map((email, i) => (
                  <li key={i}>{email}</li>
                ))}
              </ul>
            </div>
          )}

          {(progress.status === 'done' || progress.status === 'error') && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-300
                           text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Yeniden Başlat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
