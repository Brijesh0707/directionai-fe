"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Play } from "lucide-react";

const navItems = [
  { name: "Features", href: "#" },
  { name: "Templates", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Resources", href: "#" },
];

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 px-3 sm:px-5 pt-3">
      <nav className="glass-card rounded-2xl border border-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <Play
              size={16}
              className="text-white fill-white ml-[2px]"
            />
          </div>

          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            Direction AI
          </h1>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex items-center">
          <button className="gradient-primary text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
            Start Building
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-foreground"
        >
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="lg:hidden mt-3 glass-card rounded-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-card hover:text-primary transition-all"
              >
                {item.name}
              </Link>
            ))}

            <button className="gradient-primary text-white mt-3 h-12 rounded-xl text-sm font-semibold shadow-md">
              Start Building
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;