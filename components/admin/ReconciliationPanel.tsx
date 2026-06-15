'use client';

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface MissingInSheet {
  created_at: string;
  phone: string | null;
  email: string | null;
  estimated_value: number | null;
}
interface MissingInDb {
  tarih: string | null;
  phone: string | null;
  email: string | null;
}

interface ReconcileResult {
  configured: boolean;
  message?: string;
  error?: string;
  detail?: string;
  range?: { from: string; to: string };
  db_count?: number;
  sheet_count?: number;
  matched?: number;
  missing_in_sheet_count?: number;
  missing_in_db_count?: number;
  missing_in_sheet?: MissingInSheet[];
  missing_in_db?: MissingInDb[];
}

interface ReconciliationPanelProps {
  from: string;
  to: string;
  /** Eşleşen (Sheet'te doğrulanmış) form sayısını üst bileşene bildirir → huniye yansır */
  onVerified?: (matched: number | null) => void;
}

const fmt = (n: number | undefined) => (n ?? 0).toLocaleString('tr-TR');

export default function ReconciliationPanel({ from, to, onVerified }: ReconciliationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReconcileResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runReconcile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics/reconcile?from=${from}&to=${to}`);
      if (res.status === 401) {
        window.location.href = '/admin';
        return;
      }
      const json: ReconcileResult = await res.json();
      setResult(json);
      onVerified?.(json.configured && typeof json.matched === 'number' ? json.matched : null);
      if (json.error) setError(json.error);
    } catch {
      setError('Doğrulama isteği başarısız oldu.');
      onVerified?.(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Apps Script Doğrulama (Sheet ↔ DB)
        </h3>
        <button
          onClick={runReconcile}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#0069b4] rounded-lg hover:bg-[#005596] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Doğrulanıyor…' : 'Doğrula'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Formdan Apps Script’e giden lead’ler gerçekten Google Sheet’e düştü mü? DB ile karşılaştırır.
      </p>

      {/* Kurulum eksik */}
      {result && result.configured === false && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">Kurulum gerekli</p>
          <p>{result.message}</p>
        </div>
      )}

      {/* Hata */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-4">
          <p className="font-medium">{error}</p>
          {result?.detail && <p className="mt-1 text-xs text-red-500 break-all">{result.detail}</p>}
        </div>
      )}

      {/* Sonuç */}
      {result && result.configured !== false && typeof result.matched === 'number' && (
        <>
          <p className="text-xs text-gray-400 mb-3">
            Aralık: {result.range?.from} → {result.range?.to} · DB: {fmt(result.db_count)} form ·
            Sheet: {fmt(result.sheet_count)} satır
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-emerald-50 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Eşleşen
              </div>
              <p className="text-xl font-bold text-emerald-700">{fmt(result.matched)}</p>
            </div>
            <div className="rounded-lg bg-red-50 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Sheet’te eksik
              </div>
              <p className="text-xl font-bold text-red-600">{fmt(result.missing_in_sheet_count)}</p>
              <p className="text-[10px] text-gray-400">webhook düşmüş olabilir</p>
            </div>
            <div className="rounded-lg bg-amber-50 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> DB’de eksik
              </div>
              <p className="text-xl font-bold text-amber-600">{fmt(result.missing_in_db_count)}</p>
              <p className="text-[10px] text-gray-400">DB kaydı düşmüş olabilir</p>
            </div>
          </div>

          {/* Eksik listeleri */}
          {result.missing_in_sheet && result.missing_in_sheet.length > 0 && (
            <details className="mb-2">
              <summary className="cursor-pointer text-xs font-medium text-red-600">
                Sheet’te eksik kayıtlar ({result.missing_in_sheet.length})
              </summary>
              <div className="mt-2 max-h-48 overflow-y-auto text-xs">
                {result.missing_in_sheet.map((r, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-500">{r.created_at}</span>
                    <span className="text-gray-700">{r.phone ?? r.email ?? '—'}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {result.missing_in_db && result.missing_in_db.length > 0 && (
            <details>
              <summary className="cursor-pointer text-xs font-medium text-amber-600">
                DB’de eksik kayıtlar ({result.missing_in_db.length})
              </summary>
              <div className="mt-2 max-h-48 overflow-y-auto text-xs">
                {result.missing_in_db.map((r, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-500">{r.tarih ?? '—'}</span>
                    <span className="text-gray-700">{r.phone ?? r.email ?? '—'}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {result.missing_in_sheet_count === 0 && result.missing_in_db_count === 0 && (
            <p className="text-sm text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Tüm kayıtlar eşleşiyor — veri tutarlı.
            </p>
          )}
        </>
      )}

      {!result && !error && (
        <p className="text-gray-400 text-sm text-center py-6">
          Karşılaştırmayı başlatmak için “Doğrula”ya basın.
        </p>
      )}
    </div>
  );
}
