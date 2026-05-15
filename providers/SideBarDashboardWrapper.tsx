"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Menu,
  X,
  LogOut,
  ChevronRight,
  MessageSquare,
  Search,
  Settings,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { chatService } from "@/services/chat.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSession } from "@/store/authSlice";
import AppLoadingScreen from "@/components/common/AppLoadingScreen";
import { ChatSessionSummary } from "@/types/chat";

interface SideBarDashboardWrapperProps {
  children: React.ReactNode;
}

const PAGE_SIZE = 12;

const SideBarDashboardWrapper = ({ children }: SideBarDashboardWrapperProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [chatHistory, setChatHistory] = useState<ChatSessionSummary[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user || !accessToken) {
      router.replace("/login");
      return;
    }
    if (!user.onboardingDone) {
      router.replace("/onboard");
    }
  }, [accessToken, router, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadFirstPage = async () => {
      setLoadingInitial(true);
      setPage(1);
      setHasMore(false);

      try {
        const response = await chatService.listSessionSummaries({
          search: debouncedSearch || undefined,
          limit: PAGE_SIZE,
          page: 1,
        });

        setChatHistory(response.items);
        setHasMore(response.hasMore);
      } catch (error) {
        console.error("Failed to load chat summaries", error);
        setChatHistory([]);
        setHasMore(false);
      } finally {
        setLoadingInitial(false);
      }
    };

    void loadFirstPage();
  }, [debouncedSearch]);

  useEffect(() => {
    if (collapsed || loadingInitial || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        setLoadingMore(true);

        void (async () => {
          try {
            const nextPage = page + 1;
            const response = await chatService.listSessionSummaries({
              search: debouncedSearch || undefined,
              limit: PAGE_SIZE,
              page: nextPage,
            });

            setChatHistory((prev) => [...prev, ...response.items]);
            setPage(nextPage);
            setHasMore(response.hasMore);
          } catch (error) {
            console.error("Failed to load more chat summaries", error);
          } finally {
            setLoadingMore(false);
          }
        })();
      },
      { rootMargin: "200px" },
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [collapsed, debouncedSearch, hasMore, loadingInitial, loadingMore, page]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
    } finally {
      dispatch(clearSession());
      router.replace("/login");
      setLoggingOut(false);
    }
  };

  const handleSettings = () => {
    setShowUserMenu(false);
    router.push("/dashboard/settings");
  };

  const formatTimestamp = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  const sidebarTitle = useMemo(() => (debouncedSearch ? "Search Results" : "Recent Chats"), [debouncedSearch]);

  if (!user || !accessToken) {
    return <AppLoadingScreen label="Checking session..." />;
  }

  return (
    // FIX 1 (Mobile gap): Removed `overflow-hidden` from root so the fixed sidebar
    // doesn't interact with the stacking context. The main content area handles
    // its own scroll independently.
    <div className="flex h-screen bg-white">
      {loggingOut && <AppLoadingScreen label="Signing out..." />}

      {/* FIX 1 (Mobile gap): Overlay only renders when mobileOpen; z-40 sits below sidebar z-50 */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/*
        SIDEBAR
        FIX 1 (Mobile gap):
          - On mobile: always `fixed`, slide in/out via translate.
            No `lg:relative` fallback that would inject layout width on mobile.
          - On desktop (lg+): `relative` so it participates in flex layout normally.
          - `shrink-0` on desktop only via `lg:shrink-0`.
        FIX 2 (Collapsed horizontal scroll):
          - Added `overflow-x-hidden` to the aside so icons never push width beyond w-[72px].
      */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-50 h-screen
          border-r border-gray-200
          bg-white
          transition-all duration-200 ease-out
          flex flex-col
          lg:shrink-0
          overflow-x-hidden
          ${collapsed ? "w-[72px]" : "w-[280px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="relative z-10 p-4 border-b border-gray-200 shrink-0">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-2`}>
            {!collapsed && (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Image
                  src="/LOGO.png"
                  alt="Direction AI logo"
                  width={32}
                  height={32}
                  className="rounded-lg shrink-0 object-cover"
                />
                <h1 className="text-base font-bold text-gray-900 tracking-tight truncate">Direction AI</h1>
              </div>
            )}

            {collapsed && (
              <Image
                src="/LOGO.png"
                alt="Direction AI logo"
                width={32}
                height={32}
                className="rounded-lg object-cover shrink-0"
              />
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg border border-gray-200 bg-white hover:border-[#0B04CF] transition-all items-center justify-center text-gray-400 hover:text-[#0B04CF] shrink-0"
            >
              {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            </button>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200 shrink-0">
          <button
            onClick={() => {
              setMobileOpen(false);
              router.push("/dashboard");
            }}
            className={`
              h-10 rounded-lg bg-gradient-to-r from-[#0B04CF] to-[#1208E8]
              text-white font-medium shadow-sm hover:opacity-90
              transition-all duration-200 flex items-center justify-center gap-2 text-sm
              w-full
            `}
          >
            <Plus size={16} className="shrink-0" />
            {!collapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Expanded sidebar: search + chat list */}
        {!collapsed && (
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-3">
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B04CF] transition-colors"
                />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 px-2">
                {sidebarTitle}
              </p>

              <div className="space-y-1">
                {loadingInitial ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="rounded-lg border border-gray-100 p-2 animate-pulse">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded bg-gray-200 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="h-3 bg-gray-200 rounded w-4/5 mb-2" />
                          <div className="h-2.5 bg-gray-200 rounded w-full" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">No chat history found</p>
                  </div>
                ) : (
                  chatHistory.map((chat) => (
                    (() => {
                      const isActive = pathname === `/dashboard/chat/${chat.id}`;
                      return (
                    <Link
                      key={chat.id}
                      href={`/dashboard/chat/${chat.id}`}
                      onClick={() => setMobileOpen(false)}
                      className={`group block rounded-lg transition-all duration-200 ${
                        isActive ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="p-2">
                        <div className="flex items-start gap-2">
                          <MessageSquare
                            size={14}
                            className={`mt-0.5 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className={`text-sm font-medium truncate ${isActive ? "text-blue-700" : "text-gray-900"}`}>
                                {chat.title}
                              </h4>
                              <span className="text-[10px] text-gray-400 shrink-0">
                                {formatTimestamp(chat.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{chat.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                      );
                    })()
                  ))
                )}

                <div ref={loadMoreRef} className="h-1" />
                {loadingMore && (
                  <div className="space-y-1">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="rounded-lg border border-gray-100 p-2 animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-2.5 bg-gray-200 rounded w-full" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/*
          FIX 2 (Collapsed icons horizontal scroll):
            - Changed container to `overflow-y-auto overflow-x-hidden`
            - Each icon is centered with `flex items-center justify-center w-full`
            - Tooltip uses `pointer-events-none` + `z-[60]` to escape the sidebar clip
            - Removed arbitrary widths that could cause overflow
        */}
        {collapsed && (
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
            <div className="flex flex-col items-center gap-2 px-2">
              {chatHistory.slice(0, 8).map((chat) => (
                (() => {
                  const isActive = pathname === `/dashboard/chat/${chat.id}`;
                  return (
                <Link
                  key={chat.id}
                  href={`/dashboard/chat/${chat.id}`}
                  className="relative group w-full flex justify-center"
                >
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                      isActive
                        ? "bg-blue-50 border-blue-300"
                        : "bg-gray-50 border-gray-200 hover:border-[#0B04CF] hover:bg-blue-50"
                    }`}
                  >
                    <MessageSquare
                      size={16}
                      className={isActive ? "text-blue-600 transition-colors" : "text-gray-400 group-hover:text-[#0B04CF] transition-colors"}
                    />
                  </div>
                  {/* Tooltip — rendered outside overflow clip via fixed z-index */}
                  <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 bg-gray-900 text-white rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[60] shadow-lg max-w-[200px]">
                    <span className="text-xs block truncate">{chat.title}</span>
                    {/* Arrow */}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                </Link>
                  );
                })()
              ))}
            </div>
          </div>
        )}

        {/* User menu */}
        <div className="relative z-10 p-3 border-t border-gray-200 shrink-0">
          <div ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`
                w-full rounded-lg p-2
                flex items-center gap-3
                hover:bg-gray-50 transition-all duration-200
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B04CF] to-[#1208E8] flex items-center justify-center text-white font-bold shadow-sm shrink-0 text-sm">
                {(user.name?.[0] ?? user.email[0] ?? "U").toUpperCase()}
              </div>

              {!collapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {user.name ?? user.email.split("@")[0]}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-gray-400 transition-transform shrink-0 ${showUserMenu ? "rotate-90" : ""}`}
                  />
                </>
              )}
            </button>

            {/* Desktop user dropdown */}
            {showUserMenu && !collapsed && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleSettings}
                  className="w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Settings size={14} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-200"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            )}

            {/* Collapsed sidebar user tooltip/menu */}
            {showUserMenu && collapsed && (
              <div className="absolute bottom-0 left-[calc(100%+8px)] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-[60] min-w-[200px]">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleSettings}
                  className="w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Settings size={14} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-200"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/*
        MAIN CONTENT
        FIX 1 (Mobile gap):
          - On mobile the sidebar is `fixed` and takes no layout space,
            so this div correctly fills the full width (w-full / flex-1).
          - On desktop, flex-1 + min-w-0 shares space with the relative sidebar naturally.
      */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen bg-gray-50">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-gray-200 bg-white px-4 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0"
            >
              <Menu size={16} />
            </button>
            <Image
              src="/LOGO.png"
              alt="Direction AI logo"
              width={24}
              height={24}
              className="rounded object-cover"
            />
            <h1 className="text-sm font-bold text-gray-900">Direction AI</h1>
          </div>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B04CF] to-[#1208E8] flex items-center justify-center text-white font-bold text-sm shrink-0"
          >
            {(user.name?.[0] ?? user.email[0] ?? "U").toUpperCase()}
          </button>
        </header>

        {/* Mobile user menu (bottom-right sheet) */}
        {showUserMenu && (
          <div className="lg:hidden fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[200px]">
            <div className="p-3 border-b border-gray-200">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSettings}
              className="w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-200"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        )}

        <main className="flex-1">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SideBarDashboardWrapper;
