import type { Metadata } from "next";
import NavAndFooterWrapper from "@/providers/NavAndFooterWrapper";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms and Conditions",
  description:
    "Review the terms and conditions for using Direction AI services and AI-generated startup execution tools.",
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return (
    <NavAndFooterWrapper>
      <main className="min-h-screen bg-background px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-4xl rounded-3xl border border-border bg-card/70 p-8 shadow-sm backdrop-blur-xl sm:p-10">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              These Terms and Conditions govern your access to and use of
              Direction AI, including all AI-generated startup execution tools,
              workflows, documents, and platform services.
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              By accessing or using Direction AI, you agree to comply with these
              terms.
            </p>
          </div>

          <div className="space-y-10 text-sm leading-7 text-foreground/90">
            {/* 1 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                1. Platform Overview
              </h2>

              <p className="mt-3">
                Direction AI is an AI-powered startup execution workspace that
                helps users transform startup ideas into structured execution
                assets such as product roadmaps, GTM strategies, investor pitch
                decks, execution plans, workflows, and business documentation.
              </p>

              <p className="mt-3">
                The platform is intended to assist with startup planning,
                organization, and execution workflows using artificial
                intelligence.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                2. Account Responsibilities
              </h2>

              <p className="mt-3">
                You are responsible for maintaining the confidentiality and
                security of your account credentials and all activity performed
                under your account.
              </p>

              <p className="mt-3">
                You agree to provide accurate information and avoid unauthorized
                access, account sharing, or misuse of the platform.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                3. Acceptable Use
              </h2>

              <p className="mt-3">
                You agree not to use Direction AI for unlawful, harmful,
                abusive, fraudulent, or misleading purposes.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Attempting to exploit or reverse engineer the platform</li>
                <li>Generating illegal, harmful, or deceptive content</li>
                <li>Automated abuse, scraping, or system interference</li>
                <li>Violating intellectual property or privacy rights</li>
                <li>Uploading malicious software or harmful code</li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                4. AI Generated Outputs
              </h2>

              <p className="mt-3">
                Direction AI uses artificial intelligence to generate startup
                execution assets and recommendations.
              </p>

              <p className="mt-3">
                While we aim to provide useful and high-quality outputs,
                generated content may contain inaccuracies, assumptions, or
                incomplete information.
              </p>

              <p className="mt-3">
                Users are solely responsible for reviewing, validating, and
                making final decisions based on generated outputs.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                5. Intellectual Property
              </h2>

              <p className="mt-3">
                All platform branding, software, interface designs, systems, and
                proprietary technologies related to Direction AI remain the
                property of Direction AI.
              </p>

              <p className="mt-3">
                Users retain ownership of the original information and startup
                ideas they provide to the platform, subject to applicable laws
                and platform usage policies.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                6. Service Availability
              </h2>

              <p className="mt-3">
                We may update, improve, suspend, or discontinue features of the
                platform at any time without prior notice.
              </p>

              <p className="mt-3">
                We do not guarantee uninterrupted availability, error-free
                operation, or permanent access to all services and generated
                data.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                7. Limitation of Liability
              </h2>

              <p className="mt-3">
                Direction AI is provided on an “as is” and “as available” basis.
              </p>

              <p className="mt-3">
                Direction AI shall not be liable for any indirect, incidental,
                business, financial, or consequential damages resulting from the
                use of the platform or reliance on AI-generated outputs.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                8. Termination
              </h2>

              <p className="mt-3">
                We reserve the right to suspend or terminate access to the
                platform for violations of these terms, harmful behavior,
                security risks, or misuse of services.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                9. Changes to Terms
              </h2>

              <p className="mt-3">
                We may modify these Terms and Conditions periodically. Continued
                use of the platform after updates constitutes acceptance of the
                revised terms.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                10. Contact
              </h2>

              <p className="mt-3">
                For questions regarding these Terms and Conditions, please
                contact the Direction AI team through the official platform
                channels.
              </p>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Last updated: May 2026
            </p>
          </div>
        </section>
      </main>
    </NavAndFooterWrapper>
  );
}