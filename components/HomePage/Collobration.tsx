"use client";

import React from "react";
import {
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

const collaborationPoints = [
  "Real-time AI editing & refinement",
  "Export to PDF",
  "Invite developers for immediate handoff",
];

const Collobration = () => {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT CONTENT */}
          <div>

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

              <span className="text-sm font-medium text-muted-foreground">
                Live Collaboration Workspace
              </span>
            </div>

            {/* HEADING */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Collaborate on Living
              <br />
              <span className="text-primary">
                Blueprints
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-8 text-lg leading-9 text-muted-foreground max-w-xl">
              Your execution plan isn&apos;t a static PDF.
              It&apos;s a dynamic workspace where AI continues
              to refine requirements as you build.
            </p>

            {/* POINTS */}
            <div className="mt-10 space-y-5">

              {collaborationPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >

                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2
                      size={16}
                      className="text-primary"
                    />
                  </div>

                  <p className="text-base sm:text-lg text-foreground font-medium leading-8">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE MOCKUP */}
          <div className="relative">

            {/* OUTER GLOW */}
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-primary/20 blur-3xl rounded-full" />

            {/* MAIN CARD */}
            <div className="relative rounded-[36px] border border-border bg-card/90 backdrop-blur-xl shadow-2xl p-5 sm:p-7 lg:p-8 overflow-hidden">

              {/* TOP BAR */}
              <div className="flex items-center gap-3 mb-8">

                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center">
                  <FolderOpen
                    size={24}
                    className="text-primary"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-muted">
                    Blueprints / Fintech_App_v1
                  </p>

                  <h3 className="mt-2 text-3xl font-extrabold text-foreground leading-tight">
                    Product Requirements
                    <br />
                    Document
                  </h3>
                </div>
              </div>

              {/* CONTENT */}
              <div className="space-y-8">

                {/* EXEC SUMMARY */}
                <div>

                  <h4 className="text-sm uppercase tracking-[0.18em] font-extrabold text-primary mb-4">
                    1. Executive Summary
                  </h4>

                  <p className="text-muted-foreground text-base leading-8">
                    A decentralized payment infrastructure designed
                    for high-frequency micro-transactions in the
                    gaming ecosystem...
                  </p>
                </div>

                {/* AI SUGGESTION */}
                <div className="relative rounded-2xl border border-primary/10 bg-primary/5 p-5 overflow-hidden">

                  {/* SIDE ACCENT */}
                  <div className="absolute top-0 left-0 w-1.5 h-full gradient-primary" />

                  <div className="pl-3">

                    <h5 className="text-sm font-extrabold uppercase tracking-[0.15em] text-primary mb-3">
                      AI Refinement Suggestion
                    </h5>

                    <p className="text-sm sm:text-base text-foreground leading-7">
                      Based on current market trends, consider adding a
                      <span className="font-semibold">
                        {" "}“Gasless Transaction”
                      </span>{" "}
                      feature for user onboarding retention.
                    </p>
                  </div>
                </div>

                {/* SKELETON CONTENT */}
                <div className="space-y-4 pt-2">

                  <div className="h-4 rounded-full bg-border w-full" />

                  <div className="h-4 rounded-full bg-border w-[82%]" />

                  <div className="h-4 rounded-full bg-border w-[65%]" />

                  <div className="h-4 rounded-full bg-border/70 w-[50%]" />
                </div>
              </div>

              {/* FLOATING ELEMENT */}
              <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-primary/10 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collobration;