import type { Contact } from './send-session';

const GRAPH_SCOPES = 'https://graph.microsoft.com/Contacts.Read';

function getRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return `${base}/api/admin/contacts/callback`;
}

function getAuthority(): string {
  const tenantId = process.env.AZURE_TENANT_ID!;
  return `https://login.microsoftonline.com/${tenantId}`;
}

// Adım 1: Microsoft giriş URL'i üret
export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.AZURE_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: getRedirectUri(),
    scope: `${GRAPH_SCOPES} offline_access`,
    state,
    prompt: 'select_account',
  });
  return `${getAuthority()}/oauth2/v2.0/authorize?${params.toString()}`;
}

// Adım 2: Auth code → access token
export async function exchangeCodeForToken(code: string): Promise<string> {
  const body = new URLSearchParams({
    client_id: process.env.AZURE_CLIENT_ID!,
    client_secret: process.env.AZURE_CLIENT_SECRET!,
    code,
    redirect_uri: getRedirectUri(),
    grant_type: 'authorization_code',
  });

  const response = await fetch(`${getAuthority()}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token alınamadı: ${response.status} - ${error}`);
  }

  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error('Access token bulunamadı.');
  return data.access_token;
}

// Adım 3: Graph API ile tüm kişileri çek (pagination destekli)
export async function fetchOutlookContacts(accessToken: string): Promise<Contact[]> {
  const contacts: Contact[] = [];
  let url: string | null =
    'https://graph.microsoft.com/v1.0/me/contacts?$select=displayName,emailAddresses&$top=100';

  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Graph API hatası: ${response.status} - ${error}`);
    }

    const data = await response.json() as {
      value: Array<{
        displayName: string;
        emailAddresses: Array<{ address: string }>;
      }>;
      '@odata.nextLink'?: string;
    };

    for (const contact of data.value) {
      const email = contact.emailAddresses?.[0]?.address;
      if (email && email.includes('@')) {
        contacts.push({
          email: email.toLowerCase().trim(),
          displayName: contact.displayName || email,
        });
      }
    }

    url = data['@odata.nextLink'] ?? null;
  }

  // E-posta adresine göre tekilleştir
  const seen = new Set<string>();
  return contacts.filter((c) => {
    if (seen.has(c.email)) return false;
    seen.add(c.email);
    return true;
  });
}
