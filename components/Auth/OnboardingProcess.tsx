"use client";

import React, { useState } from "react";
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

  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  React.useEffect(() => {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {userTypes.map((item, index) => {
              const Icon = item.icon;
              const active = selectedUser === item.title;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedUser(item.title)}
                  className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                    active ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${active ? "gradient-primary" : "bg-primary/10"}`}>
                    <Icon size={22} className={active ? "text-white" : "text-primary"} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.subtitle}</p>
                  {active && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        );

      case "source":
        return (
          <div className="flex flex-wrap gap-3">
            {sources.map((source, index) => (
              <button
                key={index}
                onClick={() => setSelectedSource(source)}
                className={`h-12 px-5 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, index) => {
              const active = selectedGoal === goal.title;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedGoal(goal.title)}
                  className={`relative rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                    active ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-1 ${active ? "gradient-primary border-primary" : "border-border"}`}>
                      {active && <Check size={14} className="text-white" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{goal.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{goal.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "stage":
        return (
          <div className="relative">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-border" />

            <div
              className="absolute top-4 left-0 h-[2px] gradient-primary transition-all duration-500"
              style={{ width: `${(selectedStage / (stages.length - 1)) * 100}%` }}
            />

            <div className="relative flex items-center justify-between gap-4">
              {stages.map((stage, index) => {
                const active = selectedStage >= index;

                return (
                  <button key={index} onClick={() => setSelectedStage(index)} className="flex flex-col items-center text-center group">
                    <div className={`w-8 h-8 rounded-full border-4 transition-all duration-300 ${active ? "border-primary bg-primary shadow-lg" : "border-border bg-background"}`} />
                    <span className={`mt-4 text-xs sm:text-sm font-semibold leading-5 transition-all duration-300 ${active ? "text-primary" : "text-muted-foreground"}`}>
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
    <section className="min-h-screen bg-background overflow-hidden relative">
      {saving && <AppLoadingScreen label="Saving onboarding..." />}

      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-border">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-primary/5 mb-6">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs sm:text-sm font-semibold text-primary">Welcome to Direction AI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Let&apos;s Personalize Your
              <span className="text-primary"> Startup Workspace</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-7 text-muted-foreground max-w-2xl">
              We&apos;ll ask a few quick questions to better understand your goals, startup stage, and workflow.
            </p>
          </div>

          <div className="px-6 sm:px-8 pt-6">
            <div className="flex items-center justify-between gap-2 mb-2">
              {questions.map((q, idx) => (
                <div key={q.key} className={`flex-1 h-1 rounded-full transition-all duration-300 ${idx <= currentIndex ? "gradient-primary" : "bg-border"}`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Role</span>
              <span>Source</span>
              <span>Goal</span>
              <span>Stage</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold mb-4">
                {currentIndex + 1}
              </div>
              <h2 className="text-2xl font-bold text-foreground">{questions[currentIndex].title}</h2>
              <p className="mt-2 text-muted-foreground">{questions[currentIndex].description}</p>
            </div>
            {renderQuestion()}
          </div>

          <div className="border-t border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3 text-muted-foreground text-sm order-2 sm:order-1">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles size={14} className="text-primary" />
              </div>
              This helps Direction AI generate smarter startup blueprints.
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto order-1 sm:order-2">
              {!isFirst && (
                <button
                  onClick={handlePrev}
                  className="flex items-center justify-center gap-2 h-12 px-6 rounded-2xl border border-border bg-background text-foreground font-semibold hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <ArrowLeft size={18} /> Back
                </button>
              )}

              {!isLast ? (
                <button
                  onClick={handleNext}
                  className="group flex-1 sm:flex-none h-12 px-7 rounded-2xl gradient-primary text-white font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Next
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              ) : (
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => saveAndGoDashboard(true)}
                    className="h-12 px-6 rounded-2xl border border-border bg-background text-muted-foreground font-semibold hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={() => saveAndGoDashboard(false)}
                    className="group h-12 px-7 rounded-2xl gradient-primary text-white font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Continue to Workspace
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingProcess;
