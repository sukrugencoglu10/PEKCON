import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import { getAttributionBreakdown, getKeywordFunnel } from '@/lib/analytics-db';
import { getAdSpendByChannel, getAdSpendEntries, insertAdSpend, deleteAdSpend } from '@/lib/ad-spend-db';

export const dynamic = 'force-dynamic';

const AdSpendSchema = z.object({
  channel: z.enum(['google_ads', 'meta_ads', 'seo']),
  spend_amount: z.number().positive(),
  period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

const CHANNEL_LABELS: Record<string, string> = {
  google_ads: 'Google Ads',
  meta_ads: 'Meta Ads',
  seo: 'SEO / Organik',
};

function computePerformanceScore(roas: number | null, cpa: number | null, leadPct: number, budgetPct: number): number {
  let score = 0;
  if (roas !== null) {
    score += roas >= 5 ? 40 : roas >= 3 ? 30 : roas >= 1.5 ? 20 : roas >= 1 ? 10 : 0;
  }
  if (cpa !== null) {
    score += cpa <= 300 ? 30 : cpa <= 600 ? 20 : cpa <= 1000 ? 10 : 0;
  }
  const ratio = budgetPct > 0 ? leadPct / budgetPct : 0;
  score += ratio >= 1.5 ? 30 : ratio >= 1.0 ? 20 : ratio >= 0.5 ? 10 : 0;
  return Math.min(100, score);
}

export async function GET(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(defaultFrom.getDate() - 30);

  const from = searchParams.get('from') ?? defaultFrom.toISOString().slice(0, 10);
  const to = searchParams.get('to') ?? new Date(now.getTime() + 86400000).toISOString().slice(0, 10);

  try {
    const [spendByChannel, attribution, entries, keywordFunnel] = await Promise.all([
      getAdSpendByChannel(from, to),
      getAttributionBreakdown(from, to),
      getAdSpendEntries(from, to),
      getKeywordFunnel(from, to),
    ]);

    // Kanal eşleştirme: attribution satırlarını kanal başlıklarına dön
    const channelRevenue: Record<string, number> = { google_ads: 0, meta_ads: 0, seo: 0 };
    const channelLeads: Record<string, number> = { google_ads: 0, meta_ads: 0, seo: 0 };

    for (const row of attribution) {
      const src = row.source.toLowerCase();
      const med = row.medium.toLowerCase();
      if (src.includes('google') || src.includes('gclid')) {
        channelRevenue.google_ads += row.value;
        channelLeads.google_ads += row.count;
      } else if (['facebook', 'instagram', 'meta', 'fb'].includes(src)) {
        channelRevenue.meta_ads += row.value;
        channelLeads.meta_ads += row.count;
      } else if (med === 'organic' || (src === '(direct)' && med === '(none)')) {
        channelRevenue.seo += row.value;
        channelLeads.seo += row.count;
      }
    }

    const totalSpend = spendByChannel.reduce((s, r) => s + r.total_spend, 0);
    const totalLeads = Object.values(channelLeads).reduce((s, v) => s + v, 0);

    const CHANNELS = ['google_ads', 'meta_ads', 'seo'] as const;
    const channels = CHANNELS.map((ch) => {
      const spend = spendByChannel.find((r) => r.channel === ch);
      const totalSpendCh = spend?.total_spend ?? 0;
      const revenue = channelRevenue[ch] ?? 0;
      const leads = channelLeads[ch] ?? 0;
      const roas = totalSpendCh > 0 ? revenue / totalSpendCh : null;
      const cpa = leads > 0 && totalSpendCh > 0 ? totalSpendCh / leads : null;
      const budgetPct = totalSpend > 0 ? (totalSpendCh / totalSpend) * 100 : 0;
      const leadPct = totalLeads > 0 ? (leads / totalLeads) * 100 : 0;
      return {
        channel: ch,
        label: CHANNEL_LABELS[ch],
        total_spend: totalSpendCh,
        attributed_revenue: revenue,
        conversion_count: leads,
        roas: roas !== null ? Math.round(roas * 100) / 100 : null,
        cpa: cpa !== null ? Math.round(cpa) : null,
        budget_pct: Math.round(budgetPct * 10) / 10,
        lead_pct: Math.round(leadPct * 10) / 10,
        performance_score: computePerformanceScore(roas, cpa, leadPct, budgetPct),
      };
    });

    return NextResponse.json({ channels, entries, keywordFunnel });
  } catch (error) {
    console.error('[Ad Spend GET] Error:', error);
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = AdSpendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz veri', details: parsed.error.flatten() }, { status: 400 });
    }
    if (parsed.data.period_end < parsed.data.period_start) {
      return NextResponse.json({ error: 'Bitiş tarihi başlangıç tarihinden önce olamaz' }, { status: 400 });
    }
    await insertAdSpend(parsed.data);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[Ad Spend POST] Error:', error);
    return NextResponse.json({ error: 'Kayıt eklenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Geçersiz id' }, { status: 400 });
  }
  try {
    await deleteAdSpend(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Ad Spend DELETE] Error:', error);
    return NextResponse.json({ error: 'Silme işlemi başarısız' }, { status: 500 });
  }
}
