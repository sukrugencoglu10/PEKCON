/**
 * Server-Side Tracking Library
 * Meta CAPI + GA4 Measurement Protocol
 * iOS 14+ / ad-blocker bypass — tüm çağrılar Next.js API Route içinden yapılır.
 */

const GA4_MEASUREMENT_ID = 'G-WLY28LNC3X';

// ─── Lead değer tahmini (gtm.ts'e bağımlı olmamak için inline) ───────────────
const BASE_VALUES: Record<string, number> = {
  '20DC': 1500, '40DC': 2500, '40HC': 2800, '20OT': 2200,
  '20FR': 2000, '40RF': 4500, '40OT': 3200, '40FR': 3000, '45HC': 3200,
};

export function estimateLeadValueServer(containerType?: string, quantity = 1): number {
  const base = containerType ? (BASE_VALUES[containerType] ?? 2000) : 2000;
  return base * quantity;
}

// ─── SHA256 (Web Crypto API — Edge & Node.js uyumlu) ─────────────────────────
export async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── GA4 cookie → client_id ───────────────────────────────────────────────────
// Format: GA1.1.XXXXXXXXXX.XXXXXXXXXX → client_id = son iki kısım birleşimi
export function extractGA4ClientId(gaCookie: string | null): string {
  if (!gaCookie) return 'server-fallback';
  const parts = gaCookie.split('.');
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`;
  return gaCookie;
}

// ─── Meta CAPI ────────────────────────────────────────────────────────────────

export interface MetaCAPIPayload {
  event_id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fbp?: string;           // _fbp cookie'den (Meta browser ID)
  fbc?: string;           // _fbc cookie'den veya fbclid URL param'dan
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
  containerCategory?: string;
  containerType?: string;
  quantity?: number;
}

export async function sendMetaCAPI(payload: MetaCAPIPayload): Promise<void> {
  const pixelId = process.env.FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn('[Meta CAPI] FACEBOOK_PIXEL_ID veya FACEBOOK_ACCESS_TOKEN tanımlı değil — atlandı.');
    return;
  }

  const leadValue = estimateLeadValueServer(payload.containerType, payload.quantity);

  // Kullanıcı verilerini SHA256 ile hashle (Meta CAPI zorunluluğu)
  const [em, ph, fn, ln] = await Promise.all([
    payload.email ? hashSHA256(payload.email.trim().toLowerCase()) : Promise.resolve(undefined),
    payload.phone ? hashSHA256(payload.phone.replace(/\D/g, '')) : Promise.resolve(undefined),
    payload.firstName ? hashSHA256(payload.firstName.trim().toLowerCase()) : Promise.resolve(undefined),
    payload.lastName ? hashSHA256(payload.lastName.trim().toLowerCase()) : Promise.resolve(undefined),
  ]);

  // user_data: sadece tanımlı alanları ekle
  const userData: Record<string, string | undefined> = {
    em,
    ph,
    fn,
    ln,
    fbc: payload.fbc,
    fbp: payload.fbp,
    client_ip_address: payload.clientIp,
    client_user_agent: payload.userAgent,
  };
  // undefined değerleri temizle
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);

  const eventData = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.event_id,
    action_source: 'website',
    event_source_url: payload.eventSourceUrl ?? 'https://pekcon.com/tr/teklif-al',
    user_data: userData,
    custom_data: {
      currency: 'TRY',
      value: leadValue,
      content_category: payload.containerCategory,
      content_name: payload.containerType ?? 'unknown',
    },
  };

  const body: Record<string, any> = {
    data: [eventData],
    access_token: accessToken,
  };

  // Test event code sadece tanımlıysa ekle (production'da boş bırakılmalı)
  const testCode = process.env.FACEBOOK_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (res.ok) {
      console.log(`[Meta CAPI] Başarılı: Lead eventi gönderildi — event_id: ${payload.event_id}`);
    } else {
      const err = await res.text();
      console.error(`[Meta CAPI] Hata: ${res.status} — ${err}`);
    }
  } catch (err) {
    console.error('[Meta CAPI] Bağlantı hatası:', err);
  }
}

// ─── GA4 Measurement Protocol ────────────────────────────────────────────────

export interface GA4EventPayload {
  clientId: string;
  gclid?: string;
  currency: string;
  value: number;
  containerCategory: string;
  containerType?: string;
}

export async function sendGA4MeasurementProtocol(params: GA4EventPayload): Promise<void> {
  const apiSecret = process.env.GA4_API_SECRET;

  if (!apiSecret) {
    console.warn('[GA4 MP] GA4_API_SECRET tanımlı değil — atlandı.');
    return;
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${apiSecret}`;

  const eventParams: Record<string, any> = {
    currency: params.currency,
    value: params.value,
    form_name: 'quote_form',
    container_category: params.containerCategory,
    container_type: params.containerType ?? 'unknown',
    // session_id GA4'ün kendi mekanizmasına bırakıyoruz
  };

  if (params.gclid) eventParams.gclid = params.gclid;

  const body = {
    client_id: params.clientId,
    events: [
      {
        name: 'generate_lead',
        params: eventParams,
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // GA4 MP her zaman 204 No Content döner (başarıda)
    if (res.status === 204) {
      console.log(`[GA4 MP] Başarılı: generate_lead eventi gönderildi — client_id: ${params.clientId}`);
    } else {
      const text = await res.text();
      console.error(`[GA4 MP] Beklenmeyen yanıt: ${res.status} — ${text}`);
    }
  } catch (err) {
    console.error('[GA4 MP] Bağlantı hatası:', err);
  }
}
