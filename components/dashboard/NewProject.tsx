"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Paperclip,
  Image,
  SendHorizonal,
  FileText,
  Map,
  LineChart,
  Zap,
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
  const [savedProjects, setSavedProjects] = useState<ChatSession[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 300);
      textarea.style.height = `${newHeight}px`;
    };

    adjustHeight();
    textarea.addEventListener('input', adjustHeight);
    
    return () => textarea.removeEventListener('input', adjustHeight);
  }, [idea]);

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

  const currentQuote = motivationalQuotes[quoteIndex];
  const quoteParts = currentQuote.text.split(new RegExp(`(${currentQuote.highlight})`, 'gi'));

  return (
    <div className="min-h-screen bg-[#F3F1F8] flex items-center justify-center">
      {generating && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#D8D5E2] p-8">
            <div className="mx-auto relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-gray-200" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#0B04CF] border-r-[#1208E8] animate-spin" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-center text-gray-900">Generating Strategy</h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Creating your project workspace...
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header with Sliding Animation */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="overflow-hidden h-16 sm:h-20 mb-3">
            <div 
              className={`transition-all duration-500 transform ${
                isAnimating ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
              }`}
            >
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {quoteParts.map((part, idx) => 
                  part.toLowerCase() === currentQuote.highlight.toLowerCase() ? (
                    <span key={idx} className="bg-gradient-to-r from-[#0B04CF] to-[#1208E8] bg-clip-text text-transparent">
                      {part}
                    </span>
                  ) : (
                    <span key={idx} className="text-gray-900">{part}</span>
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
    <div className="mb-8 sm:mb-10">
 <div className="relative rounded-[28px] p-[1.5px] overflow-hidden group">
    
    {/* Animated Gradient Border */}
     {/* Animated Border */}
  <div className="absolute inset-0 rounded-[28px] animated-border opacity-90" />

    <div className="absolute inset-[-20%] bg-[#4338CA]/20 blur-3xl animate-pulse" />

    {/* Main Card */}
    <div className="relative rounded-[26px] bg-white/95 backdrop-blur-xl">
      <textarea
        ref={textareaRef}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="E.g., Build an AI-powered platform that helps freelancers automate their invoicing and client management..."
        className="w-full min-h-[120px] bg-transparent resize-none outline-none text-gray-900 placeholder:text-gray-400 text-base sm:text-lg leading-relaxed p-5 sm:p-6"
        rows={3}
        autoFocus
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 pb-5 sm:pb-6">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-lg border border-[#D8D5E2] bg-white hover:border-[#0B04CF] hover:bg-[#F3F1F8] transition-all duration-200 flex items-center justify-center text-gray-400 hover:text-[#0B04CF] group">
            <Paperclip
              size={16}
              className="transition-transform group-hover:scale-110"
            />
          </button>

          <button className="w-10 h-10 rounded-lg border border-[#D8D5E2] bg-white hover:border-[#0B04CF] hover:bg-[#F3F1F8] transition-all duration-200 flex items-center justify-center text-gray-400 hover:text-[#0B04CF] group">
            <Image
              size={16}
              className="transition-transform group-hover:scale-110"
            />
          </button>

          <span className="text-xs text-gray-400 ml-2 hidden sm:inline">
            Attach files or images
          </span>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !idea.trim()}
          className="h-11 px-8 rounded-lg bg-gradient-to-r from-[#0B04CF] to-[#1208E8] text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        >
          <span>Generate Strategy</span>
          <SendHorizonal size={16} />
        </button>
      </div>
    </div>
  </div>
</div>

      </div>

<style jsx global>{`
  .animated-border {
    background: linear-gradient(
      270deg,
      #0B04CF,
      #1208E8,
      #4F46E5,
      #0B04CF
    );

    background-size: 400% 400%;
    animation: borderMove 6s linear infinite;
  }

  @keyframes borderMove {
    0% {
      background-position: 0% 50%;
    }

    100% {
      background-position: 400% 50%;
    }
  }
`}</style>
    </div>
  );
};

export default NewProject;