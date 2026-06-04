"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Rocket,
  Building2,
  BriefcaseBusiness,
  User,
  Code2,
  GraduationCap,
  Lightbulb,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/authSlice";
import AppLoadingScreen from "@/components/common/AppLoadingScreen";

const userTypes = [
  { title: "Startup Founder", subtitle: "Building the next big thing", icon: Rocket },
  { title: "Agency Owner", subtitle: "Scaling client services", icon: Building2 },
  { title: "Product Manager", subtitle: "Driving roadmap success", icon: BriefcaseBusiness },
  { title: "Freelancer", subtitle: "Independent professional", icon: User },
  { title: "Developer", subtitle: "Building core tech", icon: Code2 },
  { title: "Student Founder", subtitle: "Learning and launching", icon: GraduationCap },
  { title: "Consultant", subtitle: "Strategic advisor", icon: Lightbulb },
];

const sources = [
  "YouTube",
  "Instagram",
  "Google Search",
  "LinkedIn",
  "Twitter / X",
  "Newsletter",
  "Friend / Colleague",
];

const goals = [
  { title: "Validate My Startup Idea", subtitle: "Market research and user feedback loops" },
  { title: "Build an MVP", subtitle: "Rapid prototyping and lean development" },
  { title: "Create PRD & Roadmap", subtitle: "Structured documentation and planning" },
  { title: "Raise Funding", subtitle: "Investor decks and growth modeling" },
];

const stages = [
  "Just an Idea",
  "Early Validation",
  "MVP Planning",
  "Already Building",
  "Scaling Startup",
];

type QuestionKey = "userType" | "source" | "goal" | "stage";

