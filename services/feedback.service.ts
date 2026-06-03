import api from './api';

export interface CreateBugReportRequest {
  message: string;
  attachmentUrl?: string;
}

export interface BugReport {
  id: string;
  message: string;
  status: string;
  createdAt: string;
}

export const feedbackService = {
  async createBugReport(data: CreateBugReportRequest): Promise<BugReport> {
    const response = await api.post('/feedback/bug', data);
    return response.data;
  },

  async listBugReports(): Promise<BugReport[]> {
    const response = await api.get('/feedback/bugs');
    return response.data;
  },
};
