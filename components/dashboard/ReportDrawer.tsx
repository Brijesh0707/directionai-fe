"use client";

import React from "react";
import { Printer, X } from "lucide-react";
import { ChatReport } from "@/types/chat";
import AgentReportRenderer from "./AgentReportRenderer";

type ReportDrawerProps = {
  isOpen: boolean;
  isVisible: boolean;
  activeReport: ChatReport | null;
  activeRunData: unknown;
  onClose: () => void;
};

const ReportDrawer = ({
  isOpen,
  isVisible,
  activeReport,
  activeRunData,
  onClose,
}: ReportDrawerProps) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const html = document.getElementById("agent-report-print-root")?.innerHTML;
    if (!html) return;

    const popup = window.open("", "_blank", "width=1200,height=900");
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>Agent Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            h1, h2, h3, h4 { margin: 0 0 8px; }
            p { margin: 0 0 10px; line-height: 1.55; }
            pre { white-space: pre-wrap; word-break: break-word; }
            .rounded-xl, .rounded-2xl, .rounded-lg { border-radius: 8px; }
            .border { border: 1px solid #e5e7eb; }
            .bg-white, .bg-gray-50 { background: #fff; }
            .p-3, .p-4 { padding: 12px; }
            .mb-3 { margin-bottom: 12px; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

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
          <button
            onClick={handlePrint}
            className="h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm flex items-center gap-2"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>

        <div id="agent-report-print-root" className="mt-6">
          <AgentReportRenderer agentType={activeReport?.agentType} payload={activeRunData} />
        </div>
      </aside>
    </div>
  );
};

export default ReportDrawer;
