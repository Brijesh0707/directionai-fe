"use client";

import React from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { loadRazorpayScript } from "@/services/razorpay.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/authSlice";

type CreditPlansProps = {
  compact?: boolean;
};

type PlanCode = "PROJECT_20" | "PROJECT_30";

const plans: Array<
  | {
      isFree: true;
      name: string;
      price: string;
      description: string;
      features: string[];
      cta: string;
      popular: boolean;
    }
  | {
      isFree?: false;
      code: PlanCode;
      name: string;
      price: string;
      description: string;
      features: string[];
      cta: string;
      popular: boolean;
    }
> = [
  {
    isFree: true,
    name: "Starter",
    price: "₹0",
    description: "Create your first project free with the full 4-agent workflow.",
    features: ["1 Free Project", "All 4 Agents Included", "No Card Required"],
    cta: "Included",
    popular: false,
  },
  {
    code: "PROJECT_20",
    name: "Growth 20",
    price: "₹500",
    description: "Great for founders validating ideas every week.",
    features: ["20 Project Credits", "All 4 Agents Included", "Priority Queue"],
    cta: "Buy Credits",
    popular: true,
  },
  {
    code: "PROJECT_30",
    name: "Scale 30",
    price: "₹750",
    description: "Built for agencies and high-throughput execution teams.",
    features: ["30 Project Credits", "All 4 Agents Included", "Team-Friendly Throughput"],
    cta: "Buy Credits",
    popular: false,
  },
];

const loadCheckout = async () => {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Unable to load Razorpay checkout. Please try again.");
  }
  return window.Razorpay;
};

const CreditPlans = ({ compact = false }: CreditPlansProps) => {
  const [notice, setNotice] = React.useState("");
  const [loadingPlan, setLoadingPlan] = React.useState<PlanCode | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleBuy = async (planCode: PlanCode) => {
    if (loadingPlan) return;

    setNotice("");
    setLoadingPlan(planCode);

    try {
      const orderResponse = await authService.createPlanOrder(planCode);
      const RazorpayCtor = await loadCheckout();

      const checkout = new RazorpayCtor({
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
            setNotice(`${verified.plan.name} activated successfully.`);
            toast.success(`${verified.plan.name} activated successfully.`);
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Payment verification failed";
            setNotice(message);
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
        const message =
          payload?.reason || "Payment failed. No credits were added.";
        setNotice(message);
        toast.error(message);
        setLoadingPlan(null);
      });

      checkout.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout";
      setNotice(message);
      toast.error(message);
      setLoadingPlan(null);
    }
  };

  return (
    <section className="w-full">
      <div className="w-full">
        <div className={`text-center max-w-3xl mx-auto ${compact ? "mb-10" : "mb-14"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-5">
            <span className="text-sm font-medium text-muted-foreground">Credit Plans</span>
          </div>
          <h2 className={`${compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"} font-extrabold tracking-tight text-foreground`}>
            Choose Your Credits
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch w-full">
          {plans.map((plan) => {
            const isLoading = !plan.isFree && loadingPlan === plan.code;

            return (
              <div
                key={plan.name}
                className={`rounded-3xl border bg-white/85 backdrop-blur-xl p-7 sm:p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-[#0B04CF] shadow-[0_20px_60px_rgba(11,4,207,0.18)]"
                    : "border-gray-200 hover:border-[#0B04CF]/40 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
                }`}
              >
                {plan.popular && (
                  <div className="mb-4 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#0B04CF] to-[#1208E8]">
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

                {plan.isFree ? (
                  <div className="mt-8 w-full h-12 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold flex items-center justify-center">
                    {plan.cta}
                  </div>
                ) : (
                  <button
                    onClick={() => void handleBuy(plan.code)}
                    disabled={Boolean(loadingPlan)}
                    className={`mt-8 w-full h-12 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 ${
                      plan.popular
                        ? "text-white bg-gradient-to-r from-[#0B04CF] to-[#1208E8] hover:opacity-95"
                        : "border border-gray-300 text-gray-800 hover:border-[#0B04CF] hover:text-[#0B04CF] bg-white"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        {plan.cta}
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {notice && <p className="mt-6 text-center text-sm font-medium text-amber-600">{notice}</p>}
      </div>
    </section>
  );
};

export default CreditPlans;
