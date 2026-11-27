import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { ProfileSettings } from '@/components/dashboard/profile-settings';
import type { Metadata } from 'next';
import type { Profile } from '@/types/database';

export const metadata: Metadata = {
  title: 'Profile – Dashboard',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.LOGIN);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return <ProfileSettings profile={profile as Profile | null} userEmail={user.email || ''} />;
}
