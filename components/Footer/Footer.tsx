"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  AtSign,
  Share2,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full mt-1 border-t-4 border-primary bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">

          {/* BRAND */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Image src="/LOGO.png" alt="Direction AI logo" width={40} height={40} className="rounded-xl object-cover shadow-md" />

              <h2 className="text-xl font-bold tracking-tight text-primary">
                Direction AI
              </h2>
            </div>

            <p className="text-muted-foreground text-base leading-8 max-w-sm">
              The mission control for modern founders.
              Transform ideas into blueprints into reality.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="text-sm font-extrabold tracking-[0.2em] text-foreground uppercase mb-6">
              Product
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                href="/#features"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Features
              </Link>

              <Link
                href="/#pricing"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Pricing
              </Link>

              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/settings"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Settings
              </Link>
            </div>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="text-sm font-extrabold tracking-[0.2em] text-foreground uppercase mb-6">
              Resources
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms-and-conditions"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Start Building
              </Link>

              <Link
                href="/login"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Login
              </Link>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-sm font-extrabold tracking-[0.2em] text-foreground uppercase mb-6">
              Legal
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms-and-conditions"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Terms of Service
              </Link>

              <Link
                href="/dashboard/settings"
                className="text-muted-foreground hover:text-primary transition-colors text-base"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-border mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* COPYRIGHT */}
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 Direction AI. All rights reserved.
          </p>

          {/* SOCIALS */}
          <div className="flex items-center gap-3">

            <button className="w-11 h-11 rounded-xl border border-border bg-card hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center text-muted-foreground">
              <Globe size={18} />
            </button>

            <button className="w-11 h-11 rounded-xl border border-border bg-card hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center text-muted-foreground">
              <AtSign size={18} />
            </button>

            <button className="w-11 h-11 rounded-xl border border-border bg-card hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center text-muted-foreground">
              <Share2 size={18} />
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
