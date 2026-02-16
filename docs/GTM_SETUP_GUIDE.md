# GTM Dönüşüm Kurulum Rehberi - PEKCON

Bu doküman, PEKCON projesi için Google Tag Manager (GTM) dönüşüm tracking kurulumunu adım adım açıklar.

## 📊 Genel Bakış

Projede hazır olan event'ler:
- ✅ `form_submit` - Teklif formu gönderimi (Ana dönüşüm)
- ✅ `quick_lead_submit` - Hero quick quote
- ✅ `add_to_cart` - GA4 e-commerce
- ✅ `begin_checkout` - Checkout başlangıcı
- ✅ `cta_click` - CTA tıklamaları
- ✅ `form_started` - Form başlatma
- ✅ `form_abandoned` - Form terk etme
- ✅ `whatsapp_click` - WhatsApp butonu (eğer varsa)
- ✅ `scroll_depth` - Scroll takibi (eğer varsa)

---

## 🔧 1. ADIM: Data Layer Variables Oluştur

**GTM Dashboard → Variables → User-Defined Variables → New**

Her biri için:
- **Variable Type:** Data Layer Variable
- **Data Layer Variable Name:** (aşağıdaki isimler)

### Oluşturulacak Variables:

| Variable Adı | Data Layer Variable Name | Açıklama |
|-------------|-------------------------|----------|
| `dlv - estimated_value` | `estimated_value` | Lead değeri (TRY) |
| `dlv - container_type` | `container_type` | Konteyner tipi (20DC, 40HC vb) |
| `dlv - container_category` | `container_category` | Kategori (standard_cargo, refrigerated, custom) |
| `dlv - form_name` | `form_name` | Form adı |
| `dlv - form_type` | `form_type` | İşlem türü (purchase/rental) |
| `dlv - quantity` | `quantity` | Miktar |
| `dlv - last_field` | `last_field` | Son tıklanan alan (abandonment için) |
| `dlv - cta_name` | `cta_name` | CTA butonu adı |
| `dlv - cta_location` | `cta_location` | CTA konumu |
| `dlv - input_type` | `input_type` | Quick quote input tipi |
| `dlv - scroll_percentage` | `scroll_percentage` | Scroll yüzdesi |

---

## 🎯 2. ADIM: Triggers (Tetikleyiciler) Oluştur

**GTM Dashboard → Triggers → New**

### A. Form Submit Trigger
- **Trigger Name:** `Event - Form Submit`
- **Trigger Type:** Custom Event
- **Event name:** `form_submit`
- **This trigger fires on:** All Custom Events

### B. Quick Lead Trigger
- **Trigger Name:** `Event - Quick Lead Submit`
- **Trigger Type:** Custom Event
- **Event name:** `quick_lead_submit`

### C. WhatsApp Click Trigger
- **Trigger Name:** `Event - WhatsApp Click`
- **Trigger Type:** Custom Event
- **Event name:** `whatsapp_click`

### D. Add to Cart Trigger
- **Trigger Name:** `Event - Add to Cart`
- **Trigger Type:** Custom Event
- **Event name:** `add_to_cart`

### E. Form Started Trigger
- **Trigger Name:** `Event - Form Started`
- **Trigger Type:** Custom Event
- **Event name:** `form_started`

### F. Form Abandoned Trigger
- **Trigger Name:** `Event - Form Abandoned`
- **Trigger Type:** Custom Event
- **Event name:** `form_abandoned`

### G. CTA Click Trigger
- **Trigger Name:** `Event - CTA Click`
- **Trigger Type:** Custom Event
- **Event name:** `cta_click`

### H. Scroll Depth Trigger
- **Trigger Name:** `Event - Scroll Depth`
- **Trigger Type:** Custom Event
- **Event name:** `scroll_depth`

---

## 🏷️ 3. ADIM: GA4 Event Tags Oluştur

**GTM Dashboard → Tags → New**

### A. 🎯 ANA DÖNÜŞÜM: Teklif Formu (Generate Lead)

