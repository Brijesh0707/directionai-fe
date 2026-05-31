"use client";

import React from "react";
import {
  FileCode2,
  LineChart,
  ClipboardCheck,
  Blocks,
  BarChart3,
  ShieldCheck,
  Network,
  Users,
} from "lucide-react";

const features = [
  {
    title: "AI PRD Generator",
    description:
      "Detailed technical requirements generated in seconds from conversational prompts.",
    icon: FileCode2,
  },
  {
    title: "Market Research",
    description:
      "Real-time competitor analysis and market opportunity scoring.",
    icon: LineChart,
  },
  {
    title: "Startup Validation",
    description:
      "Heuristic-based stress testing for your business assumptions.",
    icon: ClipboardCheck,
  },
  {
    title: "Feature Hierarchy",
    description:
      "Prioritize your backlog using impact-effort mapping via AI.",
    icon: Blocks,
  },
  {
    title: "GTM Planner",
    description:
      "Step-by-step marketing sequences for your specific target audience.",
    icon: BarChart3,
  },

  {
    title: "Team Mapping",
    description:
      "Define the exact roles and skills needed to build your vision.",
    icon: Users,
  },
];

const Security = () => {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

            <span className="text-sm font-medium text-muted-foreground">
              Startup Infrastructure
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Everything Needed To
            <span className="text-primary"> Launch Smarter</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Direction AI combines planning, validation, execution,
            and collaboration into one unified operating system.
          </p>
        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group relative rounded-[28px] border border-border bg-card/80 backdrop-blur-xl p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 overflow-hidden"
              >

                {/* HOVER GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                </div>

                {/* ICON */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    size={30}
                    className="text-primary"
                  />
                </div>

                {/* CONTENT */}
                <div className="relative z-10">

                  <h3 className="text-2xl font-bold text-foreground leading-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-5 text-base leading-8 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* NUMBER */}
                <div className="absolute top-5 right-5 text-5xl font-black text-border/60 select-none">
                  0{index + 1}
                </div>

                {/* BOTTOM BAR */}
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full gradient-primary transition-all duration-500" />
              </div>
            );
          })}
        </div>

     
      </div>
    </section>
  );
};

export default Security;