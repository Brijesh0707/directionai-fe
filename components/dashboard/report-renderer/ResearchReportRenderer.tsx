"use client";

import React, { useState } from "react";
import {
  Building, Compass, FolderSearch, Notebook, Presentation, Target, Users,
  FileText, PieChart, TrendingUp, AlertCircle, CheckCircle, DollarSign,
  BarChart3, Globe, ThumbsUp, ThumbsDown, Sparkles, Layers, Shield, Zap,
  Clock, Award, Eye, Brain, Cloud, Lock, Infinity, Share2, Heart, Database,
  Cpu, Network, Server, HardDrive, ArrowUpRight, MessageSquare, Star,
  ChevronDown, ChevronUp, ExternalLink, Activity, Lightbulb, BookOpen,
  Search, Youtube, Twitter, Instagram, Hash, TrendingDown, Info
} from "lucide-react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  primary: "#1a0ea8",
  secondary: "#2b1de8",
  accent: "#6c47ff",
  danger: "#c0392b",
  success: "#059669",
  warning: "#d97706",
  info: "#0284c7",
  bg: "#f0eef8",
  surface: "#ffffff",
  surfaceAlt: "#f8f7fc",
  border: "#e2dff0",
  text: "#0f0e1a",
  muted: "#5e5c75",
  gradient: "linear-gradient(135deg,#1a0ea8 0%,#6c47ff 100%)",
  gradientDanger: "linear-gradient(135deg,#c0392b 0%,#e74c3c 100%)",
  gradientSuccess: "linear-gradient(135deg,#059669 0%,#10b981 100%)",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const asRecord = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const pretty = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return JSON.stringify(v, null, 2);
};

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
const Card = ({ children, className = "", style = {} }: any) => (
  <div
    className={`rounded-2xl border bg-white shadow-sm ${className}`}
    style={{ borderColor: T.border, ...style }}
  >
    {children}
  </div>
);

const SectionHeader = ({ title, icon: Icon, badge, subtitle }: any) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl" style={{ background: T.gradient }}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold" style={{ color: T.text, fontFamily: "'Georgia', serif" }}>{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: T.muted }}>{subtitle}</p>}
      </div>
    </div>
    {badge && (
      <span className="px-3 py-1 text-xs font-semibold rounded-full border"
        style={{ borderColor: T.border, color: T.muted, background: T.surfaceAlt }}>
        {badge}
      </span>
    )}
  </div>
);

const Pill = ({ children, color = "gray" }: any) => {
  const map: Record<string, [string, string]> = {
    gray: [T.surfaceAlt, T.muted],
    blue: ["#eff6ff", "#1d4ed8"],
    green: ["#f0fdf4", "#166534"],
    red: ["#fef2f2", "#991b1b"],
    orange: ["#fff7ed", "#9a3412"],
    purple: ["#f5f3ff", "#5b21b6"],
  };
  const [bg, fg] = map[color] ?? map.gray;
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: bg, color: fg }}>{children}</span>
  );
};

// Collapsible section
const Collapsible = ({ title, children, defaultOpen = false }: any) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl overflow-hidden mb-3" style={{ borderColor: T.border }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left font-semibold text-sm transition-colors hover:bg-gray-50"
        style={{ color: T.text }}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" style={{ color: T.muted }} /> : <ChevronDown className="h-4 w-4" style={{ color: T.muted }} />}
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  );
};

