//@ts-nocheck
import React from 'react'
import { 
  TrendingUp, Users, DollarSign, Target, Globe, 
  Heart, AlertCircle, Zap, Shield, BarChart3,
  Play, MessageCircle, 
  Building2, Lightbulb, PieChart, BookOpen,
  GraduationCap, Rocket, Award, ChevronRight, Camera
} from 'lucide-react'

const ResearchReportRenderer = ({ payload }: any) => {
  const ParseData = JSON.parse(payload?.mergedResponse)
  console.log("Payload in ResearchReportRenderer: ", ParseData)

  const StructureData = {
    researchMetadata: {
      originalRequest: ParseData?.researchMetadata?.originalRequest || "",
    },

    marketResearchData: {
      marketResearch: ParseData?.marketResearchData?.marketResearch?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results?.map((result: any) => ({
          title: result?.title || "",
          content: result?.content || "",
          url: result?.url || "",
          snippet: result?.snippet || "",
          source: result?.source || "",
        })) || [],
        images: item?.images || [],
      })) || [],

      competitorResearch: ParseData?.marketResearchData?.competitorResearch?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results?.map((result: any) => ({
          title: result?.title || "",
          content: result?.content || "",
          url: result?.url || "",
          snippet: result?.snippet || "",
          source: result?.source || "",
        })) || [],
        images: item?.images || [],
      })) || [],

      pricingResearch: ParseData?.marketResearchData?.pricingResearch?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results?.map((result: any) => ({
          title: result?.title || "",
          content: result?.content || "",
          url: result?.url || "",
          snippet: result?.snippet || "",
          source: result?.source || "",
        })) || [],
        images: item?.images || [],
      })) || [],

      trendResearch: ParseData?.marketResearchData?.trendResearch?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results?.map((result: any) => ({
          title: result?.title || "",
          content: result?.content || "",
          url: result?.url || "",
          snippet: result?.snippet || "",
          source: result?.source || "",
        })) || [],
        images: item?.images || [],
      })) || [],
    },

    marketSizingData: {
      tam: ParseData?.marketSizingData?.tam?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      sam: ParseData?.marketSizingData?.sam?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      som: ParseData?.marketSizingData?.som?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
    },

    socialSentimentData: {
      reddit: ParseData?.socialSentimentData?.reddit?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      youtube: ParseData?.socialSentimentData?.youtube?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      quora: ParseData?.socialSentimentData?.quora?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      twitter: ParseData?.socialSentimentData?.twitter?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      instagram: ParseData?.socialSentimentData?.instagram?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      allPlatformsCombined: ParseData?.socialSentimentData?.allPlatformsCombined?.data || {},
    },

    customerInsightsData: {
      painPoints: ParseData?.customerInsightsData?.painPoints?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
    },

    startupData: {
      startupValidation: ParseData?.startupData?.startupValidation?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      aiStartupResearch: ParseData?.startupData?.aiStartupResearch?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
      fundingResearch: ParseData?.startupData?.fundingResearch?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
    },

    strategicAnalysisData: {
      swot: ParseData?.strategicAnalysisData?.swot?.data?.map((item: any) => ({
        answer: item?.answer || "",
        query: item?.query || "",
        results: item?.results || [],
        images: item?.images || [],
      })) || [],
    },
  }

  const renderCoverPage = () => (
    <div className="gradient-primary rounded-2xl p-12 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        <div className="inline-flex p-4 bg-white/20 rounded-full mb-6">
          <BarChart3 size={48} />
        </div>
        <h1 className="text-5xl font-bold mb-4">Market Research Report</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          {StructureData.researchMetadata.originalRequest || 'Comprehensive Market Analysis Report'}
        </p>
        <div className="flex justify-center gap-6 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} />
            <span>Direction AI Research</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span>Data-Driven Insights</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSectionHeader = (icon: React.ReactNode, title: string, subtitle: string) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-muted-foreground ml-12">{subtitle}</p>
      <div className="h-1 w-20 bg-primary rounded-full mt-3 ml-12"></div>
    </div>
  )

  const renderResearchSection = (data: any[], title: string, icon: React.ReactNode) => {
    if (!data || data.length === 0) return null
    
    return (
      <div className="mb-12">
        {renderSectionHeader(icon, title, "Key findings and insights from comprehensive research")}
        <div className="space-y-6">
          {data.map((item, idx) => (
            <div key={idx} className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all">
              {item.query && (
                <div className="bg-primary/5 p-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <ChevronRight size={18} />
                    {item.query}
                  </h3>
                </div>
              )}
              <div className="p-5">
                {item.answer && (
                  <p className="text-foreground leading-relaxed mb-4">{item.answer}</p>
                )}
                {item.results && item.results.length > 0 && (
                  <div className="grid gap-3 mt-4">
                    {item.results.slice(0, 2).map((result: any, ridx: number) => (
                      <a 
                        key={ridx}
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors group"
                      >
                        <p className="font-medium text-primary group-hover:underline text-sm">
                          {result.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.snippet?.substring(0, 150) || result.content?.substring(0, 150)}...
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMarketSizing = () => {
    const { tam, sam, som } = StructureData.marketSizingData
    
    return (
      <div className="mb-12">
        {renderSectionHeader(<PieChart size={24} />, "Market Sizing", "Total Addressable Market, Serviceable Available Market, Serviceable Obtainable Market")}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-6 border border-blue-200 dark:border-blue-900">
            <Globe className="text-blue-600 dark:text-blue-400 mb-3" size={32} />
            <h3 className="text-xl font-bold mb-2">TAM</h3>
            <p className="text-sm text-muted-foreground">Total Addressable Market</p>
            {tam[0]?.answer && <p className="mt-3 text-lg font-semibold text-blue-600 dark:text-blue-400">{tam[0].answer}</p>}
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-200 dark:border-purple-900">
            <Target className="text-purple-600 dark:text-purple-400 mb-3" size={32} />
            <h3 className="text-xl font-bold mb-2">SAM</h3>
            <p className="text-sm text-muted-foreground">Serviceable Available Market</p>
            {sam[0]?.answer && <p className="mt-3 text-lg font-semibold text-purple-600 dark:text-purple-400">{sam[0].answer}</p>}
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-200 dark:border-green-900">
            <Rocket className="text-green-600 dark:text-green-400 mb-3" size={32} />
            <h3 className="text-xl font-bold mb-2">SOM</h3>
            <p className="text-sm text-muted-foreground">Serviceable Obtainable Market</p>
            {som[0]?.answer && <p className="mt-3 text-lg font-semibold text-green-600 dark:text-green-400">{som[0].answer}</p>}
          </div>
        </div>
      </div>
    )
  }

  const renderSocialSentiment = () => {
    const platforms = [
      { key: 'twitter', name: 'Twitter', icon: <Twitter size={20} />, color: 'text-sky-500' },
      { key: 'youtube', name: 'YouTube', icon: <Play size={20} />, color: 'text-red-500' },
      { key: 'instagram', name: 'Instagram', icon: <MessageCircle size={20} />, color: 'text-pink-500' },
      { key: 'reddit', name: 'Reddit', icon: <MessageCircle size={20} />, color: 'text-orange-500' },
      { key: 'quora', name: 'Quora', icon: <Users size={20} />, color: 'text-red-600' },
    ]
    
    return (
      <div className="mb-12">
        {renderSectionHeader(<Heart size={24} />, "Social Sentiment Analysis", "Cross-platform audience insights and engagement metrics")}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map(platform => {
            const data = StructureData.socialSentimentData[platform.key as keyof typeof StructureData.socialSentimentData]
            if (!data || data.length === 0) return null
            
            return (
              <div key={platform.key} className="glass-card rounded-xl p-5 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${platform.color}`}>{platform.icon}</div>
                  <h3 className="font-bold text-lg">{platform.name}</h3>
                </div>
                {data[0]?.answer && (
                  <p className="text-sm text-muted-foreground ">
                    {data[0].answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderPainPoints = () => {
    const painPoints = StructureData.customerInsightsData.painPoints
    
    return (
      <div className="mb-12">
        {renderSectionHeader(<AlertCircle size={24} />, "Customer Pain Points", "Key challenges and opportunities in the market")}
        <div className="grid gap-4">
          {painPoints.map((item, idx) => (
            <div key={idx} className="gradient-danger rounded-xl p-5 text-white">
              {item.query && <h3 className="font-semibold mb-2 flex items-center gap-2"><AlertCircle size={18} /> {item.query}</h3>}
              {item.answer && <p className="text-white/90 text-sm leading-relaxed">{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderStartupSection = () => {
    const { startupValidation, aiStartupResearch, fundingResearch } = StructureData.startupData
    
    return (
      <div className="mb-12">
        {renderSectionHeader(<Building2 size={24} />, "Startup Ecosystem Analysis", "Validation, opportunities, and funding landscape")}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {startupValidation.length > 0 && (
            <div className="glass-card rounded-xl p-5">
              <Lightbulb className="text-yellow-500 mb-3" size={28} />
              <h3 className="font-bold mb-2">Startup Validation</h3>
              <p className="text-sm text-muted-foreground">{startupValidation[0]?.answer?.substring(0, 150)}...</p>
            </div>
          )}
          {aiStartupResearch.length > 0 && (
            <div className="glass-card rounded-xl p-5">
              <Zap className="text-purple-500 mb-3" size={28} />
              <h3 className="font-bold mb-2">AI Opportunities</h3>
              <p className="text-sm text-muted-foreground">{aiStartupResearch[0]?.answer?.substring(0, 150)}...</p>
            </div>
          )}
          {fundingResearch.length > 0 && (
            <div className="glass-card rounded-xl p-5">
              <DollarSign className="text-green-500 mb-3" size={28} />
              <h3 className="font-bold mb-2">Funding Landscape</h3>
              <p className="text-sm text-muted-foreground">{fundingResearch[0]?.answer?.substring(0, 150)}...</p>
            </div>
          )}
        </div>
      </div>
    )
  }

const renderSWOT = () => {
  const swotData = StructureData?.strategicAnalysisData?.swot || []

  if (swotData.length === 0) return null

  const formatContent = (content: string) => {
    if (!content) return "No content available"

    return content
      .replace(/#{1,6}\s?/g, "")
      .replace(/\*\*/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  }

  const highlightKeywords = (text: string) => {
    const keywords = [
      "strength",
      "weakness",
      "opportunity",
      "threat",
      "growth",
      "market",
      "competitive",
      "strategy",
      "advantage",
      "risk",
      "customer",
      "AI",
      "automation",
      "revenue",
      "scalable",
      "startup",
    ]

    let highlightedText = text

    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi")

      highlightedText = highlightedText.replace(
        regex,
        `<span class="text-primary font-semibold">$1</span>`
      )
    })

    return highlightedText
  }

  return (
    <div className="mb-12">
      {renderSectionHeader(
        <TrendingUp size={24} />,
        "SWOT Analysis",
        "Strategic positioning and competitive assessment"
      )}

      <div className="space-y-8">
        {swotData.map((item: any, index: number) => {
          const results = item?.results || []

          return (
            <div
              key={index}
              className="
                relative overflow-hidden
                rounded-3xl
                border border-border/60
                bg-gradient-to-br from-background to-muted/20
                backdrop-blur-xl
                shadow-xl
              "
            >
              {/* Top Glow */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="
                    h-14 w-14 rounded-2xl
                    bg-primary/10
                    flex items-center justify-center
                    border border-primary/20
                  ">
                    <TrendingUp
                      size={28}
                      className="text-primary"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      SWOT Strategic Analysis
                    </h2>

                    <p className="text-muted-foreground text-sm mt-1">
                      Market positioning, opportunities, risks & competitive intelligence
                    </p>
                  </div>
                </div>

                {/* Query */}
                {item?.query && (
                  <div className="
                    mb-8 rounded-2xl
                    border border-primary/20
                    bg-primary/5
                    p-5
                  ">
                    <div className="flex items-center gap-2 mb-2">
                      <Target
                        size={18}
                        className="text-primary"
                      />

                      <h3 className="font-semibold text-primary">
                        Research Query
                      </h3>
                    </div>

                    <p className="text-sm leading-7 text-muted-foreground whitespace-pre-line">
                      {item.query}
                    </p>
                  </div>
                )}

                {/* AI Summary */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3
                      size={18}
                      className="text-primary"
                    />

                    <h3 className="font-semibold text-lg">
                      Strategic Summary
                    </h3>
                  </div>

                  <div className="
                    rounded-2xl
                    border border-border/60
                    bg-card/50
                    p-6
                  ">
                    <div
                      className="
                        text-[15px]
                        leading-8
                        text-muted-foreground
                        prose prose-invert max-w-none
                      "
                      dangerouslySetInnerHTML={{
                        __html: highlightKeywords(
                          formatContent(item?.answer || "")
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Sources */}
                {results.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <BookOpen
                        size={18}
                        className="text-primary"
                      />

                      <h3 className="font-semibold text-lg">
                        Research Sources
                      </h3>
                    </div>

                    <div className="grid gap-5">
                      {results.map(
                        (result: any, resultIndex: number) => (
                          <div
                            key={resultIndex}
                            className="
                              group
                              rounded-2xl
                              border border-border/60
                              bg-card/40
                              p-6
                              hover:border-primary/40
                              hover:bg-card/70
                              transition-all
                              duration-300
                            "
                          >
                            {/* Source Header */}
                            <div className="
                              flex flex-col md:flex-row
                              md:items-start
                              md:justify-between
                              gap-4
                              mb-5
                            ">
                              <div>
                                <h4 className="
                                  text-lg font-semibold
                                  leading-7
                                  group-hover:text-primary
                                  transition-colors
                                ">
                                  {result?.title || "Untitled"}
                                </h4>

                                {result?.source && (
                                  <div className="
                                    inline-flex mt-3
                                    items-center gap-2
                                    rounded-full
                                    bg-primary/10
                                    px-3 py-1
                                    text-xs font-medium
                                    text-primary
                                  ">
                                    <Globe size={12} />
                                    {result.source}
                                  </div>
                                )}
                              </div>

                              {result?.url && (
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="
                                    inline-flex items-center gap-2
                                    rounded-xl
                                    border border-primary/20
                                    bg-primary/10
                                    px-4 py-2
                                    text-sm font-medium
                                    text-primary
                                    hover:bg-primary
                                    hover:text-white
                                    transition-all
                                  "
                                >
                                  Visit Source
                                  <ChevronRight size={16} />
                                </a>
                              )}
                            </div>

                            {/* Content */}
                            <div
                              className="
                                text-sm
                                leading-7
                                text-muted-foreground
                                whitespace-pre-line
                              "
                              dangerouslySetInnerHTML={{
                                __html: highlightKeywords(
                                  formatContent(
                                    result?.content ||
                                      result?.snippet ||
                                      "No content available"
                                  )
                                ),
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

  // Import missing icons
  const Calendar = ({ size, className }: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>

  const Twitter = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.5 4.5 0 0 0 12.07 6v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5A4.5 4.5 0 0 0 23 3z" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Cover Page */}
        {renderCoverPage()}
        
        {/* Executive Summary / Original Request */}
        <div className="glass-card rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Executive Summary</h2>
              <p className="text-muted-foreground leading-relaxed">
                {StructureData.researchMetadata.originalRequest || "Comprehensive market research report providing strategic insights and actionable recommendations."}
              </p>
            </div>
          </div>
        </div>

        {/* Market Research Section */}
        {renderResearchSection(StructureData.marketResearchData.marketResearch, "Market Research", <TrendingUp size={24} />)}
        
        {/* Competitor Research */}
        {renderResearchSection(StructureData.marketResearchData.competitorResearch, "Competitor Analysis", <Users size={24} />)}
        
        {/* Pricing Research */}
        {renderResearchSection(StructureData.marketResearchData.pricingResearch, "Pricing Strategy", <DollarSign size={24} />)}
        
        {/* Trend Research */}
        {renderResearchSection(StructureData.marketResearchData.trendResearch, "Market Trends", <GraduationCap size={24} />)}
        
        {/* Market Sizing */}
        {renderMarketSizing()}
        
        {/* Social Sentiment */}
        {renderSocialSentiment()}
        
        {/* Customer Pain Points */}
        {renderPainPoints()}
        
        {/* Startup Section */}
        {renderStartupSection()}
        
        {/* SWOT Analysis */}
        {renderSWOT()}
        
        {/* Footer */}
        <div className="text-center pt-8 pb-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Direction AI Research Platform — Confidential & Proprietary
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResearchReportRenderer