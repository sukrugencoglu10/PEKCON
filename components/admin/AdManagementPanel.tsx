'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Search, Target, TrendingUp, Plus, Trash2, AlertCircle, CheckCircle, Minus } from 'lucide-react';
import type { AdSpendRow } from '@/lib/ad-spend-db';

interface ChannelPerformance {
  channel: 'google_ads' | 'meta_ads' | 'seo';
  label: string;
  total_spend: number;
  attributed_revenue: number;
  conversion_count: number;
  roas: number | null;
  cpa: number | null;
  budget_pct: number;
  lead_pct: number;
  performance_score: number;
}

interface FunnelRow {
  term: string;
  campaign: string;
  visits: number;
  conversions: number;
  rate: number;
  value: number;
}

interface AdData {
  channels: ChannelPerformance[];
  entries: AdSpendRow[];
  keywordFunnel: FunnelRow[];
}

interface FormState {
  channel: 'google_ads' | 'meta_ads' | 'seo';
  spend_amount: string;
  period_start: string;
  period_end: string;
  notes: string;
}

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  google_ads: <Search className="w-5 h-5" />,
  meta_ads: <Target className="w-5 h-5" />,
  seo: <TrendingUp className="w-5 h-5" />,
};

const CHANNEL_COLORS: Record<string, string> = {
  google_ads: '#3B82F6',
  meta_ads: '#8B5CF6',
  seo: '#22C55E',
};

const currency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });

function rangeToFromTo(range: string): { from: string; to: string } {
  const now = new Date();
  const days = range === '90d' ? 90 : 30;
  const from = new Date(now);
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().slice(0, 10),
    to: new Date(now.getTime() + 86400000).toISOString().slice(0, 10),
  };
}

function RoasLabel({ roas }: { roas: number | null }) {
  if (roas === null) return <span className="text-gray-400 text-sm">Veri yok</span>;
  const color = roas >= 3 ? 'text-green-600' : roas >= 1 ? 'text-amber-600' : 'text-red-600';
  return <span className={`text-lg font-bold ${color}`}>{roas.toFixed(1)}x</span>;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-green-100 text-green-700' : score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{score}/100</span>;
}

function RecommendationBadge({ rate }: { rate: number }) {
  if (rate >= 0.15) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Teklifi Artırın</span>;
  if (rate >= 0.05) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Koru</span>;
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Teklifi Düşür</span>;
}

