'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to send message');
      } else {
        setSubmitted(true);
        toast.success("Message sent! We'll get back to you within 24 hours. 💌");
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'mhn.technical.help7@gmail.com',
      href: 'mailto:mhn.technical.help7@gmail.com',
      sub: 'We reply within 24 hours',
      color: '#B85C75',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      detail: 'Available on the platform',
      href: undefined,
      sub: 'Mon–Fri, 9am–6pm IST',
      color: '#D9A86C',
    },
    {
      icon: Clock,
      title: 'Response Time',
      detail: 'Within 24 hours',
      href: undefined,
      sub: 'Usually much faster',
      color: '#E8A0AD',
    },
  ];

  return (
    <main className="min-h-screen bg-brand-background">
      <div className="pt-28 pb-20">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-4">
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-text mb-4">
              We&apos;d love to hear from you
            </h1>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto">
              Have questions, feedback, or just want to say hi? Our team is here to help you create
              more beautiful moments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-soft text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: info.color + '15' }}
                >
                  <info.icon className="w-6 h-6" style={{ color: info.color }} />
                </div>
                <h3 className="font-semibold text-brand-text mb-1">{info.title}</h3>
                {info.href ? (
                  <a
                    href={info.href}
                    className="text-brand-primary hover:underline font-medium text-sm mb-1 block break-all"
                  >
                    {info.detail}
                  </a>
                ) : (
                  <p className="text-brand-text font-medium text-sm mb-1">{info.detail}</p>
                )}
                <p className="text-brand-muted text-xs">{info.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto bg-brand-surface rounded-3xl p-8 md:p-10 border border-brand-border shadow-medium"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💌</div>
                <h2 className="font-serif text-2xl font-bold text-brand-text mb-3">Message Received!</h2>
                <p className="text-brand-muted mb-6">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-brand-text mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-brand-text mb-1.5">Your name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Priya Sharma"
                        className="w-full h-11 px-4 rounded-xl border border-brand-border bg-brand-background text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-text mb-1.5">Email address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="priya@example.com"
                        className="w-full h-11 px-4 rounded-xl border border-brand-border bg-brand-background text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-1.5">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="How can we help?"
                      className="w-full h-11 px-4 rounded-xl border border-brand-border bg-brand-background text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-primary" size="lg" loading={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
