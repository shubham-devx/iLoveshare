'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let active = true;
    const initSession = async () => {
      const supabase = createClient();
      const code = searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error && active) {
          setSessionError(true);
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (user) {
        setSessionReady(true);
      } else {
        setSessionError(true);
      }
    };

    void initSession();
    return () => {
      active = false;
    };
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast.error(error.message || 'Failed to reset password.');
      return;
    }

    setSuccess(true);
    toast.success('Password updated successfully!');
    setTimeout(() => router.push(ROUTES.DASHBOARD), 2000);
  };

  if (success) {
    return (
      <div className="animate-fade-in-up text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-text mb-3">Password Updated!</h1>
        <p className="text-brand-muted mb-6">Your password has been reset successfully. Redirecting to dashboard...</p>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="animate-fade-in-up text-center">
        <h1 className="font-serif text-3xl font-bold text-brand-text mb-3">Reset Link Expired</h1>
        <p className="text-brand-muted mb-6">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full btn-primary" size="lg">
            Request New Reset Link
          </Button>
        </Link>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="animate-fade-in-up text-center py-8">
        <p className="text-brand-muted">Verifying reset link...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-text mb-2">Create new password</h1>
        <p className="text-brand-muted">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New password"
            className="w-full h-11 pl-10 pr-11 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            {...register('password')}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm new password"
            className="w-full h-11 pl-10 pr-11 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            {...register('confirmPassword')}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary">
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full btn-primary" size="lg" loading={isSubmitting}>
          Reset Password
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href={ROUTES.LOGIN} className="text-sm text-brand-muted hover:text-brand-primary transition-colors">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-brand-muted">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
