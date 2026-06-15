# Birleşik Dönüşüm Hunisi & Apps Script Doğrulama

WhatsApp tıklamaları + form gönderimlerini tek bir huni'de toplar ve formdan Google
Apps Script'e giden lead'lerin gerçekten Sheet'e düşüp düşmediğini **otomatik karşılaştırır**
(reconciliation). İki katman vardır:

1. **In-house** — Admin paneli → **Analitik** sekmesi: aşamalı huni (`FunnelChart`) +
   Apps Script doğrulama paneli (`ReconciliationPanel`). Kaynak: Turso DB (`page_views` +
   `conversions`) ve Apps Script `doGet`.
2. **GA4 + Looker Studio** — Aynı huninin Google ekosistemindeki karşılığı (aşağıda adımlar).

İlgili kod:
- `lib/analytics-db.ts` → `getFunnelStages()`, `getFormSubmitsForReconcile()`
- `app/api/admin/analytics/summary/route.ts` → yanıta `funnel` eklendi
- `app/api/admin/analytics/reconcile/route.ts` → Apps Script doGet'i çağırır + DB ile diff
- `components/admin/FunnelChart.tsx`, `components/admin/ReconciliationPanel.tsx`

---

## 1. Ortam Değişkenleri

`.env.local` (ve **prod**: Vercel/Railway):

```
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/XXXX.../exec
GOOGLE_SHEET_READ_SECRET=<<RASTGELE-URETILEN-SECRET>>
```

- `GOOGLE_SHEET_WEBHOOK_URL`: Apps Script web app'inin `/exec` adresi (form lead'leri buraya
  POST ediliyor — `app/api/quote/route.ts`). Reconcile aynı URL'i **GET** ile çağırır.
- `GOOGLE_SHEET_READ_SECRET`: doGet'i koruyan paylaşılan anahtar. Apps Script tarafındaki
  `READ_SECRET` ile **birebir aynı** olmalı. Üretmek için: `openssl rand -hex 24`.
  **Bu değeri repoya/commit'e yazmayın** — yalnızca `.env.local` (gitignore'lu) ve Apps Script'te tutun.

> Not: `GOOGLE_SHEET_WEBHOOK_URL` şu an `.env.local`'de boş. Yerelde doğrulamayı test etmek için
> Apps Script /exec URL'inizi girin; aksi halde panel "Kurulum gerekli" uyarısı gösterir.

---

## 2. Apps Script — `doGet` Okuma Ucu (kullanıcı tarafı)

Mevcut Apps Script projenizde **`doPost` aynen kalır** (form lead'lerini Sheet'e yazıyor).
Aşağıdaki `doGet`'i ekleyin. Reconcile yalnızca **lead sekmesini** okur; analytics event
satırlarını (varsa) saymaz.

```javascript
// === AYARLAR ===
const READ_SECRET = '<<RASTGELE-URETILEN-SECRET>>'; // .env GOOGLE_SHEET_READ_SECRET ile AYNI (commit'e yazma)
const LEAD_SHEET_NAME = 'Leads'; // form lead'lerinin yazıldığı sekme adı (kendi sekmenize göre düzenleyin)
// Spreadsheet kimliği: Sheet URL'inizdeki /d/ ile /edit arasındaki kısım
// https://docs.google.com/spreadsheets/d/<<BURASI>>/edit
const SPREADSHEET_ID = 'BURAYA_SPREADSHEET_ID';

function doGet(e) {
  const p = (e && e.parameter) || {};

  // Yetki
  if (p.secret !== READ_SECRET) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (p.action !== 'reconcile') {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const fromTs = p.from ? new Date(p.from + 'T00:00:00').getTime() : 0;
  // to (hariç) — gün sonuna kadar dahil etmek için günün sonunu al
  const toTs = p.to ? new Date(p.to + 'T00:00:00').getTime() : Date.now() + 86400000;

  // Web app (doGet) bağlamında getActiveSpreadsheet() null döner → openById kullan
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(LEAD_SHEET_NAME) || ss.getSheets()[0];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return jsonOut({ count: 0, rows: [] });
  }

  // Başlık satırından sütun indekslerini bul (büyük/küçük harf duyarsız)
  const header = values[0].map(function (h) { return String(h).trim().toLowerCase(); });
  const idxTarih = findCol(header, ['tarih', 'date']);
  const idxTel = findCol(header, ['telefon', 'phone']);
  const idxMail = findCol(header, ['eposta', 'e-posta', 'email']);

  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    const tarihRaw = idxTarih >= 0 ? r[idxTarih] : '';
    const ts = parseTarih(tarihRaw);
    if (ts !== null && (ts < fromTs || ts >= toTs)) continue; // aralık dışı

    const telefon = idxTel >= 0 ? String(r[idxTel] || '') : '';
    const eposta = idxMail >= 0 ? String(r[idxMail] || '') : '';
    if (!telefon && !eposta) continue; // lead değil (boş/analytics satırı) → atla

    rows.push({ tarih: String(tarihRaw), telefon: telefon, eposta: eposta });
  }

  return jsonOut({ count: rows.length, rows: rows });
}

function findCol(header, names) {
  for (let i = 0; i < header.length; i++) {
    if (names.indexOf(header[i]) !== -1) return i;
  }
  return -1;
}

// "14.06.2026 10:23:45" (tr-TR) veya gerçek Date hücresini ms'e çevirir
function parseTarih(v) {
  if (v instanceof Date) return v.getTime();
  const s = String(v).trim();
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])).getTime();
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.getTime();
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Kurulum adımları
1. Apps Script editöründe yukarıdaki kodu ekleyin. `READ_SECRET` ve `LEAD_SHEET_NAME`'i düzenleyin.
2. **Dağıt → Dağıtımları yönet → Düzenle → Yeni sürüm → Dağıt** (mevcut `/exec` URL korunur).
3. Erişim: "Bağlantısı olan herkes" (secret koruması doGet içinde yapılıyor).
4. Tarayıcıda test:
   `https://script.google.com/macros/s/XXXX/exec?action=reconcile&from=2026-06-01&to=2026-06-15&secret=...`
   → `{ "count": N, "rows": [...] }` dönmeli.

