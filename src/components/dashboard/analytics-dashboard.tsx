'use client';

import { motion } from 'framer-motion';
import { BarChart3, Eye, MessageSquare, TrendingUp, Star } from 'lucide-react';
import type { Experience } from '@/types/database';

interface Props {
  experiences: Experience[];
}

export function AnalyticsDashboard({ experiences }: Props) {
  const totalViews = experiences.reduce((sum, e) => sum + (e.view_count || 0), 0);
  const totalResponses = experiences.reduce((sum, e) => sum + (e.response_count || 0), 0);
  const publishedCount = experiences.filter(e => e.status === 'published').length;
  const responseRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;

  const statCards = [
    { icon: Eye, label: 'Total Views', value: totalViews, color: '#B85C75', bg: '#B85C7515' },
    { icon: MessageSquare, label: 'Total Responses', value: totalResponses, color: '#D9A86C', bg: '#D9A86C15' },
    { icon: TrendingUp, label: 'Response Rate', value: `${responseRate}%`, color: '#E8A0AD', bg: '#E8A0AD15' },
    { icon: BarChart3, label: 'Published', value: publishedCount, color: '#392832', bg: '#39283215' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-brand-text mb-1">Analytics</h1>
        <p className="text-brand-muted text-sm">Track how your surprises are performing.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-soft"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: stat.bg }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div className="text-2xl font-bold text-brand-text">{stat.value}</div>
            <div className="text-xs text-brand-muted mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Per-experience breakdown */}
      <div>
        <h2 className="font-serif text-lg font-bold text-brand-text mb-4">Experience Breakdown</h2>
        {experiences.length === 0 ? (
          <div className="text-center py-12 text-brand-muted">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No experiences yet. Create your first surprise to see analytics.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp, i) => {
              const viewPct = totalViews > 0 ? (exp.view_count / totalViews) * 100 : 0;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-brand-surface rounded-xl p-4 border border-brand-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-brand-text text-sm truncate max-w-[200px]">{exp.title}</span>
                    <div className="flex items-center gap-4 text-xs text-brand-muted">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{exp.view_count || 0}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{exp.response_count || 0}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-brand-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
                      style={{ width: `${viewPct}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
