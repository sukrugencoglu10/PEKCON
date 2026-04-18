# PEKCON GTM Event Blueprint

**GTM Container:** GTM-536W5D89  
**GA4 Measurement ID:** G-WLY28LNC3X  
**Google Ads ID:** AW-10974974305  
**Meta Pixel ID:** 1293202826015037  
**Microsoft Clarity:** w5cvs8fh9m  

---

## Mevcut GTM Tetikleyicileri (GTM'de Tanımlı)

| Tetikleyici Adı | Tür | Event Adı |
|---|---|---|
| Event - WhatsApp Click | Özel Etkinlik | `whatsapp_click` |
| Event - Form Submit | Özel Etkinlik | `form_submit` |
| Event - Quick Lead Submit | Özel Etkinlik | `quick_lead_submit` |
| Event - Scroll Depth | Özel Etkinlik | `scroll_depth` |
| WhatsApp Tıklama | Özel Etkinlik | *(mevcut, kontrol et)* |
| Initialization - All Pages | Sayfa Görüntüleme | Tüm sayfalar |

---

## Event Kataloğu

### 1. `whatsapp_click`
**Tetikleyen:** WhatsApp butonuna tıklama  
**Kaynak:** `lib/gtm.ts` + `components/analytics/AnalyticsEvents.tsx`  
**GTM Tetikleyici:** Event - WhatsApp Click  
**Bağlı GTM Etiketleri:** Etiket - Google Ads WhatsApp Dönüşümü  

**dataLayer parametreleri:**
```
cta_location      → 'floating_button'
method            → 'whatsapp'
locale            → 'tr' | 'en'
conversion_time   → ISO tarih/saat (ör. 2026-04-15T10:23:45.123Z)
page_url          → tam URL
page_path         → /tr, /en/hizmetlerimiz vb.
page_referrer     → ziyaretçinin geldiği URL
utm_source        → google, facebook, vb.
utm_medium        → cpc, organic, vb.
utm_campaign      → kampanya adı
utm_term          → anahtar kelime
gclid             → Google Ads click ID
fbclid            → Meta Ads click ID
transaction_id    → wa_<timestamp> (mükerrer dönüşüm engeli)
```

---

### 2. `form_submit`
**Tetikleyen:** Teklif formunun son adımında gönder butonuna tıklama  
**Kaynak:** `lib/gtm.ts` → `trackQuoteFormSubmit()`  
**GTM Tetikleyici:** Event - Form Submit  

**dataLayer parametreleri:**
```
form_name         → 'quote_form'
lead_type         → 'quote_request'
form_type         → işlem türü (kiralama, satış vb.)
container_category→ konteyner kategorisi
container_type    → 20DC, 40HC vb.
quantity          → adet
estimated_value   → tahmini değer (TL)
user_type         → 'B2B' | 'B2C'
email             → (Enhanced Conversions)
phone             → (Enhanced Conversions)
first_name        → (Enhanced Conversions)
last_name         → (Enhanced Conversions)
```

**Ayrıca tetiklenir:**
- `generate_lead` (GA4) — currency, value, method, user_type
- `add_to_cart` (GA4) — ecommerce formatında
- Meta Pixel `Lead` eventi (client-side + CAPI server-side)

---

### 3. `generate_lead`
**Tetikleyen:** Form gönderimi VEYA WhatsApp tıklaması VEYA hesap makinesi  
**Kaynak:** `lib/gtm.ts` → `trackLeadConversion()` / `trackWhatsAppConversion()`  

**dataLayer parametreleri (form):**
```
currency          → 'TRY'
value             → tahmini değer
method            → 'quote_form'
lead_type         → 'quote_request'
container_type    → 20DC, 40HC vb.
user_type         → 'B2B' | 'B2C'
```

**dataLayer parametreleri (whatsapp):**
```
currency          → 'TRY'
method            → 'whatsapp'
locale            → 'tr' | 'en'
```

**dataLayer parametreleri (hesap makinesi):**
```
lead_type         → 'transport_calc'
container_type    → konteyner tipi
distance_km       → mesafe
empty_return      → boş dönüş var mı
estimated_value   → tahmini fiyat
```

---

### 4. `quick_lead_submit`
**Tetikleyen:** Hero bölümündeki hızlı teklif formu gönderimi  
**Kaynak:** `lib/gtm.ts` → `trackQuickQuoteSubmit()`  
**GTM Tetikleyici:** Event - Quick Lead Submit  

**dataLayer parametreleri:**
```
form_name         → 'hero_quick_quote'
input_type        → 'email' | 'phone' | 'other'
input_length      → karakter sayısı
```

---

### 5. `scroll_depth`
**Tetikleyen:** Sayfanın %25, %50, %75, %90, %100'üne kaydırma  
**Kaynak:** `components/analytics/AnalyticsEvents.tsx` + `lib/gtm.ts`  
**GTM Tetikleyici:** Event - Scroll Depth  

**dataLayer parametreleri:**
```
scroll_percentage → 25 | 50 | 75 | 90 | 100
page              → pathname
```

---

### 6. `section_view`
**Tetikleyen:** Sayfadaki bölümler ekrana girdiğinde (%50 eşiği)  
**Kaynak:** `components/analytics/AnalyticsEvents.tsx`  

**dataLayer parametreleri:**
```
section_name      → data-track-section değeri veya section id'si
page              → pathname
```

