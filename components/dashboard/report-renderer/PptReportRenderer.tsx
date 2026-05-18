"use client";

import React, { useState } from "react";
import { 
  Layout, 
  Palette, 
  Presentation, 
  SquareStack, 
  Target,
  Eye,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  List,
  Lightbulb,
  BarChart3,
  Clock,
  CheckCircle,
  Shield,
  Share2,
  Brain,
  Cloud,
  Lock,
  Users,
  Sparkles,
  ArrowRight,
  X
} from "lucide-react";
import { asArray, asRecord, pretty } from "./utils";
import { MetricCard, ReportSection, StatusBadge } from "./Shared";

// Theme Colors
const themeColors = {
  primary: "#4A90E2",
  secondary: "#7B68EE",
  background: "#0F1A30",
  text: "#F5F5F5",
  accent: "#50E3C2",
  cardBg: "#1A2538",
  border: "#2A3548"
};

// Slide Preview Component
const SlidePreview = ({ slide, index, isActive, onClick }: any) => {
  const row = asRecord(slide);
  const bullets = asArray(row?.bullets || row?.data?.bullets);
  const heading = pretty(row?.heading || row?.data?.heading || row?.title);
  const subheading = pretty(row?.subheading || row?.data?.subheading);
  const slideType = pretty(row?.type || row?.slideType || "content");
  const visual = row?.visual || row?.illustration;
  const chartData = row?.structuredData?.chartData;
  
  const getTypeColor = () => {
    switch(slideType) {
      case "hero": return "from-purple-500 to-pink-500";
      case "closing": return "from-green-500 to-teal-500";
      default: return "from-blue-500 to-indigo-500";
    }
  };

  return (
    <div 
      onClick={() => onClick(index)}
      className={`cursor-pointer transition-all duration-300 rounded-xl overflow-hidden border-2 ${
        isActive ? `border-[${themeColors.accent}] shadow-xl scale-[1.02]` : 'border-gray-700 hover:border-gray-500'
      }`}
      style={{ background: themeColors.cardBg }}
    >
      <div className={`h-1 bg-gradient-to-r ${getTypeColor()}`} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
            Slide {index + 1}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            slideType === "hero" ? "bg-purple-500/20 text-purple-300" :
            slideType === "closing" ? "bg-green-500/20 text-green-300" :
            "bg-blue-500/20 text-blue-300"
          }`}>
            {slideType}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-white line-clamp-2 mb-2">
          {heading || "Untitled Slide"}
        </h4>
        {subheading && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{subheading}</p>
        )}
        {bullets.length > 0 && (
          <div className="space-y-1">
            {bullets.slice(0, 2).map((bullet: any, i: number) => (
              <p key={i} className="text-xs text-gray-400 flex items-start gap-1">
                <span className="text-[#50E3C2]">•</span> {pretty(bullet).substring(0, 50)}...
              </p>
            ))}
          </div>
        )}
        {visual && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <ImageIcon className="h-3 w-3" />
            <span>Visual: {pretty(visual?.key || visual?.visualKey || "none")}</span>
          </div>
        )}
        {chartData && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <BarChart3 className="h-3 w-3" />
            <span>Chart: {chartData.type || "line"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Full Slide Renderer
const FullSlideRenderer = ({ slide, index, totalSlides, onNext, onPrev, onClose }: any) => {
  const row = asRecord(slide);
  const bullets = asArray(row?.bullets || row?.data?.bullets);
  const heading = pretty(row?.heading || row?.data?.heading || row?.title);
  const subheading = pretty(row?.subheading || row?.data?.subheading);
  const highlightText = pretty(row?.highlightText || row?.data?.highlightText);
  const slideType = pretty(row?.type || row?.slideType || "content");
  const visual = row?.visual || row?.illustration;
  const chartData = row?.structuredData?.chartData;
  const processData = row?.structuredData?.processData;
  const timelineData = row?.structuredData?.timelineData;
  const speakerNotes = pretty(row?.speakerNotes || row?.notes);

  const renderVisual = () => {
    if (visual?.imageUrl) {
      return (
        <img 
          src={visual.imageUrl} 
          alt={visual.alt || "Slide visual"}
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }
    
    if (chartData) {
      const maxValue = Math.max(...(chartData.values || [0]));
      return (
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-4">{chartData.title}</h4>
          <div className="space-y-3">
            {chartData.categories?.map((cat: string, i: number) => {
              const value = chartData.values?.[i] || 0;
              const percentage = (value / maxValue) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{cat}</span>
                    <span className="text-white">{value}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, background: themeColors.accent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    if (processData?.steps) {
      return (
        <div className="space-y-4">
          {processData.steps.map((step: string, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: themeColors.primary }}>
                {i + 1}
              </div>
              <p className="text-sm text-gray-300 flex-1">{step}</p>
              {i < processData.steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-500" />
              )}
            </div>
          ))}
        </div>
      );
    }
    
    if (timelineData?.steps) {
      return (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
          {timelineData.steps.map((step: string, i: number) => (
            <div key={i} className="relative flex items-start gap-4 mb-6 last:mb-0">
              <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: themeColors.secondary }}>
                {i + 1}
              </div>
              <p className="text-sm text-gray-300 flex-1 pt-1">{step}</p>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <ImageIcon className="h-12 w-12 opacity-20" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden" style={{ background: themeColors.background }} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
        
        {/* Slide content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left - Visual */}
          <div className="p-8 border-r border-gray-800">
            <div className="h-full min-h-[400px] flex items-center justify-center">
              {renderVisual()}
            </div>
          </div>
          
          {/* Right - Content */}
          <div className="p-8 overflow-y-auto max-h-[90vh]">
            <div className="mb-4">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                Slide {index + 1} of {totalSlides}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">{heading}</h2>
            {subheading && <p className="text-[#7B68EE] mb-6">{subheading}</p>}
            
            {bullets.length > 0 && (
              <ul className="space-y-3 mb-6">
                {bullets.map((bullet: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-[#50E3C2] flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{pretty(bullet)}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {highlightText && (
              <div className="p-4 rounded-lg mb-6" style={{ background: `${themeColors.accent}20`, borderLeft: `3px solid ${themeColors.accent}` }}>
                <p className="text-sm text-[#50E3C2] font-medium">{highlightText}</p>
              </div>
            )}
            
            {speakerNotes && (
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500">SPEAKER NOTES</span>
                </div>
                <p className="text-sm text-gray-400 italic">{speakerNotes}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <button 
            onClick={onPrev}
            disabled={index === 0}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button 
            onClick={onNext}
            disabled={index === totalSlides - 1}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="rounded-xl p-4" style={{ background: themeColors.cardBg, border: `1px solid ${themeColors.border}` }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="p-2 rounded-lg" style={{ background: `${color}20` }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
    </div>
  </div>
);

// Theme Preview Component
const ThemePreview = ({ theme }: { theme: any }) => {
  const colors = {
    primary: theme?.primaryColor || theme?.primary || "#4A90E2",
    secondary: theme?.secondaryColor || theme?.secondary || "#7B68EE",
    accent: theme?.accentColor || theme?.accent || "#50E3C2",
    background: theme?.backgroundColor || theme?.background || "#0F1A30",
    text: theme?.textColor || theme?.text || "#F5F5F5"
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(colors).map(([name, color]) => (
          <div key={name} className="text-center">
            <div className="w-full h-10 rounded-lg mb-1" style={{ background: String(color) }} />
            <p className="text-xs text-gray-400 capitalize">{name}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: colors.background, border: `1px solid ${colors.secondary}` }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ background: colors.accent }} />
          <span className="text-xs text-white">Preview</span>
        </div>
        <span className="text-xs text-gray-400">Theme applied to all slides</span>
      </div>
    </div>
  );
};

// Main Component
export default function PptReportRenderer({ payload }: { payload: unknown }) {
  const root = asRecord(payload);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  if (!root) {
    return (
      <div className="flex items-center justify-center min-h-[400px] rounded-xl border border-gray-800 bg-gray-900/50">
        <p className="text-gray-400">No structured PPT report found.</p>
      </div>
    );
  }

  const slidePlan = asRecord(root.slidePlan);
  const slides = asArray(root.slides || root.finalMapPPT?.slides);
  const theme = asRecord(root.theme || root.finalMapPPT?.theme);
  const pptRenderMap = asRecord(root.pptRenderMap);
  const title = pretty(root.title || root.finalMapPPT?.title || "Presentation");
  
  const totalSlides = slides.length;
  const slideTypes = slides.reduce((acc: any, slide: any) => {
    const type = pretty(slide?.type || slide?.slideType || "content");
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const hasVisuals = slides.filter((s: any) => s?.visual || s?.illustration || s?.structuredData).length;

  const handleSlideClick = (index: number) => {
    setSelectedSlideIndex(index);
  };

  const handleClosePreview = () => {
    setSelectedSlideIndex(null);
  };

  const handlePrevSlide = () => {
    if (selectedSlideIndex !== null && selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (selectedSlideIndex !== null && selectedSlideIndex < totalSlides - 1) {
      setSelectedSlideIndex(selectedSlideIndex + 1);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: theme?.backgroundColor || themeColors.background }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl" style={{ background: theme?.primaryColor || themeColors.primary }}>
              <Presentation className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          <p className="text-gray-400">Professional presentation with {totalSlides} slides, ready for delivery</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Slides" value={totalSlides} icon={SquareStack} color={theme?.primaryColor || themeColors.primary} />
          <StatsCard title="Slide Types" value={Object.keys(slideTypes).length} icon={Layout} color={theme?.secondaryColor || themeColors.secondary} />
          <StatsCard title="With Visuals" value={`${hasVisuals}/${totalSlides}`} icon={Eye} color={theme?.accentColor || themeColors.accent} />
          <StatsCard title="View Mode" value={viewMode === "grid" ? "Grid" : "List"} icon={viewMode === "grid" ? Layout : List} color="#888" />
        </div>

        {/* Theme Section */}
        {theme && Object.keys(theme).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Presentation Theme</h2>
            </div>
            <ThemePreview theme={theme} />
          </div>
        )}

        {/* Slide Plan Summary */}
        {slidePlan && Object.keys(slidePlan).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Slide Plan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: themeColors.cardBg, border: `1px solid ${themeColors.border}` }}>
                <p className="text-sm text-gray-400 mb-2">Slide Types Distribution</p>
                <div className="space-y-2">
                  {Object.entries(slideTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${(Number(count) / totalSlides) * 100}%`, background: theme?.primaryColor || themeColors.primary }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: themeColors.cardBg, border: `1px solid ${themeColors.border}` }}>
                <p className="text-sm text-gray-400 mb-2">Quick Stats</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hero Slides:</span>
                    <span className="text-white">{slideTypes.hero || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Content Slides:</span>
                    <span className="text-white">{slideTypes.content || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Closing Slides:</span>
                    <span className="text-white">{slideTypes.closing || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slides Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Slides ({totalSlides})</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                <Layout className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slides.map((slide, idx) => (
                <SlidePreview 
                  key={idx}
                  slide={slide}
                  index={idx}
                  isActive={selectedSlideIndex === idx}
                  onClick={handleSlideClick}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {slides.map((slide, idx) => {
                const row = asRecord(slide);
                const bullets = asArray(row?.bullets || row?.data?.bullets);
                const heading = pretty(row?.heading || row?.data?.heading || row?.title);
                const slideType = pretty(row?.type || row?.slideType || "content");
                
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSlideClick(idx)}
                    className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
                    style={{ background: themeColors.cardBg, border: `1px solid ${themeColors.border}` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">Slide {idx + 1}</span>
                        <span className="text-sm font-medium text-white">{heading || "Untitled"}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        slideType === "hero" ? "bg-purple-500/20 text-purple-300" :
                        slideType === "closing" ? "bg-green-500/20 text-green-300" :
                        "bg-blue-500/20 text-blue-300"
                      }`}>
                        {slideType}
                      </span>
                    </div>
                    {bullets.length > 0 && (
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {pretty(bullets[0])}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            Presentation generated with {totalSlides} slides • Theme: {theme?.primaryColor ? "Custom" : "Default"} • Ready for export
          </p>
        </div>

        {/* Full Screen Slide Preview Modal */}
        {selectedSlideIndex !== null && slides[selectedSlideIndex] && (
          <FullSlideRenderer
            slide={slides[selectedSlideIndex]}
            index={selectedSlideIndex}
            totalSlides={totalSlides}
            onPrev={handlePrevSlide}
            onNext={handleNextSlide}
            onClose={handleClosePreview}
          />
        )}
      </div>
    </div>
  );
}