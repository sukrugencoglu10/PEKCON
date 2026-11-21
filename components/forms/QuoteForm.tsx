'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteFormSchema, QuoteFormData } from '@/lib/validators';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import Button from '../ui/Button';
import { getTranslations, type Locale } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import type { ContainerType } from '@/components/home/KonteynerScene';
import {
  trackQuoteFormSubmit,
  trackLeadConversion,
  trackFormFieldFocus,
  trackFormError,
  trackFormStarted,
  trackFormAbandoned,
  trackAddToCart,
  trackFormFieldDwell,
} from '@/lib/gtm';

const FORM_TO_SCENE_TYPE: Record<string, Record<string, ContainerType>> = {
  standard_cargo: {
    '20DC': '20dc',
    '40DC': '40dc',
    '40HC': '40hc',
    '45HC': '45hc',
  },
  refrigerated: {
    '20': '20rf',
    '40': '40rf',
  },
  flat_rack: {
    '20': '20fr',
    '40': '40fr',
  },
  open_top: {
    '20': '20ot',
    '40': '40ot',
  },
};

// Konteyner penceresinden gelen ?tip= değerleri (ör. /tr/teklif-al?tip=40HC)
const PREFILL_STANDARD_TYPES = new Set(['20DC', '40DC', '40HC', '45HC']);

const VALID_PHONE = /^\+90[0-9]{10}$/;

