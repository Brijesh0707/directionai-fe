"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  Lock,
  Sparkles,
} from "lucide-react";

const tags = [
  "PRDs",
  "MVP Roadmaps",
  "Pitch Decks",
  "GTM Strategy",
];

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <section className="min-h-screen bg-background overflow-hidden m-4">

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex overflow-hidden border-r border-border">

          {/* GRID BACKGROUND */}
          <div
            className="absolute inset-0 opacity-[0.6]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(11,4,207,0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(11,4,207,0.06) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* GLOW */}
          <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-primary/10 blur-3xl rounded-full" />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col justify-between w-full p-10">

            {/* TOP LOGO */}
            <div className="flex items-center gap-3">

             
            </div>

            {/* FLOATING UI */}
            <div className="absolute inset-0 pointer-events-none">

              {/* CARD 1 */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 glass-card rounded-2xl border border-border p-5 w-[220px] rotate-2 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary" />

                  <div className="text-xs font-bold text-muted-foreground">
                    PRD_GEN_01
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 rounded-full bg-border w-full" />
                  <div className="h-3 rounded-full bg-border w-[80%]" />
                  <div className="h-3 rounded-full bg-border w-[65%]" />
                </div>
              </div>

              {/* CENTER ICON */}
              <div className="absolute top-1/2 left-[28%] -translate-y-1/2 w-40 h-40 rounded-full bg-card border border-border shadow-2xl flex items-center justify-center animate-pulse">

                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-xl">
                  <BrainCircuit
                    size={40}
                    className="text-white"
                  />
                </div>
              </div>

              {/* INVESTOR CARD */}
              <div className="absolute top-[26%] right-12 glass-card rounded-2xl border border-border p-4 w-[180px] shadow-xl animate-[float_7s_ease-in-out_infinite]">

                <div className="rounded-xl overflow-hidden h-20 gradient-primary mb-4 opacity-90" />

                <p className="text-sm font-semibold text-foreground">
                  Investor Deck v2.4
                </p>
              </div>

              {/* ROADMAP */}
              <div className="absolute bottom-[32%] left-8 glass-card rounded-2xl border border-border p-4 w-[240px] shadow-xl animate-[float_8s_ease-in-out_infinite]">

                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-3">
                  Product Roadmap
                </p>

                <div className="flex gap-2">
                  <div className="h-8 rounded-lg gradient-primary w-[70%]" />

                  <div className="h-8 rounded-lg bg-border w-[30%]" />
                </div>
              </div>
            </div>

            {/* BOTTOM TEXT */}
            <div className="relative z-10 max-w-xl">

              <h2 className="text-6xl font-extrabold leading-[1.05] tracking-tight text-primary">
                Turn Raw Startup Ideas
                Into Structured Execution
              </h2>

              {/* TAGS */}
              <div className="mt-10 flex flex-wrap gap-3">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-semibold text-muted-foreground shadow-sm"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex items-center justify-center p-5 sm:p-8 lg:p-12">

          {/* BG GLOW */}
          <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary/10 blur-3xl rounded-full" />

          {/* CARD */}
          <div className="relative z-10 w-full max-w-[520px] rounded-[36px] border border-border bg-card/90 backdrop-blur-xl shadow-2xl p-7 sm:p-10">

            {/* TOP */}
            <div>

              <p className="text-sm font-semibold text-primary mb-3">
                Welcome to Direction AI
              </p>

              <h3 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                Build Smarter With AI
              </h3>

              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Log in to access your startup OS and accelerate
                your journey from idea to IPO.
              </p>
            </div>

            {/* TABS */}
            <div className="mt-10 flex border-b border-border">

              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 pb-4 text-base font-bold transition-all duration-300 ${
                  activeTab === "login"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 pb-4 text-base font-bold transition-all duration-300 ${
                  activeTab === "signup"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Signup
              </button>
            </div>

            {/* FORM */}
            <div className="mt-8 space-y-6">

              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Workspace Email
                </label>

                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-foreground outline-none focus:border-primary transition-all"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-foreground">
                    Password
                  </label>

                  <button className="text-sm font-semibold text-primary hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-foreground outline-none focus:border-primary transition-all"
                />
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between gap-4">

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary"
                  />

                  <span className="text-muted-foreground font-medium">
                    Remember me
                  </span>
                </label>
              </div>

              {/* BUTTON */}
              <button className="w-full h-14 rounded-2xl gradient-primary text-white font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-300">
                Login to Workspace
              </button>
            </div>

            {/* DIVIDER */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Or Continue With
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

              <button className="h-14 rounded-2xl border border-border bg-background hover:border-primary transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-foreground">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303C33.659 32.657 29.2 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>

                Google
              </button>

          
            </div>

            {/* FOOTER */}
            <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">

              <div className="flex items-center gap-2">
                <Lock size={14} />
                Secure authentication
              </div>

              <div className="flex items-center gap-2">
                <Sparkles size={14} />
                AI-powered workspace
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOAT ANIMATION */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
};

export default LoginScreen;