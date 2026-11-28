import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  }

  return NextResponse.json({ experience: data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('experiences') as any)
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Update failed' }, { status: 400 });
  }

  return NextResponse.json({ experience: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Verify ownership with the user client first
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Confirm the experience belongs to this user
  const { data: existing } = await supabase
    .from('experiences')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Experience not found or access denied' }, { status: 404 });
  }

  // Use admin client to bypass RLS for the soft-delete update
  // so it works regardless of which CHECK or policy constraints are in place
  const writer = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? await createAdminClient()
    : supabase;
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
    console.error('Delete experience error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
