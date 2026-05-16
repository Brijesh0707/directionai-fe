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
  const content = document.getElementById("agent-report-print-root");

  if (!content) return;

  const printWindow = window.open("", "_blank", "width=1400,height=1000");

  if (!printWindow) return;

  // Clone stylesheets from current app
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        if (styleSheet.href) {
          return `<link rel="stylesheet" href="${styleSheet.href}" />`;
        }

        const rules = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");

        return `<style>${rules}</style>`;
      } catch {
        return "";
      }
    })
    .join("\n");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Agent Report</title>

        ${styles}

        <style>
          html, body {
            padding: 0;
            margin: 0;
            background: white;
          }

          body {
            padding: 24px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: A4;
            margin: 16mm;
          }

          * {
            box-sizing: border-box;
          }

          .print\\:hidden {
            display: none !important;
          }

          .shadow-lg,
          .shadow-md,
          .shadow-sm {
            box-shadow: none !important;
          }

          .backdrop-blur-sm,
          .backdrop-blur-md {
            backdrop-filter: none !important;
          }

          .hover\\:shadow-lg:hover,
          .hover\\:shadow-md:hover {
            box-shadow: none !important;
          }
        </style>
      </head>

      <body>
        <div id="print-root">
          ${content.innerHTML}
        </div>

        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
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
