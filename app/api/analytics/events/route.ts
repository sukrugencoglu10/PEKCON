import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export interface FieldDwellEvent {
  field_name: string;
  dwell_ms: number;
  correction_count: number;
  step: number;
  session_id: string;
  timestamp: string;
}

// Module-level in-memory store — accumulates across requests within the same instance.
// Resets on deploy/cold start. Suitable for trend analysis over a session window.
const fieldEvents: FieldDwellEvent[] = [];
const MAX_EVENTS = 5000;

export function getFieldEvents(): FieldDwellEvent[] {
  return fieldEvents;
}

export async function POST(req: NextRequest) {
  if (isRateLimited(`events:${getClientIp(req)}`, 120, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  if (Number(req.headers.get('content-length') ?? 0) > 4096) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }
  try {
    const body = await req.json();

    const event: FieldDwellEvent = {
      field_name: String(body.field_name ?? '').slice(0, 64),
      dwell_ms: Math.min(Math.max(Number(body.dwell_ms ?? 0) || 0, 0), 3_600_000),
      correction_count: Math.min(Math.max(Number(body.correction_count ?? 0) || 0, 0), 1000),
      step: Math.min(Math.max(Number(body.step ?? 0) || 0, 0), 20),
      session_id: String(body.session_id ?? '').slice(0, 64),
      timestamp: new Date().toISOString(),
    };

    if (!event.field_name) {
      return NextResponse.json({ error: 'field_name required' }, { status: 400 });
    }

    // Cap buffer size to prevent unbounded growth
    if (fieldEvents.length >= MAX_EVENTS) fieldEvents.shift();
    fieldEvents.push(event);

    // Also forward to Google Sheets webhook if configured
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analytics', ...event }),
        redirect: 'follow',
      }).catch(() => null); // Fire-and-forget — don't block response
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
