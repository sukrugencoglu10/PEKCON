# PEKCON Master Tracking Blueprint

## Context
Bu döküman, PEKCON Container & Logistics sitesinin ölçümleme altyapısının tam teknik analizi ve yeni projelere aktarılabilir bir referans kılavuzudur. Amaç: veri tutarlılığı (data accuracy), sinyal kalitesi (EMQ score) ve ad-blocker direnci sağlayan bir tracking stack oluşturmak.

---

## 1. Veri Katmanı & İskelet (Data Layer & Infrastructure)

### DataLayer Yapısı
- **Event isimlendirme standardı:** `snake_case` (GA4 uyumlu)
- **Timestamp:** Her event'te `new Date().toISOString()` ekleniyor
- **dataLayer tipi:** `Record<string, any>[]` (global.d.ts'de tanımlı)

```javascript
// Standart push formatı
window.dataLayer.push({
  event: 'event_name',
  timestamp: new Date().toISOString(),
  ...eventParams
});
```

### GTM Konteyner Yapısı
| Katman | ID | Dosya |
|--------|-----|-------|
| **GTM Container** | `GTM-536W5D89` | `components/analytics/GoogleTagManager.tsx` |
| **GA4 Measurement ID** | `G-WLY28LNC3X` | `lib/server-tracking.ts` |
| **GA4 API Secret** | `kwlg2Y_UR2qwXH28HjKHxA` | `.env.local` |

### Client-Side vs Server-Side Ayrımı

| Katman | Ne Yapıyor | Dosya |
|--------|-----------|-------|
| **Client: GTM** | dataLayer push → GA4 + Ads tag tetikleme | `GoogleTagManager.tsx` |
| **Client: Meta Pixel** | `fbq('track', 'Lead')` + PageView | `MetaPixel.tsx` |
| **Client: Clarity** | Session recording + heatmap | `MicrosoftClarity.tsx` |
| **Client: TrackingProvider** | UTM, gclid, fbclid, referrer yakalama | `TrackingProvider.tsx` |
| **Server: Meta CAPI** | `graph.facebook.com/v19.0` Lead event | `lib/server-tracking.ts` |
| **Server: GA4 MP** | `/mp/collect` generate_lead event | `lib/server-tracking.ts` |
| **Server: HubSpot** | Contact + Deal oluşturma | `app/api/quote/route.ts` |
| **Server: Google Sheets** | Lead log webhook | `app/api/quote/route.ts` |

---

## 2. Google Ekosistemi Entegrasyonu

### GA4 Yapılandırması
- **Measurement ID:** `G-WLY28LNC3X`
- **Yükleme:** GTM container üzerinden (client-side) + Measurement Protocol (server-side)
- **Page View:** Route değişikliğinde otomatik (`GoogleTagManager.tsx`)

**Temel Event'ler (Custom + Standard):**

| Event | Tür | Tetiklenme |
|-------|-----|-----------|
| `generate_lead` | GA4 Standard | Form submit + WhatsApp click |
| `add_to_cart` | GA4 Standard | Form submit (estimated value) |
| `view_item` | GA4 Standard | Konteyner tipi görüntüleme |
| `begin_checkout` | GA4 Standard | Teklif akışı başlatma |
| `scroll_depth` | Custom | 25%, 50%, 75%, 90%, 100% |
| `form_started` | Custom | İlk form alanına focus |
| `form_submit` | Custom | Form gönderildiğinde |
| `form_abandoned` | Custom | 60sn inaktivite sonrası |
| `form_field_dwell` | Custom | Alan focus süresi + düzeltme sayısı |
| `form_step_time` | Custom | Multi-step geçiş süresi |
| `container_3d_interaction` | Custom | 3D model drag/view |
| `sticky_bar_event` | Custom | Impression/click/dismiss |
| `section_view` | Custom | IntersectionObserver |
| `whatsapp_click` | Custom | WhatsApp link tıklama |
| `cta_click` | Custom | CTA buton tıklamaları |
| `language_switch` | Custom | Dil değişikliği |

### Google Ads
- **Conversion ID:** GTM üzerinden konfigüre ediliyor (GTM_SETUP_GUIDE.md)
- **Conversion Linker:** GTM container'da tanımlı
- **Enhanced Conversions:** Email, phone, first_name, last_name → SHA256 hash ile gönderim

### Lead Value Estimation (Dinamik Değer)
```javascript
const BASE_VALUES = {
  '20DC': 1500,  '40DC': 2500,  '40HC': 2800,
  '20OT': 2200,  '40OT': 3200,  '45HC': 3200,
  '20FR': 2000,  '40FR': 3000,  '40RF': 4500,
};
// Final value = baseValue × quantity
```

### Search Console
- **Sitemap:** `https://pekcon.com/sitemap.xml` (`app/sitemap.ts`)
- **robots.txt:** Allow: /, Disallow: /api/, /_next/ (`app/robots.ts`)
- **TR sayfalar:** 6 URL (teklif-al: priority 0.9, daily)
- **EN sayfalar:** 6 URL (quote: priority 0.9, daily)

---

## 3. Meta (Facebook) & Server-Side CAPI

### Meta Pixel (Client-Side)
- **Pixel ID:** `1293202826015037`
- **Dosya:** `components/analytics/MetaPixel.tsx`
- **Yükleme:** `afterInteractive` strategy + noscript fallback

**Client Event Tetikleme:**
```javascript
// QuoteForm.tsx'de form submit sonrası
window.fbq('track', 'Lead', {
  currency: 'TRY',
  value: estimatedValue,
  content_category: containerCategory,
  content_name: containerType,
}, { eventID: eventIdRef.current }); // Deduplication key
```

### Meta CAPI (Server-Side)
- **Dosya:** `lib/server-tracking.ts`
- **Endpoint:** `https://graph.facebook.com/v19.0/{pixelId}/events`
- **API Version:** v19.0

**Deduplication Stratejisi:**
```
1. QuoteForm → eventIdRef = crypto.randomUUID()
2. POST /api/quote → event_id ile server'a gönder
3. Server → sendMetaCAPI({ event_id }) → Meta CAPI'ye gönder
4. Client → fbq('track', 'Lead', {}, { eventID: event_id })
5. Meta → event_id + event_time eşleşmesi ile tekilleştirme
```

**FBP & FBC Taşınması:**
```
Client → Cookies → Server API Route:
  _fbp cookie → regex ile extract → CAPI user_data.fbp
  _fbc cookie → regex ile extract (veya fbclid URL param) → CAPI user_data.fbc

Extraction (app/api/quote/route.ts):
  const cookieHeader = request.headers.get('cookie');
  const fbpMatch = cookieHeader?.match(/_fbp=([^;]+)/);
  const fbcMatch = cookieHeader?.match(/_fbc=([^;]+)/);
```

**User Data Hash Fonksiyonu:**
```typescript
// SHA256 hashing (Web Crypto API — server-side)
async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Pre-processing:
// Email:  trim().toLowerCase() → SHA256
// Phone:  replace(/\D/g, '') → SHA256
// Name:   trim().toLowerCase() → SHA256
```

**CAPI Payload Yapısı:**
```javascript
{
  event_name: 'Lead',
  event_time: Math.floor(Date.now() / 1000),
  event_id: uuid,              // Deduplication
  action_source: 'website',
  event_source_url: sourceUrl,
  user_data: {
    em: [hashedEmail],         // SHA256
    ph: [hashedPhone],         // SHA256
    fn: [hashedFirstName],     // SHA256
    ln: [hashedLastName],      // SHA256
    fbc: fbcCookie,            // Raw (not hashed)
    fbp: fbpCookie,            // Raw (not hashed)
    client_ip_address: ip,
    client_user_agent: ua
  },
  custom_data: {
    currency: 'TRY',
    value: estimatedValue,
    content_category: category,
    content_name: type
  }
}
```

---

## 4. Server-Side GTM (sGTM) Mimarisi

### Mevcut Durum
Bu projede **sGTM container ayrı kurulu DEĞİL**. Bunun yerine:
- **Next.js API Routes** server-side tracking hub olarak kullanılıyor
- `/api/quote/route.ts` → Meta CAPI + GA4 MP doğrudan çağrılıyor
- Fire-and-forget pattern (UX'i bloklamıyor)

### Avantajlar (Mevcut Mimari)
| Özellik | sGTM | Bu Proje (Next.js API) |
|---------|------|----------------------|
| Cookie ömrü | 1st-party (uzun) | Browser cookie'leri extract |
| Ad-blocker bypass | ✅ | ✅ (API route üzerinden) |
| Ek sunucu maliyeti | GCP/Stape gerekli | Vercel'de zaten mevcut |
| Esneklik | GTM tag/trigger | Kod tabanlı (tam kontrol) |
| iOS 14+ uyum | ✅ | ✅ |

### Veri Akış Protokolü
```
[Browser]                         [Vercel Edge / Serverless]
    │                                     │
    ├─ GTM dataLayer push ───────────→ GA4 Tags (client)
    ├─ fbq('track') ────────────────→ Meta Pixel (client)
    ├─ Clarity tracking ────────────→ Microsoft (client)
    │                                     │
    ├─ POST /api/quote ─────────────→ [API Route Handler]
    │   (form data + cookies)              ├─ sendMetaCAPI() → graph.facebook.com
    │                                      ├─ sendGA4MP()    → google-analytics.com/mp
    │                                      ├─ syncHubSpot()  → api.hubspot.com
    │                                      └─ syncSheets()   → Google Sheets webhook
```

---

## 5. Hiyerarşik Tracking Stack Haritası

```
┌──────────────────────────────────────────────────────────────┐
│                    PEKCON TRACKING STACK                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─── CLIENT (Browser) ──────────────────────────────────┐   │
│  │                                                        │   │
│  │  GTM Container (GTM-536W5D89)                          │   │
│  │   └─ GA4 Config Tag (G-WLY28LNC3X)                    │   │
│  │   └─ Google Ads Conversion Tag (AW-XXXXXXXXX)          │   │
│  │   └─ Conversion Linker                                 │   │
│  │   └─ Enhanced Conversions Tag                          │   │
│  │                                                        │   │
│  │  Meta Pixel (1293202826015037)                         │   │
│  │   └─ PageView (auto) + Lead (form submit)              │   │
│  │                                                        │   │
│  │  Microsoft Clarity (w5cvs8fh9m)                        │   │
│  │   └─ Session recording + Heatmaps                      │   │
│  │                                                        │   │
│  │  TrackingProvider (localStorage)                        │   │
│  │   └─ UTM, gclid, fbclid, referrer                     │   │
│  │                                                        │   │
│  │  lib/gtm.ts (Event Library — 27 fonksiyon)             │   │
│  │   └─ dataLayer.push() → GTM → GA4 + Ads               │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                          │                                    │
│                    POST /api/quote                             │
│                    (form + cookies)                            │
│                          ▼                                    │
│  ┌─── SERVER (Next.js API Routes) ───────────────────────┐   │
│  │                                                        │   │
│  │  lib/server-tracking.ts                                │   │
│  │   ├─ sendMetaCAPI() → graph.facebook.com/v19.0         │   │
│  │   │   └─ Lead event + hashed user_data                 │   │
│  │   │   └─ event_id deduplication                        │   │
│  │   │                                                    │   │
│  │   └─ sendGA4MeasurementProtocol()                      │   │
│  │       └─ google-analytics.com/mp/collect               │   │
│  │       └─ generate_lead + client_id from _ga cookie     │   │
│  │                                                        │   │
│  │  CRM & Data Sync                                       │   │
│  │   ├─ HubSpot API → Contact + Deal                     │   │
│  │   └─ Google Sheets → Lead log webhook                  │   │
│  │                                                        │   │
│  │  Email                                                 │   │
│  │   └─ Resend API → Teklif bildirim emaili               │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─── ANALYTICS BACKEND ─────────────────────────────────┐   │
│  │                                                        │   │
│  │  /api/analytics/events → Form field dwell tracking     │   │
│  │  /api/admin/analytics  → Admin dashboard (aggregated)  │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Yeni Projeye Kurulum Sırası (Step-by-Step Roadmap)

| Adım | Ne Yapılacak | Dosya / Araç | Bağımlılık |
|------|-------------|-------------|-----------|
| **1** | GTM Container oluştur | tagmanager.google.com | — |
| **2** | GA4 Property oluştur | analytics.google.com | — |
| **3** | Meta Pixel oluştur | business.facebook.com | — |
| **4** | Meta CAPI Access Token al | Meta Events Manager | Adım 3 |
| **5** | GA4 Measurement Protocol API Secret al | GA4 Admin → Data Streams | Adım 2 |
| **6** | `.env.local` dosyasını hazırla | Tüm ID'ler + secret'lar | Adım 1-5 |
| **7** | `types/global.d.ts` — Window tiplerini tanımla | dataLayer, gtag, fbq | — |
| **8** | `components/analytics/GoogleTagManager.tsx` oluştur | GTM init + page_view | Adım 1 |
| **9** | `components/analytics/MetaPixel.tsx` oluştur | Pixel init + PageView | Adım 3 |
| **10** | `components/analytics/MicrosoftClarity.tsx` oluştur | Session recording | — |
| **11** | `components/TrackingProvider.tsx` oluştur | UTM/gclid/fbclid capture | — |
| **12** | `lib/gtm.ts` — Event kütüphanesini yaz | Tüm dataLayer push fonksiyonları | Adım 7 |
| **13** | `lib/server-tracking.ts` — CAPI + MP yaz | hashSHA256, sendMetaCAPI, sendGA4MP | Adım 4, 5 |
| **14** | `lib/validators.ts` — Form schema (Zod) | Tracking alanları dahil | — |
| **15** | `app/api/quote/route.ts` — Form handler | Cookie extract + server tracking | Adım 13 |
| **16** | `components/forms/QuoteForm.tsx` — Form component | Client events + event_id | Adım 12 |
| **17** | `components/analytics/AnalyticsEvents.tsx` | Scroll + section + WA tracking | Adım 12 |
| **18** | Layout'a tracking bileşenlerini ekle | `app/[locale]/layout.tsx` | Adım 8-11 |
| **19** | GTM'de tag/trigger konfigürasyonu | GTM Web UI | Adım 1, 8 |
| **20** | Google Ads Conversion + Enhanced Conversions | GTM + Ads UI | Adım 19 |
| **21** | robots.txt + sitemap.xml oluştur | `app/robots.ts`, `app/sitemap.ts` | — |
| **22** | Test: Meta CAPI Event Test Tool | Events Manager → Test Events | Adım 13 |
| **23** | Test: GA4 DebugView | GA4 → Configure → DebugView | Adım 12 |
| **24** | Test: GTM Preview Mode | GTM → Preview | Adım 19 |

---

## 7. Sinyal Kalitesi (EMQ Score) İyileştirme Detayları

### Veri Tutarlılığı Sağlayan Mekanizmalar

| Mekanizma | Açıklama | Etki |
|-----------|---------|------|
| **event_id deduplication** | Client pixel + Server CAPI aynı UUID kullanır | Çift sayımı önler |
| **SHA256 hashing** | Email/phone Meta'ya hashli gider | Privacy + EMQ artışı |
| **fbp/fbc taşıma** | Browser cookie → Server → CAPI user_data | Meta match quality ↑ |
| **_ga client_id** | Cookie extract → GA4 MP | Session tutarlılığı |
| **gclid passthrough** | URL param → localStorage → form → server → GA4 MP | Google Ads attribution ↑ |
| **Fire-and-forget** | Server tracking hata verse bile UX etkilenmez | Güvenilirlik |
| **Session correlation** | sessionIdRef (UUID) tüm form event'lerini bağlar | Funnel analizi |
| **Estimated lead value** | Konteyner tipine göre dinamik değer | ROAS hesaplama |

### Cookie Yaşam Döngüsü

```
1. Ziyaretçi gelir → GTM yüklenir → GA4 _ga cookie set eder
2. Meta Pixel → _fbp cookie set eder
3. Reklam tıklaması varsa → URL'de gclid/fbclid → TrackingProvider localStorage'a yazar
4. fbclid varsa → Meta _fbc cookie set eder
5. Form submit → /api/quote:
   - request.headers.cookie'den _fbp, _fbc, _ga extract
   - localStorage'dan gclid, utm_* okunur (form hidden fields)
   - Hepsi birleştirilerek CAPI + GA4 MP'ye gönderilir
```

---

## 8. Dosya Referans Tablosu

| Dosya | Satır | Tür | İşlev |
|-------|-------|-----|-------|
| `components/analytics/GoogleTagManager.tsx` | 55 | Client | GTM init + page_view |
| `components/analytics/MetaPixel.tsx` | 44 | Client | Meta Pixel + noscript |
| `components/analytics/MicrosoftClarity.tsx` | 26 | Client | Clarity |
| `components/analytics/AnalyticsEvents.tsx` | 85 | Client | Scroll + section + WA |
| `components/TrackingProvider.tsx` | 55 | Client | UTM/gclid/referrer |
| `components/GTMScript.tsx` | 31 | Client | GTM script injection |
| `lib/gtm.ts` | 274 | Shared | 27 event fonksiyonu |
| `lib/server-tracking.ts` | 195 | Server | CAPI + GA4 MP + hash |
| `lib/validators.ts` | 47 | Shared | Zod form schema |
| `hooks/useScrollTracking.ts` | 53 | Client | Scroll depth hook |
| `components/forms/QuoteForm.tsx` | 656 | Client | Form + field tracking |
| `app/api/quote/route.ts` | 386 | Server | Form handler + sync |
| `app/api/analytics/events/route.ts` | 60 | Server | Field dwell buffer |
| `types/global.d.ts` | — | Types | dataLayer, gtag, fbq |
| `docs/GTM_SETUP_GUIDE.md` | 549 | Docs | GTM konfigürasyon rehberi |