---

## 3. Eşleştirme Mantığı (reconcile route)

`app/api/admin/analytics/reconcile/route.ts`:
- Apps Script'ten Sheet satırlarını çeker, DB'deki `form_submit` kayıtlarını alır.
- Anahtar: **telefon** (son 10 hane normalize) → bulunamazsa **e-posta** (lowercase).
- Çıktı:
  - **Eşleşen** — hem DB'de hem Sheet'te var (sağlıklı).
  - **Sheet'te eksik** — DB'de var, Sheet'te yok → `syncToGoogleSheets` webhook'u düşmüş olabilir.
  - **DB'de eksik** — Sheet'te var, DB'de yok → `insertConversion` düşmüş olabilir.

Panelde "Doğrula"ya basınca eşleşen sayısı huninin **Doğrulanmış Lead** aşamasına yansır.

---

## 4. GA4 Huni Keşfi (Funnel Exploration)

GA4 (`G-09MSN7JYJ8`) → **Keşfet (Explore)** → **Huni keşfi (Funnel exploration)**:

**Form yolu (kapalı huni):**
1. `page_view`
2. `form_started`
3. `form_submit`
4. `generate_lead` (opsiyonel — dönüşüm teyidi)

**WhatsApp yolu (ayrı huni veya açık huni adımı):**
1. `page_view`
2. `whatsapp_click`

- **Kırılım (Breakdown):** `utm_source` / `utm_campaign` (mevcut event parametreleri).
- Açık huni (open funnel) seçilirse kullanıcılar adımları atlayabilir; kanal karşılaştırması için
  uygundur. Kesin oran için kapalı huni kullanın.

> Event'lerin tümü `lib/gtm.ts` ve `components/analytics/*` üzerinden zaten dataLayer'a basılıyor
> (bkz. `GTM_BLUEPRINT.md`). Ek tag gerekmez.

---

## 5. Looker Studio — GA4 + Sheet Tek Pano

1. **Veri kaynakları ekle:**
   - GA4 connector → `G-09MSN7JYJ8`
   - Google Sheets connector → lead Sheet'i (Apps Script'in yazdığı sayfa).
2. **Sayfa A — Huni:** GA4 verisiyle bir "Funnel" / bar chart (event: `page_view`, `form_started`,
   `form_submit`, `whatsapp_click`).
3. **Sayfa B — Doğrulama:**
   - Scorecard 1: GA4 `form_submit` sayısı (seçili tarih aralığı).
   - Scorecard 2: Sheet satır sayısı (`COUNT` / record count).
   - İki scorecard yan yana → fark = Sheet'e ulaşmayan lead'ler (in-house panelle aynı sinyal).
   - Sheet tablosu: tarih, telefon, eposta, konteynerTipi (ham lead listesi).
4. (İleri) İki kaynağı tarih bazında **blend** edip günlük GA4 vs Sheet eğrisini üst üste çizin.

---

## İlgili Dokümanlar
- `GTM_BLUEPRINT.md` — tüm event kataloğu + GTM tetikleyicileri
- `docs/TRACKING_BLUEPRINT.md` — uçtan uca tracking mimarisi
