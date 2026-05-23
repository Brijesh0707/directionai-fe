"use client";

import React, { useState } from "react";
import {
  Building, Compass, FolderSearch, Notebook, Presentation, Target, Users,
  FileText, PieChart, TrendingUp, AlertCircle, CheckCircle, DollarSign,
  BarChart3, Globe, ThumbsUp, ThumbsDown, Sparkles, Layers, Shield, Zap,
  Clock, Award, Eye, Brain, Cloud, Lock, Infinity, Share2, Heart, Database,
  Cpu, Network, Server, HardDrive, ArrowUpRight, MessageSquare, Star,
  ChevronDown, ChevronUp, ExternalLink, Activity, Lightbulb, BookOpen,
  Search, PlayCircle, MessageCircle, Camera, Hash, TrendingDown, Info
} from "lucide-react";

// ─── THEME (Direction AI Brand Colors) ───────────────────────────────────────
const T = {
  primary: "var(--primary, #0B04CF)",
  secondary: "var(--secondary, #1208E8)",
  tertiary: "var(--tertiary, #800500)",
  neutral: "var(--neutral, #777682)",
  background: "var(--background, #F3F1F8)",
  foreground: "var(--foreground, #171717)",
  card: "var(--card, #ECEAF3)",
  cardForeground: "var(--card-foreground, #1E1E2A)",
  border: "var(--border, #D8D5E2)",
  input: "var(--input, #E6E3EF)",
  ring: "var(--ring, #0B04CF)",
  muted: "var(--muted, #A2A0B3)",
  mutedForeground: "var(--muted-foreground, #5F5D6B)",
  success: "#059669",
  warning: "#d97706",
  info: "#0284c7",
  gradient: "linear-gradient(135deg, #0B04CF 0%, #1208E8 100%)",
  gradientDanger: "linear-gradient(135deg, #800500 0%, #b30a00 100%)",
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

// ─── BASE COMPONENTS WITH THEME ──────────────────────────────────────────────
const Card = ({ children, className = "", style = {}, hover = false }: any) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow-sm ${hover ? "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" : ""} ${className}`}
    style={{ borderColor: T.border, backgroundColor: T.card, ...style }}
  >
    {children}
  </div>
);

const SectionHeader = ({ title, icon: Icon, badge, subtitle }: any) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl gradient-primary shadow-sm">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold" style={{ color: T.foreground, fontFamily: "'Geist', 'Inter', sans-serif" }}>{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: T.mutedForeground }}>{subtitle}</p>}
      </div>
    </div>
    {badge && (
      <span className="px-3 py-1 text-xs font-semibold rounded-full border"
        style={{ borderColor: T.border, color: T.mutedForeground, background: T.input }}>
        {badge}
      </span>
    )}
  </div>
);

const Pill = ({ children, color = "gray" }: any) => {
  const map: Record<string, [string, string]> = {
    gray: [T.input, T.mutedForeground],
    blue: ["#eff6ff", "#1d4ed8"],
    green: ["#f0fdf4", "#166534"],
    red: ["#fef2f2", "#991b1b"],
    orange: ["#fff7ed", "#9a3412"],
    purple: ["#f5f3ff", "#5b21b6"],
  };
  const [bg, fg] = map[color] ?? map.gray;
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: bg, color: fg }}>{children}</span>;
};

const Collapsible = ({ title, children, defaultOpen = false }: any) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl overflow-hidden mb-3" style={{ borderColor: T.border }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left font-semibold text-sm transition-all hover:bg-muted/20"
        style={{ color: T.foreground }}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" style={{ color: T.mutedForeground }} /> : <ChevronDown className="h-4 w-4" style={{ color: T.mutedForeground }} />}
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: T.border }}>{children}</div>}
    </div>
  );
};

// ─── HELPER TO EXTRACT DATA FROM RESPONSES ───────────────────────────────────
const getSectionData = (responses: unknown[], sectionName: string): any => {
  const section = responses.find((item: any) => item?.section === sectionName);
  return section?.data?.data;
};

const getSectionAnswer = (responses: unknown[], sectionName: string): string => {
  const data = getSectionData(responses, sectionName);
  return data?.answer || "";
};

// ─── DYNAMIC RENDERERS - EVERYTHING FROM PAYLOAD ─────────────────────────────

// Executive Summary
const ExecutiveSummary = ({ mergedResponse }: { mergedResponse: string }) => (
  <Card className="p-6" hover>
    <div className="prose prose-sm max-w-none">
      {mergedResponse.split("\n\n").map((para, i) => {
        if (para.startsWith("###")) {
          return <h3 key={i} className="text-base font-bold mt-4 mb-2" style={{ color: T.primary }}>{para.replace(/^#+\s*/, "")}</h3>;
        }
        if (para.startsWith("####")) {
          return <h4 key={i} className="text-sm font-semibold mt-3 mb-1" style={{ color: T.foreground }}>{para.replace(/^#+\s*/, "")}</h4>;
        }
        if (para.startsWith("- ") || para.startsWith("* ")) {
          return (
            <ul key={i} className="space-y-1 my-2">
              {para.split("\n").map((line, j) => (
                <li key={j} className="flex items-start gap-2 text-sm" style={{ color: T.mutedForeground }}>
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: T.primary }} />
                  {line.replace(/^[-*]\s*/, "")}
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: T.mutedForeground }}>{para}</p>;
      })}
    </div>
  </Card>
);

// Market KPIs
const MarketKPIs = ({ responses }: { responses: unknown[] }) => {
  const tamAnswer = getSectionAnswer(responses, "findTAM");
  
  const sentences = tamAnswer.split(/\.\s+/);
  const kpis: { label: string; value: string; sub: string; icon: any }[] = [];
  
  sentences.forEach((sentence: string) => {
    const dollarMatch = sentence.match(/\$(\d+(?:\.\d+)?)\s*(billion|million|trillion)/i);
    const percentMatch = sentence.match(/(\d+(?:\.\d+)?)\s*percent/i);
    const yearMatch = sentence.match(/(\d{4})/);
    
    if (dollarMatch && sentence.length > 15) {
      const value = `$${dollarMatch[1]}${dollarMatch[2] === "billion" ? "B" : dollarMatch[2] === "million" ? "M" : ""}`;
      let label = sentence.substring(0, 50);
      if (label.length === 50) label += "...";
      
      kpis.push({
        label: label,
        value: value,
        sub: yearMatch ? `Data from ${yearMatch[1]}` : "Market data",
        icon: Globe
      });
    }
    
    if (percentMatch && sentence.includes("CAGR")) {
      kpis.push({
        label: sentence.substring(0, 45) + (sentence.length > 45 ? "..." : ""),
        value: `${percentMatch[1]}%`,
        sub: "Annual growth rate",
        icon: TrendingUp
      });
    }
  });
  
  const displayKpis = kpis.slice(0, 4);
  
  if (displayKpis.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">{tamAnswer || "No market data available"}</Card>;
  }
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {displayKpis.map((k, i) => (
        <Card key={i} className="p-5 transition-all duration-200 hover:shadow-md" hover>
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ background: `${T.primary}15` }}>
              <k.icon className="h-4 w-4" style={{ color: T.primary }} />
            </div>
            <ArrowUpRight className="h-4 w-4" style={{ color: T.success }} />
          </div>
          <p className="text-2xl font-bold mb-0.5" style={{ color: T.foreground }}>{k.value}</p>
          <p className="text-xs leading-tight mb-1" style={{ color: T.foreground }}>{k.label}</p>
          <p className="text-xs" style={{ color: T.mutedForeground }}>{k.sub}</p>
        </Card>
      ))}
    </div>
  );
};

// Competitor Table
const CompetitorTable = ({ competitors }: { competitors: string[] }) => {
  if (!competitors.length) return <Card className="p-8 text-center text-muted-foreground">No competitor data available</Card>;
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: T.input }}>
            <th className="text-left py-3 px-4 text-xs font-semibold border-b" style={{ color: T.mutedForeground, borderColor: T.border }}>Competitor</th>
            <th className="text-left py-3 px-4 text-xs font-semibold border-b" style={{ color: T.mutedForeground, borderColor: T.border }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((comp, i) => (
            <tr key={i} className="border-b transition-colors hover:bg-muted/10" style={{ borderColor: T.border }}>
              <td className="py-3 px-4 font-semibold" style={{ color: T.foreground }}>{comp}</td>
              <td className="py-3 px-4 text-xs" style={{ color: T.mutedForeground }}>
                {comp === "PitchBook" ? "Data Platform" : comp === "Crunchbase" ? "Data Platform" : 
                 comp === "AngelList" ? "Investment Platform" : "Management Platform"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Trend Research
const TrendResearch = ({ responses }: { responses: unknown[] }) => {
  const trendAnswer = getSectionAnswer(responses, "trendResearch");
  const sentences = trendAnswer.split(/\.\s+/).filter((s: string) => s.length > 30);
  const trends = sentences.slice(0, 6);
  
  if (trends.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">{trendAnswer || "No trend data available"}</Card>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trends.map((trend: string, i: number) => (
        <Card key={i} className="p-4 transition-all duration-200 hover:shadow-md" hover>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${T.primary}15` }}>
              <Brain className="h-5 w-5" style={{ color: T.primary }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1" style={{ color: T.foreground }}>{trend.substring(0, 60)}{trend.length > 60 ? "..." : ""}</p>
              <p className="text-xs leading-relaxed" style={{ color: T.mutedForeground }}>{trend}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Pricing Comparison
const PricingComparison = ({ responses }: { responses: unknown[] }) => {
  const pricingAnswer = getSectionAnswer(responses, "pricingResearch");
  const lines = pricingAnswer.split(/\.\s+|\n/).filter((l: string) => l.includes("$") || l.toLowerCase().includes("free"));
  const pricingLines = lines.slice(0, 6);
  
  if (pricingLines.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">{pricingAnswer || "No pricing data available"}</Card>;
  }
  
  return (
    <div className="space-y-2">
      {pricingLines.map((line: string, i: number) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-sm" style={{ borderColor: T.border, background: i % 2 === 0 ? T.card : T.input }}>
          <div className="flex-1">
            <span className="text-sm" style={{ color: T.foreground }}>{line.substring(0, 80)}{line.length > 80 ? "..." : ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Pain Points
const PainPoints = ({ responses }: { responses: unknown[] }) => {
  const painAnswer = getSectionAnswer(responses, "customerPainPoints");
  const sentences = painAnswer.split(/\.\s+/).filter((s: string) => s.length > 30);
  const points = sentences.slice(0, 8);
  
  if (points.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">{painAnswer || "No pain point data available"}</Card>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {points.map((point: string, i: number) => (
        <Card key={i} className="p-4 transition-all duration-200 hover:shadow-md" hover>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${T.tertiary}15` }}>
              <AlertCircle className="h-4 w-4" style={{ color: T.tertiary }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1" style={{ color: T.foreground }}>{point.substring(0, 50)}{point.length > 50 ? "..." : ""}</p>
              <p className="text-xs leading-relaxed" style={{ color: T.mutedForeground }}>{point}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Social Sentiment
const SocialSentiment = ({ responses }: { responses: unknown[] }) => {
  const socialSections = ["redditReviews", "youtubeReviews", "quoraReviews", "twitterSentiment", "instagramInsights"];
  const platforms = ["Reddit", "YouTube", "Quora", "X (Twitter)", "Instagram"];
  const colors = ["#ff4500", "#ff0000", "#b92b27", "#1d9bf0", "#e1306c"];
  
  const sources = socialSections.map((section, idx) => {
    const answer = getSectionAnswer(responses, section);
    const findings = answer.split(/\.\s+/).filter((s: string) => s.length > 20).slice(0, 4);
    
    return {
      platform: platforms[idx],
      color: colors[idx],
      findings: findings.length ? findings : [`No ${platforms[idx]} data available`],
    };
  }).filter(s => s.findings[0] !== `No ${s.platform} data available` || s.findings.length > 0);
  
  if (sources.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">No social sentiment data available</Card>;
  }
  
  return (
    <div className="space-y-4">
      {sources.map((s) => (
        <Collapsible key={s.platform} title={<span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: s.color }}></span>{s.platform}</span>} defaultOpen={s.platform === "Reddit"}>
          <ul className="space-y-2">
            {s.findings.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: T.mutedForeground }}>
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

// SWOT Analysis
const Swot = ({ responses }: { responses: unknown[] }) => {
  const swotAnswer = getSectionAnswer(responses, "swotAnalysis");
  const sections = {
    Strengths: swotAnswer.match(/Strengths?:?\s*([^.]*(?:\.|$))/i)?.[1]?.split(/,\s*/).slice(0, 5) || [],
    Weaknesses: swotAnswer.match(/Weaknesses?:?\s*([^.]*(?:\.|$))/i)?.[1]?.split(/,\s*/).slice(0, 5) || [],
    Opportunities: swotAnswer.match(/Opportunities?:?\s*([^.]*(?:\.|$))/i)?.[1]?.split(/,\s*/).slice(0, 5) || [],
    Threats: swotAnswer.match(/Threats?:?\s*([^.]*(?:\.|$))/i)?.[1]?.split(/,\s*/).slice(0, 5) || [],
  };
  
  const hasData = Object.values(sections).some(arr => arr.length > 0);
  
  if (!hasData) {
    return <Card className="p-8 text-center text-muted-foreground">{swotAnswer || "No SWOT analysis available"}</Card>;
  }
  
  const q = [
    { label: "Strengths", icon: CheckCircle, border: "#16a34a", bg: "rgba(22,163,74,0.1)", items: sections.Strengths },
    { label: "Weaknesses", icon: ThumbsDown, border: "#dc2626", bg: "rgba(220,38,38,0.1)", items: sections.Weaknesses },
    { label: "Opportunities", icon: TrendingUp, border: "#2563eb", bg: "rgba(37,99,235,0.1)", items: sections.Opportunities },
    { label: "Threats", icon: AlertCircle, border: "#d97706", bg: "rgba(217,119,6,0.1)", items: sections.Threats },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {q.map((s) => (
        <div key={s.label} className="rounded-xl border-l-4 p-5 shadow-sm transition-all hover:shadow-md" style={{ borderLeftColor: s.border, background: T.card, borderColor: T.border }}>
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: s.border }}>
            <s.icon className="h-4 w-4" /> {s.label}
          </h4>
          <ul className="space-y-1.5">
            {s.items.map((item, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: T.mutedForeground }}>
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.border }} />
                {item.trim()}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Research Sources
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
        const section = String(row.section || `Section ${idx + 1}`);
        const ok = row.success === true;
        const label = sectionLabels[section] || section;
        return (
          <div key={`${section}-${idx}`} className="flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all hover:shadow-sm"
            style={{ background: ok ? "rgba(5,150,105,0.1)" : "rgba(220,38,38,0.1)", borderColor: ok ? "rgba(5,150,105,0.3)" : "rgba(220,38,38,0.3)", color: ok ? "#166534" : "#991b1b" }}>
            {ok ? <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />}
            {label}
          </div>
        );
      })}
    </div>
  );
};

// Startup Validation
const StartupValidation = ({ responses }: { responses: unknown[] }) => {
  const validationAnswer = getSectionAnswer(responses, "startupValidation");
  const sentences = validationAnswer.split(/\.\s+/).filter((s: string) => s.length > 30);
  
  if (sentences.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">{validationAnswer || "No startup validation data available"}</Card>;
  }
  
  return (
    <div className="space-y-3">
      {sentences.slice(0, 6).map((sentence: string, i: number) => {
        const isPositive = sentence.toLowerCase().includes("success") || 
                          sentence.toLowerCase().includes("raised") ||
                          sentence.toLowerCase().includes("growing") ||
                          sentence.toLowerCase().includes("opportunity");
        
        return (
          <Card key={i} className="p-4 transition-all hover:shadow-sm" hover>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                {isPositive ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-orange-500" />}
              </div>
              <div className="flex-1">
                <p className="text-xs leading-relaxed" style={{ color: T.mutedForeground }}>{sentence}.</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Strategic Recommendations
const StrategicRecs = ({ mergedResponse }: { mergedResponse: string }) => {
  const lines = mergedResponse.split("\n");
  const recs: string[] = [];
  let inRecs = false;
  
  for (const line of lines) {
    if (line.match(/^\d+\./)) {
      recs.push(line);
      inRecs = true;
    } else if (inRecs && line.trim().startsWith("-")) {
      recs[recs.length - 1] += " " + line.trim();
    } else if (inRecs && line.trim() === "") {
      // Continue
    } else if (inRecs && !line.match(/^\d+\./) && line.trim().length > 0) {
      recs[recs.length - 1] += " " + line.trim();
    }
  }
  
  const recommendations = recs.slice(0, 6);
  
  if (recommendations.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">No strategic recommendations available</Card>;
  }
  
  const pColor = ["#dc2626", "#f97316", "#2563eb", "#7c3aed", "#059669", T.primary];
  
  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <Card key={i} className="p-4 transition-all hover:shadow-md" hover>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm" style={{ background: pColor[i % pColor.length] }}>
              P{i+1}
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed" style={{ color: T.mutedForeground }}>{rec}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Regional Insights
const RegionalInsights = ({ responses }: { responses: unknown[] }) => {
  const allAnswers = [
    getSectionAnswer(responses, "findTAM"),
    getSectionAnswer(responses, "marketResearch"),
    getSectionAnswer(responses, "trendResearch"),
  ].join(" ");
  
  const regions = ["North America", "Europe", "Asia-Pacific", "China", "India", "US", "Germany"];
  const insights: { name: string; data: string }[] = [];
  
  regions.forEach(region => {
    const regex = new RegExp(`([^.]*${region}[^.]*\\.)`, 'gi');
    const matches = allAnswers.match(regex);
    if (matches && matches.length) {
      insights.push({ name: region, data: matches[0].substring(0, 100) });
    }
  });
  
  if (insights.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">No regional insights available</Card>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.slice(0, 4).map((r, i) => (
        <Card key={i} className="p-5 transition-all hover:shadow-md" hover>
          <h4 className="font-bold text-sm mb-2" style={{ color: T.primary }}>{r.name}</h4>
          <p className="text-xs leading-relaxed" style={{ color: T.mutedForeground }}>{r.data}</p>
        </Card>
      ))}
    </div>
  );
};

// TAM/SAM/SOM
const TamSamSom = ({ responses }: { responses: unknown[] }) => {
  const tamAnswer = getSectionAnswer(responses, "findTAM");
  const samAnswer = getSectionAnswer(responses, "findSAM");
  const somAnswer = getSectionAnswer(responses, "findSOM");
  
  const tamMatch = tamAnswer.match(/\$(\d+(?:\.\d+)?)\s*(billion|million|trillion)/i);
  const samMatch = samAnswer.match(/\$(\d+(?:\.\d+)?)\s*(billion|million|trillion)/i);
  const somMatch = somAnswer.match(/(\d+(?:\.\d+)?)%/i);
  
  const items = [
    { label: "TAM", title: "Total Addressable Market", value: tamMatch ? `$${tamMatch[1]}${tamMatch[2] === "billion" ? "B" : tamMatch[2] === "million" ? "M" : ""}` : "Data available", detail: tamAnswer.substring(0, 80), color: T.primary },
    { label: "SAM", title: "Serviceable Available Market", value: samMatch ? `$${samMatch[1]}${samMatch[2] === "billion" ? "B" : samMatch[2] === "million" ? "M" : ""}` : "Data available", detail: samAnswer.substring(0, 80), color: T.secondary },
    { label: "SOM", title: "Serviceable Obtainable Market", value: somMatch ? `${somMatch[1]}%` : "Data available", detail: somAnswer.substring(0, 80), color: T.tertiary },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((m) => (
        <Card key={m.label} className="p-6 flex flex-col transition-all hover:shadow-md" hover>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-black" style={{ color: m.color, fontFamily: "'Geist', 'Inter', sans-serif" }}>{m.label}</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: `${m.color}15`, color: m.color }}>{m.title}</span>
          </div>
          <p className="text-2xl font-bold mb-2" style={{ color: T.foreground }}>{m.value}</p>
          <p className="text-xs leading-relaxed" style={{ color: T.mutedForeground }}>{m.detail}</p>
        </Card>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ResearchReportRenderer({ payload }: { payload: unknown }) {
  const root = asRecord(payload);
  
  if (!root) {
    return (
      <div className="flex items-center justify-center min-h-64 rounded-xl border border-border bg-card">
        <p className="text-muted-foreground text-sm">No structured research report found.</p>
      </div>
    );
  }

  const summarizedRequest = asRecord(root.summarizedRequest);
  const searchAgentResponses = asArray(root.searchAgentResponses);
  const mergedResponse = pretty(root.mergedResponse);
  const successfulCount = searchAgentResponses.filter((i) => asRecord(i)?.success === true).length;

  const topic = String(summarizedRequest?.topic || "Market Research Report");
  const audience = String(summarizedRequest?.audience || "");
  const intent = String(summarizedRequest?.intent || "");
  const competitors = asArray(summarizedRequest?.competitors);

  return (
    <div className="min-h-screen pb-16" style={{ background: T.background }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl mb-8 gradient-primary shadow-lg">
          <div className="relative px-8 py-10">
            <div className="flex items-center gap-2 mb-4">
              <Presentation className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm font-medium tracking-wide">Market Research Report</span>
              <span className="ml-auto text-white/60 text-xs">{new Date().toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">{topic}</h1>
            {intent && <p className="text-white/80 text-lg max-w-2xl mb-6">{intent}</p>}
            <div className="flex flex-wrap gap-3">
              {audience && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/90 text-sm backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <Users className="h-3.5 w-3.5" /> {audience}
                </div>
              )}
              {competitors.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/90 text-sm backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <Building className="h-3.5 w-3.5" /> {competitors.length} Competitors
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/90 text-sm backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                <CheckCircle className="h-3.5 w-3.5" /> {successfulCount}/{searchAgentResponses.length} Sources
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-10">
          <SectionHeader title="Executive Summary" icon={FileText} subtitle="High-level overview of key findings" />
          <ExecutiveSummary mergedResponse={mergedResponse} />
        </section>

        {/* Market Size & KPIs */}
        <section className="mb-10">
          <SectionHeader title="Market Size & Growth" icon={BarChart3} subtitle="Total addressable market and growth projections" />
          <MarketKPIs responses={searchAgentResponses} />
        </section>

        {/* TAM/SAM/SOM */}
        <section className="mb-10">
          <SectionHeader title="Market Opportunity Breakdown" icon={Target} subtitle="TAM, SAM, and SOM analysis" />
          <TamSamSom responses={searchAgentResponses} />
        </section>

        {/* Regional Insights */}
        <section className="mb-10">
          <SectionHeader title="Regional Insights" icon={Globe} subtitle="Geographic market distribution" />
          <RegionalInsights responses={searchAgentResponses} />
        </section>

        {/* Market Trends */}
        <section className="mb-10">
          <SectionHeader title="Market Trends" icon={TrendingUp} subtitle="Emerging patterns and industry shifts" />
          <TrendResearch responses={searchAgentResponses} />
        </section>

        {/* Competitive Landscape */}
        <section className="mb-10">
          <SectionHeader title="Competitive Landscape" icon={Building} badge={`${competitors.length} Competitors`} subtitle="Key players and market positioning" />
          <Card className="p-0 overflow-hidden">
            <CompetitorTable competitors={competitors as string[]} />
          </Card>
        </section>

        {/* Pricing Landscape */}
        <section className="mb-10">
          <SectionHeader title="Pricing Landscape" icon={DollarSign} subtitle="Monetization strategies and benchmarks" />
          <PricingComparison responses={searchAgentResponses} />
        </section>

        {/* Customer Pain Points */}
        <section className="mb-10">
          <SectionHeader title="Customer Pain Points" icon={AlertCircle} subtitle="Key challenges and friction areas" />
          <PainPoints responses={searchAgentResponses} />
        </section>

        {/* Social Sentiment */}
        <section className="mb-10">
          <SectionHeader title="Social Sentiment" icon={MessageSquare} subtitle="Community feedback across platforms" />
          <SocialSentiment responses={searchAgentResponses} />
        </section>

        {/* SWOT Analysis */}
        <section className="mb-10">
          <SectionHeader title="SWOT Analysis" icon={PieChart} subtitle="Strengths, weaknesses, opportunities, threats" />
          <Swot responses={searchAgentResponses} />
        </section>

        {/* Startup Validation */}
        <section className="mb-10">
          <SectionHeader title="Startup Validation" icon={Lightbulb} subtitle="Market viability and success indicators" />
          <StartupValidation responses={searchAgentResponses} />
        </section>

        {/* Strategic Recommendations */}
        <section className="mb-10">
          <SectionHeader title="Strategic Recommendations" icon={Target} subtitle="Actionable insights for market entry" />
          <StrategicRecs mergedResponse={mergedResponse} />
        </section>

        {/* Research Sources */}
        <section className="mb-10">
          <SectionHeader title="Research Sources" icon={FolderSearch} subtitle="Data sources and success status" />
          <ResearchSources responses={searchAgentResponses} />
        </section>

      </div>
    </div>
  );
}