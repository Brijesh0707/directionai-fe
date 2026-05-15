"use client";

import React from "react";
import { Download, X } from "lucide-react";
import { ChatReport } from "@/types/chat";
import PptJsonViewer from "./PptJsonViewer";

type ReportDrawerProps = {
  isOpen: boolean;
  isVisible: boolean;
  activeReport: ChatReport | null;
  activeRunData: unknown;
  onClose: () => void;
  onDownload: (runId: string, reportName?: string | null) => Promise<void>;
};

const ReportDrawer = ({
  isOpen,
  isVisible,
  activeReport,
  activeRunData,
  onClose,
  onDownload,
}: ReportDrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        className={`absolute inset-0 backdrop-blur-[2px] transition-all duration-300 ${
          isVisible ? "bg-black/45 opacity-100" : "bg-black/0 opacity-0"
        }`}
        onClick={onClose}
        aria-label="Close report drawer"
      />
      <aside
        className={`absolute right-0 top-0 h-full w-[64vw] border-l border-border bg-card shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Agent Report</p>
            <h3 className="text-xl font-bold text-foreground">{activeReport?.agentType || "Preview"}</h3>
            <p className="text-sm text-muted-foreground mt-1">{activeReport?.reportName || "Structured output"}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 flex gap-3">
          {activeReport?.hasDownload && (
            <button
              onClick={() => void onDownload(activeReport.runId, activeReport.reportName)}
              className="h-11 px-4 rounded-xl gradient-primary text-white text-sm flex items-center gap-2"
            >
              <Download size={14} /> Download PPT
            </button>
          )}
        </div>

        <div className="mt-6">
          {activeReport?.agentType === "PPT" && (
            <div className="rounded-2xl border border-border bg-background/80 p-3">
              <PptJsonViewer payload={activeRunData} />
            </div>
          )}
          {activeReport?.agentType !== "PPT" && (
            <pre className="text-xs leading-6 text-foreground whitespace-pre-wrap break-words rounded-2xl border border-border bg-background/70 p-4 max-h-[70vh] overflow-auto">
              {JSON.stringify(activeRunData, null, 2)}
            </pre>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ReportDrawer;
