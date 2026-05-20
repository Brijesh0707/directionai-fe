"use client";

import React, { useMemo } from "react";

// ==============================
// Types
// ==============================

interface Illustration {
  imageUrl: string;
  alt: string;
}

interface StructuredData {
  timelineData?: { steps: string[] };
  processData?: { steps: string[] };
  chartData?: {
    type: string;
    title: string;
    categories: string[];
    values: number[];
  };
}

interface Slide {
  id: number;
  type: string;
  title: string;
  goal: string;
  heading: string;
  subheading: string;
  bullets: string[];
  highlightText: string;
  speakerNotes: string;
  layoutType: string;
  visual: string;
  illustration: Illustration;
  structuredData: StructuredData;
}

interface Theme {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
}

interface Summary {
  totalSlides: number;
  objective: string;
  audience: string;
  keyPoints: string[];
  slideTypes: Record<string, number>;
}

interface ParsedData {
  version: string;
  title: string;
  theme: Theme;
  summary: Summary;
  slides: Slide[];
}

// ==============================
// Parser Function
// ==============================

function parsePptPayload(payload: unknown): ParsedData | null {
  if (!payload || typeof payload !== "object") return null;
  
  const data = payload as any;
  
  if (!data.slides || !Array.isArray(data.slides)) return null;
  
  return {
    version: data.version || "v1",
    title: data.title || "Presentation",
    theme: {
      backgroundColor: data.theme?.backgroundColor || "#FFFFFF",
      primaryColor: data.theme?.primaryColor || "#0B04CF",
      secondaryColor: data.theme?.secondaryColor || "#1208E8",
      textColor: data.theme?.textColor || "#171717",
      accentColor: data.theme?.accentColor || "#10B981",
    },
    summary: {
      totalSlides: data.summary?.totalSlides || data.slides.length,
      objective: data.summary?.objective || "Not specified",
      audience: data.summary?.audience || "Not specified",
      keyPoints: data.summary?.keyPoints || [],
      slideTypes: data.summary?.slideTypes || {},
    },
    slides: data.slides,
  };
}

// ==============================
// Individual Slide Component (Full Page for Printing)
// ==============================

