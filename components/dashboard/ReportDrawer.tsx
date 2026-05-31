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

  const printWindow = window.open("", "_blank", "width=1600,height=1200");

  if (!printWindow) return;

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
          html,
          body {
            margin: 0;
            padding: 0;
            background: white;
            width: 100%;
            height: auto;
          }

          body {
            padding: 20px;
            overflow: visible !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          * {
            box-sizing: border-box;
          }

          /* REMOVE PAGE CUTS */
          @page {
            margin: 0;
            size: auto;
          }

          /* PREVENT BREAKS */
          * {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
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

          /* Ensure full width */
          #print-root {
            width: 100%;
            overflow: visible !important;
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
            }, 500);
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
        className={`absolute left-0 right-0 bottom-0 top-auto h-[100dvh] w-[100vw] border-t border-border bg-card shadow-2xl p-0 overflow-y-auto transition-transform duration-300 ease-out md:left-auto md:right-0 md:top-0 md:bottom-auto md:h-full md:w-[100vw] md:border-t-0 md:border-l md:p-6 ${
          isVisible
            ? "translate-y-0 md:translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
      >
        <div className="px-4 pt-4 md:px-0 md:pt-0">
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
        </div>

        <div id="agent-report-print-root" className="mt-6 px-2 pb-4 md:px-0 md:pb-0">
          <div className="md:hidden">
            <div className="rounded-2xl border border-[#D8D5E2] bg-[#F6F6FB] p-3">
              {/* FIXED: removed aspect-[16/10] and overflow-auto so content flows naturally on mobile */}
              <div className="w-full rounded-xl border border-[#D8D5E2] bg-white shadow-sm overflow-visible">
                <div className="p-3">
                  <AgentReportRenderer agentType={activeReport?.agentType} payload={activeRunData} />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <AgentReportRenderer agentType={activeReport?.agentType} payload={activeRunData} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ReportDrawer;