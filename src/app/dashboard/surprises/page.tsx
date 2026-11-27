import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { SurprisesManager } from '@/components/dashboard/surprises-manager';

export const metadata: Metadata = {
  title: 'My Surprises',
  robots: { index: false, follow: false },
};

export default async function SurprisesPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });

  const params = await searchParams;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-brand-text">My Surprises</h1>
        <p className="text-brand-muted mt-1">Manage all your personalized experiences.</p>
      </div>
      <SurprisesManager
        experiences={experiences || []}
        userId={user.id}
        newlyPublishedToken={params.published}
      />
    </div>
  );
}
