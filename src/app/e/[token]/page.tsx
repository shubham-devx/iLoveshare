import { notFound } from 'next/navigation';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { ExperienceViewer } from '@/components/experience/experience-viewer';
import { isFutureDate } from '@/lib/utils';
import type { Metadata } from 'next';
import type { Experience, ExperienceAttachment } from '@/types/database';

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const supabase = await createClient();

  const { data: experience } = await supabase
    .from('experiences')
    .select('recipient_name, sender_name, type, theme')
    .eq('token', token)
    .eq('status', 'published')
    .single() as { data: Experience | null };

  if (!experience) {
    return { title: 'Experience Not Found' };
  }

  return {
    title: `A special surprise for ${experience.recipient_name} from ${experience.sender_name}`,
    description: `Open this beautiful personalized experience created just for you on iLoveShare.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `💝 You have a special surprise!`,
      description: `${experience.sender_name} has created something beautiful just for you on iLoveShare.`,
    },
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch the experience securely by token
  const { data: experience, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('token', token)
    .eq('status', 'published')
    .is('is_deleted', false)
    .single() as { data: Experience | null; error: unknown };

  if (error || !experience) {
    notFound();
  }

  // Check expiry
  if (experience.expires_at && new Date(experience.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="font-serif text-3xl font-bold text-brand-text mb-3">
            This surprise has expired
          </h1>
          <p className="text-brand-muted">
            This experience was only available for a limited time. Please contact {experience.sender_name} for more information.
          </p>
        </div>
      </div>
    );
  }

  // Fetch attachments
  const { data: rawAttachments } = await supabase
    .from('experience_attachments')
    .select('*')
    .eq('experience_id', experience.id)
    .order('order_index');

  const attachments = (rawAttachments || []) as ExperienceAttachment[];

  // Use admin client to bypass owner-only UPDATE RLS when anonymous receivers open the link
  const writer = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? await createAdminClient()
    : supabase;

  await Promise.allSettled([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (writer.from('experience_analytics') as any).insert({
      experience_id: experience.id,
      event_type: 'view',
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (writer.from('experiences') as any)
      .update({
        view_count: (experience.view_count || 0) + 1,
      })
      .eq('id', experience.id),
  ]);

  const isScheduledFuture = isFutureDate(experience.scheduled_at);

  // Never send the bcrypt passcode hash to the client
  const safeExperience: Experience = {
    ...experience,
    passcode: experience.passcode ? '__protected__' : null,
  };

  return (
    <ExperienceViewer
      experience={safeExperience}
      attachments={attachments}
      initiallyScheduledFuture={isScheduledFuture}
    />
  );
}
