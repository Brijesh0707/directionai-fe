"use client";

import React from "react";
import PptReportRenderer from "./report-renderer/PptReportRenderer";
import ResearchReportRenderer from "./report-renderer/ResearchReportRenderer";
import {
  DefaultRenderer,
  DevelopmentReportRenderer,
  MarketingReportRenderer,
} from "./report-renderer/StrategyReportRenderers";

type Props = {
  agentType?: string;
  payload: unknown;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

export default function AgentReportRenderer({ agentType, payload }: Props) {
  const root = asRecord(payload);

  if (!root) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No structured report found.</p>
      </div>
    );
  }

  if (agentType === "MARKETING") {
    return <MarketingReportRenderer payload={root} />;
  }

  if (agentType === "DEVELOPMENT") {
    return <DevelopmentReportRenderer payload={root} />;
  }

  if (agentType === "RESEARCH") {
    return <ResearchReportRenderer payload={root} />;
  }

  if (agentType === "PPT") {
    return <PptReportRenderer payload={root} />;
  }

  return <DefaultRenderer payload={root} />;
}
