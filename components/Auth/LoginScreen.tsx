"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BrainCircuit, Lock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSession } from "@/store/authSlice";
import AppLoadingScreen from "@/components/common/AppLoadingScreen";
import Image from "next/image";

type GoogleCredentialResponse = { credential?: string };
type PromptMomentNotification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (input: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          prompt: (listener?: (notification: PromptMomentNotification) => void) => void;
        };
      };
    };
  }
}

const tags = ["PRDs", "MVP Roadmaps", "Pitch Decks", "GTM Strategy"];

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const handlePostAuth = useCallback(
    (payload: Awaited<ReturnType<typeof authService.login>>) => {
      dispatch(
        setSession({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        }),
      );

      if (payload.user.onboardingDone) {
        router.push("/dashboard");
        return;
      }
      router.push("/onboard");
    },
    [dispatch, router],
  );

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

  const onSubmit = async () => {
    if (!email || !password || (activeTab === "signup" && !name)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const data =
        activeTab === "login"
          ? await authService.login({ email, password })
          : await authService.register({ email, password, name });

      toast.success(activeTab === "login" ? "Logged in" : "Account created");
      handlePostAuth(data);
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      router.replace(user.onboardingDone ? "/dashboard" : "/onboard");
    }
  }, [accessToken, router, user]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.info("[auth][google] GSI script loaded");
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          console.info("[auth][google] credential callback invoked");
          if (!credential) {
            toast.error("Google login failed");
            return;
          }
          try {
            setLoading(true);
            const data = await authService.googleLogin(credential);
            toast.success("Google login successful");
            handlePostAuth(data);
          } catch (error) {
            toast.error(extractError(error));
          } finally {
            setLoading(false);
          }
        },
      });
      setGoogleReady(true);
    };
    script.onerror = () => {
      console.error("[auth][google] failed to load GSI script");
      toast.error("Unable to load Google auth script");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [handlePostAuth]);

  const triggerGoogleLogin = () => {
    if (!googleReady || !window.google) {
      toast.error("Google auth is not ready");
      return;
    }
    console.info("[auth][google] prompt start", {
      origin: window.location.origin,
      hasClientId: Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason();
        console.warn("[auth][google] prompt not displayed", reason);
        toast.error(`Google prompt blocked: ${reason}`);
      }
      if (notification.isSkippedMoment()) {
        console.warn("[auth][google] prompt skipped", notification.getSkippedReason());
      }
      if (notification.isDismissedMoment()) {
        console.info("[auth][google] prompt dismissed", notification.getDismissedReason());
      }
    });
  };

  return (
    <section className="min-h-screen bg-background overflow-hidden">
      {loading && <AppLoadingScreen label="Authenticating..." />}

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - 60% primary theme color */}
 {/* Left Side - Grid Background */}
<div className="relative hidden lg:flex overflow-hidden border-r border-border bg-background">
  {/* Grid Layer */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)
      `,
      backgroundSize: "32px 32px",
    }}
  />

  {/* Brand Primary Overlay */}
  <div className="absolute inset-0 bg-primary/05" />

  {/* Soft Gradient Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

  <div className="relative z-10 flex flex-col justify-between w-full p-10">
    <div className="absolute inset-0 pointer-events-none">
      
      {/* Center Logo Circle */}
      <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[170px] h-[170px] rounded-full bg-white shadow-2xl border border-primary/10 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
        <BrainCircuit className="w-12 h-12 text-primary" strokeWidth={1.8} />
      </div>

      {/* Investor Deck Card */}
      <div className="absolute top-[18%] right-14 w-[220px] rounded-2xl bg-white shadow-2xl border border-primary/10 p-3 animate-[float_7s_ease-in-out_infinite]">
        <div className="h-[110px] rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1590097520505-416422f07ad1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Investor Deck"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-[11px] font-semibold text-gray-600 mt-2">
          Investor Deck v2.4
        </p>
      </div>

      {/* Product Roadmap Card */}
      <div className="absolute bottom-[45%] left-10 w-[260px] rounded-2xl bg-white shadow-2xl border border-primary/10 p-4 animate-[float_8s_ease-in-out_infinite]">
        <p className="text-[11px] font-bold tracking-wide text-primary uppercase mb-3">
          Product Roadmap
        </p>

        <div className="flex gap-2">
          <div className="h-7 flex-1 rounded bg-primary" />
          <div className="h-7 w-16 rounded bg-primary/20" />
        </div>
      </div>
    </div>

    {/* Bottom Content */}
    <div className="relative z-10 mt-auto mb-10 max-w-[520px]">
      <h1 className="text-[52px] leading-[1.05] font-extrabold tracking-tight text-primary">
        Turn Raw Startup Ideas Into Structured Execution
      </h1>

      <div className="flex flex-wrap gap-3 mt-8">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-primary/10 text-sm font-medium text-gray-700 shadow-sm"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

        {/* Right Side - Login Form */}
        <div className="relative flex items-center justify-center p-5 sm:p-8 lg:p-12">
          <div className="relative z-10 w-full max-w-[520px] rounded-[36px] border border-border bg-card/90 backdrop-blur-xl shadow-2xl p-7 sm:p-10">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Welcome to Direction AI</p>
              <h3 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">Build Smarter With AI</h3>
            </div>

            <div className="mt-10 flex border-b border-border">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 pb-4 text-base font-bold transition-all duration-300 ${
                  activeTab === "login" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 pb-4 text-base font-bold transition-all duration-300 ${
                  activeTab === "signup" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                }`}
              >
                Signup
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {activeTab === "signup" && (
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="John Doe"
                    className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-foreground outline-none focus:border-primary transition-all"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">Workspace Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@company.com"
                  className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-foreground outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-foreground outline-none focus:border-primary transition-all"
                />
                {activeTab === "login" && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={onSubmit}
                className="w-full h-14 rounded-2xl gradient-primary text-white font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
              >
                {activeTab === "login" ? "Login to Workspace" : "Create Workspace Account"}
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Or Continue With</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4">
              <button
                onClick={triggerGoogleLogin}
                className="h-14 rounded-2xl border border-border bg-background hover:border-primary transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-foreground"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303C33.659 32.657 29.2 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>

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