**En önemli tag - Google Ads ve GA4'ün algoritması için kritik!**

- **Tag Name:** `GA4 - Generate Lead (Quote Form)`
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 Measurement ID - örn: G-XXXXXXXXXX]
- **Event Name:** `generate_lead` ✅ (GA4 standart event)
- **Event Parameters:**
  - Parameter Name: `value` → Value: `{{dlv - estimated_value}}`
  - Parameter Name: `currency` → Value: `TRY`
  - Parameter Name: `container_type` → Value: `{{dlv - container_type}}`
  - Parameter Name: `container_category` → Value: `{{dlv - container_category}}`
  - Parameter Name: `quantity` → Value: `{{dlv - quantity}}`
  - Parameter Name: `form_type` → Value: `{{dlv - form_type}}`
- **Triggering:** Event - Form Submit

**Neden önemli?**
- Google Ads bu event'i conversion olarak tanıyacak
- `value` parametresi ROAS (Return on Ad Spend) hesaplaması için kritik
- 40RF konteyner (4500 TL) ile 20DC (1500 TL) arasındaki farkı algoritma öğrenecek

---

### B. 🔥 YÜKSEK INTENT: WhatsApp Etkileşimi

**B2B'de form doldurmayan ama WhatsApp'tan yazan kitle genellikle "sıcak satış" kitlesidir.**

- **Tag Name:** `GA4 - WhatsApp Contact`
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 Measurement ID]
- **Event Name:** `contact_whatsapp`
- **Event Parameters:**
  - Parameter Name: `method` → Value: `whatsapp`
  - Parameter Name: `cta_location` → Value: `{{dlv - cta_location}}`
- **Triggering:** Event - WhatsApp Click

---

### C. 📝 Quick Lead Submit

- **Tag Name:** `GA4 - Quick Lead Submit`
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 Measurement ID]
- **Event Name:** `quick_lead_submit`
- **Event Parameters:**
  - Parameter Name: `input_type` → Value: `{{dlv - input_type}}`
  - Parameter Name: `form_name` → Value: `hero_quick_quote`
- **Triggering:** Event - Quick Lead Submit

---

### D. 🛒 E-commerce: Add to Cart

- **Tag Name:** `GA4 - Add to Cart`
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 Measurement ID]
- **Event Name:** `add_to_cart`
- **Send Ecommerce Data:** ✅ AÇIK (Enable)
- **Data Source:** Data Layer
- **Triggering:** Event - Add to Cart

**Not:** Kodda zaten GA4 formatında `items` array'i gönderiliyor, GTM otomatik yakalar.

---

### E. 🚀 Form Started

- **Tag Name:** `GA4 - Form Started`
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 Measurement ID]
- **Event Name:** `form_start`
- **Event Parameters:**
  - Parameter Name: `form_name` → Value: `{{dlv - form_name}}`
- **Triggering:** Event - Form Started

---

### F. 🚨 FORM TERK ETME (Critical for Optimization!)

**Hangi alanda takıldılar? Form optimizasyonu için en kritik veri!**

- **Tag Name:** `GA4 - Form Abandoned`
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 Measurement ID]
- **Event Name:** `form_abandon`
- **Event Parameters:**
  - Parameter Name: `form_name` → Value: `{{dlv - form_name}}`
  - Parameter Name: `last_field` → Value: `{{dlv - last_field}}`
- **Triggering:** Event - Form Abandoned

**Kullanım:**
- Eğer kullanıcılar "companyName" alanında formu bırakıyorsa → alan opsiyonel yapılabilir
- "phone" alanında bırakıyorlarsa → format açıklaması eklenebilir

---

### G. 🎯 CTA Clicks

- **Tag Name:** `GA4 - CTA Click`
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 Measurement ID]
- **Event Name:** `cta_click`
- **Event Parameters:**
  - Parameter Name: `cta_name` → Value: `{{dlv - cta_name}}`
  - Parameter Name: `cta_location` → Value: `{{dlv - cta_location}}`
- **Triggering:** Event - CTA Click

