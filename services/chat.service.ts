import api from './api';
import {
  ChatReport,
  ChatSession,
  ChatSessionSummaryResponse,
  ChatUsageResponse,
  DirectionAiReplyResponse,
  ProjectEntitlement,
} from '@/types/chat';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const chatService = {
  async createSession(payload: { idea: string; title?: string }) {
    const { data } = await api.post<ChatSession>('/chat/sessions', payload);
    return data;
  },

  async listSessions() {
    const { data } = await api.get<ChatSession[]>('/chat/sessions');
    return data;
  },

  async getEntitlement() {
    const { data } = await api.get<ProjectEntitlement>('/chat/entitlement');
    return data;
  },

  async listSessionSummaries(params?: { search?: string; page?: number; limit?: number }) {
    const { data } = await api.get<ChatSessionSummaryResponse>('/chat/sessions/summary', {
      params,
    });
    return data;
  },

  async getSession(chatId: string) {
    const { data } = await api.get<ChatSession>(`/chat/sessions/${chatId}`);
    return data;
  },

  async runAgents(chatId: string, agentTypes: string[]) {
    const { data } = await api.post<ChatSession>(`/chat/sessions/${chatId}/run`, { agentTypes });
    return data;
  },

  async sendMessage(chatId: string, message: string) {
    const { data } = await api.post<DirectionAiReplyResponse>(`/chat/sessions/${chatId}/message`, {
      message,
    });
    return data;
  },

  async listReports(chatId: string) {
    const { data } = await api.get<ChatReport[]>(`/chat/sessions/${chatId}/reports`);
    return data;
  },

  async getRunResult(chatId: string, runId: string) {
    const { data } = await api.get(`/chat/sessions/${chatId}/runs/${runId}`);
    return data;
  },

  async getUsage(chatId: string) {
    const { data } = await api.get<ChatUsageResponse>(`/chat/sessions/${chatId}/usage`);
    return data;
  },

  createStream(chatId: string, accessToken: string) {
    const url = `${baseURL}/chat/sessions/${chatId}/stream?token=${encodeURIComponent(accessToken)}`;
    return new EventSource(url);
  },

  async downloadReport(chatId: string, runId: string) {
    const response = await api.get(`/chat/sessions/${chatId}/reports/${runId}/download`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};
