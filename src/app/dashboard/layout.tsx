import { redirect } from 'next/navigation';
import { getCachedUser, getCachedProfile } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardNavigation } from '@/components/layout/navigation';
import { ROUTES } from '@/lib/constants';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCachedUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const profile = await getCachedProfile(user.id);

  return (
    <div className="min-h-screen bg-brand-background">
      <DashboardNavigation
        user={
          profile
            ? {
                email: profile.email,
                full_name: profile.full_name ?? undefined,
                avatar_url: profile.avatar_url ?? undefined,
              }
            : null
        }
      />
      <div className="flex pt-16">
        <DashboardSidebar />
        <main className="flex-1 min-w-0 md:ml-64 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