const OnboardingProcess = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionKey>("userType");
  const [selectedUser, setSelectedUser] = useState("Startup Founder");
  const [selectedSource, setSelectedSource] = useState("LinkedIn");
  const [selectedGoal, setSelectedGoal] = useState("Build an MVP");
  const [selectedStage, setSelectedStage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // Measure content height to adjust main container
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [currentQuestion, selectedUser, selectedSource, selectedGoal, selectedStage]);

  useEffect(() => {
    if (!user || !accessToken) {
      router.replace("/login");
      return;
    }

    if (user.onboardingDone) {
      router.replace("/dashboard");
    }
  }, [accessToken, router, user]);

  if (!user || !accessToken) {
    return <AppLoadingScreen label="Checking session..." />;
  }

  const questions: { key: QuestionKey; title: string; description: string }[] = [
    { key: "userType", title: "What best describes you?", description: "Tell us about your role so we can tailor the experience." },
    { key: "source", title: "How did you hear about Direction AI?", description: "Help us understand how you found us." },
    { key: "goal", title: "What are you mainly trying to achieve?", description: "This helps us prioritize the right tools and templates." },
    { key: "stage", title: "What stage are you currently at?", description: "We'll adjust recommendations based on your progress." },
  ];

  const currentIndex = questions.findIndex((q) => q.key === currentQuestion);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentQuestion(questions[currentIndex + 1].key);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentQuestion(questions[currentIndex - 1].key);
  };

  const extractError = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: { message?: string | string[] } } }).response === "object"
    ) {
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      if (Array.isArray(message)) return message[0] ?? "Request failed";
      return message ?? "Request failed";
    }
    return "Something went wrong";
  };

  const saveAndGoDashboard = async (skip = false) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setSaving(true);
      const payload = skip
        ? {}
        : {
            userType: selectedUser,
            source: selectedSource,
            goal: selectedGoal,
            stage: stages[selectedStage],
          };

      const res = await authService.saveOnboarding(payload);
      dispatch(updateUser(res.user));
      toast.success(skip ? 'Onboarding skipped' : 'Onboarding saved');
      router.push('/dashboard');
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setSaving(false);
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case "userType":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {userTypes.map((item, index) => {
              const Icon = item.icon;
              const active = selectedUser === item.title;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedUser(item.title)}
                  className={`group relative rounded-xl md:rounded-2xl border p-4 md:p-5 text-left transition-all duration-300 active:scale-[0.98] ${
                    active ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-5 ${active ? "gradient-primary" : "bg-primary/10"}`}>
                    <Icon size={20} className={active ? "text-white" : "text-primary"} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">{item.title}</h3>
                  <p className="mt-1 text-xs md:text-sm leading-5 text-muted-foreground">{item.subtitle}</p>
                  {active && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        );

      case "source":
        return (
          <div className="flex flex-wrap gap-2 md:gap-3">
            {sources.map((source, index) => (
              <button
                key={index}
                onClick={() => setSelectedSource(source)}
                className={`h-10 md:h-12 px-4 md:px-5 rounded-xl md:rounded-2xl border text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                  selectedSource === source
                    ? "gradient-primary text-white border-primary shadow-lg"
                    : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        );

      case "goal":
        return (
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {goals.map((goal, index) => {
              const active = selectedGoal === goal.title;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedGoal(goal.title)}
                  className={`relative rounded-xl md:rounded-2xl border p-4 md:p-5 text-left transition-all duration-300 active:scale-[0.98] ${
                    active ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 ${active ? "gradient-primary border-primary" : "border-border"}`}>
                      {active && <Check size={12} className="text-white" />}
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-foreground">{goal.title}</h3>
                      <p className="mt-1 text-xs md:text-sm leading-6 text-muted-foreground">{goal.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "stage":
        return (
          <div className="relative py-4 md:py-6">
            {/* Progress Bar Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full" />
            
            {/* Progress Bar Fill */}
            <div
              className="absolute top-1/2 left-0 h-1 gradient-primary transition-all duration-500 rounded-full -translate-y-1/2"
              style={{ width: `${(selectedStage / (stages.length - 1)) * 100}%` }}
            />

            {/* Stage Buttons */}
            <div className="relative flex items-center justify-between gap-2 md:gap-4">
              {stages.map((stage, index) => {
                const active = selectedStage >= index;
                const isCurrent = selectedStage === index;

                return (
                  <button 
                    key={index} 
                    onClick={() => setSelectedStage(index)} 
                    className="flex flex-col items-center text-center group flex-1"
                  >
                    <div className={`relative w-7 h-7 md:w-8 md:h-8 rounded-full border-4 transition-all duration-300 ${
                      active ? "border-primary bg-primary shadow-lg" : "border-border bg-background"
                    } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}>
                      {active && index === selectedStage && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <span className={`mt-2 text-[10px] sm:text-xs md:text-sm font-semibold leading-tight transition-all duration-300 ${
                      active ? "text-primary" : "text-muted-foreground"
                    } max-w-[60px] sm:max-w-none`}>
                      {stage}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Background Blobs - Hidden on mobile for performance */}
      <div className="hidden md:block absolute top-0 left-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full" />
      <div className="hidden md:block absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 blur-3xl rounded-full" />

      {saving && <AppLoadingScreen label="Saving onboarding..." />}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <div className="rounded-2xl md:rounded-3xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden">
            {/* Header Section */}
            <div className="p-5 sm:p-6 md:p-8 border-b border-border">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-primary/10 bg-primary/5 mb-4 md:mb-6">
                <Sparkles size={12} className="text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">Welcome to Direction AI</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                Let&apos;s Personalize Your
                <span className="text-primary"> Startup Workspace</span>
              </h1>

              <p className="mt-3 text-sm sm:text-base md:text-lg leading-6 text-muted-foreground max-w-2xl">
                We&apos;ll ask a few quick questions to better understand your goals, startup stage, and workflow.
              </p>
            </div>

            {/* Progress Steps - More compact on mobile */}
            <div className="px-5 sm:px-6 md:px-8 pt-5 md:pt-6">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                {questions.map((q, idx) => (
                  <div key={q.key} className={`flex-1 h-1 rounded-full transition-all duration-300 ${idx <= currentIndex ? "gradient-primary" : "bg-border"}`} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span>Role</span>
                <span>Source</span>
                <span>Goal</span>
                <span>Stage</span>
              </div>
            </div>

            {/* Question Content - Ref with scroll padding */}
            <div ref={contentRef} className="pb-32 md:pb-36">
              <div className="p-5 sm:p-6 md:p-8">
                <div className="mb-6 md:mb-8">
                  <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 text-primary font-bold text-sm md:text-base mb-3 md:mb-4">
                    {currentIndex + 1}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{questions[currentIndex].title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{questions[currentIndex].description}</p>
                </div>
                {renderQuestion()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer - Always visible at bottom */}
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Helper Text - Hidden on very small screens */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles size={12} className="text-primary" />
              </div>
              <span>Helps us generate smarter startup blueprints</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
              {!isFirst && (
                <button
                  onClick={handlePrev}
                  className="flex items-center justify-center gap-2 h-10 md:h-11 px-4 md:px-5 rounded-xl md:rounded-2xl border border-border bg-background text-foreground font-semibold text-sm hover:border-primary hover:text-primary transition-all duration-300 active:scale-[0.98]"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}

              {!isLast ? (
                <button
                  onClick={handleNext}
                  className="group flex-1 sm:flex-none h-10 md:h-11 px-5 md:px-6 rounded-xl md:rounded-2xl gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                >
                  Next
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              ) : (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => saveAndGoDashboard(true)}
                    className="flex-1 h-10 md:h-11 px-4 md:px-5 rounded-xl md:rounded-2xl border border-border bg-background text-muted-foreground font-semibold text-sm hover:border-primary hover:text-primary transition-all duration-300 active:scale-[0.98]"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => saveAndGoDashboard(false)}
                    className="group flex-[2] h-10 md:h-11 px-4 md:px-6 rounded-xl md:rounded-2xl gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                  >
                    Continue
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile helper text */}
          <div className="sm:hidden text-center mt-2">
            <span className="text-[10px] text-muted-foreground">Helps generate smarter startup blueprints</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProcess;