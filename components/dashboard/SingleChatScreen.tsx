"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import {
  CheckSquare,
  ChevronRight,
  Eye,
  Loader2,
  FileText,
  Presentation,
  TrendingUp,
  Code2,
  Megaphone,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import { chatService } from "@/services/chat.service";
import { useAppSelector } from "@/store/hooks";
import { ChatReport, ChatSession, ChatStreamEvent } from "@/types/chat";
import ReportDrawer from "./ReportDrawer";

const options = [
  {
    title: "Market Research",
    description: "Competitive analysis and user persona mapping.",
    agentType: "RESEARCH",
    icon: TrendingUp,
  },
  {
    title: "Pitch Deck",
    description: "Structured investor deck rendered into interactive slides.",
    agentType: "PPT",
    icon: Presentation,
  },
  {
    title: "Marketing Strategy",
    description: "Go-to-market plan, funnel, channels, and growth strategy.",
    agentType: "MARKETING",
    icon: Megaphone,
  },
  {
    title: "Development Guide",
    description: "Step-by-step tech stack and sprint planning.",
    agentType: "DEVELOPMENT",
    icon: Code2,
  },
];

// ─── Streaming cursor ─────────────────────────────────────────────────────────
const StreamingCursor = () => (
  <span className="inline-block w-[2px] h-[1em] bg-[#0B04CF] ml-0.5 align-middle animate-[blink_0.8s_ease-in-out_infinite]" />
);

// ─── Markdown component map ───────────────────────────────────────────────────
const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-sm sm:text-[15px] leading-7 text-slate-700 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-slate-700">{children}</em>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-base font-semibold tracking-tight text-slate-900 mb-2">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-2">{children}</h3>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-2 space-y-2 pl-0">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-2 space-y-2 pl-0">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-2 text-sm sm:text-[15px] leading-7 text-slate-700">
      <span className="mt-[0.72rem] h-1.5 w-1.5 rounded-full bg-[#0B04CF] shrink-0" />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-3 border-l-2 border-[#0B04CF]/20 pl-4 text-slate-600 italic">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) =>
    inline ? (
      <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800">
        {children}
      </code>
    ) : (
      <code className="block overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100">
        {children}
      </code>
    ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-3 overflow-x-auto rounded-xl bg-slate-950 p-0 text-slate-100">
      {children}
    </pre>
  ),
};

const MarkdownMessage = ({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) => (
  <div className={`markdown-message space-y-3 ${className}`}>
    <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
  </div>
);

// ─── Professional inline "thinking" indicator (chat only) ────────────────────
const ThinkingIndicator = () => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-2 w-2 rounded-full bg-[#0B04CF]/70"
          style={{ animation: `thinking-bounce 1.2s ease-in-out ${i * 0.18}s infinite` }}
        />
      ))}
    </div>
    <span className="text-xs text-slate-400 font-medium tracking-wide">DirectionAI is thinking…</span>
  </div>
);

// ─── Professional execution progress loader ───────────────────────────────────
const ExecutionProgressLoader = ({
  progress,
}: {
  progress: number;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-[#0B04CF]/15 bg-gradient-to-br from-[#0B04CF]/[0.04] to-transparent">
    {/* Shimmer */}
    <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.55)_50%,transparent_65%)] bg-[length:250%_100%] animate-[exec-shimmer_2.2s_linear_infinite]" />
    <div className="relative px-5 py-4">
      <div className="flex items-center gap-3 mb-3">
        {/* Animated ring */}
        <div className="relative h-9 w-9 shrink-0">
          <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#E8E6F5" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="url(#execGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 94.25} 94.25`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="execGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B04CF" />
                <stop offset="100%" stopColor="#6B66F5" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[9px] font-black text-[#0B04CF] tabular-nums">
            {progress}%
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B04CF]/60 mb-0.5">
            Executing agents
          </p>
          <p className="text-sm font-semibold text-slate-900 leading-snug">
            Building your execution flow
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#0B04CF]/8 rounded-full px-2.5 py-1">
          <Sparkles size={10} className="text-[#0B04CF]" />
          <span className="text-[10px] font-bold text-[#0B04CF]">AI</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-[#E8E6F5] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0B04CF] to-[#6B66F5] transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-slate-400">
        Generating structured output · {progress}% complete
      </p>
    </div>
  </div>
);

