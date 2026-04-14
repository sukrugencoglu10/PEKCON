/**
 * Google Tag / Google Ads Tracking Library
 * Centralized event tracking for PEKCON website
 */

// Base tracking function (dataLayer + gtag)
export const trackEvent = (event: string, data: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;

  // Push to dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  // Also fire via gtag for GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, data);
  }
};

// Lead form conversion — Google Ads conversion event
export const trackLeadConversion = (formData: QuoteFormData) => {
  trackEvent('generate_lead', {
    currency: 'TRY',
    value: estimateLeadValue(formData),
    method: 'quote_form',
    lead_type: 'quote_request',
    container_type: formData.containerType,
    user_segment: formData.companyName ? 'B2B' : 'B2C',
  });
};

// WhatsApp conversion — Google Ads conversion event
export const trackWhatsAppConversion = (locale: string) => {
  if (typeof window === 'undefined') return;

  // GA4 + Google Ads: generate_lead event
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      currency: 'TRY',
      method: 'whatsapp',
      locale,
    });
  }

  // DataLayer fallback
  trackEvent('whatsapp_click', {
    cta_location: 'floating_button',
    method: 'whatsapp',
    locale,
  });
};

// Form Tracking Events
export interface QuoteFormData {
  transactionType: string;
  containerCategory: string;
  containerType?: string;
  quantity: number;
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  companyName?: string;
  notes?: string;
}

export const estimateLeadValue = (formData: QuoteFormData): number => {
  // Estimate lead value based on container type and quantity
  const baseValues: Record<string, number> = {
    '20DC': 1500,
    '40DC': 2500,
    '40HC': 2800,
    '20OT': 2200,
    '20FR': 2000,
    '40RF': 4500,
    '40OT': 3200,
    '40FR': 3000,
    '45HC': 3200,
  };

  const baseValue = formData.containerType ? baseValues[formData.containerType] || 2000 : 2000;
  return baseValue * formData.quantity;
};

export const trackQuoteFormSubmit = (formData: QuoteFormData) => {
  // Split fullName into first and last name for Enhanced Conversions
  const nameParts = formData.fullName?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const userSegment = formData.companyName ? 'B2B' : 'B2C';

  trackEvent('form_submit', {
    form_name: 'quote_form',
    lead_type: 'quote_request',
    form_type: formData.transactionType,
    container_category: formData.containerCategory,
    container_type: formData.containerType,
    quantity: formData.quantity,
    estimated_value: estimateLeadValue(formData),
    user_segment: userSegment,
    // Enhanced Conversions Data
    email: formData.email,
    phone: formData.phone,
    first_name: firstName,
    last_name: lastName,
  });
};

export const trackQuickQuoteSubmit = (input: string) => {
  const isEmail = input.includes('@');
  const isPhone = /^[\d\s\+\-\(\)]+$/.test(input);

  trackEvent('quick_lead_submit', {
    form_name: 'hero_quick_quote',
    input_type: isEmail ? 'email' : isPhone ? 'phone' : 'other',
    input_length: input.length,
  });
};

export const trackFormError = (formName: string, field: string, error: string) => {
  trackEvent('form_error', {
    form_name: formName,
    field_name: field,
    error_message: error,
  });
};

export const trackFormFieldFocus = (formName: string, field: string) => {
  trackEvent('form_field_focus', {
    form_name: formName,
    field_name: field,
  });
};

export const trackFormStarted = (formName: string) => {
  trackEvent('form_started', {
    form_name: formName,
  });
};

export const trackFormAbandoned = (formName: string, lastField?: string) => {
  trackEvent('form_abandoned', {
    form_name: formName,
    last_field: lastField,
    page_location: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: new Date().toISOString(),
  });
};

// Interaction Tracking Events
export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: location,
  });
};

export const trackLanguageSwitch = (fromLang: string, toLang: string) => {
  trackEvent('language_switch', {
    from_language: fromLang,
    to_language: toLang,
  });
};

// Enhanced Ecommerce Events (GA4 Format)
export const trackViewItem = (containerType: string, containerCategory: string) => {
  trackEvent('view_item', {
    currency: 'TRY',
    items: [
      {
        item_id: containerType,
        item_name: `Container ${containerType}`,
        item_category: containerCategory,
      },
    ],
  });
};

export const trackAddToCart = (formData: QuoteFormData) => {
  trackEvent('add_to_cart', {
    currency: 'TRY',
    value: estimateLeadValue(formData),
    items: [
      {
        item_id: formData.containerType || 'unknown',
        item_name: `Container ${formData.containerType || 'unknown'}`,
        item_category: formData.containerCategory,
        quantity: formData.quantity,
      },
    ],
  });
};

export const trackBeginCheckout = (containerType?: string) => {
  trackEvent('begin_checkout', {
    currency: 'TRY',
    ...(containerType && {
      items: [
        {
          item_id: containerType,
          item_name: `Container ${containerType}`,
        },
      ],
    }),
  });
};

// 3D Model Interaction Tracking
export const track3DInteraction = (
  containerType: string,
  action: 'drag_end' | 'type_view',
  data: { drag_duration_ms?: number; rotation_delta?: number; view_duration_ms?: number }
) => {
  trackEvent('container_3d_interaction', {
    container_type: containerType,
    action,
    ...data,
  });
};

// Form Field Dwell Time
export const trackFormFieldDwell = (
  formName: string,
  fieldName: string,
  dwellMs: number,
  correctionCount: number
) => {
  trackEvent('form_field_dwell', {
    form_name: formName,
    field_name: fieldName,
    dwell_ms: dwellMs,
    correction_count: correctionCount,
  });
};

// Form Step Transition Timing
export const trackFormStepTime = (
  fromStep: number,
  toStep: number,
  stepDurationMs: number,
  direction: 'forward' | 'back'
) => {
  trackEvent('form_step_time', {
    form_name: 'quote_form',
    from_step: fromStep,
    to_step: toStep,
    step_duration_ms: stepDurationMs,
    direction,
  });
};

// Sticky Bar Events
export const trackStickyBarEvent = (
  action: 'impression' | 'cta_click' | 'dismiss',
  locale: string
) => {
  trackEvent('sticky_bar_event', {
    action,
    locale,
  });
};

// Scroll Depth Tracking
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    scroll_percentage: percentage,
    page_location: typeof window !== 'undefined' ? window.location.pathname : '',
  });
};
