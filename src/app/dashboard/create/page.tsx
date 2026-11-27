import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { ExperienceWizard } from '@/components/create/wizard';
import type { Experience } from '@/types/database';

export const metadata: Metadata = {
  title: 'Create Surprise',
  robots: { index: false, follow: false },
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; draft?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  const params = await searchParams;

  let initialExperience: Experience | null = null;
  if (params.draft) {
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', params.draft)
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .single();
    initialExperience = (data as Experience | null) ?? null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-text">
          {initialExperience ? 'Edit Surprise ✨' : 'Create a Surprise ✨'}
        </h1>
        <p className="text-brand-muted mt-1">
          {initialExperience
            ? 'Update your personalized experience and save or publish when ready.'
            : 'Follow the steps to create a beautiful personalized experience.'}
        </p>
      </div>
      <ExperienceWizard
        userId={user.id}
        initialType={params.type}
        draftId={params.draft}
        initialExperience={initialExperience}
      />
    </div>
  );
}
