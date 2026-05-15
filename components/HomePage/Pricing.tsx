"use client";

import React from "react";
import {
  Check,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    name: "Builder",
    price: "$49",
    description: "Perfect for early-stage startup validation.",
    features: [
      "5 Blueprints / mo",
      "AI PRD Generator",
      "Basic Market Insights",
    ],
    button: "Choose Plan",
    popular: false,
  },
  {
    name: "Founder Pro",
    price: "$129",
    description: "Best for founders building execution-ready startups.",
    features: [
      "Unlimited Blueprints",
      "Full Execution Suite",
      "Marketplace Access",
      "Priority AI Queue",
    ],
    button: "Choose Plan",
    popular: true,
  },
  {
    name: "Agency",
    price: "$349",
    description: "Built for agencies managing multiple startup clients.",
    features: [
      "Custom Branding",
      "API Access",
      "Dedicated Success Rep",
    ],
    button: "Choose Plan",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-6">
            <Sparkles
              size={16}
              className="text-primary"
            />

            <span className="text-sm font-medium text-muted-foreground">
              Flexible Startup Pricing
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Built for Founders
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Flexible pricing that grows with your execution pace.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative rounded-[32px] border bg-card/80 backdrop-blur-xl p-8 transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:shadow-2xl ${
                plan.popular
                  ? "border-primary shadow-[0_0_50px_rgba(11,4,207,0.12)] scale-[1.02]"
                  : "border-border hover:border-primary/30"
              }`}
            >

              {/* MOST POPULAR BADGE */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="gradient-primary text-white px-5 py-2 rounded-full text-xs font-extrabold tracking-[0.18em] uppercase shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
              </div>

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col h-full">

                {/* PLAN NAME */}
                <div>
                  <p className="text-sm font-extrabold tracking-[0.18em] uppercase text-muted mb-5">
                    {plan.name}
                  </p>

                  {/* PRICE */}
                  <div className="flex items-end gap-2">
                    <h3 className="text-6xl font-extrabold tracking-tight text-foreground">
                      {plan.price}
                    </h3>

                    <span className="text-lg font-semibold text-muted-foreground mb-2">
                      /mo
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-5 text-base leading-8 text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* FEATURES */}
                <div className="mt-10 space-y-5 flex-1">

                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start gap-4"
                    >

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.popular
                            ? "bg-primary/10 border border-primary/10"
                            : "bg-background border border-border"
                        }`}
                      >
                        <Check
                          size={16}
                          className="text-primary"
                        />
                      </div>

                      <p className="text-base font-medium text-foreground leading-8">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* BUTTON */}
                <button
                  className={`mt-10 h-14 rounded-2xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "gradient-primary text-white shadow-lg hover:scale-[1.02]"
                      : "border border-border bg-background text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {plan.button}
                </button>
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

export default Pricing;
