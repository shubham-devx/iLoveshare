import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import type { Experience } from '@/types/database';

// GET /api/experiences - list user's experiences
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let query = supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = NextResponse.json({ experiences: data as Experience[] });
  // Private, short-lived cache: browser can reuse for 30s, CDN must not cache (authenticated route)
  response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=10');
  return response;
}

// DELETE /api/experiences - delete one experience (?id=) or clear history (?scope=sent|all)
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const scope = searchParams.get('scope');

  const writer = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? await createAdminClient()
    : supabase;

  if (scope === 'sent' || scope === 'all') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (writer.from('experiences') as any)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if (scope === 'sent') {
      query = query.eq('status', 'published');
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (!id) {
    return NextResponse.json({ error: 'Experience ID or scope required' }, { status: 400 });
  }

  // Verify ownership before deletion
  const { data: experience } = await supabase
    .from('experiences')
    .select('id, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!experience) {
    return NextResponse.json({ error: 'Experience not found or unauthorized' }, { status: 403 });
  }

  // Soft delete via admin client (no status='deleted' so CHECK constraint is never violated)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (writer.from('experiences') as any)
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
