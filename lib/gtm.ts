/**
 * Google Tag Manager (GTM) Tracking Library
 * Centralized event tracking for PEKCON website
 */

// Base tracking function
export const trackEvent = (event: string, data: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }
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
  trackEvent('form_submit', {
    form_name: 'quote_form',
    form_type: formData.transactionType,
    container_category: formData.containerCategory,
    container_type: formData.containerType,
    quantity: formData.quantity,
    estimated_value: estimateLeadValue(formData),
    has_company: !!formData.company,
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

// Scroll Depth Tracking
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    scroll_percentage: percentage,
    page_location: typeof window !== 'undefined' ? window.location.pathname : '',
  });
};
