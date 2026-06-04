//@ts-nocheck
import React from 'react';

interface Slide {
  id: number;
  type: string;
  title: string;
  goal: string;
  heading?: string;
  subheading?: string;
  bullets?: string[];
  highlightText?: string;
  speakerNotes?: string;
  layoutType?: string;
  visual?: string;
  structuredData?: any;
  illustration?: {
    slideId: number;
    visualKey: string;
    imageUrl: string;
    alt: string;
    provider: string;
  };
}

interface PptReportRendererProps {
  payload: {
    title: string;
    slides: Slide[];
    theme?: any;
    summary?: any;
  };
}

const PptReportRenderer = ({ payload }: any) => {
  const { slides, title } = payload;

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      hero: '🚀',
      agenda: '📋',
      problem: '⚠️',
      opportunity: '💡',
      vision: '👁️',
      solution: '🔧',
      feature: '✨',
      demo: '🎬',
      market: '📊',
      differentiation: '🏆',
      business_model: '💰',
      roadmap: '🗺️',
      team: '👥',
      investment: '💎',
      summary: '📝',
      next_steps: '📌',
      closing: '🙏'
    };
    return icons[type] || '📄';
  };

  const getBadgeClass = (type: string) => {
    const colors: Record<string, string> = {
      hero: 'bg-primary',
      problem: 'bg-tertiary',
      opportunity: 'bg-green-500',
      vision: 'bg-primary',
      solution: 'bg-secondary',
      feature: 'bg-blue-500',
      market: 'bg-green-500',
      investment: 'bg-orange-500',
      closing: 'bg-primary'
    };
    return colors[type] || 'bg-neutral';
  };

  // Check if slide has illustration
  const hasIllustration = (slide: Slide) => {
    return slide.illustration?.imageUrl;
  };

  return (
    <div className="w-full max-w-full mx-0 p-8 bg-background">
      {/* Report Header */}
      <div className="text-center p-12 mb-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-2">{title}</h1>
        <div className="text-muted-foreground text-sm">
          <span>{slides.length} slides</span>
          <span className="mx-2">•</span>
          <span>MicroDrama Platform</span>
        </div>
      </div>

      {/* Slides Container */}
      <div className="flex flex-col gap-8 w-full">
        {slides.map((slide: Slide, index: number) => (
          <div 
            key={slide.id} 
            className="bg-white rounded-lg p-8 relative shadow-md hover:shadow-lg transition-all break-inside-avoid"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {/* Slide Number */}
            <div className="absolute top-4 right-6 text-xs text-muted-foreground font-mono">
              {index + 1} / {slides.length}
            </div>
            
            {/* Type Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-6 text-white ${getBadgeClass(slide.type)}`}>
              <span className="text-sm">{getTypeIcon(slide.type)}</span>
              <span>{slide.type.toUpperCase()}</span>
            </div>

            {/* Two Column Layout if has image */}
            {hasIllustration(slide) ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Content */}
                <div className="flex flex-col gap-6">
                  {/* Header Section */}
                  <div className="border-b-3 border-primary pb-4">
                    <h2 className="text-2xl font-bold text-primary mb-2">{slide.heading || slide.title}</h2>
                    {slide.subheading && (
                      <p className="text-muted-foreground">{slide.subheading}</p>
                    )}
                  </div>

                  {/* Goal */}
                  {slide.goal && (
                    <div className="bg-card p-3 rounded-lg text-sm text-card-foreground">
                      <span className="font-bold text-primary mr-2">Goal:</span>
                      <span>{slide.goal}</span>
                    </div>
                  )}

                  {/* Bullets */}
                  {slide.bullets && slide.bullets.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {slide.bullets.map((bullet: string, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-5 h-5 rounded-full bg-primary" />
                          </div>
                          <div className="text-card-foreground">{bullet}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stats Cards */}
                  {slide.structuredData?.statsData?.cards && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {slide.structuredData.statsData.cards.map((card: any, idx: number) => (
                        <div key={idx} className="bg-card p-4 rounded-xl text-center border border-border">
                          <div className="text-xl font-extrabold text-primary mb-1">{card.value}</div>
                          <div className="text-xs text-muted-foreground">{card.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Highlight Text */}
                  {slide.highlightText && (
                    <div className="flex items-center gap-3 p-4 bg-card border-l-4 border-primary rounded-xl">
                      <span className="text-xl">💡</span>
                      <span className="text-card-foreground font-medium">{slide.highlightText}</span>
                    </div>
                  )}
                </div>

                {/* Right Column - Image */}
                <div className="flex items-center justify-center">
                  <div className="w-full">
                    <img 
                      src={slide.illustration!.imageUrl} 
                      alt={slide.illustration!.alt || slide.title}
                      className="w-full h-auto rounded-xl shadow-lg object-cover"
                      loading="lazy"
                    />
                    <div className="text-xs text-muted-foreground text-center mt-3">{slide.illustration!.alt}</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Single Column Layout - Full Width Content */
              <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="border-b-3 border-primary pb-4">
                  <h2 className="text-2xl font-bold text-primary mb-2">{slide.heading || slide.title}</h2>
                  {slide.subheading && (
                    <p className="text-muted-foreground">{slide.subheading}</p>
                  )}
                </div>

                {/* Goal */}
                {slide.goal && (
                  <div className="bg-card p-3 rounded-lg text-sm text-card-foreground">
                    <span className="font-bold text-primary mr-2">Goal:</span>
                    <span>{slide.goal}</span>
                  </div>
                )}

                {/* Bullets */}
                {slide.bullets && slide.bullets.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {slide.bullets.map((bullet: string, idx: number) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded-full bg-primary" />
                        </div>
                        <div className="text-card-foreground">{bullet}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats Cards */}
                {slide.structuredData?.statsData?.cards && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {slide.structuredData.statsData.cards.map((card: any, idx: number) => (
                      <div key={idx} className="bg-card p-5 rounded-xl text-center border border-border">
                        <div className="text-2xl font-extrabold text-primary mb-2">{card.value}</div>
                        <div className="text-sm text-muted-foreground">{card.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Chart Data */}
                {slide.structuredData?.chartData && (
                  <div className="bg-card p-5 rounded-xl">
                    <h4 className="font-semibold text-card-foreground mb-4">{slide.structuredData.chartData.title}</h4>
                    <div className="flex flex-col gap-3">
                      {slide.structuredData.chartData.categories.map((cat: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="w-32 text-sm text-muted-foreground">{cat}</span>
                          <div className="flex-1 bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-7 rounded-full bg-gradient-to-r from-primary to-secondary"
                              style={{ width: `${slide.structuredData.chartData.values[idx]}%` }}
                            />
                          </div>
                          <span className="w-12 text-sm font-semibold text-primary">{slide.structuredData.chartData.values[idx]}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {slide.structuredData?.timelineData?.steps && (
                  <div className="flex flex-col gap-2">
                    {slide.structuredData.timelineData.steps.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                        <div className="flex-1 bg-card p-3 rounded-xl">
                          <div className="text-card-foreground">{step}</div>
                        </div>
                        {idx < slide.structuredData.timelineData.steps.length - 1 && (
                          <div className="w-0.5 h-5 bg-primary ml-1.5" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Process Flow */}
                {slide.structuredData?.processData?.steps && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {slide.structuredData.processData.steps.map((step: string, idx: number) => (
                      <React.Fragment key={idx}>
                        <div className="flex items-center gap-3 flex-1 min-w-[180px] bg-card p-4 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div className="text-card-foreground">{step}</div>
                        </div>
                        {idx < slide.structuredData.processData.steps.length - 1 && (
                          <div className="text-muted text-xl">→</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Comparison Table */}
                {slide.structuredData?.comparisonData?.rows && (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-3 bg-primary text-white font-semibold p-3">
                      <div>Metric</div>
                      <div>MicroDrama</div>
                      <div>Generalist Platforms</div>
                    </div>
                    {slide.structuredData.comparisonData.rows.map((row: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-3 p-3 border-b border-border last:border-b-0 bg-white">
                        <div className="font-medium text-card-foreground">{row.metric}</div>
                        <div className="text-muted-foreground">
                          <span className="text-green-500 font-bold">✓</span> {row.left}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="text-tertiary font-bold">✗</span> {row.right}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlight Text */}
                {slide.highlightText && (
                  <div className="flex items-center gap-3 p-4 bg-card border-l-4 border-primary rounded-xl">
                    <span className="text-xl">💡</span>
                    <span className="text-card-foreground font-medium">{slide.highlightText}</span>
                  </div>
                )}

              
                {hasIllustration(slide) === false && slide.illustration?.imageUrl && (
                  <div className="mt-4 text-center">
                    <img 
                      src={slide.illustration.imageUrl} 
                      alt={slide.illustration.alt || slide.title}
                      className="max-w-full rounded-xl shadow-md mx-auto"
                      loading="lazy"
                    />
                    <div className="text-xs text-muted-foreground mt-2">{slide.illustration.alt}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default PptReportRenderer;