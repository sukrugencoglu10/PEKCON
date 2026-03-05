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
import {
  trackQuoteFormSubmit,
  trackLeadConversion,
  trackFormFieldFocus,
  trackFormError,
  trackFormStarted,
  trackFormAbandoned,
  trackAddToCart,
} from '@/lib/gtm';

export default function QuoteForm({ locale = 'tr' }: { locale?: Locale }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formInteracted, setFormInteracted] = useState(false);
  const abandonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFieldRef = useRef<string>('');
  
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

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof QuoteFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ['transactionType', 'containerCategory', 'quantity'];
      if (containerCategory === 'standard_cargo') {
        fieldsToValidate.push('containerType');
      }
    } else if (step === 2) {
      fieldsToValidate = ['fullName', 'phone', 'email'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    if (abandonTimeoutRef.current) {
      clearTimeout(abandonTimeoutRef.current);
    }

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Submission failed');

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
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
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
              <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-primary-700' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
          {/* Connecting Line */}
          <div className="absolute top-[45px] left-0 right-0 h-[2px] bg-gray-200 -z-0 mx-10 sm:mx-20" />
          <div 
            className="absolute top-[45px] left-0 h-[2px] bg-primary-500 -z-0 mx-10 sm:mx-20 transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / 2) * (100 - ((typeof window !== 'undefined' ? window.innerWidth : 1024) < 640 ? 40 : 20))}%` }}
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
                      { value: '20OT', label: "20' OT (Open Top)" },
                      { value: '40OT', label: "40' OT (Open Top)" },
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

              <FormInput
                type="text"
                label={f.region}
                placeholder={f.regionPlaceholder}
                {...register('region')}
                error={errors.region?.message}
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
