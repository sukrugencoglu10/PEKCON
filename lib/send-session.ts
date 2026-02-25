export interface StockRow {
  country: string;
  location: string;
  containers: Record<string, number>; // { "40HC CW": 124, "20DC CW": 40, ... }
}

export interface Contact {
  email: string;
  displayName: string;
}

export type SendStatus = 'idle' | 'sending' | 'done' | 'error';

export interface SendSession {
  id: string;
  stock: StockRow[];
  containerTypes: string[]; // ["40HC CW", "20DC CW", ...]
  contacts: Contact[];
  status: SendStatus;
  totalCount: number;
  sentCount: number;
  failedEmails: string[];
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
}

// globalThis kullanarak hot-reload'da session verisinin kaybolmasını önle
// (Next.js dev modunda modüller hot-reload'da yeniden değerlendirilebilir)
const g = globalThis as typeof globalThis & { __pekconSessions?: Map<string, SendSession> };
if (!g.__pekconSessions) g.__pekconSessions = new Map();
const sessions = g.__pekconSessions;

export function createSession(id: string): SendSession {
  const session: SendSession = {
    id,
    stock: [],
    containerTypes: [],
    contacts: [],
    status: 'idle',
    totalCount: 0,
    sentCount: 0,
    failedEmails: [],
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id: string): SendSession | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<SendSession>): void {
  const existing = sessions.get(id);
  if (existing) {
    sessions.set(id, { ...existing, ...updates });
  }
}

export function deleteSession(id: string): void {
  sessions.delete(id);
}

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
