import NavAndFooterWrapper from "@/providers/NavAndFooterWrapper";

export default function PrivacyPolicyPage() {
  return (
    <NavAndFooterWrapper>
      <main className="min-h-screen bg-background px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-4xl rounded-3xl border border-border bg-card/70 p-8 sm:p-10">
          <h1 className="text-3xl font-extrabold text-foreground">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">
            Direction AI respects your privacy and protects your information.
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-foreground/90">
            <div>
              <h2 className="text-lg font-bold text-foreground">Information We Collect</h2>
              <p className="mt-2">We collect account details, workspace inputs, and usage analytics to deliver and improve the product.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">How We Use Data</h2>
              <p className="mt-2">Data is used to authenticate users, run AI workflows, generate project outputs, and secure platform operations.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Data Security</h2>
              <p className="mt-2">We apply access controls, encryption in transit, and operational safeguards to protect your data.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Your Rights</h2>
              <p className="mt-2">You can request correction or deletion of personal data and control account-level preferences.</p>
            </div>
          </div>
        </section>
      </main>
    </NavAndFooterWrapper>
  );
}

