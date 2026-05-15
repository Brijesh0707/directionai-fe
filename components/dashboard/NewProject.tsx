"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Paperclip,
  Image,
  SendHorizonal,
  FileText,
  Map,
  LineChart,
  Rocket,
  Compass,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { chatService } from "@/services/chat.service";
import { ChatSession } from "@/types/chat";

const actions = [
  {
    title: "Generate PRD",
    icon: FileText,
  },
  {
    title: "Build MVP Roadmap",
    icon: Map,
  },
  {
    title: "Market Research",
    icon: LineChart,
  },
];

const NewProject = () => {
  const [idea, setIdea] = useState("");
  const [generating, setGenerating] = useState(false);
  const [savedProjects, setSavedProjects] = useState<ChatSession[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessions = await chatService.listSessions();
        setSavedProjects(sessions);
      } catch (error) {
        console.error("Failed to load sessions", error);
      }
    };

    void loadSessions();
  }, []);

  const projects = useMemo(() => savedProjects, [savedProjects]);

  const handleGenerate = async () => {
    if (!idea.trim() || generating) return;
    setGenerating(true);

    try {
      const session = await chatService.createSession({ idea });
      router.push(`/dashboard/chat/${session.id}`);
    } catch (error) {
      console.error("Failed to create session", error);
      setGenerating(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-background overflow-hidden p-5">
      {generating && (
        <div className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-xl flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-black/70 p-8 text-white shadow-2xl">
            <div className="mx-auto relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-white/20" />
              <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-white animate-spin" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-center">Building Your Strategy</h3>
            <p className="mt-3 text-center text-white/75">
              Drafting your execution plan and opening your project workspace.
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-primary/5 mb-4">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs sm:text-sm font-semibold text-primary">AI Startup Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Good Evening, Brijesh 👋</h1>
            <p className="mt-3 text-base sm:text-lg leading-8 text-muted-foreground">
              Describe your startup idea and Direction AI will generate your execution blueprint.
            </p>
          </div>

          <button className="self-start sm:self-auto h-14 px-5 rounded-2xl border border-border bg-card/80 backdrop-blur-xl flex items-center gap-3 text-foreground font-semibold shadow-sm hover:border-primary transition-all duration-300">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            Main Workspace
            <ChevronDown size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="mt-10 rounded-[36px] border border-border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-5 sm:p-7 lg:p-8">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea..."
              className="w-full min-h-[180px] bg-transparent resize-none outline-none text-lg text-foreground placeholder:text-muted-foreground leading-8"
            />

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-2xl border border-border bg-background hover:border-primary transition-all duration-300 flex items-center justify-center text-muted-foreground hover:text-primary">
                  <Paperclip size={18} />
                </button>
                <button className="w-12 h-12 rounded-2xl border border-border bg-background hover:border-primary transition-all duration-300 flex items-center justify-center text-muted-foreground hover:text-primary">
                  <Image size={18} />
                </button>
              </div>

              <button
                onClick={handleGenerate}
                className="group h-14 px-7 rounded-2xl gradient-primary text-white font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={generating || !idea.trim()}
              >
                Generate Strategy
                <SendHorizonal size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="group h-14 px-6 rounded-2xl border border-border bg-card/70 backdrop-blur-xl hover:border-primary hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-foreground font-semibold shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:gradient-primary transition-all duration-300">
                  <Icon size={18} className="text-primary group-hover:text-white transition-all duration-300" />
                </div>
                {action.title}
              </button>
            );
          })}
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Recent Projects</h2>
              <p className="mt-2 text-muted-foreground">Continue building your latest startup blueprints.</p>
            </div>
            <button className="hidden sm:flex text-primary font-semibold hover:underline">View all projects</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const icons = [Rocket, Compass, CreditCard];
              const Icon = icons[index % icons.length];

              return (
                <div
                  key={project.id}
                  className="group relative rounded-[30px] border border-border bg-card/80 backdrop-blur-xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 cursor-pointer"
                  onClick={() => router.push(`/dashboard/chat/${project.id}`)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center">
                        <Icon size={24} className="text-primary" />
                      </div>

                      <div className="px-3 py-1 rounded-full bg-background border border-border text-xs font-bold text-muted-foreground">
                        {project.status}
                      </div>
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-foreground leading-tight">{project.title}</h3>

                    <p className="mt-4 text-base leading-8 text-muted-foreground">{project.idea}</p>

                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-muted-foreground">Product Readiness</span>
                        <span className="text-sm font-bold text-foreground">{project.progress}%</span>
                      </div>

                      <div className="h-3 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all duration-700"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full gradient-primary transition-all duration-500" />
                </div>
              );
            })}
          </div>

          <button className="sm:hidden mt-8 w-full h-14 rounded-2xl border border-border bg-card font-semibold text-primary">
            View all projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewProject;
