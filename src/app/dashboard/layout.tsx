import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardNavigation } from '@/components/layout/navigation';
import { ROUTES } from '@/lib/constants';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-brand-background">
      <DashboardNavigation user={profile} />
      <div className="flex pt-16">
        <DashboardSidebar />
        <main className="flex-1 min-w-0 md:ml-64 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
