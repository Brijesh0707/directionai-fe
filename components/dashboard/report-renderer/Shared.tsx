"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

type BadgeType = "success" | "warning" | "default" | "purple";

export const StatusBadge = ({ text, type = "default" }: { text: string; type?: BadgeType }) => {
  const styles: Record<BadgeType, string> = {
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${styles[type]}`}>
      {type === "success" ? <CheckCircle2 size={12} /> : null}
      {type === "warning" ? <AlertCircle size={12} /> : null}
      {type === "purple" ? <Sparkles size={12} /> : null}
      {text}
    </span>
  );
};

export const ReportSection = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  badge?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
    <div className="border-b border-gray-100 px-5 py-4 bg-gradient-to-r from-[#0B04CF]/5 via-white to-white">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          {Icon ? <Icon size={20} className="text-[#0B04CF]" /> : null}
          <div>
            <h4 className="text-base font-semibold text-gray-900">{title}</h4>
            {subtitle ? <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p> : null}
          </div>
        </div>
        {badge ? <StatusBadge text={badge} type="purple" /> : null}
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export const MetricCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) => (
  <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-4 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <Icon size={18} className="text-[#0B04CF]" />
    </div>
    <p className="text-xl font-bold text-gray-900 break-words">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);
