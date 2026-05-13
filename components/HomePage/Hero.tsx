"use client";

import React from "react";
import Link from "next/link";
import {
  PlayCircle,
  Sparkles,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-secondary/10 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="relative z-10">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 mb-7 shadow-sm">
              <Sparkles size={16} className="text-primary" />
              
              <span className="text-sm font-medium text-muted-foreground">
                AI-powered startup execution platform
              </span>
            </div>

            {/* HEADING */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground max-w-2xl">
              Turn Raw Startup Ideas
              <br />

              Into{" "}
              <span className="text-primary">
                Execution-Ready
              </span>

              <br />
              Business Blueprints
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-7 text-lg sm:text-xl leading-9 text-muted-foreground max-w-xl">
              Direction AI helps founders transform messy ideas
              into structured execution plans using intelligent
              AI workflows.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">

              <Link href="/login" className="gradient-primary text-white h-14 px-8 rounded-2xl font-semibold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 inline-flex items-center">
                Start Building
              </Link>

              <button className="h-14 px-7 rounded-2xl border border-border bg-card text-foreground font-semibold flex items-center gap-3 hover:border-primary hover:text-primary transition-all duration-200 shadow-sm">
                <PlayCircle size={22} />
                Watch Demo
              </button>
            </div>

            {/* BOTTOM TEXT */}
            <div className="mt-8 flex items-center gap-3 text-muted-foreground">
              
              <div className="w-6 h-6 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center">
                <Sparkles size={12} className="text-primary" />
              </div>

              <p className="text-sm font-medium">
                No product expertise required.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE UI MOCKUP */}
          <div className="relative flex justify-center lg:justify-end">

            {/* OUTER WRAPPER */}
            <div className="relative w-full max-w-[560px] rounded-[32px] border border-border bg-card p-5 shadow-xl">

              {/* INNER WINDOW */}
              <div className="rounded-[24px] border border-border bg-background overflow-hidden shadow-md">

                {/* TOP BAR */}
                <div className="h-14 border-b border-border flex items-center justify-between px-5 bg-card">

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-blue-300" />
                  </div>

                  <span className="text-xs font-bold tracking-[0.15em] text-muted uppercase">
                    Mission Control
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-4">

                  {/* TOP GRID */}
                  <div className="grid grid-cols-2 gap-4">

                    {/* LEFT CARD */}
                    <div className="rounded-2xl border border-dashed border-border bg-card p-4 h-[120px]">
                      <div className="space-y-3">
                        <div className="h-3 w-20 rounded-full bg-border" />
                        <div className="h-3 w-32 rounded-full bg-border" />
                        <div className="h-3 w-40 rounded-full bg-border/70" />
                      </div>
                    </div>

                    {/* RIGHT CARD */}
                    <div className="rounded-2xl border border-primary/20 bg-card p-4 h-[120px] flex flex-col justify-between">

                      <h3 className="text-xs font-bold text-primary tracking-wide uppercase">
                        PRD Generator
                      </h3>

                      <div className="h-10 rounded-xl gradient-primary shadow-md" />
                    </div>
                  </div>

                  {/* BOTTOM CARD */}
                  <div className="rounded-2xl bg-card p-5 border border-border h-[120px]">

                    <div className="flex gap-4">
                      
                      <div className="w-14 h-14 rounded-2xl bg-background border border-border" />

                      <div className="flex-1 space-y-4 pt-1">
                        <div className="h-3 rounded-full bg-border w-[90%]" />
                        <div className="h-3 rounded-full bg-border w-[65%]" />
                        <div className="h-3 rounded-full bg-border/70 w-[40%]" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* FLOATING BLUR */}
              <div className="absolute -z-10 top-10 right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
