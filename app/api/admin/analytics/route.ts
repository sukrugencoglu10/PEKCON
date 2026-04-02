import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getFieldEvents } from '@/app/api/analytics/events/route';

export const dynamic = 'force-dynamic';

interface FieldStats {
  field_name: string;
  step: number;
  avg_dwell_ms: number;
  median_dwell_ms: number;
  total_interactions: number;
  correction_rate: number; // 0–1
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export async function GET() {
  await requireAdmin();

  const events = getFieldEvents();

  // Aggregate per field
  const map = new Map<string, { dwells: number[]; corrections: number; step: number }>();

  for (const e of events) {
    if (!map.has(e.field_name)) {
      map.set(e.field_name, { dwells: [], corrections: 0, step: e.step });
    }
    const entry = map.get(e.field_name)!;
    entry.dwells.push(e.dwell_ms);
    entry.corrections += e.correction_count;
  }

  const stats: FieldStats[] = Array.from(map.entries()).map(([field_name, data]) => ({
    field_name,
    step: data.step,
    avg_dwell_ms: Math.round(data.dwells.reduce((s, v) => s + v, 0) / data.dwells.length),
    median_dwell_ms: Math.round(median(data.dwells)),
    total_interactions: data.dwells.length,
    correction_rate: data.dwells.length > 0 ? data.corrections / data.dwells.length : 0,
  }));

  // Sort by step, then by avg_dwell_ms desc
  stats.sort((a, b) => a.step - b.step || b.avg_dwell_ms - a.avg_dwell_ms);

  return NextResponse.json({ stats, total_sessions: events.length });
}