// ─── EXECUTIVE SUMMARY ───────────────────────────────────────────────────────
const ExecutiveSummary = ({ data }: { data: string }) => (
  <Card className="p-6">
    <div className="prose prose-sm max-w-none">
      {data.split("\n\n").map((para, i) => {
        if (para.startsWith("###")) {
          return (
            <h3 key={i} className="text-base font-bold mt-4 mb-2" style={{ color: T.primary }}>
              {para.replace(/^#+\s*/, "")}
            </h3>
          );
        }
        if (para.startsWith("####")) {
          return (
            <h4 key={i} className="text-sm font-semibold mt-3 mb-1" style={{ color: T.text }}>
              {para.replace(/^#+\s*/, "")}
            </h4>
          );
        }
        if (para.startsWith("- ") || para.startsWith("* ")) {
          return (
            <ul key={i} className="space-y-1 my-2">
              {para.split("\n").map((line, j) => (
                <li key={j} className="flex items-start gap-2 text-sm" style={{ color: T.muted }}>
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: T.accent }} />
                  {line.replace(/^[-*]\s*/, "")}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: T.muted }}>
            {para}
          </p>
        );
      })}
    </div>
  </Card>
);

// ─── MARKET KPIs ─────────────────────────────────────────────────────────────
const MarketKPIs = () => {
  const kpis = [
    { label: "Global Cloud Storage (2023)", value: "$98.8B", sub: "Base Year", icon: Globe, color: "#0284c7" },
    { label: "Projected by 2033 (TAM)", value: "$777.6B", sub: "Allied Market Research", icon: TrendingUp, color: T.primary },
    { label: "CAGR 2024–2033", value: "21.9%", sub: "Annual Growth Rate", icon: Activity, color: T.success },
    { label: "Consumer Cloud SAM (2025)", value: "$25.5B", sub: "Growing to $134.8B by 2035", icon: Users, color: "#7c3aed" },
    { label: "Consumer SAM CAGR", value: "18.1%", sub: "2026–2035 forecast", icon: BarChart3, color: T.warning },
    { label: "N. America Market (2025)", value: "$74.8B", sub: "46.4% of global revenue", icon: Building, color: T.danger },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {kpis.map((k, i) => (
        <Card key={i} className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ background: `${k.color}15` }}>
              <k.icon className="h-4 w-4" style={{ color: k.color }} />
            </div>
            <ArrowUpRight className="h-4 w-4" style={{ color: T.success }} />
          </div>
          <p className="text-2xl font-bold mb-0.5" style={{ color: T.text, fontFamily: "'Georgia', serif" }}>{k.value}</p>
          <p className="text-xs font-medium mb-1" style={{ color: T.text }}>{k.label}</p>
          <p className="text-xs" style={{ color: T.muted }}>{k.sub}</p>
        </Card>
      ))}
    </div>
  );
};

// ─── TAM / SAM / SOM ─────────────────────────────────────────────────────────
const TamSamSom = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[
      {
        label: "TAM", title: "Total Addressable Market",
        value: "$777.6B", by: "by 2033",
        detail: "Global cloud storage market (all segments). CAGR: 21.9%.",
        bar: "100%", color: T.primary,
      },
      {
        label: "SAM", title: "Serviceable Available Market",
        value: "$134.8B", by: "by 2035",
        detail: "Consumer cloud storage services segment. CAGR: 18.1%. APAC leads at 36% share.",
        bar: "60%", color: T.accent,
      },
      {
        label: "SOM", title: "Serviceable Obtainable Market",
        value: "2–5%", by: "of SAM",
        detail: "Realistic early penetration for a niche digital-memory startup. ~$2–7B opportunity.",
        bar: "15%", color: "#9333ea",
      },
    ].map((m) => (
      <Card key={m.label} className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-black" style={{ color: m.color, fontFamily: "'Georgia', serif" }}>{m.label}</span>
          <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: `${m.color}15`, color: m.color }}>{m.title}</span>
        </div>
        <p className="text-3xl font-bold mb-0.5" style={{ color: T.text }}>{m.value}</p>
        <p className="text-sm mb-3" style={{ color: T.muted }}>{m.by}</p>
        <div className="h-2 rounded-full mb-3" style={{ background: T.border }}>
          <div className="h-full rounded-full transition-all" style={{ width: m.bar, background: m.color }} />
        </div>
        <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{m.detail}</p>
      </Card>
    ))}
  </div>
);

