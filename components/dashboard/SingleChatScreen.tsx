"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckSquare,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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

const getMemorySummary = (resultJson: unknown): string | null => {
  if (!resultJson || typeof resultJson !== "object" || Array.isArray(resultJson)) return null;
  const summary = (resultJson as Record<string, unknown>).__memorySummary;
  return typeof summary === "string" && summary.trim() ? summary : null;
};

// Streaming cursor component
const StreamingCursor = () => (
  <span className="inline-block w-[2px] h-[1em] bg-[#0B04CF] ml-0.5 align-middle animate-[blink_0.8s_ease-in-out_infinite]" />
);

// Animated AI message with typewriter effect
const AIMessage = ({
  content,
  isLatest,
  isStreaming,
}: {
  content: string;
  isLatest: boolean;
  isStreaming?: boolean;
}) => {
  const [displayed, setDisplayed] = useState(isLatest && isStreaming ? "" : content);
  const [done, setDone] = useState(!isLatest || !isStreaming);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isLatest || !isStreaming) {
      setDisplayed(content);
      setDone(true);
      return;
    }
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current += 3; // chars per tick — feels fast but not instant
      setDisplayed(content.slice(0, indexRef.current));
      if (indexRef.current >= content.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [content, isLatest, isStreaming]);

  return (
    <span className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
      {displayed}
      {!done && <StreamingCursor />}
    </span>
  );
};

const renderSummaryMarkdown = (summary: string) => {
  const lines = summary
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h4 key={idx} className="text-base font-semibold text-gray-900 mt-1 mb-2">
          {line.replace(/^###\s+/, "")}
        </h4>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <div key={idx} className="flex items-start gap-2">
          <span className="mt-[8px] h-1.5 w-1.5 rounded-full bg-[#0B04CF] shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">{line.replace(/^-+\s+/, "")}</p>
        </div>
      );
    }
    return (
      <p key={idx} className="text-sm text-gray-700 leading-relaxed">
        {line}
      </p>
    );
  });
};

const getCollapsedSummary = (summary: string, maxChars = 420): string => {
  if (summary.length <= maxChars) return summary;
  return `${summary.slice(0, maxChars).trimEnd()}...`;
};

