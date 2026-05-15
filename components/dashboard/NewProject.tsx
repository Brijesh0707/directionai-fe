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
  ArrowRight,
} from "lucide-react";
import { chatService } from "@/services/chat.service";
import { ChatSession } from "@/types/chat";

const actions = [
  {
    title: "Generate PRD",
    icon: FileText,
    description: "Create product requirements document",
  },
  {
    title: "Build MVP Roadmap",
    icon: Map,
    description: "Plan your development journey",
  },
  {
    title: "Market Research",
    icon: LineChart,
    description: "Analyze market opportunities",
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {generating && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-gray-200 p-8 shadow-2xl">
            <div className="mx-auto relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-gray-200" />
              <div className="absolute inset-0 rounded-full border-2 border-gray-200 border-t-[#0B04CF] animate-spin" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-center text-gray-900">Generating Strategy</h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Creating your project workspace...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Header - Centered */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            What would you like to build?
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Describe your idea, and Direction AI will generate a complete execution blueprint tailored to your vision.
          </p>
        </div>

        {/* Main Input Card */}
        <div className="mb-8 sm:mb-10">
          <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-5 sm:p-6">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g., Build an AI-powered platform that helps freelancers automate their invoicing and client management..."
                className="w-full min-h-[200px] sm:min-h-[240px] bg-transparent resize-none outline-none text-gray-900 placeholder:text-gray-400 text-base sm:text-lg leading-relaxed"
                autoFocus
              />
              
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:border-[#0B04CF] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center text-gray-400 hover:text-[#0B04CF] group">
                    <Paperclip size={16} />
                  </button>
                  <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:border-[#0B04CF] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center text-gray-400 hover:text-[#0B04CF] group">
                    <Image size={16} />
                  </button>
                  <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Attach files or images</span>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating || !idea.trim()}
                  className="group h-11 px-6 rounded-lg bg-gradient-to-r from-[#0B04CF] to-[#1208E8] text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
                >
                  <span>Generate Strategy</span>
                  <SendHorizonal size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default NewProject;