import type { Metadata } from 'next';
import NavAndFooterWrapper from '@/providers/NavAndFooterWrapper';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Terms and Conditions',
  description: 'Review the terms and conditions for using Direction AI services and outputs.',
  path: '/terms-and-conditions',
});

export default function TermsAndConditionsPage() {
  return (
    <NavAndFooterWrapper>
      <main className="min-h-screen bg-background px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-4xl rounded-3xl border border-border bg-card/70 p-8 sm:p-10">
          <h1 className="text-3xl font-extrabold text-foreground">Terms & Conditions</h1>
          <p className="mt-3 text-muted-foreground">
            These terms govern your use of Direction AI services.
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-foreground/90">
            <div>
              <h2 className="text-lg font-bold text-foreground">Service Usage</h2>
              <p className="mt-2">You agree to use the platform lawfully and avoid abuse, unauthorized access, or harmful automation.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Account Responsibility</h2>
              <p className="mt-2">You are responsible for maintaining credential security and activity under your account.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Content and Outputs</h2>
              <p className="mt-2">Generated outputs are provided as assistance; you remain responsible for review and final decisions.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Changes and Termination</h2>
              <p className="mt-2">We may update terms or suspend access for policy violations or security concerns.</p>
            </div>
          </div>
        </section>
      </main>
    </NavAndFooterWrapper>
  );
}
