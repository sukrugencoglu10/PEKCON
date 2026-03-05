import { NextRequest, NextResponse } from 'next/server';
import { quoteFormSchema } from '@/lib/validators';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT_EMAIL = 'info@pekcon.com.tr';
const FROM_EMAIL = 'teklif@pekcon.com';

function buildEmailHtml(data: {
  transactionType: string;
  containerCategory: string;
  containerType?: string;
  quantity: number;
  fullName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  notes?: string;
}) {
  const typeLabel = data.transactionType === 'purchase' ? 'Satın Alma' : 'Kiralama';
  const categoryMap: Record<string, string> = {
    standard_cargo: 'Standart Yük',
    refrigerated: 'Soğutmalı',
    custom: 'Özel',
  };
  const categoryLabel = categoryMap[data.containerCategory] ?? data.containerCategory;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Yeni Teklif Talebi</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0069b4;padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">
                🚢 Yeni Teklif Talebi
              </h1>
              <p style="margin:6px 0 0;color:#cce4f7;font-size:14px;">
                pekcon.com üzerinden gönderildi
              </p>
            </td>
          </tr>

          <!-- Konteyner Bilgileri -->
          <tr>
            <td style="padding:28px 32px 0;">
              <h2 style="margin:0 0 16px;color:#1a2e44;font-size:16px;border-bottom:2px solid #e8eef4;padding-bottom:8px;">
                📦 Konteyner Bilgileri
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;color:#6b7a8d;font-size:14px;width:40%;">İşlem Türü</td>
                  <td style="padding:6px 0;color:#1a2e44;font-size:14px;font-weight:600;">${typeLabel}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7a8d;font-size:14px;">Kategori</td>
                  <td style="padding:6px 0;color:#1a2e44;font-size:14px;font-weight:600;">${categoryLabel}</td>
                </tr>
                ${data.containerType ? `
                <tr>
                  <td style="padding:6px 0;color:#6b7a8d;font-size:14px;">Konteyner Tipi</td>
                  <td style="padding:6px 0;color:#1a2e44;font-size:14px;font-weight:600;">${data.containerType}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:6px 0;color:#6b7a8d;font-size:14px;">Miktar</td>
                  <td style="padding:6px 0;color:#0069b4;font-size:18px;font-weight:700;">${data.quantity} adet</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Müşteri Bilgileri -->
          <tr>
            <td style="padding:24px 32px 0;">
              <h2 style="margin:0 0 16px;color:#1a2e44;font-size:16px;border-bottom:2px solid #e8eef4;padding-bottom:8px;">
                👤 Müşteri Bilgileri
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${data.fullName ? `
                <tr>
                  <td style="padding:6px 0;color:#6b7a8d;font-size:14px;width:40%;">Ad Soyad</td>
                  <td style="padding:6px 0;color:#1a2e44;font-size:14px;font-weight:600;">${data.fullName}</td>
                </tr>` : ''}
                ${data.companyName ? `
                <tr>
                  <td style="padding:6px 0;color:#6b7a8d;font-size:14px;">Şirket</td>
                  <td style="padding:6px 0;color:#1a2e44;font-size:14px;font-weight:600;">${data.companyName}</td>
                </tr>` : ''}
                ${data.phone ? `
                <tr>
                  <td style="padding:6px 0;color:#6b7a8d;font-size:14px;">Telefon</td>
                  <td style="padding:6px 0;">
                    <a href="tel:${data.phone}" style="color:#0069b4;font-size:14px;font-weight:600;text-decoration:none;">${data.phone}</a>
                  </td>
                </tr>` : ''}
                ${data.email ? `
                <tr>
                  <td style="padding:6px 0;color:#6b7a8d;font-size:14px;">E-posta</td>
                  <td style="padding:6px 0;">
                    <a href="mailto:${data.email}" style="color:#0069b4;font-size:14px;font-weight:600;text-decoration:none;">${data.email}</a>
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          <!-- Notlar -->
          ${data.notes ? `
          <tr>
            <td style="padding:24px 32px 0;">
              <h2 style="margin:0 0 12px;color:#1a2e44;font-size:16px;border-bottom:2px solid #e8eef4;padding-bottom:8px;">
                📝 Notlar
              </h2>
              <p style="margin:0;color:#4a5568;font-size:14px;line-height:1.6;background:#f8fafc;padding:14px;border-radius:8px;border-left:4px solid #0069b4;">
                ${data.notes}
              </p>
            </td>
          </tr>` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding:28px 32px;text-align:center;">
              <a href="mailto:${data.email ?? ''}" style="display:inline-block;background:#0069b4;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;margin-right:8px;">
                ✉️ Müşteriye Yanıtla
              </a>
              ${data.phone ? `
              <a href="tel:${data.phone}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
                📞 Hemen Ara
              </a>` : ''}
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e8eef4;">
              <p style="margin:0;color:#9aa5b4;font-size:12px;">
                PEKCON Container &amp; Logistics — pekcon.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = quoteFormSchema.parse(body);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: RECIPIENT_EMAIL,
      subject: `Yeni Teklif Talebi — ${validatedData.fullName ?? 'Misafir'} | ${validatedData.quantity} adet`,
      html: buildEmailHtml(validatedData),
      replyTo: validatedData.email,
    });

    return NextResponse.json(
      { success: true, message: 'Quote request received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Quote API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
