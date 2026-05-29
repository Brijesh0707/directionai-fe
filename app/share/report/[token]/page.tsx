"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Share2 } from "lucide-react";
import AgentReportRenderer from "@/components/dashboard/AgentReportRenderer";
import { chatService } from "@/services/chat.service";
import { PublicReportResponse } from "@/types/chat";

export default function PublicReportPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<PublicReportResponse | null>(null);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await chatService.getPublicReport(token);
        setPayload(data);
      } catch (error) {
        console.error("Failed to load public report", error);
        setPayload(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F1F8] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-12 w-48 rounded-2xl bg-white/70 animate-pulse" />
          <div className="h-[70vh] rounded-[28px] bg-white animate-pulse" />
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="min-h-screen bg-[#F3F1F8] flex items-center justify-center px-4">
        <div className="max-w-md rounded-[28px] border border-[#D8D5E2] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B04CF]/10 text-[#0B04CF]">
            <FileText size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Public report unavailable</h1>
          <p className="mt-2 text-sm text-gray-500">
            This link is invalid, expired, or the report has been made private.
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
        {/* <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={`/share/project/${token}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to project
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Share2 size={12} />
            Public report
          </span>
        </div> */}

        <div className="rounded-[32px] border border-[#D8D5E2] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0B04CF]/60">
            {payload.project.projectCategory ?? "Shared project"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{payload.report.agentType}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600">
            {payload.report.reportName ?? "Structured public report"}
          </p>
          <p className="mt-4 text-xs text-gray-400">{payload.project.title}</p>
        </div>

        <div className="mt-8 rounded-[32px] border border-[#D8D5E2] bg-white p-3 shadow-sm sm:p-5">
          <AgentReportRenderer agentType={payload.report.agentType} payload={payload.report.resultJson} />
        </div>
      </div>
    </div>
  );
}