function FullPageSlide({ slide, index, total, theme }: { slide: Slide; index: number; total: number; theme: Theme }) {
  return (
    <div 
      className="slide-page"
      style={{
        pageBreakAfter: index < total - 1 ? "always" : "auto",
        breakInside: "avoid",
        position: "relative",
        minHeight: "100vh",
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Slide Number Indicator */}
      <div style={{
        position: "absolute",
        bottom: "30px",
        right: "40px",
        fontSize: "12px",
        color: "#999",
        fontFamily: "monospace",
      }}>
        {index + 1} / {total}
      </div>

      {/* Slide Type Badge */}
      <div style={{
        position: "absolute",
        top: "30px",
        right: "40px",
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        backgroundColor: `${theme.primaryColor}15`,
        color: theme.primaryColor,
        border: `1px solid ${theme.primaryColor}30`,
      }}>
        {slide.type}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Heading */}
        <h1 style={{
          fontSize: "42px",
          fontWeight: "bold",
          color: theme.primaryColor,
          marginBottom: "20px",
          lineHeight: "1.2",
        }}>
          {slide.heading}
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: "20px",
          color: "#666",
          marginBottom: "40px",
          lineHeight: "1.4",
        }}>
          {slide.subheading}
        </p>

        {/* Two Column Layout for Content and Image */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "50px",
          marginTop: "20px",
        }}>
          {/* Left Column - Content */}
          <div>
            {slide.bullets && slide.bullets.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {slide.bullets.map((bullet, i) => (
                  <li key={i} style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px",
                    fontSize: "16px",
                    lineHeight: "1.5",
                  }}>
                    <span style={{ color: theme.accentColor, fontWeight: "bold" }}>◆</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Highlight Text */}
            {slide.highlightText && (
              <div style={{
                marginTop: "30px",
                padding: "20px",
                backgroundColor: `${theme.accentColor}10`,
                borderLeft: `4px solid ${theme.accentColor}`,
                borderRadius: "8px",
              }}>
                <p style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: theme.accentColor,
                  margin: 0,
                }}>
                  {slide.highlightText}
                </p>
              </div>
            )}

            {/* Goal */}
            <div style={{
              marginTop: "30px",
              padding: "16px",
              backgroundColor: `${theme.primaryColor}05`,
              borderRadius: "8px",
              border: `1px solid ${theme.primaryColor}20`,
            }}>
              <p style={{
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: theme.primaryColor,
                marginBottom: "8px",
              }}>
                Goal
              </p>
              <p style={{
                fontSize: "14px",
                color: "#666",
                margin: 0,
                lineHeight: "1.5",
              }}>
                {slide.goal}
              </p>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div>
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              marginBottom: "16px",
            }}>
              <img
                src={slide.illustration.imageUrl}
                alt={slide.illustration.alt}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
            <p style={{
              fontSize: "12px",
              textAlign: "center",
              color: "#999",
              marginTop: "12px",
            }}>
              {slide.illustration.alt}
            </p>
          </div>
        </div>

        {/* Speaker Notes (Hidden in print by default, but can be shown) */}
        <div className="speaker-notes" style={{
          marginTop: "50px",
          padding: "16px",
          backgroundColor: "#F5F5F5",
          borderRadius: "8px",
          border: "1px solid #E0E0E0",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}>
          <p style={{
            fontSize: "11px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#999",
            marginBottom: "8px",
          }}>
            Speaker Notes
          </p>
          <p style={{
            fontSize: "13px",
            color: "#666",
            margin: 0,
            lineHeight: "1.5",
          }}>
            {slide.speakerNotes}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==============================
// Cover/Header Component
// ==============================

function CoverPage({ parsed, theme }: { parsed: ParsedData; theme: Theme }) {
  return (
    <div 
      className="cover-page"
      style={{
        pageBreakAfter: "always",
        breakInside: "avoid",
        minHeight: "100vh",
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Logo/Brand */}
      <div style={{
        position: "absolute",
        top: "40px",
        left: "40px",
        fontSize: "14px",
        fontWeight: "bold",
        color: theme.primaryColor,
      }}>
        AI-Powered Business OS
      </div>

      {/* Main Title */}
      <h1 style={{
        fontSize: "56px",
        fontWeight: "bold",
        color: theme.primaryColor,
        marginBottom: "24px",
        lineHeight: "1.2",
      }}>
        {parsed.title}
      </h1>

      {/* Divider */}
      <div style={{
        width: "80px",
        height: "4px",
        backgroundColor: theme.accentColor,
        marginBottom: "32px",
      }} />

      {/* Description */}
      <p style={{
        fontSize: "20px",
        color: "#666",
        marginBottom: "48px",
        lineHeight: "1.5",
        maxWidth: "70%",
      }}>
        {parsed.summary.objective}
      </p>

      {/* Meta Info */}
      <div style={{
        display: "flex",
        gap: "40px",
        marginTop: "auto",
        paddingTop: "60px",
      }}>
        <div>
          <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Total Slides</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: theme.primaryColor }}>
            {parsed.summary.totalSlides}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Audience</p>
          <p style={{ fontSize: "16px", fontWeight: "500" }}>{parsed.summary.audience}</p>
        </div>
        <div>
          <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Slide Types</p>
          <p style={{ fontSize: "16px", fontWeight: "500" }}>
            {Object.keys(parsed.summary.slideTypes).length}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==============================
// Table of Contents Component
// ==============================

function TableOfContents({ slides, theme }: { slides: Slide[]; theme: Theme }) {
  return (
    <div 
      className="toc-page"
      style={{
        pageBreakAfter: "always",
        breakInside: "avoid",
        minHeight: "100vh",
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        padding: "60px 80px",
      }}
    >
      <h1 style={{
        fontSize: "36px",
        fontWeight: "bold",
        color: theme.primaryColor,
        marginBottom: "40px",
      }}>
        Table of Contents
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {slides.map((slide, idx) => (
          <div key={slide.id} style={{
            display: "flex",
            alignItems: "baseline",
            gap: "16px",
            padding: "12px 0",
            borderBottom: "1px solid #E0E0E0",
          }}>
            <span style={{
              fontSize: "14px",
              fontWeight: "600",
              color: theme.primaryColor,
              minWidth: "40px",
            }}>
              {idx + 1}
            </span>
            <span style={{
              fontSize: "16px",
              flex: 1,
            }}>
              {slide.heading || slide.title}
            </span>
            <span style={{
              fontSize: "12px",
              color: "#999",
              textTransform: "capitalize",
              padding: "2px 8px",
              backgroundColor: `${theme.primaryColor}10`,
              borderRadius: "12px",
            }}>
              {slide.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================
// Main Component
// ==============================

export default function PptReportRenderer({ payload }: { payload: unknown }) {
  const parsed = useMemo(() => parsePptPayload(payload), [payload]);

  if (!parsed || !parsed.slides || parsed.slides.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No structured PPT report found.</p>
      </div>
    );
  }

  const theme = parsed.theme;

  // Inject CSS for printing
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        
        .slide-page, .cover-page, .toc-page {
          page-break-after: always;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .speaker-notes {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        @page {
          size: landscape;
          margin: 0;
        }
        
        /* Ensure backgrounds print */
        * {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Inject theme colors as CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: theme.backgroundColor }}>
      {/* Print Button - Only visible on screen */}
    

      {/* All Slides in Single Page Flow */}
      <div style={{ backgroundColor: theme.backgroundColor }}>
        {/* Cover Page */}
        <CoverPage parsed={parsed} theme={theme} />
        
        {/* Table of Contents */}
        <TableOfContents slides={parsed.slides} theme={theme} />
        
        {/* All Slides */}
        {parsed.slides.map((slide, idx) => (
          <FullPageSlide
            key={slide.id}
            slide={slide}
            index={idx}
            total={parsed.slides.length}
            theme={theme}
          />
        ))}
        
        {/* Back Cover */}
        <div 
          className="back-cover"
          style={{
            minHeight: "100vh",
            backgroundColor: theme.backgroundColor,
            padding: "60px 80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2 style={{
            fontSize: "32px",
            color: theme.primaryColor,
            marginBottom: "20px",
          }}>
            Thank You
          </h2>
          <p style={{
            fontSize: "18px",
            color: "#666",
            marginBottom: "40px",
          }}>
            Let's Build a More Intelligent Business Together
          </p>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: `${theme.primaryColor}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}>
            <span style={{ fontSize: "24px" }}>🚀</span>
          </div>
        </div>
      </div>

      {/* Screen-only CSS */}
      <style jsx>{`
        @media screen {
          .no-print {
            display: block;
          }
        }
        @media print {
          .no-print {
            display: none;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}