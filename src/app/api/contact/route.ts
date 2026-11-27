import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';
import { escapeHtml, sendBrevoEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rate = checkRateLimit(`contact:${ip}`, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check your input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const supportEmail = process.env.BREVO_SENDER_EMAIL;

    if (supportEmail && process.env.BREVO_API_KEY && !process.env.BREVO_API_KEY.startsWith('your-')) {
      await sendBrevoEmail({
        to: [{ email: supportEmail, name: 'iLoveShare Support' }],
        subject: `[iLoveShare Contact] ${subject}`,
        htmlContent: `
          <h3>New Contact Form Message</h3>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
        `,
        replyTo: { email, name },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will reply within 24 hours.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
