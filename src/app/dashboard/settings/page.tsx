import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { AccountSettings } from '@/components/dashboard/account-settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings – Dashboard',
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.LOGIN);

  return <AccountSettings userId={user.id} userEmail={user.email || ''} />;
}
