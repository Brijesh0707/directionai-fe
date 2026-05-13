"use client";

export default function AppLoadingScreen({ label = 'Please wait...' }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl min-w-[260px] text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full gradient-primary animate-pulse" />
        <p className="text-foreground font-semibold">{label}</p>
      </div>
    </div>
  );
}
