'use client';

import { useState, useRef } from 'react';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import type { StockRow } from '@/lib/send-session';

interface Props {
  sessionId: string;
  onComplete: (sessionId: string, rows: StockRow[]) => void;
}

export default function StockUploader({ sessionId, onComplete }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<StockRow[] | null>(null);
  const [containerTypes, setContainerTypes] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [localSessionId, setLocalSessionId] = useState(sessionId);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setWarnings([]);
    setPreview(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    if (localSessionId) formData.append('sessionId', localSessionId);

    try {
      const res = await fetch('/api/admin/stock', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Yükleme başarısız.');
        return;
      }

      setLocalSessionId(data.sessionId);
      setPreview(data.rows);
      setContainerTypes(data.containerTypes ?? []);
      setWarnings(data.warnings ?? []);
    } catch {
      setError('Sunucu bağlantı hatası.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Adım 1: Stok Listesi Yükle</h2>
      <p className="text-sm text-gray-500 mb-6">
        Pekcon-Stock Excel dosyasını yükleyin.
        Başlık satırı <strong>Country / Location</strong> sütunlarıyla başlamalıdır.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                   transition-all duration-200 ${
                     isDragging
                       ? 'border-[#0069b4] bg-blue-50'
                       : 'border-gray-300 hover:border-[#0069b4] hover:bg-gray-50'
                   }`}
      >
        <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">
          {isUploading ? 'Yükleniyor...' : 'Dosyayı buraya sürükleyin veya tıklayın'}
        </p>
        <p className="text-xs text-gray-400 mt-1">.xlsx, .xls, .csv — Maks. 5MB</p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          <strong>Uyarılar:</strong> {warnings.join(' | ')}
        </div>
      )}

      {preview && preview.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Yüklenen Stok ({preview.length} lokasyon · {containerTypes.length} konteyner tipi)
          </h3>

          {/* Yatay kaydırmalı önizleme tablosu */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="text-xs whitespace-nowrap">
              <thead className="bg-[#0069b4] text-white">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold sticky left-0 bg-[#0069b4] z-10">Ülke</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Lokasyon</th>
                  {containerTypes.map((t) => (
                    <th key={t} className="px-3 py-2.5 text-center font-semibold">{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className={`px-3 py-2 font-semibold text-gray-700 sticky left-0 z-10 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {row.country}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{row.location}</td>
                    {containerTypes.map((t) => {
                      const val = row.containers[t] ?? 0;
                      return (
                        <td key={t} className="px-3 py-2 text-center">
                          {val > 0
                            ? <span className="font-bold text-[#0069b4]">{val}</span>
                            : <span className="text-gray-300">–</span>
                          }
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => onComplete(localSessionId, preview)}
              className="px-6 py-2.5 bg-[#0069b4] text-white font-semibold rounded-lg
                        hover:bg-[#005a9a] transition-colors"
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
