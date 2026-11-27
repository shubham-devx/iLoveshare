import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { SentExperiences } from '@/components/dashboard/sent-experiences';
import type { Metadata } from 'next';
import type { Experience } from '@/types/database';

export const metadata: Metadata = {
  title: 'Sent Experiences – Dashboard',
  robots: { index: false, follow: false },
};

export default async function SentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.LOGIN);

  const { data } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .eq('is_deleted', false)
    .order('published_at', { ascending: false });

  return <SentExperiences experiences={(data || []) as Experience[]} />;
}
