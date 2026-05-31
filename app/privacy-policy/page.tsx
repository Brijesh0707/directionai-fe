import type { Metadata } from "next";
import NavAndFooterWrapper from "@/providers/NavAndFooterWrapper";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how Direction AI collects, uses, and protects your personal, workspace, and AI-generated startup execution data.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <NavAndFooterWrapper>
      <main className="min-h-screen bg-background px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-4xl rounded-3xl border border-border bg-card/70 p-8 shadow-sm backdrop-blur-xl sm:p-10">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Direction AI respects your privacy and is committed to protecting
              your personal information, workspace data, and AI-generated
              startup assets.
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              This Privacy Policy explains how we collect, use, store, and
              protect your information when using the Direction AI platform.
            </p>
          </div>

          <div className="space-y-10 text-sm leading-7 text-foreground/90">
            {/* 1 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                1. Information We Collect
              </h2>

              <p className="mt-3">
                We may collect information you provide directly while using the
                platform, including:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Name and account details</li>
                <li>Email address and authentication information</li>
                <li>Startup ideas and workspace content</li>
                <li>AI prompts, project inputs, and generated assets</li>
                <li>Usage analytics and platform interaction data</li>
                <li>Device, browser, and session information</li>
              </ul>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                2. How We Use Information
              </h2>

              <p className="mt-3">
                Direction AI uses collected information to operate, improve, and
                secure the platform experience.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Authenticate and manage user accounts</li>
                <li>Generate AI-powered startup execution assets</li>
                <li>Improve platform performance and workflows</li>
                <li>Provide support and service communications</li>
                <li>Monitor security, abuse, and system reliability</li>
                <li>Enhance AI generation quality and product experience</li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                3. AI Generated Content
              </h2>

              <p className="mt-3">
                Direction AI processes prompts, startup ideas, and workspace
                inputs to generate AI-powered outputs such as roadmaps, GTM
                strategies, execution plans, and investor pitch decks.
              </p>

              <p className="mt-3">
                Generated content may be processed through AI systems and
                infrastructure required to deliver platform functionality.
              </p>

              <p className="mt-3">
                Users remain responsible for reviewing and validating all
                generated outputs before business or financial use.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                4. Data Protection & Security
              </h2>

              <p className="mt-3">
                We implement reasonable technical and operational safeguards to
                protect your information and workspace data.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Encrypted data transmission</li>
                <li>Access controls and authentication systems</li>
                <li>Infrastructure and security monitoring</li>
                <li>Protection against unauthorized access and abuse</li>
              </ul>

              <p className="mt-3">
                While we strive to secure all systems, no platform can guarantee
                absolute security.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                5. Data Sharing
              </h2>

              <p className="mt-3">
                Direction AI does not sell personal information to third
                parties.
              </p>

              <p className="mt-3">
                Information may be shared with trusted infrastructure, hosting,
                analytics, authentication, or AI service providers only when
                necessary to operate the platform and deliver services.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                6. Data Retention
              </h2>

              <p className="mt-3">
                We retain information only for as long as necessary to provide
                services, maintain platform operations, comply with legal
                obligations, and improve product functionality.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                7. Your Rights & Controls
              </h2>

              <p className="mt-3">
                Depending on your region and applicable laws, you may have the
                right to:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of account data</li>
                <li>Manage account preferences and permissions</li>
              </ul>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                8. Cookies & Analytics
              </h2>

              <p className="mt-3">
                Direction AI may use cookies, session storage, and analytics
                technologies to improve functionality, performance, and user
                experience.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                9. Changes to This Policy
              </h2>

              <p className="mt-3">
                We may update this Privacy Policy periodically to reflect
                platform improvements, operational changes, or legal
                requirements.
              </p>

              <p className="mt-3">
                Continued use of Direction AI after updates constitutes
                acceptance of the revised policy.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                10. Contact
              </h2>

              <p className="mt-3">
                For privacy-related questions, requests, or concerns, please
                contact the Direction AI team through official platform support
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