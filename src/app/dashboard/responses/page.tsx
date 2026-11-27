import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { ResponsesManager } from '@/components/dashboard/responses-manager';
import type { Metadata } from 'next';
import type { Experience, ExperienceResponse } from '@/types/database';

export const metadata: Metadata = {
  title: 'Responses – Dashboard',
  robots: { index: false, follow: false },
};

export default async function ResponsesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.LOGIN);

  const { data: experiences } = await supabase
    .from('experiences')
    .select('id, title, type, recipient_name, token')
    .eq('user_id', user.id)
    .eq('is_deleted', false);

  const expIds = (experiences || []).map((e: { id: string }) => e.id);
  let responses: ExperienceResponse[] = [];

  if (expIds.length > 0) {
    const { data } = await supabase
      .from('experience_responses')
      .select('*')
      .in('experience_id', expIds)
      .order('created_at', { ascending: false });
    responses = (data || []) as ExperienceResponse[];
  }

  return (
    <ResponsesManager
      responses={responses}
      experiences={(experiences || []) as unknown as Experience[]}
    />
  );
}
