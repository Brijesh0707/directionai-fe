"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, FileText } from "lucide-react";
import SideBarDashboardWrapper from "@/providers/SideBarDashboardWrapper";
import { chatService } from "@/services/chat.service";
import { ChatReport, ChatSession } from "@/types/chat";
import ReportDrawer from "@/components/dashboard/ReportDrawer";

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const SingleProjectPage = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ChatSession | null>(null);
  const [reports, setReports] = useState<ChatReport[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [activeReport, setActiveReport] = useState<ChatReport | null>(null);
  const [activeRunData, setActiveRunData] = useState<unknown>(null);

  useEffect(() => {
    if (!slug) return;

    const loadProject = async () => {
      setLoading(true);
      try {
        const [sessionData, reportsData] = await Promise.all([
          chatService.getSession(slug),
          chatService.listReports(slug),
        ]);

        setProject(sessionData);
        setReports(reportsData);
      } catch (error) {
        console.error("Failed to load project", error);
        setProject(null);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [slug]);

  const reportCountLabel = useMemo(() => {
    if (reports.length === 1) return "1 report";
    return `${reports.length} reports`;
  }, [reports.length]);

  const openReport = async (runId: string) => {
    if (!slug) return;
    try {
      const run = await chatService.getRunResult(slug, runId);
      const reportMeta = reports.find((item) => item.runId === runId) ?? null;
      setActiveReport(reportMeta);
      setActiveRunData(run?.resultJson ?? run);
      setIsDrawerOpen(true);
      requestAnimationFrame(() => setIsDrawerVisible(true));
    } catch (error) {
      console.error("Failed to load report", error);
    }
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    window.setTimeout(() => setIsDrawerOpen(false), 280);
  };

  return (
    <SideBarDashboardWrapper>
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <button
                onClick={() => router.push("/dashboard/projects")}
                className="w-11 h-11 shrink-0 rounded-2xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                {loading ? (
                  <>
                    <div className="h-8 w-64 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-96 rounded bg-gray-100 animate-pulse mt-2" />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {project?.title ?? "Project"}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
                      {project?.idea ?? "No project description available."}
                    </p>
                  </>
                )}
              </div>
            </div>

            {!loading && (
              <div className="text-sm text-muted-foreground">{reportCountLabel}</div>
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="hidden lg:grid grid-cols-12 gap-4 border-b border-border px-6 py-5 bg-background/50">
              <div className="col-span-5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Report
              </div>
              <div className="col-span-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Agent
              </div>
              <div className="col-span-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Created
              </div>
              <div className="col-span-2 text-right text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Action
              </div>
            </div>

            <div>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="border-b border-border last:border-0 px-6 py-5 animate-pulse">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 h-4 bg-gray-200 rounded" />
                      <div className="col-span-3 h-4 bg-gray-100 rounded" />
                      <div className="col-span-2 h-4 bg-gray-100 rounded" />
                      <div className="col-span-2 h-9 bg-gray-100 rounded ml-auto w-24" />
                    </div>
                  </div>
                ))
              ) : reports.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">No reports found for this project yet.</div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.runId}
                    className="border-b border-border last:border-0 transition-colors hover:bg-background/40"
                  >
                    <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-6 py-5">
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {report.reportName ?? `${report.agentType} report`}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">Structured agent output</p>
                        </div>
                      </div>

                      <div className="col-span-3 text-sm text-foreground">{report.agentType}</div>

                      <div className="col-span-2 text-xs text-muted-foreground">{formatDate(report.createdAt)}</div>

                      <div className="col-span-2 flex justify-end">
                        <button
                          onClick={() => openReport(report.runId)}
                          className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </div>
                    </div>

                    <div className="lg:hidden p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {report.reportName ?? `${report.agentType} report`}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{report.agentType}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(report.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => openReport(report.runId)}
                          className="h-9 px-3 rounded-xl bg-primary text-white text-xs font-medium flex items-center gap-1 shrink-0"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
    </SideBarDashboardWrapper>
  );
};

export default SingleProjectPage;
