'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Gift,
  Send,
  MessageSquare,
  FileText,
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: ROUTES.CREATE, label: 'Create Surprise', icon: PlusCircle },
  { href: ROUTES.SURPRISES, label: 'My Surprises', icon: Gift },
  { href: `${ROUTES.DASHBOARD}/sent`, label: 'Sent Experiences', icon: Send },
  { href: `${ROUTES.DASHBOARD}/responses`, label: 'Received Responses', icon: MessageSquare },
  { href: ROUTES.DRAFTS, label: 'Drafts', icon: FileText },
  { href: ROUTES.ANALYTICS, label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
  { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

interface NavContentProps {
  pathname: string;
  onNavigate: () => void;
  onSignOut: () => void;
}

function SidebarNavContent({ pathname, onNavigate, onSignOut }: NavContentProps) {
  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full py-6">
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(item.href, item.exact)
                ? 'bg-brand-primary text-white shadow-soft'
                : 'text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary'
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 space-y-1 border-t border-brand-border pt-4">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(item.href)
                ? 'bg-brand-primary text-white shadow-soft'
                : 'text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary'
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}

        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push(ROUTES.HOME);
    router.refresh();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 flex-col bg-brand-surface border-r border-brand-border overflow-y-auto">
        <SidebarNavContent
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-primary text-white shadow-large flex items-center justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 bg-brand-surface h-full overflow-y-auto shadow-large">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarNavContent
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
              onSignOut={handleSignOut}
            />
          </aside>
        </div>
      )}
    </>
  );
}
