'use client';

import { useState, useEffect, useCallback } from 'react';
import DateRangeSelector from './DateRangeSelector';
import KPICards from './KPICards';
import ConversionChart from './ConversionChart';
import AttributionTable from './AttributionTable';
import GoogleAdsPanel from './GoogleAdsPanel';
import RecentConversions from './RecentConversions';

interface SummaryData {
  kpi: {
    total: number;
    total_leads: number;
    total_whatsapp: number;
    total_value: number;
    total_abandon: number;
  };
  daily: Array<{
    date: string;
    form_count: number;
    whatsapp_count: number;
    abandon_count: number;
    value: number;
  }>;
  attribution: Array<{
    source: string;
    medium: string;
    count: number;
    value: number;
  }>;
  google_ads: Array<{
    campaign: string;
    term: string;
    count: number;
    value: number;
  }>;
  recent: Array<{
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
  }>;
}

function getDateRange(range: string): { from: string; to: string } {
  const now = new Date();
  const to = new Date(now.getTime() + 86400000); // tomorrow
  const from = new Date(now);

  switch (range) {
    case '7d':
      from.setDate(from.getDate() - 7);
      break;
    case '30d':
      from.setDate(from.getDate() - 30);
      break;
    case '90d':
      from.setDate(from.getDate() - 90);
      break;
    default:
      from.setDate(from.getDate() - 7);
  }

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

const emptyData: SummaryData = {
  kpi: { total: 0, total_leads: 0, total_whatsapp: 0, total_value: 0, total_abandon: 0 },
  daily: [],
  attribution: [],
  google_ads: [],
  recent: [],
};

export default function AnalyticsDashboard() {
  const [range, setRange] = useState('7d');
  const [data, setData] = useState<SummaryData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { from, to } = getDateRange(range);

    try {
      const res = await fetch(
        `/api/admin/analytics/summary?from=${from}&to=${to}`
      );

      if (res.status === 401) {
        window.location.href = '/admin';
        return;
      }

      if (!res.ok) {
        throw new Error('Veri alinamadi');
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Donusum Analitigi</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Form gonderimleri ve WhatsApp tiklamalari
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector selected={range} onChange={setRange} />
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Yenile
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <KPICards data={data.kpi} loading={loading} />

      {/* Chart */}
      <ConversionChart data={data.daily} loading={loading} />

      {/* Attribution + Google Ads side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttributionTable data={data.attribution} loading={loading} />
        <GoogleAdsPanel data={data.google_ads} loading={loading} />
      </div>

      {/* Recent Conversions */}
      <RecentConversions data={data.recent} loading={loading} />
    </div>
  );
}
