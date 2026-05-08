'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Package } from 'lucide-react';
import type { ContainerForecast } from '@/lib/forecast';

interface DowPattern {
  dow: number;
  label: string;
  demand: number;
  index: number;
}

interface ContainerTypeSummary {
  container_type: string;
  total_leads: number;
  total_units: number;
  total_value: number;
}

interface DemandData {
  forecasts: ContainerForecast[];
  summary: ContainerTypeSummary[];
  dowPattern: DowPattern[];
}

const CONTAINER_COLORS: Record<string, string> = {
  '20DC': '#3B82F6',
  '40DC': '#22C55E',
  '40HC': '#F59E0B',
  '40RF': '#8B5CF6',
  '20RF': '#EC4899',
  '20OT': '#06B6D4',
  '40OT': '#F97316',
  '20FR': '#84CC16',
  '40FR': '#EF4444',
  Belirtilmemiş: '#9CA3AF',
};

function getColor(type: string): string {
  return CONTAINER_COLORS[type] ?? '#6B7280';
}

function rangeToFromTo(range: string): { from: string; to: string } {
  const now = new Date();
  const days = range === '365d' ? 365 : range === '180d' ? 180 : 90;
  const from = new Date(now);
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().slice(0, 10),
    to: new Date(now.getTime() + 86400000).toISOString().slice(0, 10),
  };
}

const currency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
const todayStr = new Date().toISOString().slice(0, 10);

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });
}

export default function DemandForecastPanel() {
  const [range, setRange] = useState('90d');
  const [horizon, setHorizon] = useState('30');
  const [data, setData] = useState<DemandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { from, to } = rangeToFromTo(range);
    try {
      const res = await fetch(`/api/admin/analytics/demand?from=${from}&to=${to}&horizon=${horizon}`);
      if (!res.ok) throw new Error('Sunucu hatası');
      const json: DemandData = await res.json();
      setData(json);
      if (!selectedType && json.forecasts.length > 0) {
        setSelectedType(json.forecasts[0].container_type);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Veri alınamadı');
    } finally {
      setLoading(false);
    }
  }, [range, horizon]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selected = data?.forecasts.find((f) => f.container_type === selectedType);

  return (
    <div className="space-y-6">
      {/* Başlık + Kontroller */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Talep Tahmini</h2>
          <p className="text-sm text-gray-500 mt-0.5">Konteyner tipine göre talep trendi ve ileriye dönük tahmin</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Tarih aralığı */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[['90d', '90 Gün'], ['180d', '180 Gün'], ['365d', '1 Yıl']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  range === key ? 'bg-white text-[#0069b4] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Tahmin ufku */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[['30', '30G Tahmin'], ['60', '60G Tahmin'], ['90', '90G Tahmin']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setHorizon(key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  horizon === key ? 'bg-white text-[#0069b4] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Konteyner Tip Kartları */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse h-32" />
          ))}
        </div>
      ) : data && data.forecasts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.forecasts.map((fc) => (
            <button
              key={fc.container_type}
              onClick={() => setSelectedType(fc.container_type)}
              className={`bg-white rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                selectedType === fc.container_type ? 'border-[#0069b4] shadow-md' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: getColor(fc.container_type) }}
                >
                  {fc.container_type}
                </span>
                {fc.trend === 'yukseliyor' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : fc.trend === 'dusuyor' ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Minus className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div
                className={`text-sm font-semibold mb-1 ${
                  fc.trend === 'yukseliyor' ? 'text-green-600' : fc.trend === 'dusuyor' ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {fc.trend_percent > 0 ? '+' : ''}{fc.trend_percent}%
              </div>
              <div className="text-xs text-gray-500">Ort. {fc.avg_demand_30d.toFixed(1)} lead/gün</div>
              <div className="mt-2 text-xs text-gray-400">
                <div>+{horizon}g: <span className="font-medium text-gray-700">{
                  horizon === '30' ? fc.predicted_30d : horizon === '60' ? fc.predicted_60d : fc.predicted_90d
                } lead</span></div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Henüz form_submit verisi yok. Tahmin için en az 3 veri noktası gereklidir.</p>
          </div>
        )
      )}

      {/* Tahmin Grafiği */}
      {selected && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Talep Tahmini — {selected.container_type}
            </h3>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white"
            >
              {data!.forecasts.map((fc) => (
                <option key={fc.container_type} value={fc.container_type}>{fc.container_type}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={selected.points} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{ value: 'Lead', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
              />
              <Tooltip
                labelFormatter={(d) => new Date(String(d) + 'T00:00:00Z').toLocaleDateString('tr-TR', { dateStyle: 'medium', timeZone: 'UTC' })}
                formatter={(value, name) => {
                  const labels: Record<string, string> = { actual: 'Gerçek', predicted: 'Tahmin', upper: 'Üst Sınır', lower: 'Alt Sınır' };
                  return [value, labels[String(name)] ?? String(name)];
                }}
              />
              <Legend
                formatter={(v) => (({ actual: 'Gerçek', predicted: 'Tahmin', upper: 'Güven Bandı Üst', lower: 'Güven Bandı Alt' } as Record<string, string>)[String(v)] ?? String(v))}
              />
              <ReferenceLine
                x={todayStr}
                stroke="#9CA3AF"
                strokeDasharray="4 4"
                label={{ value: 'Bugün', fill: '#6B7280', fontSize: 11 }}
              />
              <Area
                dataKey="upper"
                fill={getColor(selectedType)}
                stroke="none"
                opacity={0.12}
                legendType="none"
              />
              <Area
                dataKey="lower"
                fill="white"
                stroke="none"
                opacity={1}
                legendType="none"
              />
              <Line
                dataKey="actual"
                stroke={getColor(selectedType)}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                dataKey="predicted"
                stroke={getColor(selectedType)}
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alt satır: DOW Grafiği + Tahmin Özeti */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Haftanın Günü Deseni */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Haftanın Günü Talep Deseni</h3>
          {loading ? (
            <div className="h-48 bg-gray-50 animate-pulse rounded-lg" />
          ) : data && data.dowPattern.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.dowPattern} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="" label={{ value: 'Talep', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                <ReferenceLine y={data.dowPattern.reduce((s, d) => s + d.demand, 0) / 7} stroke="#9CA3AF" strokeDasharray="3 3" />
                <Tooltip formatter={(v) => [v, 'Toplam Talep']} />
                <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
                  {data.dowPattern.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.index > 1.1 ? '#22C55E' : entry.index < 0.9 ? '#EF4444' : '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Veri yok</p>
          )}
        </div>

        {/* Konteyner Özet Tablosu */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Konteyner Tipi Özeti</h3>
          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-50 animate-pulse rounded" />)}
            </div>
          ) : data && data.summary.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Tip</th>
                    <th className="text-right pb-2 font-medium">Lead</th>
                    <th className="text-right pb-2 font-medium">Adet</th>
                    <th className="text-right pb-2 font-medium">Tahmini Değer</th>
                  </tr>
                </thead>
                <tbody>
                  {data.summary.map((s) => (
                    <tr key={s.container_type} className="border-b border-gray-50 last:border-0">
                      <td className="py-2">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: getColor(s.container_type) }}
                        >
                          {s.container_type}
                        </span>
                      </td>
                      <td className="py-2 text-right font-medium text-gray-900">{s.total_leads}</td>
                      <td className="py-2 text-right text-gray-600">{s.total_units}</td>
                      <td className="py-2 text-right text-gray-600">{currency.format(s.total_value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Seçili dönemde veri yok</p>
          )}
        </div>
      </div>
    </div>
  );
}
