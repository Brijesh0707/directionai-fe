"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import AppLoadingScreen from "@/components/common/AppLoadingScreen";

type Step = "request" | "reset";

const ForgotPasswordScreen = () => {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiresInMinutes, setExpiresInMinutes] = useState<number | null>(null);

  const router = useRouter();

  const extractError = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: { message?: string | string[] } } }).response ===
        "object"
    ) {
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response
        ?.data?.message;
      if (Array.isArray(message)) return message[0] ?? "Request failed";
      return message ?? "Request failed";
    }
    return "Something went wrong";
  };

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.requestPasswordReset(email.trim());
      setExpiresInMinutes(response.expiresInMinutes);
      setStep("reset");
      toast.success(response.message);
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim() || !otp.trim() || !newPassword || !confirmPassword) {
      toast.error("Fill all required fields");
      return;
    }

    if (otp.trim().length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPasswordWithOtp({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      toast.success(response.message);
      router.push("/login");
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-background overflow-hidden relative">
      {loading && <AppLoadingScreen label={step === "request" ? "Sending OTP..." : "Resetting password..."} />}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-8rem] right-[-6rem] h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex relative overflow-hidden border-r border-border bg-background">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(11,4,207,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(11,4,207,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "34px 34px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

          <div className="relative z-10 flex flex-col justify-between w-full p-10">


            <div className="max-w-[520px]">

              <h1 className="mt-8 text-[52px] leading-[1.04] font-extrabold tracking-tight text-primary">
                Reset access without leaving the brand experience.
              </h1>

              <p className="mt-5 text-base leading-7 text-muted-foreground max-w-xl">
                We send a one-time code to your email, then let you set a new password right away. The same visual system stays consistent with the rest of Direction AI.
              </p>

              <div className="mt-10 grid gap-4">
                {[
                  "Themed welcome and recovery emails",
                  "OTP verification before password changes",
                  "Session invalidation after password reset",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-white/70 px-4 py-3 backdrop-blur">
                    <ShieldCheck size={18} className="text-primary shrink-0" />
                    <p className="text-sm font-medium text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Need to sign in instead?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Go back to login
              </Link>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-[540px] rounded-[36px] border border-border bg-card/90 backdrop-blur-xl shadow-2xl p-7 sm:p-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                <KeyRound size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Password recovery</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                  {step === "request" ? "Request an OTP" : "Reset your password"}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base leading-7 text-muted-foreground">
              {step === "request"
                ? "Enter your account email and we’ll send a one-time code to continue."
                : "Enter the code from your inbox and choose a new password."}
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">Workspace Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="name@company.com"
                    className="w-full h-14 rounded-2xl border border-border bg-background pl-11 pr-5 text-foreground outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {step === "reset" && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">OTP Code</label>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      inputMode="numeric"
                      placeholder="123456"
                      maxLength={6}
                      className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-center tracking-[0.45em] text-foreground outline-none focus:border-primary transition-all text-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">New Password</label>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-foreground outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">Confirm New Password</label>
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-foreground outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                    {expiresInMinutes ? `OTP expires in ${expiresInMinutes} minutes.` : "Use the latest OTP sent to your email."}
                  </div>
                </>
              )}

              <button
                onClick={step === "request" ? handleRequestOtp : handleResetPassword}
                className="w-full h-14 rounded-2xl gradient-primary text-white font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {step === "request" ? "Send OTP" : "Reset Password"}
              </button>

              {step === "reset" && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <button
                    onClick={() => {
                      setStep("request");
                      setOtp("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    Change email
                  </button>
                  <button
                    onClick={handleRequestOtp}
                    className="font-semibold text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Recovery note</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              If you remember your password, you can{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                return to login <ArrowLeft size={14} />
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordScreen;
