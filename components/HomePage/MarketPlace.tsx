"use client";

import React from "react";
import {
  ArrowRight,
  Star,
  BadgeCheck,
} from "lucide-react";

const experts = [
  {
    name: "Marcus Chen",
    role: "Senior UI/UX Designer",
    quote:
      "Expert at taking AI-generated PRDs and turning them into pixel-perfect Material Design systems.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    skills: ["Figma", "Prototyping"],
  },
  {
    name: "Sarah Jenkins",
    role: "Software Architect",
    quote:
      "Specializing in scalable backend infrastructure for early-stage SaaS startups.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    skills: ["Node.js", "AWS"],
  },
  {
    name: "David Miller",
    role: "GTM Consultant",
    quote:
      "Turning product roadmaps into sustainable customer acquisition machines.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    skills: ["Marketing", "Strategy"],
  },
];

const MarketPlace = () => {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">

          {/* LEFT */}
          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

              <span className="text-sm font-medium text-muted-foreground">
                Expert Marketplace
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Handoff to
              <span className="text-primary">
                {" "}Vetted Experts
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Don&apos;t just plan. Build with our pre-vetted network
              of startup specialists, designers, engineers,
              and GTM strategists.
            </p>
          </div>

          {/* RIGHT BUTTON */}
          <button className="group self-start lg:self-auto inline-flex items-center gap-3 h-14 px-7 rounded-2xl gradient-primary text-white font-semibold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
            View Marketplace

            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {experts.map((expert, index) => (
            <div
              key={index}
              className="group relative rounded-[32px] border border-border bg-card/80 backdrop-blur-xl p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 overflow-hidden"
            >

              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
              </div>

              {/* VERIFIED BADGE */}
              <div className="absolute top-5 right-5 flex items-center gap-1 rounded-full bg-primary/10 border border-primary/10 px-3 py-1">
                <BadgeCheck
                  size={14}
                  className="text-primary"
                />

                <span className="text-xs font-bold text-primary">
                  Verified
                </span>
              </div>

              {/* PROFILE */}
              <div className="relative z-10 flex items-center gap-4">

                <div className="relative">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-border shadow-md"
                  />

                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-card" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {expert.name}
                  </h3>

                  <p className="mt-1 text-muted-foreground font-medium">
                    {expert.role}
                  </p>
                </div>
              </div>

              {/* QUOTE */}
              <div className="relative z-10 mt-8">

                <div className="flex items-start gap-2 mb-4">
                  <Star
                    size={16}
                    className="text-primary mt-1 shrink-0"
                  />

                  <p className="text-base italic leading-8 text-muted-foreground">
                    “{expert.quote}”
                  </p>
                </div>
              </div>

              {/* SKILLS */}
              <div className="relative z-10 mt-8 flex flex-wrap gap-3">

                {expert.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="px-4 py-2 rounded-xl bg-background border border-border text-sm font-semibold text-foreground shadow-sm"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              {/* BOTTOM BAR */}
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full gradient-primary transition-all duration-500" />
            </div>
          ))}
        </div>

      
      </div>
    </section>
  );
};

export default MarketPlace;