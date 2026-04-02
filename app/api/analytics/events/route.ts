import { NextRequest, NextResponse } from 'next/server';

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
  try {
    const body = await req.json();

    const event: FieldDwellEvent = {
      field_name: String(body.field_name ?? ''),
      dwell_ms: Number(body.dwell_ms ?? 0),
      correction_count: Number(body.correction_count ?? 0),
      step: Number(body.step ?? 0),
      session_id: String(body.session_id ?? ''),
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
