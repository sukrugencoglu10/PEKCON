'use client';

import { ChevronLeft, Mail } from 'lucide-react';
import type { StockRow, Contact } from '@/lib/send-session';

interface Props {
  sessionId: string;
  stock: StockRow[];
  containerTypes: string[];
  contacts: Contact[];
  onConfirm: () => void;
  onBack: () => void;
}

export default function EmailTemplatePreview({
  sessionId,
  stock,
  containerTypes,
  contacts,
  onConfirm,
  onBack,
}: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Adım 3: E-posta Önizlemesi</h2>
      <p className="text-sm text-gray-500 mb-4">
        Gönderilecek e-posta şablonunu aşağıda inceleyebilirsiniz.
      </p>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full text-sm text-blue-700 font-medium">
          <Mail className="w-4 h-4" />
          {contacts.length} alıcı
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full text-sm text-green-700 font-medium">
          {stock.length} lokasyon · {containerTypes.length} konteyner tipi
        </div>
      </div>

      <div
        className="border border-gray-200 rounded-xl overflow-hidden mb-6"
        style={{ height: 480 }}
      >
        <iframe
          src={`/api/admin/preview?sessionId=${sessionId}`}
          className="w-full h-full"
          title="E-posta Önizlemesi"
          sandbox="allow-same-origin"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300
                     text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Geri
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2.5 bg-[#aa1917] text-white font-semibold rounded-lg
                     hover:bg-[#8f1412] transition-colors"
        >
          Gönderimi Başlat →
        </button>
      </div>
    </div>
  );
}