---

### H. 📊 Scroll Depth

- **Tag Name:** `GA4 - Scroll Depth`
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 Measurement ID]
- **Event Name:** `scroll`
- **Event Parameters:**
  - Parameter Name: `percent_scrolled` → Value: `{{dlv - scroll_percentage}}`
- **Triggering:** Event - Scroll Depth

---

## 💰 4. ADIM: Google Ads Conversion Tracking

**ROAS (Return on Ad Spend) optimizasyonu için kritik!**

### 🎯 ZORUNLU: GTM'den Direkt Google Ads Tag (ÖNERİLEN)

**Neden GA4 Import Değil?**
- GTM üzerinden kurulan direkt etiketler Enhanced Conversions desteğiyle daha dayanıklı
- Tarayıcı kısıtlamalarına (ITP, cookie blocking) karşı daha güçlü
- `estimated_value` değerini daha hızlı Ads paneline yansıtır
- Real-time conversion tracking

**GTM Dashboard → Tags → New**

#### A. Google Ads Conversion Tag

- **Tag Name:** `Google Ads - Lead Conversion (Quote Form)`
- **Tag Type:** Google Ads Conversion Tracking
- **Configuration:**
  - **Conversion ID:** `AW-XXXXXXXXX` (Google Ads hesabından al)
  - **Conversion Label:** `xxxxxxxxxxxxx` (Conversion action'dan al)
  - **Conversion Value:** `{{dlv - estimated_value}}` ✅
  - **Currency Code:** `TRY`
  - **Transaction ID:** Leave blank (or use order ID if available)
- **Advanced Settings:**
  - **Conversion Linker:** Enable (çok önemli!)
- **Triggering:** Event - Form Submit

#### B. Enhanced Conversions Aktif Et (Önemli!)

Enhanced Conversions, conversion tracking doğruluğunu %30-40 artırır.

**Aynı tag'de:**
- **Enable Enhanced Conversions:** ✅ Aktif
- **User-Provided Data:**
  - Email: `{{dlv - user_email}}` (Data Layer Variable oluştur)
  - Phone: `{{dlv - user_phone}}` (Data Layer Variable oluştur)
  - First Name: `{{dlv - user_first_name}}`
  - Last Name: `{{dlv - user_last_name}}`

**Yeni Data Layer Variables Ekle:**
| Variable Adı | Data Layer Variable Name |
|-------------|-------------------------|
| `dlv - user_email` | `email` |
| `dlv - user_phone` | `phone` |
| `dlv - user_first_name` | `first_name` |
| `dlv - user_last_name` | `last_name` |

#### C. Conversion Linker Tag (Zorunlu!)

**GTM → Tags → New**

- **Tag Name:** `Conversion Linker`
- **Tag Type:** Conversion Linker
- **Triggering:** All Pages
- **Fire once per event:** ✅

**Not:** Bu tag olmadan Google Ads tracking çalışmaz!

---

### 📊 Yöntem 2: GA4'ten Import (Opsiyonel - Yedek)

**Google Ads → Tools → Conversions → Import → Google Analytics 4**

1. Select: `generate_lead` event
2. Conversion Action Settings:
   - Goal: **Lead**
   - Value: **Use different values for each conversion** ✅
   - Count: **One** (Her lead bir kez sayılsın)
   - Conversion window: **30 days**
   - Attribution model: **Data-driven** (veya Last click)

**Not:** Bu yöntemi GTM direkt tag'ine ek olarak kullanabilirsin (double tracking için).

---

### 🎯 Beklenen Sonuç:

✅ Google Ads algoritması:
- 2.500 TL lead (20DC) ile 4.500 TL lead (40HC) arasındaki farkı öğrenecek
- Değerli lead'lere daha fazla teklif verecek
- ROAS maksimize olacak
- Enhanced Conversions ile tracking doğruluğu %30-40 artacak

---

## ✅ 5. ADIM: GA4'te Conversion Olarak İşaretle

**Google Analytics 4 → Admin → Events**

Şu event'leri **"Mark as conversion"** yap:
- ✅ `generate_lead` (Ana dönüşüm)
- ✅ `contact_whatsapp` (Yüksek intent)
- ✅ `form_submit`
- ✅ `add_to_cart`

---

## 🧪 6. ADIM: Test Et!

### ⚠️ KRİTİK: Form Submit Redirect Kontrolü

**QuoteForm.tsx Analizi:**
- ✅ Form submit sonrası `reset()` ve `setSubmitStatus()` kullanılıyor
- ✅ Sayfa yönlendirmesi YOK → Veri güvenle GTM'e ulaşıyor
- ✅ 5 saniye sonra status'u "idle" yapıyor
- ✅ Bu yapı GTM tracking için mükemmel!

**Eğer Redirect Olsaydı Ne Yapardık?**
```javascript
// BAD: Veri gönderilmeden redirect olur
window.location.href = '/thank-you';

// GOOD: GTM'in veriyi göndermesini bekle
setTimeout(() => {
  window.location.href = '/thank-you';
}, 500);
```

---

### GTM Preview Mode ile Test:

1. **GTM → Preview** butonuna tıkla
2. URL gir: `https://pekcon.com`
3. Siteye git ve **form doldur**

**Form Submit Test Checklist:**
- ✅ `form_started` event tetiklendi mi? (İlk alana tıklarken)
- ✅ `form_field_focus` event'leri her alan için tetiklendi mi?
- ✅ `form_submit` event tetiklendi mi? (Submit sonrası)
- ✅ `generate_lead` GA4 tag'i ateşlendi mi?
- ✅ Google Ads Conversion tag'i ateşlendi mi?
- ✅ Variables doğru değerleri yakaladı mı?
  - `estimated_value`: Doğru hesaplanmış mı?
  - `email`: Form'daki email değerini aldı mı?
  - `phone`: Form'daki telefon değerini aldı mı?
  - `first_name` / `last_name`: İsim ayrıştırıldı mı?

**Form Abandonment Test:**
1. Formu doldurmaya başla
2. Bir alanı doldur
3. 60 saniye bekle (hiçbir şey yapma)
4. ✅ `form_abandoned` event tetiklendi mi?
5. ✅ `last_field` parametresi doğru alanı gösteriyor mu?

**WhatsApp Test:**
1. Sağ alttaki WhatsApp butonuna tıkla
2. ✅ `whatsapp_click` event tetiklendi mi?
3. ✅ `cta_location`: "floating_button" gösteriyor mu?

**Scroll Depth Test:**
1. Sayfayı yavaşça aşağı kaydır
2. ✅ %25, %50, %75, %90, %100'de event'ler tetiklendi mi?

---

### Chrome DevTools Console Test:

**DataLayer İçeriğini Görüntüle:**
```javascript
// Tüm dataLayer'ı gör
console.log(window.dataLayer);

// Son event'i gör
console.log(window.dataLayer[window.dataLayer.length - 1]);
```

**Manuel Event Tetikleme:**

```javascript
// Form submit test
window.dataLayer.push({
  event: 'form_submit',
  form_name: 'quote_form',
  form_type: 'purchase',
  container_type: '40HC',
  container_category: 'standard_cargo',
  quantity: 5,
  estimated_value: 14000,
  email: 'test@example.com',
  phone: '+905551234567',
  first_name: 'Ahmet',
  last_name: 'Yılmaz'
});

// WhatsApp click test
window.dataLayer.push({
  event: 'whatsapp_click',
  cta_location: 'floating_button',
  phone_number: '+90 544 354 52 01',
  method: 'whatsapp'
});

// Form abandoned test
window.dataLayer.push({
  event: 'form_abandoned',
  form_name: 'quote_form',
  last_field: 'companyName',
  page_location: '/tr/teklif-al'
});
```

---

### GA4 Real-Time Report Kontrolü:

**Google Analytics 4 → Reports → Realtime**

1. Site üzerinde işlem yap (form gönder, WhatsApp'a tıkla)
2. Real-time raporunda event'leri gör:
   - ✅ `generate_lead`
   - ✅ `form_submit`
   - ✅ `whatsapp_click`
   - ✅ `scroll_depth`

**Event Parameters Kontrolü:**
- Event Name'e tıkla
- Parameters sekmesini aç
- `value`, `email`, `phone` parametrelerini gör

---

### Google Ads Conversion Test:

**Google Ads → Tools → Conversions → Click on your conversion action**

1. Form gönder
2. 10-30 dakika bekle
3. Google Ads Conversions raporunda görünmeli
4. ✅ Conversion value doğru mu? (estimated_value)
5. ✅ Enhanced conversion data görünüyor mu?

**Test Mode Aktif Et:**
```javascript
// Google Ads test conversion
window.dataLayer.push({
  event: 'form_submit',
  form_name: 'quote_form',
  estimated_value: 9999, // Test değeri
  email: 'test@pekcon.com',
  phone: '+905551234567'
});
```

---

## 📈 7. ADIM: Raporlama ve Optimizasyon

### GA4 Explorations - Funnel Analysis:

**Teklif Hunisi:**
1. `form_start` (Form başladı)
2. `form_field_focus` (İlk alan tıklandı)
3. `form_submit` (Form gönderildi) → **generate_lead**

**Kayıp Noktaları:**
- 1 → 2 arası kayıp: Form yüklenmiyor veya çok karmaşık
- 2 → 3 arası kayıp: `form_abandoned` event'indeki `last_field` parametresine bak

### Segmentasyon:

**Container Type Bazlı Analiz:**
- En çok hangi konteyner tipi ilgi görüyor?
- Hangi konteyner tipi en yüksek conversion rate'e sahip?
- ROAS hangi konteyner tipinde daha iyi?

**Purchase vs Rental:**
- `form_type` parametresi ile satın alma ve kiralama taleplerini ayır
- Hangisi daha karlı?

---

## 🎯 Beklenen Sonuçlar (3 Ay Sonra)

✅ **Conversion Tracking:** Tüm lead'ler GA4 ve Google Ads'te görünür
✅ **ROAS Optimization:** Google Ads değerli lead'lere odaklanır
✅ **Form Optimization:** Abandonment verileriyle form sürekli iyileşir
✅ **Channel Attribution:** Hangi kanal en değerli lead'leri getiriyor?
✅ **200K TL+ Ciro:** Veri odaklı kararlarla hedef daha kolay

---

## 📋 Kontrol Listesi

### GTM'de:
- [ ] 11 Data Layer Variable oluşturuldu
- [ ] 8 Custom Event Trigger oluşturuldu
- [ ] 8 GA4 Event Tag oluşturuldu
- [ ] Google Ads Conversion Tag oluşturuldu (opsiyonel)
- [ ] Preview mode'da test edildi
- [ ] GTM container yayınlandı (Publish)

### GA4'te:
- [ ] `generate_lead` conversion olarak işaretlendi
- [ ] `contact_whatsapp` conversion olarak işaretlendi
- [ ] Funnel exploration oluşturuldu

### Google Ads'te:
- [ ] GA4'ten `generate_lead` import edildi
- [ ] Conversion value tracking aktif

---

## 🆘 Sorun Giderme

**Event tetiklenmiyor:**
- Chrome DevTools → Console → `dataLayer` yaz → Event'leri kontrol et
- GTM Preview mode aktif mi?

**Value gönderilmiyor:**
- Variables doğru tanımlandı mı?
- `estimated_value` Data Layer'da var mı?

**Google Ads'e gönderilmiyor:**
- Conversion Linker tag'i var mı?
- Google Ads tag'inde Conversion ID doğru mu?

---

## 📞 İletişim

Sorular için: GTM ve GA4 dokümanlarına bakın veya Google Tag Manager Community'ye sorun.

---

**Son Güncelleme:** 2026-02-16
**Proje:** PEKCON Container & Logistics
**Hazırlayan:** Claude Code + Gemini Analysis
