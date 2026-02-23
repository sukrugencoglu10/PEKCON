import nodemailer, { type Transporter } from 'nodemailer';
import type { StockRow } from './send-session';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cell(val: number): string {
  if (val === 0) return '<span style="color:#94a3b8;">–</span>';
  return `<strong style="color:#0069b4;">${val}</strong>`;
}

function generateStockTable(stock: StockRow[]): string {
  if (stock.length === 0) return '';

  // Konteyner tiplerini ilk satırdan türet
  const types = Object.keys(stock[0].containers);

  const headerCells = types
    .map(
      (t) =>
        `<th style="padding:8px 10px;text-align:center;font-size:11px;color:#ffffff;
                    font-weight:600;text-transform:uppercase;letter-spacing:0.3px;
                    white-space:nowrap;border-right:1px solid #1e6fa3;">
           ${escapeHtml(t)}
         </th>`
    )
    .join('');

  const bodyRows = stock
    .map(
      (row, idx) => `
      <tr style="background-color:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding:7px 12px;font-size:12px;font-weight:600;color:#334155;
                   border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;
                   white-space:nowrap;">${escapeHtml(row.country)}</td>
        <td style="padding:7px 12px;font-size:12px;color:#475569;
                   border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;
                   white-space:nowrap;">${escapeHtml(row.location)}</td>
        ${types
          .map(
            (t) =>
              `<td style="padding:7px 10px;text-align:center;font-size:12px;
                          border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
                 ${cell(row.containers[t] ?? 0)}
               </td>`
          )
          .join('')}
      </tr>`
    )
    .join('');

  return `
  <table width="100%" cellpadding="0" cellspacing="0"
         style="border-collapse:collapse;border:1px solid #e2e8f0;overflow:hidden;
                font-size:12px;margin-bottom:28px;">
    <thead>
      <tr style="background-color:#0069b4;">
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#ffffff;
                   font-weight:600;text-transform:uppercase;letter-spacing:0.3px;
                   border-right:1px solid #1e6fa3;white-space:nowrap;">Ülke</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#ffffff;
                   font-weight:600;text-transform:uppercase;letter-spacing:0.3px;
                   border-right:1px solid #1e6fa3;white-space:nowrap;">Lokasyon</th>
        ${headerCells}
      </tr>
    </thead>
    <tbody>${bodyRows}</tbody>
  </table>`;
}

export function generateEmailHtml(stock: StockRow[], recipientName?: string): string {
  const today = new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const greeting = recipientName
    ? `Sayın ${escapeHtml(recipientName)},`
    : 'Değerli İş Ortağımız,';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://pekcon.com';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>PEKCON Konteyner Stok Listesi</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="700" cellpadding="0" cellspacing="0"
               style="max-width:700px;background-color:#ffffff;border-radius:8px;
                      overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0069b4 0%,#004f8a 100%);padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:2px;">PEKCON</div>
                    <div style="font-size:11px;color:#93c5fd;letter-spacing:1px;margin-top:2px;text-transform:uppercase;">
                      Container &amp; Logistics
                    </div>
                  </td>
                  <td align="right">
                    <div style="font-size:12px;color:#bfdbfe;">${today}</div>
                    <div style="font-size:12px;color:#bfdbfe;margin-top:2px;">Stok Güncellemesi</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px 20px;">
              <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">${greeting}</p>
              <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
                Mevcut konteyner stoğumuzu bilginize sunmak istiyoruz.
                Aşağıdaki tabloda güncel stok durumumuzu görebilirsiniz.
              </p>

              ${generateStockTable(stock)}

              <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.6;">
                Talep ve teklifleriniz için bizimle iletişime geçmekten lütfen çekinmeyiniz.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="background-color:#aa1917;border-radius:6px;">
                    <a href="${baseUrl}/tr/teklif-al"
                       style="display:inline-block;padding:12px 28px;font-size:14px;
                              font-weight:700;color:#ffffff;text-decoration:none;">
                      Teklif Al
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1e293b;padding:20px 36px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
                <strong style="color:#cbd5e1;">PEKCON Denizcilik Konteyner ve Lojistik</strong><br>
                Dap Vadi, Merkez Mh. Seçkin Sokak No:2-4A, Z Ofis Kat:172 — 34406 Kağıthane / İstanbul<br>
                <a href="mailto:${process.env.SMTP_USER}" style="color:#60a5fa;text-decoration:none;">${process.env.SMTP_USER}</a>
                &nbsp;|&nbsp;
                <a href="${baseUrl}" style="color:#60a5fa;text-decoration:none;">pekcon.com</a>
              </p>
              <p style="margin:12px 0 0;font-size:10px;color:#64748b;line-height:1.5;">
                Bu e-posta PEKCON Denizcilik Konteyner ve Lojistik tarafından gönderilmiştir.
                Aboneliğinizi iptal etmek için
                <a href="mailto:${process.env.SMTP_USER}?subject=Abonelik İptali" style="color:#64748b;">buraya tıklayın</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendSingleEmail(
  to: string,
  displayName: string,
  stock: StockRow[]
): Promise<void> {
  const transport = getTransporter();
  const html = generateEmailHtml(stock, displayName);

  const textLines = stock.map(
    (r) =>
      `${r.country} / ${r.location}: ` +
      Object.entries(r.containers)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')
  );

  await transport.sendMail({
    from: `"${process.env.SMTP_FROM_NAME ?? 'PEKCON'}" <${process.env.SMTP_USER}>`,
    to: `"${displayName}" <${to}>`,
    subject: 'PEKCON – Güncel Konteyner Stok Listesi',
    html,
    text: `PEKCON Konteyner Stok Listesi\n\n${textLines.join('\n')}\n\nTeklif için: ${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://pekcon.com'}/tr/teklif-al`,
  });
}

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
