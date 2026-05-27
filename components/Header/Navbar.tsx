"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

const navItems = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Privacy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms-and-conditions" },
];

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isLoggedIn = Boolean(user && accessToken);

  const handleProfileClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push(user.onboardingDone ? "/dashboard" : "/onboard");
  };

  return (
    <header className="w-full sticky top-0 z-50">
      <nav className="glass-card border border-bordr px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        
        {/* LEFT */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/LOGO.png" alt="Direction AI logo" width={36} height={36} className="rounded-xl object-cover shadow-md" />

          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            Direction AI
          </h1>
        </Link>

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
          {isLoggedIn ? (
            <button
              onClick={handleProfileClick}
              className="h-11 px-4 rounded-xl border border-border bg-card text-foreground text-sm font-semibold shadow-sm hover:border-primary transition-all duration-200 flex items-center gap-3"
            >
              <span className="w-8 h-8 rounded-lg gradient-primary text-white flex items-center justify-center font-bold text-xs">
                {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
              </span>
              <span className="max-w-[160px] truncate">{user?.name ?? user?.email}</span>
            </button>
          ) : (
            <Link href="/login" className="gradient-primary text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
              Start Building
            </Link>
          )}
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

            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenu(false);
                  handleProfileClick();
                }}
                className="mt-3 h-12 rounded-xl text-sm font-semibold shadow-md border border-border bg-card text-foreground flex items-center justify-center"
              >
                Profile
              </button>
            ) : (
              <Link href="/login" className="gradient-primary text-white mt-3 h-12 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center">
                Start Building
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
