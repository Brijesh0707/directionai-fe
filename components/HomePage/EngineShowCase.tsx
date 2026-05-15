"use client";

import React from "react";
import {
  FileText,
  LayoutDashboard,
  Presentation,
  Rocket,
} from "lucide-react";

const EngineShowCase = () => {
  return (
    <section id="features" className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">

      {/* BACKGROUND EFFECT */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

            <span className="text-sm font-medium text-muted-foreground">
              AI Execution Engine
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Everything Generated
            <span className="text-primary"> Automatically</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Direction AI transforms raw startup ideas into structured,
            investor-ready execution systems within minutes.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* TOP LEFT LARGE CARD */}
          <div className="lg:col-span-8 group relative overflow-hidden rounded-[32px] border border-border bg-card/90 backdrop-blur-xl p-7 sm:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">

            {/* ANGLED BG */}
            <div className="absolute top-0 right-0 w-[35%] h-full bg-primary/5 skew-x-[-12deg] translate-x-16" />

            <div className="relative z-10">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center">
                  <FileText size={26} className="text-primary" />
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-foreground">
                    PRD Viewer
                  </h3>

                  <p className="mt-2 text-muted-foreground text-base leading-7 max-w-lg">
                    Detailed product requirements documents that
                    developers actually understand.
                  </p>
                </div>
              </div>

              {/* MOCKUP */}
              <div className="mt-10 rounded-3xl border border-border bg-background p-5 shadow-inner">

                <div className="flex items-center justify-between mb-5">
                  <div className="text-sm font-bold text-primary">
                    Core Objectives
                  </div>

                  <div className="text-xs text-muted-foreground font-semibold">
                    v1.2
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-3 rounded-full bg-border w-[75%]" />
                  <div className="h-3 rounded-full bg-border w-[92%]" />
                  <div className="h-3 rounded-full bg-border w-[60%]" />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-card p-4 h-24">
                    <div className="space-y-3">
                      <div className="h-3 rounded-full bg-border w-16" />
                      <div className="h-3 rounded-full bg-border w-24" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-4 h-24">
                    <div className="space-y-3">
                      <div className="h-3 rounded-full bg-border w-20" />
                      <div className="h-3 rounded-full bg-border w-28" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TOP RIGHT BLUE CARD */}
          <div className="lg:col-span-4 group relative overflow-hidden rounded-[32px] gradient-primary p-7 sm:p-8 text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">

            {/* GLOW */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-xl">
                <Rocket size={26} />
              </div>

              <h3 className="text-3xl font-bold">
                MVP Roadmap
              </h3>

              <p className="mt-4 text-white/80 text-base leading-7">
                Phased execution plans focused on speed to market.
              </p>

              {/* ROADMAP BARS */}
              <div className="mt-10 space-y-4">

                <div className="h-6 rounded-xl bg-white/15 backdrop-blur-xl w-full" />

                <div className="h-6 rounded-xl bg-white/15 backdrop-blur-xl w-[78%]" />

                <div className="h-6 rounded-xl bg-white/15 backdrop-blur-xl w-[60%]" />
              </div>
            </div>
          </div>

          {/* BOTTOM LEFT */}
          <div className="lg:col-span-4 group relative overflow-hidden rounded-[32px] border border-border bg-card/90 backdrop-blur-xl p-7 sm:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center">
                <Presentation
                  size={26}
                  className="text-primary"
                />
              </div>

              <div>
                <h3 className="text-3xl font-bold text-foreground">
                  Pitch Deck
                </h3>

                <p className="mt-2 text-muted-foreground text-base leading-7">
                  Data-backed narratives for investor readiness.
                </p>
              </div>
            </div>

            {/* SLIDES */}
            <div className="mt-10 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-background border border-border h-36 shadow-sm" />

              <div className="rounded-2xl bg-background border border-border h-36 shadow-sm" />
            </div>
          </div>

          {/* BOTTOM RIGHT */}
          <div className="lg:col-span-8 group relative overflow-hidden rounded-[32px] border border-border bg-card/90 backdrop-blur-xl p-7 sm:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">

            {/* BG GLOW */}
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-primary/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center">
                  <LayoutDashboard
                    size={26}
                    className="text-primary"
                  />
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-foreground">
                    GTM Strategy
                  </h3>

                  <p className="mt-2 text-muted-foreground text-base leading-7 max-w-lg">
                    Validated channels and growth loops for your
                    specific niche.
                  </p>
                </div>
              </div>

              {/* DASHBOARD */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="rounded-2xl bg-background border border-border p-5 h-36">
                  <div className="space-y-4">
                    <div className="h-3 rounded-full bg-border w-20" />
                    <div className="h-24 rounded-2xl gradient-primary opacity-90" />
                  </div>
                </div>

                <div className="rounded-2xl bg-background border border-border p-5 h-36">
                  <div className="space-y-3">
                    <div className="h-3 rounded-full bg-border w-16" />
                    <div className="h-3 rounded-full bg-border w-full" />
                    <div className="h-3 rounded-full bg-border w-[80%]" />
                    <div className="h-3 rounded-full bg-border w-[65%]" />
                  </div>
                </div>

                <div className="rounded-2xl bg-background border border-border p-5 h-36">
                  <div className="space-y-4">
                    <div className="h-3 rounded-full bg-border w-16" />

                    <div className="flex items-end gap-2 h-24">
                      <div className="w-full h-[35%] rounded-t-xl bg-primary/40" />
                      <div className="w-full h-[55%] rounded-t-xl bg-primary/60" />
                      <div className="w-full h-[85%] rounded-t-xl bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EngineShowCase;
