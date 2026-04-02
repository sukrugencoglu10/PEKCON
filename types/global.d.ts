export {};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
    fbq: (
      action: string,
      eventName: string,
      data?: Record<string, any>,
      options?: { eventID?: string }
    ) => void;
  }
}
