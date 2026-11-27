'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gift, Eye, MessageSquare, Star, PlusCircle, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import type { Profile, Experience } from '@/types/database';
import { formatDate } from '@/lib/utils';

interface DashboardOverviewProps {
  profile: Profile | null;
  stats: {
    totalExperiences: number;
    totalViews: number;
    totalResponses: number;
    avgRating: number;
  };
  recentExperiences: Experience[];
  upcomingScheduled?: Experience[];
}

const statCards = (stats: DashboardOverviewProps['stats']) => [
  {
    icon: Gift,
    label: 'Total Surprises',
    value: stats.totalExperiences,
    color: '#B85C75',
    bg: '#B85C7515',
  },
  {
    icon: Eye,
    label: 'Total Views',
    value: stats.totalViews,
    color: '#D9A86C',
    bg: '#D9A86C15',
  },
  {
    icon: MessageSquare,
    label: 'Responses Received',
    value: stats.totalResponses,
    color: '#E8A0AD',
    bg: '#E8A0AD20',
  },
  {
    icon: Star,
    label: 'Avg Rating',
    value: stats.avgRating ? `${stats.avgRating}/5` : '—',
    color: '#D9A86C',
    bg: '#D9A86C15',
  },
];

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export function DashboardOverview({
  profile,
  stats,
  recentExperiences,
  upcomingScheduled = [],
}: DashboardOverviewProps) {
  const name = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl font-bold text-brand-text">
          Welcome back, {name}! 👋
        </h1>
        <p className="text-brand-muted mt-1">
          Here&apos;s what&apos;s happening with your celebrations.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {statCards(stats).map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 sm:p-5 rounded-2xl border border-brand-border bg-brand-surface"
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: stat.color }} />
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-brand-text">{stat.value}</div>
            <div className="text-xs sm:text-sm text-brand-muted mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Experiences */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-brand-text">Recent Surprises</h2>
            <Link href={ROUTES.SURPRISES} className="text-sm text-brand-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentExperiences.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-brand-border text-center">
              <div className="text-5xl mb-4">🎊</div>
              <h3 className="font-serif text-lg font-semibold text-brand-text mb-2">
                No surprises yet
              </h3>
              <p className="text-brand-muted text-sm mb-6">
                Create your first personalized experience and make someone&apos;s day unforgettable!
              </p>
              <Link href={ROUTES.CREATE}>
                <Button className="btn-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Your First Surprise
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExperiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-brand-border bg-brand-surface hover:border-brand-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                    {exp.type === 'birthday' ? '🎂' :
                     exp.type === 'anniversary' ? '💑' :
                     exp.type === 'proposal' ? '💍' :
                     exp.type === 'love_letter' ? '💌' : '✨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-brand-text truncate">{exp.title}</div>
                    <div className="text-xs text-brand-muted mt-0.5">
                      For {exp.recipient_name} · {formatDate(exp.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[exp.status] || statusColors.draft}`}>
                      {exp.status}
                    </span>
                    <div className="text-xs text-brand-muted flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {exp.view_count}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-text mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href={ROUTES.CREATE}>
              <div className="p-4 rounded-xl border border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/10 transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center">
                    <PlusCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-brand-text">Create Surprise</div>
                    <div className="text-xs text-brand-muted">Start a new experience</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-primary ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {[
              { href: ROUTES.SURPRISES, label: 'View All Surprises', desc: 'Manage your experiences', icon: Gift },
              { href: `${ROUTES.DASHBOARD}/responses`, label: 'Check Responses', desc: 'See who replied', icon: MessageSquare },
              { href: ROUTES.ANALYTICS, label: 'View Analytics', desc: 'Track performance', icon: Clock },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="p-4 rounded-xl border border-brand-border bg-brand-surface hover:border-brand-primary/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-brand-text">{action.label}</div>
                      <div className="text-xs text-brand-muted">{action.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-muted ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Upcoming scheduled surprises */}
          <div className="mt-6">
            <h3 className="font-serif text-lg font-bold text-brand-text mb-3">Upcoming Scheduled</h3>
            {upcomingScheduled.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-brand-border text-xs text-brand-muted text-center">
                No upcoming scheduled surprises.
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingScheduled.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-xl border border-brand-border bg-brand-surface flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-brand-text truncate">{exp.title}</div>
                      <div className="text-xs text-brand-muted">
                        For {exp.recipient_name} · {exp.scheduled_at ? formatDate(exp.scheduled_at) : ''}
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
