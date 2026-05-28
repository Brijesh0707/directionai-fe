export type ChatSessionStatus = 'draft' | 'running' | 'completed' | 'failed';
export type AgentRunStatus = 'queued' | 'running' | 'completed' | 'failed';

export type AgentRun = {
  id: string;
  chatSessionId: string;
  agentType: string;
  status: AgentRunStatus;
  startedAt?: string | null;
  finishedAt?: string | null;
  resultJson?: unknown;
  memorySummary?: string;
  errorMessage?: string | null;
  reportPath?: string | null;
  reportName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DirectionAiConversationItem = {
  role: 'user' | 'assistant';
  kind: 'intake' | 'clarification' | 'recommendation' | 'reply' | 'summary';
  content: string;
  createdAt: string;
};

export type DirectionAiMemory = {
  rawIdea?: string;
  project: {
    name: string;
    category: string;
    description: string;
    businessType?: string;
    audience?: string;
    objective?: string;
    recommendedFirstAgent?: string;
    recommendationReason?: string;
    confidence?: number;
  };
  conversation: DirectionAiConversationItem[];
  pendingQuestions: string[];
  agentSummaries: Record<string, string>;
  lastUpdatedAt: string;
};

export type ChatSession = {
  id: string;
  userId: string;
  rawIdea?: string | null;
  title: string;
  idea: string;
  projectCategory?: string | null;
  recommendedFirstAgent?: string | null;
  memoryJson?: DirectionAiMemory | null;
  status: ChatSessionStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  agentRuns: AgentRun[];
};

export type ChatStreamEvent = {
  type: 'session' | 'agent';
  chatId: string;
  message: string;
  progress: number;
  status: string;
  agentType?: string;
  runId?: string;
  timestamp: string;
};

export type ChatReport = {
  runId: string;
  agentType: string;
  reportName?: string | null;
  hasDownload: boolean;
  hasJson: boolean;
  createdAt: string;
};

export type DirectionAiReplyResponse = {
  message: string;
  session: ChatSession;
};

export type ChatSessionSummary = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type ChatSessionSummaryResponse = {
  items: ChatSessionSummary[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type AiCallUsage = {
  id: string;
  chatSessionId?: string | null;
  agentRunId?: string | null;
  agentType?: string | null;
  callLabel?: string | null;
  provider: string;
  requestedModelName?: string | null;
  finalModelName: string;
  status: string;
  inputTokens?: number | null;
  outputTokens?: number | null;
  totalTokens?: number | null;
  latencyMs?: number | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TavilyUsage = {
  id: string;
  chatSessionId?: string | null;
  agentRunId?: string | null;
  agentType?: string | null;
  callLabel?: string | null;
  query: string;
  searchDepth: string;
  topic?: string | null;
  maxResults?: number | null;
  includeAnswer?: boolean | null;
  includeRawContent?: boolean | null;
  includeImages?: boolean | null;
  creditsUsed: number;
  resultCount?: number | null;
  status: string;
  latencyMs?: number | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChatUsageResponse = {
  chatId: string;
  totals: {
    ai: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      calls: number;
    };
    tavily: {
      creditsUsed: number;
      calls: number;
    };
  };
  aiCalls: AiCallUsage[];
  tavilyUsages: TavilyUsage[];
};

export type ProjectEntitlement = {
  planTier: 'free' | 'project_bundle';
  freeProjectsIncluded: number;
  projectsCreated: number;
  paidCreditsRemaining: number;
  remainingProjects: number;
  canCreateProject: boolean;
  note: string;
};
