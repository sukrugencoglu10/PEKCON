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

**Google Ads → Tools → Conversions → New Conversion Action**

### Yöntem 1: GA4'ten Import (Önerilen)
1. Google Ads → Conversions → Import → Google Analytics 4
2. Select: `generate_lead` event
3. Conversion Action Settings:
   - Goal: **Lead**
   - Value: **Use different values for each conversion** ✅
   - Count: **One** (Her lead bir kez sayılsın)
   - Conversion window: **30 days**
   - Attribution model: **Data-driven** (veya Last click)

### Yöntem 2: GTM'den Direkt Google Ads Tag
- **Tag Type:** Google Ads Conversion Tracking
- **Conversion ID:** [Google Ads Conversion ID]
- **Conversion Label:** [Google Ads Conversion Label]
- **Conversion Value:** `{{dlv - estimated_value}}` ✅
- **Currency Code:** `TRY`
- **Triggering:** Event - Form Submit

**Neden önemli?**
- Google Ads algoritması 2.500 TL lead ile 4.500 TL lead'i ayırt edebilecek
- Değerli lead'lere daha fazla teklif verecek
- ROAS maksimize olacak

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

### GTM Preview Mode ile Test:

1. **GTM → Preview** butonuna tıkla
2. URL gir: `https://pekcon.com`
3. Siteye git ve form doldur
4. GTM Preview panelinde kontrol et:
   - ✅ `form_submit` event tetiklendi mi?
   - ✅ Variables doğru değerleri yakaladı mı?
   - ✅ GA4 tag ateşlendi mi?
   - ✅ `estimated_value` doğru mu?

### Chrome DevTools Console Test:

```javascript
// Form submit test
window.dataLayer.push({
  event: 'form_submit',
  form_name: 'quote_form',
  form_type: 'purchase',
  container_type: '40HC',
  container_category: 'standard_cargo',
  quantity: 5,
  estimated_value: 14000
});

// WhatsApp click test
window.dataLayer.push({
  event: 'whatsapp_click',
  cta_location: 'header'
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
