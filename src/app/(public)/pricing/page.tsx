import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the perfect plan for your celebration needs.',
};

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '3 experiences per month',
      'Basic themes (3)',
      'Up to 2 photos per experience',
      'Unique sharing link',
      'Basic animations',
      'Response collection',
    ],
    cta: 'Get Started Free',
    href: ROUTES.REGISTER,
    highlight: false,
  },
  {
    name: 'Premium',
    price: '₹299',
    period: 'per month',
    description: 'For heartfelt creators',
    features: [
      'Unlimited experiences',
      'All 9 premium themes',
      'Up to 4 photos per experience',
      'PDF & audio attachments',
      'All animations + music',
      'QR code generation',
      'Scheduled delivery',
      'Expiry dates',
      'Analytics dashboard',
      'Response history',
      'Priority support',
    ],
    cta: 'Start Premium',
    href: ROUTES.REGISTER,
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Business',
    price: '₹999',
    period: 'per month',
    description: 'For teams & agencies',
    features: [
      'Everything in Premium',
      'Group celebration delivery',
      'Custom branding',
      'Team collaboration',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'White-label option',
    ],
    cta: 'Contact Sales',
    href: ROUTES.CONTACT,
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main className="pt-24 pb-24 bg-brand-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-brand-text mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-brand-muted text-xl max-w-2xl mx-auto">
            Start free and upgrade when you&apos;re ready. No hidden fees, no surprises — just beautiful ones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border ${
                plan.highlight
                  ? 'border-brand-primary bg-brand-primary/5 shadow-large'
                  : 'border-brand-border bg-brand-surface shadow-soft'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-primary text-white text-xs font-semibold">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold text-brand-text">{plan.name}</h3>
                <p className="text-brand-muted text-sm mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="font-serif text-4xl font-bold text-brand-text">{plan.price}</span>
                  <span className="text-brand-muted text-sm ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-brand-text">
                    <span className="text-brand-primary mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-soft'
                    : 'border border-brand-border text-brand-text hover:border-brand-primary hover:text-brand-primary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-brand-muted text-sm">
            All plans include SSL security, Supabase-powered storage, and 99.9% uptime SLA.{' '}
            <Link href={ROUTES.CONTACT} className="text-brand-primary hover:underline">
              Have questions? Contact us.
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
