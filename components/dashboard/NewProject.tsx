"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, SendHorizonal, Zap, AlertTriangle } from "lucide-react";
import { chatService } from "@/services/chat.service";

const MAX_CHARACTERS = 2000;

const motivationalQuotes = [
  { text: "Validate Your Startup Idea", highlight: "Validate" },
  { text: "Build Something People Want", highlight: "Want" },
  { text: "From Idea to Execution", highlight: "Execution" },
  { text: "Launch Faster, Smarter", highlight: "Faster" },
  { text: "Turn Vision into Reality", highlight: "Reality" },
];

const NewProject = () => {
  const [idea, setIdea] = useState("");
  const [generating, setGenerating] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreditsError, setIsCreditsError] = useState(false);
  const [entitlement, setEntitlement] = useState<{
    remainingProjects: number;
    projectsCreated: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const creditsNotifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const hasText = idea.trim().length > 0;

  useEffect(() => {
    const loadEntitlement = async () => {
      try {
        const entitlementData = await chatService.getEntitlement();
        setEntitlement({
          remainingProjects: entitlementData.remainingProjects,
          projectsCreated: entitlementData.projectsCreated,
        });
      } catch (error) {
        console.error("Failed to load entitlement", error);
      }
    };
    void loadEntitlement();
  }, []);

  // Only cycle quotes when textarea is empty and not focused
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasText || document.activeElement === textareaRef.current) return;
      setIsAnimating(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasText]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const adjustHeight = () => {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 300);
      textarea.style.height = `${newHeight}px`;
    };
    adjustHeight();
    textarea.addEventListener("input", adjustHeight);
    return () => textarea.removeEventListener("input", adjustHeight);
  }, [idea]);

  // Scroll credits notification into view when it appears
  useEffect(() => {
    if (isCreditsError && creditsNotifRef.current) {
      creditsNotifRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isCreditsError]);

  const CREDITS_KEYWORDS = ["credit", "limit", "quota", "plan", "upgrade", "remaining"];

  const detectCreditsError = (message: string) => {
    const lower = message.toLowerCase();
    return CREDITS_KEYWORDS.some((kw) => lower.includes(kw));
  };

  const handleGenerate = async () => {
    if (!idea.trim() || generating) return;
    setErrorMessage("");
    setIsCreditsError(false);
    setGenerating(true);
    try {
      const session = await chatService.createSession({ idea });
      router.push(`/dashboard/chat/${session.id}`);
    } catch (error: unknown) {
      const maybeResponse = (error as { response?: { data?: { message?: string } } })?.response;
      const message = maybeResponse?.data?.message ?? "Failed to create session";
      const creditsRelated = detectCreditsError(message);
      setIsCreditsError(creditsRelated);
      setErrorMessage(message);
      console.error("Failed to create session", error);
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const currentQuote = motivationalQuotes[quoteIndex];
  const quoteParts = currentQuote.text.split(
    new RegExp(`(${currentQuote.highlight})`, "gi")
  );

  return (
    <div className="min-h-screen bg-[#F3F1F8] flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="overflow-hidden h-16 sm:h-20 mb-3">
            <div
              className={`transition-all duration-500 transform ${
                isAnimating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {quoteParts.map((part, idx) =>
                  part.toLowerCase() === currentQuote.highlight.toLowerCase() ? (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-[#0B04CF] to-[#1208E8] bg-clip-text text-transparent"
                    >
                      {part}
                    </span>
                  ) : (
                    <span key={idx} className="text-gray-900">
                      {part}
                    </span>
                  )
                )}
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-500">
            Let AI guide your journey from concept to launch
          </p>
        </div>

        {/* Main Input Card */}
        <div className="mb-4 sm:mb-6">
          <div className="animated-border-wrapper">
            {/* Rotating ring — paused when user has typed */}
            <div className={`animated-border-ring ${hasText ? "paused" : ""}`} />

            {/* Static fallback border — visible only when text present */}
            <div className={`static-border ${hasText ? "visible" : ""}`} />

            {/* Inner white card */}
            <div className="relative rounded-[26px] bg-white/95 backdrop-blur-xl overflow-hidden">
              <textarea
                ref={textareaRef}
                value={idea}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_CHARACTERS) {
                    setIdea(value);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="E.g., Build an AI-powered platform that helps freelancers automate their invoicing and client management..."
                className="w-full min-h-[120px] bg-transparent resize-none outline-none text-gray-900 scroll-hidden placeholder:text-gray-400 text-base sm:text-lg leading-relaxed p-5 sm:p-6"
                rows={3}
                autoFocus
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 pb-5 sm:pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <button
                        disabled
                        className="w-10 h-10 rounded-lg border border-[#D8D5E2] bg-white cursor-not-allowed flex items-center justify-center text-gray-300"
                        type="button"
                      >
                        <Paperclip size={16} />
                      </button>
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute z-[999] bottom-full left-1/2 -translate-x-1/3 mb-2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                        Feature coming soon
                        <span className="absolute z-[999] top-full left-1/2 -translate-x-1/3 border-4 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 ml-1 hidden sm:inline">
                      Attach files
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-medium transition-colors duration-200 ${
                      idea.length >= MAX_CHARACTERS
                        ? "text-red-500"
                        : idea.length >= MAX_CHARACTERS * 0.9
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}
                  >
                    {idea.length}/{MAX_CHARACTERS}
                  </span>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating || !hasText}
                  className="h-11 px-8 rounded-lg bg-gradient-to-r from-[#0B04CF] to-[#1208E8] text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
                >
                  <span>{generating ? "Generating…" : "Generate Strategy"}</span>
                  {!generating && <SendHorizonal size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generating status bar */}
        <div
          className={`flex items-center gap-3 rounded-xl border border-[#E5E3F0] bg-white px-4 py-3 text-sm text-gray-500 transition-all duration-300 ${
            generating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
        >
          <span className="inline-block w-4 h-4 rounded-full border-2 border-[#E5E3F0] border-t-[#0B04CF] animate-spin flex-shrink-0" />
          Creating your project workspace…
        </div>

        {/* Credits exhausted notification — SaaS-style */}
        {errorMessage && isCreditsError && (
          <div
            ref={creditsNotifRef}
            className="mt-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900 mb-0.5">
                  You've run out of credits
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {errorMessage}
                </p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => router.push("/dashboard/plans")}
                    className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-md hover:shadow-amber-500/25 active:scale-[0.98]"
                  >
                    <Zap size={13} />
                    Buy Credits
                  </button>
                  <button
                    onClick={() => { setErrorMessage(""); setIsCreditsError(false); }}
                    className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-amber-200 bg-white text-amber-700 text-xs font-medium transition-all duration-200 hover:bg-amber-50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generic error notification */}
        {errorMessage && !isCreditsError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
      </div>

      <style jsx global>{`
        .animated-border-wrapper {
          position: relative;
          padding: 2px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 0 32px 4px rgba(11, 4, 207, 0.12),
                      0 0 64px 8px rgba(18, 8, 232, 0.06);
        }

        .animated-border-ring {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: conic-gradient(
            from 0deg,
            #0b04cf 0%,
            #4f46e5 20%,
            #818cf8 35%,
            #1208e8 50%,
            #6d65f0 65%,
            #4f46e5 80%,
            #0b04cf 100%
          );
          animation: spin-clockwise 4s linear infinite;
          z-index: 0;
          transition: opacity 0.4s ease;
        }

        .animated-border-ring.paused {
          animation-play-state: paused;
          opacity: 0;
        }

        .static-border {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          border: 2px solid #d8d5e2;
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .static-border.visible {
          opacity: 1;
        }

        .animated-border-wrapper > div:last-child {
          position: relative;
          z-index: 1;
        }

        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NewProject;