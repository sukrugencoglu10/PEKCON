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
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Edit2 } from 'lucide-react';
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
  trackFormStepTime,
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

export default function QuoteForm({
  locale = 'tr',
  onContainerTypeChange,
}: {
  locale?: Locale;
  onContainerTypeChange?: (type: ContainerType | null) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formInteracted, setFormInteracted] = useState(false);
  const abandonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFieldRef = useRef<string>('');
  const stepStartTimeRef = useRef<number>(Date.now());
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
  
  // Extend translation type strictly
  const t = getTranslations(locale);
  const f = t.quotePage.form as any; 

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset,
    getValues
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      transactionType: 'purchase',
      quantity: 1,
    },
    mode: 'onChange'
  });

  const formValues = watch();
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

  // Form abandonment + dwell time tracking
  useEffect(() => {
    const handleFocusIn = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const fieldName = target.getAttribute('name') || '';

      if (!formInteracted && fieldName) {
        setFormInteracted(true);
        trackFormStarted('quote_form');
      }

      if (fieldName) {
        lastFieldRef.current = fieldName;
        trackFormFieldFocus('quote_form', fieldName);
        fieldFocusTimeRef.current[fieldName] = Date.now();
        fieldInitialValueRef.current[fieldName] = target.value ?? '';

        if (abandonTimeoutRef.current) {
          clearTimeout(abandonTimeoutRef.current);
        }

        abandonTimeoutRef.current = setTimeout(() => {
          if (submitStatus === 'idle') {
            trackFormAbandoned('quote_form', lastFieldRef.current);
          }
        }, 60000);
      }
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
        // POST to admin analytics API (fire-and-forget)
        fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field_name: fieldName,
            dwell_ms: dwellMs,
            correction_count: correctionCount,
            step: currentStep,
            session_id: sessionIdRef.current,
          }),
        }).catch(() => null);
        delete fieldFocusTimeRef.current[fieldName];
      }
    };

    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.addEventListener('focusin', handleFocusIn);
      formElement.addEventListener('focusout', handleFocusOut);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener('focusin', handleFocusIn);
        formElement.removeEventListener('focusout', handleFocusOut);
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

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof QuoteFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ['transactionType', 'containerCategory', 'quantity'];
      if (
        containerCategory === 'standard_cargo' ||
        containerCategory === 'refrigerated' ||
        containerCategory === 'flat_rack' ||
        containerCategory === 'open_top'
      ) {
        fieldsToValidate.push('containerType');
      }
    } else if (step === 2) {
      fieldsToValidate = ['fullName', 'phone', 'email'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      const elapsed = Date.now() - stepStartTimeRef.current;
      trackFormStepTime(step, step + 1, elapsed, 'forward');
      stepStartTimeRef.current = Date.now();
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    const elapsed = Date.now() - stepStartTimeRef.current;
    trackFormStepTime(currentStep, currentStep - 1, elapsed, 'back');
    stepStartTimeRef.current = Date.now();
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    if (abandonTimeoutRef.current) {
      clearTimeout(abandonTimeoutRef.current);
    }

    try {
      // Read tracking data from localStorage (set by TrackingProvider)
      let trackingData: Record<string, string> = {};
      try {
        const raw = localStorage.getItem('site_tracking_data');
        if (raw) trackingData = JSON.parse(raw);
      } catch {}

      const payload = {
        ...data,
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

      // Meta Pixel — client-side Lead eventi (server CAPI ile deduplikasyon için aynı event_id)
      // Kritik sıra: server CAPI önce gönderildi (API route içinde), client sonra tetiklenir
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
      trackQuoteFormSubmit(data);
      trackAddToCart(data);
      trackLeadConversion(data);

      setSubmitStatus('success');
      setFormInteracted(false);
      
      // Keep success message visible for a moment then reset or redirect could happen here
      setTimeout(() => {
        reset();
        setCurrentStep(1);
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

  // Steps Configuration
  const steps = [
    { id: 1, title: f.step1 || 'Product Selection' },
    { id: 2, title: f.step2 || 'Contact Info' },
    { id: 3, title: f.step3 || 'Review' }
  ];

  /* -------------------------------------------------------------------------- */
  /*                               RENDER CONTENT                               */
  /* -------------------------------------------------------------------------- */

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

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 md:p-6">
        <div className="flex justify-between items-center mb-2 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-1/3">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id < currentStep ? <Check size={16} /> : step.id}
              </div>
              <span className={`text-[10px] sm:text-xs mt-2 font-medium text-center leading-tight px-1 ${currentStep >= step.id ? 'text-primary-700' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
          {/* Connecting Line - Precisely centered between circle centers (16.6% to 83.3%) */}
          <div className="absolute top-4 left-[16.6%] right-[16.6%] h-[2px] bg-gray-200 -z-0" />
          <div 
            className="absolute top-4 left-[16.6%] h-[2px] bg-primary-500 -z-0 transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / 2) * 66.8}%` }}
          /> 
        </div>
      </div>

      <form className="p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
        <AnimatePresence mode='wait'>
          {/* STEP 1: Product Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-3">
                  {f.transactionType} *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`
                    relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${formValues.transactionType === 'purchase' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 hover:border-primary-200'
                    }
                  `}>
                    <input
                      type="radio"
                      value="purchase"
                      {...register('transactionType')}
                      className="sr-only"
                    />
                    <span className="font-medium">{f.purchase}</span>
                  </label>
                  
                  <label className={`
                    relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${formValues.transactionType === 'rental' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 hover:border-primary-200'
                    }
                  `}>
                    <input
                      type="radio"
                      value="rental"
                      {...register('transactionType')}
                      className="sr-only"
                    />
                    <span className="font-medium">{f.rental}</span>
                  </label>
                </div>
              </div>

              <FormSelect
                label={`${f.category} *`}
                {...register('containerCategory')}
                error={errors.containerCategory?.message}
                options={[
                  { value: '', label: f.select },
                  { value: 'standard_cargo', label: f.standard },
                  { value: 'refrigerated', label: f.refrigerated },
                  { value: 'flat_rack', label: f.flat_rack },
                  { value: 'open_top', label: f.open_top },
                  { value: 'custom', label: f.custom },
                ]}
              />

              {containerCategory === 'standard_cargo' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
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
                    ]}
                  />
                </motion.div>
              )}

              {(containerCategory === 'refrigerated' || containerCategory === 'flat_rack' || containerCategory === 'open_top') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <FormSelect
                    label={`${f.type} *`}
                    {...register('containerType')}
                    error={errors.containerType?.message}
                    options={[
                      { value: '', label: f.select },
                      { value: '20', label: "20'" },
                      { value: '40', label: "40'" },
                    ]}
                  />
                </motion.div>
              )}

              <FormInput
                type="number"
                label={`${f.quantity} *`}
                {...register('quantity', { valueAsNumber: true })}
                error={errors.quantity?.message}
                min={1}
                max={1000}
              />

              <FormSelect
                label={`${f.region} *`}
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
                  { value: 'hamburg', label: 'Hamburg (Almanya)' },
                  { value: 'rotterdam', label: 'Rotterdam (Hollanda)' },
                  { value: 'antwerp', label: 'Antalya' },
                  { value: 'diger', label: 'Diğer / Belirtilmemiş' },
                ]}
              />
            </motion.div>
          )}

          {/* STEP 2: Contact Info */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  type="text"
                  label={`${f.fullName} *`}
                  {...register('fullName')}
                  error={errors.fullName?.message}
                />
                <FormInput
                  type="text"
                  label={f.company}
                  {...register('companyName')}
                  error={errors.companyName?.message}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  type="tel"
                  label={`${f.phone} *`}
                  placeholder={f.phonePlaceholder}
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <FormInput
                  type="email"
                  label={`${f.email} *`}
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <FormTextarea
                label={f.notes}
                placeholder={f.notesPlaceholder}
                {...register('notes')}
                error={errors.notes?.message}
              />
            </motion.div>
          )}

          {/* STEP 3: Summary & Review */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-display font-bold text-dark-900 border-b pb-2">
                {f.summary || 'Summary'}
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{f.transactionType}:</span>
                  <span className="font-medium text-dark-900 capitalize">{getValues('transactionType')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{f.category}:</span>
                  <span className="font-medium text-dark-900 capitalize">
                   {getValues('containerCategory')?.replace('_', ' ')}
                  </span>
                </div>
                {getValues('containerType') && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{f.type}:</span>
                    <span className="font-medium text-dark-900">{getValues('containerType')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">{f.quantity}:</span>
                  <span className="font-medium text-dark-900">{getValues('quantity')}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm">
                 <div className="flex justify-between items-start">
                  <span className="text-blue-600 font-medium">{f.fullName}:</span>
                  <span className="text-blue-900 text-right">{getValues('fullName')}</span>
                </div>
                {getValues('companyName') && (
                  <div className="flex justify-between items-start">
                    <span className="text-blue-600 font-medium">{f.company}:</span>
                    <span className="text-blue-900">{getValues('companyName')}</span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <span className="text-blue-600 font-medium">{f.phone}:</span>
                  <span className="text-blue-900">{getValues('phone')}</span>
                </div>
                 <div className="flex justify-between items-start">
                  <span className="text-blue-600 font-medium">{f.email}:</span>
                  <span className="text-blue-900 break-all ml-4">{getValues('email')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between pt-4 border-t border-gray-100">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              {f.back || 'Back'}
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => validateStep(currentStep)}
              className="ml-auto flex items-center gap-2"
            >
              {f.next || 'Next'}
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="ml-auto w-full md:w-auto min-w-[150px]"
            >
              {isSubmitting ? f.submitting : f.submit}
            </Button>
          )}
        </div>
        
        {submitStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center"
          >
            {f.error}
          </motion.div>
        )}
      </form>
    </div>
  );
}
