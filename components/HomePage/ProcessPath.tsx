"use client";

import React from "react";
import {
  FileText,
  BrainCircuit,
  Compass,
  Rocket,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Describe Your Idea",
    description:
      "Simply dump your thoughts. Voice notes, rough notes, or partial decks are all welcome.",
    icon: FileText,
  },
  {
    id: "02",
    title: "AI Clarifies Everything",
    description:
      "Our engine asks the right questions to fill the gaps in your business logic and model.",
    icon: BrainCircuit,
  },
  {
    id: "03",
    title: "Generate Blueprint",
    description:
      "Instantly receive a professional PRD, roadmap, and GTM strategy structured for execution.",
    icon: Compass,
  },
  {
    id: "04",
    title: "Build With Experts",
    description:
      "Connect with top-tier UI/UX designers and developers directly to start building.",
    icon: Rocket,
  },
];

const ProcessPath = () => {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
      
      {/* BACKGROUND BLURS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

            <span className="text-sm font-medium text-muted-foreground">
              Structured AI Workflow
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Systematic Path to Launch
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our workflow bridges the gap between vision and execution
            through structured AI analysis.
          </p>
        </div>

        {/* PROCESS GRID */}
        <div className="relative mt-16">

          {/* CONNECTING LINE */}
          <div className="hidden xl:block absolute top-24 left-0 right-0 z-0">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="group relative min-h-[420px] rounded-[30px] border border-border bg-card/90 backdrop-blur-xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30"
                >

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-primary/10 blur-3xl rounded-full" />
                  </div>

                  {/* STEP NUMBER */}
                  <div className="absolute top-6 right-6 text-6xl font-black text-border/70 select-none">
                    {step.id}
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 flex flex-col h-full">

                    {/* ICON */}
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-8 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon
                        size={28}
                        className="text-primary"
                      />
                    </div>

                    {/* TITLE */}
                    <h3 className="text-3xl font-bold leading-tight text-foreground">
                      {index + 1}. {step.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-6 text-lg leading-9 text-muted-foreground">
                      {step.description}
                    </p>

                    {/* SPACER */}
                    <div className="flex-1" />
                  </div>

                  {/* BOTTOM ANIMATION BAR */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full gradient-primary transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessPath;