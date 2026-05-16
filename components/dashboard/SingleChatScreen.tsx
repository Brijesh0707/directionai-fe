"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, project, events, reports]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F1F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg border-2 border-[#D8D5E2] border-t-[#0B04CF] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading project...</p>
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
    <div className="h-screen bg-[#F3F1F8] flex flex-col overflow-hidden">
      {/* Scrollable content */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-10 pb-24">

          {/* User bubble */}
          <div className="flex justify-end mb-6">
            <div className="max-w-[85%] sm:max-w-xl rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#0B04CF] to-[#1208E8] px-5 py-3.5 shadow-md shadow-indigo-500/20">
              <p className="text-white leading-relaxed text-sm sm:text-base">{project.idea}</p>
            </div>
          </div>

          {/* AI Response Card */}
          <div className="rounded-2xl border border-[#D8D5E2] bg-white shadow-sm overflow-hidden mb-5">
            {/* Card header */}
            <div className="border-b border-[#EAE8F3] px-5 py-4 flex items-center gap-3">
              <Image
                src="/LOGO.png"
                alt="Direction AI logo"
                width={34}
                height={34}
                className="rounded-xl object-cover"
              />
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">Direction AI</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Execution Engine</p>
              </div>
            </div>

            <div className="px-5 py-5">
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                I&apos;ve analyzed your idea. To move from idea to execution, choose which assets should be generated first.
              </p>

              {/* Options Grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((option, index) => {
                  const completed = reports.some((report) => report.agentType === option.agentType);
                  const active = selectedOptions.includes(option.title);
                  const Icon = option.icon;

                  return (
                    <button
                      key={index}
                      onClick={() => toggleOption(option.title)}
                      disabled={completed}
                      className={`
                        group relative rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer
                        ${completed
                          ? "border-emerald-200 bg-emerald-50 cursor-not-allowed"
                          : active
                          ? "border-[#0B04CF] bg-gradient-to-br from-[#0B04CF]/5 to-[#1208E8]/8 shadow-sm shadow-indigo-200/50"
                          : "border-[#D8D5E2] bg-white hover:border-[#0B04CF]/50 hover:bg-gradient-to-br hover:from-[#0B04CF]/3 hover:to-[#1208E8]/5 hover:shadow-sm hover:shadow-indigo-100/60"
                        }
                      `}
                    >
                      {/* Active glow ring */}
                      {active && (
                        <div className="absolute inset-0 rounded-xl ring-1 ring-[#0B04CF]/20 pointer-events-none" />
                      )}

                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div className={`
                          w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all duration-200
                          ${completed
                            ? "bg-emerald-500 border-emerald-500"
                            : active
                            ? "bg-[#0B04CF] border-[#0B04CF]"
                            : "border-[#C8C5D5] bg-white group-hover:border-[#0B04CF]/60"}
                        `}>
                          {(active || completed) && <CheckSquare size={11} className="text-white" strokeWidth={2.5} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Icon + title */}
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`
                              w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
                              ${completed
                                ? "bg-emerald-100"
                                : active
                                ? "bg-[#0B04CF]/10"
                                : "bg-[#F3F1F8] group-hover:bg-[#0B04CF]/8"}
                            `}>
                              <Icon
                                size={14}
                                className={
                                  completed
                                    ? "text-emerald-600"
                                    : active
                                    ? "text-[#0B04CF]"
                                    : "text-gray-400 group-hover:text-[#0B04CF]"
                                }
                              />
                            </div>
                            <h3 className={`font-semibold text-sm transition-colors duration-200 ${active ? "text-[#0B04CF]" : completed ? "text-emerald-700" : "text-gray-800 group-hover:text-[#0B04CF]"}`}>
                              {option.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {option.description}
                            {completed && <span className="ml-1 text-emerald-600 font-medium">Completed.</span>}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Continue Button */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={runSelectedAgents}
                  disabled={!selectedOptions.length || running}
                  className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#0B04CF] to-[#1208E8] text-white text-sm font-medium shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:opacity-95 active:scale-[0.98] transition-all duration-200 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
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

          {/* Live Process */}
          {(running || events.length > 0) && (
            <div className="rounded-2xl border border-[#D8D5E2] bg-white shadow-sm overflow-hidden mb-5">
              <div className="border-b border-[#EAE8F3] px-5 py-3.5 flex items-center gap-2">
                {running && (
                  <span className="w-2 h-2 rounded-full bg-[#0B04CF] animate-pulse" />
                )}
                <h3 className="font-semibold text-gray-900 text-sm">Live Process</h3>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {events.slice(-14).map((event, idx) => (
                  <div
                    key={`${event.timestamp}-${idx}`}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[#EAE8F3] bg-[#F8F7FC] px-3.5 py-2.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full shrink-0 ${
                        event.status === "failed"
                          ? "bg-red-500"
                          : event.status === "completed"
                          ? "bg-emerald-500"
                          : "bg-[#0B04CF] animate-pulse"
                      }`} />
                      <div>
                        <p className="text-sm text-gray-700">{event.message}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#0B04CF] shrink-0">{event.progress}%</span>
                  </div>
                ))}

                {running && (
                  <div className="mt-3 px-1">
                    <div className="h-1.5 bg-[#EAE8F3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0B04CF] to-[#1208E8] rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 text-right">{project.progress}% complete</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Generated Reports */}
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
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{
                          backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                                            radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
                          backgroundSize: "24px 24px",
                        }}
                      />

                      <div className="relative">
                        {/* Icon + title row */}
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                            <Icon size={15} className="text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm leading-tight">{matched?.title ?? report.agentType}</p>
                            <p className="text-[11px] text-indigo-200 mt-0.5 truncate">
                              {report.reportName || "Report available"}
                            </p>
                          </div>
                        </div>

                        {/* View button */}
                        <button
                          onClick={() => void viewReport(report.runId)}
                          className="mt-1 h-8 px-4 rounded-lg bg-white text-[#0B04CF] text-xs font-semibold hover:bg-indigo-50 active:scale-[0.97] transition-all duration-150 flex items-center gap-1.5 shadow-sm"
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

      <ReportDrawer
        isOpen={isDrawerOpen}
        isVisible={isDrawerVisible}
        activeReport={activeReport}
        activeRunData={activeRunData}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default SingleChatScreen;