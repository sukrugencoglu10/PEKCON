'use client';

import { FileText, MessageCircle, TrendingUp, LogOut } from 'lucide-react';

interface KPIData {
  total_leads: number;
  total_whatsapp: number;
  total_value: number;
  total: number;
  total_abandon: number;
}

interface KPICardsProps {
  data: KPIData;
  loading?: boolean;
}

export default function KPICards({ data, loading }: KPICardsProps) {
  const abandonRate = data.total_leads + data.total_abandon > 0
    ? Math.round((data.total_abandon / (data.total_leads + data.total_abandon)) * 100)
    : 0;

  const cards = [
    {
      label: 'Form Gonderimleri',
      value: data.total_leads,
      format: 'number' as const,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'WhatsApp Tiklamalari',
      value: data.total_whatsapp,
      format: 'number' as const,
      icon: MessageCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Form Terk',
      value: data.total_abandon,
      format: 'number' as const,
      sub: `Terk orani: %${abandonRate}`,
      icon: LogOut,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      label: 'Toplam Deger (TRY)',
      value: data.total_value,
      format: 'currency' as const,
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`${card.bg} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-xs text-gray-500 font-medium">{card.label}</span>
            </div>
            {loading ? (
              <div className="h-8 bg-gray-100 rounded animate-pulse" />
            ) : (
              <>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.format === 'currency'
                    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(card.value)
                    : card.value.toLocaleString('tr-TR')}
                </p>
                {'sub' in card && card.sub && (
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
