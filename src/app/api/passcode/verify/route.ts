import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/passcode/verify
 * Body: { token: string; passcode: string }
 *
 * Fetches the hashed passcode for the experience from the DB (server-side only),
 * runs bcrypt.compare, and returns { success: boolean }.
 * The hash is NEVER sent to the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const body = await request.json();
    const { token, passcode } = body as { token?: string; passcode?: string };

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const rate = checkRateLimit(`passcode:${ip}:${token}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    if (!passcode || typeof passcode !== 'string' || passcode.length > 128) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: experience } = (await (supabase.from('experiences') as any)
      .select('passcode')
      .eq('token', token)
      .eq('status', 'published')
      .eq('is_deleted', false)
      .single()) as { data: { passcode: string | null } | null };

    if (!experience || !experience.passcode) {
      return NextResponse.json({ success: true });
    }

    const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(experience.passcode);
    const match = isBcryptHash
      ? await bcrypt.compare(passcode, experience.passcode)
      : passcode === experience.passcode;

    return NextResponse.json({ success: match });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