const SingleChatScreen = ({ chatId }: { chatId: string }) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ChatSession | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<ChatStreamEvent[]>([]);
  const [reports, setReports] = useState<ChatReport[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [activeReport, setActiveReport] = useState<ChatReport | null>(null);
  const [activeRunData, setActiveRunData] = useState<unknown>(null);
  const [expandedMemoryRuns, setExpandedMemoryRuns] = useState<Record<string, boolean>>({});
  const [draftMessage, setDraftMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [latestAIIndex, setLatestAIIndex] = useState<number>(-1);
  const [textareaRows, setTextareaRows] = useState(1);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const appliedRecommendedAgentRef = useRef(false);

  const refreshSession = async () => {
    try {
      const session = await chatService.getSession(chatId);
      setProject(session);
      const reportData = await chatService.listReports(chatId);
      setReports(reportData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, [chatId]);

  useEffect(() => {
    if (!accessToken) return;
    const source = chatService.createStream(chatId, accessToken);

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as ChatStreamEvent | { data?: ChatStreamEvent };
        const payload = "data" in parsed && parsed.data ? parsed.data : (parsed as ChatStreamEvent);
        if (!payload?.message) return;
        setEvents((prev) => [...prev, payload]);
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
  }, [accessToken, chatId]);

  // Track latest AI message index for streaming animation
  useEffect(() => {
    const conversation = project?.memoryJson?.conversation ?? [];
    const aiIndices = conversation
      .map((item, idx) => (item.role !== "user" ? idx : -1))
      .filter((i) => i !== -1);
    setLatestAIIndex(aiIndices.length > 0 ? aiIndices[aiIndices.length - 1] : -1);
  }, [project?.memoryJson?.conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project?.memoryJson?.conversation, events, reports]);

  // Auto-resize textarea
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
    setEvents((prev) => [
      ...prev,
      {
        type: "session",
        chatId,
        message: "Queueing agents...",
        progress: project?.progress ?? 10,
        status: "running",
        timestamp: new Date().toISOString(),
      },
    ]);

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

  const toggleMemoryExpansion = (runId: string) => {
    setExpandedMemoryRuns((prev) => ({ ...prev, [runId]: !prev[runId] }));
  };

  const memoryMessages = !project?.agentRuns?.length
    ? []
    : [...project.agentRuns]
        .filter((run) => run.status === "completed")
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((run) => ({
          runId: run.id,
          agentType: run.agentType,
          summary: getMemorySummary(run.resultJson),
        }))
        .filter((item) => Boolean(item.summary));

  const directionMemory = project?.memoryJson ?? null;
  const conversation = directionMemory?.conversation ?? [];
  const hasOpenQuestions = (directionMemory?.pendingQuestions?.length ?? 0) > 0;
  const canShowAgentSuggestions = !hasOpenQuestions;
  const recommendedAgentTitle =
    options.find((option) => option.agentType === project?.recommendedFirstAgent)?.title ??
    project?.recommendedFirstAgent ??
    null;

  useEffect(() => {
    if (
      appliedRecommendedAgentRef.current ||
      selectedOptions.length ||
      reports.length > 0 ||
      !recommendedAgentTitle ||
      !canShowAgentSuggestions
    ) {
      return;
    }
    const recommended = options.find((option) => option.title === recommendedAgentTitle);
    if (recommended) {
      setSelectedOptions([recommended.title]);
      appliedRecommendedAgentRef.current = true;
    }
  }, [canShowAgentSuggestions, recommendedAgentTitle, reports.length, selectedOptions.length]);

  const handleSendMessage = async () => {
    const nextMessage = draftMessage.trim();
    if (!nextMessage || sendingMessage) return;

    setSendingMessage(true);
    try {
      await chatService.sendMessage(chatId, nextMessage);
      setDraftMessage("");
      setTextareaRows(1);
      await refreshSession();
    } catch (error) {
      console.error("Failed to send DirectionAI message", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F1F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl border-2 border-[#D8D5E2] border-t-[#0B04CF] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading project...</p>
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

  return (
    <>
      {/* Blink keyframe injected via style tag */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-enter {
          animation: fadeSlideUp 0.25s ease both;
        }
      `}</style>

      <div className="h-screen bg-[#F3F1F8] flex flex-col overflow-hidden">
        {/* ── Scrollable content area with bottom padding equal to composer height ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 pt-6 pb-48 sm:px-6 sm:pt-10">

            {/* ── Project Header ── */}
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
                {directionMemory?.pendingQuestions?.length ? (
                  <p className="mt-2 text-xs text-amber-600 font-medium">
                    DirectionAI is asking a few clarifying questions before recommending the first agent.
                  </p>
                ) : null}
              </div>

            </div>

            {/* ── Conversation Thread ── */}
            <div className="space-y-3 mb-8">
              {conversation.length > 0 ? (
                conversation.map((item, index) => {
                  const isUser = item.role === "user";
                  const isLatestAI = !isUser && index === latestAIIndex;

                  if (isUser) {
                    return (
                      <div key={`${item.createdAt}-${index}`} className="flex justify-end msg-enter">
                        <div className="max-w-[85%] sm:max-w-[70%] bg-[#0B04CF] text-white rounded-[20px] rounded-br-md px-4 py-3 shadow-sm shadow-indigo-500/20">
                          <p className="text-[11px] font-semibold opacity-60 mb-1 uppercase tracking-wide">You</p>
                          <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">{item.content}</p>
                        </div>
                      </div>
                    );
                  }

                  // AI message — streaming-style
                  return (
                    <div key={`${item.createdAt}-${index}`} className="flex justify-start gap-3 msg-enter">
                      {/* Avatar */}
                      <div className="shrink-0 mt-1">
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#D8D5E2] flex items-center justify-center shadow-sm overflow-hidden">
                          <Image
                            src="/LOGO.png"
                            alt="Direction AI"
                            width={20}
                            height={20}
                            className="rounded object-cover"
                          />
                        </div>
                      </div>

                      {/* Bubble */}
                      <div className="max-w-[85%] sm:max-w-[75%]">
                        <p className="text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">DirectionAI</p>
                        <div className="bg-white border border-[#E8E6F0] rounded-[20px] rounded-bl-md px-4 py-3 shadow-sm">
                          <AIMessage
                            content={item.content}
                            isLatest={isLatestAI}
                            isStreaming={isLatestAI && sendingMessage === false}
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
                  <div className="bg-white border border-[#E8E6F0] rounded-[20px] rounded-bl-md px-4 py-3 shadow-sm max-w-[75%]">
                    <p className="text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">DirectionAI</p>
                    <p className="text-sm text-gray-500">DirectionAI is ready to refine the brief.</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Execution Agents ── */}
            <div className="rounded-2xl border border-[#D8D5E2] bg-white shadow-sm overflow-hidden mb-5">
              <div className="border-b border-[#EAE8F3] px-5 py-4">
                <h3 className="font-semibold text-gray-900 text-sm">Execution Agents</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {canShowAgentSuggestions
                    ? "DirectionAI recommends a first step. You can still choose any agent."
                    : "Answer the questions above, then DirectionAI will suggest the first execution agent."}
                </p>
              </div>

              <div className="px-5 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {options.map((option, index) => {
                    const completed = reports.some((report) => report.agentType === option.agentType);
                    const active = selectedOptions.includes(option.title);
                    const recommended = canShowAgentSuggestions && project.recommendedFirstAgent === option.agentType;
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
                          {/* Checkbox */}
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
                                    <img src="/LOGO.png" alt="Recommended" className="w-3 h-3" />
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
                        <span>Executing...</span>
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

            {/* ── Live Process ── */}
            {(running || events.length > 0) && (
              <div className="rounded-2xl border border-[#D8D5E2] bg-white shadow-sm overflow-hidden mb-5">
                <div className="border-b border-[#EAE8F3] px-5 py-3.5 flex items-center gap-2.5">
                  {running && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0B04CF] opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0B04CF]" />
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-900 text-sm">Live Process</h3>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {events.slice(-14).map((event, idx) => (
                    <div
                      key={`${event.timestamp}-${idx}`}
                      className="flex items-start justify-between gap-3 rounded-xl border border-[#EAE8F3] bg-[#F8F7FC] px-3.5 py-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`mt-[7px] inline-block h-1.5 w-1.5 rounded-full shrink-0 ${
                          event.status === "failed" ? "bg-red-500"
                            : event.status === "completed" ? "bg-emerald-500"
                            : "bg-[#0B04CF] animate-pulse"
                        }`} />
                        <div>
                          <p className="text-sm text-gray-700">{event.message}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#0B04CF] shrink-0 tabular-nums">{event.progress}%</span>
                    </div>
                  ))}

                  {running && (
                    <div className="mt-3 px-1">
                      <div className="h-1.5 bg-[#EAE8F3] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#0B04CF] to-[#1208E8] rounded-full transition-all duration-700"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1.5 text-right tabular-nums">{project.progress}% complete</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Agent Memory ── */}
            {memoryMessages.length > 0 && (
              <div className="mb-5 space-y-4">
                {memoryMessages.map((memory) => (
                  <div key={memory.runId} className="rounded-2xl border border-[#D8D5E2] bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-[#EAE8F3] px-5 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#D8D5E2] overflow-hidden shadow-sm">
                        <Image src="/LOGO.png" alt="Direction AI logo" width={32} height={32} className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Direction AI</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide font-medium">{memory.agentType} memory</p>
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <div className="space-y-2">
                        {memory.summary
                          ? renderSummaryMarkdown(
                              expandedMemoryRuns[memory.runId]
                                ? memory.summary
                                : getCollapsedSummary(memory.summary)
                            )
                          : null}
                      </div>
                      {memory.summary && memory.summary.length > 420 ? (
                        <button
                          onClick={() => toggleMemoryExpansion(memory.runId)}
                          className="mt-3 text-xs font-semibold text-[#0B04CF] inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                        >
                          {expandedMemoryRuns[memory.runId] ? (
                            <><span>Show less</span><ChevronUp size={13} /></>
                          ) : (
                            <><span>Expand</span><ChevronDown size={13} /></>
                          )}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Generated Reports ── */}
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

        {/* ── Composer — fixed to bottom, never overlaps content ── */}
        <div className="shrink-0 ">
          <div className="max-w-3xl mx-auto px-4 py-3 sm:px-6">
            <div className="rounded-2xl border border-[#D8D5E2] bg-[#F8F7FC] shadow-inner px-4 pt-3 pb-2.5 focus-within:border-[#0B04CF]/40 focus-within:bg-white transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={draftMessage}
                onChange={handleTextareaChange}
                onKeyDown={handleComposerKeyDown}
                placeholder="Reply to DirectionAI or add more context…"
                rows={textareaRows}
                className="w-full resize-none border-0 bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 leading-relaxed"
                style={{ minHeight: "24px", maxHeight: "112px", overflowY: textareaRows >= 4 ? "auto" : "hidden" }}
              />
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <p className="text-[11px] text-gray-400 hidden sm:block">
                  Enter to send · Shift+Enter for new line
                </p>
                <button
                  onClick={() => void handleSendMessage()}
                  disabled={sendingMessage || !draftMessage.trim()}
                  className="ml-auto h-9 px-4 rounded-xl bg-gradient-to-r from-[#0B04CF] to-[#1208E8] text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 active:scale-[0.97] transition-all duration-150 flex items-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
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