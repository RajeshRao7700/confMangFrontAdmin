import { apiClient } from './axios';
import { PageResponse } from '@/types/transactions.types';
import { WorkReport, WorkReportRequest } from '@/types/work.types';

export const workReportsApi = {
  list: async (page = 0, size = 20): Promise<PageResponse<WorkReport>> => {
    const res = await apiClient.get<PageResponse<WorkReport>>('/api/conference/work-reports', {
      params: { page, size },
    });
    return res.data;
  },

  getById: async (id: number): Promise<WorkReport> => {
    const res = await apiClient.get<WorkReport>(`/api/conference/work-reports/${id}`);
    return res.data;
  },

  create: async (data: WorkReportRequest): Promise<WorkReport> => {
    const res = await apiClient.post<WorkReport>('/api/conference/work-reports', data);
    return res.data;
  },

  update: async (id: number, data: WorkReportRequest): Promise<WorkReport> => {
    const res = await apiClient.put<WorkReport>(`/api/conference/work-reports/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/work-reports/${id}`);
  },
};
