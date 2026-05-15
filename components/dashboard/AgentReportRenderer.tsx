"use client";

import React from "react";
import {
  FileText,
  TrendingUp,
  Code2,
  Megaphone,
  ChevronRight,
  Download,
  Eye,
  Sparkles,
  Layers,
  Target,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Props = {
  agentType?: string;
  payload: unknown;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const pretty = (value: unknown) => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map((item) => pretty(item)).join(" • ");
  return "";
};

const Section = ({ title, icon: Icon, children }: { title: string; icon?: React.ElementType; children: React.ReactNode }) => (
  <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div className="border-b border-gray-100 px-4 py-3 bg-gray-50/50">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-[#0B04CF]" />}
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

const KeyValueGrid = ({ data }: { data: Record<string, unknown> }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {Object.entries(data).map(([key, value]) => (
      <div key={key} className="rounded-md bg-gray-50 p-3">
        <p className="text-xs font-medium text-gray-500 mb-1 capitalize">{key.replace(/_/g, " ")}</p>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{pretty(value) || "-"}</p>
      </div>
    ))}
  </div>
);

// PPT Slide Component
const PptSlide = ({ slide, index, total }: { slide: any; index: number; total: number }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-[#0B04CF] to-[#1208E8] px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/80">Slide {index + 1}</span>
          <span className="text-xs font-medium text-white/80">{slide.type || "Content"}</span>
        </div>
      </div>
      <div className="p-4">
        {slide.heading || slide.title ? (
          <h3 className="text-lg font-bold text-gray-900 mb-2">{slide.heading || slide.title}</h3>
        ) : null}
        {slide.subheading ? (
          <p className="text-sm text-gray-600 mb-3">{slide.subheading}</p>
        ) : null}
        {Array.isArray(slide.bullets) && slide.bullets.length > 0 && (
          <ul className="space-y-2">
            {slide.bullets.map((bullet: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <ChevronRight size={14} className="text-[#0B04CF] mt-0.5 shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        {slide.content && !slide.bullets && (
          <p className="text-sm text-gray-700 leading-relaxed">{slide.content}</p>
        )}
      </div>
    </div>
  );
};

// PPT Theme Aware Renderer
const PptViewer = ({ payload }: { payload: any }) => {
  const slides = asArray(payload?.slides || payload);
  
  if (slides.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-2xl font-bold text-[#0B04CF]">{slides.length}</p>
          <p className="text-xs text-gray-500">Total Slides</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-2xl font-bold text-[#0B04CF]">
            {slides.filter((s: any) => s.type === "Title").length}
          </p>
          <p className="text-xs text-gray-500">Title Slides</p>
        </div>
      </div>

      {/* Slides Grid */}
      <div className="space-y-3">
        {slides.map((slide: any, idx: number) => (
          <PptSlide key={idx} slide={slide} index={idx} total={slides.length} />
        ))}
      </div>
    </div>
  );
};

// Research Renderer
function renderResearch(payload: Record<string, unknown>) {
  const summary = asRecord(payload.summarizedRequest);
  const responses = asArray(payload.searchAgentResponses);
  const merged = typeof payload.mergedResponse === "string" ? payload.mergedResponse : "";
  const pptResponse = payload.pptResponse;

  return (
    <div className="space-y-4">
      {summary && (
        <Section title="Request Summary" icon={Target}>
          <KeyValueGrid data={summary} />
        </Section>
      )}
      
      {responses.length > 0 && (
        <Section title="Research Signals" icon={TrendingUp}>
          <div className="space-y-2">
            {responses.slice(0, 10).map((item, idx) => {
              const row = asRecord(item);
              if (!row) return null;
              return (
                <div key={idx} className="flex items-start gap-3 rounded-md border border-gray-100 p-3 bg-gray-50/30">
                  {row.success ? (
                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{pretty(row.section)}</p>
                    {!row.success && row.error && (
                      <p className="text-xs text-red-500 mt-1">{pretty(row.error)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}
      
      {merged && (
        <Section title="Merged Insight" icon={Layers}>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{merged}</div>
        </Section>
      )}
      
      {pptResponse && (
        <Section title="Research Deck" icon={Briefcase}>
          <PptViewer payload={pptResponse} />
        </Section>
      )}
    </div>
  );
}

// Marketing Renderer
function renderMarketing(payload: Record<string, unknown>) {
  const root = asRecord(payload.response_structure) ?? payload;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(root).map(([key, value]) => {
          const section = asRecord(value);
          if (!section) return null;
          return (
            <Section key={key} title={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} icon={Megaphone}>
              <KeyValueGrid data={section} />
            </Section>
          );
        })}
      </div>
    </div>
  );
}

// Development Renderer
function renderDevelopment(payload: Record<string, unknown>) {
  const root = asRecord(payload.response_structure) ?? payload;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(root).map(([key, value]) => {
          const section = asRecord(value);
          if (!section) return null;
          return (
            <Section key={key} title={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} icon={Code2}>
              <KeyValueGrid data={section} />
            </Section>
          );
        })}
      </div>
    </div>
  );
}

// Default Renderer
function DefaultRenderer({ payload }: { payload: Record<string, unknown> }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 bg-white">
        <h4 className="text-sm font-semibold text-gray-900">Raw Output</h4>
      </div>
      <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words p-4 max-h-[500px] overflow-auto">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}

export default function AgentReportRenderer({ agentType, payload }: Props) {
  const root = asRecord(payload);
  
  if (!root) {
    return (
      <div className="text-center py-8">
        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No structured report found.</p>
      </div>
    );
  }

  // PPT Report
  if (agentType === "PPT") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B04CF]/5 border border-[#0B04CF]/20">
          <Sparkles size={16} className="text-[#0B04CF]" />
          <p className="text-sm text-gray-700">Presentation generated with <span className="font-semibold text-[#0B04CF]">Direction AI</span></p>
        </div>
        <PptViewer payload={root} />
      </div>
    );
  }

  // Research Report
  if (agentType === "RESEARCH") {
    return renderResearch(root);
  }

  // Marketing Report
  if (agentType === "MARKETING") {
    return renderMarketing(root);
  }

  // Development Report
  if (agentType === "DEVELOPMENT") {
    return renderDevelopment(root);
  }

  // Default fallback
  return <DefaultRenderer payload={root} />;
}