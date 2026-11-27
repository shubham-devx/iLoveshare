'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      toast.error(error.message || 'Failed to send reset email.');
      return;
    }

    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="animate-fade-in-up text-center">
        <div className="text-6xl mb-6">📧</div>
        <h1 className="font-serif text-3xl font-bold text-brand-text mb-3">Email Sent!</h1>
        <p className="text-brand-muted mb-2">
          We&apos;ve sent a password reset link to:
        </p>
        <p className="font-semibold text-brand-primary mb-6">{getValues('email')}</p>
        <p className="text-brand-muted text-sm mb-8">
          Click the link in your email to reset your password. The link expires in 1 hour.
        </p>
        <Link href={ROUTES.LOGIN} className="inline-flex items-center gap-2 text-brand-primary hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-text mb-2">Reset password</h1>
        <p className="text-brand-muted">Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full btn-primary" size="lg" loading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href={ROUTES.LOGIN} className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
