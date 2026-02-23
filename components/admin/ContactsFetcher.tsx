'use client';

import { useState, useRef } from 'react';
import { Users, FileDown, CheckCircle, AlertCircle } from 'lucide-react';
import type { Contact } from '@/lib/send-session';

interface Props {
  sessionId: string;
  preloadedContacts?: Contact[];
  onComplete: (contacts: Contact[]) => void;
}

export default function ContactsFetcher({ sessionId, preloadedContacts, onComplete }: Props) {
  const [contacts, setContacts] = useState<Contact[]>(preloadedContacts ?? []);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [localSessionId, setLocalSessionId] = useState(sessionId);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setWarnings([]);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    if (localSessionId) formData.append('sessionId', localSessionId);

    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Yükleme başarısız.');
        return;
      }

      setLocalSessionId(data.sessionId);
      setContacts(data.contacts);
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

  // Kişiler yüklendi → önizleme + devam et
  if (contacts.length > 0) {
    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Adım 2: Kişi Listesi</h2>

        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl mb-5">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-green-800 font-medium">
            {contacts.length} kişi başarıyla yüklendi
          </span>
        </div>

        {warnings.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            <strong>Uyarılar:</strong> {warnings.join(' | ')}
          </div>
        )}

        {/* Kişi listesi önizleme */}
        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-2.5 text-left text-gray-600 font-medium">Ad Soyad</th>
                <th className="px-4 py-2.5 text-left text-gray-600 font-medium">E-posta</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-gray-800">{c.displayName}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs font-mono">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setContacts([]);
              setError('');
            }}
            className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2"
          >
            Farklı bir CSV yükle
          </button>
          <button
            onClick={() => onComplete(contacts)}
            className="px-6 py-2.5 bg-[#0069b4] text-white font-semibold rounded-lg
                       hover:bg-[#005a9a] transition-colors"
          >
            Devam Et →
          </button>
        </div>
      </div>
    );
  }

  // CSV yükleme ekranı
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Adım 2: Kişi Listesi Yükle</h2>
      <p className="text-sm text-gray-500 mb-5">
        Outlook'tan dışa aktardığınız kişi listesini CSV olarak yükleyin.
      </p>

      {/* Outlook export talimatı */}
      <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <FileDown className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">Outlook'tan CSV nasıl alınır?</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Masaüstü:</strong> Dosya → Aç ve Dışa Aktar → İçeri/Dışarı Aktar → Dosyaya dışarı aktar → CSV → Kişiler
              <br />
              <strong>Web (outlook.com):</strong> Kişiler → Yönet → Kişileri dışa aktar → CSV
            </p>
          </div>
        </div>
      </div>

      {/* Drag & Drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                   transition-all duration-200 ${
                     isDragging
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                   }`}
      >
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">
          {isUploading ? 'Yükleniyor...' : 'Outlook CSV dosyasını sürükleyin veya tıklayın'}
        </p>
        <p className="text-xs text-gray-400 mt-1">.csv — Maks. 10MB</p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200
                       rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
