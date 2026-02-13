import { z } from 'zod';

// Quote form validation schema
export const quoteFormSchema = z.object({
  transactionType: z.enum(['purchase', 'rental'] as const, {
    error: 'Lütfen işlem türünü seçiniz',
  }),
  containerCategory: z.enum(['standard_cargo', 'refrigerated', 'custom'] as const, {
    error: 'Lütfen konteyner kategorisini seçiniz',
  }),
  containerType: z.string().optional(),
  quantity: z.number().min(1, 'Miktar en az 1 olmalıdır').max(1000),
  fullName: z.string().min(2, 'Ad soyad gereklidir'),
  companyName: z.string().optional(),
  phone: z.string().regex(/^[0-9+\s()-]+$/, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  notes: z.string().optional(),
});

// Contact form validation schema
export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Ad soyad gereklidir'),
  companyName: z.string().optional(),
  phone: z.string().regex(/^[0-9+\s()-]+$/, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  subject: z.string().min(2, 'Konu gereklidir'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
