import { apiClient } from './axios';
import { PageResponse } from '@/types/transactions.types';
import { WorkPositive, WorkPositiveRequest } from '@/types/work.types';

export const workPositivesApi = {
  list: async (page = 0, size = 20): Promise<PageResponse<WorkPositive>> => {
    const res = await apiClient.get<PageResponse<WorkPositive>>('/api/conference/positives', {
      params: { page, size },
    });
    return res.data;
  },

  getById: async (id: number): Promise<WorkPositive> => {
    const res = await apiClient.get<WorkPositive>(`/api/conference/positives/${id}`);
    return res.data;
  },

  create: async (data: WorkPositiveRequest): Promise<WorkPositive> => {
    const res = await apiClient.post<WorkPositive>('/api/conference/positives', data);
    return res.data;
  },

  update: async (id: number, data: WorkPositiveRequest): Promise<WorkPositive> => {
    const res = await apiClient.put<WorkPositive>(`/api/conference/positives/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/positives/${id}`);
  },
};
