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

    return () => {
      source.close();
    };
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
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const runSelectedAgents = async () => {
    if (!selectedOptions.length || running) return;

    const selectedAgentTypes = Array.from(
      new Set(
        options
          .filter((option) => selectedOptions.includes(option.title))
          .filter((option) => !reports.some((report) => report.agentType === option.agentType))
          .map((option) => option.agentType),
      ),
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
    window.setTimeout(() => {
      setIsDrawerOpen(false);
    }, 280);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg border-2 border-gray-200 border-t-[#0B04CF] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-500">This chat session doesn&apos;t exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Main Content - Scrollable */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 pb-20">
          {/* Saved initial project message from chat session */}
          <div className="flex justify-end mb-6">
            <div className="max-w-2xl rounded-lg bg-gradient-to-r from-[#0B04CF] to-[#1208E8] px-5 py-3 shadow-sm">
              <p className="text-white leading-relaxed">{project.idea}</p>
            </div>
          </div>

          {/* AI Response Card */}
          <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <Image src="/LOGO.png" alt="Direction AI logo" width={32} height={32} className="rounded-lg object-cover" />
                <div>
                  <h2 className="font-semibold text-gray-900">Direction AI</h2>
                  <p className="text-xs text-gray-500">Execution Engine</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-6">
              <p className="text-gray-700 leading-relaxed">
                I&apos;ve analyzed your idea. To move from idea to execution, choose which assets should be generated first.
              </p>

              {/* Options Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        group relative rounded-lg border p-4 text-left transition-all duration-200
                        ${completed
                          ? "border-emerald-200 bg-emerald-50/70 cursor-not-allowed opacity-80"
                          : active
                          ? "border-[#0B04CF] bg-[#0B04CF]/5 shadow-sm" 
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-all
                          ${completed
                            ? "bg-emerald-500 border-emerald-500"
                            : active
                            ? "bg-[#0B04CF] border-[#0B04CF]"
                            : "border-gray-300 bg-white"}
                        `}>
                          {(active || completed) && <CheckSquare size={12} className="text-white" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={completed ? "text-emerald-600" : active ? "text-[#0B04CF]" : "text-gray-400"} />
                            <h3 className="font-semibold text-gray-900">{option.title}</h3>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                            {option.description}
                            {completed ? " Completed." : ""}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Continue Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={runSelectedAgents}
                  disabled={!selectedOptions.length || running}
                  className="h-10 px-5 rounded-lg bg-gradient-to-r from-[#0B04CF] to-[#1208E8] text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue Execution</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Live Process */}
          {(running || events.length > 0) && (
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-100 px-5 py-4">
                <h3 className="font-semibold text-gray-900">Live Process</h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                {events.slice(-14).map((event, idx) => (
                  <div key={`${event.timestamp}-${idx}`} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/40 px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 inline-block h-2 w-2 rounded-full ${event.status === "failed" ? "bg-red-500" : event.status === "completed" ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
                      <div>
                        <p className="text-sm text-gray-800">{event.message}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{new Date(event.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{event.progress}%</span>
                  </div>
                ))}
                {running && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#0B04CF] to-[#1208E8] rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports */}
          {reports.length > 0 && (
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-4">
                <h3 className="font-semibold text-gray-900">Generated Reports</h3>
              </div>
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reports.map((report) => (
                  <div key={report.runId} className="border border-gray-200 rounded-lg p-4 bg-gray-50/30">
                    <p className="font-medium text-gray-900 text-sm">{report.agentType}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{report.reportName || "Report available"}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => void viewReport(report.runId)}
                        className="h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:border-[#0B04CF] hover:text-[#0B04CF] transition-all flex items-center gap-1"
                      >
                        <Eye size={12} /> View
                      </button>
                    </div>
                  </div>
                ))}
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
