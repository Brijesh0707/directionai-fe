"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  FileText,
  Globe,
  Link2,
  Lock,
  Share2,
} from "lucide-react";
import SideBarDashboardWrapper from "@/providers/SideBarDashboardWrapper";
import { chatService } from "@/services/chat.service";
import { ChatReport, ChatSession, ProjectShareInfo, ReportShareInfo } from "@/types/chat";
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
  const [shareInfo, setShareInfo] = useState<ProjectShareInfo | null>(null);
  const [shareLoading, setShareLoading] = useState(true);
  const [savingProjectShare, setSavingProjectShare] = useState(false);
  const [savingReportShares, setSavingReportShares] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [activeReport, setActiveReport] = useState<ChatReport | null>(null);
  const [activeRunData, setActiveRunData] = useState<unknown>(null);

  useEffect(() => {
    if (!slug) return;

    const loadProject = async () => {
      setLoading(true);
      setShareLoading(true);
      try {
        const [sessionResult, reportsResult, shareResult] = await Promise.allSettled([
          chatService.getSession(slug),
          chatService.listReports(slug),
          chatService.getProjectShare(slug),
        ]);

        if (sessionResult.status === "fulfilled") {
          setProject(sessionResult.value);
        } else {
          throw sessionResult.reason;
        }

        if (reportsResult.status === "fulfilled") {
          setReports(reportsResult.value);
        } else {
          throw reportsResult.reason;
        }

        if (shareResult.status === "fulfilled") {
          setShareInfo(shareResult.value);
        } else {
          setShareInfo(null);
        }
      } catch (error) {
        console.error("Failed to load project", error);
        setProject(null);
        setReports([]);
        setShareInfo(null);
      } finally {
        setLoading(false);
        setShareLoading(false);
      }
    };

    void loadProject();
  }, [slug]);

  const reportCountLabel = useMemo(() => {
    if (reports.length === 1) return "1 report";
    return `${reports.length} reports`;
  }, [reports.length]);

  const publicProjectUrl = shareInfo?.publicSharePath
    ? `${typeof window === "undefined" ? "" : window.location.origin}${shareInfo.publicSharePath}`
    : null;

  const getPublicUrl = (path?: string | null) => {
    if (!path) return null;
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  };

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1500);
  };

  const toggleProjectShare = async () => {
    if (!slug || savingProjectShare) return;
    setSavingProjectShare(true);
    try {
      const next = await chatService.updateProjectShare(slug, !(shareInfo?.isPublic ?? false));
      setShareInfo((prev) =>
        prev
          ? {
              ...prev,
              isPublic: next.isPublic,
              publicShareToken: next.publicShareToken ?? prev.publicShareToken ?? null,
              publicSharePath: next.publicSharePath ?? prev.publicSharePath ?? null,
            }
          : {
              chatId: slug,
              title: project?.title ?? "Project",
              isPublic: next.isPublic,
              publicShareToken: next.publicShareToken ?? null,
              publicSharePath: next.publicSharePath ?? null,
              reports: [],
            },
      );
    } catch (error) {
      console.error("Failed to update project share", error);
    } finally {
      setSavingProjectShare(false);
    }
  };

  const toggleReportShare = async (runId: string, nextPublic: boolean) => {
    if (!slug) return;
    setSavingReportShares((current) => ({ ...current, [runId]: true }));
    try {
      const result: ReportShareInfo = await chatService.updateReportShare(slug, runId, nextPublic);
      setReports((current) =>
        current.map((report) =>
          report.runId === runId
            ? {
                ...report,
                isPublic: result.isPublic,
                publicShareToken: result.publicShareToken ?? report.publicShareToken ?? null,
                publicSharePath: result.publicSharePath ?? report.publicSharePath ?? null,
              }
            : report,
        ),
      );
      return result;
    } catch (error) {
      console.error("Failed to update report share", error);
      return null;
    } finally {
      setSavingReportShares((current) => ({ ...current, [runId]: false }));
    }
  };

  const handleReportShareLink = async (report: ChatReport) => {
    const currentLink = getPublicUrl(report.publicSharePath);
    if (report.isPublic && currentLink) {
      await copyText(currentLink, `report-${report.runId}`);
      return;
    }

    const updated = await toggleReportShare(report.runId, true);
    const nextLink = getPublicUrl(updated?.publicSharePath ?? report.publicSharePath);
    if (nextLink) {
      await copyText(nextLink, `report-${report.runId}`);
    }
  };

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

          <div className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-primary" />
                  <h2 className="text-base font-semibold text-foreground">Project Sharing</h2>
                  {shareLoading ? (
                    <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                      Loading
                    </span>
                  ) : shareInfo?.isPublic ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                      Public
                    </span>
                  ) : (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                      Private
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
                  Public access exposes the project summary and shared reports only. Chat memory and private conversation history stay hidden.
                </p>
              </div>

              <button
                onClick={() => void toggleProjectShare()}
                disabled={savingProjectShare || shareLoading}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  shareInfo?.isPublic
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border border-border bg-background text-foreground hover:border-primary/30"
                }`}
              >
                {shareInfo?.isPublic ? <Globe size={15} /> : <Lock size={15} />}
                {savingProjectShare
                  ? "Updating..."
                  : shareInfo?.isPublic
                  ? "Make Private"
                  : "Make Public"}
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Public link</p>
                <p className="mt-1 break-all text-sm text-foreground">
                  {publicProjectUrl ?? "Enable public sharing to generate a link."}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => publicProjectUrl ? void copyText(publicProjectUrl, "project-link") : void 0}
                  disabled={!publicProjectUrl}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-all hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {copiedKey === "project-link" ? <Check size={15} /> : <Copy size={15} />}
                  {copiedKey === "project-link" ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>
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

                      <div className="col-span-2 flex justify-end gap-2">
                        <button
                          onClick={() => void handleReportShareLink(report)}
                          disabled={savingReportShares[report.runId]}
                          className={`h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            report.isPublic
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-border bg-background text-foreground hover:border-primary/30"
                          }`}
                        >
                          {report.isPublic ? <Globe size={14} /> : <Link2 size={14} />}
                          {savingReportShares[report.runId]
                            ? "Saving..."
                            : report.isPublic
                            ? copiedKey === `report-${report.runId}`
                              ? "Copied"
                              : "Copy link"
                            : "Make Public"}
                        </button>
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
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => void handleReportShareLink(report)}
                            disabled={savingReportShares[report.runId]}
                            className={`h-9 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              report.isPublic
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-border bg-background text-foreground"
                            }`}
                          >
                            {report.isPublic ? <Globe size={13} /> : <Link2 size={13} />}
                            {savingReportShares[report.runId]
                              ? "..."
                              : report.isPublic
                              ? "Copy"
                              : "Public"}
                          </button>
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
