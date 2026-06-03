"use client";

import React, { useState } from "react";
import SideBarDashboardWrapper from "@/providers/SideBarDashboardWrapper";
import { Bell, Shield, FileText, LogOut, Loader2, Sparkles } from "lucide-react";
import { authService } from "@/services/auth.service";
import { loadRazorpayScript } from "@/services/razorpay.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSession, updateUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type PlanCode = "PROJECT_20" | "PROJECT_30";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanCode | null>(null);
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

  const handleBuy = async (planCode: PlanCode) => {
    if (loadingPlan) return;

    setPlanNotice("");
    setLoadingPlan(planCode);

    try {
      const orderResponse = await authService.createPlanOrder(planCode);
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay checkout. Please try again.");
      }

      const checkout = new window.Razorpay({
        key: orderResponse.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderResponse.order.amountPaise,
        currency: "INR",
        name: "Direction AI",
        description: `${orderResponse.plan.name} - ${orderResponse.plan.projects} project credits`,
        order_id: orderResponse.order.orderId,
        prefill: {
          name: user?.name ?? undefined,
          email: user?.email ?? undefined,
        },
        theme: {
          color: "#0B04CF",
        },
        notes: {
          planCode: orderResponse.plan.code,
          planName: orderResponse.plan.name,
        },
        handler: async (response) => {
          try {
            const verified = await authService.verifyPlanPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            dispatch(updateUser(verified.user));
            window.dispatchEvent(new Event("direction:entitlement-updated"));
            setPlanNotice(`${verified.plan.name} activated successfully.`);
            toast.success(`${verified.plan.name} activated successfully.`);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Payment verification failed";
            setPlanNotice(message);
            toast.error(message);
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
          },
        },
      });

      checkout.on("payment.failed", (payload) => {
        const message = payload?.reason || "Payment failed. No credits were added.";
        setPlanNotice(message);
        toast.error(message);
        setLoadingPlan(null);
      });

      checkout.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout";
      setPlanNotice(message);
      toast.error(message);
      setLoadingPlan(null);
    }
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
                <button
                  onClick={() => void handleBuy("PROJECT_20")}
                  disabled={loadingPlan !== null}
                  className="h-9 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingPlan === "PROJECT_20" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {loadingPlan === "PROJECT_20" ? "Processing..." : "Buy Now (20)"}
                </button>
                <button
                  onClick={() => void handleBuy("PROJECT_30")}
                  disabled={loadingPlan !== null}
                  className="h-9 px-4 rounded-xl border border-border text-foreground text-sm font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingPlan === "PROJECT_30" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {loadingPlan === "PROJECT_30" ? "Processing..." : "Buy Now (30)"}
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
