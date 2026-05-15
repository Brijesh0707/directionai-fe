"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  SendHorizonal,
  Mic,
  Paperclip,
  CheckSquare,
  ChevronRight,
  Download,
  Eye,
  X,
} from "lucide-react";
import { chatService } from "@/services/chat.service";
import { useAppSelector } from "@/store/hooks";
import { ChatReport, ChatSession, ChatStreamEvent } from "@/types/chat";

const options = [
  {
    title: "Market Research",
    description: "Competitive analysis and user persona mapping.",
    agentType: "RESEARCH",
  },
  {
    title: "Pitch Deck",
    description: "A 10-slide high-impact presentation for seed funding.",
    agentType: "PPT",
  },
  {
    title: "PPT (Investor Presentation)",
    description: "Detailed financial projections and scaling roadmap.",
    agentType: "PPT",
  },
  {
    title: "Phase-wise Development Guide",
    description: "Step-by-step tech stack and sprint planning.",
    agentType: "DEVELOPMENT",
  },
];

const SingleChatScreen = ({ chatId }: { chatId: string }) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ChatSession | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<ChatStreamEvent[]>([]);
  const [reports, setReports] = useState<ChatReport[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<ChatReport | null>(null);
  const [activeRunData, setActiveRunData] = useState<any>(null);

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
        const payload = JSON.parse(event.data) as ChatStreamEvent;
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

    source.onerror = () => {
      source.close();
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
          .map((option) => option.agentType),
      ),
    );

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
    } catch (error) {
      console.error("Failed to run agents", error);
      setRunning(false);
    }
  };

  const downloadReport = async (runId: string, reportName?: string | null) => {
    try {
      const blob = await chatService.downloadReport(chatId, runId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = reportName || `report-${runId}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download report", error);
    }
  };

  const viewReport = async (runId: string) => {
    try {
      const run = await chatService.getRunResult(chatId, runId);
      const reportMeta = reports.find((item) => item.runId === runId) ?? null;
      setActiveReport(reportMeta);
      setActiveRunData(run?.resultJson ?? run);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Failed to view report", error);
    }
  };

  const renderPptPreview = () => {
    const payload = activeRunData;
    const slides = payload?.slides;
    if (!Array.isArray(slides) || slides.length === 0) return null;

    return (
      <div className="space-y-4">
        {slides.map((slide: any) => (
          <div key={slide.id} className="rounded-2xl border border-border bg-background/80 p-4">
            <p className="text-xs text-muted-foreground">Slide {slide.id} • {slide.type}</p>
            <h4 className="mt-1 text-base font-bold text-foreground">{slide.heading || slide.title}</h4>
            {slide.subheading && <p className="mt-1 text-sm text-muted-foreground">{slide.subheading}</p>}
            {Array.isArray(slide.bullets) && slide.bullets.length > 0 && (
              <ul className="mt-3 space-y-2">
                {slide.bullets.slice(0, 6).map((bullet: string, idx: number) => (
                  <li key={idx} className="text-sm text-foreground leading-6">
                    • {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="relative h-screen bg-background overflow-hidden flex flex-col p-5">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 flex flex-col h-full">
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="ml-auto h-24 w-[70%] rounded-[28px] bg-border" />
                <div className="h-[420px] rounded-[32px] bg-border" />
              </div>
            ) : project ? (
              <div className="space-y-8">
                <div className="flex justify-end">
                  <div className="max-w-3xl rounded-[30px] gradient-primary p-6 shadow-2xl">
                    <p className="text-lg leading-9 text-white font-medium">{project.idea}</p>
                  </div>
                </div>

                <div className="rounded-[36px] border border-border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                          <Sparkles size={22} className="text-white" />
                        </div>

                        <div>
                          <h2 className="text-xl font-extrabold text-primary">Direction AI</h2>
                          <p className="text-sm text-muted-foreground">AI Execution Engine</p>
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-muted-foreground">{project.progress}%</div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-lg leading-9 text-foreground">
                      I&apos;ve analyzed your idea. To move from idea to execution, choose which assets should be generated first.
                    </p>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
                      {options.map((option, index) => {
                        const active = selectedOptions.includes(option.title);

                        return (
                          <button
                            key={index}
                            onClick={() => toggleOption(option.title)}
                            className={`group relative rounded-[24px] border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                              active
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-border bg-background hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-1 shrink-0 ${
                                  active ? "gradient-primary border-primary" : "border-border bg-card"
                                }`}
                              >
                                {active && <CheckSquare size={14} className="text-white" />}
                              </div>

                              <div>
                                <h3 className="text-lg font-bold text-foreground">{option.title}</h3>
                                <p className="mt-2 text-sm leading-7 text-muted-foreground">{option.description}</p>
                              </div>
                            </div>

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-10 flex justify-end">
                      <button
                        onClick={runSelectedAgents}
                        disabled={!selectedOptions.length || running}
                        className="group h-14 px-7 rounded-2xl gradient-primary text-white font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {running ? "Executing..." : "Continue Execution"}
                        <ChevronRight
                          size={20}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {(running || events.length > 0) && (
                  <div className="rounded-[28px] border border-border bg-card/80 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-bold text-foreground">Live Process</h3>
                    <div className="mt-4 space-y-3">
                      {events.slice(-8).map((event, idx) => (
                        <div key={`${event.timestamp}-${idx}`} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                          <p className="text-sm text-foreground">{event.message}</p>
                          <span className="text-xs text-muted-foreground">{event.progress}%</span>
                        </div>
                      ))}
                      {running && (
                        <div className="h-2 rounded-full bg-border overflow-hidden mt-2">
                          <div className="h-full gradient-primary rounded-full animate-pulse" style={{ width: `${project.progress}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {reports.length > 0 && (
                  <div className="rounded-[28px] border border-border bg-card/80 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-bold text-foreground">Agent Reports</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reports.map((report) => (
                        <div key={report.runId} className="rounded-2xl border border-border p-4 bg-background/80">
                          <p className="text-sm font-semibold text-foreground">{report.agentType}</p>
                          <p className="text-xs text-muted-foreground mt-1">{report.reportName || "JSON report available"}</p>
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => void viewReport(report.runId)}
                              className="h-10 px-4 rounded-xl border border-border bg-card hover:border-primary text-sm flex items-center gap-2"
                            >
                              <Eye size={14} /> View
                            </button>
                            {report.hasDownload && (
                              <button
                                onClick={() => void downloadReport(report.runId, report.reportName)}
                                className="h-10 px-4 rounded-xl gradient-primary text-white text-sm flex items-center gap-2"
                              >
                                <Download size={14} /> Download
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center py-6">
                  <div className="w-full h-px bg-border" />
                </div>
              </div>
            ) : (
              <div className="rounded-[32px] border border-border bg-card p-10 text-center">
                <h2 className="text-3xl font-extrabold text-foreground">Project not found</h2>
                <p className="mt-4 text-lg text-muted-foreground">This chat id does not exist.</p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="flex-shrink-0 ">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="rounded-[28px] border border-border p-3 flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={1}
                  placeholder="Refine your strategy or ask about specific features..."
                  className="w-full bg-transparent resize-none outline-none px-3 py-3 text-base text-foreground placeholder:text-muted-foreground leading-7 max-h-[160px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="w-11 h-11 rounded-2xl border border-border bg-background hover:border-primary transition-all duration-300 flex items-center justify-center text-muted-foreground hover:text-primary">
                  <Paperclip size={18} />
                </button>

                <button className="w-11 h-11 rounded-2xl border border-border bg-background hover:border-primary transition-all duration-300 flex items-center justify-center text-muted-foreground hover:text-primary">
                  <Mic size={18} />
                </button>

                <button className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-lg hover:scale-[1.05] active:scale-[0.98] transition-all duration-300">
                  <SendHorizonal size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[120]">
          <button
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close report drawer"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl border-l border-border bg-card shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Agent Report</p>
                <h3 className="text-xl font-bold text-foreground">{activeReport?.agentType || "Preview"}</h3>
                <p className="text-sm text-muted-foreground mt-1">{activeReport?.reportName || "Structured output"}</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-10 h-10 rounded-xl border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 flex gap-3">
              {activeReport?.hasDownload && (
                <button
                  onClick={() => activeReport && void downloadReport(activeReport.runId, activeReport.reportName)}
                  className="h-11 px-4 rounded-xl gradient-primary text-white text-sm flex items-center gap-2"
                >
                  <Download size={14} /> Download PPT
                </button>
              )}
            </div>

            <div className="mt-6">
              {activeReport?.agentType === "PPT" && renderPptPreview()}
              {activeReport?.agentType !== "PPT" && (
                <pre className="text-xs leading-6 text-foreground whitespace-pre-wrap break-words rounded-2xl border border-border bg-background/70 p-4 max-h-[70vh] overflow-auto">
                  {JSON.stringify(activeRunData, null, 2)}
                </pre>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default SingleChatScreen;
