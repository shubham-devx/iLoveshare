'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, KeyRound, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      return;
    }

    // If email confirmation is disabled in Supabase, session is active immediately
    if (authData.session) {
      toast.success('Account created! Welcome to iLoveShare 🎉');
      router.push(ROUTES.DASHBOARD);
      router.refresh();
      return;
    }

    setRegisteredEmail(data.email);
    setEmailSent(true);
    setResendCooldown(60);
    toast.success('Verification code sent! Please check your email.');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = otp.replace(/\s+/g, '');
    if (cleaned.length < 6) {
      toast.error('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: registeredEmail,
      token: cleaned,
      type: 'signup',
    });
    setIsVerifying(false);

    if (error) {
      toast.error(error.message || 'Invalid or expired code. Please try again.');
      return;
    }

    toast.success('Email verified! Welcome to iLoveShare 🎉');
    router.push(ROUTES.DASHBOARD);
    router.refresh();
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !registeredEmail) return;
    setIsResending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: registeredEmail,
    });
    setIsResending(false);

    if (error) {
      toast.error(error.message || 'Failed to resend code. Please wait a moment.');
      return;
    }

    setResendCooldown(60);
    toast.success('A new 6-digit verification code has been sent!');
  };

  if (emailSent) {
    return (
      <div className="animate-fade-in-up text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="font-serif text-3xl font-bold text-brand-text mb-2">
          Verify Your Email
        </h1>
        <p className="text-brand-muted text-sm mb-6">
          We sent a 6-digit verification code to{' '}
          <span className="font-semibold text-brand-text">{registeredEmail}</span>.
          Enter it below to activate your account.
        </p>

        <form onSubmit={handleVerifyOtp} className="space-y-4 text-left mb-6">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted text-center text-lg font-mono tracking-[0.35em] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            size="lg"
            loading={isVerifying}
            disabled={otp.length < 6}
          >
            Verify &amp; Continue
          </Button>
        </form>

        <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20 mb-5 space-y-2">
          <p className="text-xs text-brand-muted">
            Didn&apos;t receive the code? Check your spam folder or resend it.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isResending}
              className="inline-flex items-center gap-1 text-brand-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
            <span className="text-brand-border">|</span>
            <button
              type="button"
              onClick={() => {
                setEmailSent(false);
                setOtp('');
              }}
              className="text-brand-muted hover:text-brand-text hover:underline"
            >
              Use another email
            </button>
          </div>
        </div>

        <Link
          href={ROUTES.LOGIN}
          className="text-sm text-brand-primary hover:underline"
        >
          Already verified? Sign in →
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-text mb-2">Create your account</h1>
        <p className="text-brand-muted">Start creating unforgettable digital celebrations.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Full name"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            {...register('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

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

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 8 chars, 1 uppercase, 1 number)"
            className="w-full h-11 pl-10 pr-11 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm password"
            className="w-full h-11 pl-10 pr-11 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 rounded border-brand-border text-brand-primary"
              {...register('agreeToTerms')}
            />
            <span className="text-xs text-brand-muted">
              I agree to the{' '}
              <Link href={ROUTES.TERMS} className="text-brand-primary hover:underline">Terms & Conditions</Link>
              {' '}and{' '}
              <Link href={ROUTES.PRIVACY} className="text-brand-primary hover:underline">Privacy Policy</Link>
            </span>
          </label>
          {errors.agreeToTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full btn-primary"
          size="lg"
          loading={isSubmitting}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create Free Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-brand-muted">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="text-brand-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
