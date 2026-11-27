import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { responseSubmissionSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';
import type { Experience } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rate = checkRateLimit(`response:${ip}`, 15, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = responseSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid response data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { token, response_type, response_value, respondent_name, star_rating, written_feedback } =
      parsed.data;

    const supabase = await createClient();

    // Verify published experience by token
    const { data: experience, error: expError } = (await supabase
      .from('experiences')
      .select('*')
      .eq('token', token)
      .eq('status', 'published')
      .is('is_deleted', false)
      .single()) as { data: Experience | null; error: unknown };

    if (expError || !experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    if (experience.expires_at && new Date(experience.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This experience has expired' }, { status: 410 });
    }

    // Prevent duplicate submission if not group delivery and already responded
    if (!experience.group_delivery && (experience.response_count || 0) > 0 && experience.lock_after_response) {
      return NextResponse.json(
        { error: 'A response has already been recorded for this experience.' },
        { status: 409 }
      );
    }

    const userAgent = request.headers.get('user-agent') || null;

    // Insert response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: insertedResponse, error: insertError } = await (supabase.from('experience_responses') as any)
      .insert({
        experience_id: experience.id,
        response_type,
        response_value,
        respondent_name: respondent_name || experience.recipient_name,
        star_rating: star_rating ?? null,
        written_feedback: written_feedback || null,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to record response' }, { status: 500 });
    }

    // Also record normalized feedback if rating or written feedback was provided
    if (star_rating || written_feedback) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('experience_feedback') as any).insert({
        experience_id: experience.id,
        response_id: insertedResponse?.id || null,
        rating: star_rating || 5,
        comment: written_feedback || null,
        recipient_name: respondent_name || experience.recipient_name,
      });
    }

    // Log analytics event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void (supabase.from('experience_analytics') as any).insert({
      experience_id: experience.id,
      event_type: 'response',
      ip_address: ip,
      user_agent: userAgent,
    });

    return NextResponse.json({ success: true, response: insertedResponse });
  } catch (error) {
    console.error('Response submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
