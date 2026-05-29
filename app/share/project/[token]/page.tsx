"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Folder, Globe, Share2 } from "lucide-react";
import { chatService } from "@/services/chat.service";
import { PublicProjectResponse } from "@/types/chat";

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function PublicProjectPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<PublicProjectResponse | null>(null);
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await chatService.getPublicProject(token);
        setPayload(data);
      } catch (error) {
        console.error("Failed to load public project", error);
        setPayload(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  const reports = useMemo(() => payload?.reports ?? [], [payload?.reports]);
  const toPublicUrl = (path?: string | null) => (path ? `${origin}${path}` : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F1F8] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-12 w-48 rounded-2xl bg-white/70 animate-pulse" />
          <div className="h-40 rounded-[28px] bg-white animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-40 rounded-[28px] bg-white animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="min-h-screen bg-[#F3F1F8] flex items-center justify-center px-4">
        <div className="max-w-md rounded-[28px] border border-[#D8D5E2] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B04CF]/10 text-[#0B04CF]">
            <Globe size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Public project unavailable</h1>
          <p className="mt-2 text-sm text-gray-500">
            This link is invalid, expired, or the project has been made private.
          </p>
          <Link
            href="/dashboard/projects"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#0B04CF] px-4 text-sm font-semibold text-white"
          >
            <ArrowLeft size={15} />
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F1F8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Share2 size={12} />
            Public project
          </span>
        </div>

        <div className="rounded-[32px] border border-[#D8D5E2] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#0B04CF]/10 via-[#1208E8]/10 to-[#6B66F5]/10 text-[#0B04CF]">
                  <Folder size={26} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0B04CF]/60">
                    Shared workspace
                  </p>
                  <h1 className="truncate text-3xl font-bold text-gray-900">{payload.project.title}</h1>
                </div>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-gray-600">{payload.project.idea}</p>
              <p className="mt-3 text-xs text-gray-400">
                {payload.project.projectCategory ? `${payload.project.projectCategory} · ` : ""}
                Updated {formatDate(payload.project.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <FileText size={16} className="text-[#0B04CF]" />
            <h2 className="text-lg font-semibold text-gray-900">Visible reports</h2>
            <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[11px] text-gray-500">
              {reports.length}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => {
              const publicUrl = toPublicUrl(report.publicSharePath);
              return (
                <div
                  key={report.runId}
                  className="rounded-[28px] border border-[#D8D5E2] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B04CF]/10 text-[#0B04CF]">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {report.reportName ?? `${report.agentType} report`}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{report.agentType}</p>
                    </div>
                  </div>

                  <div className="mb-5 rounded-2xl border border-border bg-[#F8F7FC] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">Public link</p>
                    <p className="mt-1 truncate text-sm text-gray-800">
                      {publicUrl ?? "This report is not public."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">{formatDate(report.createdAt)}</span>
                    {publicUrl ? (
                      <Link
                        href={`/share/report/${report.publicShareToken}`}
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0B04CF] px-4 text-sm font-semibold text-white"
                      >
                        View report
                      </Link>
                    ) : (
                      <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-border px-4 text-sm text-gray-400">
                        Private
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