export default function AdManagementPanel() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<FormState>({
    channel: 'google_ads',
    spend_amount: '',
    period_start: today,
    period_end: today,
    notes: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { from, to } = rangeToFromTo(range);
    try {
      const res = await fetch(`/api/admin/ad-spend?from=${from}&to=${to}`);
      if (!res.ok) throw new Error('Sunucu hatası');
      const json: AdData = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Veri alınamadı');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaveError(null);
    const amount = parseFloat(form.spend_amount);
    if (isNaN(amount) || amount <= 0) { setSaveError('Geçerli bir tutar girin'); return; }
    if (form.period_end < form.period_start) { setSaveError('Bitiş tarihi başlangıç tarihinden önce olamaz'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ad-spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, spend_amount: amount }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Kayıt eklenemedi');
      }
      setShowAddForm(false);
      setForm({ channel: 'google_ads', spend_amount: '', period_start: today, period_end: today, notes: '' });
      fetchData();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/ad-spend?id=${id}`, { method: 'DELETE' });
      fetchData();
    } finally {
      setDeletingId(null);
    }
  };

  // Bütçe dağılımı grafik verisi
  const budgetChartData = data?.channels.map((ch) => ({
    label: ch.label,
    'Bütçe Payı': ch.budget_pct,
    'Lead Payı': ch.lead_pct,
  })) ?? [];

  // Keyword teklif önerileri
  const avgLeadValue =
    data && data.keywordFunnel.length > 0
      ? data.keywordFunnel.reduce((s, r) => s + r.value, 0) /
        Math.max(1, data.keywordFunnel.reduce((s, r) => s + r.conversions, 0))
      : 2000;

  const recommendations = (data?.keywordFunnel ?? [])
    .filter((r) => r.visits > 0)
    .slice(0, 15)
    .map((r) => ({
      ...r,
      suggested_bid: r.visits > 0 ? Math.round((r.value / Math.max(r.visits, 1)) * 0.3) : 0,
    }));

  return (
    <div className="space-y-6">
      {/* Başlık + Kontroller */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reklam Yönetimi</h2>
          <p className="text-sm text-gray-500 mt-0.5">Kanal bazlı ROAS, CPA ve bütçe verimliliği</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[['30d', '30 Gün'], ['90d', '90 Gün']].map(([key, label]) => (
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
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0069b4] text-white text-sm font-medium rounded-lg hover:bg-[#005a9a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Harcama Ekle
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Harcama Ekle Formu */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Yeni Harcama Kaydı</h3>
          {saveError && (
            <div className="mb-3 text-sm text-red-600 flex gap-1.5">
              <AlertCircle className="w-4 h-4 mt-0.5" />{saveError}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Kanal</label>
              <select
                value={form.channel}
                onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value as FormState['channel'] }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
              >
                <option value="google_ads">Google Ads</option>
                <option value="meta_ads">Meta Ads</option>
                <option value="seo">SEO / Organik</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Harcama (TRY)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.spend_amount}
                onChange={(e) => setForm((f) => ({ ...f, spend_amount: e.target.value }))}
                placeholder="0"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Dönem Başlangıcı</label>
              <input
                type="date"
                value={form.period_start}
                onChange={(e) => setForm((f) => ({ ...f, period_start: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Dönem Bitişi</label>
              <input
                type="date"
                value={form.period_end}
                onChange={(e) => setForm((f) => ({ ...f, period_end: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Notlar (isteğe bağlı)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Kampanya adı, açıklama..."
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0069b4] text-white text-sm font-medium rounded-lg hover:bg-[#005a9a] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Kaydediliyor...' : <><CheckCircle className="w-4 h-4" /> Kaydet</>}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setSaveError(null); }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* 3 Kanal KPI Kartı */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading
          ? [...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-40" />)
          : (data?.channels ?? []).map((ch) => (
              <div key={ch.channel} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: CHANNEL_COLORS[ch.channel] }}>{CHANNEL_ICONS[ch.channel]}</span>
                    <span className="font-semibold text-gray-900 text-sm">{ch.label}</span>
                  </div>
                  <ScoreBadge score={ch.performance_score} />
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Harcama</span>
                    <span className="font-medium text-gray-900">{currency.format(ch.total_spend)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tahmini Gelir</span>
                    <span className="font-medium text-gray-900">{currency.format(ch.attributed_revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">ROAS</span>
                    <RoasLabel roas={ch.roas} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CPA</span>
                    <span className="font-medium text-gray-900">
                      {ch.cpa !== null ? currency.format(ch.cpa) : <span className="text-gray-400">Veri yok</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dönüşüm</span>
                    <span className="font-medium text-gray-900">{ch.conversion_count}</span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Bütçe Dağılımı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Bütçe Payı vs Lead Payı</h3>
          {loading ? (
            <div className="h-48 bg-gray-50 animate-pulse rounded-lg" />
          ) : budgetChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={budgetChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip formatter={(v) => [`%${Number(v).toFixed(1)}`]} />
                <Legend formatter={(v) => v} />
                <Bar dataKey="Bütçe Payı" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Lead Payı" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Harcama verisi girilmemiş</p>
          )}
        </div>

        {/* Öneriler */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Bütçe Önerileri</h3>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-gray-50 animate-pulse rounded" />)}
            </div>
          ) : data && data.channels.some((c) => c.total_spend > 0) ? (
            <ul className="space-y-3 text-sm text-gray-700">
              {data.channels.map((ch) => {
                const diff = ch.lead_pct - ch.budget_pct;
                if (Math.abs(diff) < 5) return (
                  <li key={ch.channel} className="flex gap-2 items-start">
                    <Minus className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span><strong>{ch.label}</strong> dengeli — bütçe payı %{ch.budget_pct.toFixed(0)}, lead payı %{ch.lead_pct.toFixed(0)}</span>
                  </li>
                );
                if (diff > 5) return (
                  <li key={ch.channel} className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span><strong>{ch.label}</strong> verimli (+%{diff.toFixed(0)} fazla lead) — bütçeyi artırmayı düşünün</span>
                  </li>
                );
                return (
                  <li key={ch.channel} className="flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <span><strong>{ch.label}</strong> verimsiz (%{Math.abs(diff).toFixed(0)} az lead) — bütçeyi gözden geçirin</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Öneri için harcama verisi girin</p>
          )}
        </div>
      </div>

      {/* Harcama Geçmişi */}
      {data && data.entries.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Harcama Geçmişi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Kanal</th>
                  <th className="text-left pb-2 font-medium">Dönem</th>
                  <th className="text-right pb-2 font-medium">Tutar</th>
                  <th className="text-left pb-2 font-medium">Notlar</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2">
                      <span className="flex items-center gap-1.5">
                        <span style={{ color: CHANNEL_COLORS[e.channel] }}>{CHANNEL_ICONS[e.channel]}</span>
                        <span className="text-gray-700">{e.channel === 'google_ads' ? 'Google Ads' : e.channel === 'meta_ads' ? 'Meta Ads' : 'SEO'}</span>
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">{e.period_start} – {e.period_end}</td>
                    <td className="py-2 text-right font-medium text-gray-900">{currency.format(e.spend_amount)}</td>
                    <td className="py-2 text-gray-500 max-w-xs truncate">{e.notes ?? '—'}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => handleDelete(e.id)}
                        disabled={deletingId === e.id}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Keyword Teklif Önerileri */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Keyword Teklif Önerileri</h3>
          <p className="text-xs text-gray-500 mb-4">
            Tahmini teklif = (lead değeri / ziyaret) × 0.3 | Ortalama lead değeri: {currency.format(avgLeadValue)}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Anahtar Kelime</th>
                  <th className="text-right pb-2 font-medium">Ziyaret</th>
                  <th className="text-right pb-2 font-medium">Dönüşüm</th>
                  <th className="text-right pb-2 font-medium">Oran</th>
                  <th className="text-right pb-2 font-medium">Tahmini Değer</th>
                  <th className="text-right pb-2 font-medium">Önerilen Teklif</th>
                  <th className="text-left pb-2 font-medium">Aksiyon</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 text-gray-800 max-w-xs">
                      <div className="truncate">{r.term}</div>
                      {r.campaign !== '(belirtilmemiş)' && (
                        <div className="text-xs text-gray-400 truncate">{r.campaign}</div>
                      )}
                    </td>
                    <td className="py-2 text-right text-gray-700">{r.visits}</td>
                    <td className="py-2 text-right text-gray-700">{r.conversions}</td>
                    <td className="py-2 text-right text-gray-700">%{(r.rate * 100).toFixed(1)}</td>
                    <td className="py-2 text-right text-gray-700">{currency.format(r.value)}</td>
                    <td className="py-2 text-right font-medium text-gray-900">{currency.format(r.suggested_bid)}</td>
                    <td className="py-2 pl-3">
                      <RecommendationBadge rate={r.rate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
