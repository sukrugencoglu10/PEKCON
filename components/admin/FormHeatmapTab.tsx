'use client';

import { useEffect, useState } from 'react';

interface FieldStats {
  field_name: string;
  step: number;
  avg_dwell_ms: number;
  median_dwell_ms: number;
  total_interactions: number;
  correction_rate: number;
}

// Field display labels (matches QuoteForm field names)
const FIELD_LABELS: Record<string, string> = {
  transactionType: 'İşlem Türü (Satın Al / Kirala)',
  containerCategory: 'Konteyner Kategorisi',
  containerType: 'Konteyner Tipi',
  quantity: 'Miktar',
  region: 'Bölge',
  fullName: 'Ad Soyad',
  companyName: 'Şirket',
  phone: 'Telefon',
  email: 'E-posta',
  notes: 'Notlar',
};

const STEP_LABELS: Record<number, string> = {
  1: 'Adım 1 — Ürün Seçimi',
  2: 'Adım 2 — İletişim Bilgileri',
};

function dwellColor(ms: number): { bg: string; text: string; label: string } {
  if (ms < 3000)  return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Hızlı' };
  if (ms < 8000)  return { bg: 'bg-yellow-100',  text: 'text-yellow-800',  label: 'Orta' };
  if (ms < 15000) return { bg: 'bg-orange-100',  text: 'text-orange-800',  label: 'Yavaş' };
  return           { bg: 'bg-red-100',    text: 'text-red-800',    label: 'Sorunlu' };
}

function correctionColor(rate: number): { text: string } {
  if (rate < 0.1) return { text: 'text-emerald-600' };
  if (rate < 0.3) return { text: 'text-yellow-600' };
  return           { text: 'text-red-600' };
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function FormHeatmapTab() {
  const [stats, setStats] = useState<FieldStats[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? []);
        setTotalSessions(d.total_sessions ?? 0);
      })
      .catch(() => setError('Analitik verisi alınamadı.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
        Yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600 text-sm">{error}</div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 text-sm mb-2">Henüz form etkileşim verisi yok.</p>
        <p className="text-gray-400 text-xs">
          Kullanıcılar teklif formunu doldurmaya başladığında alan analizleri burada görünecek.
        </p>
      </div>
    );
  }

  // Group by step
  const byStep = stats.reduce<Record<number, FieldStats[]>>((acc, s) => {
    const step = s.step || 1;
    if (!acc[step]) acc[step] = [];
    acc[step].push(s);
    return acc;
  }, {});

  // Sort steps
  const stepNumbers = Object.keys(byStep).map(Number).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Form Alan Isı Haritası</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalSessions} etkileşim kaydı · Renk: bekleme süresine göre
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" /> &lt;3s hızlı</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> 3–8s orta</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> 8–15s yavaş</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> &gt;15s sorunlu</span>
        </div>
      </div>

      {/* Per-step field cards */}
      {stepNumbers.map((step) => (
        <div key={step}>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            {STEP_LABELS[step] ?? `Adım ${step}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {byStep[step].map((s) => {
              const dc = dwellColor(s.avg_dwell_ms);
              const cc = correctionColor(s.correction_rate);
              return (
                <div
                  key={s.field_name}
                  className={`rounded-xl border p-4 ${dc.bg} border-transparent`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-sm font-semibold ${dc.text}`}>
                      {FIELD_LABELS[s.field_name] ?? s.field_name}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 ${dc.text}`}>
                      {dc.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 text-xs mt-3">
                    <span className="text-gray-500">Ort. bekleme</span>
                    <span className={`font-mono font-semibold text-right ${dc.text}`}>
                      {formatMs(s.avg_dwell_ms)}
                    </span>

                    <span className="text-gray-500">Medyan</span>
                    <span className="font-mono text-right text-gray-700">
                      {formatMs(s.median_dwell_ms)}
                    </span>

                    <span className="text-gray-500">Etkileşim</span>
                    <span className="font-mono text-right text-gray-700">
                      {s.total_interactions}
                    </span>

                    <span className="text-gray-500">Düzeltme oranı</span>
                    <span className={`font-mono text-right font-semibold ${cc.text}`}>
                      {(s.correction_rate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-400 pt-2">
        * Veriler sunucu yeniden başlatılana kadar bellekte tutulur. Kalıcı analitik için GA4 &gt; Olaylar &gt; form_field_dwell filtresini kullanın.
      </p>
    </div>
  );
}
