'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteFormSchema, QuoteFormData } from '@/lib/validators';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import Button from '../ui/Button';

export default function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      transactionType: 'purchase',
      quantity: 1,
    },
  });

  const containerCategory = watch('containerCategory');

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitStatus('success');
      reset();

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-dark-800 mb-3">
          İşlem Türü *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="purchase"
              {...register('transactionType')}
              className="mr-2"
            />
            <span>Satın Alma</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="rental"
              {...register('transactionType')}
              className="mr-2"
            />
            <span>Kiralama</span>
          </label>
        </div>
        {errors.transactionType && (
          <p className="mt-1 text-sm text-red-600">{errors.transactionType.message}</p>
        )}
      </div>

      {/* Container Category */}
      <FormSelect
        label="Konteyner Kategorisi *"
        {...register('containerCategory')}
        error={errors.containerCategory?.message}
        options={[
          { value: '', label: 'Seçiniz' },
          { value: 'standard_cargo', label: 'Standart Yük Konteyneri' },
          { value: 'refrigerated', label: 'Buzdolabı Konteyneri' },
          { value: 'custom', label: 'Özel Üretim' },
        ]}
      />

      {/* Container Type (conditional) */}
      {containerCategory === 'standard_cargo' && (
        <FormSelect
          label="Konteyner Tipi *"
          {...register('containerType')}
          error={errors.containerType?.message}
          options={[
            { value: '', label: 'Seçiniz' },
            { value: '20DC', label: "20' DC (Dry Container)" },
            { value: '40DC', label: "40' DC (Dry Container)" },
            { value: '40HC', label: "40' HC (High Cube)" },
            { value: '45HC', label: "45' HC (High Cube)" },
            { value: '20OT', label: "20' OT (Open Top)" },
            { value: '40OT', label: "40' OT (Open Top)" },
          ]}
        />
      )}

      {/* Quantity */}
      <FormInput
        type="number"
        label="Miktar *"
        {...register('quantity', { valueAsNumber: true })}
        error={errors.quantity?.message}
        min={1}
        max={1000}
      />

      {/* Delivery Location */}
      <FormInput
        type="text"
        label="Teslimat Konumu *"
        placeholder="Şehir, Ülke"
        {...register('deliveryLocation')}
        error={errors.deliveryLocation?.message}
      />

      {/* Delivery Date (optional) */}
      <FormInput
        type="date"
        label="Tahmini Teslimat Tarihi"
        {...register('deliveryDate')}
        error={errors.deliveryDate?.message}
      />

      <div className="border-t pt-6">
        <h3 className="text-lg font-display font-bold text-dark-900 mb-4">
          İletişim Bilgileriniz
        </h3>

        <div className="space-y-4">
          {/* Full Name */}
          <FormInput
            type="text"
            label="Ad Soyad *"
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          {/* Company Name (optional) */}
          <FormInput
            type="text"
            label="Firma Adı"
            {...register('companyName')}
            error={errors.companyName?.message}
          />

          {/* Phone */}
          <FormInput
            type="tel"
            label="Telefon *"
            placeholder="+90 5XX XXX XX XX"
            {...register('phone')}
            error={errors.phone?.message}
          />

          {/* Email */}
          <FormInput
            type="email"
            label="E-posta *"
            {...register('email')}
            error={errors.email?.message}
          />

          {/* Notes (optional) */}
          <FormTextarea
            label="Ek Notlar"
            placeholder="Eklemek istediğiniz detaylar..."
            {...register('notes')}
            error={errors.notes?.message}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Teklif İste'}
      </Button>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✓ Teklifiniz başarıyla alındı! En kısa sürede size dönüş yapacağız.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ✗ Bir hata oluştu. Lütfen tekrar deneyin veya bizi arayın.
        </div>
      )}
    </form>
  );
}
