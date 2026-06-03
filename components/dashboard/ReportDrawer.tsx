"use client";

import React, { useState } from "react";
import { Loader2, Download, X } from "lucide-react";
import { chatService } from "@/services/chat.service";
import { ChatReport } from "@/types/chat";
import AgentReportRenderer from "./AgentReportRenderer";

type ReportDrawerProps = {
  isOpen: boolean;
  isVisible: boolean;
  chatId: string;
  activeReport: ChatReport | null;
  activeRunData: unknown;
  onClose: () => void;
};

const ReportDrawer = ({
  isOpen,
  isVisible,
  chatId,
  activeReport,
  activeRunData,
  onClose,
}: ReportDrawerProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    const content = document.getElementById("agent-report-print-root");

    if (!content || !activeReport?.runId) return;

    setIsDownloading(true);

    try {
      const headStyles = Array.from(
        document.head.querySelectorAll('link[rel="stylesheet"], style'),
      )
        .map((node) => node.outerHTML)
        .join("\n");


    const globalStyles = `
  :root {
    --primary: #0B04CF;
    --secondary: #1208E8;
    --tertiary: #800500;
    --neutral: #777682;

    --background: #F3F1F8;
    --foreground: #171717;

    --card: #ECEAF3;
    --card-foreground: #1E1E2A;
    --border: #D8D5E2;
    --input: #E6E3EF;
    --ring: #0B04CF;

    --muted: #A2A0B3;
    --muted-foreground: #5F5D6B;

    --radius: 18px;
  }

  .dark {
    --background: #0E0E14;
    --foreground: #F5F5F7;

    --card: #171720;
    --card-foreground: #FFFFFF;

    --border: #262635;
    --input: #1D1D2A;

    --muted: #8A8A9A;
    --muted-foreground: #B7B7C9;
  }

  * {
    box-sizing: border-box;
    border-color: var(--border);
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    padding: 20px;
    background: var(--background);
    color: var(--foreground);
    font-family: Arial, Helvetica, sans-serif;
    min-height: 100vh;
    overflow: visible !important;
  }

  #print-root {
    width: 100%;
    max-width: 100%;
    overflow: visible !important;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
  }

  .dark .glass-card {
    background: rgba(20, 20, 30, 0.7);
  }

  .gradient-primary {
    background: linear-gradient(
      135deg,
      var(--primary),
      var(--secondary)
    );
  }

  .gradient-danger {
    background: linear-gradient(
      135deg,
      var(--tertiary),
      #b30a00
    );
  }

  .scroll-hidden {
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .scroll-hidden::-webkit-scrollbar {
    display: none;
  }

  .print\\:hidden {
    display: none !important;
  }

  @media print {
    body {
      padding: 0;
    }

    #print-root,
    #print-root * {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .report-section,
    .report-card,
    .agent-report-content {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    table,
    pre {
      max-width: 100% !important;
      overflow-x: auto !important;
    }
  }
`;

      const printableHtml = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <base href="${window.location.origin}/" />
            <title>${activeReport.reportName || activeReport.agentType || "Agent Report"}</title>
             <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"><\/script>

  ${headStyles}

  <style>
    ${globalStyles}
  </style>
          </head>
          <body>
            <div id="print-root">
              ${content.innerHTML}
            </div>
          </body>
        </html>`;

      const blob = await chatService.downloadReport(
        chatId,
        activeReport.runId,
        printableHtml,
      );

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = (activeReport.reportName || activeReport.agentType || "report")
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
        .replace(/\s+/g, " ")
        .trim();

      link.href = objectUrl;
      link.download = `${safeName || "report"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    } finally {
      setIsDownloading(false);
    }
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
              <h3 className="text-xl font-bold text-foreground">
                {activeReport?.agentType || "Preview"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {activeReport?.reportName || "Structured output"}
              </p>
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
              onClick={() => void handleDownloadPdf()}
              disabled={isDownloading}
              className="h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm flex items-center gap-2 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={14} /> Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        <div id="agent-report-print-root" className="mt-6 px-2 pb-4 md:px-0 md:pb-0">
          <div className="md:hidden">
            <div className="rounded-2xl border border-[#D8D5E2] bg-[#F6F6FB] p-3">
              <div className="w-full rounded-xl border border-[#D8D5E2] bg-white shadow-sm overflow-visible">
                <div className="p-3">
                  <AgentReportRenderer
                    agentType={activeReport?.agentType}
                    payload={activeRunData}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <AgentReportRenderer
              agentType={activeReport?.agentType}
              payload={activeRunData}
            />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ReportDrawer;
