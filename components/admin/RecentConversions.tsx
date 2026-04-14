'use client';

import { FileText, MessageCircle } from 'lucide-react';

interface ConversionRow {
  id: number;
  type: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  company_name: string | null;
  container_type: string | null;
  estimated_value: number | null;
  utm_source: string | null;
  utm_medium: string | null;
  gclid: string | null;
  created_at: string;
  locale: string | null;
}

interface RecentConversionsProps {
  data: ConversionRow[];
  loading?: boolean;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr + 'Z'); // UTC
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'az once';
  if (diff < 3600) return `${Math.floor(diff / 60)} dk once`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat once`;
  return `${Math.floor(diff / 86400)} gun once`;
}

export default function RecentConversions({ data, loading }: RecentConversionsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-gray-50 rounded animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Son Donusumler</h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Henuz donusum yok</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {data.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
            >
              {/* Type icon */}
              <div
                className={`p-2 rounded-lg ${
                  row.type === 'form_submit' ? 'bg-blue-50' : 'bg-green-50'
                }`}
              >
                {row.type === 'form_submit' ? (
                  <FileText className="w-4 h-4 text-blue-600" />
                ) : (
                  <MessageCircle className="w-4 h-4 text-green-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {row.contact_name || (row.type === 'form_submit' ? 'Anonim Lead' : 'WhatsApp Tiklama')}
                  </span>
                  {row.gclid && (
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                      Ads
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {row.utm_source && (
                    <span className="text-xs text-gray-400">
                      {row.utm_source}/{row.utm_medium || '(none)'}
                    </span>
                  )}
                  {row.container_type && (
                    <span className="text-xs text-gray-500">{row.container_type}</span>
                  )}
                </div>
              </div>

              {/* Value & Time */}
              <div className="text-right flex-shrink-0">
                {row.estimated_value ? (
                  <p className="text-sm font-semibold text-gray-900">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(row.estimated_value)}
                  </p>
                ) : null}
                <p className="text-xs text-gray-400">{timeAgo(row.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
