'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DailyData {
  date: string;
  form_count: number;
  whatsapp_count: number;
  abandon_count: number;
  value: number;
}

interface ConversionChartProps {
  data: DailyData[];
  loading?: boolean;
}

export default function ConversionChart({ data, loading }: ConversionChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-64 bg-gray-50 rounded animate-pulse" />
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Gunluk Donusumler</h3>
      {formatted.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Bu donemde veri yok
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="formGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="waGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="abandonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
              formatter={(value, name) => [
                value,
                name === 'form_count' ? 'Form' : name === 'whatsapp_count' ? 'WhatsApp' : 'Terk',
              ]}
            />
            <Legend
              formatter={(value: string) =>
                value === 'form_count' ? 'Form Lead' : value === 'whatsapp_count' ? 'WhatsApp' : 'Terk'
              }
            />
            <Area
              type="monotone"
              dataKey="form_count"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#formGrad)"
            />
            <Area
              type="monotone"
              dataKey="whatsapp_count"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#waGrad)"
            />
            <Area
              type="monotone"
              dataKey="abandon_count"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="4 2"
              fill="url(#abandonGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
