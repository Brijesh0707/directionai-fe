"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";

type CreditPlansProps = {
  compact?: boolean;
};

const plans = [
  {
    name: "Starter",
    price: "₹0",
    description: "Create your first project free with full 4-agent workflow.",
    features: ["1 Free Project", "All 4 Agents Included", "No Card Required"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Growth 20",
    price: "₹500",
    description: "Great for founders validating ideas every week.",
    features: ["20 Project Credits", "₹25 / Project", "All 4 Agents Included", "Priority Queue"],
    cta: "Buy Credits",
    popular: true,
  },
  {
    name: "Scale 30",
    price: "₹750",
    description: "Built for agencies and high-throughput execution teams.",
    features: ["30 Project Credits", "₹25 / Project", "All 4 Agents Included", "Team-Friendly Throughput"],
    cta: "Buy Credits",
    popular: false,
  },
];

const CreditPlans = ({ compact = false }: CreditPlansProps) => {
  const [notice, setNotice] = React.useState("");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#0B04CF]/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-300/20 blur-3xl rounded-full" />

      <div className="relative z-10">
        <div className={`text-center max-w-3xl mx-auto ${compact ? "mb-10" : "mb-14"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-5">
            <Sparkles size={15} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Credit Plans</span>
          </div>
          <h2 className={`${compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"} font-extrabold tracking-tight text-foreground`}>
            Choose Your Credits
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Transparent model: ₹20 cost + ₹5 margin = ₹25 per project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-3xl border bg-white/85 backdrop-blur-xl p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-[#0B04CF] shadow-[0_20px_60px_rgba(11,4,207,0.18)]"
                  : "border-gray-200 hover:border-[#0B04CF]/40 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#0B04CF] to-[#1208E8]">
                  Most Popular
                </div>
              )}

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{plan.name}</p>
              <div className="mt-3 flex items-end gap-2">
                <h3 className="text-5xl font-extrabold text-gray-900">{plan.price}</h3>
                <span className="text-sm text-gray-500 mb-2">one-time</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-gray-600">{plan.description}</p>

              <div className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0B04CF]/10 flex items-center justify-center mt-0.5">
                      <Check size={14} className="text-[#0B04CF]" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">{feature}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setNotice("Razorpay coming soon. Checkout is not live yet.")}
                className={`mt-8 w-full h-12 rounded-xl font-semibold transition ${
                  plan.popular
                    ? "text-white bg-gradient-to-r from-[#0B04CF] to-[#1208E8] hover:opacity-95"
                    : "border border-gray-300 text-gray-800 hover:border-[#0B04CF] hover:text-[#0B04CF] bg-white"
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>

        {notice && <p className="mt-6 text-center text-sm font-medium text-amber-600">{notice}</p>}
      </div>
    </section>
  );
};

export default CreditPlans;

