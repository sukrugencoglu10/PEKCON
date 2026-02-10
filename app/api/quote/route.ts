import { NextRequest, NextResponse } from 'next/server';
import { quoteFormSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate data
    const validatedData = quoteFormSchema.parse(body);

    // TODO: Implement email sending here
    // Example using Resend or SendGrid:
    // await sendEmail({
    //   to: 'info@pekcon.com.tr',
    //   subject: 'Yeni Teklif Talebi',
    //   html: generateEmailHTML(validatedData),
    // });

    console.log('Quote request received:', validatedData);

    // For now, just return success
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