// ─── AI message — parse markdown first, then stream revealed ─────────────────
const AIMessage = ({
  content,
  isLatest,
  isStreaming,
}: {
  content: string;
  isLatest: boolean;
  isStreaming?: boolean;
}) => {
  const [revealedLength, setRevealedLength] = useState(
    isLatest && isStreaming ? 0 : content.length
  );
  const [done, setDone] = useState(!isLatest || !isStreaming);
  const indexRef = useRef(isLatest && isStreaming ? 0 : content.length);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let timeoutId: number | undefined;

    if (!isLatest || !isStreaming) {
      timeoutId = window.setTimeout(() => {
        setRevealedLength(content.length);
        setDone(true);
      }, 0);
      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }

    // Start streaming from 0
    indexRef.current = 0;
    timeoutId = window.setTimeout(() => {
      setRevealedLength(0);
      setDone(false);

      intervalRef.current = window.setInterval(() => {
        indexRef.current = Math.min(indexRef.current + 4, content.length);
        setRevealedLength(indexRef.current);
        if (indexRef.current >= content.length) {
          window.clearInterval(intervalRef.current);
          setDone(true);
        }
      }, 10);
    }, 0);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.clearInterval(intervalRef.current);
    };
  }, [content, isLatest, isStreaming]);

  const visibleContent = done ? content : content.slice(0, revealedLength);

  return (
    <div className="relative">
      <MarkdownMessage content={visibleContent} />
      {!done && <StreamingCursor />}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const SingleChatScreen = ({ chatId }: { chatId: string }) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ChatSession | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [reports, setReports] = useState<ChatReport[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [activeReport, setActiveReport] = useState<ChatReport | null>(null);
  const [activeRunData, setActiveRunData] = useState<unknown>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [textareaRows, setTextareaRows] = useState(1);
  const [composerFocused, setComposerFocused] = useState(false);
  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const streamingMsgRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const appliedRecommendedAgentRef = useRef(false);
  const prevSendingRef = useRef(false);
  const lastUserMessageRef = useRef<HTMLDivElement | null>(null);
  // Track whether we've done the initial scroll after first load
  const initialScrollDoneRef = useRef(false);

  const refreshSession = useCallback(async () => {
    try {
      const session = await chatService.getSession(chatId);
      setProject(session);
      const reportData = await chatService.listReports(chatId);
      setReports(reportData);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  // ─── FIX: scroll to bottom on initial load, instantly (no animation) ───────
  useEffect(() => {
    if (!loading && !initialScrollDoneRef.current) {
      initialScrollDoneRef.current = true;
      // Use requestAnimationFrame to wait for the DOM to paint with content
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
      });
    }
  }, [loading]);

  // Mobile keyboard detection for better UX
  useEffect(() => {
    const handleResize = () => {
      // On mobile, when keyboard opens, the window inner height decreases significantly
      const isKeyboardOpen = window.innerHeight < (window.screen.height * 0.75);
      setIsMobileKeyboardOpen(isKeyboardOpen);
      
      // When keyboard opens, scroll to bottom after a tiny delay
      if (isKeyboardOpen && scrollContainerRef.current) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const source = chatService.createStream(chatId, accessToken);

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as ChatStreamEvent | { data?: ChatStreamEvent };
        const payload = "data" in parsed && parsed.data ? parsed.data : (parsed as ChatStreamEvent);
        if (!payload?.message) return;
        setProject((prev) => (prev ? { ...prev, progress: payload.progress } : prev));

        if (payload.type === "session" && payload.status === "completed") {
          setRunning(false);
          void refreshSession();
        }
        if (payload.status === "failed") {
          setRunning(false);
          void refreshSession();
        }
      } catch (error) {
        console.error("Failed to parse stream event", error);
      }
    };

    source.onerror = (error) => {
      console.warn("Stream connection issue, waiting for automatic reconnect", error);
    };

    return () => source.close();
  }, [accessToken, chatId, refreshSession]);

  // Scroll to streaming message when reply arrives
  useEffect(() => {
    if (sendingMessage && !prevSendingRef.current) {
      // just started sending
    }
    if (!sendingMessage && prevSendingRef.current) {
      requestAnimationFrame(() => {
        streamingMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    prevSendingRef.current = sendingMessage;
  }, [sendingMessage]);

  // Scroll to user message immediately after sending
  useEffect(() => {
    if (pendingUserMessage && !sendingMessage) {
      requestAnimationFrame(() => {
        lastUserMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [pendingUserMessage, sendingMessage]);

  // General scroll for execution progress
  useEffect(() => {
    if (running) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [running, project?.progress]);

  // Scroll when thinking indicator appears
  useEffect(() => {
    if (sendingMessage) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  }, [sendingMessage, pendingUserMessage]);

  const latestAIIndex = useMemo(() => {
    const conversation = project?.memoryJson?.conversation ?? [];
    return conversation.reduce((latest, item, idx) => (item.role !== "user" ? idx : latest), -1);
  }, [project?.memoryJson?.conversation]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftMessage(e.target.value);
    const lines = e.target.value.split("\n").length;
    setTextareaRows(Math.min(lines, 4));
    if (!e.target.value) setTextareaRows(1);
  };

  const toggleOption = (value: string) => {
    const option = options.find((item) => item.title === value);
    if (!option) return;
    const alreadyCompleted = reports.some((report) => report.agentType === option.agentType);
    if (alreadyCompleted) return;
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const runSelectedAgents = async () => {
    if (!selectedOptions.length || running) return;
    const selectedAgentTypes = Array.from(
      new Set(
        options
          .filter((option) => selectedOptions.includes(option.title))
          .filter((option) => !reports.some((report) => report.agentType === option.agentType))
          .map((option) => option.agentType)
      )
    );
    if (!selectedAgentTypes.length) return;

    setRunning(true);
    try {
      await chatService.runAgents(chatId, selectedAgentTypes);
      await refreshSession();
      setSelectedOptions([]);
    } catch (error) {
      console.error("Failed to run agents", error);
      setRunning(false);
    }
  };

  const viewReport = async (runId: string) => {
    try {
      const run = await chatService.getRunResult(chatId, runId);
      const reportMeta = reports.find((item) => item.runId === runId) ?? null;
      setActiveReport(reportMeta);
      setActiveRunData(run?.resultJson ?? run);
      setIsDrawerOpen(true);
      requestAnimationFrame(() => setIsDrawerVisible(true));
    } catch (error) {
      console.error("Failed to view report", error);
    }
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    window.setTimeout(() => setIsDrawerOpen(false), 280);
  };

  const directionMemory = project?.memoryJson ?? null;
  const conversation = directionMemory?.conversation ?? [];
  const isClarifying = Boolean(directionMemory?.clarificationNeeded);
  const hasOpenQuestions =
    isClarifying && (directionMemory?.pendingQuestions?.length ?? 0) > 0;
  const allAgentsCompleted = options.every((option) =>
    reports.some((report) => report.agentType === option.agentType)
  );
  const canShowAgentSuggestions =
    Boolean(project?.recommendedFirstAgent) && !allAgentsCompleted;
  const shouldShowClarificationNotice =
    isClarifying && !allAgentsCompleted && !canShowAgentSuggestions;
  const recommendedAgentTitle =
    options.find((option) => option.agentType === project?.recommendedFirstAgent)?.title ??
    project?.recommendedFirstAgent ??
    null;
  const shouldShowPendingUserMessage =
    Boolean(pendingUserMessage) &&
    conversation[conversation.length - 1]?.role !== "user" &&
    conversation[conversation.length - 1]?.content !== pendingUserMessage;

  useEffect(() => {
    if (
      appliedRecommendedAgentRef.current ||
      selectedOptions.length ||
      reports.length > 0 ||
      !recommendedAgentTitle ||
      !canShowAgentSuggestions
    ) return;

    const recommended = options.find((option) => option.title === recommendedAgentTitle);
    if (recommended) {
      const timeout = window.setTimeout(() => {
        setSelectedOptions([recommended.title]);
        appliedRecommendedAgentRef.current = true;
      }, 0);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [canShowAgentSuggestions, recommendedAgentTitle, reports.length, selectedOptions.length]);

  const handleSendMessage = async () => {
    const nextMessage = draftMessage.trim();
    if (!nextMessage || sendingMessage) return;

    setPendingUserMessage(nextMessage);
    setDraftMessage("");
    setTextareaRows(1);
    setSendingMessage(true);
    
    try {
      const response = await chatService.sendMessage(chatId, nextMessage);
      setProject(response.session);
    } catch (error) {
      console.error("Failed to send DirectionAI message", error);
      setDraftMessage(nextMessage);
      setTextareaRows(Math.min(nextMessage.split("\n").length, 4));
      setPendingUserMessage(null);
    } finally {
      setSendingMessage(false);
      setPendingUserMessage(null);
    }
  };

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F1F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl border-2 border-[#D8D5E2] border-t-[#0B04CF] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading project…</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F3F1F8] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#D8D5E2] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FileText size={28} className="text-[#0B04CF]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-500 text-sm">This chat session doesn&apos;t exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  // ─── Main UI ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes thinking-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes exec-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .msg-enter {
          animation: fadeSlideUp 0.22s ease both;
        }
      `}</style>

      <div className="h-screen bg-[#F3F1F8] flex flex-col overflow-hidden">

        {/* ── Scrollable content with proper padding for fixed composer ────────── */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto scroll-smooth"
          style={{ 
            paddingBottom: isMobileKeyboardOpen ? '80px' : '100px',
            transition: 'padding-bottom 0.2s ease-out'
          }}
        >
          <div className="max-w-3xl mx-auto px-4 pt-6 sm:px-6 sm:pt-10">
            {/* Content wrapper - no extra bottom padding here since parent handles it */}
            
            {/* Project header */}
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 truncate">
                    {project.title}
                  </h1>
                  {project.projectCategory && (
                    <span className="rounded-full border border-[#D8D5E2] bg-white px-2.5 py-1 text-[11px] text-gray-500 font-medium">
                      {project.projectCategory}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl">
                  {directionMemory?.project?.description ?? project.idea}
                </p>
                {isClarifying ? (
                  <p className="mt-2 text-xs text-amber-600 font-medium">
                    DirectionAI is still clarifying the brief, but it may already have a first-step recommendation.
                  </p>
                ) : null}
              </div>
            </div>

            {/* ── Conversation thread ──────────────────────────────────────────── */}
            <div className="space-y-4 mb-8">
              {conversation.length > 0 ? (
                conversation.map((item, index) => {
                  const isUser = item.role === "user";
                  const isLatestAI = !isUser && index === latestAIIndex;
                  const isLastUserMessage = isUser && index === conversation.length - 1;

                  if (isUser) {
                    return (
                      <div 
                        key={`${item.createdAt}-${index}`} 
                        ref={isLastUserMessage ? lastUserMessageRef : undefined}
                        className="flex justify-end msg-enter"
                      >
                        <div className="max-w-[85%] sm:max-w-[70%] bg-[#0B04CF] text-white rounded-[20px] rounded-br-[6px] px-4 py-3 shadow-sm shadow-indigo-500/20">
                          <p className="text-[10px] font-semibold opacity-50 mb-1 uppercase tracking-wider">You</p>
                          <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">{item.content}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${item.createdAt}-${index}`}
                      ref={isLatestAI ? streamingMsgRef : undefined}
                      className="flex justify-start gap-3 msg-enter"
                    >
                      {/* Avatar */}
                      <div className="shrink-0 mt-1">
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#D8D5E2] flex items-center justify-center shadow-sm overflow-hidden">
                          <Image src="/LOGO.png" alt="Direction AI" width={20} height={20} className="rounded object-cover" />
                        </div>
                      </div>

                      <div className="max-w-[85%] sm:max-w-[76%]">
                        <p className="text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">DirectionAI</p>
                        <div className="bg-white border border-[#E8E6F0] rounded-[20px] rounded-bl-[6px] px-4 py-3.5 shadow-sm">
                          <AIMessage
                            content={item.content}
                            isLatest={isLatestAI}
                            isStreaming={isLatestAI && !sendingMessage}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#D8D5E2] flex items-center justify-center shadow-sm overflow-hidden shrink-0 mt-1">
                    <Image src="/LOGO.png" alt="Direction AI" width={20} height={20} className="rounded object-cover" />
                  </div>
                  <div className="bg-white border border-[#E8E6F0] rounded-[20px] rounded-bl-[6px] px-4 py-3.5 shadow-sm max-w-[75%]">
                    <p className="text-[10px] font-semibold text-gray-400 mb-1 uppercase tracking-wider">DirectionAI</p>
                    <p className="text-sm text-gray-500">DirectionAI is ready to refine the brief.</p>
                  </div>
                </div>
              )}

              {/* Pending user message (optimistic) */}
              {shouldShowPendingUserMessage && (
                <div ref={lastUserMessageRef} className="flex justify-end msg-enter">
                  <div className="max-w-[85%] sm:max-w-[70%] bg-[#0B04CF] text-white rounded-[20px] rounded-br-[6px] px-4 py-3 shadow-sm shadow-indigo-500/20">
                    <p className="text-[10px] font-semibold opacity-50 mb-1 uppercase tracking-wider">You</p>
                    <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">{pendingUserMessage}</p>
                  </div>
                </div>
              )}

              {/* Thinking indicator for chat reply */}
              {sendingMessage && (
                <div className="flex justify-start gap-3 msg-enter">
                  <div className="shrink-0 mt-1">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#D8D5E2] flex items-center justify-center shadow-sm overflow-hidden">
                      <Image src="/LOGO.png" alt="Direction AI" width={20} height={20} className="rounded object-cover" />
                    </div>
                  </div>
                  <div className="max-w-[85%] sm:max-w-[76%]">
                    <p className="text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">DirectionAI</p>
                    <div className="bg-white border border-[#E8E6F0] rounded-[20px] rounded-bl-[6px] px-4 py-3.5 shadow-sm">
                      <ThinkingIndicator />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Agent suggestions */}
            {canShowAgentSuggestions && (
              <div className="rounded-2xl border border-[#D8D5E2] bg-white shadow-sm overflow-hidden mb-5">
                <div className="border-b border-[#EAE8F3] px-5 py-4">
                  <h3 className="font-semibold text-gray-900 text-sm">Execution Agents</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    DirectionAI recommends a first step. You can still choose any agent.
                  </p>
                </div>
                <div className="px-5 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {options.map((option, index) => {
                      const completed = reports.some((report) => report.agentType === option.agentType);
                      const active = selectedOptions.includes(option.title);
                      const recommended = project.recommendedFirstAgent === option.agentType;
                      const Icon = option.icon;

                      return (
                        <button
                          key={index}
                          onClick={() => toggleOption(option.title)}
                          disabled={completed}
                          className={`
                            group relative rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer
                            ${completed
                              ? "border-emerald-200 bg-emerald-50/70 cursor-not-allowed"
                              : active
                              ? "border-[#0B04CF] bg-gradient-to-br from-[#0B04CF]/5 to-[#0B04CF]/[0.08] shadow-sm shadow-indigo-200/50"
                              : recommended
                              ? "border-[#0B04CF]/30 bg-[#0B04CF]/[0.03] hover:border-[#0B04CF]/50"
                              : "border-[#D8D5E2] bg-white hover:border-[#0B04CF]/40 hover:shadow-sm"
                            }
                          `}
                        >
                          {active && (
                            <div className="absolute inset-0 rounded-xl ring-1 ring-[#0B04CF]/15 pointer-events-none" />
                          )}
                          <div className="flex items-start gap-3">
                            <div className={`
                              w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all duration-200
                              ${completed ? "bg-emerald-500 border-emerald-500"
                                : active ? "bg-[#0B04CF] border-[#0B04CF]"
                                : recommended ? "border-[#0B04CF] bg-[#0B04CF]/10"
                                : "border-[#C8C5D5] bg-white group-hover:border-[#0B04CF]/50"}
                            `}>
                              {(active || completed) && (
                                <CheckSquare size={11} className="text-white" strokeWidth={2.5} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`
                                  w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
                                  ${completed ? "bg-emerald-100"
                                    : active ? "bg-[#0B04CF]/10"
                                    : "bg-[#F3F1F8] group-hover:bg-[#0B04CF]/8"}
                                `}>
                                  <Icon size={14} className={
                                    completed ? "text-emerald-600"
                                      : active ? "text-[#0B04CF]"
                                      : recommended ? "text-[#0B04CF]"
                                      : "text-gray-400 group-hover:text-[#0B04CF]"
                                  } />
                                </div>
                                <div className="min-w-0">
                                  <h3 className={`font-semibold text-sm transition-colors duration-200 ${
                                    active ? "text-[#0B04CF]"
                                      : completed ? "text-emerald-700"
                                      : recommended ? "text-[#0B04CF]"
                                      : "text-gray-800 group-hover:text-[#0B04CF]"
                                  }`}>
                                    {option.title}
                                  </h3>
                                  {recommended && !completed && (
                                    <p className="text-[11px] text-[#0B04CF]/70 mt-0.5 font-medium flex items-center gap-1">
                                      <Image src="/LOGO.png" alt="Recommended" width={12} height={12} className="w-3 h-3" />
                                      Recommended
                                    </p>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed">
                                {option.description}
                                {completed && <span className="ml-1 text-emerald-600 font-medium">· Completed</span>}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={runSelectedAgents}
                      disabled={!selectedOptions.length || running}
                      className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#0B04CF] to-[#1208E8] text-white text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:opacity-95 active:scale-[0.98] transition-all duration-200 flex items-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {running ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Executing…</span>
                        </>
                      ) : (
                        <>
                          <span>Continue Execution</span>
                          <ChevronRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {shouldShowClarificationNotice && (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4 text-sm text-amber-900">
                DirectionAI is still clarifying the brief — execution agents will appear once the recommendation is ready.
              </div>
            )}

            {/* Execution loading — only shown when running agents */}
            {running && (
              <div className="mb-5 msg-enter">
                <ExecutionProgressLoader progress={Math.max(project.progress, 12)} />
              </div>
            )}

            {/* Generated reports */}
            {reports.length > 0 && (
              <div className="rounded-2xl border border-[#D8D5E2] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[#EAE8F3] px-5 py-3.5">
                  <h3 className="font-semibold text-gray-900 text-sm">Generated Reports</h3>
                </div>
                <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reports.map((report) => {
                    const matched = options.find((o) => o.agentType === report.agentType);
                    const Icon = matched?.icon ?? FileText;

                    return (
                      <div
                        key={report.runId}
                        className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0B04CF] to-[#1208E8] p-4 shadow-md shadow-indigo-500/20"
                      >
                        <div
                          className="absolute inset-0 opacity-[0.05] pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
                            backgroundSize: "24px 24px",
                          }}
                        />
                        <div className="relative">
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                              <Icon size={15} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white text-sm leading-tight">{matched?.title ?? report.agentType}</p>
                              <p className="text-[11px] text-indigo-200 mt-0.5 truncate">{report.reportName || "Report available"}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => void viewReport(report.runId)}
                            className="h-8 px-4 rounded-lg bg-white text-[#0B04CF] text-xs font-bold hover:bg-indigo-50 active:scale-[0.97] transition-all duration-150 flex items-center gap-1.5 shadow-sm"
                          >
                            <Eye size={12} />
                            View Report
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Fixed Composer (always visible, no scroll issues) ─────────────────── */}
     <div
  className="
    fixed bottom-0 left-0 right-0 z-40
    bg-gradient-to-t from-[#F3F1F8] via-[#F3F1F8] to-transparent
    pt-2 pb-[calc(env(safe-area-inset-bottom)+12px)]
    shadow-[0_-8px_20px_-8px_rgba(0,0,0,0.03)]
    md:sticky
  "
>
  <div className="max-w-3xl mx-auto px-3 sm:px-6">
    <div
      className={`
        rounded-2xl border bg-[#F8F7FC] px-4 pt-3 pb-2.5
        transition-all duration-200
        ${composerFocused
          ? "border-[#0B04CF]/35 bg-white shadow-[0_0_0_3px_rgba(11,4,207,0.06)]"
          : "border-[#D8D5E2] shadow-sm"
        }
      `}
    >
      <textarea
        ref={textareaRef}
        value={draftMessage}
        onChange={handleTextareaChange}
        onKeyDown={handleComposerKeyDown}
        onFocus={() => setComposerFocused(true)}
        onBlur={() => setComposerFocused(false)}
        placeholder="Reply to DirectionAI or add more context…"
        rows={textareaRows}
        className="
          w-full resize-none border-0 bg-transparent p-0
          text-sm text-gray-900 outline-none
          placeholder:text-gray-400 leading-relaxed
        "
        style={{
          minHeight: "24px",
          maxHeight: "112px",
          overflowY: textareaRows >= 4 ? "auto" : "hidden",
        }}
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="hidden sm:block select-none text-[11px] text-gray-400">
          <kbd className="rounded border border-gray-200 bg-white px-1 py-0.5 font-mono text-[10px] text-gray-500 shadow-sm">
            ↵
          </kbd>{" "}
          send ·{" "}
          <kbd className="rounded border border-gray-200 bg-white px-1 py-0.5 font-mono text-[10px] text-gray-500 shadow-sm">
            ⇧↵
          </kbd>{" "}
          new line
        </p>

        <button
          onClick={() => void handleSendMessage()}
          disabled={sendingMessage || !draftMessage.trim()}
          className="
            ml-auto h-9 px-4 rounded-xl
            bg-gradient-to-r from-[#0B04CF] to-[#1208E8]
            text-white text-sm font-semibold
            shadow-md shadow-indigo-500/20
            hover:opacity-95 active:scale-[0.97]
            transition-all duration-150
            flex items-center gap-2
            disabled:opacity-35
            disabled:cursor-not-allowed
            disabled:shadow-none
          "
        >
          {sendingMessage ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Sending</span>
            </>
          ) : (
            <>
              <span>Send</span>
              <SendHorizonal size={13} />
            </>
          )}
        </button>
      </div>
    </div>
  </div>
</div>
      </div>

      <ReportDrawer
        isOpen={isDrawerOpen}
        isVisible={isDrawerVisible}
        activeReport={activeReport}
        activeRunData={activeRunData}
        onClose={closeDrawer}
      />
    </>
  );
};

export default SingleChatScreen;