'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectedFrom') || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      return;
    }

    toast.success('Welcome back! 💕');
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-text mb-2">Welcome back</h1>
        <p className="text-brand-muted">Sign in to continue creating beautiful surprises.</p>
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
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full h-11 pl-10 pr-11 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-brand-muted cursor-pointer">
            <input type="checkbox" className="rounded border-brand-border text-brand-primary" />
            Remember me
          </label>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-brand-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full btn-primary"
          size="lg"
          loading={isSubmitting}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-brand-muted">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="text-brand-primary font-medium hover:underline">
            Create one for free
          </Link>
        </p>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20">
        <p className="text-xs text-brand-muted text-center">
          🔒 Your data is protected with enterprise-grade security. We never share your personal information.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-brand-surface" />}>
      <LoginContent />
    </Suspense>
  );
}
