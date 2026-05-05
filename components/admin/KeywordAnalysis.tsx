'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MousePointerClick, TrendingUp, Search, Award } from 'lucide-react';
import DateRangeSelector from './DateRangeSelector';

function rangeToFromTo(range: string): { from: string; to: string } {
  const now = new Date();
  const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
  const from = new Date(now);
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().slice(0, 10),
    to: new Date(now.getTime() + 86400000).toISOString().slice(0, 10),
  };
}

interface TrafficRow {
  term: string;
  campaign: string;
  source: string;
  visits: number;
  gclid_count: number;
}

interface FunnelRow {
  term: string;
  campaign: string;
  visits: number;
  conversions: number;
  rate: number;
  value: number;
}

interface ChannelRow {
  source: string;
  medium: string;
  visits: number;
  paid_clicks: number;
}

interface KeywordData {
  traffic: TrafficRow[];
  funnel: FunnelRow[];
  channels: ChannelRow[];
}

const currency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
const pct = (n: number) => `%${(n * 100).toFixed(1)}`;

export default function KeywordAnalysis() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<KeywordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { from, to } = rangeToFromTo(range);
      const res = await fetch(
        `/api/admin/analytics/keywords?from=${from}&to=${to}`
      );
      if (!res.ok) throw new Error('API hatası');
      setData(await res.json());
    } catch {
      setError('Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { load(); }, [load]);

  // Derived KPIs
  const totalVisits = data?.traffic.reduce((s, r) => s + r.visits, 0) ?? 0;
  const totalGclid = data?.traffic.reduce((s, r) => s + r.gclid_count, 0) ?? 0;
  const totalConversions = data?.funnel.reduce((s, r) => s + r.conversions, 0) ?? 0;
  const overallRate = totalVisits > 0 ? totalConversions / totalVisits : 0;
  const bestKeyword = data?.funnel
    .filter((r) => r.visits >= 3)
    .sort((a, b) => b.rate - a.rate)[0]?.term ?? '—';

  const kpis = [
    {
      label: 'UTM\'li Ziyaret',
      value: totalVisits,
      fmt: 'number',
      icon: Search,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: 'Takipli oturum',
    },
    {
      label: 'Google Ads Tıklama',
      value: totalGclid,
      fmt: 'number',
      icon: MousePointerClick,
      color: 'text-green-600',
      bg: 'bg-green-50',
      sub: 'gclid doğrulamalı',
    },
    {
      label: 'Dönüşüm Oranı',
      value: overallRate,
      fmt: 'pct',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      sub: `${totalConversions} dönüşüm`,
    },
    {
      label: 'En İyi Keyword',
      value: bestKeyword,
      fmt: 'text',
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      sub: 'En yüksek dönüşüm oranı',
    },
  ] as const;

  // Channel chart data
  const channelData = (data?.channels ?? []).map((r) => ({
    name: `${r.source}/${r.medium}`,
    Ziyaret: r.visits,
  })).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header + date range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Anahtar Kelime Analizi</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Google Ads üzerinden gelen ziyaretçi ve dönüşüm performansı
          </p>
        </div>
        <DateRangeSelector selected={range} onChange={setRange} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`${k.bg} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${k.color}`} />
                </div>
                <span className="text-xs text-gray-500 font-medium">{k.label}</span>
              </div>
              {loading ? (
                <div className="h-8 bg-gray-100 rounded animate-pulse" />
              ) : (
                <>
                  <p className={`text-2xl font-bold ${k.color} truncate`}>
                    {k.fmt === 'pct'
                      ? pct(k.value as number)
                      : k.fmt === 'number'
                      ? (k.value as number).toLocaleString('tr-TR')
                      : k.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Keyword Dönüşüm Hunisi</h3>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
            ziyaret → dönüşüm
          </span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-50 rounded animate-pulse" />
            ))}
          </div>
        ) : !data || data.funnel.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Henüz UTM\'li ziyaret yok</p>
            <p className="text-gray-300 text-xs mt-1">
              Google Ads URL\'lerine utm_term&#61;&#123;keyword&#125; ekleyin
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Anahtar Kelime</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Kampanya</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Ziyaret</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Dönüşüm</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Oran</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Tahmini Değer</th>
                </tr>
              </thead>
              <tbody>
                {data.funnel.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                        {row.term}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 text-xs">{row.campaign}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-gray-900">{row.visits}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-blue-600">{row.conversions}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                        row.rate >= 0.15
                          ? 'bg-green-50 text-green-700'
                          : row.rate >= 0.05
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-50 text-gray-500'
                      }`}>
                        {pct(row.rate)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {currency.format(row.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Channel breakdown chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Kanal Dağılımı</h3>
        {loading ? (
          <div className="h-52 bg-gray-50 rounded animate-pulse" />
        ) : channelData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
            Bu dönemde veri yok
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={channelData} layout="vertical" margin={{ left: 16, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fontSize: 11 }}
                stroke="#9CA3AF"
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
              />
              <Bar dataKey="Ziyaret" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Bu veriler nasıl toplanıyor?</p>
        <p className="text-amber-700 text-xs leading-relaxed">
          Ziyaretçi URL&apos;sinde <code className="bg-amber-100 px-1 rounded">utm_term</code> veya{' '}
          <code className="bg-amber-100 px-1 rounded">gclid</code> parametresi varsa kayıt oluşturulur.
          Google Ads&apos;de tracking template&apos;e{' '}
          <code className="bg-amber-100 px-1 rounded">utm_term=&#123;keyword&#125;</code> eklediğinizde
          anahtar kelime verisi dolmaya başlar.
        </p>
      </div>
    </div>
  );
}
