/**
 * Server-only Brevo transactional email helper.
 * Uses Brevo's REST API v3 (no extra dependencies required).
 */

export interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  skipped?: boolean;
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendBrevoEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'iLoveShare';

  if (!apiKey || !senderEmail || apiKey.startsWith('your-')) {
    return {
      success: false,
      skipped: true,
      error: 'Brevo is not configured. Add BREVO_API_KEY and BREVO_SENDER_EMAIL in .env.local.',
    };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: options.to,
        subject: options.subject,
        htmlContent: options.htmlContent,
        ...(options.replyTo ? { replyTo: options.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        error: `Brevo error (${res.status}): ${errText}`,
      };
    }

    const data = (await res.json()) as { messageId?: string };
    return { success: true, messageId: data.messageId };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send email via Brevo',
    };
  }
}
