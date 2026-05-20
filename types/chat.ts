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

export type ChatSession = {
  id: string;
  userId: string;
  title: string;
  idea: string;
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
