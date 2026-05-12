"use client";

import React from "react";
import {
  Lightbulb,
  BadgeCheck,
  ClipboardList,
  PanelsTopLeft,
  Zap,
} from "lucide-react";

const flowSteps = [
  {
    label: "INPUT",
    title: "Raw Idea",
    icon: Lightbulb,
  },
  {
    label: "STEP 01",
    title: "Validation",
    icon: BadgeCheck,
  },
  {
    label: "STEP 02",
    title: "PRD Engine",
    icon: ClipboardList,
  },
  {
    label: "STEP 03",
    title: "Roadmap",
    icon: PanelsTopLeft,
  },
  {
    label: "OUTPUT",
    title: "Launch",
    icon: Zap,
    active: true,
  },
];

const HowEngineWorks = () => {
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
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 blur-3xl rounded-full" />

      {/* BOTTOM GLOW */}
      <div className="absolute bottom-[-200px] right-[-120px] w-[400px] h-[400px] bg-secondary/20 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* HEADER */}
        <div className="text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />

            <span className="text-sm font-medium text-white/80">
              Intelligent Workflow Automation
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The AI Execution Engine
          </h2>

          <p className="mt-7 text-lg sm:text-xl leading-9 text-white/70 max-w-3xl mx-auto">
            A continuous loop of intelligence that connects your
            initial spark to a full-scale launch.
          </p>
        </div>

        {/* FLOW SECTION */}
        <div className="relative mt-20">

          {/* CONNECTING LINE DESKTOP */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2">
            <div className="h-[2px] w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
          </div>

          {/* STEPS */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

            {flowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className={`group relative rounded-[30px] border backdrop-blur-xl p-8 min-h-[240px] flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                    step.active
                      ? "bg-primary border-white shadow-[0_0_40px_rgba(255,255,255,0.12)]"
                      : "bg-white border-white/20 hover:shadow-2xl"
                  }`}
                >

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className={`absolute top-0 right-0 w-40 h-40 blur-3xl rounded-full ${
                        step.active
                          ? "bg-white/10"
                          : "bg-primary/10"
                      }`}
                    />
                  </div>

                  {/* LABEL */}
                  <span
                    className={`relative z-10 text-xs font-extrabold tracking-[0.2em] uppercase ${
                      step.active
                        ? "text-white/60"
                        : "text-muted"
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* ICON */}
                  <div
                    className={`relative z-10 mt-6 w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      step.active
                        ? "bg-white/10 border border-white/10"
                        : "bg-primary/10 border border-primary/10"
                    }`}
                  >
                    <Icon
                      size={34}
                      className={
                        step.active
                          ? "text-white"
                          : "text-primary"
                      }
                    />
                  </div>

                  {/* TITLE */}
                  <h3
                    className={`relative z-10 mt-6 text-2xl font-bold ${
                      step.active
                        ? "text-white"
                        : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* ACTIVE PULSE */}
                  {step.active && (
                    <div className="absolute inset-0 rounded-[30px] border-2 border-white/20 animate-pulse" />
                  )}

                  {/* STEP NUMBER */}
                  <div
                    className={`absolute top-5 right-5 text-5xl font-black select-none ${
                      step.active
                        ? "text-white/10"
                        : "text-primary/10"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM INFO */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">

          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

            <span className="text-white/80 text-sm font-medium">
              Live AI orchestration engine
            </span>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />

            <span className="text-white/80 text-sm font-medium">
              Real-time execution workflows
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowEngineWorks;