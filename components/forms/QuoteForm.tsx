'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteFormSchema, QuoteFormData } from '@/lib/validators';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import Button from '../ui/Button';
import { getTranslations, type Locale } from '@/lib/i18n';
import {
  trackQuoteFormSubmit,
  trackFormFieldFocus,
  trackFormError,
  trackFormStarted,
  trackFormAbandoned,
  trackAddToCart,
} from '@/lib/gtm';

export default function QuoteForm({ locale = 'tr' }: { locale?: Locale }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formInteracted, setFormInteracted] = useState(false);
  const abandonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFieldRef = useRef('');
  const t = getTranslations(locale);
  const f = t.quotePage.form;

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

  // Form abandonment tracking
  useEffect(() => {
    const handleFieldInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      const fieldName = target.getAttribute('name') || '';

      if (!formInteracted && fieldName) {
        setFormInteracted(true);
        trackFormStarted('quote_form');
      }

      if (fieldName) {
        lastFieldRef.current = fieldName;
        trackFormFieldFocus('quote_form', fieldName);

        // Reset abandon timer
        if (abandonTimeoutRef.current) {
          clearTimeout(abandonTimeoutRef.current);
        }

        abandonTimeoutRef.current = setTimeout(() => {
          if (submitStatus === 'idle') {
            trackFormAbandoned('quote_form', lastFieldRef.current);
          }
        }, 60000); // 1 minute
      }
    };

    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.addEventListener('focusin', handleFieldInteraction);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener('focusin', handleFieldInteraction);
      }
      if (abandonTimeoutRef.current) {
        clearTimeout(abandonTimeoutRef.current);
      }
    };
  }, [submitStatus, formInteracted]);

  // Track form errors
  useEffect(() => {
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        trackFormError('quote_form', field, error.message as string);
      }
    });
  }, [errors]);

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    // Clear abandon timeout since form is being submitted
    if (abandonTimeoutRef.current) {
      clearTimeout(abandonTimeoutRef.current);
    }

    try {
      // Track form submission and enhanced ecommerce event
      trackQuoteFormSubmit(data);
      trackAddToCart(data);

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitStatus('success');
      setFormInteracted(false);
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
          {f.transactionType} *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="purchase"
              {...register('transactionType')}
              className="mr-2"
            />
            <span>{f.purchase}</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="rental"
              {...register('transactionType')}
              className="mr-2"
            />
            <span>{f.rental}</span>
          </label>
        </div>
        {errors.transactionType && (
          <p className="mt-1 text-sm text-red-600">{errors.transactionType.message}</p>
        )}
      </div>

      {/* Container Category */}
      <FormSelect
        label={`${f.category} *`}
        {...register('containerCategory')}
        error={errors.containerCategory?.message}
        options={[
          { value: '', label: f.select },
          { value: 'standard_cargo', label: f.standard },
          { value: 'refrigerated', label: f.refrigerated },
          { value: 'custom', label: f.custom },
        ]}
      />

      {/* Container Type (conditional) */}
      {containerCategory === 'standard_cargo' && (
        <FormSelect
          label={`${f.type} *`}
          {...register('containerType')}
          error={errors.containerType?.message}
          options={[
            { value: '', label: f.select },
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
        label={`${f.quantity} *`}
        {...register('quantity', { valueAsNumber: true })}
        error={errors.quantity?.message}
        min={1}
        max={1000}
      />


      <div className="border-t pt-6">
        <h3 className="text-lg font-display font-bold text-dark-900 mb-4">
          {f.contactInfo}
        </h3>

        <div className="space-y-4">
          {/* Full Name */}
          <FormInput
            type="text"
            label={`${f.fullName} *`}
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          {/* Company Name (optional) */}
          <FormInput
            type="text"
            label={f.company}
            {...register('companyName')}
            error={errors.companyName?.message}
          />

          {/* Phone */}
          <FormInput
            type="tel"
            label={`${f.phone} *`}
            placeholder={f.phonePlaceholder}
            {...register('phone')}
            error={errors.phone?.message}
          />

          {/* Email */}
          <FormInput
            type="email"
            label={`${f.email} *`}
            {...register('email')}
            error={errors.email?.message}
          />

          {/* Notes (optional) */}
          <FormTextarea
            label={f.notes}
            placeholder={f.notesPlaceholder}
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
        {isSubmitting ? f.submitting : f.submit}
      </Button>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✓ {f.success}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ✗ {f.error}
        </div>
      )}
    </form>
  );
}
