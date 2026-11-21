import { z } from 'zod';

// Quote form validation schema
export const quoteFormSchema = z.object({
  transactionType: z.enum(['purchase'] as const, {
    error: 'Lütfen işlem türünü seçiniz',
  }),
  containerCategory: z.enum(['standard_cargo', 'refrigerated', 'flat_rack', 'open_top', 'custom'] as const, {
    error: 'Lütfen konteyner kategorisini seçiniz',
  }),
  containerType: z.string().optional(),
  quantity: z.number().min(1, 'Miktar en az 1 olmalıdır').max(1000),
  region: z.string().optional(),
  fullName: z.string().min(2, 'Ad soyad gereklidir'),
  companyName: z.string().optional(),
  phone: z.string().regex(/^\+90[0-9]{10}$/, '+90 ile başlayan 10 haneli numara giriniz'),
  // E-posta isteğe bağlı: boş bırakılabilir, doldurulursa geçerli olmalı
  email: z.union([z.literal(''), z.string().trim().email('Geçerli bir e-posta adresi giriniz')]).optional(),
  notes: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  gclid: z.string().optional(),
  originalReferrer: z.string().optional(),
  event_id: z.string().optional(),  // Meta CAPI / GA4 deduplikasyon ID'si
  fbclid: z.string().optional(),    // Facebook tıklama ID'si (_fbc için)
});

// Contact form validation schema
export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Ad soyad gereklidir'),
  companyName: z.string().optional(),
  phone: z.string().regex(/^[0-9+\s()-]+$/, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  subject: z.string().min(2, 'Konu gereklidir'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  gclid: z.string().optional(),
  originalReferrer: z.string().optional(),
});

// Yarım kalan teklif formu: kullanıcı telefonunu yazıp formu göndermeden ayrıldığında
export const partialQuoteSchema = z.object({
  phone: z.string().regex(/^\+90[0-9]{10}$/),
  fullName: z.string().max(100).optional(),
  containerCategory: z.string().max(40).optional(),
  containerType: z.string().max(20).optional(),
  quantity: z.number().min(1).max(1000).optional(),
  gclid: z.string().max(300).optional(),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
