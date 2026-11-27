import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – iLoveShare',
  description: 'Read our Privacy Policy to understand how iLoveShare collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Navigation />
      <div className="pt-28 pb-20">
        <div className="container-custom max-w-3xl">
          <div className="bg-brand-surface rounded-3xl p-8 md:p-12 border border-brand-border shadow-soft">
            <span className="text-xs font-medium text-brand-muted uppercase tracking-widest">Last updated: November 2026</span>
            <h1 className="font-serif text-4xl font-bold text-brand-text mt-3 mb-6">Privacy Policy</h1>
            <div className="prose prose-sm max-w-none text-brand-muted space-y-6">
              <p className="text-base text-brand-text">
                At <strong>iLoveShare</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">1. Information We Collect</h2>
                <p>We collect information you provide when you register, including your name, email address, and password. We also collect information about the digital experiences you create, including recipient details, messages, and uploaded media.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">2. How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To create and manage your account</li>
                  <li>To deliver personalized digital experiences to recipients</li>
                  <li>To send important service-related communications</li>
                  <li>To improve our platform and services</li>
                  <li>To detect and prevent fraud or misuse</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">3. Data Security</h2>
                <p>We use industry-standard encryption and security measures to protect your data. Your account is protected by Supabase Auth with secure session management. We never store plaintext passwords.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">4. Data Retention</h2>
                <p>We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by visiting your account settings or contacting us.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">5. Cookies</h2>
                <p>We use essential cookies for authentication and session management. We do not use tracking cookies for advertising purposes.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">6. Third-Party Services</h2>
                <p>We use Supabase for database and authentication, and Vercel for hosting. These services have their own privacy policies which we encourage you to review.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">7. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@iloveshare.com" className="text-brand-primary hover:underline">privacy@iloveshare.com</a> to exercise these rights.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">8. Contact Us</h2>
                <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@iloveshare.com" className="text-brand-primary hover:underline">privacy@iloveshare.com</a>.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
