//@ts-nocheck
import React from 'react'
import {
  TrendingUp, Users, DollarSign, Target, Globe,
  AlertCircle, Zap, Shield, BarChart3,
  Play, MessageCircle,
  Building2, Lightbulb, PieChart, BookOpen,
  GraduationCap, Rocket, Award, ChevronRight,
  Calendar, Heart, ExternalLink, Quote,
  Sparkles, Crown, Layers, ThumbsUp, TrendingDown,
  ThumbsDown
} from 'lucide-react'
import { FaXTwitter } from "react-icons/fa6";

const ResearchReportRenderer = ({ payload }: any) => {
  const ParseData = typeof payload?.mergedResponse === 'string'
    ? JSON.parse(payload.mergedResponse)
    : payload

  // ─── DATA MAPPING ─────────────────────────────────────────────────────────
  const raw = ParseData

  // helpers
  const arrFrom = (v: any) => (Array.isArray(v) ? v : v ? [v] : [])
  const fmt = (v: any) => (typeof v === 'string' ? v.trim() : '')

  // market research sections
  const mapSection = (section: any) =>
    arrFrom(section?.data).map((item: any) => ({
      answer: fmt(item?.answer),
      query: fmt(item?.query),
      shortSummary: fmt(item?.ShortSummary),
      results: arrFrom(item?.results).map((r: any) => ({
        title: fmt(r?.title),
        content: fmt(r?.content),
        url: fmt(r?.url),
        snippet: fmt(r?.snippet),
        source: fmt(r?.source),
      })),
    }))

  const SD = {
    meta: {
      originalRequest: fmt(raw?.researchMetadata?.originalRequest),
      summary: fmt(payload?.mergedShortSummary || raw?.mergedShortSummary),
    },
    market: {
      marketResearch: mapSection(raw?.marketResearchData?.marketResearch),
      competitorResearch: mapSection(raw?.marketResearchData?.competitorResearch),
      pricingResearch: mapSection(raw?.marketResearchData?.pricingResearch),
      trendResearch: mapSection(raw?.marketResearchData?.trendResearch),
    },
    sizing: {
      tam: raw?.marketSizingData?.tam?.data || {},
      sam: raw?.marketSizingData?.sam?.data || {},
      som: raw?.marketSizingData?.som?.data || {},
    },
    social: {
      reddit: mapSection(raw?.socialSentimentData?.reddit),
      youtube: mapSection(raw?.socialSentimentData?.youtube),
      quora: mapSection(raw?.socialSentimentData?.quora),
      twitter: mapSection(raw?.socialSentimentData?.twitter),
      instagram: mapSection(raw?.socialSentimentData?.instagram),
    },
    pain: raw?.customerInsightsData?.painPoints?.data || {},
    startup: {
      validation: mapSection(raw?.startupData?.startupValidation),
      ai: mapSection(raw?.startupData?.aiStartupResearch),
      funding: mapSection(raw?.startupData?.fundingResearch),
    },
    swot: raw?.strategicAnalysisData?.swot?.data || {},
  }

  // ─── SHARED COMPONENTS ────────────────────────────────────────────────────

  const SectionHeader = ({ icon, title, subtitle, gradient = false }: any) => (
    <div className="mb-8 group">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight m-0 ${gradient ? 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent' : 'text-foreground'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="h-0.5 w-20 bg-gradient-to-r from-primary to-transparent rounded-full ml-13" />
    </div>
  )

  const Card = ({ children, className = "", hover = true }: any) => (
    <div className={`bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-5 transition-all duration-300 ${hover ? 'hover:shadow-xl hover:scale-[1.02] hover:border-primary/30' : ''} ${className}`}>
      {children}
    </div>
  )

const StatCard = ({ label, value, icon, color, subtext }: any) => {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-3xl p-6
        bg-gradient-to-br ${color}
        border border-white/10
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all duration-300
        min-h-[260px]
        flex flex-col justify-between
      `}
    >
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
          {icon}
        </div>

        <span className="text-[11px] tracking-widest uppercase text-white/60 font-medium">
          {label}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mt-8">
        <h2 className="text-xl font-bold text-white leading-tight">
          {value}
        </h2>

        {subtext && (
          <p className="mt-4 text-sm leading-6 text-white/75 max-w-[95%]">
            {subtext}
          </p>
        )}
      </div>


    </div>
  );
};

  const SourceLink = ({ result }: any) => (
    result?.url ? (
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block p-3 bg-muted/5 border border-border rounded-xl no-underline mt-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary m-0 group-hover:underline line-clamp-2">
              {result.title || result.url}
            </p>
            {(result.snippet || result.content) && (
              <p className="text-xs text-muted-foreground mt-1.5 m-0 line-clamp-2 leading-relaxed">
                {result.snippet || result.content}
              </p>
            )}
          </div>
          <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
        </div>
      </a>
    ) : null
  )

  const MetricBadge = ({ label, value, icon }: any) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full">
      {icon}
      <span className="text-xs font-medium text-primary">{label}:</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  )

  // ─── SECTION RENDERERS ────────────────────────────────────────────────────

  const CoverPage = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-border rounded-2xl p-12 text-center mb-10 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
          <BarChart3 className="text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent mb-4">
          Market Research Report
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          {SD.meta.summary || SD.meta.originalRequest || 'Comprehensive market analysis report'}
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full backdrop-blur-sm border border-border">
            <Calendar size={16} className="text-primary" />
            <span className="text-foreground">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full backdrop-blur-sm border border-border">
            <Award size={16} className="text-primary" />
            <span className="text-foreground">Direction AI Research</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full backdrop-blur-sm border border-border">
            <Globe size={16} className="text-primary" />
            <span className="text-foreground">Data-driven insights</span>
          </div>
        </div>
      </div>
    </div>
  )

  const ResearchSection = ({ items, title, icon, subtitle }: any) => {
    if (!items || items.length === 0) return null
    return (
      <section className="mb-12">
        <SectionHeader icon={icon} title={title} subtitle={subtitle || 'Key findings from comprehensive research'} />
        <div className="grid grid-cols-1 gap-4">
          {items.map((item: any, i: number) => (
            <Card key={i} hover={true}>
              {item.query && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ChevronRight size={14} className="text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-primary m-0">
                    {item.query}
                  </p>
                </div>
              )}
              {item.shortSummary && (
                <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary rounded-r-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={12} className="text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary m-0">
                      Key Insight
                    </p>
                  </div>
                  <p className="text-sm text-foreground m-0 leading-relaxed">
                    {item.shortSummary}
                  </p>
                </div>
              )}
              {item.answer && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
              {item.results?.length > 0 && (
                <div className="mt-3 pt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Sources</p>
                  {item.results.map((r: any, ri: number) => (
                    <SourceLink key={ri} result={r} />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
    )
  }

  const MarketSizing = () => {
    const { tam, sam, som } = SD.sizing

    const tiles = [
      {
        label: 'TAM', sub: 'Total Addressable Market', icon: <Globe size={28} />,
        gradient: 'from-blue-600 to-blue-400',
        size: tam.marketSize, summary: tam.ShortSummary
      },
      {
        label: 'SAM', sub: 'Serviceable Available Market', icon: <Target size={28} />,
        gradient: 'from-green-600 to-green-400',
        size: sam.marketSize, summary: sam.ShortSummary
      },
      {
        label: 'SOM', sub: 'Serviceable Obtainable Market', icon: <Rocket size={28} />,
        gradient: 'from-purple-600 to-purple-400',
        size: som.marketSize, summary: som.ShortSummary
      },
    ]

    return (
      <section className="mb-12">
        <SectionHeader icon={<PieChart size={22} />} title="Market Sizing" subtitle="Total Addressable Market breakdown" gradient />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiles.map((t) => (
            <StatCard
              key={t.label}
              label={t.sub}
              value={t.size || 'Data unavailable'}
              icon={t.icon}
              color={`bg-gradient-to-br ${t.gradient}`}
              subtext={t.summary}
            />
          ))}
        </div>
      </section>
    )
  }

  const SocialSentiment = () => {
    const platforms = [
      { key: 'reddit', label: 'Reddit', icon: <MessageCircle size={18} />, color: 'from-orange-600 to-orange-400' },
      { key: 'twitter', label: 'Twitter / X', icon: <FaXTwitter size={18} />, color: 'from-black to-gray-700' },
      { key: 'youtube', label: 'YouTube', icon: <Play size={18} />, color: 'from-red-600 to-red-400' },
      { key: 'quora', label: 'Quora', icon: <Users size={18} />, color: 'from-red-700 to-red-500' },
      { key: 'instagram', label: 'Instagram', icon: <Heart size={18} />, color: 'from-pink-600 to-pink-400' },
    ]

    const has = platforms.filter(p => SD.social[p.key]?.length > 0)
    if (!has.length) return null

    return (
      <section className="mb-12">
        <SectionHeader icon={<MessageCircle size={22} />} title="Social Sentiment Analysis" subtitle="Cross-platform audience insights" gradient />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {has.map(p => {
            const d = SD.social[p.key][0]
            return (
              <div key={p.key} className={`bg-gradient-to-br ${p.color} rounded-2xl p-5 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    {p.icon}
                  </div>
                  <span className="text-sm font-semibold text-white">{p.label}</span>
                </div>
                <p className="text-sm text-white/90 m-0 leading-relaxed">
                  {d.shortSummary || d.answer || 'No data available'}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  const PainPoints = () => {
    const { painPoints = [], rootCauses = [], impact, ShortSummary } = SD.pain
    if (!painPoints.length && !impact) return null

    return (
      <section className="mb-12">
        <SectionHeader icon={<AlertCircle size={22} />} title="Customer Pain Points" subtitle="Key challenges and opportunities" gradient />

        {ShortSummary && (
          <div className="bg-gradient-to-r from-tertiary/10 to-transparent border-l-4 border-tertiary rounded-r-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Quote size={20} className="text-tertiary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground m-0 leading-relaxed italic">
                {ShortSummary}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painPoints.length > 0 && (
            <Card className="bg-gradient-to-br from-tertiary/5 to-transparent border-tertiary/20">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown size={18} className="text-tertiary" />
                <p className="text-sm font-bold uppercase tracking-wide text-tertiary m-0">
                  Identified Pain Points
                </p>
              </div>
              <ul className="m-0 space-y-2">
                {painPoints.map((pt: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-tertiary mt-1">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {rootCauses.length > 0 && (
            <Card className="bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} className="text-secondary" />
                <p className="text-sm font-bold uppercase tracking-wide text-secondary m-0">
                  Root Causes Analysis
                </p>
              </div>
              <ul className="m-0 space-y-2">
                {rootCauses.map((rc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-secondary mt-1">•</span>
                    <span>{rc}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {impact && (
          <Card className="mt-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <TrendingUp size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1 m-0">
                  Business Impact Assessment
                </p>
                <p className="text-sm text-foreground m-0 leading-relaxed">
                  {impact}
                </p>
              </div>
            </div>
          </Card>
        )}
      </section>
    )
  }

  const StartupSection = () => {
    const { validation, ai, funding } = SD.startup
    const tiles = [
      { data: validation, label: 'Startup Validation', icon: <Lightbulb size={24} />, gradient: 'from-yellow-600 to-orange-500' },
      { data: ai, label: 'AI Opportunities', icon: <Sparkles size={24} />, gradient: 'from-blue-600 to-cyan-500' },
      { data: funding, label: 'Funding Landscape', icon: <DollarSign size={24} />, gradient: 'from-green-600 to-emerald-500' },
    ].filter(t => t.data?.length > 0)

    if (!tiles.length) return null

    return (
      <section className="mb-12">
        <SectionHeader icon={<Building2 size={22} />} title="Startup Ecosystem Analysis" subtitle="Validation, opportunities, and funding landscape" gradient />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {tiles.map(t => (
            <div key={t.label} className={`bg-gradient-to-br ${t.gradient} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
              <div className="mb-3">{t.icon}</div>
              <p className="text-lg font-bold mb-2">{t.label}</p>
              <p className="text-sm text-white/90 leading-relaxed">
                {t.data[0].shortSummary || t.data[0].answer || 'No data available'}
              </p>
            </div>
          ))}
        </div>

        {/* Show all sources directly */}
        {tiles.map(t => (
          t.data.length > 0 && t.data[0].results?.length > 0 && (
            <div key={`sources-${t.label}`} className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={16} className="text-primary" />
                <p className="text-sm font-semibold text-foreground">{t.label} — Research Sources</p>
              </div>
              {t.data[0].results.map((r: any, i: number) => <SourceLink key={i} result={r} />)}
            </div>
          )
        ))}
      </section>
    )
  }

  const SWOTSection = () => {
    const { Strengths = [], Weaknesses = [], Opportunities = [], Threats = [], ShortSummary } = SD.swot
    if (!Strengths.length && !Weaknesses.length && !Opportunities.length && !Threats.length) return null

    const quadrants = [
      { label: 'Strengths', items: Strengths, gradient: 'from-green-600 to-green-500', icon: <Crown size={18} /> },
      { label: 'Weaknesses', items: Weaknesses, gradient: 'from-red-600 to-red-500', icon: <AlertCircle size={18} /> },
      { label: 'Opportunities', items: Opportunities, gradient: 'from-blue-600 to-blue-500', icon: <TrendingUp size={18} /> },
      { label: 'Threats', items: Threats, gradient: 'from-orange-600 to-orange-500', icon: <Zap size={18} /> },
    ].filter(q => q.items.length > 0)

    return (
      <section className="mb-12">
        <SectionHeader icon={<Shield size={22} />} title="SWOT Analysis" subtitle="Strategic positioning and competitive assessment" gradient />
        {ShortSummary && (
          <Card className="mb-6 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Quote size={16} className="text-primary" />
              </div>
              <p className="text-sm text-foreground m-0 leading-relaxed">{ShortSummary}</p>
            </div>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quadrants.map(q => (
            <div key={q.label} className={`bg-gradient-to-br ${q.gradient} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center gap-2 mb-4">
                {q.icon}
                <p className="text-sm font-bold uppercase tracking-wide m-0">
                  {q.label}
                </p>
              </div>
              <ul className="m-0 space-y-2">
                {q.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/90 leading-relaxed">
                    <span className="text-white/60">▹</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 print:py-4 print:px-0">
      <h2 className="sr-only">Market research report — {SD.meta.originalRequest}</h2>

      <CoverPage />

      {/* Executive summary */}
      {SD.meta.originalRequest && (
        <Card className="mb-10 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shrink-0 shadow-lg">
              <BookOpen size={20} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-foreground mb-2 m-0 flex items-center gap-2">
                Executive Summary
                <span className="text-xs font-normal text-muted-foreground">Strategic Overview</span>
              </p>
              <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                {SD.meta.originalRequest}
              </p>
            </div>
          </div>
        </Card>
      )}

      <ResearchSection
        items={SD.market.marketResearch}
        title="Market Research"
        icon={<TrendingUp size={20} />}
        subtitle="Market size, growth, and key dynamics"
      />

      <ResearchSection
        items={SD.market.competitorResearch}
        title="Competitor Analysis"
        icon={<Users size={20} />}
        subtitle="Competitive landscape and vendor positioning"
      />

      <ResearchSection
        items={SD.market.pricingResearch}
        title="Pricing Strategy"
        icon={<DollarSign size={20} />}
        subtitle="Pricing models, tiers, and benchmarks"
      />

      <ResearchSection
        items={SD.market.trendResearch}
        title="Market Trends"
        icon={<GraduationCap size={20} />}
        subtitle="Emerging technology and sector trends"
      />

      <MarketSizing />

      <SocialSentiment />

      <PainPoints />

      <StartupSection />

      <SWOTSection />

      {/* Footer */}
      <div className="text-center pt-10 pb-6 border-t border-border mt-8">
        <div className="flex justify-center gap-2 mb-3">
          <div className="w-1 h-1 rounded-full bg-primary" />
          <div className="w-1 h-1 rounded-full bg-secondary" />
          <div className="w-1 h-1 rounded-full bg-tertiary" />
        </div>
        <p className="text-xs text-muted-foreground m-0">
          © {new Date().getFullYear()} Direction AI Research Platform — Confidential & Proprietary
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1 m-0">
          Generated by Direction AI • Data-driven insights for strategic decisions
        </p>
      </div>
    </div>
  )
}

export default ResearchReportRenderer