import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { DraftsManager } from '@/components/dashboard/drafts-manager';
import type { Metadata } from 'next';
import type { Experience } from '@/types/database';

export const metadata: Metadata = {
  title: 'Drafts – Dashboard',
  robots: { index: false, follow: false },
};

export default async function DraftsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.LOGIN);

  const { data } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'draft')
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false });

  return <DraftsManager drafts={(data || []) as Experience[]} userId={user.id} />;
}
