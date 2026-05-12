"use client";

import React, { useState } from "react";
import {
  Rocket,
  Building2,
  BriefcaseBusiness,
  User,
  Code2,
  GraduationCap,
  Lightbulb,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const userTypes = [
  {
    title: "Startup Founder",
    subtitle: "Building the next big thing",
    icon: Rocket,
  },
  {
    title: "Agency Owner",
    subtitle: "Scaling client services",
    icon: Building2,
  },
  {
    title: "Product Manager",
    subtitle: "Driving roadmap success",
    icon: BriefcaseBusiness,
  },
  {
    title: "Freelancer",
    subtitle: "Independent professional",
    icon: User,
  },
  {
    title: "Developer",
    subtitle: "Building core tech",
    icon: Code2,
  },
  {
    title: "Student Founder",
    subtitle: "Learning and launching",
    icon: GraduationCap,
  },
  {
    title: "Consultant",
    subtitle: "Strategic advisor",
    icon: Lightbulb,
  },
];

const sources = [
  "YouTube",
  "Instagram",
  "Google Search",
  "LinkedIn",
  "Twitter / X",
  "Newsletter",
  "Friend / Colleague",
];

const goals = [
  {
    title: "Validate My Startup Idea",
    subtitle: "Market research and user feedback loops",
  },
  {
    title: "Build an MVP",
    subtitle: "Rapid prototyping and lean development",
  },
  {
    title: "Create PRD & Roadmap",
    subtitle: "Structured documentation and planning",
  },
  {
    title: "Raise Funding",
    subtitle: "Investor decks and growth modeling",
  },
];

const stages = [
  "Just an Idea",
  "Early Validation",
  "MVP Planning",
  "Already Building",
  "Scaling Startup",
];

const OnboardingProcess = () => {
  const [selectedUser, setSelectedUser] = useState("Startup Founder");
  const [selectedSource, setSelectedSource] = useState("LinkedIn");
  const [selectedGoal, setSelectedGoal] = useState("Build an MVP");
  const [selectedStage, setSelectedStage] = useState(0);

  return (
    <section className="min-h-screen bg-background overflow-hidden relative">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* MAIN CARD */}
          <div className="rounded-[32px] border border-border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="p-6 sm:p-8 border-b border-border">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-primary/5 mb-6">
                <Sparkles
                  size={14}
                  className="text-primary"
                />

                <span className="text-xs sm:text-sm font-semibold text-primary">
                  Welcome to Direction AI
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                Let&apos;s Personalize Your
                <span className="text-primary">
                  {" "}Startup Workspace
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-8 text-muted-foreground max-w-3xl">
                We&apos;ll ask a few quick questions to better
                understand your goals, startup stage, and workflow.
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-6 sm:p-8 space-y-12">

              {/* USER TYPE */}
              <div>

                <h2 className="text-2xl font-bold text-foreground mb-6">
                  What best describes you?
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                  {userTypes.map((item, index) => {
                    const Icon = item.icon;
                    const active =
                      selectedUser === item.title;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          setSelectedUser(item.title)
                        }
                        className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                          active
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border bg-background hover:border-primary/30"
                        }`}
                      >

                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                            active
                              ? "gradient-primary"
                              : "bg-primary/10"
                          }`}
                        >
                          <Icon
                            size={22}
                            className={
                              active
                                ? "text-white"
                                : "text-primary"
                            }
                          />
                        </div>

                        <h3 className="text-lg font-bold text-foreground leading-tight">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {item.subtitle}
                        </p>

                        {active && (
                          <div className="absolute top-4 right-4 w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                            <Check
                              size={14}
                              className="text-white"
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SOURCE */}
              <div>

                <h2 className="text-2xl font-bold text-foreground mb-6">
                  How did you hear about Direction AI?
                </h2>

                <div className="flex flex-wrap gap-3">

                  {sources.map((source, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedSource(source)
                      }
                      className={`h-12 px-5 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
                        selectedSource === source
                          ? "gradient-primary text-white border-primary shadow-lg"
                          : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>

              {/* GOALS */}
              <div>

                <h2 className="text-2xl font-bold text-foreground mb-6">
                  What are you mainly trying to achieve?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {goals.map((goal, index) => {
                    const active =
                      selectedGoal === goal.title;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          setSelectedGoal(goal.title)
                        }
                        className={`relative rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                          active
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border bg-background hover:border-primary/30"
                        }`}
                      >

                        <div className="flex items-start gap-4">

                          <div
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-1 ${
                              active
                                ? "gradient-primary border-primary"
                                : "border-border"
                            }`}
                          >
                            {active && (
                              <Check
                                size={14}
                                className="text-white"
                              />
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-foreground">
                              {goal.title}
                            </h3>

                            <p className="mt-2 text-sm leading-7 text-muted-foreground">
                              {goal.subtitle}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STAGE */}
              <div>

                <h2 className="text-2xl font-bold text-foreground mb-10">
                  What stage are you currently at?
                </h2>

                {/* PROGRESS */}
                <div className="relative">

                  {/* LINE */}
                  <div className="absolute top-4 left-0 w-full h-[2px] bg-border" />

                  {/* ACTIVE LINE */}
                  <div
                    className="absolute top-4 left-0 h-[2px] gradient-primary transition-all duration-500"
                    style={{
                      width: `${
                        (selectedStage /
                          (stages.length - 1)) *
                        100
                      }%`,
                    }}
                  />

                  <div className="relative flex items-center justify-between gap-4">

                    {stages.map((stage, index) => {
                      const active =
                        selectedStage >= index;

                      return (
                        <button
                          key={index}
                          onClick={() =>
                            setSelectedStage(index)
                          }
                          className="flex flex-col items-center text-center group"
                        >

                          <div
                            className={`w-8 h-8 rounded-full border-4 transition-all duration-300 ${
                              active
                                ? "border-primary bg-primary shadow-lg"
                                : "border-border bg-background"
                            }`}
                          />

                          <span
                            className={`mt-4 text-xs sm:text-sm font-semibold leading-5 transition-all duration-300 ${
                              active
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {stage}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">

              <div className="flex items-center gap-3 text-muted-foreground text-sm">

                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles
                    size={14}
                    className="text-primary"
                  />
                </div>

                This helps Direction AI generate smarter startup blueprints.
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">

                <button className="flex-1 sm:flex-none h-12 px-6 rounded-2xl border border-border bg-background text-muted-foreground font-semibold hover:border-primary hover:text-primary transition-all duration-300">
                  Skip for now
                </button>

                <button className="group flex-1 sm:flex-none h-12 px-7 rounded-2xl gradient-primary text-white font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3">
                  Continue to Workspace

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden xl:block">

            <div className="sticky top-8 rounded-[32px] border border-border bg-card/80 backdrop-blur-xl shadow-2xl p-6 overflow-hidden">

              {/* GLOW */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />

              <div className="relative z-10">

                <div className="flex items-center gap-3 mb-8">

                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                    <Sparkles
                      size={22}
                      className="text-white"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">
                      AI Personalization
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Tailoring your startup OS
                    </p>
                  </div>
                </div>

                {/* AI CARDS */}
                <div className="space-y-4">

                  <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                    <p className="text-sm font-bold text-primary mb-2">
                      Founder detected
                    </p>

                    <p className="text-sm leading-7 text-muted-foreground">
                      Prioritizing leadership & vision tools.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-primary/10 bg-background p-5">
                    <p className="text-sm font-bold text-primary mb-2">
                      MVP Roadmap Recommended
                    </p>

                    <p className="text-sm leading-7 text-muted-foreground">
                      Generating 60-day launch strategy.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-primary/10 bg-background p-5">
                    <p className="text-sm font-bold text-primary mb-2">
                      PRD Generator Recommended
                    </p>

                    <p className="text-sm leading-7 text-muted-foreground">
                      Auto-loading requirements templates.
                    </p>
                  </div>
                </div>

                {/* VISUAL */}
                <div className="mt-8 rounded-[28px] overflow-hidden border border-border bg-background h-[240px] relative">

                  {/* GRID */}
                  <div
                    className="absolute inset-0 opacity-[0.4]"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(11,4,207,0.06) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(11,4,207,0.06) 1px, transparent 1px)
                      `,
                      backgroundSize: "28px 28px",
                    }}
                  />

                  {/* FLOATING ORB */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full gradient-primary blur-2xl opacity-30 animate-pulse" />

                  {/* TEXT */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-sm italic text-muted-foreground">
                      Refining workspace environment...
                    </p>
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

export default OnboardingProcess;