function readTrackingData(): Record<string, string> {
  try {
    const raw = localStorage.getItem('site_tracking_data');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Sayfa kapanırken de gitmesi gereken istekler için (sendBeacon, yoksa keepalive fetch). */
function sendOnExit(url: string, payload: unknown) {
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
      if (ok) return;
    }
  } catch {}
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

export default function QuoteForm({
  locale = 'tr',
  onContainerTypeChange,
}: {
  locale?: Locale;
  onContainerTypeChange?: (type: ContainerType | null) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showDetails, setShowDetails] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const formTopRef = useRef<HTMLDivElement | null>(null);

  // Form oturumu durumu (closure'larda bayat kalmaması için ref)
  const interactedRef = useRef(false);
  const submittedRef = useRef(false);
  const exitHandledRef = useRef(false);
  const lastFieldRef = useRef<string>('');
  const fieldFocusTimeRef = useRef<Record<string, number>>({});
  const fieldInitialValueRef = useRef<Record<string, string>>({});
  // Stable session ID for correlating events in the analytics API
  const sessionIdRef = useRef<string>(
    typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  );
  // Unique event ID for Meta CAPI / GA4 deduplication (client + server aynı ID'yi kullanır)
  const eventIdRef = useRef<string>(
    typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  );

  const t = getTranslations(locale);
  const f = t.quotePage.form as any;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      transactionType: 'purchase',
      containerCategory: 'standard_cargo',
      quantity: 1,
      phone: '+90',
      email: '',
    },
    mode: 'onTouched',
  });

  const containerCategory = watch('containerCategory');
  const containerTypeValue = watch('containerType');

  // Sync selected container type with parent (3D scene)
  useEffect(() => {
    const categoryMap = FORM_TO_SCENE_TYPE[containerCategory];
    if (!categoryMap) {
      onContainerTypeChange?.(null);
      return;
    }
    const mapped = containerTypeValue ? categoryMap[containerTypeValue] ?? null : null;
    onContainerTypeChange?.(mapped);
  }, [containerTypeValue, containerCategory, onContainerTypeChange]);

  // Konteyner penceresinden seçilen tipi forma önceden doldur (?tip=40HC)
  useEffect(() => {
    try {
      const tip = new URLSearchParams(window.location.search).get('tip')?.toUpperCase();
      if (tip && PREFILL_STANDARD_TYPES.has(tip)) {
        setValue('containerCategory', 'standard_cargo');
        setValue('containerType', tip);
      }
    } catch {}
  }, [setValue]);

  /**
   * Kullanıcı formu göndermeden sayfadan ayrılırsa (sekme kapanır, başka uygulamaya geçer,
   * sayfa değişir): bir kez "form bırakıldı" kaydı at; telefon geçerliyse yarım lead'i kaydet.
   */
  const handleExit = useCallback(() => {
    if (exitHandledRef.current || submittedRef.current || !interactedRef.current) return;
    exitHandledRef.current = true;

    const values = getValues();
    const tracking = readTrackingData();

    trackFormAbandoned('quote_form', lastFieldRef.current);

    sendOnExit('/api/analytics/conversion', {
      type: 'form_abandon',
      utm_source: tracking.utmSource,
      utm_medium: tracking.utmMedium,
      utm_campaign: tracking.utmCampaign,
      utm_term: tracking.utmTerm,
      gclid: tracking.gclid,
      fbclid: tracking.fbclid,
      original_referrer: tracking.originalReferrer,
      page_url: window.location.href,
    });

    if (VALID_PHONE.test(values.phone ?? '')) {
      sendOnExit('/api/quote/partial', {
        phone: values.phone,
        fullName: values.fullName || undefined,
        containerCategory: values.containerCategory || undefined,
        containerType: values.containerType || undefined,
        quantity: Number(values.quantity) || undefined,
        gclid: tracking.gclid || undefined,
      });
    }
  }, [getValues]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') handleExit();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', handleExit);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', handleExit);
      // Site içi sayfa değişiminde (bileşen kaldırılırken) de say
      handleExit();
    };
  }, [handleExit]);

  // Alan odak / bekleme süresi takibi — yalnızca bu formun kendi <form> öğesine bağlanır
  useEffect(() => {
    const formElement = formRef.current;
    if (!formElement) return;

    const handleFocusIn = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const fieldName = target.getAttribute('name') || '';
      if (!fieldName) return;

      if (!interactedRef.current) {
        interactedRef.current = true;
        exitHandledRef.current = false;
        trackFormStarted('quote_form');
      }

      lastFieldRef.current = fieldName;
      trackFormFieldFocus('quote_form', fieldName);
      fieldFocusTimeRef.current[fieldName] = Date.now();
      fieldInitialValueRef.current[fieldName] = target.value ?? '';
    };

    const handleFocusOut = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const fieldName = target.getAttribute('name') || '';

      if (fieldName && fieldFocusTimeRef.current[fieldName]) {
        const dwellMs = Date.now() - fieldFocusTimeRef.current[fieldName];
        const correctionCount =
          fieldInitialValueRef.current[fieldName] !== undefined &&
          fieldInitialValueRef.current[fieldName] !== '' &&
          (target.value ?? '') !== fieldInitialValueRef.current[fieldName]
            ? 1
            : 0;
        trackFormFieldDwell('quote_form', fieldName, dwellMs, correctionCount);
        fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field_name: fieldName,
            dwell_ms: dwellMs,
            correction_count: correctionCount,
            step: 1,
            session_id: sessionIdRef.current,
          }),
        }).catch(() => null);
        delete fieldFocusTimeRef.current[fieldName];
      }
    };

    formElement.addEventListener('focusin', handleFocusIn);
    formElement.addEventListener('focusout', handleFocusOut);
    return () => {
      formElement.removeEventListener('focusin', handleFocusIn);
      formElement.removeEventListener('focusout', handleFocusOut);
    };
  }, [submitStatus]);

  // Track form errors
  useEffect(() => {
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        trackFormError('quote_form', field, error.message as string);
      }
    });
  }, [errors]);

  // İsteğe bağlı alanlarda hata varsa (ör. hatalı e-posta) bölümü açık göster
  useEffect(() => {
    if (errors.email || errors.companyName || errors.notes || errors.region) setShowDetails(true);
  }, [errors.email, errors.companyName, errors.notes, errors.region]);

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    try {
      const trackingData = readTrackingData();

      const payload = {
        ...data,
        email: data.email?.trim() || undefined,
        utmSource: trackingData.utmSource,
        utmMedium: trackingData.utmMedium,
        utmCampaign: trackingData.utmCampaign,
        utmTerm: trackingData.utmTerm,
        gclid: trackingData.gclid,
        originalReferrer: trackingData.originalReferrer,
        fbclid: trackingData.fbclid,   // Meta _fbc için
        event_id: eventIdRef.current,  // CAPI / GA4 deduplikasyon ID'si
      };

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Submission failed');

      submittedRef.current = true;

      // Meta Pixel — client-side Lead eventi (server CAPI ile deduplikasyon için aynı event_id)
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq(
          'track',
          'Lead',
          {
            currency: 'TRY',
            value: data.quantity * 2000, // Tahmini değer — CAPI ile aynı mantık
            content_category: data.containerCategory,
            content_name: data.containerType ?? 'unknown',
          },
          { eventID: eventIdRef.current }
        );
      }

      // Fire tracking only after successful submission
      const trackingPayload = { ...data, email: payload.email };
      trackQuoteFormSubmit(trackingPayload);
      trackAddToCart(trackingPayload);
      trackLeadConversion(trackingPayload);

      setSubmitStatus('success');

      // Başarı mesajından sonra formu yeni bir oturum olarak sıfırla
      setTimeout(() => {
        reset();
        setShowDetails(false);
        interactedRef.current = false;
        submittedRef.current = false;
        exitHandledRef.current = false;
        eventIdRef.current =
          typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2);
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-green-50 border border-green-200 rounded-xl text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-display font-bold text-green-800 mb-2">
          {f.success}
        </h3>
        <p className="text-green-700">
          {t.quotePage.subtitle}
        </p>
      </motion.div>
    );
  }

  const phoneRegistration = register('phone');

  return (
    <div ref={formTopRef} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <form
        ref={formRef}
        className="p-6 md:p-8 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Yalnızca satın alma hizmeti verildiği için tek seçenek: tam genişlik ve her zaman seçili */}
        <label className="relative flex w-full items-center justify-center p-4 border-2 rounded-xl border-primary-500 bg-primary-50 text-primary-700 cursor-default">
          <input
            type="radio"
            value="purchase"
            {...register('transactionType')}
            className="sr-only"
          />
          <span className="font-medium">{f.purchase}</span>
        </label>

        {/* İletişim bilgileri en başta: en değerli bilgi önce alınır */}
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput
            type="text"
            label={`${f.fullName} *`}
            autoComplete="name"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
          <FormInput
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            label={`${f.phone} *`}
            placeholder="+90 5XX XXX XX XX"
            {...phoneRegistration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let val = e.target.value;
              if (!val.startsWith('+90')) val = '+90';
              const digits = val.slice(3).replace(/[^0-9]/g, '').slice(0, 10);
              e.target.value = '+90' + digits;
              phoneRegistration.onChange(e);
            }}
            error={errors.phone?.message}
          />
        </div>

        <FormSelect
          label={`${f.category} *`}
          {...register('containerCategory')}
          error={errors.containerCategory?.message}
          options={[
            { value: 'standard_cargo', label: f.standard },
            { value: 'refrigerated', label: f.refrigerated },
            { value: 'flat_rack', label: f.flat_rack },
            { value: 'open_top', label: f.open_top },
            { value: 'custom', label: f.custom },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          {containerCategory === 'standard_cargo' && (
            <FormSelect
              label={f.type}
              className="h-12 py-0"
              {...register('containerType')}
              error={errors.containerType?.message}
              options={[
                { value: '', label: f.select },
                { value: '20DC', label: "20' DC" },
                { value: '40DC', label: "40' DC" },
                { value: '40HC', label: "40' HC" },
                { value: '45HC', label: "45' HC" },
              ]}
            />
          )}

          {(containerCategory === 'refrigerated' ||
            containerCategory === 'flat_rack' ||
            containerCategory === 'open_top') && (
            <FormSelect
              label={f.type}
              className="h-12 py-0"
              {...register('containerType')}
              error={errors.containerType?.message}
              options={[
                { value: '', label: f.select },
                { value: '20', label: "20'" },
                { value: '40', label: "40'" },
              ]}
            />
          )}

          {containerCategory === 'custom' && <div />}

          <FormInput
            type="number"
            inputMode="numeric"
            className="h-12 py-0"
            label={`${f.quantity} *`}
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
            min={1}
            max={1000}
          />
        </div>

        {/* İsteğe bağlı ek bilgiler */}
        <div className="border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="flex w-full items-center justify-between text-sm font-medium text-primary-700 hover:text-primary-800"
            aria-expanded={showDetails}
          >
            {showDetails ? f.hideDetails : f.optionalDetails}
            <ChevronDown
              size={18}
              className={`transition-transform ${showDetails ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {showDetails && (
              <motion.div
                key="details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormInput
                      type="email"
                      autoComplete="email"
                      label={`${f.email} (${f.optional})`}
                      {...register('email')}
                      error={errors.email?.message}
                    />
                    <FormInput
                      type="text"
                      autoComplete="organization"
                      label={`${f.company} (${f.optional})`}
                      {...register('companyName')}
                      error={errors.companyName?.message}
                    />
                  </div>

                  <FormSelect
                    label={`${f.region} (${f.optional})`}
                    {...register('region')}
                    error={errors.region?.message}
                    options={[
                      { value: '', label: f.select },
                      { value: 'istanbul_avrupa', label: 'İstanbul (Avrupa)' },
                      { value: 'istanbul_anadolu', label: 'İstanbul (Anadolu)' },
                      { value: 'kocaeli_gebze', label: 'Kocaeli (Gebze)' },
                      { value: 'izmir_aliaga', label: 'İzmir (Aliağa)' },
                      { value: 'mersin', label: 'Mersin' },
                      { value: 'gemlik', label: 'Bursa (Gemlik)' },
                      { value: 'iskenderun', label: 'İskenderun' },
                      { value: 'samsun', label: 'Samsun' },
                      { value: 'antalya', label: 'Antalya' },
                      { value: 'hamburg', label: 'Hamburg (Almanya)' },
                      { value: 'rotterdam', label: 'Rotterdam (Hollanda)' },
                      { value: 'diger', label: 'Diğer / Belirtilmemiş' },
                    ]}
                  />

                  <FormTextarea
                    label={`${f.notes} (${f.optional})`}
                    placeholder={f.notesPlaceholder}
                    {...register('notes')}
                    error={errors.notes?.message}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? f.submitting : f.submit}
        </Button>

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center"
          >
            {f.error}
          </motion.div>
        )}
      </form>
    </div>
  );
}
