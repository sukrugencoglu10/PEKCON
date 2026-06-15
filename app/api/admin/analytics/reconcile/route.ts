import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import { getFormSubmitsForReconcile } from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL ?? '';
const READ_SECRET = process.env.GOOGLE_SHEET_READ_SECRET ?? '';

interface SheetRow {
  tarih?: string;
  telefon?: string;
  eposta?: string;
}

// Telefonu son 10 haneye normalize et (TR numaraları için +90 / 0 / boşluk farklarını eler)
function normalizePhone(raw?: string | null): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function normalizeEmail(raw?: string | null): string {
  return (raw ?? '').trim().toLowerCase();
}

// Bir satırın kimlik anahtarı: telefon (öncelik) → e-posta
function identityKey(phone: string, email: string): string | null {
  if (phone) return `p:${phone}`;
  if (email) return `e:${email}`;
  return null;
}

export async function GET(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  // Yapılandırma eksikse panelde kurulum mesajı gösterilsin (hata değil)
  if (!WEBHOOK_URL || !READ_SECRET) {
    return NextResponse.json({
      configured: false,
      message:
        'GOOGLE_SHEET_WEBHOOK_URL ve/veya GOOGLE_SHEET_READ_SECRET tanımlı değil. ' +
        'Apps Script doGet kurulumu için docs/FUNNEL_AND_RECONCILE.md dosyasına bakın.',
    });
  }

  const { searchParams } = new URL(request.url);
  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(defaultFrom.getDate() - 30);
  const from = searchParams.get('from') ?? defaultFrom.toISOString().slice(0, 10);
  const to = searchParams.get('to') ?? new Date(now.getTime() + 86400000).toISOString().slice(0, 10);

  // 1) Apps Script (Google Sheets) tarafındaki lead satırlarını çek
  let sheetRows: SheetRow[] = [];
  try {
    const url = new URL(WEBHOOK_URL);
    url.searchParams.set('action', 'reconcile');
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);
    url.searchParams.set('secret', READ_SECRET);

    const res = await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          configured: true,
          error: `Apps Script okuma hatası (HTTP ${res.status}). doGet kurulu mu?`,
          detail: text.slice(0, 300),
        },
        { status: 502 }
      );
    }
    const json = await res.json();
    sheetRows = Array.isArray(json?.rows) ? json.rows : [];
  } catch (err) {
    return NextResponse.json(
      {
        configured: true,
        error: 'Apps Script yanıtı okunamadı (JSON değil veya bağlantı hatası).',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }

  // 2) DB'deki form_submit kayıtları
  const dbRows = await getFormSubmitsForReconcile(from, to);

  // 3) Sheet satırlarını kimlik anahtarına göre indeksle (çoklu eşleşme için sayaç)
  const sheetIndex = new Map<string, SheetRow[]>();
  const sheetNoKey: SheetRow[] = [];
  for (const r of sheetRows) {
    const key = identityKey(normalizePhone(r.telefon), normalizeEmail(r.eposta));
    if (!key) {
      sheetNoKey.push(r);
      continue;
    }
    const bucket = sheetIndex.get(key);
    if (bucket) bucket.push(r);
    else sheetIndex.set(key, [r]);
  }

  // 4) DB satırlarını Sheet'le eşleştir
  let matched = 0;
  const missingInSheet: Array<{
    created_at: string;
    phone: string | null;
    email: string | null;
    estimated_value: number | null;
  }> = [];

  for (const d of dbRows) {
    const phone = normalizePhone(d.contact_phone);
    const email = normalizeEmail(d.contact_email);
    // Önce telefon anahtarı, eşleşmezse e-posta anahtarı dene
    const keys = [identityKey(phone, ''), identityKey('', email)].filter(
      (k): k is string => k !== null
    );
    let hit = false;
    for (const key of keys) {
      const bucket = sheetIndex.get(key);
      if (bucket && bucket.length > 0) {
        bucket.shift(); // tüket → mükerrer eşleşmeyi önle
        hit = true;
        break;
      }
    }
    if (hit) {
      matched++;
    } else {
      missingInSheet.push({
        created_at: d.created_at,
        phone: d.contact_phone,
        email: d.contact_email,
        estimated_value: d.estimated_value,
      });
    }
  }

  // 5) Sheet'te kalan (DB'de eşleşmeyen) satırlar → DB'de eksik
  const missingInDb: Array<{ tarih: string | null; phone: string | null; email: string | null }> = [];
  for (const bucket of sheetIndex.values()) {
    for (const r of bucket) {
      missingInDb.push({
        tarih: r.tarih ?? null,
        phone: r.telefon ?? null,
        email: r.eposta ?? null,
      });
    }
  }
  for (const r of sheetNoKey) {
    missingInDb.push({ tarih: r.tarih ?? null, phone: r.telefon ?? null, email: r.eposta ?? null });
  }

  return NextResponse.json({
    configured: true,
    range: { from, to },
    db_count: dbRows.length,
    sheet_count: sheetRows.length,
    matched,
    missing_in_sheet_count: missingInSheet.length,
    missing_in_db_count: missingInDb.length,
    // Panelde liste için ilk 50 örnek
    missing_in_sheet: missingInSheet.slice(0, 50),
    missing_in_db: missingInDb.slice(0, 50),
  });
}