// ─── GROWTH TIMELINE ─────────────────────────────────────────────────────────
const GrowthTimeline = () => {
  const points = [
    { year: "2023", value: "$98.8B", note: "Base" },
    { year: "2025", value: "$161B", note: "Est." },
    { year: "2026", value: "$197.8B", note: "Forecast" },
    { year: "2031", value: "$380B", note: "Forecast" },
    { year: "2033", value: "$777.6B", note: "Peak" },
    { year: "2034", value: "$810B", note: "Proj." },
  ];
  return (
    <Card className="p-6 mt-4">
      <p className="text-sm font-semibold mb-4" style={{ color: T.text }}>Cloud Storage Market Growth Trajectory</p>
      <div className="relative">
        <div className="absolute top-3 left-0 right-0 h-0.5" style={{ background: T.border }} />
        <div className="flex justify-between relative">
          {points.map((p, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm z-10"
                style={{ background: i === points.length - 1 ? T.primary : T.accent }} />
              <p className="text-xs font-bold mt-2" style={{ color: T.text }}>{p.year}</p>
              <p className="text-xs font-semibold" style={{ color: T.primary }}>{p.value}</p>
              <p className="text-xs" style={{ color: T.muted }}>{p.note}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// ─── COMPETITORS ─────────────────────────────────────────────────────────────
const CompetitorTable = () => {
  const rows = [
    { name: "Amazon AWS", mktCap: "$2.25T", share: "28%", products: "S3, EBS, Glacier", type: "Enterprise", durability: "11 nines", badge: "blue" },
    { name: "Microsoft Azure", mktCap: "~$3T", share: "21%", products: "Azure Blob, OneDrive", type: "Enterprise+Consumer", durability: "11 nines", badge: "blue" },
    { name: "Google Cloud", mktCap: "$3.77T", share: "14%", products: "GCS, Drive, One", type: "Enterprise+Consumer", durability: "11 nines", badge: "blue" },
    { name: "Apple iCloud", mktCap: "$3.88T", share: "Consumer #1", products: "iCloud Drive, Photos", type: "Consumer", durability: "HA global", badge: "gray" },
    { name: "Tencent Cloud", mktCap: "$591B", share: "Asia", products: "COS", type: "Enterprise Asia", durability: "99.995%", badge: "green" },
    { name: "FOREVER.com", mktCap: "Private", share: "Niche", products: "Permanent Cloud Storage", type: "Consumer Legacy", durability: "Lifetime+100yr", badge: "purple" },
    { name: "pCloud", mktCap: "Private", share: "Growing", products: "pCloud Business", type: "Consumer/SME", durability: "Standard", badge: "gray" },
    { name: "Sync.com", mktCap: "Private", share: "Niche", products: "Sync Business Plans", type: "Privacy-focused SME", durability: "Standard", badge: "gray" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: T.surfaceAlt }}>
            {["Provider", "Market Cap", "Est. Share", "Core Products", "Buyer Type", "Durability"].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold border-b"
                style={{ color: T.muted, borderColor: T.border }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: T.border }}>
              <td className="py-3 px-4 font-semibold" style={{ color: T.text }}>{r.name}</td>
              <td className="py-3 px-4" style={{ color: T.muted }}>{r.mktCap}</td>
              <td className="py-3 px-4"><Pill color={r.badge}>{r.share}</Pill></td>
              <td className="py-3 px-4 text-xs" style={{ color: T.muted }}>{r.products}</td>
              <td className="py-3 px-4 text-xs" style={{ color: T.muted }}>{r.type}</td>
              <td className="py-3 px-4 text-xs" style={{ color: T.muted }}>{r.durability}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── PRICING ─────────────────────────────────────────────────────────────────
const PricingComparison = () => {
  const tiers = [
    { tier: "Free Tier", storage: "5 GB", price: "$0", provider: "Google Drive / iCloud", note: "Entry point" },
    { tier: "Consumer Basic", storage: "100–200 GB", price: "$20–30/yr", provider: "Google One, iCloud+", note: "Individual use" },
    { tier: "Consumer Family", storage: "2 TB", price: "$100–120/yr", provider: "Google, Apple, pCloud", note: "Household" },
    { tier: "SME Starter", storage: "1 TB (2 users)", price: "$170/yr", provider: "Sync.com", note: "Small business" },
    { tier: "SME Team", storage: "1 TB (10 users)", price: "$260/yr", provider: "Sync.com", note: "Team plan" },
    { tier: "SME Enterprise", storage: "1 TB (unlimited)", price: "$650/yr", provider: "Sync.com", note: "Unlimited users" },
    { tier: "Cloud Setup (1yr)", storage: "Initial", price: "$28,600", provider: "Cloud (avg)", note: "vs $93,200 on-prem" },
    { tier: "Cloud Annual Ops", storage: "Ongoing", price: "$9,600/yr", provider: "Cloud (avg)", note: "vs $80,200 on-prem" },
  ];
  return (
    <div className="space-y-2">
      {tiers.map((t, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-all"
          style={{ borderColor: T.border, background: i % 2 === 0 ? T.surface : T.surfaceAlt }}>
          <div className="flex-1">
            <span className="text-sm font-semibold" style={{ color: T.text }}>{t.tier}</span>
            <span className="text-xs ml-2" style={{ color: T.muted }}>{t.storage} · {t.provider}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold" style={{ color: T.primary }}>{t.price}</p>
            <p className="text-xs" style={{ color: T.muted }}>{t.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── MARKET SHARE BARS ───────────────────────────────────────────────────────
const MarketShareBars = () => {
  const items = [
    { name: "AWS", pct: 28, color: "#f97316" },
    { name: "Microsoft Azure", pct: 21, color: T.info },
    { name: "Google Cloud", pct: 14, color: T.success },
    { name: "Others (Tencent, Oracle, IBM, etc.)", pct: 37, color: T.muted },
  ];
  return (
    <div className="space-y-4">
      {items.map((m) => (
        <div key={m.name}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium" style={{ color: T.text }}>{m.name}</span>
            <span className="font-bold" style={{ color: m.color }}>{m.pct}%</span>
          </div>
          <div className="h-2.5 rounded-full" style={{ background: T.border }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.pct}%`, background: m.color }} />
          </div>
        </div>
      ))}
      <p className="text-xs mt-3 italic" style={{ color: T.muted }}>
        Source: Synergy Research Group, Q4 2025 (IaaS/PaaS/hosted private cloud infrastructure revenues)
      </p>
    </div>
  );
};

// ─── REGIONAL INSIGHTS ───────────────────────────────────────────────────────
const RegionalInsights = () => {
  const regions = [
    {
      name: "North America", share: "40%", trend: "Dominant", color: T.primary,
      highlights: ["US: $74.8B market in 2025 (46.4% global)", "Projected $90.9B in 2026", "Led by Apple iCloud, Google Drive", "Major data center infrastructure hub"],
    },
    {
      name: "Asia-Pacific", share: "36% by 2035", trend: "Fastest Growing", color: T.success,
      highlights: ["China has ~1B social media users", "India has 250M+ social media users", "Tencent Cloud & Alibaba dominate locally", "91% of users prefer in-country storage (China)"],
    },
    {
      name: "East Asia (Sub-region)", share: "15% global (2025)", trend: "Emerging", color: T.warning,
      highlights: ["China leads regional consumption (35%)", "Japan avg broadband: 286 Mbps (2024)", "Strong domestic provider preference", "1.02B broadband subscriptions in China"],
    },
    {
      name: "North America (Detailed)", share: "28.2% (2025)", trend: "Stable Leader", color: T.info,
      highlights: ["USA: 22.1% of global market", "Canada: 3.85%", "Mexico: 2.26%", "Hyperscale data centers dominant"],
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {regions.map((r) => (
        <Card key={r.name} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm" style={{ color: T.text }}>{r.name}</h4>
            <Pill color={r.trend === "Fastest Growing" ? "green" : r.trend === "Dominant" ? "blue" : "gray"}>{r.trend}</Pill>
          </div>
          <p className="text-2xl font-black mb-3" style={{ color: r.color, fontFamily: "'Georgia', serif" }}>{r.share}</p>
          <ul className="space-y-1">
            {r.highlights.map((h, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: T.muted }}>
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: r.color }} />
                {h}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};

// ─── TREND RESEARCH ───────────────────────────────────────────────────────────
const TrendResearch = () => {
  const trends = [
    { title: "AI Workloads Driving Storage Demand", desc: "RAG patterns, vector indexes, embedding stores, training datasets – all storage-intensive. Hyperscaler AI capex accelerating.", icon: Brain, badge: "Accelerating", color: T.primary },
    { title: "Memory Chip Supply Risk", desc: "Micron ($25B capex 2026), SK Hynix (~$27B), Samsung all expanding simultaneously → oversupply risk within 2–3 years.", icon: Cpu, badge: "Risk", color: T.danger },
    { title: "Optical Tech Emerging", desc: "Optical stocks (Lumentum, Ciena, Corning, Coherent) are top S&P 500 performers in 2026 as next AI bottleneck solution.", icon: Zap, badge: "Hot in 2026", color: T.warning },
    { title: "Consumer Hybrid Storage", desc: "Fastest-growing segment: balance between local device backups and encrypted cloud vaults for performance + reliability.", icon: Cloud, badge: "Growing", color: T.success },
    { title: "Zero-Trust & Privacy", desc: "End-to-end encryption, data sovereignty, and transparent data policies increasingly demanded by consumers.", icon: Lock, badge: "Rising", color: T.info },
    { title: "Digital Legacy & Post-Death Backup", desc: "Nascent but growing market for memory preservation, estate digital assets, and AI-generated memory restoration.", icon: Infinity, badge: "Emerging", color: "#7c3aed" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trends.map((t) => (
        <Card key={t.title} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${t.color}15` }}>
              <t.icon className="h-5 w-5" style={{ color: t.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                <p className="text-sm font-semibold" style={{ color: T.text }}>{t.title}</p>
                <Pill color={t.badge === "Risk" ? "red" : t.badge === "Accelerating" ? "blue" : t.badge === "Hot in 2026" ? "orange" : "green"}>{t.badge}</Pill>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{t.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ─── PAIN POINTS ─────────────────────────────────────────────────────────────
const PainPoints = () => {
  const points = [
    { title: "Cost Uncertainty", desc: "Hidden fees, bandwidth charges, unpredictable egress/ingress pricing. SLA breach compensation rarely covers actual business losses.", severity: "High", icon: DollarSign },
    { title: "Connectivity Dependency", desc: "Requires stable high-speed internet. Asymmetric bandwidth (uploads much slower than downloads) compounds large-file issues.", severity: "High", icon: Network },
    { title: "Security & Data Breaches", desc: "Misconfigurations, weak permissions, and lack of encryption. Users remain liable even when the provider is breached.", severity: "Critical", icon: Shield },
    { title: "Syncing & Access Failures", desc: "Version conflicts, sync delays, and access errors — especially multi-device environments. OneDrive auto-folder creation cited frequently.", severity: "Medium", icon: AlertCircle },
    { title: "Data Portability Lock-in", desc: "Moving data between providers is expensive (egress fees) and slow. Providers make ingress easy, egress painful.", severity: "High", icon: Lock },
    { title: "SLA Transparency", desc: "Boilerplate SLAs accepted by 80% of customers. Breach compensation is usually service credits, not actual damages.", severity: "Medium", icon: FileText },
    { title: "Storage Limits on Free Plans", desc: "Google Drive storage-full complaints widespread. Users forced into paid tiers unexpectedly.", severity: "Medium", icon: HardDrive },
    { title: "Unclear Data Ownership", desc: "Where data is actually stored, who owns it, and how to guarantee complete deletion remain opaque to users.", severity: "High", icon: Database },
  ];
  const sev: Record<string, string> = { Critical: "red", High: "orange", Medium: "gray" };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {points.map((p) => (
        <Card key={p.title} className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "#fef2f2" }}>
              <p.icon className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="text-sm font-semibold" style={{ color: T.text }}>{p.title}</p>
                <Pill color={sev[p.severity]}>{p.severity}</Pill>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{p.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ─── SWOT ─────────────────────────────────────────────────────────────────────
const Swot = () => {
  const q = [
    {
      label: "Strengths", icon: CheckCircle, border: "#16a34a", bg: "from-green-50",
      items: ["Decreasing operational costs vs. on-premise", "Remote & ubiquitous access", "Virtually unlimited scalability", "Flexible consumption-based pricing", "Reduced IT personnel requirements", "Accessible to startups and SMEs"],
    },
    {
      label: "Weaknesses", icon: ThumbsDown, border: "#dc2626", bg: "from-red-50",
      items: ["Bandwidth & connectivity dependency", "Unknown data physical locations", "Data ownership ambiguity", "Complex SLA negotiations", "Integration with legacy systems"],
    },
    {
      label: "Opportunities", icon: TrendingUp, border: "#2563eb", bg: "from-blue-50",
      items: ["AI-powered memory restoration", "Digital legacy & estate planning market", "Hybrid storage (local + cloud) adoption", "APAC's 1B+ users driving demand", "Privacy-first consumer niche", "Post-death backup services"],
    },
    {
      label: "Threats", icon: AlertCircle, border: "#d97706", bg: "from-orange-50",
      items: ["Hyperscaler market concentration (AWS/MSFT/GCP = 63%)", "Memory chip oversupply risk (2–3yr horizon)", "Data breach regulatory penalties (GDPR, CCPA)", "Consumer reluctance to change providers", "AI capex slowdown affecting cloud demand"],
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {q.map((s) => (
        <div key={s.label} className={`rounded-2xl border-l-4 bg-gradient-to-br ${s.bg} to-white p-5 shadow-sm`}
          style={{ borderLeftColor: s.border }}>
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: s.border }}>
            <s.icon className="h-4 w-4" /> {s.label}
          </h4>
          <ul className="space-y-1.5">
            {s.items.map((item, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: T.muted }}>
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.border }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// ─── SOCIAL SENTIMENT ────────────────────────────────────────────────────────
const SocialSentiment = () => {
  const sources = [
    {
      platform: "Reddit", icon: Hash, color: "#ff4500",
      sentiment: "Mixed",
      findings: [
        "OneDrive commonly criticized for auto-creating top-level folders and sync issues",
        "Google Drive and OneDrive recommended as best mainstream options in 2026",
        "User choice depends heavily on individual workflows — no single best provider",
        "r/cloudstorage and r/datastorage are active communities discussing alternatives",
      ],
    },
    {
      platform: "YouTube", icon: Youtube, color: "#ff0000",
      sentiment: "Promotional",
      findings: [
        "pCloud featured prominently with 40% discount offers for 2026 comparisons",
        "Google Drive storage-full problem is a widely searched topic",
        "Best cloud storage comparison videos are high-traffic in 2026",
        "Content warns: 'Don't Trust the Cloud' — always backup your online data",
      ],
    },
    {
      platform: "Quora", icon: MessageSquare, color: "#b92b27",
      sentiment: "Informational",
      findings: [
        "Cloud storage recommended for backups and small infrastructure",
        "IDrive, Google Drive, and Nextcloud cited as top reliable picks",
        "Free services have limitations; paid options offer better reliability",
        "AWS considered overkill for casual individual use",
      ],
    },
    {
      platform: "X (Twitter)", icon: Twitter, color: "#1d9bf0",
      sentiment: "B2B / Institutional",
      findings: [
        "Memory cloud storage discussion dominated by enterprise AI infrastructure angles",
        "Cisco Q3 FY26 call signals positive AI infrastructure spending and memory demand",
        "Supply tightening for memory components mentioned (Nanya, Micron, SK Hynix)",
        "Consumer sentiment data limited — mostly institutional/investor discussion",
      ],
    },
    {
      platform: "Instagram", icon: Instagram, color: "#e1306c",
      sentiment: "Marketing Insights",
      findings: [
        "Influencer marketing reshaping cloud service promotion strategies",
        "Multi-influencer campaigns (vs single celebrity) growing in 2026",
        "59% of marketers planned to partner with more influencers in 2025",
        "Shoppable Reels, AI-powered content, and expert-backed tutorials leading trends",
      ],
    },
  ];
  const sentColor: Record<string, string> = { Mixed: "gray", Promotional: "orange", Informational: "blue", "B2B / Institutional": "purple", "Marketing Insights": "green" };
  return (
    <div className="space-y-4">
      {sources.map((s) => (
        <Collapsible key={s.platform} title={
          <div className="flex items-center gap-3">
            {/* <sicon className="h-4 w-4" style={{ color: s.color }} /> */}
            <span>{s.platform}</span>
            <Pill color={sentColor[s.sentiment]}>{s.sentiment}</Pill>
          </div>
        } defaultOpen={s.platform === "Reddit"}>
          <ul className="space-y-2">
            {s.findings.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: T.muted }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                {f}
              </li>
            ))}
          </ul>
        </Collapsible>
      ))}
    </div>
  );
};

// ─── STARTUP VALIDATION ───────────────────────────────────────────────────────
const StartupValidation = () => {
  const signals = [
    { label: "Market validation", value: "Strong", desc: "Cloud storage market growing at 21.9% CAGR with proven consumer demand", positive: true },
    { label: "Niche opportunity", value: "Moderate", desc: "Digital legacy / memory preservation largely unserved by hyperscalers", positive: true },
    { label: "Technical readiness", value: "Low", desc: "Neural memory digitization is unproven; AI-enhanced photo/video storage is feasible today", positive: false },
    { label: "Competitive pressure", value: "High", desc: "AWS, Azure, GCP dominate 63% of infrastructure; Apple & Google lead consumer mindshare", positive: false },
    { label: "Funding environment", value: "Active", desc: "AI infrastructure and AI memory convergence attracting large VC rounds in 2026", positive: true },
    { label: "Regulatory landscape", value: "Complex", desc: "GDPR, CCPA, emerging AI memory laws, and data sovereignty requirements need careful navigation", positive: false },
  ];
  return (
    <div className="space-y-3">
      {signals.map((s) => (
        <div key={s.label} className="flex items-start gap-4 p-4 rounded-xl border" style={{ borderColor: T.border }}>
          <div className="flex-shrink-0 mt-0.5">
            {s.positive
              ? <CheckCircle className="h-5 w-5 text-green-600" />
              : <AlertCircle className="h-5 w-5 text-orange-500" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold" style={{ color: T.text }}>{s.label}</p>
              <Pill color={s.positive ? "green" : "orange"}>{s.value}</Pill>
            </div>
            <p className="text-xs" style={{ color: T.muted }}>{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── STRATEGIC RECS ───────────────────────────────────────────────────────────
const StrategicRecs = () => {
  const recs = [
    { p: "P0", title: "Validate Technical Feasibility", timeline: "0–3 mo", impact: "Critical", desc: "Partner with neuroscience and AI research institutions. Define what 'memory storage' means technically — neural data vs. enriched photo/video/audio." },
    { p: "P0", title: "Launch Privacy-First MVP", timeline: "3–6 mo", impact: "Critical", desc: "Build enhanced photo/video storage with AI tagging, facial recognition, and smart timelines. End-to-end encryption mandatory from day one." },
    { p: "P1", title: "Target Legacy Planning Niche", timeline: "6–9 mo", impact: "High", desc: "Partner with funeral homes, estate attorneys, and memory care facilities. FOREVER.com shows this segment exists and pays." },
    { p: "P1", title: "Develop AI Memory Restoration", timeline: "9–12 mo", impact: "High", desc: "Use generative AI to restore degraded old photos/videos and generate contextual memory narratives from stored media." },
    { p: "P2", title: "APAC Market Entry", timeline: "12–18 mo", impact: "Medium", desc: "Target India and Southeast Asia — digital adoption is fast, legacy cloud penetration is lower, and local data sovereignty creates opportunity." },
    { p: "P2", title: "Build Post-Death Memory Service", timeline: "18–24 mo", impact: "Medium", desc: "Enable users to designate memory heirs, create digital wills, and configure automated memory-sharing after death." },
  ];
  const pColor: Record<string, string> = { P0: "#dc2626", P1: "#f97316", P2: "#2563eb" };
  return (
    <div className="space-y-3">
      {recs.map((r, i) => (
        <Card key={i} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ background: pColor[r.p] }}>{r.p}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-bold" style={{ color: T.text }}>{r.title}</p>
                <Pill color="gray">{r.timeline}</Pill>
                <Pill color={r.impact === "Critical" ? "red" : r.impact === "High" ? "orange" : "blue"}>{r.impact} Impact</Pill>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{r.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ─── RESEARCH SOURCES ─────────────────────────────────────────────────────────
const ResearchSources = ({ responses }: { responses: unknown[] }) => {
  const sectionLabels: Record<string, string> = {
    marketResearch: "Market Research",
    competitorResearch: "Competitor Analysis",
    pricingResearch: "Pricing Research",
    trendResearch: "Trend Research",
    findTAM: "TAM Analysis",
    findSAM: "SAM Analysis",
    findSOM: "SOM Analysis",
    redditReviews: "Reddit Reviews",
    youtubeReviews: "YouTube Reviews",
    quoraReviews: "Quora Reviews",
    twitterSentiment: "Twitter Sentiment",
    instagramInsights: "Instagram Insights",
    customerPainPoints: "Customer Pain Points",
    startupValidation: "Startup Validation",
    aiStartupResearch: "AI Startup Research",
    swotAnalysis: "SWOT Analysis",
    fundingResearch: "Funding Research",
    allPlatformReviews: "All Platform Reviews",
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {responses.map((item, idx) => {
        const row = asRecord(item);
        if (!row) return null;
        const section = pretty(row.section) || `Section ${idx + 1}`;
        const ok = row.success === true;
        const label = sectionLabels[section] || section;
        return (
          <div key={`${section}-${idx}`}
            className="flex items-center gap-2 p-3 rounded-xl border text-xs font-medium"
            style={{
              background: ok ? "#f0fdf4" : "#fef2f2",
              borderColor: ok ? "#bbf7d0" : "#fecaca",
              color: ok ? "#166534" : "#991b1b",
            }}>
            {ok
              ? <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              : <AlertCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />}
            {label}
          </div>
        );
      })}
    </div>
  );
};

// ─── FUNDING LANDSCAPE ────────────────────────────────────────────────────────
const FundingLandscape = () => (
  <div className="space-y-4">
    <div className="p-4 rounded-xl border" style={{ borderColor: T.border, background: T.surfaceAlt }}>
      <p className="text-xs font-semibold mb-2" style={{ color: T.muted }}>KEY FUNDING SIGNALS (2026)</p>
      <div className="space-y-2">
        {[
          { company: "OpenAI", val: "$800B valuation", note: "Record valuation in AI history" },
          { company: "Anthropic", val: "$45B revenue run rate", note: "80x growth in last quarter" },
          { company: "SpaceX", val: "Pre-IPO largest startup", note: "Musk path to first trillionaire" },
          { company: "AI Cybersecurity Startups", val: "Large early rounds", note: "Seed→Series A compressing" },
        ].map((f, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border" style={{ borderColor: T.border }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: T.text }}>{f.company}</p>
              <p className="text-xs" style={{ color: T.muted }}>{f.note}</p>
            </div>
            <Pill color="blue">{f.val}</Pill>
          </div>
        ))}
      </div>
    </div>
    <Card className="p-4">
      <p className="text-sm font-semibold mb-2" style={{ color: T.text }}>Funding Outlook for Memory Storage Startup</p>
      <p className="text-xs leading-relaxed mb-3" style={{ color: T.muted }}>
        No direct funding data found for memory cloud storage startups specifically. The broader AI + cloud infrastructure space is attracting
        massive capital. A memory-preservation startup with a clear privacy-first angle and AI differentiation could tap:
      </p>
      <ul className="space-y-1.5">
        {[
          "Consumer AI / personal data management VCs",
          "Legacy / estate planning industry strategics",
          "Healthcare / neuroscience focused funds (long-term)",
          "European privacy-tech investors (GDPR-aligned niche)",
        ].map((item, i) => (
          <li key={i} className="text-xs flex items-start gap-2" style={{ color: T.muted }}>
            <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: T.primary }} />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ResearchReportRenderer({ payload }: { payload: unknown }) {
  const root = asRecord(payload);

  if (!root) {
    return (
      <div className="flex items-center justify-center min-h-64 rounded-2xl border border-gray-200 bg-gray-50">
        <p className="text-gray-500 text-sm">No structured research report found.</p>
      </div>
    );
  }

  const summarizedRequest = asRecord(root.summarizedRequest);
  const searchAgentResponses = asArray(root.searchAgentResponses);
  const mergedResponse = pretty(root.mergedResponse);
  const successfulCount = searchAgentResponses.filter((i) => asRecord(i)?.success === true).length;

  const topic = pretty(summarizedRequest?.topic) || "Memory Cloud Storage";
  const audience = pretty(summarizedRequest?.audience) || "General consumers";
  const intent = pretty(summarizedRequest?.intent) || "Research & Analysis";
  const competitors = asArray(summarizedRequest?.competitors);

  return (
    <div className="min-h-screen pb-16" style={{ background: T.bg, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── HEADER ── */}
        <div className="relative overflow-hidden rounded-3xl mb-8" style={{ background: T.gradient }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }} />
          <div className="relative px-8 py-10">
            <div className="flex items-center gap-2 mb-4">
              <Presentation className="h-5 w-5 text-white/70" />
              <span className="text-white/70 text-sm font-medium">Market Research Report</span>
              <span className="ml-auto text-white/50 text-xs">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>{topic}</h1>
            <p className="text-white/75 text-lg max-w-2xl mb-6">
              Digital recording, storage, and replay of human memories · AI-powered restoration · Legacy preservation
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Users className="h-3.5 w-3.5" /> {audience}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Compass className="h-3.5 w-3.5" /> {intent}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Building className="h-3.5 w-3.5" /> {competitors.length} Competitor Categories
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                <CheckCircle className="h-3.5 w-3.5" /> {successfulCount}/{searchAgentResponses.length} Sources
              </div>
            </div>
          </div>
        </div>



        {/* ── MARKET SIZE ── */}
        <section className="mb-10">
          <SectionHeader title="Market Size & Growth" icon={BarChart3} badge="TAM · SAM · SOM" subtitle="Based on Allied Market Research, Fortune Business Insights, Research Nester (2025–2026)" />
          <MarketKPIs />
          <GrowthTimeline />
        </section>

        {/* ── TAM SAM SOM ── */}
        <section className="mb-10">
          <SectionHeader title="Market Opportunity Breakdown" icon={Target} />
          <TamSamSom />
        </section>

        {/* ── TRENDS ── */}
        <section className="mb-10">
          <SectionHeader title="Market Trends (2026–2035)" icon={TrendingUp} badge="6 Key Trends" />
          <TrendResearch />
        </section>

        {/* ── REGIONAL ── */}
        <section className="mb-10">
          <SectionHeader title="Regional Market Insights" icon={Globe} badge="4 Regions" />
          <RegionalInsights />
        </section>

        {/* ── COMPETITORS + MARKET SHARE ── */}
        <section className="mb-10">
          <SectionHeader title="Competitive Landscape" icon={Building} badge="8 Players Analyzed" />
          <Card className="p-0 overflow-hidden mb-6">
            <CompetitorTable />
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5">
              <p className="text-sm font-bold mb-4" style={{ color: T.text }}>Infrastructure Market Share (Q4 2025)</p>
              <MarketShareBars />
            </Card>
            <Card className="p-5">
              <p className="text-sm font-bold mb-4" style={{ color: T.text }}>Key Competitor Quotes</p>
              <div className="space-y-3">
                {[
                  { src: "FOREVER.com", quote: "Guaranteed for your lifetime plus 100 years — permanent, private, no ads, no data mining." },
                  { src: "Sync.com", quote: "Business plans from $170/yr (2 users) to $650/yr (unlimited users), all at 1TB." },
                  { src: "Allied Market Research", quote: "Global cloud storage was $98.8B in 2023 and is projected to reach $777.6B by 2033 at 21.9% CAGR." },
                ].map((q, i) => (
                  <div key={i} className="p-3 rounded-xl border-l-4" style={{ borderLeftColor: T.accent, background: T.surfaceAlt }}>
                    <p className="text-xs italic mb-1" style={{ color: T.muted }}>"{q.quote}"</p>
                    <p className="text-xs font-semibold" style={{ color: T.primary }}>— {q.src}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="mb-10">
          <SectionHeader title="Pricing Landscape" icon={DollarSign} badge="8 Tier Breakdown" />
          <PricingComparison />
        </section>

        {/* ── PAIN POINTS ── */}
        <section className="mb-10">
          <SectionHeader title="Customer Pain Points" icon={AlertCircle} badge="8 Issues Identified" />
          <PainPoints />
        </section>

        {/* ── SOCIAL SENTIMENT ── */}
        <section className="mb-10">
          <SectionHeader title="Social Sentiment & Platform Research" icon={MessageSquare} badge="5 Platforms" />
          <SocialSentiment />
        </section>

        {/* ── SWOT ── */}
        <section className="mb-10">
          <SectionHeader title="SWOT Analysis" icon={PieChart} badge="Strategic Assessment" />
          <Swot />
        </section>

        {/* ── STARTUP VALIDATION ── */}
        <section className="mb-10">
          <SectionHeader title="Startup Validation Signals" icon={Lightbulb} badge="Go/No-Go Framework" />
          <StartupValidation />
        </section>

        {/* ── FUNDING ── */}
        <section className="mb-10">
          <SectionHeader title="Funding Landscape" icon={DollarSign} badge="2026 Context" />
          <FundingLandscape />
        </section>

        {/* ── STRATEGIC RECS ── */}
        <section className="mb-10">
          <SectionHeader title="Strategic Recommendations" icon={Target} badge="Prioritized Action Plan" />
          <StrategicRecs />
        </section>

        {/* ── RESEARCH SOURCES ── */}
        <section className="mb-10">
          <SectionHeader
            title="Research Sources"
            icon={FolderSearch}
            badge={`${successfulCount}/${searchAgentResponses.length} Successful`}
            subtitle="AI-powered web research across market data, social platforms, and competitor intelligence"
          />
          <ResearchSources responses={searchAgentResponses} />
        </section>
        {/* ── EXECUTIVE SUMMARY ── */}
        <section className="mb-10">
          <SectionHeader title="Executive Summary" icon={FileText} badge="AI-Synthesized" />
          <ExecutiveSummary data={mergedResponse} />
        </section>

      </div>
    </div>
  );
}