---

### 7. `cta_click`
**Tetikleyen:** Hero bölümü teklif al butonları  
**Kaynak:** `components/home/HeroSection.tsx`  

**dataLayer parametreleri:**
```
cta_name          → 'hero_quote_scroll' | 'hero_quote_ship_swim'
cta_location      → 'hero'
```

---

### 8. `sticky_bar_event`
**Tetikleyen:** Sticky teklif çubuğu gösterimi / tıklama / kapatma  
**Kaynak:** `components/home/StickyQuoteBar.tsx`  

**dataLayer parametreleri:**
```
action            → 'impression' | 'cta_click' | 'dismiss'
locale            → 'tr' | 'en'
```

---

### 9. `form_started`
**Tetikleyen:** Teklif formunda ilk alana odaklanıldığında  
**Kaynak:** Form bileşeni → `lib/gtm.ts` → `trackFormStarted()`  

**dataLayer parametreleri:**
```
form_name         → 'quote_form'
```

---

### 10. `form_abandoned`
**Tetikleyen:** Forma başlayıp 60 saniye hareketsiz kalındığında  
**Kaynak:** Form bileşeni → `lib/gtm.ts` → `trackFormAbandoned()`  

**dataLayer parametreleri:**
```
form_name         → 'quote_form'
last_field        → son odaklanan alan
page_location     → pathname
timestamp         → ISO tarih/saat
```

---

### 11. `form_field_focus`
**Tetikleyen:** Form alanına tıklama  
**Kaynak:** `lib/gtm.ts` → `trackFormFieldFocus()`  

**dataLayer parametreleri:**
```
form_name         → 'quote_form'
field_name        → alan adı
```

---

### 12. `form_step_time`
**Tetikleyen:** Form adımları arasında geçiş  
**Kaynak:** Form bileşeni → `lib/gtm.ts` → `trackFormStepTime()`  

**dataLayer parametreleri:**
```
form_name         → 'quote_form'
from_step         → çıkılan adım numarası
to_step           → girilen adım numarası
step_duration_ms  → adımda geçirilen süre (ms)
direction         → 'forward' | 'back'
```

---

### 13. `container_3d_interaction`
**Tetikleyen:** 3D konteyner modeli ile etkileşim  
**Kaynak:** `lib/gtm.ts` → `track3DInteraction()`  

**dataLayer parametreleri:**
```
container_type    → 20DC, 40HC vb.
action            → 'drag_end' | 'type_view'
drag_duration_ms  → (drag_end için) sürükleme süresi
rotation_delta    → (drag_end için) dönüş açısı
view_duration_ms  → (type_view için) görüntüleme süresi
```

---

### 14. `language_switch`
**Tetikleyen:** Dil değiştirici kullanıldığında  
**Kaynak:** `lib/gtm.ts` → `trackLanguageSwitch()`  

**dataLayer parametreleri:**
```
from_language     → 'tr' | 'en'
to_language       → 'tr' | 'en'
```

---

### 15. `page_view`
**Tetikleyen:** Her sayfa değişiminde (Next.js route)  
**Kaynak:** `components/analytics/GoogleTagManager.tsx`  

**dataLayer parametreleri:**
```
page_path         → pathname
page_search       → query string
```

---

## Google Ads Dönüşüm Etiketleri (GTM'de Tanımlı)

| Etiket Adı | Conversion ID | Label | Tetikleyici |
|---|---|---|---|
| Etiket - Google Ads WhatsApp Dönüşümü | AW-10974974305 | 3AH9COjd9OcbEOGio_Eo | Event - WhatsApp Click |

---

## Veri Katmanı Değişkenleri (GTM'de Tanımlı)

| Değişken Adı | Veri Katmanı Alanı | Kullanım Yeri |
|---|---|---|
| dlv - transaction_id | transaction_id | Google Ads dönüşüm etiketi → İşlem Kimliği |
| dlv - time_spent | time_spent | *(mevcut)* |
| dlv - user_email | user_email | *(mevcut)* |
| dlv - user_first_name | user_first_name | *(mevcut)* |

---

## Veri Akışı

```
Kullanıcı aksiyonu
    ↓
lib/gtm.ts → trackEvent()
    ↓
┌─────────────────────────────────┐
│ dataLayer.push({ event, ...  }) │ → GTM işler
│ window.gtag('event', ...)       │ → GA4 direkt
└─────────────────────────────────┘
    ↓
GTM Container (GTM-536W5D89)
    ├─→ GA4 (G-WLY28LNC3X)
    ├─→ Google Ads (AW-10974974305) [whatsapp_click, form_submit]
    └─→ Microsoft Clarity

Ayrıca:
    ├─→ Meta Pixel (1293202826015037) [form_submit → Lead]
    └─→ /api/analytics/conversion → Turso DB [whatsapp_click, form_abandon]
```

---

## Yeni Event Eklerken Kontrol Listesi

1. `lib/gtm.ts`'e yeni `trackXxx()` fonksiyonu ekle
2. İlgili component'te fonksiyonu çağır
3. GTM'de **Özel Etkinlik** tetikleyicisi oluştur (event adıyla)
4. Gerekiyorsa GTM'de etiketi oluştur ve tetikleyiciye bağla
5. GTM Preview moduyla test et → Yayınla
6. Bu dosyayı güncelle
