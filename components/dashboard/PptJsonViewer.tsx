"use client";

import React from "react";

type ThemeSpec = {
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  accentColor?: string;
};

type Box = { x?: number; y?: number; w?: number; h?: number };
type PptOp = Record<string, unknown> & { kind?: string; box?: Box };

type PptRenderMap = {
  theme?: ThemeSpec;
  slides?: Array<{
    slideId?: number;
    operations?: PptOp[];
    speakerNotes?: string;
  }>;
};

const SLIDE_WIDTH = 13.333;
const SLIDE_HEIGHT = 7.5;
const PX_PER_INCH = 72;
const BASE_WIDTH_PX = Math.round(SLIDE_WIDTH * PX_PER_INCH);
const BASE_HEIGHT_PX = Math.round(SLIDE_HEIGHT * PX_PER_INCH);

const hex = (value: unknown, fallback: string) => {
  const raw = String(value ?? "").replace("#", "").trim();
  return /^[0-9a-fA-F]{6}$/.test(raw) ? `#${raw}` : fallback;
};

const boxStyle = (box?: Box): React.CSSProperties => {
  const x = Number(box?.x ?? 0);
  const y = Number(box?.y ?? 0);
  const w = Number(box?.w ?? 1);
  const h = Number(box?.h ?? 1);
  return {
    position: "absolute",
    left: `${(x / SLIDE_WIDTH) * 100}%`,
    top: `${(y / SLIDE_HEIGHT) * 100}%`,
    width: `${(w / SLIDE_WIDTH) * 100}%`,
    height: `${(h / SLIDE_HEIGHT) * 100}%`,
  };
};

const opText = (op: PptOp, fallback: string) => String(op.text ?? fallback);
const opNum = (op: PptOp, key: string, fallback: number) => Number(op[key] ?? fallback);

function VisualPlaceholder({ label, style }: { label: string; style: React.CSSProperties }) {
  return (
    <div style={style} className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3 text-[11px] text-slate-500">
      {label}
    </div>
  );
}

function renderOperation(op: PptOp, idx: number, theme: ThemeSpec) {
  const kind = String(op.kind ?? "");
  const style = boxStyle(op.box);
  const textColor = hex(op.color, hex(theme.textColor, "#111827"));
  const accentColor = hex(op.color, hex(theme.accentColor, "#2563EB"));
  const secondary = hex(op.color, hex(theme.secondaryColor, "#6B7280"));

  if (kind === "addAccentBar") {
    return <div key={idx} style={{ ...style, background: accentColor }} />;
  }

  if (kind === "addMetaChip") {
    return (
      <div key={idx} style={style} className="rounded-full border border-slate-300/50 bg-white/70 flex items-center justify-center text-[10px] font-semibold" >
        <span style={{ color: secondary }}>{opText(op, "")}</span>
      </div>
    );
  }

  if (kind === "addBodyPanel") {
    return <div key={idx} style={style} className="rounded-xl border border-slate-300/60 bg-white/70" />;
  }

  if (kind === "addText") {
    return (
      <div
        key={idx}
        style={{
          ...style,
          color: textColor,
          fontSize: `${Math.max(10, opNum(op, "fontSize", 16))}px`,
          fontWeight: op.bold ? 700 : 500,
          lineHeight: 1.25,
          overflow: "hidden",
          whiteSpace: "pre-wrap",
        }}
      >
        {opText(op, "")}
      </div>
    );
  }

  if (kind === "addBullets") {
    const bullets = Array.isArray(op.bullets) ? op.bullets.map((b) => String(b)) : [];
    return (
      <div key={idx} style={style} className="overflow-hidden">
        <ul
          style={{
            color: textColor,
            fontSize: `${Math.max(10, opNum(op, "fontSize", 14))}px`,
            lineHeight: 1.35,
            paddingLeft: "1rem",
            margin: 0,
          }}
        >
          {bullets.map((b, i) => (
            <li key={i} className="mb-1">{b}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (kind === "addImage") {
    const src = String(op.src ?? "");
    const alt = String(op.alt ?? "Image");
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return <img key={idx} src={src} alt={alt} style={style} className="rounded-lg object-cover border border-slate-300/60" />;
    }
    return <VisualPlaceholder key={idx} label={alt || "Image"} style={style} />;
  }

  if (kind === "addHighlight") {
    return (
      <div key={idx} style={{ ...style, background: "rgba(37,99,235,0.14)", border: "1px solid rgba(37,99,235,0.5)" }} className="rounded-lg px-3 py-2 flex items-center">
        <span style={{ color: hex(theme.primaryColor, "#1F2937"), fontSize: "12px", fontWeight: 700 }}>{opText(op, "")}</span>
      </div>
    );
  }

  if (["addChart", "addProcessFlow", "addTimeline", "addComparisonTable", "addStatsCards"].includes(kind)) {
    return <VisualPlaceholder key={idx} label={kind.replace("add", "")} style={style} />;
  }

  return null;
}

function extractRenderMap(payload: unknown): PptRenderMap | null {
  if (!payload || typeof payload !== "object") return null;
  const map = (payload as { pptRenderMap?: PptRenderMap }).pptRenderMap;
  if (!map || !Array.isArray(map.slides)) return null;
  return map;
}

export default function PptJsonViewer({ payload }: { payload: unknown }) {
  const renderMap = extractRenderMap(payload);
  if (!renderMap) {
    return <p className="text-sm text-muted-foreground">No PPT render map found in response.</p>;
  }

  const theme = renderMap.theme ?? {};
  const background = hex(theme.backgroundColor, "#F8FAFC");

  return (
    <div className="space-y-5">
      {renderMap.slides?.map((slide, i) => (
        <div key={`${slide.slideId ?? i}`} className="rounded-2xl border border-border bg-background/70 p-3">
          <p className="mb-3 text-xs text-muted-foreground">Slide {i + 1}</p>
          <div className="overflow-x-auto">
            <div
              className="relative rounded-xl border border-slate-300/60 shadow-sm"
              style={{
                width: `${BASE_WIDTH_PX}px`,
                height: `${BASE_HEIGHT_PX}px`,
                background,
              }}
            >
              {(slide.operations ?? []).map((op, idx) => renderOperation(op, idx, theme))}
            </div>
          </div>
          {slide.speakerNotes ? <p className="mt-3 text-xs text-muted-foreground">{slide.speakerNotes}</p> : null}
        </div>
      ))}
    </div>
  );
}

