"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Folder,
  Layers3,
  History,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Menu,
  X,
} from "lucide-react";

interface SideBarDashboardWrapperProps {
  children: React.ReactNode;
}

const navItems = [
  {
    name: "Home",
    icon: LayoutDashboard,
    active: true,
  },
  {
    name: "Projects",
    icon: Folder,
  },
  {
    name: "Templates",
    icon: Layers3,
  },
  {
    name: "Recent",
    icon: History,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

const SideBarDashboardWrapper = ({
  children,
}: SideBarDashboardWrapperProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on window resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR - Sticky/Static */}
      <aside
        className={`
          sticky top-0 left-0 z-50 h-screen
          border-r border-border
          bg-card/90 backdrop-blur-2xl
          transition-all duration-300 ease-in-out
          flex flex-col
          shrink-0
          ${
            collapsed
              ? "w-[90px]"
              : "w-[290px]"
          }
          ${
            mobileOpen
              ? "translate-x-0 fixed"
              : "-translate-x-full lg:translate-x-0 fixed lg:relative"
          }
        `}
      >
        {/* GLOW */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

        {/* TOP */}
        <div className="relative z-10 p-5 border-b border-border shrink-0">

          {/* HEADER */}
          <div className="flex items-center justify-between gap-3">

            {/* LOGO */}
            <div
              className={`flex items-center gap-3 transition-all duration-300 ${
                collapsed ? "justify-center w-full" : ""
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shrink-0">
                <span className="text-white font-extrabold text-lg">
                  D
                </span>
              </div>

              {!collapsed && (
                <div>
                  <h1 className="text-lg font-extrabold text-primary">
                    Direction AI
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Startup OS
                  </p>
                </div>
              )}
            </div>

            {/* DESKTOP TOGGLE */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-10 h-10 rounded-xl border border-border bg-background hover:border-primary transition-all items-center justify-center text-muted-foreground hover:text-primary shrink-0"
            >
              {collapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>

            {/* MOBILE CLOSE */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden w-10 h-10 rounded-xl border border-border bg-background flex items-center justify-center shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* NEW PROJECT BUTTON */}
          <button
            className={`mt-6 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 ${
              collapsed ? "w-14 mx-auto" : "w-full"
            }`}
          >
            <Plus size={20} />
            {!collapsed && <span>New Project</span>}
          </button>
        </div>

        {/* NAVIGATION - Scrollable if needed */}
        <div className="relative z-10 flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={index}
                className={`
                  group relative w-full h-14 rounded-2xl
                  flex items-center gap-4 px-4
                  transition-all duration-300
                  ${
                    item.active
                      ? "bg-primary/10 text-primary border border-primary/10"
                      : "text-muted-foreground hover:bg-background hover:text-primary"
                  }
                  ${collapsed ? "justify-center px-0" : ""}
                `}
              >
                {/* ACTIVE GLOW */}
                {item.active && (
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl pointer-events-none" />
                )}

                <div className="relative z-10">
                  <Icon size={20} />
                </div>

                {!collapsed && (
                  <span className="relative z-10 font-semibold text-base">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}

          {/* DIVIDER */}
          <div className="pt-5">
            <div className="border-t border-border" />
          </div>

          {/* STORAGE CARD */}
          {!collapsed && (
            <div className="mt-6 rounded-[28px] border border-border bg-background p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground">
                    Workspace Usage
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    72% storage used
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                  72%
                </div>
              </div>

              {/* PROGRESS */}
              <div className="h-3 rounded-full bg-border overflow-hidden">
                <div className="h-full w-[72%] bg-gradient-to-r from-primary to-primary/60 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* USER */}
        <div className="relative z-10 p-4 border-t border-border shrink-0">
          <div
            className={`rounded-2xl border border-border bg-background p-4 flex items-center gap-3 transition-all duration-300 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {/* AVATAR */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
              B
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground truncate">
                  Brijesh V.
                </h4>
                <p className="text-sm text-muted-foreground">
                  Pro Plan
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* MOBILE HEADER - Sticky */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl px-4 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="w-11 h-11 rounded-2xl border border-border bg-background flex items-center justify-center shrink-0"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-extrabold text-primary">
                Direction AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Dashboard
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
            B
          </div>
        </header>

        {/* PAGE CONTENT - Scrolls naturally */}
        <main className="flex-1">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SideBarDashboardWrapper;