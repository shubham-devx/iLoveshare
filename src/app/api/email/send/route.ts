import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { escapeHtml, sendBrevoEmail } from '@/lib/brevo';
import { absoluteUrl } from '@/lib/utils';

const sendExperienceEmailSchema = z.object({
  experienceId: z.string().uuid('Invalid experience ID'),
  recipientEmail: z.string().email('Please enter a valid recipient email'),
  recipientName: z.string().min(1).max(100).optional(),
  personalNote: z.string().max(500).optional(),
});

/**
 * POST /api/email/send
 * Allows an authenticated experience owner to send their published surprise link via Brevo.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rate = checkRateLimit(`email-send:${user.id}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many email requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = sendExperienceEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { experienceId, recipientEmail, recipientName, personalNote } = parsed.data;

    // Verify ownership and published status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: experience } = (await (supabase.from('experiences') as any)
      .select('id, user_id, title, sender_name, recipient_name, token, status, is_deleted')
      .eq('id', experienceId)
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .single()) as {
      data: {
        id: string;
        user_id: string;
        title: string;
        sender_name: string;
        recipient_name: string;
        token: string;
        status: string;
      } | null;
    };

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    if (experience.status !== 'published') {
      return NextResponse.json(
        { error: 'Publish this experience before sending it by email.' },
        { status: 400 }
      );
    }

    const shareUrl = absoluteUrl(`/e/${experience.token}`);
    const safeRecipient = escapeHtml(recipientName || experience.recipient_name);
    const safeSender = escapeHtml(experience.sender_name);
    const safeNote = personalNote ? escapeHtml(personalNote) : '';

    const htmlContent = `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #FFF8F5; color: #392832; border-radius: 16px;">
        <h2 style="margin: 0 0 12px; color: #B85C75; font-size: 24px;">💝 A Special Surprise for ${safeRecipient}</h2>
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6;">
          <strong>${safeSender}</strong> created a personalized digital experience just for you on <strong>iLoveShare</strong>.
        </p>
        ${
          safeNote
            ? `<blockquote style="margin: 0 0 20px; padding: 12px 16px; background: #FFFFFF; border-left: 3px solid #B85C75; border-radius: 8px; font-style: italic;">${safeNote}</blockquote>`
            : ''
        }
        <a href="${shareUrl}" style="display: inline-block; padding: 14px 28px; background: #B85C75; color: #FFFFFF; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px;">
          Open Your Surprise ✨
        </a>
        <p style="margin: 24px 0 0; font-size: 12px; color: #8B7780;">
          Or copy this link: ${shareUrl}
        </p>
      </div>
    `;

    const result = await sendBrevoEmail({
      to: [{ email: recipientEmail, name: recipientName || experience.recipient_name }],
      subject: `${experience.sender_name} sent you a special surprise on iLoveShare 💝`,
      htmlContent,
      replyTo: user.email ? { email: user.email, name: experience.sender_name } : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: result.skipped ? 503 : 502 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
