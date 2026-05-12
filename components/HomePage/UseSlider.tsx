"use client";

import React from "react";

const companies = [
  "VELOCITY",
  "QUANTUM",
  "NEXUS",
  "APEX",
  "STRATUM",
];

const UseSlider = () => {
  return (
    <section className="relative border-y border-border bg-background overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-14">

        {/* TOP TEXT */}
        <div className="flex items-center justify-center mb-8">
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.25em] text-muted">
            Used by 12,000+ founders & agencies
          </p>
        </div>

        {/* LOGO ROW */}
        <div className="relative">
          
          {/* GRADIENT FADE LEFT */}
          <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          {/* GRADIENT FADE RIGHT */}
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* SLIDER */}
          <div className="flex items-center justify-center flex-wrap gap-x-10 sm:gap-x-16 lg:gap-x-20 gap-y-5">
            {companies.map((company) => (
              <div
                key={company}
                className="group cursor-pointer"
              >
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-muted hover:text-primary transition-all duration-300">
                  {company}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseSlider;