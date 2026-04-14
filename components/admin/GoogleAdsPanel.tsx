'use client';

import { ExternalLink } from 'lucide-react';

interface GoogleAdsRow {
  campaign: string;
  term: string;
  count: number;
  value: number;
}

interface GoogleAdsPanelProps {
  data: GoogleAdsRow[];
  loading?: boolean;
}

export default function GoogleAdsPanel({ data, loading }: GoogleAdsPanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-50 rounded animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Google Ads Donusumleri</h3>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
          gclid
        </span>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8">
          <ExternalLink className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            Google Ads uzerinden donusum henuz yok
          </p>
          <p className="text-gray-300 text-xs mt-1">
            gclid parametresi ile gelen ziyaretciler burada gorunur
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Kampanya</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Anahtar Kelime</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Donusum</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Deger (TRY)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-900">{row.campaign}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                      {row.term}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{row.count}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
