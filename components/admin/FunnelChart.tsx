'use client';

import { Users, Target, FileText, MessageCircle, CheckCircle2, LogOut } from 'lucide-react';

export interface FunnelData {
  visits: number;
  intent: number;
  whatsapp_clicks: number;
  form_submits: number;
  form_abandons: number;
  visit_to_intent: number;
  intent_to_submit: number;
  visit_to_submit: number;
}

interface FunnelChartProps {
  data: FunnelData;
  /** Apps Script (Sheet) doğrulamasından gelen, Sheet'te bulunan form sayısı. null → henüz doğrulanmadı */
  verifiedLeads?: number | null;
  loading?: boolean;
}

const fmt = (n: number) => n.toLocaleString('tr-TR');
const pct = (r: number) => `%${(r * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`;

export default function FunnelChart({ data, verifiedLeads, loading }: FunnelChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-50 rounded animate-pulse mb-3" />
        ))}
      </div>
    );
  }

  const base = Math.max(data.visits, 1);
  // Genişlik oranı: ziyarete göre; çok küçük değerler görünür kalsın diye min %6
  const widthOf = (v: number) => `${Math.max((v / base) * 100, v > 0 ? 6 : 0)}%`;

  const stages = [
    {
      key: 'visits',
      label: 'Ziyaret',
      sub: 'Tekil oturum',
      value: data.visits,
      icon: Users,
      bar: 'bg-slate-400',
      text: 'text-slate-700',
      rate: null as string | null,
    },
    {
      key: 'intent',
      label: 'Niyet (etkileşim)',
      sub: 'WhatsApp + form başlangıç/terk + gönderim',
      value: data.intent,
      icon: Target,
      bar: 'bg-indigo-400',
      text: 'text-indigo-700',
      rate: data.visits > 0 ? pct(data.visit_to_intent) : null,
    },
    {
      key: 'form_submits',
      label: 'Form gönderimi',
      sub: 'Tamamlanan teklif formu',
      value: data.form_submits,
      icon: FileText,
      bar: 'bg-blue-500',
      text: 'text-blue-700',
      rate: data.intent > 0 ? pct(data.intent_to_submit) : null,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900">Birleşik Dönüşüm Hunisi</h3>
        <span className="text-xs text-gray-400">Ziyaret → Niyet → Form → Doğrulanmış</span>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        WhatsApp tıklamaları ve form gönderimleri tek akışta. Oranlar bir önceki aşamaya göredir.
      </p>

      {/* Ana huni — form yolu */}
      <div className="space-y-3">
        {stages.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <Icon className={`w-3.5 h-3.5 ${s.text}`} />
                  {s.label}
                  <span className="text-gray-400 font-normal">· {s.sub}</span>
                </span>
                <span className="text-gray-500">
                  {s.rate && <span className="mr-2 text-gray-400">{s.rate}</span>}
                  <span className={`font-bold ${s.text}`}>{fmt(s.value)}</span>
                </span>
              </div>
              <div className="h-7 w-full bg-gray-50 rounded-md overflow-hidden">
                <div
                  className={`h-full ${s.bar} rounded-md transition-all`}
                  style={{ width: widthOf(s.value) }}
                />
              </div>
            </div>
          );
        })}

        {/* Doğrulanmış Lead (Apps Script / Sheet) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Doğrulanmış Lead (Sheet)
              <span className="text-gray-400 font-normal">· Apps Script ile teyit</span>
            </span>
            <span className="text-gray-500">
              {verifiedLeads != null && data.form_submits > 0 && (
                <span className="mr-2 text-gray-400">
                  {pct(verifiedLeads / data.form_submits)}
                </span>
              )}
              <span className="font-bold text-emerald-700">
                {verifiedLeads == null ? '—' : fmt(verifiedLeads)}
              </span>
            </span>
          </div>
          <div className="h-7 w-full bg-gray-50 rounded-md overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-md transition-all"
              style={{ width: verifiedLeads == null ? '0%' : widthOf(verifiedLeads) }}
            />
          </div>
          {verifiedLeads == null && (
            <p className="text-[11px] text-gray-400 mt-1">
              Aşağıdaki “Apps Script Doğrulama” panelinden Doğrula’ya basın.
            </p>
          )}
        </div>
      </div>

      {/* Paralel yol + bağlam rozetleri */}
      <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
          <MessageCircle className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-[11px] text-gray-500">WhatsApp tıklama (paralel yol)</p>
            <p className="text-sm font-bold text-green-700">{fmt(data.whatsapp_clicks)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
          <LogOut className="w-4 h-4 text-red-500" />
          <div>
            <p className="text-[11px] text-gray-500">Form terk (yarıda bırakılan)</p>
            <p className="text-sm font-bold text-red-600">{fmt(data.form_abandons)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
