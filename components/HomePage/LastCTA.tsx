"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

const LastCTA = () => {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28 lg:py-36 bg-primary">

      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* TOP GLOW */}
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 blur-3xl rounded-full" />

      {/* SIDE GLOWS */}
      <div className="absolute bottom-[-120px] left-[-120px] w-[320px] h-[320px] bg-white/10 blur-3xl rounded-full" />

      <div className="absolute top-[-120px] right-[-120px] w-[320px] h-[320px] bg-secondary/20 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-10 text-center">

        {/* BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
          <span className="text-sm font-medium text-white/80">
            AI-Powered Startup Execution
          </span>
        </div>

        {/* HEADING */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Your Startup Idea Deserves
          <br />

          <span className="text-white/90">
            Structured Execution.
          </span>
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-8 text-lg sm:text-xl leading-9 text-white/70 max-w-3xl mx-auto">
          Transform messy ideas into execution-ready blueprints,
          product roadmaps, and launch systems powered by Direction AI.
        </p>

        {/* BUTTONS */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">

          {/* PRIMARY BUTTON */}
          <Link href="/login" className="group h-16 px-10 rounded-2xl bg-white text-primary font-bold text-lg shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center gap-3">

            Start Building Now

            <ArrowRight
              size={22}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          {/* SECONDARY BUTTON */}
          {/* <button className="h-16 px-10 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300">
            Talk to an Expert
          </button> */}
        </div>

    
      </div>
    </section>
  );
};

export default LastCTA;
