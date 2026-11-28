import { createClient, getCachedUser, getCachedProfile } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { DashboardOverview } from '@/components/dashboard/overview';
import type { Metadata } from 'next';
import type { Experience } from '@/types/database';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await getCachedUser();

  if (!user) redirect(ROUTES.LOGIN);

  const supabase = await createClient();

  const [profile, allExperiencesResult] = await Promise.all([
    getCachedProfile(user.id),
    supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false }),
  ]);
  const allExperiences = (allExperiencesResult.data || []) as Experience[];
  const recentExperiences = allExperiences.slice(0, 5);
  const totalExperiences = allExperiences.length;
  const totalViews = allExperiences.reduce((sum, e) => sum + (e.view_count || 0), 0);

  const nowIso = new Date().toISOString();
  const upcomingScheduled = allExperiences
    .filter((e) => e.scheduled_at && e.scheduled_at > nowIso)
    .sort((a, b) => (a.scheduled_at! > b.scheduled_at! ? 1 : -1))
    .slice(0, 3);

  const expIds = allExperiences.map((e) => e.id);
  let totalResponses = 0;
  let avgRating = 0;

  if (expIds.length > 0) {
    const { data: responses } = (await supabase
      .from('experience_responses')
      .select('star_rating')
      .in('experience_id', expIds)) as { data: Array<{ star_rating: number | null }> | null };

    if (responses) {
      totalResponses = responses.length;
      const rated = responses.filter((r) => typeof r.star_rating === 'number' && r.star_rating > 0);
      if (rated.length > 0) {
        const sum = rated.reduce((acc, r) => acc + (r.star_rating || 0), 0);
        avgRating = Number((sum / rated.length).toFixed(1));
      }
    }
  }

  return (
    <DashboardOverview
      profile={profile}
      stats={{
        totalExperiences,
        totalViews,
        totalResponses,
        avgRating,
      }}
      recentExperiences={recentExperiences}
      upcomingScheduled={upcomingScheduled}
    />
  );
}
