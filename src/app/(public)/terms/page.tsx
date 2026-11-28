import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions – iLoveShare',
  description: 'Read the Terms and Conditions governing your use of the iLoveShare platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <div className="pt-28 pb-20">
        <div className="container-custom max-w-3xl">
          <div className="bg-brand-surface rounded-3xl p-8 md:p-12 border border-brand-border shadow-soft">
            <span className="text-xs font-medium text-brand-muted uppercase tracking-widest">Last updated: November 2026</span>
            <h1 className="font-serif text-4xl font-bold text-brand-text mt-3 mb-6">Terms & Conditions</h1>
            <div className="text-brand-muted space-y-6">
              <p className="text-base text-brand-text">
                By using <strong>iLoveShare</strong>, you agree to these Terms and Conditions. Please read them carefully.
              </p>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">1. Use of the Platform</h2>
                <p>iLoveShare is intended for personal, non-commercial use to create and share digital celebrations and surprises. You must be at least 13 years of age to use this platform.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">2. User Content</h2>
                <p>You are solely responsible for any content you create, upload, or share on iLoveShare. You must not upload content that is illegal, harmful, offensive, or infringes on intellectual property rights. We reserve the right to remove content that violates these terms.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">3. Account Responsibility</h2>
                <p>You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized access to your account.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">4. Acceptable Use</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Do not use the platform to harass, abuse, or harm others</li>
                  <li>Do not attempt to bypass security measures</li>
                  <li>Do not use the platform for spam or unauthorized advertising</li>
                  <li>Do not upload malware or malicious content</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">5. Intellectual Property</h2>
                <p>The iLoveShare brand, design, and technology are the intellectual property of iLoveShare. User-created content remains the property of the creator.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">6. Disclaimer</h2>
                <p>iLoveShare is provided &ldquo;as is&rdquo; without any warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">7. Changes to Terms</h2>
                <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-brand-text mb-2">8. Contact</h2>
                <p>Questions about these terms? Contact us at <a href="mailto:mhn.technical.help7@gmail.com" className="text-brand-primary hover:underline">mhn.technical.help7@gmail.com</a>.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
