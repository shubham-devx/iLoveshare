import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';
import type { Metadata } from 'next';
import type { Experience } from '@/types/database';

export const metadata: Metadata = {
  title: 'Analytics – Dashboard',
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.LOGIN);

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  return <AnalyticsDashboard experiences={(experiences || []) as Experience[]} />;
}
