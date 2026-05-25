"use client";

import React, { useState } from "react";
import SideBarDashboardWrapper from "@/providers/SideBarDashboardWrapper";
import { Bell, Shield, FileText, LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSession } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [planNotice, setPlanNotice] = useState("");

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // clear local session even if API logout fails
    } finally {
      dispatch(clearSession());
      router.replace("/login");
      setLoggingOut(false);
    }
  };

  const handleBuy = async (planCode: "PROJECT_20" | "PROJECT_30") => {
    setPlanNotice(`Razorpay coming soon for ${planCode}. Tokens are not updated yet.`);
  };

  return (
    <SideBarDashboardWrapper>
      <section className="min-h-screen bg-background p-6 sm:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your account preferences.</p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold text-foreground">Project Plan</p>
              <p className="text-sm text-muted-foreground mt-1">
                Plan: {user?.planTier ?? "free"} | Remaining paid credits: {user?.projectCredits ?? 0}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => void handleBuy("PROJECT_20")} className="h-9 px-4 rounded-xl bg-primary text-white text-sm font-semibold">
                  Buy Now (20)
                </button>
                <button onClick={() => void handleBuy("PROJECT_30")} className="h-9 px-4 rounded-xl border border-border text-foreground text-sm font-semibold">
                  Buy Now (30)
                </button>
              </div>
              {planNotice && <p className="mt-3 text-xs text-amber-600 font-medium">{planNotice}</p>}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">Email and activity notifications</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications((prev) => !prev)}
                className={`h-9 px-4 rounded-xl text-sm font-semibold ${notifications ? "bg-primary text-white" : "border border-border text-muted-foreground"}`}
              >
                {notifications ? "Enabled" : "Disabled"}
              </button>
            </div>

            <button
              onClick={() => router.push("/privacy-policy")}
              className="w-full rounded-2xl border border-border bg-card p-5 flex items-center justify-between hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Privacy Policy</p>
                  <p className="text-sm text-muted-foreground">How we process and protect your data</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/terms-and-conditions")}
              className="w-full rounded-2xl border border-border bg-card p-5 flex items-center justify-between hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Terms & Conditions</p>
                  <p className="text-sm text-muted-foreground">Usage terms for Direction AI services</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full rounded-2xl border border-border bg-card p-5 flex items-center gap-3 hover:border-primary transition-colors text-red-500"
            >
              <LogOut size={18} />
              <span className="font-semibold">{loggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </section>
    </SideBarDashboardWrapper>
  );
};

export default SettingsPage;
